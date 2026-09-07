"""即時備轉：CBL、履約、品質、量化、結算自檢。"""

import numpy as np

from app.services.contracts import money
from app.services.features import reserve


def main() -> None:
    assert reserve.quantize_mw(1.29) == 1.2
    assert reserve.quantize_mw(0.09) == 0.0
    assert reserve.service_quality(95) == 1.0
    assert reserve.service_quality(90) == 0.7
    assert reserve.service_quality(80) == 0.0
    assert reserve.service_quality(60) == -240.0

    prices = reserve.validate_inputs(
        {
            "reserveCapacityPrice": 200,
            "reservePerformancePrice": 100,
            "reserveEnergyPrice": 5000,
            "reserveMonthlyDispatchCount": 2,
        }
    )
    assert prices["monthly_dispatch_count"] == 2
    try:
        reserve.validate_inputs({"reserveCapacityPrice": -1})
        raise AssertionError("expected ValueError")
    except ValueError:
        pass

    # 固定 CBL：工廠不增載 → 放電 = bid 即達標
    flat = np.full(70, 800.0)
    ok = reserve.simulate_event(
        bid_kw=200.0,
        cbl_kw=800.0,
        factory_loads=flat,
        soc0=0.9,
        pcs_kw=500.0,
        e_nom=2000.0,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.95,
    )
    assert ok["strict_ok"]
    assert ok["minute1_ok"]
    assert abs(ok["delivered_kw"][0] - 200.0) < 1e-3
    assert ok["official_quality"] == 1.0

    # 工廠增載須由 BESS 補足
    rise = np.concatenate([np.full(10, 800.0), np.full(60, 950.0)])
    hard = reserve.simulate_event(
        bid_kw=200.0,
        cbl_kw=800.0,
        factory_loads=rise,
        soc0=0.9,
        pcs_kw=500.0,
        e_nom=2000.0,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.95,
    )
    assert hard["max_required_kw"] >= 350.0 - 1e-6
    assert hard["strict_ok"]  # PCS 500 夠

    # PCS 不足
    pcs_fail = reserve.simulate_event(
        bid_kw=200.0,
        cbl_kw=800.0,
        factory_loads=rise,
        soc0=0.9,
        pcs_kw=250.0,
        e_nom=2000.0,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.95,
    )
    assert not pcs_fail["strict_ok"]
    assert pcs_fail["fail_reason"] in ("pcs_headroom", "factory_load_rise")

    # 不依賴充電墊高 CBL：standby 充電時用 factory 當穩健 CBL
    q_inflated, _ = reserve.max_deliverable_kw(
        cbl_kw=1000.0,
        factory_loads=flat,
        soc0=0.9,
        pcs_kw=500.0,
        e_nom=2000.0,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.95,
        factory_at_cbl=800.0,
        standby_ess_at_cbl=200.0,
        robust_no_charge_cbl=True,
    )
    q_plain, _ = reserve.max_deliverable_kw(
        cbl_kw=800.0,
        factory_loads=flat,
        soc0=0.9,
        pcs_kw=500.0,
        e_nom=2000.0,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.95,
        robust_no_charge_cbl=False,
    )
    assert abs(q_inflated - q_plain) < 1.0

    # 120 分鐘恢復
    rec_m, rec_ok = reserve.recovery_minutes(
        bid_kw=200.0,
        soc_after=0.2,
        factory_loads=np.full(120, 400.0),
        pcs_kw=500.0,
        e_nom=2000.0,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.95,
    )
    assert rec_ok and rec_m is not None and rec_m <= 120

    # 結算：容量／效能同式（得標 × 單價 × 品質）；一級失敗不歸零效能
    details = [
        {
            "row": 0,
            "month": "2024-07",
            "official_quality": -240.0,
            "delivered_kwh": 100.0,
            "minute1_ok": False,
        }
    ]
    # settle 需要 df／bids；用最小 stub
    import pandas as pd

    df = pd.DataFrame(
        {
            "date": [pd.Timestamp("2024-07-01").date()] * 4,
            "hour": [10, 10, 10, 10],
            "min": [0, 15, 30, 45],
        }
    )
    bids = pd.Series([1.0, 1.0, 1.0, 1.0])
    income = reserve.settle_income(
        df,
        bids,
        details,
        capacity_price=200.0,
        performance_price=250.0,
        energy_price=1000.0,
    )
    assert income["capacity"] == money(1.0 * 200.0 * -240.0)
    assert income["performance"] == money(1.0 * 250.0 * -240.0)
    assert income["activation_energy"] == money(0.1 * 1000.0)
    assert income["total"] == income["capacity"] + income["performance"] + income["activation_energy"]
    assert "energy" not in income  # 不混入電費 energy key
    assert "performance_zero_months" not in income

    print("ok feature_reserve")


if __name__ == "__main__":
    main()
