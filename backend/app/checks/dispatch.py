"""dispatch 編排自檢。"""

import pandas as pd

from app.services.bess.device import Device
from app.services.bess.dispatch import run
from app.services.contracts import ContractCapacity
from app.services.schedule import label_periods
from app.services.tariff import annotate, select_plan


def _sample_df() -> pd.DataFrame:
    plan = select_plan("HV", "ThreeStage")
    ctx = {
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "matrix": plan["matrix"],
        "summer_range": plan["summer_range"],
        "holidays": plan["holidays"],
    }
    rows = []
    for day in ("2024-01-15", "2024-01-16"):
        for h in (10, 2, 14):
            ts = pd.Timestamp(f"{day} {h:02d}:00:00")
            rows.append({"timestamp": ts, "kW": 800.0 if h == 10 else 300.0})
    df = pd.DataFrame(rows)
    raw = label_periods(df, ctx)
    return annotate(raw, plan)


def main() -> None:
    df = _sample_df()
    dev = Device(pcs_kw=200, batt_kwh=400, soc_min=0.1, soc_max=0.9, charge_eff=0.85)
    settings = {
        "functions": ["tou", "demand"],
        "touScheduleMode": "auto",
        "demandBufferKw": 10,
        "socMin": 0.1,
        "socMax": 0.9,
        "chargeEff": 0.85,
    }
    out = run(
        df,
        dev,
        settings,
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=1000),
        tou_step_minutes=60,
        prices=select_plan("HV", "ThreeStage")["prices"],
    )
    assert "ess_kw" in out.columns
    assert (out["grid_kw"] != out["kW"]).any()
    assert out["soc"].nunique() > 1

    hot = pd.DataFrame([{
        "timestamp": pd.Timestamp("2024-07-01 10:00:00"),
        "kW": 1050.0,
        "date": pd.Timestamp("2024-07-01").date(),
        "min": 40,
        "hour": 10,
        "season": "summer",
        "is_holiday": False,
        "period": "peak",
        "energy_price": 5.0,
    }])
    plan = select_plan("HV", "ThreeStage")
    hot = annotate(label_periods(hot, {
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "matrix": plan["matrix"],
        "summer_range": plan["summer_range"],
        "holidays": plan["holidays"],
    }), plan)
    tou_only = {
        "functions": ["tou"],
        "touScheduleMode": "auto",
        "demandBufferKw": 10,
        "socMin": 0.1,
        "socMax": 0.9,
        "chargeEff": 0.85,
    }
    shaved = run(
        hot,
        Device(pcs_kw=200, batt_kwh=400, soc_min=0.5, soc_max=0.9, charge_eff=0.85),
        tou_only,
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=1000),
        tou_step_minutes=60,
        prices=plan["prices"],
    )
    assert float(shaved.iloc[0]["grid_kw"]) <= 990.0 + 1e-6

    tight = ContractCapacity(regular_kw=800, half_peak_kw=0, saturday_half_peak_kw=0, off_peak_kw=0)
    rows = [{"timestamp": pd.Timestamp(f"2024-07-01 {h:02d}:00:00"), "kW": 920.0 if 9 <= h < 16 else 350.0} for h in range(24)]
    day_df = annotate(label_periods(pd.DataFrame(rows), {
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "matrix": plan["matrix"],
        "summer_range": plan["summer_range"],
        "holidays": plan["holidays"],
    }), plan)
    capped = run(
        day_df,
        Device(pcs_kw=500, batt_kwh=600, soc_min=0.1, soc_max=0.9, charge_eff=0.85, anti_export_kw=0),
        {**tou_only, "demandBufferKw": 10, "antiExportKw": 0},
        tou_type="ThreeStage",
        contracts=tight,
        tou_step_minutes=60,
        prices=plan["prices"],
    )
    off = capped[capped["period"] == "off_peak"]
    assert float(off["grid_kw"].max()) <= 790.0 + 1e-6
    print("ok", out[["kW", "ess_kw", "grid_kw", "soc", "period"]].head())


if __name__ == "__main__":
    main()
