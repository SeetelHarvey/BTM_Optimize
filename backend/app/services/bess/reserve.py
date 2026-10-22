"""即時備轉結算：run_reserve。"""

from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.bess.contract import run_followup
from app.services.bess.support import capacity_target_row


def run_reserve(
    upstream_result: dict[str, Any],
    df: pd.DataFrame,
    plan: dict,
    contracts: dict[str, Any],
    settings: dict[str, Any],
    **kwargs: Any,
) -> dict[str, Any]:
    """只跑即時備轉結算；沿用上游採用契約。"""
    fns = list(settings.get("functions") or ["tou"])
    if "reserve" not in fns:
        return dict(upstream_result)
    target = capacity_target_row(
        upstream_result, kwargs.get("pcs_kw"), kwargs.get("batt_kwh")
    )
    point_key = (
        f"{float(target['pcs_kw']):g}_{float(target['batt_kwh']):g}"
        if target
        else ""
    )
    evaluation = (upstream_result.get("resultByPoint") or {}).get(point_key) or {}
    final = evaluation.get("final") or {}
    adopted = final.get("adopted_contracts")
    use_contracts = adopted or contracts
    up = dict(upstream_result)
    up["capacity_contracts"] = use_contracts
    # 去掉 demand，避免再提契約
    local_fns = [f for f in fns if f != "demand"]
    if "reserve" not in local_fns:
        local_fns.append("reserve")
    local = {**settings, "functions": local_fns}
    return run_followup(up, df, plan, use_contracts, local, **kwargs)
