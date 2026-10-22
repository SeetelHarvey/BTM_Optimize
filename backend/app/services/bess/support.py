"""三層試算共用：調度、量體鍵、契約正規化。"""

from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.bess.device import Device
from app.services.bess.dispatch import run
from app.services.bess.size_grid import (
    normalize_energy_seeds,
    normalize_sizing_strategies,
)
from app.services.billing import calc_full_bill
from app.services.charts import build_dispatch_charts
from app.services.contract_rules import ContractCapacity, cumulative_ceiling, validate
from app.services.features import reserve
from app.services.features import tou
from app.services.features.grid_cap import (
    regular_kw_of,
    resolve_buffer_kw,
)
from app.services.schedule import hours_per_data_row


def _settings_tiers(settings: dict[str, Any]) -> list[str]:
    """從試算設定讀功率面向多選。"""
    return normalize_sizing_strategies(settings.get("sizingStrategies"))


def _settings_energy_seeds(settings: dict[str, Any]) -> list[str]:
    """從試算設定讀電量面向多選。"""
    return normalize_energy_seeds(settings.get("sizingEnergySeeds"))


def _dispatch_chart_key(pcs_kw: float, batt_kwh: float) -> str:
    return f"{round(pcs_kw, 3)}_{round(batt_kwh, 3)}"


_METRIC_KEYS = (
    "pcs_daily_avg_pct_summer",
    "pcs_daily_avg_pct_non_summer",
    "daily_cycle_pct_summer",
    "daily_cycle_pct_non_summer",
)


def prepare_effective_contracts(
    contracts: dict[str, Any],
    tou_type: str,
) -> dict[str, Any]:
    """驗證契約欄位後回傳（容許額度補額僅在 Stage2 候選層）。"""
    return validate(ContractCapacity.from_dict(contracts), tou_type).to_dict()


def _bill_totals(bill: dict[str, Any]) -> dict[str, Any]:
    return {
        "total": int(bill["total"]),
        "basic_total": bill.get("basic_total"),
        "overage_total": bill.get("overage_total"),
        "energy_total": bill.get("energy_total"),
    }


def _energy_kwh_by_season_period(df: pd.DataFrame, kw_col: str = "kW") -> list[dict[str, Any]]:
    """依 season×period 加總 kWh。"""
    if df is None or df.empty or kw_col not in df.columns or "period" not in df.columns:
        return []
    dt = hours_per_data_row()
    work = df.copy()
    work["_kwh"] = work[kw_col].astype(float) * dt
    if "season" not in work.columns:
        work["season"] = ""
    g = (
        work.groupby([work["season"].astype(str), work["period"].astype(str)], sort=True)["_kwh"]
        .sum()
    )
    return [
        {"season": str(sea), "period": str(per), "kwh": round(float(kwh), 1)}
        for (sea, per), kwh in g.items()
    ]


def energy_transfer_payload(
    before_df: pd.DataFrame,
    after_df: pd.DataFrame,
    *,
    before_col: str = "kW",
    after_col: str = "kW",
    baseline_tou: str | None = None,
    simulate_tou: str | None = None,
) -> dict[str, Any]:
    """用電轉移：before／after 各依自身 season×period（並集）。

    before＝匯入方案・無儲能；after＝模擬方案・含儲能。
    同名時段在不同方案的鐘點可能不同；僅一側有的時段（如三段半尖峰）另側為 0。
    """
    before_rows = _energy_kwh_by_season_period(before_df, before_col)
    after_rows = _energy_kwh_by_season_period(after_df, after_col)
    after_map = {(r["season"], r["period"]): r["kwh"] for r in after_rows}
    before_map = {(r["season"], r["period"]): r["kwh"] for r in before_rows}
    keys = sorted(set(before_map) | set(after_map))
    side_rank = {"before_only": 0, "both": 1, "after_only": 2}
    rows: list[dict[str, Any]] = []
    for sea, per in keys:
        b = float(before_map.get((sea, per), 0.0))
        a = float(after_map.get((sea, per), 0.0))
        only_before = (sea, per) in before_map and (sea, per) not in after_map
        only_after = (sea, per) in after_map and (sea, per) not in before_map
        side = (
            "before_only" if only_before else ("after_only" if only_after else "both")
        )
        delta = a - b
        pct = None if abs(b) < 1e-9 else round(100.0 * delta / b, 1)
        rows.append({
            "season": str(sea),
            "period": str(per),
            "before_kwh": round(b, 1),
            "after_kwh": round(a, 1),
            "delta_kwh": round(delta, 1),
            "delta_pct": pct,
            "side": side,
        })
    rows.sort(
        key=lambda r: (
            str(r["season"]),
            side_rank.get(str(r["side"]), 9),
            str(r["period"]),
        )
    )
    # 有效轉移量：從較貴時段搬走的電量（delta_kWh < 0 加總；負＝移出）
    effective = round(sum(float(r["delta_kwh"]) for r in rows if float(r["delta_kwh"]) < 0), 1)
    return {
        "rows": rows,
        "baseline_tou": baseline_tou,
        "simulate_tou": simulate_tou,
        "effective_transfer_kwh": effective,
    }


def _hourly_pcs_util_pct(
    disp: pd.DataFrame,
    discharge_kw: pd.Series,
    *,
    pcs_kw: float,
) -> float:
    """放電時段以每小時峰值計；該小時曾頂滿 PCS 即視為 100%。"""
    if pcs_kw <= 0:
        return 0.0
    frame = pd.DataFrame({"discharge": discharge_kw.astype(float).values}, index=disp.index)
    frame["day"] = pd.to_datetime(disp["date"]).dt.strftime("%Y-%m-%d")
    if "hour" in disp.columns:
        frame["hour"] = disp["hour"].astype(int).values
    elif "min" in disp.columns:
        frame["hour"] = (disp["min"].astype(int).values // 4)
    else:
        frame["hour"] = 0
    hourly = frame.groupby(["day", "hour"])["discharge"].max()
    active = hourly[hourly > 1e-9]
    if active.empty:
        return 0.0
    full = pcs_kw * 0.995
    scores = [100.0 if m >= full else min(100.0, m / pcs_kw * 100.0) for m in active]
    return float(sum(scores) / len(scores))


def _daily_avg_pcs_util_pct(
    disp: pd.DataFrame,
    discharge_kw: pd.Series,
    *,
    pcs_kw: float,
) -> float:
    """每日放電峰值÷PCS，再對該季每一日平均（無放電日計 0%，與 SOC 日循環口徑一致）。"""
    if pcs_kw <= 0:
        return 0.0
    frame = pd.DataFrame({"discharge": discharge_kw.astype(float).values})
    frame["day"] = (
        pd.to_datetime(disp["date"]).dt.strftime("%Y-%m-%d").to_numpy()
    )
    daily_max = frame.groupby("day")["discharge"].max()
    if daily_max.empty:
        return 0.0
    full = pcs_kw * 0.995
    scores: list[float] = []
    for m in daily_max:
        if float(m) <= 1e-9:
            scores.append(0.0)
        elif float(m) >= full:
            scores.append(100.0)
        else:
            scores.append(min(100.0, float(m) / pcs_kw * 100.0))
    return float(sum(scores) / len(scores))


def _dispatch_metrics(
    disp: pd.DataFrame,
    *,
    pcs_kw: float,
    batt_kwh: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
) -> dict[str, float]:
    """PCS 日均使用率與 SOC 日循環（夏／非夏；皆含空轉日）。

    soc_min／soc_max 應為有效窗（含備援提高後的下限）。
    """
    dt = hours_per_data_row()
    discharge_kw = (-disp["ess_kw"].astype(float)).clip(lower=0.0)
    usable = batt_kwh * max(0.0, soc_max - soc_min) * charge_eff
    seasons = (
        disp["season"]
        if "season" in disp.columns
        else pd.Series("summer", index=disp.index)
    )
    out: dict[str, float] = {}
    for sea in ("summer", "non_summer"):
        mask = seasons == sea
        part = disp.loc[mask]
        d_kw = discharge_kw[mask]
        if part.empty:
            out[f"pcs_daily_avg_pct_{sea}"] = None  # type: ignore[assignment]
            out[f"daily_cycle_pct_{sea}"] = None  # type: ignore[assignment]
            continue
        daily_avg = _daily_avg_pcs_util_pct(part, d_kw, pcs_kw=pcs_kw)
        dates = pd.to_datetime(disp.loc[mask, "date"]).dt.strftime("%Y-%m-%d")
        daily_discharge = (d_kw * dt).groupby(dates).sum()
        avg_daily = float(daily_discharge.mean()) if len(daily_discharge) else 0.0
        cycle_ratio = avg_daily / usable if usable > 0 else 0.0
        out[f"pcs_daily_avg_pct_{sea}"] = round(min(100.0, daily_avg), 1)
        out[f"daily_cycle_pct_{sea}"] = round(cycle_ratio * 100.0, 1)
    return out


def _effective_soc_window(
    settings: dict[str, Any], *, pcs_kw: float, batt_kwh: float
) -> tuple[float, float]:
    """含備援後的有效 SOC 窗。"""
    dev = _make_device(settings, pcs_kw=pcs_kw, batt_kwh=batt_kwh)
    soc_min = float(dev.soc_min)
    soc_max = float(dev.soc_max)
    if "backup" in (settings.get("functions") or []):
        from app.services.features import backup as backup_feat

        adj = backup_feat.adjusted_device(
            dev, float(settings.get("backupReserveKwh") or 0)
        )
        soc_min = float(adj.soc_min)
        soc_max = float(adj.soc_max)
    return soc_min, soc_max


def _make_device(settings: dict[str, Any], *, pcs_kw: float, batt_kwh: float) -> Device:
    return Device(
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        soc_min=float(settings.get("socMin", 0.1)),
        soc_max=float(settings.get("socMax", 0.9)),
        charge_eff=float(settings.get("chargeEff", 0.85)),
        anti_export_kw=float(settings.get("antiExportKw", 0.0)),
    )


def _dispatch_for_point(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    tou_step: int,
    period_schedule: dict | None = None,
    bid_source_disp: pd.DataFrame | None = None,
) -> tuple[pd.DataFrame, dict[str, Any] | None, dict[str, Any] | None]:
    """單一 (pcs,batt) 時間電價調度；有備轉則在上游曲線上結算（不改 ess／grid）。"""
    reg = regular_kw_of(contracts)
    demand_buf = resolve_buffer_kw(settings, contract_kw=reg, key="demandBufferKw")
    anti = resolve_buffer_kw(settings, contract_kw=reg, key="antiExportKw")
    settings = {**settings, "demandBufferKw": demand_buf, "antiExportKw": anti}
    dev = _make_device(settings, pcs_kw=pcs_kw, batt_kwh=batt_kwh)
    use_backup = "backup" in (settings.get("functions") or [])
    soc_min = float(dev.soc_min)
    soc_max = float(dev.soc_max)
    if use_backup:
        from app.services.features import backup as backup_feat

        adj = backup_feat.adjusted_device(dev, float(settings.get("backupReserveKwh") or 0))
        soc_min = float(adj.soc_min)
        soc_max = float(adj.soc_max)

    local = dict(settings)
    local, tou_meta = tou.resolve_tou_schedule(
        local,
        tou_type=tou_type,
        prices=plan.get("prices"),
        period_schedule=period_schedule,
        tou_step_minutes=tou_step,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=float(settings.get("chargeEff", 0.85)),
    )

    source = bid_source_disp
    if source is None:
        source = run(
            df,
            dev,
            local,
            tou_type=tou_type,
            contracts=contracts,
            tou_step_minutes=tou_step,
            prices=plan.get("prices"),
            period_schedule=period_schedule,
        )

    use_reserve = "reserve" in (settings.get("functions") or [])
    if not use_reserve:
        return source, None, tou_meta

    reserve.validate_inputs(local)
    mode = str(local.get("reserveScheduleMode") or "auto").lower()
    auto_meta = None
    sched = local.get("reserveSchedule")
    if mode == "auto":
        sched, auto_meta = reserve.build_auto_schedule(
            df,
            source,
            dev,
            capacity_price=float(local.get("reserveCapacityPrice") or 0),
            performance_price=float(local.get("reservePerformancePrice") or 0),
        )
        local = {**local, "reserveSchedule": sched, "reserveScheduleMode": "manual"}

    final, bids2, income, meta = reserve.run_reserve_layer(
        df, source, dev, local, step_minutes=tou_step
    )
    if auto_meta is not None:
        meta["mode"] = "auto"
        meta["auto"] = auto_meta
        meta["recommended_schedule"] = sched
    return final, {"income": income, "meta": meta, "bids_mw_mean": float(bids2.mean())}, tou_meta


def _simulate_point(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    start_date: str,
    end_date: str,
    voltage_level: str,
    tou_step: int,
    overage_rules: dict | None,
    period_schedule: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
    baseline_tou: str | None = None,
    simulate_tou: str | None = None,
    return_disp: bool = False,
    bid_source_disp: pd.DataFrame | None = None,
) -> dict[str, Any]:
    """單一 (pcs,batt) dispatch + 計費（備轉收入另計）。"""
    disp, reserve_info, tou_meta = _dispatch_for_point(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        tou_step=tou_step,
        period_schedule=period_schedule,
        bid_source_disp=bid_source_disp,
    )
    bill_df = df.assign(kW=disp["grid_kw"].to_numpy())
    after = calc_full_bill(
        bill_df,
        plan,
        contracts,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=overage_rules,
    )
    bill = _bill_totals(after)
    reserve_income = (reserve_info or {}).get("income") or {
        "capacity": 0,
        "performance": 0,
        "activation_energy": 0,
        "total": 0,
        "monthly": {},
        "events": [],
        "data_note": "15min_estimate",
    }
    load_before = baseline_df if baseline_df is not None else df
    soc_min, soc_max = _effective_soc_window(
        settings, pcs_kw=pcs_kw, batt_kwh=batt_kwh
    )
    out = {
        **bill,
        **_dispatch_metrics(
            disp,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            soc_min=soc_min,
            soc_max=soc_max,
            charge_eff=float(settings.get("chargeEff", 0.85)),
        ),
        "reserve_income": reserve_income,
        "reserve_meta": (reserve_info or {}).get("meta"),
        "tou_meta": tou_meta,
        "energy_transfer": energy_transfer_payload(
            load_before,
            bill_df,
            baseline_tou=baseline_tou or tou_type,
            simulate_tou=simulate_tou or tou_type,
        ),
        "bill_savings": None,
    }
    if return_disp:
        out["disp"] = disp
        out["charts"] = build_dispatch_charts(df, disp)
    return out


def functions_without_reserve(functions: list[str] | None) -> list[str]:
    """功能清單去掉 reserve；第 1 層與備轉回退共用。"""
    fns = [f for f in (functions or ["tou"]) if f != "reserve"]
    return fns or ["tou"]


def _row_key_pair(pcs_kw: float, batt_kwh: float) -> tuple[float, float]:
    return (round(float(pcs_kw), 3), round(float(batt_kwh), 3))


def capacity_target_row(
    stage1_result: dict[str, Any],
    pcs_kw: float | None = None,
    batt_kwh: float | None = None,
) -> dict[str, Any] | None:
    """從 grid／標註列取 stage2 目標點；未指定則用推薦。"""
    if pcs_kw is None or batt_kwh is None:
        return stage1_result.get("recommended")
    key = _row_key_pair(pcs_kw, batt_kwh)
    for row in stage1_result.get("grid") or []:
        if _row_key_pair(row["pcs_kw"], row["batt_kwh"]) == key:
            return row
    for row in (
        stage1_result.get("recommended"),
        stage1_result.get("best_effort"),
        stage1_result.get("max_util"),
    ):
        if row and _row_key_pair(row["pcs_kw"], row["batt_kwh"]) == key:
            return row
    return None


def _contracts_fingerprint(contracts: dict[str, Any]) -> tuple:
    """契約比對用（忽略多餘鍵）。"""
    keys = (
        "regular_kw",
        "half_peak_kw",
        "non_summer_kw",
        "saturday_half_peak_kw",
        "off_peak_kw",
    )
    return tuple(round(float(contracts.get(k) or 0), 3) for k in keys)


def _summary_from_grid_row(row: dict[str, Any], disp: Any) -> dict[str, Any]:
    """Stage1 網格列＋既有 disp → 與 _simulate_point 同形摘要（不再調度）。"""
    empty_reserve = {
        "capacity": 0,
        "performance": 0,
        "activation_energy": 0,
        "total": 0,
        "monthly": {},
        "events": [],
        "data_note": "15min_estimate",
    }
    return {
        "total": int(row.get("after_total") or 0),
        "basic_total": int(row.get("after_basic_total") or 0),
        "overage_total": int(row.get("after_overage_total") or 0),
        "energy_total": int(row.get("after_energy_total") or 0),
        "reserve_income": row.get("reserve_income") or empty_reserve,
        "reserve_meta": row.get("reserve_meta"),
        "tou_meta": row.get("tou_meta"),
        "energy_transfer": row.get("energy_transfer"),
        **{k: row.get(k) for k in _METRIC_KEYS},
        "bill_savings": row.get("bill_savings"),
        "disp": disp,
    }
