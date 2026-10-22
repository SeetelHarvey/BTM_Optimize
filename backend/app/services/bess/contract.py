"""自動契約：可行性、規則提案、run_contract／run_followup。"""

from __future__ import annotations

import time
from typing import Any

import pandas as pd

from app.services.charts import build_dispatch_charts
from app.services.contract_rules import (
    ContractCapacity,
    cumulative_ceiling,
    rule_based_contract_proposal,
    suggest_regular_kw_from_dispatch,
    validate,
)
from app.services.features.grid_cap import (
    cap_kw_for_row,
    regular_kw_of,
    scaled_buffer_kw,
)
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
    _effective_soc_window,
    _row_key_pair,
    _simulate_point,
    _summary_from_grid_row,
    capacity_target_row,
    functions_without_reserve,
)


def _contract_feasible(
    disp: pd.DataFrame,
    contracts: dict[str, Any],
    tou_type: str,
    *,
    buffer_kw: float = 0.0,
) -> tuple[bool, str]:
    """任一列超出電網上限（與調度／超約同一口徑）→ 不可行。"""
    if disp is None or disp.empty or "grid_kw" not in disp.columns:
        return False, "no_dispatch"
    if "period" not in disp.columns:
        return True, "ok"
    cap = validate(ContractCapacity.from_dict(contracts), tou_type)
    periods = disp["period"].astype(str)
    grids = disp["grid_kw"].astype(float)
    if "date" in disp.columns:
        months = pd.to_datetime(disp["date"]).dt.strftime("%Y-%m")
    else:
        months = pd.Series(["2024-07"] * len(disp), index=disp.index)
    for i in range(len(disp)):
        period = periods.iloc[i]
        if period in ("", "None", "nan"):
            continue
        limit = cap_kw_for_row(
            period=period,
            month=str(months.iloc[i]),
            contracts=cap,
            tou_type=tou_type,
            buffer_kw=buffer_kw,
        )
        if limit is None:
            continue
        if float(grids.iloc[i]) > float(limit) + 1e-6:
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
    if "date" in disp.columns:
        months = pd.to_datetime(disp["date"]).dt.strftime("%Y-%m")
    else:
        months = pd.Series(["2024-07"] * len(disp), index=disp.index)
    out: list[dict[str, Any]] = []
    for period in _FEASIBILITY_PERIODS:
        mask = disp["period"].astype(str) == period
        part = disp.loc[mask]
        if part.empty:
            continue
        limits: list[float] = []
        for idx in part.index:
            lim = cap_kw_for_row(
                period=period,
                month=str(months.loc[idx]),
                contracts=cap,
                tou_type=tou_type,
                buffer_kw=buffer_kw,
            )
            if lim is not None:
                limits.append(float(lim))
        if not limits:
            continue
        limit = min(limits)
        ceiling = limit + float(buffer_kw)
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


def run_followup(
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
    baseline_contracts: dict[str, Any] | None = None,
    baseline_plan: dict | None = None,
    pcs_kw: float | None = None,
    batt_kwh: float | None = None,
) -> dict[str, Any]:
    """對指定量體（預設推薦）跑契約重配＋備轉；不重選量體。"""
    import time

    out = dict(stage1_result)
    recommended = out.get("recommended")
    target = capacity_target_row(out, pcs_kw, batt_kwh)
    active_functions = set(settings.get("functions") or ["tou"])
    want_reserve = "reserve" in active_functions
    want_contract = "demand" in active_functions
    if not target or not (want_reserve or want_contract):
        return out

    t_s2 = time.perf_counter()
    timing = dict(out.get("timing") or {})
    dispatch_count = int(timing.get("dispatch_count") or 0)

    baseline_tou = baseline_tou_type or out.get("baseline_tou_type") or tou_type
    baseline_df = baseline_df if baseline_df is not None else df
    stage1_contracts = dict(out.get("capacity_contracts") or contracts)
    # 原始帳單契約：與 Stage1 before 同口徑；不可回退成 Stage2 採用契約
    baseline_contracts = (
        baseline_contracts
        if baseline_contracts is not None
        else out.get("baseline_contracts")
    )
    if baseline_contracts is None:
        baseline_contracts = stage1_contracts
    baseline_plan = (
        baseline_plan if baseline_plan is not None else out.get("baseline_plan")
    )
    stage1_cap = ContractCapacity.from_dict(stage1_contracts)
    # 所有配置共用同一 before（Stage1 原始帳單）；各點只換 after
    before_summary = out.get("before") or {}
    before_total = int(before_summary.get("total") or 0)
    user_functions = list(out.get("functions") or settings.get("functions") or ["tou"])
    stage1_settings = {
        **settings,
        "functions": functions_without_reserve(user_functions),
    }
    stage2_settings = {**settings, "functions": user_functions}
    tou_step = int(plan.get("tou_slot_minutes") or 60)

    pcs_kw = float(target["pcs_kw"])
    batt_kwh = float(target["batt_kwh"])
    buffer_kw = scaled_buffer_kw(regular_kw_of(stage1_contracts), settings)
    stage1_total = int(target.get("after_total") or 0)
    if stage1_total <= 0 and recommended and _row_key_pair(
        recommended["pcs_kw"], recommended["batt_kwh"]
    ) == _row_key_pair(pcs_kw, batt_kwh):
        stage1_total = int(out.get("after", {}).get("total") or 0)
    stage1_bill_save = before_total - stage1_total

    stage2_contracts = dict(stage1_contracts)
    selected_candidate: dict[str, Any] | None = None
    proposed_candidate: dict[str, Any] | None = None
    reduction_info = None
    contract_disp = None
    best_summary: dict[str, Any] | None = None
    current_contract_bill: dict[str, int] | None = None
    proposed_contract_bill: dict[str, int] | None = None
    stage1_fp = _contracts_fingerprint(stage1_contracts)

    upstream_bundle = out.get("_final_bundle")
    if isinstance(upstream_bundle, dict):
        worksheet = upstream_bundle.get("worksheet")
        scheme = upstream_bundle.get("scheme")
        if isinstance(worksheet, pd.DataFrame) and isinstance(scheme, dict):
            contract_disp = worksheet
            if not want_contract:
                best_summary = {**scheme, "disp": contract_disp}

    if want_contract:
        stage1_disp = contract_disp
        if stage1_disp is None:
            stage1_disp, _, _ = _dispatch_for_point(
                df,
                plan,
                stage1_contracts,
                stage1_settings,
                pcs_kw=pcs_kw,
                batt_kwh=batt_kwh,
                tou_type=tou_type,
                tou_step=tou_step,
                period_schedule=schedule,
            )
            dispatch_count += 1
        residual = suggest_regular_kw_from_dispatch(
            stage1_disp,
            current_regular_kw=float(stage1_cap.regular_kw),
            buffer_kw=buffer_kw,
            target_periods=frozenset({"peak"}),
        )
        reduction_info = residual
        proposed_candidate = rule_based_contract_proposal(
            stage1_contracts,
            tou_type,
            residual=residual,
            buffer_kw=buffer_kw,
        )
        stage1_summary = _summary_from_grid_row(target, stage1_disp)
        proposal_contracts = dict(proposed_candidate["contracts"])
        if _contracts_fingerprint(proposal_contracts) == stage1_fp:
            proposal_summary = stage1_summary
        else:
            proposal_summary = _simulate_point(
                df,
                plan,
                proposal_contracts,
                stage1_settings,
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
            proposal_summary.get("disp"),
            proposal_contracts,
            tou_type,
            buffer_kw=buffer_kw,
        )
        proposed_candidate.update(
            {
                "feasible": ok,
                "reject_reason": None if ok else reason,
                "bill_total": int(proposal_summary["total"]),
                "basic_total": int(proposal_summary.get("basic_total") or 0),
                "overage_total": int(proposal_summary.get("overage_total") or 0),
                "energy_total": int(proposal_summary.get("energy_total") or 0),
                "feasibility": _feasibility_by_period(
                    proposal_summary.get("disp"),
                    proposal_contracts,
                    tou_type,
                    buffer_kw=buffer_kw,
                ),
            }
        )
        current_total = int(stage1_summary["total"])
        stage1_total = current_total
        current_contract_bill = {
            "basic_total": int(stage1_summary.get("basic_total") or 0),
            "overage_total": int(stage1_summary.get("overage_total") or 0),
            "energy_total": int(stage1_summary.get("energy_total") or 0),
            "total": current_total,
        }
        proposed_contract_bill = {
            "basic_total": int(proposal_summary.get("basic_total") or 0),
            "overage_total": int(proposal_summary.get("overage_total") or 0),
            "energy_total": int(proposal_summary.get("energy_total") or 0),
            "total": int(proposal_summary["total"]),
        }
        adopted = ok and int(proposal_summary["total"]) < current_total
        proposed_candidate["adopted"] = adopted
        proposed_candidate["bill_delta"] = int(proposal_summary["total"]) - current_total
        if adopted:
            stage2_contracts = proposal_contracts
            contract_disp = proposal_summary.get("disp")
            best_summary = proposal_summary
            selected_candidate = proposed_candidate
        else:
            stage2_contracts = dict(stage1_contracts)
            contract_disp = stage1_disp
            best_summary = stage1_summary
            selected_candidate = {
                "id": "baseline",
                "contracts": stage2_contracts,
                "feasible": True,
                "reject_reason": None,
                "bill_total": current_total,
                "basic_total": int(stage1_summary.get("basic_total") or 0),
                "overage_total": int(stage1_summary.get("overage_total") or 0),
                "energy_total": int(stage1_summary.get("energy_total") or 0),
                "regular_kw": float(stage1_cap.regular_kw),
                "allowance_added_kw": 0.0,
            }

    if best_summary is not None:
        contract_summary = best_summary
    elif (
        contract_disp is not None
        and _contracts_fingerprint(stage2_contracts) == stage1_fp
    ):
        contract_summary = _summary_from_grid_row(target, contract_disp)
    else:
        contract_summary = _simulate_point(
            df,
            plan,
            stage2_contracts,
            stage1_settings,
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
            stage2_contracts,
            stage2_settings,
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
            bid_source_disp=contract_disp,
        )
        dispatch_count += 1
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
        contracts=stage2_contracts,
        settings=(
            stage2_settings
            if want_reserve and reserve_warning is None
            else stage1_settings
        ),
        tou_type=tou_type,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        buffer_kw=buffer_kw,
        reserve_meta=reserve_meta,
    )
    feasibility = _feasibility_by_period(
        final_disp, stage2_contracts, tou_type, buffer_kw=buffer_kw
    )
    proposal = {
        "contracts": {
            "original": stage1_contracts,
            "proposed": (
                dict(proposed_candidate.get("contracts") or {})
                if proposed_candidate
                else None
            ),
            "suggested": stage2_contracts,
            "selected": selected_candidate,
            "rule": proposed_candidate,
            "reduction": reduction_info,
            "current_bill": current_contract_bill,
            "proposed_bill": proposed_contract_bill,
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
        "adopted_contracts": stage2_contracts,
        "contract_reduction": reduction_info,
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
        "warning": reserve_warning,
        "proposal": proposal,
        "constraints": constraints,
        "feasibility": feasibility,
        **{k: final_summary[k] for k in _METRIC_KEYS if k in final_summary},
    }

    # 以最後採用的 disp 物化 Final Bundle（不再另跑圖／電費）
    final_bundle = None
    if final_disp is not None:
        final_bundle = materialize_final_point(
            df,
            plan,
            stage2_contracts,
            (
                stage2_settings
                if want_reserve and reserve_warning is None
                else stage1_settings
            ),
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
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
            adopted_contracts=stage2_contracts,
            disp=final_disp,
            tou_meta=point.get("tou_meta"),
            reserve_info={
                "meta": reserve_meta,
                "income": final_summary.get("reserve_income"),
            },
        )
        point["dispatch_charts"] = final_bundle.get("charts")
        point["energy_transfer"] = final_bundle.get("energy_transfer")
        if final_bundle.get("tou_meta") is not None:
            point["tou_meta"] = final_bundle.get("tou_meta")
        # after 取最終工作表；before 固定 Stage1 原始帳單（不覆寫）
        point["after"] = final_bundle.get("after") or point["after"]
        point["before"] = before_summary

    point["feature_summaries"] = _feature_summaries(
        settings=settings,
        functions=user_functions,
        constraints=constraints,
        benefit_split=benefit_split,
        proposal=proposal,
        reserve_meta=reserve_meta,
        reserve_income=final_summary.get("reserve_income"),
        contracts=stage2_contracts,
    )
    point["benefit_report"] = _build_benefit_report(
        before=before_summary,
        after=point["after"],
        energy_transfer=point.get("energy_transfer"),
        reserve_income=final_summary.get("reserve_income"),
        reserve_meta=reserve_meta,
        functions=user_functions,
        feature_summaries=point["feature_summaries"],
        stage="full",
        pending=False,
        baseline_tou=baseline_tou,
        simulate_tou=tou_type,
    )
    evaluation = {
        "enabled": True,
        "final": point,
        "benefit_split": benefit_split,
        "benefit_report": point["benefit_report"],
        "proposal": proposal,
    }

    timing["evaluation_ms"] = round((time.perf_counter() - t_s2) * 1000, 1)
    timing["dispatch_count"] = dispatch_count
    timing["total_ms"] = round(
        float(timing.get("total_ms") or 0) + float(timing["evaluation_ms"]), 1
    )

    point_key = f"{pcs_kw:g}_{batt_kwh:g}"
    out["resultByPoint"] = {**(out.get("resultByPoint") or {}), point_key: evaluation}
    out["timing"] = timing
    if final_bundle is not None:
        out["_final_bundle"] = final_bundle
    return out


def run_contract(
    capacity_result: dict[str, Any],
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    **kwargs: Any,
) -> dict[str, Any]:
    """只跑自動契約；功能清單不含 reserve。"""
    fns = list(settings.get("functions") or ["tou"])
    if "demand" not in fns:
        return dict(capacity_result)
    local = {**settings, "functions": functions_without_reserve(fns)}
    return run_followup(capacity_result, df, plan, contracts, local, **kwargs)
