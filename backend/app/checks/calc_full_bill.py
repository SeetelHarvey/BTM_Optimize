"""calc_full_bill 可對標註 df 跑出與 /api/billing/basic 同形回應。"""

import pandas as pd

from app.services.billing import calc_full_bill
from app.services.tariff import annotate, select_plan


def main() -> None:
    plan = select_plan("HV", "ThreeStage")
    ts = pd.date_range("2024-07-01 00:15", periods=4, freq="15min")
    raw = pd.DataFrame({"timestamp": ts, "kW": [100.0, 120.0, 110.0, 105.0]})
    df = annotate(raw, plan)
    contracts = {
        "regular_kw": 100,
        "half_peak_kw": 0,
        "saturday_half_peak_kw": 0,
        "off_peak_kw": 0,
    }
    bill = calc_full_bill(
        df,
        plan,
        contracts,
        tou_type="ThreeStage",
        start_date="2024-07-01",
        end_date="2024-07-01",
        voltage_level="HV",
    )
    assert bill["tou_type"] == "ThreeStage"
    assert bill["row_count"] == 4
    assert "summary" in bill and "months" in bill
    assert bill["billing_month_count"] == 1
    assert bill["total"] == bill["basic_total"] + bill["overage_total"] + bill["energy_total"]
    assert bill["demand_total"] == bill["basic_total"] + bill["overage_total"]
    m0 = bill["months"][0]
    assert m0["bill_total"] == m0["basic_total"] + m0["overage"]["total"] + m0["energy"]["total"]
    print("ok", bill["total"], "energy_kwh=", bill["energy_kwh"])


if __name__ == "__main__":
    main()
