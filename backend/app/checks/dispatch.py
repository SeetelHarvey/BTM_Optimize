"""dispatch 編排自檢：硬限制、防超約優先、簡化 TOU。"""

import pandas as pd

from app.services.bess.device import Device
from app.services.bess.dispatch import run
from app.services.contracts import ContractCapacity
from app.services.features import backup, tou
from app.services.schedule import label_periods
from app.services.tariff import annotate, select_plan
from app.services import settings as settings_svc


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


def _annotate_rows(rows: list[dict]) -> pd.DataFrame:
    plan = select_plan("HV", "ThreeStage")
    return annotate(
        label_periods(
            pd.DataFrame(rows),
            {
                "tou_slot_minutes": plan["tou_slot_minutes"],
                "matrix": plan["matrix"],
                "summer_range": plan["summer_range"],
                "holidays": plan["holidays"],
            },
        ),
        plan,
    )


def main() -> None:
    plan = select_plan("HV", "ThreeStage")
    prices = plan["prices"]
    sch = settings_svc.default_schedule()
    df = _sample_df()
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
        Device(pcs_kw=200, batt_kwh=400, soc_min=0.1, soc_max=0.9, charge_eff=0.85),
        settings,
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=1000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    assert "ess_kw" in out.columns
    assert (out["grid_kw"] != out["kW"]).any()
    assert out["soc"].nunique() > 1

    # 防超約當列優先於 TOU（不得超契約）
    hot = _annotate_rows([{"timestamp": pd.Timestamp("2024-07-01 10:00:00"), "kW": 1050.0}])
    tou_base = {
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
        tou_base,
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=1000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    assert float(shaved.iloc[0]["grid_kw"]) <= 990.0 + 1e-6

    # 離峰充電仍受契約上限
    tight = ContractCapacity(regular_kw=800, half_peak_kw=0, saturday_half_peak_kw=0, off_peak_kw=0)
    day_df = _annotate_rows([
        {"timestamp": pd.Timestamp(f"2024-07-01 {h:02d}:00:00"), "kW": 920.0 if 9 <= h < 16 else 350.0}
        for h in range(24)
    ])
    capped = run(
        day_df,
        Device(pcs_kw=500, batt_kwh=600, soc_min=0.1, soc_max=0.9, charge_eff=0.85, anti_export_kw=0),
        {**tou_base, "antiExportKw": 0},
        tou_type="ThreeStage",
        contracts=tight,
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    off = capped[capped["period"] == "off_peak"]
    assert float(off["grid_kw"].max()) <= 790.0 + 1e-6

    auto_sched = tou.build_auto_tou_schedule(
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        step_minutes=60,
        charge_eff=0.85,
        soc_min=0.1,
        soc_max=0.9,
    )
    assert auto_sched["summer"]["weekday"][2] == 100  # off_peak → 理論 100%

    # SOC 已滿：目標再高也不充電
    full_df = _annotate_rows([{"timestamp": pd.Timestamp("2024-07-01 02:00:00"), "kW": 200.0}])
    full = run(
        full_df,
        Device(pcs_kw=200, batt_kwh=400, soc_min=0.9, soc_max=0.9, charge_eff=0.85),
        {
            "functions": ["tou"],
            "touScheduleMode": "manual",
            "touSchedule": auto_sched,
            "demandBufferKw": 0,
        },
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=2000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    assert float(full.iloc[0]["ess_kw"]) <= 1e-6
    assert float(full.iloc[0]["soc"]) <= 0.9 + 1e-9

    # 備援提高有效下限：TOU 想放到裝置原下限也不得突破
    bak_df = _annotate_rows([{"timestamp": pd.Timestamp("2024-07-01 17:00:00"), "kW": 300.0}])
    base = Device(pcs_kw=200, batt_kwh=400, soc_min=0.1, soc_max=0.9, charge_eff=0.85)
    adj = backup.adjusted_device(base, 120.0)
    assert adj.soc_min > base.soc_min
    bak = run(
        bak_df,
        base,
        {
            "functions": ["tou", "backup"],
            "touScheduleMode": "manual",
            "touSchedule": auto_sched,
            "backupReserveKwh": 120.0,
            "demandBufferKw": 0,
        },
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=2000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    assert float(bak["soc"].min()) >= adj.soc_min - 1e-6

    # 防超約削峰後，後續離峰仍可依 schedule 補電
    seq = _annotate_rows([
        {"timestamp": pd.Timestamp("2024-07-01 17:00:00"), "kW": 1100.0},
        {"timestamp": pd.Timestamp("2024-07-02 03:00:00"), "kW": 200.0},
    ])
    recharge = run(
        seq,
        Device(pcs_kw=300, batt_kwh=800, soc_min=0.1, soc_max=0.9, charge_eff=0.85),
        {
            "functions": ["tou", "demand"],
            "touScheduleMode": "auto",
            "demandBufferKw": 10,
            "socMin": 0.1,
            "socMax": 0.9,
            "chargeEff": 0.85,
        },
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=1000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    assert float(recharge.iloc[0]["ess_kw"]) < 0
    assert float(recharge.iloc[0]["grid_kw"]) <= 990.0 + 1e-6
    assert float(recharge.iloc[1]["ess_kw"]) > 0
    assert float(recharge.iloc[1]["soc"]) > float(recharge.iloc[0]["soc"])

    # Auto／Manual 同一矩陣 → dispatch 結果一致
    local_auto, meta = tou.resolve_tou_schedule(
        {"touScheduleMode": "auto", "functions": ["tou"], "demandBufferKw": 0},
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        tou_step_minutes=60,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.85,
    )
    a = run(
        day_df,
        Device(pcs_kw=500, batt_kwh=600, soc_min=0.1, soc_max=0.9, charge_eff=0.85),
        {**local_auto, "demandBufferKw": 0, "functions": ["tou"]},
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=2000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    b = run(
        day_df,
        Device(pcs_kw=500, batt_kwh=600, soc_min=0.1, soc_max=0.9, charge_eff=0.85),
        {
            "functions": ["tou"],
            "touScheduleMode": "manual",
            "touSchedule": meta["recommended_schedule"],
            "demandBufferKw": 0,
        },
        tou_type="ThreeStage",
        contracts=ContractCapacity(regular_kw=2000),
        tou_step_minutes=60,
        prices=prices,
        period_schedule=sch,
    )
    assert (a["ess_kw"] - b["ess_kw"]).abs().max() < 1e-9
    assert (a["soc"] - b["soc"]).abs().max() < 1e-9

    print("ok", out[["kW", "ess_kw", "grid_kw", "soc", "period"]].head())


if __name__ == "__main__":
    main()
