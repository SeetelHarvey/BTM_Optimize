"""TOU：唯一 schedule 解析；Auto／Manual 共用執行器。"""

import pandas as pd

from app.services.features import tou
from app.services.schedule import hours_per_data_row
from app.services.tariff import select_plan
from app.services import settings as settings_svc


def _slot_intent(sched, *, season, date, ts, data_min, soc, e_nom, eta):
    return tou.intent(
        soc=soc,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        season=season,
        date=date,
        timestamp=ts,
        data_min=data_min,
        step_minutes=60,
        tou_schedule=sched,
    )


def main() -> None:
    plan = select_plan("HV", "ThreeStage")
    prices = plan["prices"]
    eta = 0.85
    sch = settings_svc.default_schedule()
    soc_min, soc_max = 0.1, 0.9
    lo_pct, hi_pct = 0, 100

    assert tou.worth_arbitrage(9.39, 5.85, eta)
    assert not tou.worth_arbitrage(2.6, 2.53, eta)

    auto = tou.build_auto_tou_schedule(
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        step_minutes=60,
        charge_eff=eta,
        soc_min=soc_min,
        soc_max=soc_max,
    )
    # 最低價→理論 100%；最高價→理論 0%（執行端再夾有效窗）
    assert auto["summer"]["weekday"][0] == hi_pct   # off_peak
    assert auto["summer"]["weekday"][16] == lo_pct  # peak
    # 中價→更高價且過 η² → 100；中價→更低價且過 η² → 0
    assert auto["summer"]["weekday"][9] == hi_pct   # half→peak
    assert auto["summer"]["weekday"][22] == lo_pct  # half→off_peak
    # 週六半尖峰→離峰價差不足 → HOLD
    assert auto["summer"]["saturday"][12] is None
    # 非夏半尖峰＝當季最高 → 0；離峰 → 100
    assert auto["non_summer"]["weekday"][6] == lo_pct
    assert auto["non_summer"]["weekday"][0] == hi_pct

    thin = {"summer": {"peak": 3.0, "off_peak": 2.9}, "non_summer": {"peak": 3.0, "off_peak": 2.9}}
    thin_mtx = tou.build_auto_tou_schedule(
        tou_type="ThreeStage",
        prices=thin,
        period_schedule=sch,
        step_minutes=60,
        charge_eff=eta,
        soc_min=soc_min,
        soc_max=soc_max,
    )
    assert all(v is None for v in thin_mtx["summer"]["weekday"])

    assert tou.next_period(sch, "ThreeStage", season="summer", day_key="weekday", hour=10) == "peak"
    assert tou.next_period(sch, "ThreeStage", season="summer", day_key="weekday", hour=22) == "off_peak"
    assert tou.next_period(sch, "ThreeStage", season="summer", day_key="saturday", hour=12) == "off_peak"

    assert tou.target_soc(season=None, day_key="weekday", slot=0, tou_schedule=auto) is None

    sched = {
        "summer": {"weekday": [80] + [None] * 23},
        "non_summer": {"weekday": [0] * 24},
    }
    assert tou.target_soc(season="summer", day_key="weekday", slot=0, tou_schedule=sched) == 0.8
    assert tou.target_soc(season="summer", day_key="weekday", slot=1, tou_schedule=sched) is None
    assert tou.target_soc(season="summer", day_key="weekday", slot=99, tou_schedule=sched) is None

    e_nom = 200.0
    ess = tou.desired_ess_kw(soc=0.5, target=1.0, e_nom_kwh=e_nom, charge_eff=eta)
    assert ess > 0
    dt = hours_per_data_row()
    assert abs(ess - (0.5 * e_nom) / (dt * eta)) < 1e-9
    assert tou.desired_ess_kw(soc=0.5, target=0.0, e_nom_kwh=e_nom, charge_eff=eta) < 0

    assert tou.slot_index(step_minutes=60, data_min=0) == 0
    assert tou.slot_index(step_minutes=60, data_min=4) == 1

    from datetime import date as date_cls

    sun = date_cls(2024, 7, 7)
    assert tou.schedule_day_key(sun) == "sunday"
    assert tou.schedule_day_key(date_cls(2024, 7, 6)) == "saturday"
    assert tou.schedule_day_key(date_cls(2024, 7, 5)) == "weekday"
    assert tou.slot_index(step_minutes=60, data_min=95) == 23

    # 日界：標籤跨日仍依區間 date 讀 sunday 格
    boundary_sched = {
        "summer": {
            "weekday": [100] * 22 + [0, 0],
            "saturday": [100] * 24,
            "sunday": [100] * 24,
        },
        "non_summer": {
            "weekday": [100] * 24,
            "saturday": [100] * 24,
            "sunday": [100] * 24,
        },
    }
    keep = _slot_intent(
        boundary_sched,
        season="summer",
        date=sun,
        ts=pd.Timestamp("2024-07-08 00:00:00"),
        data_min=95,
        soc=0.9,
        e_nom=e_nom,
        eta=eta,
    )
    assert keep["target_soc"] == 1.0
    assert keep["desired_ess_kw"] >= 0
    keep_ts = tou.intent(
        soc=0.9,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        season="summer",
        timestamp=pd.Timestamp("2024-07-08 00:00:00"),
        data_min=95,
        tou_schedule=boundary_sched,
    )
    assert keep_ts["target_soc"] == 1.0

    # Auto 矩陣驅動意圖
    mon = date_cls(2024, 7, 1)
    charge = _slot_intent(
        auto,
        season="summer",
        date=mon,
        ts=pd.Timestamp("2024-07-01 10:00:00"),
        data_min=40,
        soc=0.5,
        e_nom=e_nom,
        eta=eta,
    )
    assert charge["desired_ess_kw"] > 0
    assert abs(charge["target_soc"] - 1.0) < 1e-9

    hold = _slot_intent(
        auto,
        season="summer",
        date=date_cls(2024, 7, 6),
        ts=pd.Timestamp("2024-07-06 12:00:00"),
        data_min=48,
        soc=0.5,
        e_nom=e_nom,
        eta=eta,
    )
    assert hold["desired_ess_kw"] == 0.0
    assert hold["target_soc"] == 0.5

    dis = _slot_intent(
        auto,
        season="non_summer",
        date=date_cls(2024, 1, 15),
        ts=pd.Timestamp("2024-01-15 08:00:00"),
        data_min=32,
        soc=0.5,
        e_nom=e_nom,
        eta=eta,
    )
    assert dis["desired_ess_kw"] < 0
    assert abs(dis["target_soc"] - 0.0) < 1e-9

    # Auto 產生的矩陣原樣當 Manual → 逐列意圖一致
    local_auto, meta = tou.resolve_tou_schedule(
        {"touScheduleMode": "auto", "functions": ["tou"]},
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        tou_step_minutes=60,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=eta,
    )
    assert meta["source"] == "auto"
    assert local_auto["touSchedule"] == auto
    local_man, meta_man = tou.resolve_tou_schedule(
        {
            "touScheduleMode": "manual",
            "touSchedule": meta["recommended_schedule"],
            "functions": ["tou"],
        },
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        tou_step_minutes=60,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=eta,
    )
    assert meta_man["source"] == "manual"
    assert local_man["touSchedule"] == local_auto["touSchedule"]

    samples = [
        (mon, "summer", pd.Timestamp("2024-07-01 02:00:00"), 8),
        (mon, "summer", pd.Timestamp("2024-07-01 10:00:00"), 40),
        (mon, "summer", pd.Timestamp("2024-07-01 17:00:00"), 68),
        (mon, "summer", pd.Timestamp("2024-07-01 22:00:00"), 88),
        (date_cls(2024, 7, 6), "summer", pd.Timestamp("2024-07-06 12:00:00"), 48),
        (date_cls(2024, 1, 15), "non_summer", pd.Timestamp("2024-01-15 08:00:00"), 32),
    ]
    for date_v, season, ts, dmin in samples:
        a = _slot_intent(
            local_auto["touSchedule"],
            season=season,
            date=date_v,
            ts=ts,
            data_min=dmin,
            soc=0.55,
            e_nom=e_nom,
            eta=eta,
        )
        b = _slot_intent(
            local_man["touSchedule"],
            season=season,
            date=date_v,
            ts=ts,
            data_min=dmin,
            soc=0.55,
            e_nom=e_nom,
            eta=eta,
        )
        assert a == b

    print("ok", charge, hold, dis, meta["source"])


if __name__ == "__main__":
    main()
