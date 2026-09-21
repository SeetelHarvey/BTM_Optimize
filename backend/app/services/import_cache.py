"""匯入暫存上的指紋鍵（圖／電費／試算共用；換檔即丟）。"""

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
    auto_adjust_off_peak: bool,
) -> str:
    """profile／diagnosis（與勾選策略無關）。"""
    return "profile:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "buffer": buffer_kw,
            "eff": charge_eff,
            "half": include_half_peak,
            "autoOff": bool(auto_adjust_off_peak),
        }
    )


def sample_fingerprint(*, profile_key: str, strategies: list[str]) -> str:
    """含策略勾選的配置組合。"""
    return "sample:" + stable_hash(
        {"profile": profile_key, "strategies": sorted(strategies)}
    )


def size_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    simulate: dict,
    overage_rules: Any,
) -> str:
    """完整量體試算結果。"""
    return "size:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "simulate": simulate,
            "overage": overage_rules,
        }
    )


def stage1_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    simulate: dict,
    overage_rules: Any,
) -> str:
    """量體＋電價調度（不含契約／備轉重算）。"""
    return "stage1:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "simulate": simulate,
            "overage": overage_rules,
        }
    )


def full_fingerprint(
    *,
    stage1_key: str,
    simulate: dict,
    overage_rules: Any,
    pcs_kw: float | None = None,
    batt_kwh: float | None = None,
) -> str:
    """契約／備轉合併結果（綁定 stage1_key 與目標量體）。"""
    payload: dict[str, Any] = {
        "stage1": stage1_key,
        "simulate": simulate,
        "overage": overage_rules,
    }
    if pcs_kw is not None and batt_kwh is not None:
        payload["pcs"] = round(float(pcs_kw), 3)
        payload["batt"] = round(float(batt_kwh), 3)
    return "full:" + stable_hash(payload)


def charts_fingerprint(
    *,
    plan_key: str,
    contracts: dict,
    simulate: dict,
    pcs_kw: float,
    batt_kwh: float,
) -> str:
    """單一 (pcs,batt) 調度圖。"""
    return "charts:" + stable_hash(
        {
            "plan": plan_key,
            "contracts": contracts,
            "simulate": simulate,
            "pcs": round(float(pcs_kw), 3),
            "batt": round(float(batt_kwh), 3),
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
        auto_adjust_off_peak=False,
    )
    p2 = profile_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 100},
        buffer_kw=0,
        charge_eff=0.85,
        include_half_peak=True,
        auto_adjust_off_peak=False,
    )
    assert p1 == p2
    s_full = sample_fingerprint(profile_key=p1, strategies=["max", "p50"])
    s_one = sample_fingerprint(profile_key=p1, strategies=["max"])
    assert s_full != s_one
    z1 = size_fingerprint(
        plan_key=a, contracts={"regular_kw": 1}, simulate={"x": 1}, overage_rules=None
    )
    z2 = size_fingerprint(
        plan_key=a, contracts={"regular_kw": 1}, simulate={"x": 1}, overage_rules=None
    )
    assert z1 == z2
    s1a = stage1_fingerprint(
        plan_key=a, contracts={"regular_kw": 1}, simulate={"x": 1}, overage_rules=None
    )
    s1b = stage1_fingerprint(
        plan_key=a, contracts={"regular_kw": 1}, simulate={"x": 1}, overage_rules=None
    )
    assert s1a == s1b and s1a != z1
    f1 = full_fingerprint(stage1_key=s1a, simulate={"x": 1}, overage_rules=None)
    f2 = full_fingerprint(stage1_key=s1a, simulate={"x": 1}, overage_rules=None)
    assert f1 == f2 and f1 != s1a
    f3 = full_fingerprint(
        stage1_key=s1a,
        simulate={"x": 1},
        overage_rules=None,
        pcs_kw=100.0,
        batt_kwh=200.0,
    )
    f4 = full_fingerprint(
        stage1_key=s1a,
        simulate={"x": 1},
        overage_rules=None,
        pcs_kw=100.0,
        batt_kwh=400.0,
    )
    assert f3 != f1 and f3 != f4
    c1 = charts_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate={"x": 1},
        pcs_kw=100.0,
        batt_kwh=200.0,
    )
    c2 = charts_fingerprint(
        plan_key=a,
        contracts={"regular_kw": 1},
        simulate={"x": 1},
        pcs_kw=100.0004,
        batt_kwh=200.0,
    )
    assert c1 == c2
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
