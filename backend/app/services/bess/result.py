"""試算結果：效益報告、物化工作表、比對與匯出。"""

from __future__ import annotations

from io import BytesIO
from typing import Any

import pandas as pd

from app.services.billing import calc_full_bill
from app.services.charts import build_dispatch_charts
from app.services.features.grid_cap import regular_kw_of, resolve_buffer_kw
from app.services.schedule import hours_per_data_row
from app.services.bess.support import (
    _METRIC_KEYS,
    _bill_totals,
    _dispatch_chart_key,
    _dispatch_for_point,
    _effective_soc_window,
    energy_transfer_payload,
    prepare_effective_contracts,
)


def _build_benefit_report(
    *,
    before: dict[str, Any],
    after: dict[str, Any],
    energy_transfer: dict[str, Any] | None,
    reserve_income: dict[str, Any] | None,
    reserve_meta: dict[str, Any] | None,
    functions: list[str],
    feature_summaries: list[dict[str, Any]],
    stage: str,
    pending: bool,
    baseline_tou: str | None,
    simulate_tou: str | None,
) -> dict[str, Any]:
    """效益報告單一金額口徑：電費三分項＋備轉收入。"""

    def amount(source: dict[str, Any], key: str) -> int:
        return int(source.get(key) or 0)

    def line(key: str) -> dict[str, int]:
        before_value = amount(before, key)
        after_value = amount(after, key)
        return {
            "before": before_value,
            "after": after_value,
            "benefit": before_value - after_value,
        }

    summaries = {
        str(summary.get("id") or ""): summary
        for summary in feature_summaries
        if summary.get("id")
    }
    demand_summary = summaries.get("demand")
    reserve_summary = summaries.get("reserve")
    contract_adopted = bool(
        demand_summary and demand_summary.get("status") == "adopted"
    )
    plan_changed = bool(
        baseline_tou and simulate_tou and str(baseline_tou) != str(simulate_tou)
    )

    basic = line("basic_total")
    energy = line("energy_total")
    overage = line("overage_total")
    basic["visible"] = bool(basic["benefit"] != 0 or contract_adopted)
    basic["source"] = (
        "both"
        if contract_adopted and plan_changed
        else ("contract" if contract_adopted else ("plan" if plan_changed else "unchanged"))
    )
    basic["evaluation"] = demand_summary

    energy["visible"] = True
    energy["transfer"] = energy_transfer or {}
    overage["visible"] = True

    reserve_enabled = "reserve" in functions
    income = reserve_income or {}
    extra_income = int(income.get("total") or 0) if reserve_enabled and not pending else 0
    extra = {
        "visible": bool(reserve_enabled and not pending),
        "benefit": extra_income,
        "capacity": int(income.get("capacity") or 0),
        "performance": int(income.get("performance") or 0),
        "activation_energy": int(income.get("activation_energy") or 0),
        "income": income,
        "meta": reserve_meta,
        "evaluation": reserve_summary,
    }

    bill_savings = basic["benefit"] + energy["benefit"] + overage["benefit"]
    after_total = amount(after, "total")
    total_benefit = bill_savings + extra_income
    return {
        "summary": {
            "after_bill_total": after_total,
            "bill_savings": bill_savings,
            "extra_income": extra_income,
            "total_benefit": total_benefit,
            "pending": bool(pending),
        },
        "sections": {
            "basic": basic,
            "energy": energy,
            "overage": overage,
            "extra": extra,
        },
        "meta": {
            "stage": stage,
            "baseline_tou": baseline_tou,
            "simulate_tou": simulate_tou,
            "functions": list(functions),
        },
    }


def _summary_metric(key: str, value: Any) -> dict[str, Any] | None:
    """功能卡單一指標；空值略過。"""
    return None if value is None else {"key": key, "value": value}


def _summary_demand(ctx: dict[str, Any]) -> dict[str, Any] | None:
    """自動調整契約容量摘要（第2層；尚未評估時不湊空卡）。"""
    proposal = ((ctx.get("proposal") or {}).get("contracts") or {})
    reduction = proposal.get("reduction") or {}
    selected = proposal.get("selected") or {}
    rule = proposal.get("rule") or {}
    if not reduction and not rule:
        return None
    constraints = ctx.get("constraints") or {}
    selected_contracts = dict(
        proposal.get("suggested")
        or constraints.get("contracts")
        or ctx.get("contracts")
        or {}
    )
    proposed_contracts = dict(proposal.get("proposed") or selected_contracts)
    current_contracts = dict(proposal.get("original") or {})
    if not current_contracts:
        current_contracts = {
            "regular_kw": float(reduction.get("current_regular_kw") or 0),
        }
    selected_id = str(selected.get("id") or "baseline")
    changed = bool(rule.get("adopted"))
    reason = "contract_rule_adopted" if changed else "contract_no_gain"
    failed_check = next(
        (
            check
            for check in (rule.get("feasibility") or [])
            if not check.get("ok")
        ),
        None,
    )
    current_regular = float(
        current_contracts.get("regular_kw")
        or reduction.get("current_regular_kw")
        or 0
    )
    selected_regular = float(selected_contracts.get("regular_kw") or 0)
    adj_src = rule
    metrics = [
        _summary_metric("regular_kw", selected_regular),
        _summary_metric("max_kw", reduction.get("peak_grid_max_kw")),
        _summary_metric(
            "reducible_kw", max(0.0, current_regular - selected_regular)
        ),
        _summary_metric("half_peak_delta_kw", adj_src.get("half_peak_delta_kw")),
        _summary_metric("allowance_kw", adj_src.get("allowance_added_kw")),
    ]
    return {
        "id": "demand",
        "status": "adopted" if changed else "unchanged",
        "metrics": [x for x in metrics if x is not None],
        "benefit": int((ctx.get("benefit_split") or {}).get("contract_gain") or 0),
        "reason": reason,
        "decision": {
            "current_contracts": current_contracts,
            "proposed_contracts": proposed_contracts,
            "selected_contracts": selected_contracts,
            "selected_id": selected_id,
            "adopted": changed,
            "current_regular_kw": current_regular,
            "selected_regular_kw": selected_regular,
            "max_kw": reduction.get("peak_grid_max_kw"),
            "buffer_kw": reduction.get("buffer_kw"),
            "reducible_kw": max(0.0, current_regular - selected_regular),
            "reject_reason": rule.get("reject_reason"),
            "failed_check": failed_check,
            "basis": list(rule.get("basis") or []),
            "original_total_kw": rule.get("original_total_kw"),
            "free_allowance_total_kw": rule.get("free_allowance_total_kw"),
            "free_allowance_used_kw": rule.get("free_allowance_used_kw"),
            "billable_lower_kw": rule.get("billable_lower_kw"),
            "current_bill": proposal.get("current_bill"),
            "proposed_bill": proposal.get("proposed_bill"),
            "bill_delta": rule.get("bill_delta"),
            "adjustments": {
                "half_peak_delta_kw": adj_src.get("half_peak_delta_kw"),
                "saturday_half_peak_delta_kw": adj_src.get(
                    "saturday_half_peak_delta_kw"
                ),
                "off_peak_added_kw": adj_src.get("off_peak_added_kw"),
                "allowance_added_kw": adj_src.get("allowance_added_kw"),
            },
        },
    }


def _summary_backup(ctx: dict[str, Any]) -> dict[str, Any]:
    """備援功能摘要。"""
    constraints = ctx.get("constraints") or {}
    settings = ctx.get("settings") or {}
    metrics = [
        _summary_metric("backup_kwh", float(settings.get("backupReserveKwh") or 0)),
        _summary_metric(
            "soc_min_pct",
            (
                round(float(constraints["soc_min"]) * 100.0, 1)
                if constraints.get("soc_min") is not None
                else None
            ),
        ),
    ]
    return {
        "id": "backup",
        "status": "adopted",
        "metrics": [x for x in metrics if x is not None],
        "benefit": None,
        "reason": "soc_floor",
    }


def _summary_reserve(ctx: dict[str, Any]) -> dict[str, Any]:
    """即時備轉功能摘要。"""
    proposal = ((ctx.get("proposal") or {}).get("reserve") or {})
    meta = proposal.get("meta") or ctx.get("reserve_meta") or {}
    income = proposal.get("income") or ctx.get("reserve_income") or {}
    rolled_back = bool(proposal.get("rolled_back") or meta.get("rolled_back"))
    metrics = [
        _summary_metric("mode", meta.get("mode")),
        _summary_metric("reserve_income", int(income.get("total") or 0)),
    ]
    return {
        "id": "reserve",
        "status": "rolled_back" if rolled_back else "adopted",
        "metrics": [x for x in metrics if x is not None],
        "benefit": int((ctx.get("benefit_split") or {}).get("reserve_gain") or 0),
        "reason": (
            "no_net_gain"
            if rolled_back
            else (
                "manual_bid"
                if str(meta.get("mode") or "auto") == "manual"
                else "auto_bid"
            )
        ),
    }


_FEATURE_SUMMARY_BUILDERS = {
    "demand": _summary_demand,
    "backup": _summary_backup,
    "reserve": _summary_reserve,
}


def _feature_summaries(
    *,
    settings: dict[str, Any],
    functions: list[str],
    constraints: dict[str, Any] | None,
    benefit_split: dict[str, Any],
    proposal: dict[str, Any] | None = None,
    reserve_meta: dict[str, Any] | None = None,
    reserve_income: dict[str, Any] | None = None,
    contracts: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """已啟用功能 → 共用摘要契約。"""
    enabled = set(functions or [])
    # demand 功能＝自動調整契約容量（第2層）；運行裕度只看參數 demandBufferKw
    want_contract = "demand" in enabled
    if want_contract:
        enabled.add("demand")
    ctx = {
        "settings": settings,
        "constraints": constraints or {},
        "benefit_split": benefit_split,
        "proposal": proposal or {},
        "reserve_meta": reserve_meta,
        "reserve_income": reserve_income or {},
        "contracts": contracts or {},
        "evaluate_contract": want_contract,
    }
    return [
        summary
        for feature_id, builder in _FEATURE_SUMMARY_BUILDERS.items()
        if feature_id in enabled
        for summary in [builder(ctx)]
        if summary is not None
    ]


def build_final_worksheet(df: pd.DataFrame, disp: pd.DataFrame) -> pd.DataFrame:
    """標註負載＋調度列 → 最終 15 分工作表。"""
    if disp is None or disp.empty:
        raise ValueError("disp is empty")
    if len(disp) != len(df):
        raise ValueError("disp length mismatch")
    out = df.reset_index(drop=True).copy()
    d = disp.reset_index(drop=True)
    out["ess_kw"] = d["ess_kw"].astype(float)
    out["grid_kw"] = d["grid_kw"].astype(float)
    out["soc"] = d["soc"].astype(float)
    if "reserve_call" in d.columns:
        out["reserve_call"] = d["reserve_call"]
    return out


def export_frame_from_worksheet(
    worksheet: pd.DataFrame,
    *,
    baseline_df: pd.DataFrame | None = None,
) -> pd.DataFrame:
    """最終工作表 → 匯出欄位（不再調度）。"""
    base = baseline_df if baseline_df is not None else worksheet
    base = base.reset_index(drop=True)
    ws = worksheet.reset_index(drop=True)
    price_orig = (
        base["energy_price"].astype(float)
        if "energy_price" in base.columns
        else pd.Series(0.0, index=range(len(base)))
    )
    price_new = (
        ws["energy_price"].astype(float)
        if "energy_price" in ws.columns
        else pd.Series(0.0, index=range(len(ws)))
    )
    load_kw = base["kW"].astype(float)
    ess_kw = ws["ess_kw"].astype(float)
    grid_kw = ws["grid_kw"].astype(float)
    soc_pct = ws["soc"].astype(float) * 100.0
    amount_orig = _row_energy_amount(load_kw, price_orig)
    amount_new = _row_energy_amount(grid_kw, price_new)
    ts = ws["timestamp"] if "timestamp" in ws.columns else base["timestamp"]
    return pd.DataFrame(
        {
            "時間": ts.reset_index(drop=True),
            "原始用電": load_kw.round(4),
            "功率": ess_kw.round(4),
            "調整後用電": grid_kw.round(4),
            "SOC百分比": soc_pct.round(4),
            "原始電價": price_orig.round(4),
            "新方案電價": price_new.round(4),
            "原始金額": amount_orig.round(4),
            "新金額": amount_new.round(4),
            "差額": (amount_new - amount_orig).round(4),
        }
    )


def views_from_worksheet(
    worksheet: pd.DataFrame,
    plan: dict,
    adopted_contracts: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    start_date: str,
    end_date: str,
    voltage_level: str,
    overage_rules: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
    baseline_tou: str | None = None,
    baseline_contracts: dict[str, Any] | None = None,
    baseline_plan: dict | None = None,
    tou_meta: dict[str, Any] | None = None,
    reserve_meta: dict[str, Any] | None = None,
    reserve_income: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """最終工作表 → 圖／電費／轉移／匯出（不調度）。"""
    disp_view = pd.DataFrame(
        {
            "ess_kw": worksheet["ess_kw"].astype(float),
            "soc": worksheet["soc"].astype(float),
            "grid_kw": worksheet["grid_kw"].astype(float),
        }
    )
    charts = build_dispatch_charts(worksheet, disp_view)
    charts["pcs_kw"] = float(pcs_kw)
    charts["batt_kwh"] = float(batt_kwh)

    scheme_df = worksheet.assign(kW=worksheet["grid_kw"].to_numpy())
    scheme = calc_full_bill(
        scheme_df,
        plan,
        adopted_contracts,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=overage_rules,
    )

    base = baseline_df if baseline_df is not None else worksheet
    base_plan = baseline_plan or plan
    base_tou = baseline_tou or tou_type
    # before 必須用原始契約；未傳時等同 scheme（無降約）
    base_contracts = (
        baseline_contracts if baseline_contracts is not None else adopted_contracts
    )
    baseline = calc_full_bill(
        base,
        base_plan,
        base_contracts,
        tou_type=base_tou,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=overage_rules,
    )

    xfer = energy_transfer_payload(
        base,
        scheme_df,
        baseline_tou=base_tou,
        simulate_tou=tou_type,
    )
    # 金額分項：對齊 calc_full_bill summary.energy（月入帳後加總）
    before_amt = {
        (str(r.get("season") or ""), str(r["period"])): int(r.get("amount") or 0)
        for r in (baseline.get("summary") or {}).get("energy") or []
    }
    after_amt = {
        (str(r.get("season") or ""), str(r["period"])): int(r.get("amount") or 0)
        for r in (scheme.get("summary") or {}).get("energy") or []
    }
    for row in xfer.get("rows") or []:
        key = (str(row.get("season") or ""), str(row.get("period") or ""))
        b_amt = before_amt.get(key, 0)
        a_amt = after_amt.get(key, 0)
        row["before_amount"] = b_amt
        row["after_amount"] = a_amt
        row["delta_amount"] = a_amt - b_amt
    xfer["energy_total_delta"] = int(scheme["energy_total"]) - int(baseline["energy_total"])

    income = reserve_income or {
        "capacity": 0,
        "performance": 0,
        "activation_energy": 0,
        "total": 0,
        "monthly": {},
        "events": [],
        "data_note": "15min_estimate",
    }
    return {
        "key": _dispatch_chart_key(pcs_kw, batt_kwh),
        "pcs_kw": float(pcs_kw),
        "batt_kwh": float(batt_kwh),
        "worksheet": worksheet,
        "charts": charts,
        "tou_meta": tou_meta,
        "reserve_meta": reserve_meta,
        "reserve_income": income,
        "energy_transfer": xfer,
        "before": _bill_totals(baseline),
        "after": _bill_totals(scheme),
        "baseline": baseline,
        "scheme": scheme,
        "adopted_contracts": adopted_contracts,
        "export_frame": export_frame_from_worksheet(worksheet, baseline_df=base),
    }


def materialize_final_point(
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
    overage_rules: dict | None = None,
    baseline_df: pd.DataFrame | None = None,
    baseline_tou: str | None = None,
    baseline_contracts: dict[str, Any] | None = None,
    baseline_plan: dict | None = None,
    adopted_contracts: dict[str, Any] | None = None,
    disp: pd.DataFrame | None = None,
    tou_meta: dict[str, Any] | None = None,
    reserve_info: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """選定配置物化：有 disp 直接組表，否則調度一次。"""
    scheme_c = adopted_contracts if adopted_contracts is not None else contracts
    sim_settings = {**settings, "functions": settings.get("functions") or ["tou"]}
    if disp is None:
        effective_contracts = prepare_effective_contracts(scheme_c, tou_type)
        tou_step = int(plan.get("tou_slot_minutes") or 60)
        disp, reserve_info, tou_meta = _dispatch_for_point(
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
        scheme_c = effective_contracts
    worksheet = build_final_worksheet(df, disp)
    return views_from_worksheet(
        worksheet,
        plan,
        scheme_c,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        overage_rules=overage_rules,
        baseline_df=baseline_df,
        baseline_tou=baseline_tou,
        baseline_contracts=baseline_contracts,
        baseline_plan=baseline_plan,
        tou_meta=tou_meta,
        reserve_meta=(reserve_info or {}).get("meta") if reserve_info else None,
        reserve_income=(reserve_info or {}).get("income") if reserve_info else None,
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
    start_date: str | None = None,
    end_date: str | None = None,
    voltage_level: str = "HV",
    overage_rules: dict | None = None,
    worksheet: pd.DataFrame | None = None,
    adopted_contracts: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """單一 (pcs,batt) 調度圖；有工作表則不再調度。"""
    if worksheet is not None:
        bundle = views_from_worksheet(
            worksheet,
            plan,
            adopted_contracts or contracts,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=tou_type,
            start_date=start_date or "",
            end_date=end_date or "",
            voltage_level=voltage_level,
            overage_rules=overage_rules,
            baseline_df=baseline_df,
            baseline_tou=baseline_tou,
        )
        return {
            "key": bundle["key"],
            "pcs_kw": bundle["pcs_kw"],
            "batt_kwh": bundle["batt_kwh"],
            "charts": bundle["charts"],
            "tou_meta": bundle.get("tou_meta"),
            "reserve_meta": bundle.get("reserve_meta"),
            "energy_transfer": bundle.get("energy_transfer"),
        }
    sd = str(start_date or (df["date"].min() if "date" in df.columns else ""))
    ed = str(end_date or (df["date"].max() if "date" in df.columns else ""))
    if hasattr(sd, "isoformat"):
        sd = sd.isoformat()  # type: ignore[union-attr]
    if hasattr(ed, "isoformat"):
        ed = ed.isoformat()  # type: ignore[union-attr]
    # date may be python date
    if not isinstance(sd, str):
        sd = str(sd)
    if not isinstance(ed, str):
        ed = str(ed)
    bundle = materialize_final_point(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        start_date=sd,
        end_date=ed,
        voltage_level=voltage_level,
        period_schedule=period_schedule,
        overage_rules=overage_rules,
        baseline_df=baseline_df,
        baseline_tou=baseline_tou,
        adopted_contracts=adopted_contracts,
    )
    return {
        "key": bundle["key"],
        "pcs_kw": bundle["pcs_kw"],
        "batt_kwh": bundle["batt_kwh"],
        "charts": bundle["charts"],
        "tou_meta": bundle.get("tou_meta"),
        "reserve_meta": bundle.get("reserve_meta"),
        "energy_transfer": bundle.get("energy_transfer"),
        "_bundle": bundle,
    }


def _row_energy_amount(kw: pd.Series, price: pd.Series) -> pd.Series:
    """15 分列流動金額：kW × 0.25h × 電價。"""
    return kw.astype(float) * hours_per_data_row() * price.astype(float)


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
    effective_contracts = prepare_effective_contracts(contracts, tou_type)
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
    adopted_contracts: dict[str, Any] | None = None,
    worksheet: pd.DataFrame | None = None,
) -> dict[str, Any]:
    """完整電費比對：原始 load vs 新方案 grid（含 months／summary）。"""
    scheme_c = adopted_contracts if adopted_contracts is not None else contracts
    if worksheet is not None:
        bundle = views_from_worksheet(
            worksheet,
            plan,
            scheme_c,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=tou_type,
            start_date=start_date,
            end_date=end_date,
            voltage_level=voltage_level,
            overage_rules=settings.get("overageRules")
            if isinstance(settings.get("overageRules"), dict)
            else None,
            baseline_df=baseline_df,
            baseline_tou=baseline_tou,
            baseline_contracts=baseline_contracts,
            baseline_plan=baseline_plan,
        )
        return {
            "baseline": bundle["baseline"],
            "scheme": bundle["scheme"],
            "reserve_income": bundle.get("reserve_income"),
            "meta": {
                "pcs_kw": pcs_kw,
                "batt_kwh": batt_kwh,
                "baseline_tou": baseline_tou or tou_type,
                "simulate_tou": tou_type,
                "baseline_contracts": baseline_contracts or contracts,
                "adopted_contracts": scheme_c,
            },
        }

    base = baseline_df if baseline_df is not None else df
    base_plan = baseline_plan or plan
    base_tou = baseline_tou or tou_type
    base_contracts = baseline_contracts or contracts
    overage_rules = settings.get("overageRules")
    rules = overage_rules if isinstance(overage_rules, dict) else None

    full_fns = list(settings.get("functions") or ["tou"])
    bundle = materialize_final_point(
        df,
        plan,
        contracts,
        {**settings, "functions": full_fns},
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        period_schedule=period_schedule,
        overage_rules=rules,
        baseline_df=base,
        baseline_tou=base_tou,
        baseline_contracts=base_contracts,
        baseline_plan=base_plan,
        adopted_contracts=scheme_c,
    )
    return {
        "baseline": bundle["baseline"],
        "scheme": bundle["scheme"],
        "reserve_income": bundle.get("reserve_income"),
        "meta": {
            "pcs_kw": pcs_kw,
            "batt_kwh": batt_kwh,
            "baseline_tou": base_tou,
            "simulate_tou": tou_type,
            "baseline_contracts": base_contracts,
            "adopted_contracts": scheme_c,
        },
        "_bundle": bundle,
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
    adopted_contracts: dict[str, Any] | None = None,
    worksheet: pd.DataFrame | None = None,
) -> pd.DataFrame:
    """匯出表：時間／用電／功率／電價／金額（小數 4 位）。"""
    if worksheet is not None:
        return export_frame_from_worksheet(worksheet, baseline_df=baseline_df)
    base = baseline_df if baseline_df is not None else df
    scheme_c = adopted_contracts if adopted_contracts is not None else contracts
    full_fns = list(settings.get("functions") or ["tou"])
    disp, _reserve_info, _tou_meta = _export_dispatch_full(
        df,
        plan,
        scheme_c,
        {**settings, "functions": full_fns},
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        tou_type=tou_type,
        period_schedule=period_schedule,
    )
    ws = build_final_worksheet(df, disp)
    return export_frame_from_worksheet(ws, baseline_df=base)


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
    adopted_contracts: dict[str, Any] | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    voltage_level: str = "HV",
    worksheet: pd.DataFrame | None = None,
) -> bytes:
    """15 分用電／金額對照 → xlsx bytes。"""
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
        adopted_contracts=adopted_contracts,
        worksheet=worksheet,
    )
    buf = BytesIO()
    table.to_excel(buf, index=False, engine="openpyxl")
    return buf.getvalue()
