"""量體：負載樣本統計、配置組合、推薦。"""

from typing import Any

import pandas as pd

from app.services.billing.demand import bill_mode
from app.services.billing.overage import overage_ceiling
from app.services.contracts import ContractCapacity
from app.services.cleaning.formats.tpc import enrich_interval_end
from app.services.schedule import (
    default_intraday_off_peak_hours,
    intraday_off_peak_hours,
)


ENERGY_SEED_KEYS = ("min", "p50", "p90", "max")
ENERGY_SEED_SET = frozenset(ENERGY_SEED_KEYS)

# 功率面向：整體分位（與電量一致，非月均再跨月）
SIZING_TIER_P50 = "p50"
SIZING_TIER_P90 = "p90"
SIZING_TIER_MAX = "max"
SIZING_TIER_TWO_CYCLE = "two_cycle"
SIZING_TIER_KEYS = (
    SIZING_TIER_P50,
    SIZING_TIER_P90,
    SIZING_TIER_MAX,
    SIZING_TIER_TWO_CYCLE,
)
SIZING_TIER_SET = frozenset(SIZING_TIER_KEYS)

# 舊 session／請求相容
_LEGACY_P95 = "p95"


def _alias_seed_id(raw: str) -> str:
    k = str(raw or "").strip().lower()
    return SIZING_TIER_P90 if k == _LEGACY_P95 else k


def normalize_sizing_strategies(raw: Any) -> list[str]:
    """正規化功率面向多選；顯式空陣列保留為空。"""
    if isinstance(raw, str):
        raw = [raw.strip().lower()]
    if raw is None:
        return list(SIZING_TIER_KEYS)
    if not isinstance(raw, (list, tuple, set)):
        return list(SIZING_TIER_KEYS)
    out: list[str] = []
    seen: set[str] = set()
    for item in raw:
        k = _alias_seed_id(item)
        if k in SIZING_TIER_SET and k not in seen:
            seen.add(k)
            out.append(k)
    return out


def normalize_energy_seeds(raw: Any) -> list[str]:
    """電量面向勾選；None＝全開，[]＝全關。"""
    if raw is None:
        return list(ENERGY_SEED_KEYS)
    if isinstance(raw, str):
        raw = [raw]
    if not isinstance(raw, (list, tuple, set)):
        return list(ENERGY_SEED_KEYS)
    out: list[str] = []
    seen: set[str] = set()
    for item in raw:
        k = _alias_seed_id(item)
        if k in ENERGY_SEED_SET and k not in seen:
            seen.add(k)
            out.append(k)
    return out


def _kwh_by_period(work: pd.DataFrame) -> dict[str, float]:
    """各 period 總 kWh（15 分列）。"""
    from app.services.schedule import hours_per_data_row

    if work.empty or "period" not in work.columns or "kW" not in work.columns:
        return {}
    dt = hours_per_data_row()
    g = work.assign(_kwh=work["kW"].astype(float) * dt).groupby(work["period"].astype(str))["_kwh"].sum()
    return {str(k): float(v) for k, v in g.items()}


def _coerce_include_half_peak(raw: Any) -> bool:
    """是否納入半尖峰；未指定或無法解析時預設關閉（僅手動開啟）。"""
    if isinstance(raw, bool):
        return raw
    if raw is None or (isinstance(raw, str) and not str(raw).strip()):
        return False
    if isinstance(raw, (int, float)):
        return float(raw) != 0.0
    s = str(raw).strip().lower()
    if s in ("1", "true", "yes", "on"):
        return True
    if s in ("0", "false", "no", "off"):
        return False
    return False


def _target_load_periods(include_half_peak: bool) -> frozenset[str]:
    """PCS 取樣目標時段：尖峰，可選加半尖峰（不含週六半尖峰／離峰）。"""
    if include_half_peak:
        return frozenset({"peak", "half_peak"})
    return frozenset({"peak"})


def _midday_off_peak_hours(tou_type: str, schedule: dict | None) -> frozenset[int]:
    """日中離峰整點（8–15）；批次僅早晚離峰時為空 → 兩充兩放不可用。"""
    raw = (
        default_intraday_off_peak_hours(tou_type)
        if schedule is None
        else intraday_off_peak_hours(tou_type, schedule)
    )
    return frozenset(h for h in raw if 8 <= int(h) < 16)


def diagnose_sizing(
    df: pd.DataFrame,
    tou_type: str = "ThreeStage",
    *,
    prices: dict | None = None,
    charge_eff: float = 0.85,
    contracts: ContractCapacity | dict[str, Any] | None = None,
    buffer_kw: float = 0.0,
    schedule: dict | None = None,
    include_half_peak: bool | None = None,
) -> dict[str, Any]:
    """診斷：走 profile_stats → _diagnosis_from_profile（與 sample 同一路徑）。"""
    if df is None or df.empty or "period" not in df.columns:
        return {
            "ok": False,
            "reason": "missing period",
            "suggested_strategies": list(SIZING_TIER_KEYS),
            "available_strategies": [],
            "peak_kwh_share": 0.0,
            "half_peak_kwh_share": 0.0,
            "include_half_peak": False,
        }
    if contracts is None:
        return {
            "ok": False,
            "reason": "missing contracts",
            "suggested_strategies": list(SIZING_TIER_KEYS),
            "available_strategies": [],
            "peak_kwh_share": 0.0,
            "half_peak_kwh_share": 0.0,
            "include_half_peak": False,
        }
    stats = profile_stats(
        df,
        contracts,
        tou_type,
        buffer_kw=buffer_kw,
        schedule=schedule,
        strategies=list(SIZING_TIER_KEYS),
        prices=prices,
        charge_eff=charge_eff,
        include_half_peak=include_half_peak,
        soc_min=0.1,
        soc_max=0.9,
    )
    return _diagnosis_from_profile(
        df,
        tou_type,
        stats,
        include_half_peak=include_half_peak,
        schedule=schedule,
    )


def _diagnosis_from_profile(
    df: pd.DataFrame,
    tou_type: str,
    stats: dict[str, Any],
    *,
    include_half_peak: bool | None = None,
    schedule: dict | None = None,
) -> dict[str, Any]:
    """由已算好的 profile_stats 組診斷（避免 sample 再重算離峰裕度）。"""
    if not stats.get("ok"):
        return {
            "ok": False,
            "reason": stats.get("reason") or "profile",
            "suggested_strategies": list(SIZING_TIER_KEYS),
            "available_strategies": [],
            "peak_kwh_share": 0.0,
            "half_peak_kwh_share": 0.0,
            "include_half_peak": False,
        }
    by_p = _kwh_by_period(df)
    total = sum(by_p.values()) or 1.0
    peak = float(by_p.get("peak") or 0.0)
    half = float(by_p.get("half_peak") or 0.0)
    half_share = half / total * 100.0
    use_half = _coerce_include_half_peak(
        include_half_peak if include_half_peak is not None else stats.get("include_half_peak"),
    )
    dual = stats.get("by_half_peak") or {}
    branch = dual.get("true" if use_half else "false") or {}
    pcs = branch.get("pcs_sample") or stats.get("pcs_sample") or {}
    target_periods = _target_load_periods(use_half)
    target_kwh = sum(float(by_p.get(p) or 0.0) for p in target_periods)
    mid_h = _midday_off_peak_hours(tou_type, schedule)

    available: list[dict[str, Any]] = []
    for tid in SIZING_TIER_KEYS:
        kw = float(pcs.get(tid) or 0)
        reason = ""
        if kw <= 0:
            if tid == SIZING_TIER_TWO_CYCLE:
                reason = "no_midday_off_peak" if not mid_h else "no_two_cycle_margin"
            elif tid == SIZING_TIER_MAX:
                reason = "no_load"
            else:
                reason = "no_target_or_off_margin"
        available.append({
            "id": tid,
            "ok": kw > 0,
            "pcs_kw": round(kw, 3) if kw > 0 else 0.0,
            "reason": reason,
        })
    suggested = [a["id"] for a in available if a["ok"]]
    return {
        "ok": True,
        "suggested_strategies": suggested or list(SIZING_TIER_KEYS),
        "available_strategies": available,
        "include_half_peak": use_half,
        "target_periods": sorted(target_periods),
        "peak_kwh": round(peak, 1),
        "half_peak_kwh": round(half, 1),
        "target_kwh": round(target_kwh, 1),
        "total_kwh": round(total, 1),
        "peak_kwh_share": round(peak / total * 100.0, 1),
        "half_peak_kwh_share": round(half_share, 1),
        "target_kwh_share": round(target_kwh / total * 100.0, 1),
    }


def _target_kw_series(
    work: pd.DataFrame,
    *,
    include_half_peak: bool = False,
) -> pd.Series:
    """目標時段需量列（非假日平日）。"""
    if work.empty or "period" not in work.columns or "kW" not in work.columns:
        return pd.Series(dtype=float)
    periods = _target_load_periods(include_half_peak)
    rows = work.loc[work["period"].astype(str).isin(periods)]
    rows = rows.loc[_weekday_mask(rows)]
    if rows.empty:
        return pd.Series(dtype=float)
    return rows["kW"].astype(float)


def _power_pcs_quantiles(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    include_half_peak: bool = False,
) -> tuple[dict[str, float], dict[str, Any]]:
    """功率面向 P50／P90：整體 15 分 kW 分位 ∩ 同口徑離峰裕度分位（非月均）。"""
    kw = _target_kw_series(work, include_half_peak=include_half_peak)
    head = _off_headroom_series(work, cap, tou_type, buffer_kw)
    empty_src = {"kw": {}, "off_headroom": {}, "periods": sorted(_target_load_periods(include_half_peak))}
    if kw.empty or head.empty:
        return {SIZING_TIER_P50: 0.0, SIZING_TIER_P90: 0.0}, empty_src
    qmap = {SIZING_TIER_P50: 0.50, SIZING_TIER_P90: 0.90}
    pcs: dict[str, float] = {}
    kw_out: dict[str, float] = {}
    off_out: dict[str, float] = {}
    for tid, q in qmap.items():
        a = float(kw.quantile(q))
        b = float(head.quantile(q))
        kw_out[tid] = round(a, 3)
        off_out[tid] = round(b, 3)
        pcs[tid] = round(min(a, b), 3) if a > 0 and b > 0 else 0.0
    return pcs, {
        "kw": kw_out,
        "off_headroom": off_out,
        "periods": sorted(_target_load_periods(include_half_peak)),
    }


def _peak_kw_series(df: pd.DataFrame) -> pd.Series:
    """尖峰時段需量（夏／非夏皆含，period==peak）。"""
    if df.empty or "period" not in df.columns:
        return pd.Series(dtype=float)
    return df.loc[df["period"] == "peak", "kW"].astype(float)


def peak_ess_util_pct(df: pd.DataFrame, pcs_kw: float, peak: pd.Series | None = None) -> float | None:
    """尖峰儲能使用率：mean(min(需量÷PCS, 1))×100%，上限 100%。"""
    series = _peak_kw_series(df) if peak is None else peak
    if pcs_kw <= 0 or series.empty:
        return None
    return round(float((series / pcs_kw).clip(upper=1.0).mean() * 100.0), 1)


def peak_coverage_pct(df: pd.DataFrame, pcs_kw: float, peak: pd.Series | None = None) -> float | None:
    """尖峰負載覆蓋率：mean(min(PCS÷需量, 1))×100%，上限 100%。"""
    series = _peak_kw_series(df) if peak is None else peak
    if pcs_kw <= 0 or series.empty:
        return None
    safe = series.clip(lower=1e-9)
    return round(float((pcs_kw / safe).clip(upper=1.0).mean() * 100.0), 1)


def _tier_pct_map(
    df: pd.DataFrame,
    pcs_sample: dict[str, float],
    fn,
) -> dict[str, float]:
    """各 PCS 檔位套用利用率／覆蓋率（尖峰序列只取一次）。"""
    peak = _peak_kw_series(df)
    out: dict[str, float] = {}
    for tier, raw in pcs_sample.items():
        pcs = float(raw or 0)
        if pcs <= 0:
            continue
        pct = fn(df, pcs, peak)
        if pct is not None:
            out[str(tier)] = pct
    return out


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


def _weekday_mask(rows: pd.DataFrame) -> pd.Series:
    """非假日平日（以區間 date 為準）。"""
    mask = pd.Series(True, index=rows.index)
    if "is_holiday" in rows.columns:
        mask &= ~rows["is_holiday"].fillna(False).astype(bool)
    if "date" in rows.columns:
        mask &= pd.to_datetime(rows["date"]).dt.weekday < 5
    elif "timestamp" in rows.columns:
        from app.services.cleaning.formats.tpc import date_from_ts

        mask &= date_from_ts(rows["timestamp"]).dt.weekday < 5
    return mask


def _off_headroom_series(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    season: str | None = None,
    hours: frozenset[int] | None = None,
) -> pd.Series:
    """逐列離峰可充裕度 kW（≥0）。"""
    off = work.loc[work["period"] == "off_peak"]
    if season is not None and "season" in off.columns:
        off = off.loc[off["season"] == season]
    if hours is not None and "hour" in off.columns:
        off = off.loc[off["hour"].isin(hours)]
    if off.empty:
        return pd.Series(dtype=float)
    months = pd.to_datetime(off["date"]).dt.strftime("%Y-%m")
    kw = off["kW"].astype(float)
    buf = float(buffer_kw)
    out = pd.Series(0.0, index=off.index, dtype=float)
    for month, idx in months.groupby(months, sort=True).groups.items():
        ceiling = overage_ceiling(
            "off_peak",
            cap,
            tou_type,
            bill_mode(str(month)),
        )
        out.loc[idx] = (float(ceiling) - kw.loc[idx] - buf).clip(lower=0.0)
    return out


def _daily_off_headroom_kw(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    season: str | None = None,
    hours: frozenset[int] | None = None,
) -> pd.Series:
    """每日離峰平均可充功率（同日）。"""
    head = _off_headroom_series(
        work, cap, tou_type, buffer_kw, season=season, hours=hours
    )
    if head.empty:
        return pd.Series(dtype=float)
    dates = pd.to_datetime(work.loc[head.index, "date"]).dt.normalize()
    return head.groupby(dates).mean()


def _off_margin_daily_stats(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    season: str | None = None,
    hours: frozenset[int] | None = None,
) -> dict[str, float]:
    """同日離峰裕度 → 月均 → 跨月 max/avg/min。"""
    daily = _daily_off_headroom_kw(
        work, cap, tou_type, buffer_kw, season=season, hours=hours
    )
    if daily.empty:
        return {"max": 0.0, "avg": 0.0, "min": 0.0}
    months = pd.Series(daily.index).dt.strftime("%Y-%m")
    months.index = daily.index
    return _tier_stats(_monthly_avg(daily, months))


def _two_cycle_sources(
    work: pd.DataFrame,
    months: pd.Series,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    schedule: dict | None,
) -> tuple[dict[str, dict[str, float]], float]:
    """兩充兩放：非夏半尖峰 ∩ 日中離峰同日裕度，取跨月平均檔。"""
    mid_h = _midday_off_peak_hours(tou_type, schedule)
    if not mid_h:
        empty = {"max": 0.0, "avg": 0.0, "min": 0.0}
        return {"half_peak": empty, "mid_off_margin": empty}, 0.0
    ns_hp = _period_monthly_stats(work, months, "half_peak", season="non_summer")
    ns_off_mid = _off_margin_daily_stats(
        work, cap, tou_type, buffer_kw, season="non_summer", hours=mid_h
    )
    pcs = _min_tier(ns_hp, ns_off_mid)["avg"]
    return {
        "half_peak": ns_hp,
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


def _max_cover_pcs(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    include_half_peak: bool = False,
) -> tuple[float, dict[str, float]]:
    """全覆蓋 PCS：目標時段最大需量，受該日離峰可充功率限制。"""
    if work.empty or "kW" not in work.columns or "period" not in work.columns:
        return 0.0, {}
    periods = _target_load_periods(include_half_peak)
    rows = work.loc[work["period"].astype(str).isin(periods)]
    if rows.empty:
        return 0.0, {}
    kw = rows["kW"].astype(float)
    idx = kw.idxmax()
    max_kw = float(kw.loc[idx])
    if not (max_kw > 0):
        return 0.0, {}
    day = pd.Timestamp(work.loc[idx, "date"]).normalize()
    daily_off = _daily_off_headroom_kw(work, cap, tou_type, buffer_kw)
    day_off = float(daily_off.get(day, 0.0)) if len(daily_off) else 0.0
    pcs = min(max_kw, day_off) if day_off > 0 else 0.0
    src = {
        "max_kw": round(max_kw, 3),
        "day_off_headroom_kw": round(day_off, 3),
        "pcs_kw": round(pcs, 3) if pcs > 0 else 0.0,
        "periods": sorted(periods),
    }
    if not (pcs > 0):
        src["reason"] = "off_peak_shortfall"
        return 0.0, src
    return round(pcs, 3), src


def _energy_shift_seeds(
    work: pd.DataFrame,
    cap: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
    *,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
) -> dict[str, Any]:
    """能量種子 Min／P50／P90／Max：僅尖峰日電量 → batt／PCS（同日回充）。

    半尖峰開關只影響功率種子；此處固定 peak，避免電池被半尖峰電量灌大。
    Min＝尖峰日電量最小值（最輕尖峰日）。
    """
    from app.services.schedule import hours_per_data_row

    dt = hours_per_data_row()
    eta = max(1e-9, float(charge_eff))
    window = max(1e-9, float(soc_max) - float(soc_min))
    periods = _target_load_periods(False)  # 固定僅尖峰
    empty: dict[str, Any] = {
        "ok": False,
        "seeds": {},
        "daily_target_kwh": {},
        "reason": "no_data",
    }
    if work.empty or "period" not in work.columns or "date" not in work.columns:
        return empty

    rows = work.loc[work["period"].astype(str).isin(periods)]
    rows = rows.loc[_weekday_mask(rows)]
    if rows.empty:
        return {**empty, "reason": "no_target_rows"}

    dates = pd.to_datetime(rows["date"]).dt.normalize()
    daily_kwh = (rows["kW"].astype(float) * dt).groupby(dates).sum()
    if daily_kwh.empty:
        return {**empty, "reason": "no_daily_energy"}

    levels = {
        "min": float(daily_kwh.min()),
        "p50": float(daily_kwh.quantile(0.50)),
        "p90": float(daily_kwh.quantile(0.90)),
        "max": float(daily_kwh.max()),
    }
    target_kw = rows["kW"].astype(float)
    kw_pct = {
        "min": float(target_kw.min()),
        "p50": float(target_kw.quantile(0.50)),
        "p90": float(target_kw.quantile(0.90)),
        "max": float(target_kw.max()),
    }
    head_rows = _off_headroom_series(work, cap, tou_type, buffer_kw)
    if head_rows.empty:
        return {
            "ok": False,
            "seeds": {},
            "daily_target_kwh": {k: round(v, 1) for k, v in levels.items()},
            "reason": "no_off_peak",
        }
    head_dates = pd.to_datetime(work.loc[head_rows.index, "date"]).dt.normalize()
    seeds: dict[str, Any] = {}
    for key in ENERGY_SEED_KEYS:
        need_ac = max(0.0, levels[key])
        batt = need_ac / (window * eta) if need_ac > 0 else 0.0
        lo_pcs, hi_pcs = 0.0, max(float(head_rows.max()), float(kw_pct[key]), 1.0)
        best_pcs = hi_pcs
        worst_fill = 0.0
        for _ in range(24):
            mid = (lo_pcs + hi_pcs) / 2.0
            charge_ac = (
                head_rows.clip(upper=mid).groupby(head_dates).sum() * dt * (eta * eta)
            )
            if need_ac <= 0:
                fill = 1.0
            elif charge_ac.empty:
                fill = 0.0
            else:
                fill = float((charge_ac / need_ac).clip(upper=1.0).min())
            if fill + 1e-9 >= 1.0:
                best_pcs = mid
                hi_pcs = mid
                worst_fill = fill
            else:
                lo_pcs = mid
                worst_fill = max(worst_fill, fill)
        charge_ac = (
            head_rows.clip(upper=best_pcs).groupby(head_dates).sum() * dt * (eta * eta)
        )
        if need_ac > 0 and not charge_ac.empty:
            worst_fill = float((charge_ac / need_ac).clip(upper=1.0).min())
        else:
            worst_fill = 0.0 if need_ac > 0 else 1.0
        if worst_fill + 1e-9 < 1.0 and not charge_ac.empty:
            best_pcs = float(head_rows.max())
            movable = float(charge_ac.min()) if len(charge_ac) else 0.0
            worst_fill = min(1.0, movable / need_ac) if need_ac > 0 else 0.0
            batt = (need_ac * worst_fill) / (window * eta) if worst_fill > 0 else 0.0
        discharge_pcs = float(kw_pct[key])
        pcs = max(discharge_pcs, best_pcs) if worst_fill > 0 else 0.0
        seeds[key] = {
            "batt_kwh": round(batt, 3),
            "pcs_kw": round(pcs, 3) if pcs > 0 else 0.0,
            "periods": sorted(periods),
        }
    return {
        "ok": any(float(s.get("pcs_kw") or 0) > 0 for s in seeds.values()),
        "seeds": seeds,
        "daily_target_kwh": {k: round(v, 1) for k, v in levels.items()},
        "periods": sorted(periods),
        "reason": "ok",
    }


def profile_stats(
    df: pd.DataFrame,
    contracts: ContractCapacity | dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
    schedule: dict | None = None,
    strategy: str | None = None,
    strategies: list[str] | None = None,
    prices: dict | None = None,
    charge_eff: float = 0.85,
    include_half_peak: bool | None = None,
    soc_min: float = 0.1,
    soc_max: float = 0.9,
) -> dict[str, Any]:
    """目標時段／離峰統計；一次算齊半尖峰開／關兩組（切換只比大小）。"""
    cap = (
        contracts
        if isinstance(contracts, ContractCapacity)
        else ContractCapacity.from_dict(contracts)
    )
    tiers = normalize_sizing_strategies(
        strategies if strategies is not None else strategy
    )
    work = df
    if work.empty or "period" not in work.columns or "date" not in work.columns:
        return {"ok": False, "reason": "missing period", "strategies": tiers}
    if "kW" not in work.columns:
        return {"ok": False, "reason": "missing kW", "strategies": tiers}
    if "hour" not in work.columns:
        work = enrich_interval_end(work)

    months = pd.to_datetime(work["date"]).dt.strftime("%Y-%m")
    by_p = _kwh_by_period(work)
    total = sum(by_p.values()) or 1.0
    half_share = float(by_p.get("half_peak") or 0.0) / total * 100.0
    use_half = _coerce_include_half_peak(include_half_peak)

    two_cycle_sources = None
    tc_kw = 0.0
    mid_h = _midday_off_peak_hours(tou_type, schedule)
    if mid_h:
        tc_src, tc_kw = _two_cycle_sources(
            work, months, cap, tou_type, buffer_kw, schedule
        )
        if tc_kw > 0:
            two_cycle_sources = tc_src

    # 能量種子與半尖峰開關無關：只算一次尖峰日電量
    energy = _energy_shift_seeds(
        work,
        cap,
        tou_type,
        buffer_kw,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=charge_eff,
    )

    def _branch(include_hp: bool) -> dict[str, Any]:
        q_pcs, _q_src = _power_pcs_quantiles(
            work, cap, tou_type, buffer_kw, include_half_peak=include_hp
        )
        pcs = dict(q_pcs)
        max_kw, max_src = _max_cover_pcs(
            work, cap, tou_type, buffer_kw, include_half_peak=include_hp
        )
        if max_kw > 0:
            pcs[SIZING_TIER_MAX] = max_kw
        if tc_kw > 0:
            pcs[SIZING_TIER_TWO_CYCLE] = tc_kw
        branch: dict[str, Any] = {
            "include_half_peak": include_hp,
            "pcs_sample": pcs,
            "energy_shift": energy,
            "peak_ess_util": _tier_pct_map(work, pcs, peak_ess_util_pct),
            "peak_coverage": _tier_pct_map(work, pcs, peak_coverage_pct),
        }
        if max_src:
            branch["max_sources"] = max_src
        return branch

    branch_off = _branch(False)
    branch_on = _branch(True)
    active = branch_on if use_half else branch_off

    out: dict[str, Any] = {
        "ok": True,
        "strategies": tiers,
        "include_half_peak": use_half,
        "month_count": len(set(months)),
        "pcs_sample": active["pcs_sample"],
        "energy_shift": active["energy_shift"],
        "peak_ess_util": active["peak_ess_util"],
        "peak_coverage": active["peak_coverage"],
        "by_half_peak": {
            "false": branch_off,
            "true": branch_on,
        },
    }
    if active.get("max_sources"):
        out["max_sources"] = active["max_sources"]
    if two_cycle_sources is not None:
        out["two_cycle_sources"] = two_cycle_sources
    return out


def pcs_candidates_from_stats(
    stats: dict[str, Any],
    tiers: list[str] | None = None,
) -> list[float]:
    """依勾選策略取 PCS 樣本。"""
    if not stats.get("ok"):
        return []
    raw = stats.get("pcs_sample") or {}
    keys = normalize_sizing_strategies(
        tiers if tiers is not None else stats.get("strategies")
    )
    return sorted(
        {round(float(raw[k]), 3) for k in keys if float(raw.get(k) or 0) > 0}
    )


def shortlist_combinations(
    stats: dict[str, Any],
    tiers: list[str],
    *,
    energy_keys: list[str] | None = None,
) -> dict[str, Any]:
    """功率面向取 PCS × 電量面向取電池，自由組合並去重。"""
    combos: list[dict[str, Any]] = []
    seen: set[tuple[float, float]] = set()
    pcs_sample = stats.get("pcs_sample") or {}
    energy = (stats.get("energy_shift") or {}).get("seeds") or {}
    ekeys = normalize_energy_seeds(energy_keys)

    def _add(
        pcs: float,
        batt: float,
        *,
        source: str,
        seed: str,
        extra: dict[str, Any] | None = None,
    ) -> None:
        pcs_r = round(float(pcs), 3)
        batt_r = round(float(batt), 3)
        if pcs_r <= 0 or batt_r <= 0:
            return
        key = (pcs_r, batt_r)
        if key in seen:
            return
        seen.add(key)
        row = {
            "pcs_kw": pcs_r,
            "batt_kwh": batt_r,
            "hours": round(batt_r / pcs_r, 3) if pcs_r > 0 else 0,
            "seed_source": source,
            "seed_id": seed,
        }
        if extra:
            row.update(extra)
        combos.append(row)

    pcs_opts: list[tuple[float, str]] = []
    pcs_seen: set[float] = set()
    for tid in tiers:
        pcs = round(float(pcs_sample.get(tid) or 0), 3)
        if pcs <= 0 or pcs in pcs_seen:
            continue
        pcs_seen.add(pcs)
        pcs_opts.append((pcs, tid))

    batt_opts: list[tuple[float, str]] = []
    batt_seen: set[float] = set()
    for level in ekeys:
        seed = energy.get(level) or {}
        batt = round(float(seed.get("batt_kwh") or 0), 3)
        if batt <= 0 or batt in batt_seen:
            continue
        batt_seen.add(batt)
        batt_opts.append((batt, level))

    if pcs_opts and batt_opts:
        for pcs, tid in pcs_opts:
            for batt, level in batt_opts:
                _add(
                    pcs,
                    batt,
                    source="cross",
                    seed=f"{tid}x{level}",
                    extra={"pcs_seed": tid, "energy_level": level},
                )
    elif not pcs_opts and batt_opts:
        for level in ekeys:
            seed = energy.get(level) or {}
            _add(
                float(seed.get("pcs_kw") or 0),
                float(seed.get("batt_kwh") or 0),
                source="energy",
                seed=level,
                extra={"energy_level": level},
            )

    pcs_list = sorted({round(float(c["pcs_kw"]), 3) for c in combos})
    return {
        "combinations": combos,
        "pcs_list": pcs_list,
        "grid_points": len(combos),
        "energy_keys": ekeys,
    }


def sample_from_profile(
    stats: dict[str, Any],
    diagnosis: dict[str, Any],
    *,
    tou_type: str,
    schedule: dict | None = None,
    strategy: str | None = None,
    strategies: list[str] | None = None,
    energy_keys: list[str] | None = None,
) -> dict[str, Any]:
    """已有 profile／diagnosis → 短名單配置（尚未 dispatch）。"""
    tiers = normalize_sizing_strategies(
        strategies if strategies is not None else (
            strategy if strategy is not None else None
        )
    )
    if strategies is None and strategy is None:
        avail = [
            a["id"]
            for a in (diagnosis.get("available_strategies") or [])
            if a.get("ok")
        ]
        if avail:
            tiers = avail
    ekeys = normalize_energy_seeds(energy_keys)

    if not stats.get("ok"):
        return {
            "diagnosis": diagnosis,
            "strategies": tiers,
            "energy_keys": ekeys,
            "profile_stats": stats,
            "pcs_list": [],
            "combinations": [],
            "grid_points": 0,
            "sample_source": "none",
        }

    built = shortlist_combinations(stats, tiers, energy_keys=ekeys)
    sample_source = "profile" if built["combinations"] else "none"
    return {
        "diagnosis": diagnosis,
        "strategies": tiers,
        "energy_keys": ekeys,
        "profile_stats": stats,
        "pcs_list": built["pcs_list"],
        "combinations": built["combinations"],
        "grid_points": built["grid_points"],
        "sample_source": sample_source,
    }


def plan_sample_grid(
    df: pd.DataFrame,
    contracts: ContractCapacity | dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
    schedule: dict | None = None,
    strategy: str | None = None,
    strategies: list[str] | None = None,
    energy_keys: list[str] | None = None,
    prices: dict | None = None,
    charge_eff: float = 0.85,
    include_half_peak: bool | None = None,
    soc_min: float = 0.1,
    soc_max: float = 0.9,
) -> dict[str, Any]:
    """診斷／策略多選 → 短名單配置（尚未 dispatch）。"""
    cap = (
        contracts
        if isinstance(contracts, ContractCapacity)
        else ContractCapacity.from_dict(contracts)
    )
    stats = profile_stats(
        df,
        cap,
        tou_type,
        buffer_kw=buffer_kw,
        schedule=schedule,
        strategies=list(SIZING_TIER_KEYS),
        prices=prices,
        charge_eff=charge_eff,
        include_half_peak=include_half_peak,
        soc_min=soc_min,
        soc_max=soc_max,
    )
    diagnosis = _diagnosis_from_profile(
        df,
        tou_type,
        stats,
        include_half_peak=include_half_peak,
        schedule=schedule,
    )
    return sample_from_profile(
        stats,
        diagnosis,
        tou_type=tou_type,
        schedule=schedule,
        strategy=strategy,
        strategies=strategies,
        energy_keys=energy_keys,
    )


def _pcs_util_score(row: dict[str, Any]) -> float:
    """可用季節平均 PCS 日均使用率（忽略無資料季節）。"""
    vals = []
    for key in ("pcs_daily_avg_pct_summer", "pcs_daily_avg_pct_non_summer"):
        if key in row and row.get(key) is not None:
            vals.append(max(0.0, float(row.get(key) or 0)))
    return sum(vals) / len(vals) if vals else 0.0


def _cycle_util_score(row: dict[str, Any]) -> float:
    """可用季節平均循環利用率（可超過 100%，反映多循環）。"""
    vals = []
    for key in ("daily_cycle_pct_summer", "daily_cycle_pct_non_summer"):
        if key in row and row.get(key) is not None:
            vals.append(max(0.0, float(row.get(key) or 0)))
    return sum(vals) / len(vals) if vals else 0.0


def _engineering_balance_score(row: dict[str, Any]) -> dict[str, float]:
    """工程折衷：savings × 循環利用率（未含設備成本）。

    PCS 利用率已反映在節省金額，不再二次加權；電池循環（SOC）可超過 100%。
    """
    savings = max(0.0, float(row.get("savings") or 0))
    pcs_u = _pcs_util_score(row)
    cycle_u = _cycle_util_score(row)
    score = savings * (cycle_u / 100.0)
    return {
        "score": score,
        "savings": savings,
        "pcs_util_avg": round(pcs_u, 1),
        "cycle_util_avg": round(cycle_u, 1),
    }


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
    """標記 grid（savings＝電費節省／第1層排序鍵）。

    - 金額最大：只比 savings
    - 使用率最大：單位電容量節省（savings÷batt）；同分再比平均使用效率、較小量體
    - 工程折衷建議：savings × 循環利用率（可 >100%；PCS 已含在金額內，不再二次加權；未含設備成本）
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
        bal = _engineering_balance_score(row)
        row["engineering_score"] = round(bal["score"], 3)
        row["engineering_score_parts"] = {
            "savings": bal["savings"],
            "pcs_util_avg": bal["pcs_util_avg"],
            "cycle_util_avg": bal["cycle_util_avg"],
            "includes_capex": False,
        }
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
        score = float(row.get("engineering_score") or 0)
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
