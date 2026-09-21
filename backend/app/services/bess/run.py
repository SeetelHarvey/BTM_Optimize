"""量體試算編排。"""

import os
from concurrent.futures import ProcessPoolExecutor
from io import BytesIO
from typing import Any

import pandas as pd

from app.services.bess.device import Device
from app.services.bess.dispatch import run, skipped_functions
from app.services.bess.size_grid import (
    normalize_energy_seeds,
    normalize_sizing_strategies,
    plan_sample_grid,
    pick_results,
    sample_from_profile,
)
from app.services.billing import calc_full_bill
from app.services.charts import build_dispatch_charts
from app.services.contracts import (
    ContractCapacity,
    cumulative_ceiling,
    free_off_peak_kw,
    hierarchical_contract_candidates,
    suggest_regular_kw_from_dispatch,
    validate,
    with_off_peak_boost,
)
from app.services.features import reserve, tou
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
    *,
    allow_off_peak_boost: bool = False,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """試算用有效契約；離峰免費增額預設改由契約候選層處理。"""
    cap = ContractCapacity.from_dict(contracts)
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    auto_adj = bool(allow_off_peak_boost) and bool(
        settings.get("autoAdjustOffPeakContract")
    )
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
    prices: dict | None = None,
) -> dict[str, Any]:
    """試算前樣本預覽（尚未 dispatch）；與 run_size 同一套有效契約／組合。"""
    effective_contracts, contract_adjustment = prepare_effective_contracts(
        df, contracts, settings, tou_type
    )
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    tiers = _settings_tiers(settings)
    energy_keys = _settings_energy_seeds(settings)
    sample = plan_sample_grid(
        df,
        ContractCapacity.from_dict(effective_contracts),
        tou_type,
        buffer_kw=buffer_kw,
        schedule=schedule,
        strategies=tiers,
        energy_keys=energy_keys,
        prices=prices,
        charge_eff=float(settings.get("chargeEff") or 0.85),
        include_half_peak=settings.get("includeHalfPeak"),
        soc_min=float(settings.get("socMin") or 0.1),
        soc_max=float(settings.get("socMax") or 0.9),
    )
    return {
        "diagnosis": sample.get("diagnosis"),
        "strategies": sample.get("strategies") or tiers,
        "energy_keys": sample.get("energy_keys") or energy_keys,
        "profile_stats": sample["profile_stats"],
        "sample_source": sample["sample_source"],
        "grid_points": sample["grid_points"],
        "combinations": sample.get("combinations"),
        "contract_adjustment": contract_adjustment,
        "regular_kw": float(ContractCapacity.from_dict(effective_contracts).regular_kw),
    }


def profile_bundle_from_sample(sample_result: dict[str, Any]) -> dict[str, Any]:
    """從 sample 結果抽出可重用的 profile 層。"""
    return {
        "diagnosis": sample_result.get("diagnosis"),
        "profile_stats": sample_result["profile_stats"],
        "contract_adjustment": sample_result.get("contract_adjustment"),
        "regular_kw": float(sample_result.get("regular_kw") or 0),
    }


def run_sample_from_profile_cache(
    profile_cache: dict[str, Any],
    settings: dict[str, Any],
    *,
    tou_type: str,
    schedule: dict | None = None,
) -> dict[str, Any]:
    """profile 快取命中後只重組策略組合。"""
    tiers = _settings_tiers(settings)
    energy_keys = _settings_energy_seeds(settings)
    sample = sample_from_profile(
        profile_cache["profile_stats"],
        profile_cache["diagnosis"],
        tou_type=tou_type,
        schedule=schedule,
        strategies=tiers,
        energy_keys=energy_keys,
    )
    return {
        "diagnosis": sample.get("diagnosis"),
        "strategies": sample.get("strategies") or tiers,
        "energy_keys": sample.get("energy_keys") or energy_keys,
        "profile_stats": sample["profile_stats"],
        "sample_source": sample["sample_source"],
        "grid_points": sample["grid_points"],
        "combinations": sample.get("combinations"),
        "contract_adjustment": profile_cache.get("contract_adjustment"),
        "regular_kw": float(profile_cache.get("regular_kw") or 0),
    }


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
    return {
        "rows": rows,
        "baseline_tou": baseline_tou,
        "simulate_tou": simulate_tou,
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


def _contract_feasible(
    disp: pd.DataFrame,
    contracts: dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
) -> tuple[bool, str]:
    """任一 period 超出契約累計上限（含裕度）→ 不可行。"""
    if disp is None or disp.empty or "grid_kw" not in disp.columns:
        return False, "no_dispatch"
    if "period" not in disp.columns:
        return True, "ok"
    cap = validate(ContractCapacity.from_dict(contracts), tou_type)
    for period, part in disp.groupby(disp["period"].astype(str)):
        try:
            ceiling = cumulative_ceiling(str(period), cap)
        except ValueError:
            continue
        limit = max(0.0, float(ceiling) - float(buffer_kw))
        if float(part["grid_kw"].astype(float).max()) > limit + 1e-6:
            return False, f"exceed_{period}"
    return True, "ok"


_FEASIBILITY_PERIODS = (
    "peak",
    "half_peak",
    "saturday_half_peak",
    "off_peak",
)


def _feasibility_by_period(
    disp: pd.DataFrame | None,
    contracts: dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
) -> list[dict[str, Any]]:
    """各時段 max grid／累計上限／裕度／是否通過。"""
    if disp is None or disp.empty or "grid_kw" not in disp.columns:
        return []
    if "period" not in disp.columns:
        return []
    cap = validate(ContractCapacity.from_dict(contracts), tou_type)
    out: list[dict[str, Any]] = []
    for period in _FEASIBILITY_PERIODS:
        part = disp.loc[disp["period"].astype(str) == period]
        if part.empty:
            continue
        try:
            ceiling = float(cumulative_ceiling(period, cap))
        except ValueError:
            continue
        limit = max(0.0, ceiling - float(buffer_kw))
        max_grid = float(part["grid_kw"].astype(float).max())
        out.append(
            {
                "period": period,
                "max_grid_kw": round(max_grid, 3),
                "ceiling_kw": round(ceiling, 3),
                "limit_kw": round(limit, 3),
                "margin_kw": round(limit - max_grid, 3),
                "ok": max_grid <= limit + 1e-6,
            }
        )
    return out


def _final_constraints(
    *,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    tou_type: str,
    pcs_kw: float,
    batt_kwh: float,
    buffer_kw: float,
    reserve_meta: dict[str, Any] | None,
) -> dict[str, Any]:
    """採用契約與硬限制摘要。"""
    cap = validate(ContractCapacity.from_dict(contracts), tou_type)
    ceilings = {}
    for period in _FEASIBILITY_PERIODS:
        try:
            ceilings[period] = round(float(cumulative_ceiling(period, cap)), 3)
        except ValueError:
            continue
    soc_min, soc_max = _effective_soc_window(
        settings, pcs_kw=pcs_kw, batt_kwh=batt_kwh
    )
    return {
        "contracts": dict(contracts),
        "ceilings": ceilings,
        "buffer_kw": float(buffer_kw),
        "pcs_kw": float(pcs_kw),
        "batt_kwh": float(batt_kwh),
        "soc_min": float(soc_min),
        "soc_max": float(soc_max),
        "anti_export_kw": float(settings.get("antiExportKw") or 0),
        "reserve_bid": (reserve_meta or {}).get("recommended_schedule")
        or (reserve_meta or {}).get("bid_mw"),
        "reserve_meta": reserve_meta,
    }


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
) -> tuple[pd.DataFrame, dict[str, Any] | None, dict[str, Any] | None]:
    """單一 (pcs,batt) dispatch；回傳 (disp, reserve_info, tou_meta)。"""
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
    local, tou_meta = tou.prepare_auto_tou(
        df,
        local,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        prices=plan.get("prices"),
        period_schedule=period_schedule,
        tou_step_minutes=tou_step,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=float(settings.get("chargeEff", 0.85)),
    )

    use_reserve = "reserve" in (settings.get("functions") or [])

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
        return disp, None, tou_meta

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
                {**local, "reserveSchedule": reserve.empty_schedule(tou_step)},
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
    return final, {"income": income, "meta": meta, "bids_mw_mean": float(bids2.mean())}, tou_meta


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
        baseline_df=payload.get("baseline_df"),
        baseline_tou=payload.get("baseline_tou"),
        simulate_tou=payload.get("simulate_tou") or str(payload["tou_type"]),
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
    baseline_df: pd.DataFrame | None = None,
    baseline_tou: str | None = None,
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
        "baseline_df": baseline_df if baseline_df is not None else df,
        "baseline_tou": baseline_tou or tou_type,
        "simulate_tou": tou_type,
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
        rows.append(
            {
                "pcs_kw": pcs_kw,
                "batt_kwh": batt_kwh,
                "hours": round(batt_kwh / pcs_kw, 3) if pcs_kw > 0 else 0,
                "bill_savings": bill_savings,
                "reserve_income_total": reserve_total,
                # 第1層排序只用電費；備轉合計留給第2層
                "savings": bill_savings,
                "after_total": after_total,
                "after_basic_total": int(after_summary.get("basic_total") or 0),
                "after_overage_total": int(after_summary.get("overage_total") or 0),
                "after_energy_total": int(after_summary.get("energy_total") or 0),
                "reserve_income": after_summary.get("reserve_income"),
                "reserve_meta": after_summary.get("reserve_meta"),
                "tou_meta": after_summary.get("tou_meta"),
                "energy_transfer": after_summary.get("energy_transfer"),
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
    baseline_df: pd.DataFrame | None = None,
    baseline_tou: str | None = None,
    simulate_tou: str | None = None,
    return_disp: bool = False,
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


def _functions_without_reserve(functions: list[str] | None) -> list[str]:
    fns = [f for f in (functions or ["tou"]) if f != "reserve"]
    return fns or ["tou"]


def _unique_pick_points(
    recommended: dict | None,
    best_effort: dict | None,
    max_util: dict | None,
) -> list[tuple[float, float]]:
    seen: set[tuple[float, float]] = set()
    out: list[tuple[float, float]] = []
    for row in (recommended, best_effort, max_util):
        if not row:
            continue
        key = (round(float(row["pcs_kw"]), 3), round(float(row["batt_kwh"]), 3))
        if key in seen:
            continue
        seen.add(key)
        out.append((float(row["pcs_kw"]), float(row["batt_kwh"])))
    return out


def _row_key_pair(pcs_kw: float, batt_kwh: float) -> tuple[float, float]:
    return (round(float(pcs_kw), 3), round(float(batt_kwh), 3))


def _stage1_target_row(
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


def _merge_stage2_into_row(
    row: dict[str, Any] | None,
    stage2_point: dict[str, Any],
) -> dict[str, Any] | None:
    """覆寫展示數值；保留 pcs／batt／身分旗標。"""
    if not row:
        return None
    merged = dict(row)
    for k in (
        "bill_savings",
        "savings",
        "savings_pct",
        "reserve_income_total",
        "reserve_income",
        "reserve_meta",
        "tou_meta",
        "energy_transfer",
        "after_total",
        "after_basic_total",
        "after_overage_total",
        "after_energy_total",
        "dispatch_charts",
        "stage2_contracts",
        "contract_reduction",
        "stage2_warning",
        *_METRIC_KEYS,
    ):
        if k in stage2_point:
            merged[k] = stage2_point[k]
    return merged


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


def run_size_stage1(
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
    cached_profile: dict[str, Any] | None = None,
    baseline_tou_type: str | None = None,
    baseline_contracts: dict[str, Any] | None = None,
    baseline_plan: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
) -> dict[str, Any]:
    """量體選點＋電價調度（不含契約候選／備轉）。"""
    import time

    t0 = time.perf_counter()
    timing: dict[str, Any] = {}
    dispatch_count = 0

    baseline_tou = baseline_tou_type or tou_type
    baseline_contracts = (
        baseline_contracts if baseline_contracts is not None else contracts
    )
    baseline_plan = baseline_plan if baseline_plan is not None else plan
    baseline_df = baseline_df if baseline_df is not None else df
    same_context = baseline_tou == tou_type and _contracts_fingerprint(
        baseline_contracts
    ) == _contracts_fingerprint(contracts)

    effective_contracts, contract_adjustment = prepare_effective_contracts(
        df, contracts, settings, tou_type, allow_off_peak_boost=False
    )
    effective_cap = ContractCapacity.from_dict(effective_contracts)
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    tiers = _settings_tiers(settings)
    energy_keys = _settings_energy_seeds(settings)
    t_profile = time.perf_counter()
    if (
        isinstance(cached_profile, dict)
        and isinstance(cached_profile.get("profile_stats"), dict)
        and isinstance(cached_profile.get("diagnosis"), dict)
    ):
        sample_full = sample_from_profile(
            cached_profile["profile_stats"],
            cached_profile["diagnosis"],
            tou_type=tou_type,
            schedule=schedule,
            strategies=tiers,
            energy_keys=energy_keys,
        )
    else:
        sample_full = plan_sample_grid(
            df,
            effective_cap,
            tou_type,
            buffer_kw=buffer_kw,
            schedule=schedule,
            strategies=tiers,
            energy_keys=energy_keys,
            prices=plan.get("prices"),
            charge_eff=float(settings.get("chargeEff") or 0.85),
            include_half_peak=settings.get("includeHalfPeak"),
            soc_min=float(settings.get("socMin") or 0.1),
            soc_max=float(settings.get("socMax") or 0.9),
        )
    timing["profile_ms"] = round((time.perf_counter() - t_profile) * 1000, 1)
    grid = [
        (float(c["pcs_kw"]), float(c["batt_kwh"]))
        for c in sample_full.get("combinations") or []
    ]
    sample_source = str(sample_full.get("sample_source") or "none")

    user_functions = list(settings.get("functions") or ["tou"])
    if "large_user" in user_functions and float(effective_cap.regular_kw) < 5000:
        user_functions = [f for f in user_functions if f != "large_user"]
    want_reserve = "reserve" in user_functions
    want_contract = bool(settings.get("evaluateContractReduction"))
    need_full = want_reserve or want_contract

    sim_settings_l1 = {**settings, "functions": _functions_without_reserve(user_functions)}
    skipped = skipped_functions(user_functions)
    if "large_user" in (settings.get("functions") or []):
        skipped = sorted(set(skipped) | {"large_user"})
    large_user_status = None
    if "large_user" in (settings.get("functions") or []):
        large_user_status = (
            "ineligible"
            if float(effective_cap.regular_kw) < 5000
            else "pending"
        )

    if same_context:
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
    else:
        base_cap = validate(
            ContractCapacity.from_dict(baseline_contracts), baseline_tou
        )
        before = calc_full_bill(
            baseline_df,
            baseline_plan,
            base_cap.to_dict(),
            tou_type=baseline_tou,
            start_date=start_date,
            end_date=end_date,
            voltage_level=voltage_level,
            overage_rules=overage_rules,
        )
    before_total = int(before["total"])
    before_summary = _bill_totals(before)

    tou_step = int(plan.get("tou_slot_minutes") or 60)
    t_grid = time.perf_counter()
    rows, after_by_key = _simulate_grid_rows(
        grid,
        df=df,
        plan=plan,
        contracts=effective_contracts,
        sim_settings=sim_settings_l1,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        tou_step=tou_step,
        overage_rules=overage_rules,
        before_total=before_total,
        period_schedule=schedule,
        baseline_df=baseline_df,
        baseline_tou=baseline_tou,
    )
    timing["stage1_dispatch_ms"] = round((time.perf_counter() - t_grid) * 1000, 1)
    dispatch_count += len(grid)

    picked = pick_results(rows, before_total=before_total)
    recommended = picked["recommended"]
    best_effort = picked["best_effort"]
    max_util = picked["max_util"]
    grid_out = list(picked["grid"])
    viable = picked["viable"]

    stage1 = {
        "viable": viable,
        "recommended": recommended,
        "best_effort": best_effort,
        "max_util": max_util,
        "before": before_summary,
        "contracts": effective_contracts,
        "label": "engineering_balance",
    }

    highlight = recommended or best_effort
    sizing_save = int(highlight["savings"]) if highlight else 0
    benefit_split: dict[str, Any] = {
        "sizing_savings": sizing_save,
        "contract_gain": 0,
        "reserve_gain": 0,
        "total": sizing_save,
    }

    after_rec = before_summary
    if highlight:
        if highlight.get("after_total") is not None:
            after_rec = {
                "total": int(highlight["after_total"]),
                "basic_total": highlight.get("after_basic_total"),
                "overage_total": highlight.get("after_overage_total"),
                "energy_total": highlight.get("after_energy_total"),
            }
        else:
            after_rec = _bill_totals(
                after_by_key.get(
                    (float(highlight["pcs_kw"]), float(highlight["batt_kwh"])),
                    before_summary,
                )
            )

    savings = int(highlight["savings"]) if highlight else 0
    bill_savings = (
        int(highlight["bill_savings"])
        if highlight and highlight.get("bill_savings") is not None
        else savings
    )
    reserve_income = {
        "capacity": 0,
        "performance": 0,
        "activation_energy": 0,
        "total": 0,
        "monthly": {},
        "events": [],
        "data_note": "15min_estimate",
    }
    reserve_meta = None
    tou_meta = (highlight or {}).get("tou_meta")
    energy_transfer = (highlight or {}).get("energy_transfer")

    dispatch_charts = (highlight or {}).get("dispatch_charts")
    if dispatch_charts is None and highlight:
        chart_settings = {
            **sim_settings_l1,
            "autoAdjustOffPeakContract": False,
        }
        charts_payload = run_dispatch_charts(
            df,
            plan,
            effective_contracts,
            chart_settings,
            pcs_kw=float(highlight["pcs_kw"]),
            batt_kwh=float(highlight["batt_kwh"]),
            tou_type=tou_type,
            period_schedule=schedule,
            baseline_df=baseline_df,
            baseline_tou=baseline_tou,
        )
        dispatch_count += 1
        if energy_transfer is None:
            energy_transfer = charts_payload.get("energy_transfer")
        dispatch_charts = charts_payload.get("charts")
        if tou_meta is None:
            tou_meta = charts_payload.get("tou_meta")

    savings_pct = (
        highlight.get("savings_pct")
        if highlight and highlight.get("savings_pct") is not None
        else (
            round(100.0 * savings / before_total, 2) if before_total > 0 else 0.0
        )
    )
    timing["total_ms"] = round((time.perf_counter() - t0) * 1000, 1)
    timing["dispatch_count"] = dispatch_count

    return {
        "contract_adjustment": contract_adjustment,
        "diagnosis": sample_full.get("diagnosis"),
        "strategies": sample_full.get("strategies") or tiers,
        "profile_stats": sample_full["profile_stats"],
        "sample_source": sample_source,
        "grid_points": len(grid_out),
        "skipped": skipped,
        "large_user_status": large_user_status,
        "functions": user_functions,
        "viable": viable,
        "grid": grid_out,
        "recommended": recommended,
        "best_effort": best_effort,
        "max_util": max_util,
        "savings": savings,
        "bill_savings": bill_savings,
        "reserve_income": reserve_income,
        "reserve_meta": reserve_meta,
        "tou_meta": tou_meta,
        "energy_transfer": energy_transfer,
        "savings_pct": savings_pct,
        "before": before_summary,
        "after": after_rec,
        "baseline_tou_type": baseline_tou,
        "simulate_tou_type": tou_type,
        "dispatch_charts": dispatch_charts,
        "stage1": stage1,
        "stage2": None,
        "benefit_split": benefit_split,
        "timing": timing,
        "evaluate_contract_reduction": want_contract,
        "final": recommended,
        "need_full": bool(need_full and recommended),
        "want_reserve": want_reserve,
        "want_contract": want_contract,
        "sizing_dispatch_charts": dispatch_charts,
    }


def run_size_stage2(
    stage1_result: dict[str, Any],
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
    baseline_tou_type: str | None = None,
    baseline_df: pd.DataFrame | None = None,
    pcs_kw: float | None = None,
    batt_kwh: float | None = None,
) -> dict[str, Any]:
    """對指定量體（預設推薦）跑契約候選＋備轉；不重選量體。"""
    import time

    out = dict(stage1_result)
    recommended = out.get("recommended")
    target = _stage1_target_row(out, pcs_kw, batt_kwh)
    want_reserve = bool(out.get("want_reserve")) or (
        "reserve" in (out.get("functions") or [])
    )
    want_contract = bool(out.get("want_contract")) or bool(
        settings.get("evaluateContractReduction")
    )
    if not target or not (want_reserve or want_contract):
        out["need_full"] = False
        out["stage2"] = None
        return out

    t_s2 = time.perf_counter()
    timing = dict(out.get("timing") or {})
    dispatch_count = int(timing.get("dispatch_count") or 0)

    baseline_tou = baseline_tou_type or tou_type
    baseline_df = baseline_df if baseline_df is not None else df
    stage1 = out.get("stage1") or {}
    effective_contracts = dict(stage1.get("contracts") or contracts)
    effective_cap = ContractCapacity.from_dict(effective_contracts)
    before_summary = out.get("before") or stage1.get("before") or {}
    before_total = int(before_summary.get("total") or 0)
    buffer_kw = float(settings.get("demandBufferKw") or 0)
    user_functions = list(out.get("functions") or settings.get("functions") or ["tou"])
    sim_settings_l1 = {
        **settings,
        "functions": _functions_without_reserve(user_functions),
    }
    sim_settings_l2 = {**settings, "functions": user_functions}
    tou_step = int(plan.get("tou_slot_minutes") or 60)

    pcs_kw = float(target["pcs_kw"])
    batt_kwh = float(target["batt_kwh"])
    stage1_total = int(target.get("after_total") or 0)
    if stage1_total <= 0 and recommended and _row_key_pair(
        recommended["pcs_kw"], recommended["batt_kwh"]
    ) == _row_key_pair(pcs_kw, batt_kwh):
        stage1_total = int(out.get("after", {}).get("total") or 0)
    stage1_bill_save = before_total - stage1_total

    contracts_l2 = dict(effective_contracts)
    contract_candidates_out: list[dict[str, Any]] = []
    selected_candidate: dict[str, Any] | None = None
    reduction_info = None
    contract_disp = None

    if want_contract:
        disp_l1, _, _ = _dispatch_for_point(
            df,
            plan,
            effective_contracts,
            sim_settings_l1,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=tou_type,
            tou_step=tou_step,
            period_schedule=schedule,
        )
        dispatch_count += 1
        residual = suggest_regular_kw_from_dispatch(
            disp_l1,
            current_regular_kw=float(effective_cap.regular_kw),
            buffer_kw=buffer_kw,
            target_periods=frozenset({"peak"}),
        )
        reduction_info = residual
        candidates = hierarchical_contract_candidates(
            contracts,
            tou_type,
            residual=residual,
            buffer_kw=buffer_kw,
            apply_free_boost=bool(settings.get("autoAdjustOffPeakContract")),
        )
        best_bill = None
        for cand in candidates:
            c_dict = cand["contracts"]
            summary = _simulate_point(
                df,
                plan,
                c_dict,
                sim_settings_l1,
                pcs_kw=pcs_kw,
                batt_kwh=batt_kwh,
                tou_type=tou_type,
                start_date=start_date,
                end_date=end_date,
                voltage_level=voltage_level,
                tou_step=tou_step,
                overage_rules=overage_rules,
                period_schedule=schedule,
                baseline_df=baseline_df,
                baseline_tou=baseline_tou,
                simulate_tou=tou_type,
                return_disp=True,
            )
            dispatch_count += 1
            ok, reason = _contract_feasible(
                summary.get("disp"),
                c_dict,
                tou_type,
                buffer_kw=buffer_kw,
            )
            entry = {
                **cand,
                "feasible": ok,
                "reject_reason": None if ok else reason,
                "bill_total": int(summary["total"]) if ok else None,
            }
            contract_candidates_out.append(entry)
            if not ok:
                continue
            total = int(summary["total"])
            if best_bill is None or total < best_bill or (
                total == best_bill
                and float(cand["regular_kw"])
                < float((selected_candidate or {}).get("regular_kw") or 1e18)
            ):
                best_bill = total
                selected_candidate = entry
                contracts_l2 = c_dict
                contract_disp = summary.get("disp")

        if selected_candidate is None:
            contracts_l2 = dict(effective_contracts)
            contract_disp = disp_l1
            selected_candidate = {
                "id": "current",
                "contracts": contracts_l2,
                "feasible": True,
                "reject_reason": None,
                "bill_total": stage1_total,
                "regular_kw": float(effective_cap.regular_kw),
                "off_peak_replaced_kw": 0.0,
                "free_off_peak_added_kw": 0.0,
            }

    contract_summary = _simulate_point(
        df,
        plan,
        contracts_l2,
        sim_settings_l1,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        tou_step=tou_step,
        overage_rules=overage_rules,
        period_schedule=schedule,
        baseline_df=baseline_df,
        baseline_tou=baseline_tou,
        simulate_tou=tou_type,
        return_disp=contract_disp is None,
    )
    dispatch_count += 1
    if contract_disp is None:
        contract_disp = contract_summary.get("disp")
    contract_total = int(contract_summary["total"])
    contract_gain = stage1_total - contract_total

    final_summary = contract_summary
    reserve_total = 0
    reserve_warning = None
    if want_reserve:
        final_summary = _simulate_point(
            df,
            plan,
            contracts_l2,
            sim_settings_l2,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=tou_type,
            start_date=start_date,
            end_date=end_date,
            voltage_level=voltage_level,
            tou_step=tou_step,
            overage_rules=overage_rules,
            period_schedule=schedule,
            baseline_df=baseline_df,
            baseline_tou=baseline_tou,
            simulate_tou=tou_type,
            return_disp=True,
        )
        dispatch_count += 3
        after_total = int(final_summary["total"])
        reserve_income = final_summary.get("reserve_income") or {}
        reserve_total = int(reserve_income.get("total") or 0)
        bill_delta = after_total - contract_total
        if bill_delta > reserve_total:
            final_summary = {
                **contract_summary,
                "reserve_income": {
                    "capacity": 0,
                    "performance": 0,
                    "activation_energy": 0,
                    "total": 0,
                    "monthly": {},
                    "events": [],
                    "data_note": "15min_estimate",
                },
                "reserve_meta": {
                    "mode": "auto",
                    "rolled_back": True,
                    "reason": "no_net_gain",
                },
                "charts": final_summary.get("charts")
                or (
                    build_dispatch_charts(df, contract_disp)
                    if contract_disp is not None
                    else None
                ),
                "disp": contract_disp,
            }
            reserve_total = 0
            reserve_warning = "reserve_no_net_gain"
            after_total = contract_total
        else:
            after_total = int(final_summary["total"])
    else:
        after_total = contract_total
        if contract_disp is not None and final_summary.get("charts") is None:
            final_summary = {
                **final_summary,
                "charts": build_dispatch_charts(df, contract_disp),
                "disp": contract_disp,
            }

    reserve_gain = (contract_total - after_total) + reserve_total
    total_benefit = stage1_bill_save + contract_gain + reserve_gain
    benefit_split = {
        "sizing_savings": stage1_bill_save,
        "contract_gain": contract_gain,
        "reserve_gain": reserve_gain,
        "total": total_benefit,
    }

    final_disp = final_summary.get("disp")
    if final_disp is None and contract_disp is not None:
        final_disp = contract_disp
    reserve_meta = final_summary.get("reserve_meta")
    constraints = _final_constraints(
        contracts=contracts_l2,
        settings=(
            sim_settings_l2
            if want_reserve and reserve_warning is None
            else sim_settings_l1
        ),
        tou_type=tou_type,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        buffer_kw=buffer_kw,
        reserve_meta=reserve_meta,
    )
    feasibility = _feasibility_by_period(
        final_disp, contracts_l2, tou_type, buffer_kw=buffer_kw
    )
    proposal = {
        "contracts": {
            "original": effective_contracts,
            "suggested": contracts_l2,
            "selected": selected_candidate,
            "candidates": contract_candidates_out,
            "reduction": reduction_info,
        },
        "reserve": {
            "enabled": want_reserve,
            "income": final_summary.get("reserve_income"),
            "meta": reserve_meta,
            "rolled_back": bool((reserve_meta or {}).get("rolled_back")),
            "reason": (reserve_meta or {}).get("reason") or reserve_warning,
        },
    }

    point = {
        "pcs_kw": pcs_kw,
        "batt_kwh": batt_kwh,
        "hours": round(batt_kwh / pcs_kw, 3) if pcs_kw > 0 else 0,
        "bill_savings": stage1_bill_save + contract_gain,
        "reserve_income_total": reserve_total,
        "savings": total_benefit,
        "savings_pct": (
            round(100.0 * total_benefit / before_total, 2) if before_total > 0 else 0.0
        ),
        "after_total": after_total,
        "after_basic_total": int(final_summary.get("basic_total") or 0),
        "after_overage_total": int(final_summary.get("overage_total") or 0),
        "after_energy_total": int(final_summary.get("energy_total") or 0),
        "reserve_income": final_summary.get("reserve_income"),
        "reserve_meta": reserve_meta,
        "tou_meta": final_summary.get("tou_meta") or target.get("tou_meta"),
        "energy_transfer": final_summary.get("energy_transfer"),
        "dispatch_charts": final_summary.get("charts"),
        "stage2_contracts": contracts_l2,
        "contract_reduction": reduction_info,
        "contract_candidates": contract_candidates_out,
        "selected_contract": selected_candidate,
        "benefit_split": benefit_split,
        "before": before_summary,
        "after": _bill_totals(
            {
                "total": after_total,
                "basic_total": final_summary.get("basic_total"),
                "overage_total": final_summary.get("overage_total"),
                "energy_total": final_summary.get("energy_total"),
            }
        ),
        "stage2_warning": reserve_warning,
        "proposal": proposal,
        "constraints": constraints,
        "feasibility": feasibility,
        **{k: final_summary[k] for k in _METRIC_KEYS if k in final_summary},
    }
    stage2 = {
        "enabled": True,
        "reserve": want_reserve,
        "evaluate_contract_reduction": want_contract,
        "points": [point],
        "final": point,
        "benefit_split": benefit_split,
        "proposal": proposal,
    }

    timing["stage2_ms"] = round((time.perf_counter() - t_s2) * 1000, 1)
    timing["dispatch_count"] = dispatch_count
    timing["total_ms"] = round(
        float(timing.get("total_ms") or 0) + float(timing["stage2_ms"]), 1
    )

    is_recommended = bool(
        recommended
        and _row_key_pair(recommended["pcs_kw"], recommended["batt_kwh"])
        == _row_key_pair(pcs_kw, batt_kwh)
    )
    out["stage2"] = stage2
    out["timing"] = timing
    out["evaluate_contract_reduction"] = want_contract
    out["need_full"] = False
    # 非推薦點只附 stage2，不覆寫主報告頂層（避免污染推薦口徑）
    if is_recommended:
        out.update(
            {
                "savings": total_benefit,
                "bill_savings": stage1_bill_save + contract_gain,
                "reserve_income": final_summary.get("reserve_income")
                or out.get("reserve_income"),
                "reserve_meta": reserve_meta,
                "tou_meta": point.get("tou_meta"),
                "energy_transfer": point.get("energy_transfer"),
                "savings_pct": point["savings_pct"],
                "after": point["after"],
                "dispatch_charts": point.get("dispatch_charts")
                or out.get("dispatch_charts"),
                "benefit_split": benefit_split,
                "final": point,
                "proposal": proposal,
            }
        )
    return out


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
    cached_profile: dict[str, Any] | None = None,
    baseline_tou_type: str | None = None,
    baseline_contracts: dict[str, Any] | None = None,
    baseline_plan: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
) -> dict[str, Any]:
    """短名單量體 → 工程折衷三點 → 階層契約候選 → 最終備轉一次。"""
    stage1 = run_size_stage1(
        df,
        plan,
        contracts,
        settings,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        schedule=schedule,
        overage_rules=overage_rules,
        cached_profile=cached_profile,
        baseline_tou_type=baseline_tou_type,
        baseline_contracts=baseline_contracts,
        baseline_plan=baseline_plan,
        baseline_df=baseline_df,
    )
    if not stage1.get("need_full"):
        return stage1
    return run_size_stage2(
        stage1,
        df,
        plan,
        contracts,
        settings,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        schedule=schedule,
        overage_rules=overage_rules,
        baseline_tou_type=baseline_tou_type,
        baseline_df=baseline_df,
    )


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
    baseline_df: pd.DataFrame | None = None,
    baseline_tou: str | None = None,
) -> dict[str, Any]:
    """單一 (pcs,batt) 調度圖（按需載入）。"""
    sim_settings = {**settings, "functions": settings.get("functions") or ["tou"]}
    effective_contracts, _ = prepare_effective_contracts(
        df, contracts, sim_settings, tou_type
    )
    tou_step = int(plan.get("tou_slot_minutes") or 60)
    disp, _reserve_info, _tou_meta = _dispatch_for_point(
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
    bill_df = df.copy()
    bill_df["kW"] = disp["grid_kw"]
    load_before = baseline_df if baseline_df is not None else df
    return {
        "key": _dispatch_chart_key(pcs_kw, batt_kwh),
        "pcs_kw": float(pcs_kw),
        "batt_kwh": float(batt_kwh),
        "charts": charts,
        "tou_meta": _tou_meta,
        "reserve_meta": (_reserve_info or {}).get("meta") if _reserve_info else None,
        "energy_transfer": energy_transfer_payload(
            load_before,
            bill_df,
            baseline_tou=baseline_tou or tou_type,
            simulate_tou=tou_type,
        ),
    }


def _row_energy_amount(kw: pd.Series, price: pd.Series) -> pd.Series:
    """15 分列流動金額：kW × 0.25h × 電價。"""
    return kw.astype(float) * hours_per_data_row() * price.astype(float)


def _export_dispatch(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    period_schedule: dict | None,
) -> pd.DataFrame:
    """單一情境 dispatch（含有效契約）。"""
    disp, _reserve_info, _tou_meta = _export_dispatch_full(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        period_schedule=period_schedule,
    )
    return disp


def _export_dispatch_full(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    period_schedule: dict | None,
) -> tuple[pd.DataFrame, dict[str, Any] | None, dict[str, Any] | None]:
    """單一情境 dispatch；回傳 (disp, reserve_info, tou_meta)。"""
    sim_settings = {**settings, "functions": settings.get("functions") or ["tou"]}
    effective_contracts, _ = prepare_effective_contracts(
        df, contracts, sim_settings, tou_type
    )
    tou_step = int(plan.get("tou_slot_minutes") or 60)
    return _dispatch_for_point(
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


def run_compare_bills(
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
    period_schedule: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
    baseline_contracts: dict[str, Any] | None = None,
    baseline_tou: str | None = None,
    baseline_plan: dict | None = None,
    scheme_contracts: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """完整電費比對：原始 load vs 新方案 grid（含 months／summary）。"""
    base = baseline_df if baseline_df is not None else df
    base_plan = baseline_plan or plan
    base_tou = baseline_tou or tou_type
    base_contracts = baseline_contracts or contracts
    scheme_c = scheme_contracts if scheme_contracts is not None else contracts
    overage_rules = settings.get("overageRules")
    rules = overage_rules if isinstance(overage_rules, dict) else None

    baseline = calc_full_bill(
        base,
        base_plan,
        base_contracts,
        tou_type=base_tou,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=rules,
    )

    full_fns = list(settings.get("functions") or ["tou"])
    disp, reserve_info, _tou_meta = _export_dispatch_full(
        df,
        plan,
        scheme_c,
        {**settings, "functions": full_fns},
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        period_schedule=period_schedule,
    )
    scheme_df = df.assign(kW=disp["grid_kw"].to_numpy())
    scheme = calc_full_bill(
        scheme_df,
        plan,
        scheme_c,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=rules,
    )
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
        "baseline": baseline,
        "scheme": scheme,
        "reserve_income": reserve_income,
        "meta": {
            "pcs_kw": pcs_kw,
            "batt_kwh": batt_kwh,
            "baseline_tou": base_tou,
            "simulate_tou": tou_type,
            "baseline_contracts": base_contracts,
            "scheme_contracts": scheme_c,
        },
    }


def build_export_frame(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    period_schedule: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
    scheme_contracts: dict[str, Any] | None = None,
) -> pd.DataFrame:
    """匯出表：時間／用電／功率／電價／金額（小數 4 位）。"""
    base = baseline_df if baseline_df is not None else df
    scheme_c = scheme_contracts if scheme_contracts is not None else contracts
    full_fns = list(settings.get("functions") or ["tou"])
    disp = _export_dispatch(
        df,
        plan,
        scheme_c,
        {**settings, "functions": full_fns},
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        period_schedule=period_schedule,
    )

    price_orig = (
        base["energy_price"].astype(float).reset_index(drop=True)
        if "energy_price" in base.columns
        else pd.Series(0.0, index=range(len(base)))
    )
    price_new = (
        df["energy_price"].astype(float).reset_index(drop=True)
        if "energy_price" in df.columns
        else pd.Series(0.0, index=range(len(df)))
    )
    load_kw = base["kW"].astype(float).reset_index(drop=True)
    ess_kw = disp["ess_kw"].astype(float).reset_index(drop=True)
    grid_kw = disp["grid_kw"].astype(float).reset_index(drop=True)
    soc_pct = (disp["soc"].astype(float).reset_index(drop=True) * 100.0)
    amount_orig = _row_energy_amount(load_kw, price_orig)
    amount_new = _row_energy_amount(grid_kw, price_new)
    delta = amount_new - amount_orig

    return pd.DataFrame(
        {
            "時間": disp["timestamp"].reset_index(drop=True),
            "原始用電": load_kw.round(4),
            "功率": ess_kw.round(4),
            "調整後用電": grid_kw.round(4),
            "SOC百分比": soc_pct.round(4),
            "原始電價": price_orig.round(4),
            "新方案電價": price_new.round(4),
            "原始金額": amount_orig.round(4),
            "新金額": amount_new.round(4),
            "差額": delta.round(4),
        }
    )


def run_export_xlsx(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    period_schedule: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
    baseline_contracts: dict[str, Any] | None = None,
    baseline_tou: str | None = None,
    baseline_plan: dict | None = None,
    scheme_contracts: dict[str, Any] | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    voltage_level: str = "HV",
) -> bytes:
    """15 分用電／金額對照 → xlsx bytes。"""
    # baseline_*／日期僅保留 API 相容；本表用 baseline_df 電價與 load
    _ = (baseline_contracts, baseline_tou, baseline_plan, start_date, end_date, voltage_level)
    table = build_export_frame(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        period_schedule=period_schedule,
        baseline_df=baseline_df,
        scheme_contracts=scheme_contracts,
    )
    buf = BytesIO()
    table.to_excel(buf, index=False, engine="openpyxl")
    return buf.getvalue()
