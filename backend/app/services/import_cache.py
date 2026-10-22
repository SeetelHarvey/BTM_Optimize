"""匯入暫存上的指紋鍵（圖／電費／試算共用；換檔即丟）。

試算指紋契約：
- plan／Form contracts／rates／schedule／holidays／overage＝輸入
- simulate 只取計算欄；UI 導覽袋（wizardStep 等）一律略過
- capacity＝決定容量；contract／reserve＝綁定 capacity_key＋目標量體
"""

from __future__ import annotations

import hashlib
import json
from typing import Any


def stable_hash(obj: Any) -> str:
    """穩定短指紋。"""
    raw = json.dumps(obj, sort_keys=True, default=str, separators=(",", ":"))
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:20]


def plan_fingerprint(
    *,
    simulate_tou: str,
    rates: dict | None,
    schedule: dict | None,
    holidays: Any,
) -> str:
    """標註／電價視圖。"""
    return "plan:" + stable_hash(
        {
            "tou": simulate_tou,
            "rates": rates,
            "schedule": schedule,
            "holidays": holidays,
        }
    )


def profile_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    buffer_kw: float,
    charge_eff: float,
    include_half_peak: Any,
    ignore_off_peak: bool = False,
) -> str:
    """profile／diagnosis（與勾選策略無關）。"""
    return "profile:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "buffer": buffer_kw,
            "eff": charge_eff,
            "half": include_half_peak,
            "open_contract": bool(ignore_off_peak),
        }
    )


def sample_fingerprint(
    *,
    profile_key: str,
    strategies: list[str],
    energy_keys: list[str] | None = None,
) -> str:
    """含策略／電量種子勾選的配置組合。"""
    return "sample:" + stable_hash(
        {
            "profile": profile_key,
            "strategies": sorted(strategies),
            "energy": sorted(energy_keys or []),
        }
    )


# 純 UI／導覽：不進任何含 simulate 的指紋（對齊前端 SIM_UI_ONLY_KEYS）
SIM_UI_ONLY_KEYS = frozenset({
    "wizardStep",
    "detailTab",
    "seededImportKey",
    "scenarioByTou",
})


def simulate_for_fingerprint(simulate: dict | None) -> dict:
    """指紋用 simulate；略過純 UI 狀態。"""
    if not isinstance(simulate, dict):
        return {}
    return {k: v for k, v in simulate.items() if k not in SIM_UI_ONLY_KEYS}


_RESERVE_FP_KEYS = frozenset({
    "reserveCapacityPrice",
    "reservePerformancePrice",
    "reserveEnergyPrice",
    "reserveMonthlyDispatchCount",
    "reserveSchedule",
    "reserveScheduleMode",
})


def _simulate_without_reserve(simulate: dict | None) -> dict:
    """capacity／contract 指紋：略過備轉欄。"""
    base = simulate_for_fingerprint(simulate)
    return {k: v for k, v in base.items() if k not in _RESERVE_FP_KEYS}


def _simulate_reserve_only(simulate: dict | None) -> dict:
    """reserve 指紋：只取備轉欄＋功能清單。"""
    base = simulate_for_fingerprint(simulate)
    out = {k: base[k] for k in _RESERVE_FP_KEYS if k in base}
    if "functions" in base:
        out["functions"] = base["functions"]
    return out


def capacity_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    simulate: dict,
    overage_rules: Any,
) -> str:
    """決定容量（不含備轉欄；契約開關會影響篩選）。"""
    return "capacity:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "simulate": _simulate_without_reserve(simulate),
            "overage": overage_rules,
        }
    )


def contract_fingerprint(
    *,
    capacity_key: str,
    simulate: dict,
    overage_rules: Any,
    pcs_kw: float | None = None,
    batt_kwh: float | None = None,
) -> str:
    """自動契約結果（綁定 capacity_key＋目標量體；不含備轉欄）。"""
    payload: dict[str, Any] = {
        "capacity": capacity_key,
        "simulate": _simulate_without_reserve(simulate),
        "overage": overage_rules,
    }
    if pcs_kw is not None and batt_kwh is not None:
        payload["pcs"] = round(float(pcs_kw), 3)
        payload["batt"] = round(float(batt_kwh), 3)
    return "contract:" + stable_hash(payload)


def reserve_fingerprint(
    *,
    upstream_key: str,
    simulate: dict,
    overage_rules: Any,
    pcs_kw: float | None = None,
    batt_kwh: float | None = None,
) -> str:
    """即時備轉結算（綁定上游鍵＋備轉欄＋目標量體）。"""
    payload: dict[str, Any] = {
        "upstream": upstream_key,
        "simulate": _simulate_reserve_only(simulate),
        "overage": overage_rules,
    }
    if pcs_kw is not None and batt_kwh is not None:
        payload["pcs"] = round(float(pcs_kw), 3)
        payload["batt"] = round(float(batt_kwh), 3)
    return "reserve:" + stable_hash(payload)


def compare_bill_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    simulate: dict,
    pcs_kw: float,
    batt_kwh: float,
    baseline_contracts: dict | None = None,
    baseline_tou: str | None = None,
    adopted_contracts: dict | None = None,
) -> str:
    """方案比對完整電費（baseline vs scheme）。"""
    return "compare:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "simulate": simulate_for_fingerprint(simulate),
            "pcs": round(float(pcs_kw), 3),
            "batt": round(float(batt_kwh), 3),
            "baseline_contracts": baseline_contracts,
            "baseline_tou": baseline_tou,
            "adopted_contracts": adopted_contracts,
        }
    )


def final_bundle_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    simulate: dict,
    pcs_kw: float,
    batt_kwh: float,
    adopted_contracts: dict | None = None,
    functions: list | None = None,
) -> str:
    """選定配置最終工作表（含採用契約與功能集合）。"""
    return "final:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "simulate": simulate_for_fingerprint(simulate),
            "pcs": round(float(pcs_kw), 3),
            "batt": round(float(batt_kwh), 3),
            "adopted_contracts": adopted_contracts,
            "functions": sorted(functions or []),
        }
    )


def demand_charts_fingerprint(*, tou_type: str) -> str:
    """匯入需量視覺化（df 隨 import 固定）。"""
    return "demand_charts:" + stable_hash({"tou": tou_type})


def bill_fingerprint(
    *,
    tou_type: str,
    contracts: dict,
    rates: Any,
    schedule: Any,
    holidays: Any,
    overage_rules: Any,
) -> str:
    """電費試算結果。"""
    return "bill:" + stable_hash(
        {
            "tou": tou_type,
            "contracts": contracts,
            "rates": rates,
            "schedule": schedule,
            "holidays": holidays,
            "overage": overage_rules,
        }
    )


def _selfcheck() -> None:
    a = plan_fingerprint(
        simulate_tou="ThreeStage", rates={"x": 1}, schedule=None, holidays=None
    )
    b = plan_fingerprint(
        simulate_tou="ThreeStage", rates={"x": 1}, schedule=None, holidays=None
    )
    c = plan_fingerprint(
        simulate_tou="TwoStage", rates={"x": 1}, schedule=None, holidays=None
    )
    assert a == b and a != c
    p1 = profile_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 100},
        buffer_kw=0,
        charge_eff=0.85,
        include_half_peak=True,
    )
    p2 = profile_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 100},
        buffer_kw=0,
        charge_eff=0.85,
        include_half_peak=True,
    )
    assert p1 == p2
    s_full = sample_fingerprint(
        profile_key=p1, strategies=["max", "p50"], energy_keys=["min", "p50"]
    )
    s_one = sample_fingerprint(
        profile_key=p1, strategies=["max"], energy_keys=["min", "p50"]
    )
    assert s_full != s_one
    s_energy = sample_fingerprint(
        profile_key=p1, strategies=["max", "p50"], energy_keys=["p90"]
    )
    assert s_full != s_energy

    base_sim = {"functions": ["tou"], "chargeEff": 0.85, "x": 1}
    ui_a = {
        **base_sim,
        "wizardStep": "config",
        "detailTab": "tou",
        "seededImportKey": "a",
        "scenarioByTou": {"ThreeStage": {}},
    }
    ui_b = {
        **base_sim,
        "wizardStep": "result",
        "detailTab": "demand",
        "seededImportKey": "b",
        "scenarioByTou": {"TwoStage": {"z": 1}},
    }
    s1a = capacity_fingerprint(
        plan_key=a, contracts={"regular_kw": 1}, simulate=ui_a, overage_rules=None
    )
    s1b = capacity_fingerprint(
        plan_key=a, contracts={"regular_kw": 1}, simulate=ui_b, overage_rules=None
    )
    assert s1a == s1b
    f1 = contract_fingerprint(capacity_key=s1a, simulate=ui_a, overage_rules=None)
    f2 = contract_fingerprint(capacity_key=s1a, simulate=ui_b, overage_rules=None)
    assert f1 == f2 and f1 != s1a
    f3 = contract_fingerprint(
        capacity_key=s1a,
        simulate=base_sim,
        overage_rules=None,
        pcs_kw=100.0,
        batt_kwh=200.0,
    )
    f4 = contract_fingerprint(
        capacity_key=s1a,
        simulate=base_sim,
        overage_rules=None,
        pcs_kw=100.0,
        batt_kwh=400.0,
    )
    assert f3 != f1 and f3 != f4
    cmp1 = compare_bill_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate=ui_a,
        pcs_kw=100.0,
        batt_kwh=200.0,
        baseline_contracts={"regular_kw": 1},
        baseline_tou="ThreeStage",
        adopted_contracts=None,
    )
    cmp2 = compare_bill_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate=ui_b,
        pcs_kw=100.0,
        batt_kwh=200.0,
        baseline_contracts={"regular_kw": 1},
        baseline_tou="ThreeStage",
        adopted_contracts=None,
    )
    assert cmp1 == cmp2 and cmp1 != f3
    cmp3 = compare_bill_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate=base_sim,
        pcs_kw=100.0,
        batt_kwh=200.0,
        baseline_contracts={"regular_kw": 1},
        baseline_tou="ThreeStage",
        adopted_contracts={"regular_kw": 90},
    )
    assert cmp1 != cmp3
    fb1 = final_bundle_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate=ui_a,
        pcs_kw=100.0,
        batt_kwh=200.0,
        adopted_contracts={"regular_kw": 90},
        functions=["tou", "reserve"],
    )
    fb2 = final_bundle_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate=ui_b,
        pcs_kw=100.0004,
        batt_kwh=200.0,
        adopted_contracts={"regular_kw": 90},
        functions=["reserve", "tou"],
    )
    fb3 = final_bundle_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate=base_sim,
        pcs_kw=100.0,
        batt_kwh=200.0,
        adopted_contracts=None,
        functions=["tou"],
    )
    assert fb1 == fb2 and fb1 != fb3 and fb1 != cmp1
    d1 = demand_charts_fingerprint(tou_type="ThreeStage")
    d2 = demand_charts_fingerprint(tou_type="ThreeStage")
    assert d1 == d2 and d1 != demand_charts_fingerprint(tou_type="BatchStage")
    b1 = bill_fingerprint(
        tou_type="ThreeStage",
        contracts={"regular_kw": 1},
        rates=None,
        schedule=None,
        holidays=None,
        overage_rules=None,
    )
    b2 = bill_fingerprint(
        tou_type="ThreeStage",
        contracts={"regular_kw": 1},
        rates=None,
        schedule=None,
        holidays=None,
        overage_rules=None,
    )
    assert b1 == b2
    print("import_cache selfcheck ok")


if __name__ == "__main__":
    _selfcheck()
