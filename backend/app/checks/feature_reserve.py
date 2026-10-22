"""即時備轉：量化、品質、小時結算與投標自檢。"""

from app.services.contract_rules import money
from app.services.features import reserve


def main() -> None:
    assert reserve.quantize_mw(1.29) == 1.2
    assert reserve.quantize_mw(0.09) == 0.0
    assert reserve.service_quality(95) == 1.0
    assert reserve.service_quality(90) == 0.7
    assert reserve.service_quality(80) == 0.0
    assert reserve.service_quality(60) == -240.0
    assert reserve.service_quality_standby(95) == 1.0
    assert reserve.service_quality_standby(90) == 0.7
    assert reserve.service_quality_standby(80) == 0.0
    assert reserve.service_quality_standby(60) == -1.0

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

    import pandas as pd

    day = pd.Timestamp("2024-07-01").date()
    df = pd.DataFrame(
        {
            "date": [day] * 8,
            "hour": [9, 9, 9, 9, 10, 10, 10, 10],
            "min": [0, 15, 30, 45, 0, 15, 30, 45],
            "kW": [1000.0, 1000.0, 1000.0, 1000.0, 800.0, 900.0, 850.0, 1000.0],
        }
    )
    disp = df.copy()
    disp["grid_kw"] = [1000.0, 1000.0, 1000.0, 1000.0, 200.0, 300.0, 250.0, 900.0]
    bids = pd.Series([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0])
    table = reserve.hourly_reserve_table(df, disp, bids, monthly_dispatch_count=0)
    hour10 = table[table["hour"] == 10].iloc[0]
    assert hour10["grid_min_kw"] == 200.0
    assert abs(hour10["standby_pct"] - 20.0) < 1e-9

    income = reserve.income_from_hours(
        reserve.hourly_reserve_table(df, disp, bids, monthly_dispatch_count=1),
        capacity_price=200.0,
        performance_price=100.0,
        energy_price=4.0,
    )
    assert income["capacity"] == money(1.0 * 200.0 * -240.0)
    assert income["performance"] == money(1.0 * 100.0 * -240.0)
    assert income["activation_energy"] == money(0.5875 * 4.0)
    assert income["total"] == income["capacity"] + income["performance"] + income["activation_energy"]
    assert "energy" not in income

    marked = reserve.mark_reserve_calls(
        df, disp, reserve.hourly_reserve_table(df, disp, bids, monthly_dispatch_count=1)
    )
    assert list(marked["grid_kw"]) == list(disp["grid_kw"])
    assert float(marked["reserve_call"].iloc[0]) == 0.0
    assert float(marked["reserve_call"].iloc[4]) == 1000.0

    auto_day = pd.Timestamp("2024-07-01").date()
    auto_df = pd.DataFrame(
        {
            "date": [auto_day] * 4,
            "hour": [14, 14, 14, 14],
            "min": [0, 15, 30, 45],
            "season": ["summer"] * 4,
            "is_holiday": [False] * 4,
            "kW": [1000.0] * 4,
        }
    )
    auto_disp = auto_df.copy()
    auto_disp["grid_kw"] = [100.0, 400.0, 400.0, 400.0]
    sched, _meta = reserve.build_auto_schedule(
        auto_df,
        auto_disp,
        None,
        capacity_price=100.0,
        performance_price=100.0,
    )
    assert sched["summer"]["weekday"][14] == 0.1
    assert len(sched["summer"]["weekday"]) == 24
    assert len(reserve.empty_schedule()) == 2  # summer / non_summer
    assert len(reserve.empty_schedule()["summer"]["weekday"]) == 24

    print("ok feature_reserve")


if __name__ == "__main__":
    main()
