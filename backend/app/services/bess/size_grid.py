"""量體：負載樣本統計、配置組合、推薦。"""

import math
from typing import Any

import pandas as pd

from app.services.billing.demand import bill_mode
from app.services.billing.overage import overage_ceiling
from app.services.contracts import ContractCapacity
from app.services.cleaning.formats.tpc import enrich_interval_end
from app.services import settings as settings_svc
from app.services.schedule import (
    build_context,
    default_intraday_off_peak_hours,
    hours_per_data_row,
    intraday_off_peak_hours,
    tou_slot_minutes,
)


def peak_hours_max(tou_type: str, schedule: dict | None = None) -> int:
    """試算方案單日尖峰時段上限（小時，至少 1）。"""
    sched = schedule if schedule is not None else settings_svc.default_schedule()
    ctx = build_context(tou_type, schedule=sched)
    slot_h = tou_slot_minutes(sched, tou_type) / 60.0
    best = 0
    for sea in ("summer", "non_summer"):
        mat = ctx["matrix"][sea]
        for wd in range(mat.shape[0]):
            n = int((mat[wd] == "peak").sum())
            best = max(best, n)
    hours = max(1, int(round(best * slot_h)))
    if best * slot_h > hours and best * slot_h > hours + 1e-9:
        hours = max(1, math.ceil(best * slot_h))
    return hours


GRID_HOURS_MIN = 2


def _peak_kw_series(df: pd.DataFrame) -> pd.Series:
    """尖峰時段需量（夏／非夏皆含，period==peak）。"""
    if df.empty or "period" not in df.columns:
        return pd.Series(dtype=float)
    return df.loc[df["period"] == "peak", "kW"].astype(float)


def peak_ess_util_pct(df: pd.DataFrame, pcs_kw: float) -> float | None:
    """尖峰儲能使用率：mean(min(需量÷PCS, 1))×100%，上限 100%。"""
    peak = _peak_kw_series(df)
    if pcs_kw <= 0 or peak.empty:
        return None
    return round(float((peak / pcs_kw).clip(upper=1.0).mean() * 100.0), 1)


def peak_coverage_pct(df: pd.DataFrame, pcs_kw: float) -> float | None:
    """尖峰負載覆蓋率：mean(min(PCS÷需量, 1))×100%，上限 100%。"""
    peak = _peak_kw_series(df)
    if pcs_kw <= 0 or peak.empty:
        return None
    safe = peak.clip(lower=1e-9)
    return round(float((pcs_kw / safe).clip(upper=1.0).mean() * 100.0), 1)


def _tier_pct_map(
    df: pd.DataFrame,
    pcs_sample: dict[str, float],
    fn,
) -> dict[str, float]:
    """各 PCS 檔位套用利用率／覆蓋率。"""
    out: dict[str, float] = {}
    for tier, raw in pcs_sample.items():
        pcs = float(raw or 0)
        if pcs <= 0:
            continue
        pct = fn(df, pcs)
        if pct is not None:
            out[str(tier)] = pct
    return out


def combination_grid(
    pcs_list: list[float],
    peak_h: int,
    *,
    pcs_hours: dict[float, int] | None = None,
    pcs_hours_min: dict[float, int] | None = None,
    min_h: int = GRID_HOURS_MIN,
) -> list[tuple[float, float]]:
    """pcs × min_h..peak_h 小時；可逐 pcs 指定上下限。"""
    default_h = max(min_h, int(peak_h))
    grid: list[tuple[float, float]] = []
    seen: set[tuple[float, float]] = set()
    for pcs in pcs_list:
        key_pcs = round(pcs, 3)
        h_lo = max(1, int((pcs_hours_min or {}).get(key_pcs, min_h)))
        h_cap = max(h_lo, int((pcs_hours or {}).get(key_pcs, default_h)))
        for h in range(h_lo, h_cap + 1):
            key = (round(pcs, 3), round(pcs * h, 3))
            if key not in seen:
                seen.add(key)
                grid.append(key)
    return grid


def _monthly_avg(values: pd.Series, months: pd.Series) -> list[float]:
    if values.empty:
        return []
    frame = pd.DataFrame({"v": values.astype(float), "m": months})
    return [float(x) for x in frame.groupby("m", sort=True)["v"].mean().tolist()]


def _tier_stats(monthly: list[float]) -> dict[str, float]:
    if not monthly:
        return {"max": 0.0, "avg": 0.0, "min": 0.0}
    return {
        "max": float(max(monthly)),
        "avg": float(sum(monthly) / len(monthly)),
        "min": float(min(monthly)),
    }


def _min_tier(*tiers: dict[str, float]) -> dict[str, float]:
    out: dict[str, float] = {}
    for t in ("max", "avg", "min"):
        vals = [float(d[t]) for d in tiers if float(d.get(t) or 0) > 0]
        out[t] = min(vals) if vals else 0.0
    return out


def _two_cycle_sources(
    work: pd.DataFrame,
    months: pd.Series,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    schedule: dict | None,
) -> tuple[dict[str, dict[str, float]], float]:
    """兩充兩放來源統計與 PCS（非夏半尖峰 ∩ 離峰裕度，取跨月平均檔）。"""
    mid_h = (
        default_intraday_off_peak_hours(tou_type)
        if schedule is None
        else intraday_off_peak_hours(tou_type, schedule)
    )
    ns_hp = _period_monthly_stats(work, months, "half_peak", season="non_summer")
    ns_off_all = _off_margin_monthly(
        work, cap, tou_type, buffer_kw, season="non_summer"
    )
    ns_off_mid = _off_margin_monthly(
        work, cap, tou_type, buffer_kw, season="non_summer", hours=mid_h
    )
    pcs = _min_tier(ns_hp, ns_off_all, ns_off_mid)["avg"]
    return {
        "half_peak": ns_hp,
        "off_margin": ns_off_all,
        "mid_off_margin": ns_off_mid,
    }, pcs


def _period_monthly_stats(
    work: pd.DataFrame,
    months: pd.Series,
    period: str,
    *,
    season: str | None = None,
) -> dict[str, float]:
    rows = work.loc[work["period"] == period]
    if season is not None and "season" in rows.columns:
        rows = rows.loc[rows["season"] == season]
    return _tier_stats(_monthly_avg(rows["kW"], months.loc[rows.index]))


def _off_margin_monthly(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    season: str | None = None,
    hours: frozenset[int] | None = None,
) -> dict[str, float]:
    off = work.loc[work["period"] == "off_peak"]
    if season is not None and "season" in off.columns:
        off = off.loc[off["season"] == season]
    if hours is not None and "hour" in off.columns:
        off = off.loc[off["hour"].isin(hours)]
    margin_monthly: list[float] = []
    if len(off):
        off = off.copy()
        off["_month"] = pd.to_datetime(off["date"]).dt.strftime("%Y-%m")
        for month, grp in off.groupby("_month", sort=True):
            vals: list[float] = []
            for _, row in grp.iterrows():
                ceiling = overage_ceiling(
                    "off_peak",
                    cap,
                    tou_type,
                    bill_mode(str(month)),
                )
                vals.append(max(0.0, ceiling - float(row["kW"]) - float(buffer_kw)))
            if vals:
                margin_monthly.append(float(sum(vals) / len(vals)))
    return _tier_stats(margin_monthly)


def _full_cover_pcs(work: pd.DataFrame) -> tuple[float, dict[str, float]]:
    """全覆蓋 PCS：尖峰時段最大需量；電池小時仍走 2～尖峰時長。"""
    peak_rows = work.loc[work["period"] == "peak"]
    if peak_rows.empty:
        return 0.0, {}
    dt = hours_per_data_row()
    peak_kw = peak_rows["kW"].astype(float)
    pcs = float(peak_kw.max())
    daily_kwh = (peak_kw * dt).groupby(peak_rows["date"]).sum()
    max_day_kwh = float(daily_kwh.max()) if len(daily_kwh) else 0.0
    return round(pcs, 3), {
        "max_peak_kw": round(pcs, 3),
        "max_day_peak_kwh": round(max_day_kwh, 1),
        "pcs_kw": round(pcs, 3),
    }


def profile_stats(
    df: pd.DataFrame,
    contracts: ContractCapacity | dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
    schedule: dict | None = None,
) -> dict[str, Any]:
    """尖峰／離峰裕度統計；PCS 樣本含全覆蓋＋max/avg/min（＋兩充兩放）。"""
    cap = (
        contracts
        if isinstance(contracts, ContractCapacity)
        else ContractCapacity.from_dict(contracts)
    )
    work = df
    if work.empty or "period" not in work.columns or "date" not in work.columns:
        return {"ok": False, "reason": "missing period"}
    if "hour" not in work.columns:
        work = enrich_interval_end(work)

    months = pd.to_datetime(work["date"]).dt.strftime("%Y-%m")

    peak_stats = _period_monthly_stats(work, months, "peak")
    off_stats = _off_margin_monthly(work, cap, tou_type, buffer_kw)

    pcs_sample = _min_tier(peak_stats, off_stats)
    full_cover_kw, full_cover_src = _full_cover_pcs(work)
    if full_cover_kw > 0:
        # 全覆蓋置於樣本最前（dict 插入序）
        pcs_sample = {"full_cover": full_cover_kw, **pcs_sample}

    two_cycle_sources: dict[str, dict[str, float]] | None = None
    if tou_type == "ThreeStage":
        tc_src, tc_kw = _two_cycle_sources(
            work, months, cap, tou_type, buffer_kw, schedule
        )
        if tc_kw > 0:
            pcs_sample["two_cycle"] = tc_kw
            two_cycle_sources = tc_src

    out: dict[str, Any] = {
        "ok": True,
        "month_count": len(set(months)),
        "peak_load": peak_stats,
        "off_margin": off_stats,
        "pcs_sample": pcs_sample,
        "peak_ess_util": _tier_pct_map(work, pcs_sample, peak_ess_util_pct),
        "peak_coverage": _tier_pct_map(work, pcs_sample, peak_coverage_pct),
    }
    if full_cover_kw > 0:
        out["full_cover_sources"] = full_cover_src
    if two_cycle_sources is not None:
        out["two_cycle_sources"] = two_cycle_sources
    return out


def pcs_candidates_from_stats(stats: dict[str, Any]) -> list[float]:
    """PCS 樣本（full_cover／max／avg／min／two_cycle，去重、>0）。"""
    if not stats.get("ok"):
        return []
    raw = stats.get("pcs_sample") or {}
    keys: tuple[str, ...] = ("full_cover", "max", "avg", "min")
    if float(raw.get("two_cycle") or 0) > 0:
        keys = ("full_cover", "max", "avg", "min", "two_cycle")
    return sorted(
        {round(float(raw[k]), 3) for k in keys if float(raw.get(k) or 0) > 0}
    )


def fallback_grid(regular_kw: float) -> list[tuple[float, float]]:
    """profile 失敗時契約比例大網格。"""
    if regular_kw <= 0:
        regular_kw = 500.0
    grid: list[tuple[float, float]] = []
    for ratio in (0.05, 0.1, 0.15, 0.2, 0.3, 0.4):
        pcs = regular_kw * ratio
        for mult in (2, 2.5, 3, 3.5, 4):
            grid.append((round(pcs, 3), round(pcs * mult, 3)))
    return grid


def plan_sample_grid(
    df: pd.DataFrame,
    contracts: ContractCapacity | dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
    schedule: dict | None = None,
) -> dict[str, Any]:
    """負載樣本 → PCS 候選 → 配置組合（尚未 dispatch）。"""
    cap = (
        contracts
        if isinstance(contracts, ContractCapacity)
        else ContractCapacity.from_dict(contracts)
    )
    stats = profile_stats(
        df, cap, tou_type, buffer_kw=buffer_kw, schedule=schedule
    )
    peak_h = peak_hours_max(tou_type, schedule=schedule)
    # 兩充兩放與其他檔位相同：GRID_HOURS_MIN～尖峰時長；回傳鍵僅供 UI 顯示
    has_two_cycle = float((stats.get("pcs_sample") or {}).get("two_cycle") or 0) > 0

    pcs_list = pcs_candidates_from_stats(stats)
    if pcs_list:
        pairs = combination_grid(pcs_list, peak_h)
        sample_source = "profile"
    else:
        pairs = fallback_grid(cap.regular_kw)
        sample_source = "fallback"
        pcs_list = sorted({round(p, 3) for p, _ in pairs})

    combinations = [
        {
            "pcs_kw": pcs,
            "batt_kwh": batt,
            "hours": round(batt / pcs, 3) if pcs > 0 else 0,
        }
        for pcs, batt in pairs
    ]
    return {
        "profile_stats": stats,
        "peak_hours_max": peak_h,
        "two_cycle_hours_max": peak_h if has_two_cycle else None,
        "sample_source": sample_source,
        "combinations": combinations,
        "grid_points": len(combinations),
    }


def _pcs_util_score(row: dict[str, Any]) -> float:
    """使用效率（平均）：PCS 日均（夏／非夏）+ SOC 日循環（夏／非夏）；含空轉日，循環不封頂。"""
    vals = (
        float(row.get("pcs_daily_avg_pct_summer") or 0),
        float(row.get("pcs_daily_avg_pct_non_summer") or 0),
        float(row.get("daily_cycle_pct_summer") or 0),
        float(row.get("daily_cycle_pct_non_summer") or 0),
    )
    return sum(vals) / 4.0


def _eff_product(row: dict[str, Any]) -> float:
    """四項效率相乘：PCS日均夏／非夏 × SOC日循環夏／非夏。"""
    return (
        max(0.0, float(row.get("pcs_daily_avg_pct_summer") or 0))
        * max(0.0, float(row.get("pcs_daily_avg_pct_non_summer") or 0))
        * max(0.0, float(row.get("daily_cycle_pct_summer") or 0))
        * max(0.0, float(row.get("daily_cycle_pct_non_summer") or 0))
    )


def _smaller_size_tiebreak(row: dict[str, Any]) -> tuple[float, float]:
    """同分時優先較小電池，再較小 PCS。"""
    return (-float(row["batt_kwh"]), -float(row["pcs_kw"]))


def _row_key(row: dict[str, Any]) -> tuple[float, float]:
    return (round(float(row["pcs_kw"]), 3), round(float(row["batt_kwh"]), 3))


def _savings_pct(row: dict[str, Any], before_total: int) -> float:
    sav = float(row.get("savings") or 0)
    if before_total > 0:
        return 100.0 * sav / before_total
    return float(row.get("savings_pct") or 0)


def _savings_per_kwh(row: dict[str, Any]) -> float:
    """單位電容量節省（元／kWh 電池）；量體越小、同額節省越高。"""
    batt = float(row.get("batt_kwh") or 0)
    if batt <= 0:
        return 0.0
    return float(row.get("savings") or 0) / batt


def pick_results(
    rows: list[dict[str, Any]],
    *,
    before_total: int = 0,
) -> dict[str, Any]:
    """標記 grid。

    - 金額最大：只比 savings
    - 使用率最大：單位電容量節省（savings÷batt）；同分再比平均使用效率、較小量體
    - 推薦：四項效率相乘 × 總節省金額（任一项≈0 則整份偏低）
    """
    if not rows:
        return {
            "recommended": None,
            "best_effort": None,
            "max_util": None,
            "viable": False,
            "grid": [],
        }

    enriched: list[dict[str, Any]] = []
    for r in rows:
        row = dict(r)
        row["savings_pct"] = round(_savings_pct(row, before_total), 2)
        enriched.append(row)

    best_effort = max(
        enriched,
        key=lambda x: (float(x["savings"]), *_smaller_size_tiebreak(x)),
    )
    viable = float(best_effort["savings"]) > 0
    pool = [r for r in enriched if float(r["savings"]) > 0] if viable else list(enriched)

    max_util = max(
        pool,
        key=lambda x: (
            _savings_per_kwh(x),
            _pcs_util_score(x),
            *_smaller_size_tiebreak(x),
        ),
    )

    def _rec_joint(row: dict[str, Any]) -> tuple:
        score = _eff_product(row) * max(0.0, float(row["savings"]))
        return (score, float(row["savings"]), *_smaller_size_tiebreak(row))

    recommended = max(pool, key=_rec_joint) if viable else None

    be_key = _row_key(best_effort)
    util_key = _row_key(max_util)
    rec_key = _row_key(recommended) if recommended is not None else None

    annotated: list[dict[str, Any]] = []
    for row in enriched:
        key = _row_key(row)
        row["best_effort"] = key == be_key
        row["max_util"] = key == util_key
        row["recommended"] = rec_key is not None and key == rec_key
        annotated.append(row)

    return {
        "recommended": next((r for r in annotated if r["recommended"]), None),
        "best_effort": next(r for r in annotated if r["best_effort"]),
        "max_util": next(r for r in annotated if r["max_util"]),
        "viable": viable,
        "grid": annotated,
    }
