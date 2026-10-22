"""決定容量：樣本、網格試算、run_capacity。"""

from __future__ import annotations

import os
import time
from concurrent.futures import ProcessPoolExecutor
from typing import Any

import pandas as pd

from app.services.bess.size_grid import (
    contract_sizing_open,
    plan_sample_grid,
    pick_results,
    sample_from_profile,
)
from app.services.billing import calc_full_bill
from app.services.charts import build_dispatch_charts
from app.services.contract_rules import ContractCapacity, validate
from app.services.features.grid_cap import (
    regular_kw_of,
    resolve_buffer_kw,
    seed_buffer_kw,
)
from app.services.bess.contract import _final_constraints
from app.services.bess.result import (
    _build_benefit_report,
    _feature_summaries,
    materialize_final_point,
)
from app.services.bess.support import (
    _METRIC_KEYS,
    _bill_totals,
    _contracts_fingerprint,
    _dispatch_for_point,
    _settings_energy_seeds,
    _settings_tiers,
    _simulate_point,
    capacity_target_row,
    energy_transfer_payload,
    functions_without_reserve,
    prepare_effective_contracts,
)


def manual_size_point(settings: dict[str, Any]) -> tuple[float, float] | None:
    """指定一組時回傳 (pcs_kw, batt_kwh)；組合試算回傳 None。"""
    if str(settings.get("sizingMode") or "grid") != "single":
        return None
    try:
        pcs = float(settings.get("manualPcsKw") or 0)
        batt = float(settings.get("manualBattKwh") or 0)
    except (TypeError, ValueError) as e:
        raise ValueError("pcs_kw and batt_kwh must be > 0") from e
    if pcs <= 0 or batt <= 0:
        raise ValueError("pcs_kw and batt_kwh must be > 0")
    return (round(pcs, 3), round(batt, 3))


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
    effective_contracts = prepare_effective_contracts(contracts, tou_type)
    buffer_kw = seed_buffer_kw(settings, contract_kw=regular_kw_of(effective_contracts))
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
        ignore_off_peak=contract_sizing_open(settings),
    )
    return {
        "diagnosis": sample.get("diagnosis"),
        "strategies": sample.get("strategies") or tiers,
        "energy_keys": sample.get("energy_keys") or energy_keys,
        "profile_stats": sample["profile_stats"],
        "sample_source": sample["sample_source"],
        "grid_points": sample["grid_points"],
        "combinations": sample.get("combinations"),
        "regular_kw": float(ContractCapacity.from_dict(effective_contracts).regular_kw),
    }


def profile_bundle_from_sample(sample_result: dict[str, Any]) -> dict[str, Any]:
    """從 sample 結果抽出可重用的 profile 層。"""
    return {
        "diagnosis": sample_result.get("diagnosis"),
        "profile_stats": sample_result["profile_stats"],
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
        "regular_kw": float(profile_cache.get("regular_kw") or 0),
    }


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


def run_capacity(
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
    """量體選點＋電價調度（不含契約重配／備轉）。"""
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

    effective_contracts = prepare_effective_contracts(contracts, tou_type)
    effective_cap = ContractCapacity.from_dict(effective_contracts)
    buffer_kw = seed_buffer_kw(settings, contract_kw=regular_kw_of(effective_cap))
    tiers = _settings_tiers(settings)
    energy_keys = _settings_energy_seeds(settings)
    t_profile = time.perf_counter()
    manual = manual_size_point(settings)
    if manual is not None:
        pcs_m, batt_m = manual
        sample_full = {
            "diagnosis": None,
            "strategies": [],
            "profile_stats": None,
            "sample_source": "manual",
            "combinations": [
                {"pcs_kw": pcs_m, "batt_kwh": batt_m, "seed_source": "manual"}
            ],
        }
    elif (
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
            ignore_off_peak=contract_sizing_open(settings),
        )
    timing["profile_ms"] = round((time.perf_counter() - t_profile) * 1000, 1)
    grid = [
        (float(c["pcs_kw"]), float(c["batt_kwh"]))
        for c in sample_full.get("combinations") or []
    ]
    sample_source = str(sample_full.get("sample_source") or "none")

    user_functions = list(settings.get("functions") or ["tou"])
    want_reserve = "reserve" in user_functions
    want_contract = "demand" in user_functions
    need_followup = want_reserve or want_contract

    stage1_settings = {**settings, "functions": functions_without_reserve(user_functions)}
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
        sim_settings=stage1_settings,
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
    final_bundle = None
    if dispatch_charts is None and highlight:
        final_bundle = materialize_final_point(
            df,
            plan,
            effective_contracts,
            stage1_settings,
            pcs_kw=float(highlight["pcs_kw"]),
            batt_kwh=float(highlight["batt_kwh"]),
            tou_type=tou_type,
            start_date=start_date,
            end_date=end_date,
            voltage_level=voltage_level,
            period_schedule=schedule,
            overage_rules=overage_rules,
            baseline_df=baseline_df,
            baseline_tou=baseline_tou,
            baseline_contracts=baseline_contracts,
            baseline_plan=baseline_plan,
            adopted_contracts=effective_contracts,
        )
        dispatch_count += 1
        energy_transfer = final_bundle.get("energy_transfer") or energy_transfer
        dispatch_charts = final_bundle.get("charts")
        if tou_meta is None:
            tou_meta = final_bundle.get("tou_meta")
        if final_bundle.get("after"):
            after_rec = final_bundle["after"]
        if final_bundle.get("before"):
            before_summary = final_bundle["before"]

    savings_pct = (
        highlight.get("savings_pct")
        if highlight and highlight.get("savings_pct") is not None
        else (
            round(100.0 * savings / before_total, 2) if before_total > 0 else 0.0
        )
    )
    timing["total_ms"] = round((time.perf_counter() - t0) * 1000, 1)
    timing["dispatch_count"] = dispatch_count
    stage1_constraints = None
    if highlight:
        stage1_constraints = _final_constraints(
            contracts=effective_contracts,
            settings=stage1_settings,
            tou_type=tou_type,
            pcs_kw=float(highlight["pcs_kw"]),
            batt_kwh=float(highlight["batt_kwh"]),
            buffer_kw=resolve_buffer_kw(
                stage1_settings,
                contract_kw=regular_kw_of(effective_contracts),
                key="demandBufferKw",
            ),
            reserve_meta=None,
        )
    feature_summaries = _feature_summaries(
        settings=settings,
        functions=user_functions,
        constraints=stage1_constraints,
        benefit_split=benefit_split,
        reserve_meta=None,
        reserve_income=reserve_income,
        contracts=effective_contracts,
    )
    benefit_report = _build_benefit_report(
        before=before_summary,
        after=after_rec,
        energy_transfer=energy_transfer,
        reserve_income=reserve_income,
        reserve_meta=reserve_meta,
        functions=user_functions,
        feature_summaries=feature_summaries,
        stage="sizing",
        pending=bool(need_followup and recommended),
        baseline_tou=baseline_tou,
        simulate_tou=tou_type,
    )

    out = {
        "diagnosis": sample_full.get("diagnosis"),
        "strategies": sample_full.get("strategies") or tiers,
        "profile_stats": sample_full["profile_stats"],
        "sample_source": sample_source,
        "grid_points": len(grid_out),
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
        "baseline_contracts": baseline_contracts,
        "simulate_tou_type": tou_type,
        "dispatch_charts": dispatch_charts,
        "capacity_contracts": effective_contracts,
        "resultByPoint": {},
        "benefit_split": benefit_split,
        "benefit_report": benefit_report,
        "feature_summaries": feature_summaries,
        "constraints": stage1_constraints,
        "timing": timing,
        "final": recommended,
    }
    if final_bundle is not None:
        out["_final_bundle"] = final_bundle
    return out
