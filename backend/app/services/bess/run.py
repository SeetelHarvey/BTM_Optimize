"""量體試算編排（薄 facade）。

跨 API：capacity＝決定容量；contract＝自動契約；reserve＝即時備轉結算。
報告／匯出在 result；共用調度在 support。
"""

from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.bess.capacity import (
    manual_size_point,
    profile_bundle_from_sample,
    run_capacity,
    run_sample,
    run_sample_from_profile_cache,
)
from app.services.bess.contract import run_contract, run_followup
from app.services.bess.reserve import run_reserve
from app.services.bess.result import (
    _build_benefit_report,
    _feature_summaries,
    build_export_frame,
    build_final_worksheet,
    export_frame_from_worksheet,
    materialize_final_point,
    run_compare_bills,
    run_dispatch_charts,
    run_export_xlsx,
    views_from_worksheet,
)
from app.services.bess.support import (
    _daily_avg_pcs_util_pct,
    _dispatch_metrics,
    _hourly_pcs_util_pct,
    capacity_target_row,
    energy_transfer_payload,
    functions_without_reserve,
    prepare_effective_contracts,
)


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
    """短名單量體 → 工程折衷三點 → 規則式契約重配 → 最終備轉一次。"""
    common = dict(
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
        voltage_level=voltage_level,
        schedule=schedule,
        overage_rules=overage_rules,
        baseline_tou_type=baseline_tou_type,
        baseline_df=baseline_df,
        baseline_contracts=baseline_contracts,
        baseline_plan=baseline_plan,
    )
    capacity = run_capacity(
        df,
        plan,
        contracts,
        settings,
        cached_profile=cached_profile,
        **common,
    )
    fns = list(settings.get("functions") or [])
    out = capacity
    if "demand" in fns:
        out = run_contract(out, df, plan, contracts, settings, **common)
    if "reserve" in fns:
        out = run_reserve(out, df, plan, contracts, settings, **common)
    return out
