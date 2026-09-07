"""量體試算編排。"""

import os
from concurrent.futures import ProcessPoolExecutor
from typing import Any

import pandas as pd

from app.services.bess.device import Device
from app.services.bess.dispatch import run, skipped_functions
from app.services.bess.size_grid import plan_sample_grid, pick_results
from app.services.billing import calc_full_bill
from app.services.charts import build_dispatch_charts
from app.services.contracts import (
    ContractCapacity,
    cumulative_ceiling,
    free_off_peak_kw,
    validate,
    with_off_peak_boost,
)
from app.services.features import reserve
from app.services.schedule import hours_per_data_row


def _dispatch_chart_key(pcs_kw: float, batt_kwh: float) -> str:
    return f"{round(pcs_kw, 3)}_{round(batt_kwh, 3)}"


_METRIC_KEYS = (
    "pcs_daily_avg_pct_summer",
    "pcs_daily_avg_pct_non_summer",
    "daily_cycle_pct_summer",
    "daily_cycle_pct_non_summer",
)


def _peak_kwh(df: pd.DataFrame) -> float:
    """尖峰時段總用電 kWh。"""
    dt = hours_per_data_row()
    if df.empty or "period" not in df.columns:
        return 0.0
    peak = df.loc[df["period"] == "peak", "kW"].astype(float)
    return float(peak.sum() * dt)


def _off_peak_headroom_kwh(
    df: pd.DataFrame,
    contracts: ContractCapacity,
    tou_type: str,
    buffer_kw: float,
) -> float:
    """離峰時段可充電裕度 kWh（契約上限 − 裕度 − 負載）。"""
    dt = hours_per_data_row()
    if df.empty or "period" not in df.columns:
        return 0.0
    cap = validate(contracts, tou_type)
    off = df.loc[df["period"] == "off_peak"]
    if off.empty:
        return 0.0
    ceiling = cumulative_ceiling("off_peak", cap)
    margin = (ceiling - buffer_kw - off["kW"].astype(float)).clip(lower=0.0)
    return float(margin.sum() * dt)


def _contract_adjustment(
    df: pd.DataFrame,
    contracts: ContractCapacity,
    tou_type: str,
    *,
    enabled: bool,
    buffer_kw: float,
) -> tuple[ContractCapacity, dict[str, Any]]:
    """試算前離峰契約自動增額；回傳有效契約與說明。"""
    cap = validate(contracts, tou_type)
    free_kw = free_off_peak_kw(cap, tou_type)
    peak_kwh = round(_peak_kwh(df), 1)
    headroom_kwh = round(_off_peak_headroom_kwh(df, cap, tou_type, buffer_kw), 1)
    info: dict[str, Any] = {
        "applied": False,
        "reason": "",
        "peak_kwh": peak_kwh,
        "off_peak_headroom_kwh": headroom_kwh,
        "free_quota_kw": round(free_kw, 1),
        "added_kw": 0.0,
        "off_peak_kw_before": cap.off_peak_kw,
        "off_peak_kw_after": cap.off_peak_kw,
    }
    if not enabled:
        info["reason"] = "disabled"
        return cap, info
    if peak_kwh <= headroom_kwh:
        info["reason"] = "sufficient_headroom"
        return cap, info
    if free_kw <= 0:
        info["reason"] = "no_free_quota"
        return cap, info
    adjusted = with_off_peak_boost(cap, free_kw, tou_type)
    info.update(
        {
            "applied": True,
            "reason": "peak_exceeds_headroom",
            "added_kw": round(free_kw, 1),
            "off_peak_kw_after": adjusted.off_peak_kw,
        }
    )
    return adjusted, info


def prepare_effective_contracts(
    df: pd.DataFrame,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    tou_type: str,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """試算用有效契約（含離峰自動增額；不改 session）。"""
    cap = ContractCapacity.from_dict(contracts)
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    auto_adj = bool(settings.get("autoAdjustOffPeakContract"))
    effective_cap, info = _contract_adjustment(
        df,
        cap,
        tou_type,
        enabled=auto_adj,
        buffer_kw=buffer_kw,
    )
    return effective_cap.to_dict(), info


def run_sample(
    df: pd.DataFrame,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    tou_type: str,
    schedule: dict | None = None,
) -> dict[str, Any]:
    """試算前樣本預覽（尚未 dispatch）；與 run_size 同一套有效契約／組合。"""
    effective_contracts, contract_adjustment = prepare_effective_contracts(
        df, contracts, settings, tou_type
    )
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    sample = plan_sample_grid(
        df,
        ContractCapacity.from_dict(effective_contracts),
        tou_type,
        buffer_kw=buffer_kw,
        schedule=schedule,
    )
    return {
        "profile_stats": sample["profile_stats"],
        "peak_hours_max": sample["peak_hours_max"],
        "two_cycle_hours_max": sample.get("two_cycle_hours_max"),
        "sample_source": sample["sample_source"],
        "grid_points": sample["grid_points"],
        "contract_adjustment": contract_adjustment,
    }


def _bill_totals(bill: dict[str, Any]) -> dict[str, Any]:
    return {
        "total": int(bill["total"]),
        "basic_total": bill.get("basic_total"),
        "overage_total": bill.get("overage_total"),
        "energy_total": bill.get("energy_total"),
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
    """PCS 日均使用率與 SOC 日循環（夏／非夏；皆含空轉日）。"""
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
        daily_avg = _daily_avg_pcs_util_pct(part, d_kw, pcs_kw=pcs_kw)
        dates = pd.to_datetime(disp.loc[mask, "date"]).dt.strftime("%Y-%m-%d")
        daily_discharge = (d_kw * dt).groupby(dates).sum()
        avg_daily = float(daily_discharge.mean()) if len(daily_discharge) else 0.0
        cycle_ratio = avg_daily / usable if usable > 0 else 0.0
        out[f"pcs_daily_avg_pct_{sea}"] = round(min(100.0, daily_avg), 1)
        out[f"daily_cycle_pct_{sea}"] = round(cycle_ratio * 100.0, 1)
    return out


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
) -> tuple[pd.DataFrame, dict[str, Any] | None]:
    """單一 (pcs,batt) dispatch；若開備轉則疊事件並回傳 reserve_income。"""
    dev = _make_device(settings, pcs_kw=pcs_kw, batt_kwh=batt_kwh)
    use_reserve = "reserve" in (settings.get("functions") or [])
    local = dict(settings)

    if not use_reserve:
        disp = run(
            df,
            dev,
            local,
            tou_type=tou_type,
            contracts=contracts,
            tou_step_minutes=tou_step,
            bid_series=None,
            prices=plan.get("prices"),
            period_schedule=period_schedule,
        )
        return disp, None

    reserve.validate_inputs(local)
    mode = str(local.get("reserveScheduleMode") or "auto").lower()

    if mode == "auto":
        seed = run(
            df,
            dev,
            local,
            tou_type=tou_type,
            contracts=contracts,
            tou_step_minutes=tou_step,
            bid_series=reserve.resolve_bids_series(
                df,
                {**local, "reserveSchedule": reserve.empty_schedule()},
                step_minutes=tou_step,
            ),
            prices=plan.get("prices"),
            period_schedule=period_schedule,
        )
        sched, auto_meta = reserve.build_auto_schedule(
            df,
            seed,
            dev,
            step_minutes=tou_step,
            capacity_price=float(local.get("reserveCapacityPrice") or 0),
            performance_price=float(local.get("reservePerformancePrice") or 0),
        )
        local = {**local, "reserveSchedule": sched, "reserveScheduleMode": "manual"}
    else:
        auto_meta = None
        sched = local.get("reserveSchedule")

    bids = reserve.resolve_bids_series(df, local, step_minutes=tou_step)
    standby = run(
        df,
        dev,
        local,
        tou_type=tou_type,
        contracts=contracts,
        tou_step_minutes=tou_step,
        bid_series=bids,
        prices=plan.get("prices"),
        period_schedule=period_schedule,
    )
    final, bids2, income, meta = reserve.run_reserve_layer(
        df, standby, dev, local, step_minutes=tou_step
    )
    if auto_meta is not None:
        meta["mode"] = "auto"
        meta["auto"] = auto_meta
        meta["recommended_schedule"] = sched
    return final, {"income": income, "meta": meta, "bids_mw_mean": float(bids2.mean())}


def _size_workers(n_tasks: int) -> int:
    """環境變數 SIM_SIZE_WORKERS；預設 min(8, CPU 數)。"""
    raw = os.environ.get("SIM_SIZE_WORKERS", "").strip()
    cap = max(1, int(raw)) if raw.isdigit() else max(1, min(8, os.cpu_count() or 4))
    return max(1, min(cap, n_tasks))


def _use_parallel_grid(n_tasks: int, n_rows: int) -> bool:
    """點數／列數太少時 ProcessPool 啟動成本大於收益。"""
    workers = _size_workers(n_tasks)
    if workers <= 1 or n_tasks < 4:
        return False
    return n_tasks >= max(6, workers) and n_rows * n_tasks >= 50_000


def _simulate_grid_point_job(payload: dict[str, Any]) -> tuple[float, float, dict[str, Any]]:
    """ProcessPool 工作函式（模組頂層，供 pickle）。"""
    summary = _simulate_point(
        payload["df"],
        payload["plan"],
        payload["contracts"],
        payload["settings"],
        pcs_kw=float(payload["pcs_kw"]),
        batt_kwh=float(payload["batt_kwh"]),
        tou_type=str(payload["tou_type"]),
        start_date=str(payload["start_date"]),
        end_date=str(payload["end_date"]),
        voltage_level=str(payload["voltage_level"]),
        tou_step=int(payload["tou_step"]),
        overage_rules=payload.get("overage_rules"),
        period_schedule=payload.get("period_schedule"),
    )
    return float(payload["pcs_kw"]), float(payload["batt_kwh"]), summary


def _simulate_grid_chunk_job(
    payload: dict[str, Any],
) -> list[tuple[float, float, dict[str, Any]]]:
    """同一 worker 共用負載資料，批次計算多個配置。"""
    return [
        _simulate_grid_point_job({**payload, "pcs_kw": pcs_kw, "batt_kwh": batt_kwh})
        for pcs_kw, batt_kwh in payload["points"]
    ]


def _simulate_grid_rows(
    grid: list[tuple[float, float]],
    *,
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    sim_settings: dict[str, Any],
    tou_type: str,
    start_date: str,
    end_date: str,
    voltage_level: str,
    tou_step: int,
    overage_rules: dict | None,
    before_total: int,
    period_schedule: dict | None = None,
) -> tuple[list[dict[str, Any]], dict[tuple[float, float], dict[str, Any]]]:
    """配置網格 dispatch + 計費；多點時 ProcessPool 平行。"""
    base = {
        "df": df,
        "plan": plan,
        "contracts": contracts,
        "settings": sim_settings,
        "tou_type": tou_type,
        "start_date": start_date,
        "end_date": end_date,
        "voltage_level": voltage_level,
        "tou_step": tou_step,
        "overage_rules": overage_rules,
        "period_schedule": period_schedule,
    }
    workers = _size_workers(len(grid))
    summaries: list[tuple[float, float, dict[str, Any]]] = []
    parallel = _use_parallel_grid(len(grid), len(df))

    if not parallel:
        for pcs_kw, batt_kwh in grid:
            summaries.append(
                _simulate_grid_point_job(
                    {**base, "pcs_kw": pcs_kw, "batt_kwh": batt_kwh}
                )
            )
    else:
        chunk_size = (len(grid) + workers - 1) // workers
        payloads = [
            {**base, "points": grid[i : i + chunk_size]}
            for i in range(0, len(grid), chunk_size)
        ]
        with ProcessPoolExecutor(max_workers=workers) as pool:
            summaries = [
                result
                for chunk in pool.map(_simulate_grid_chunk_job, payloads)
                for result in chunk
            ]

    rows: list[dict[str, Any]] = []
    after_by_key: dict[tuple[float, float], dict[str, Any]] = {}
    for pcs_kw, batt_kwh, after_summary in summaries:
        after_by_key[(pcs_kw, batt_kwh)] = after_summary
        after_total = int(after_summary["total"])
        bill_savings = before_total - after_total
        reserve_total = int((after_summary.get("reserve_income") or {}).get("total") or 0)
        total_benefit = bill_savings + reserve_total
        rows.append(
            {
                "pcs_kw": pcs_kw,
                "batt_kwh": batt_kwh,
                "hours": round(batt_kwh / pcs_kw, 3) if pcs_kw > 0 else 0,
                "bill_savings": bill_savings,
                "reserve_income_total": reserve_total,
                "savings": total_benefit,
                "after_total": after_total,
                "after_basic_total": int(after_summary.get("basic_total") or 0),
                "after_overage_total": int(after_summary.get("overage_total") or 0),
                "after_energy_total": int(after_summary.get("energy_total") or 0),
                "reserve_income": after_summary.get("reserve_income"),
                "reserve_meta": after_summary.get("reserve_meta"),
                **{k: after_summary[k] for k in _METRIC_KEYS},
            }
        )
    return rows, after_by_key


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
) -> dict[str, Any]:
    """單一 (pcs,batt) dispatch + 計費（備轉收入另計）。"""
    disp, reserve_info = _dispatch_for_point(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        tou_step=tou_step,
        period_schedule=period_schedule,
    )
    bill_df = df.copy()
    bill_df["kW"] = disp["grid_kw"]
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
    return {
        **bill,
        **_dispatch_metrics(
            disp,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            soc_min=float(settings.get("socMin", 0.1)),
            soc_max=float(settings.get("socMax", 0.9)),
            charge_eff=float(settings.get("chargeEff", 0.85)),
        ),
        "reserve_income": reserve_income,
        "reserve_meta": (reserve_info or {}).get("meta"),
        "bill_savings": None,  # 由外層填 before - after
    }


def run_size(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    tou_type: str,
    start_date: str,
    end_date: str,
    voltage_level: str,
    schedule: dict | None = None,
    overage_rules: dict | None = None,
) -> dict[str, Any]:
    """負載樣本配置組合 → dispatch → savings → recommended。"""
    effective_contracts, contract_adjustment = prepare_effective_contracts(
        df, contracts, settings, tou_type
    )
    effective_cap = ContractCapacity.from_dict(effective_contracts)
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    sample_full = plan_sample_grid(
        df,
        effective_cap,
        tou_type,
        buffer_kw=buffer_kw,
        schedule=schedule,
    )
    grid = [
        (float(c["pcs_kw"]), float(c["batt_kwh"]))
        for c in sample_full.get("combinations") or []
    ]
    peak_h = int(sample_full.get("peak_hours_max") or 1)
    sample_source = str(sample_full.get("sample_source") or "fallback")

    sim_settings = {**settings, "functions": settings.get("functions") or ["tou"]}
    skipped = skipped_functions(sim_settings.get("functions"))

    before = calc_full_bill(
        df,
        plan,
        effective_contracts,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=overage_rules,
    )
    before_total = int(before["total"])
    before_summary = _bill_totals(before)

    tou_step = int(plan.get("tou_slot_minutes") or 60)
    rows, after_by_key = _simulate_grid_rows(
        grid,
        df=df,
        plan=plan,
        contracts=effective_contracts,
        sim_settings=sim_settings,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        tou_step=tou_step,
        overage_rules=overage_rules,
        before_total=before_total,
        period_schedule=schedule,
    )

    picked = pick_results(rows, before_total=before_total)
    recommended = picked["recommended"]
    best_effort = picked["best_effort"]
    max_util = picked["max_util"]
    highlight = recommended or best_effort
    after_rec = before_summary
    if highlight:
        after_rec = _bill_totals(
            after_by_key.get(
                (float(highlight["pcs_kw"]), float(highlight["batt_kwh"])),
                before_summary,
            )
        )

    savings = int(highlight["savings"]) if highlight else 0
    bill_savings = int(highlight.get("bill_savings") or savings) if highlight else 0
    reserve_income = (highlight or {}).get("reserve_income") or {
        "capacity": 0,
        "performance": 0,
        "activation_energy": 0,
        "total": 0,
        "monthly": {},
        "events": [],
        "data_note": "15min_estimate",
    }
    reserve_meta = (highlight or {}).get("reserve_meta")

    dispatch_charts = None
    if highlight:
        dispatch_charts = run_dispatch_charts(
            df,
            plan,
            effective_contracts,
            sim_settings,
            pcs_kw=float(highlight["pcs_kw"]),
            batt_kwh=float(highlight["batt_kwh"]),
            tou_type=tou_type,
            period_schedule=schedule,
        )["charts"]

    return {
        "contract_adjustment": contract_adjustment,
        "profile_stats": sample_full["profile_stats"],
        "peak_hours_max": peak_h,
        "two_cycle_hours_max": sample_full.get("two_cycle_hours_max"),
        "sample_source": sample_source,
        "grid_points": len(picked["grid"]),
        "skipped": skipped,
        "functions": list(sim_settings.get("functions") or ["tou"]),
        "viable": picked["viable"],
        "grid": picked["grid"],
        "recommended": recommended,
        "best_effort": best_effort,
        "max_util": max_util,
        "savings": savings,
        "bill_savings": bill_savings,
        "reserve_income": reserve_income,
        "reserve_meta": reserve_meta,
        "savings_pct": highlight["savings_pct"] if highlight else 0.0,
        "before": before_summary,
        "after": after_rec,
        "dispatch_charts": dispatch_charts,
    }


def run_dispatch_charts(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    period_schedule: dict | None = None,
) -> dict[str, Any]:
    """單一 (pcs,batt) 調度圖（按需載入）。"""
    sim_settings = {**settings, "functions": settings.get("functions") or ["tou"]}
    effective_contracts, _ = prepare_effective_contracts(
        df, contracts, sim_settings, tou_type
    )
    tou_step = int(plan.get("tou_slot_minutes") or 60)
    disp, _reserve_info = _dispatch_for_point(
        df,
        plan,
        effective_contracts,
        sim_settings,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        tou_step=tou_step,
        period_schedule=period_schedule,
    )
    charts = build_dispatch_charts(df, disp)
    charts["pcs_kw"] = float(pcs_kw)
    charts["batt_kwh"] = float(batt_kwh)
    return {
        "key": _dispatch_chart_key(pcs_kw, batt_kwh),
        "pcs_kw": float(pcs_kw),
        "batt_kwh": float(batt_kwh),
        "charts": charts,
    }
