"""TOU 功能：效率門檻 + look-ahead／manual 矩陣 → 意圖功率。"""

import pandas as pd

from app.services.features import tou
from app.services.schedule import hours_per_data_row
from app.services.tariff import select_plan
from app.services import settings as settings_svc


def main() -> None:
    plan = select_plan("HV", "ThreeStage")
    prices = plan["prices"]
    eta = 0.85
    sch = settings_svc.default_schedule()

    assert tou.worth_arbitrage(9.39, 5.85, eta)
    assert not tou.worth_arbitrage(2.6, 2.53, eta)

    assert tou.auto_target_soc(season="summer", period="peak", prices=prices, charge_eff=eta) == 0.0
    assert tou.auto_target_soc(season="summer", period="off_peak", prices=prices, charge_eff=eta) == 1.0
    # 中價無下一時段 → 維持
    assert tou.auto_target_soc(season="summer", period="half_peak", prices=prices, charge_eff=eta) is None
    # 尖峰前半尖峰：下一時段更貴且過門檻 → 充
    assert (
        tou.auto_target_soc(
            season="summer",
            period="half_peak",
            prices=prices,
            charge_eff=eta,
            next_period_name="peak",
        )
        == 1.0
    )
    # 尖峰後半尖峰／週六：下一為更便宜離峰 → 維持
    assert (
        tou.auto_target_soc(
            season="summer",
            period="half_peak",
            prices=prices,
            charge_eff=eta,
            next_period_name="off_peak",
        )
        is None
    )
    assert (
        tou.auto_target_soc(
            season="summer",
            period="saturday_half_peak",
            prices=prices,
            charge_eff=eta,
            next_period_name="off_peak",
        )
        is None
    )
    # 非夏半尖峰＝當季最高 → 放電
    assert tou.auto_target_soc(season="non_summer", period="half_peak", prices=prices, charge_eff=eta) == 0.0
    assert tou.auto_target_soc(season="non_summer", period="off_peak", prices=prices, charge_eff=eta) == 1.0

    # 價差過薄：高低價也不循環
    thin = {"summer": {"peak": 3.0, "off_peak": 2.9}}
    assert tou.auto_target_soc(season="summer", period="peak", prices=thin, charge_eff=eta) is None
    assert tou.auto_target_soc(season="summer", period="off_peak", prices=thin, charge_eff=eta) is None

    assert tou.next_period(sch, "ThreeStage", season="summer", day_key="weekday", hour=10) == "peak"
    assert tou.next_period(sch, "ThreeStage", season="summer", day_key="weekday", hour=22) == "off_peak"
    assert tou.next_period(sch, "ThreeStage", season="summer", day_key="saturday", hour=12) == "off_peak"

    assert tou.target_soc(mode="auto", period=None, prices=prices) is None

    sched = {
        "summer": {"weekday": [80] + [None] * 23},
        "non_summer": {"weekday": [0] * 24},
    }
    assert (
        tou.target_soc(
            mode="manual",
            period="peak",
            season="summer",
            day_key="weekday",
            slot=0,
            tou_schedule=sched,
        )
        == 0.8
    )
    # 空白格＝HOLD
    assert (
        tou.target_soc(
            mode="manual",
            period="peak",
            season="summer",
            day_key="weekday",
            slot=1,
            tou_schedule=sched,
        )
        is None
    )
    # 缺格＝HOLD
    assert (
        tou.target_soc(
            mode="manual",
            period="peak",
            season="summer",
            day_key="weekday",
            slot=99,
            tou_schedule=sched,
        )
        is None
    )

    e_nom, eta = 200.0, 0.85
    ess = tou.desired_ess_kw(soc=0.5, target=1.0, e_nom_kwh=e_nom, charge_eff=eta)
    assert ess > 0
    dt = hours_per_data_row()
    assert abs(ess - (0.5 * e_nom) / (dt * eta)) < 1e-9

    ess_d = tou.desired_ess_kw(soc=0.5, target=0.0, e_nom_kwh=e_nom, charge_eff=eta)
    assert ess_d < 0

    assert tou.slot_index(step_minutes=60, data_min=0) == 0
    assert tou.slot_index(step_minutes=60, data_min=4) == 1

    # 日鍵吃區間 date，不吃 interval-end 標籤；週日末格 date=週日 → sunday
    from datetime import date as date_cls

    sun = date_cls(2024, 7, 7)
    assert tou.schedule_day_key(sun) == "sunday"
    assert tou.schedule_day_key(date_cls(2024, 7, 6)) == "saturday"
    assert tou.schedule_day_key(date_cls(2024, 7, 5)) == "weekday"
    assert tou.slot_index(step_minutes=60, data_min=95) == 23
    # 物化後 weekday[23]=0、sunday[23]=100：接續離峰不得放電
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
    keep = tou.intent(
        soc=0.9,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        mode="manual",
        period="off_peak",
        season="summer",
        date=sun,
        timestamp=pd.Timestamp("2024-07-08 00:00:00"),
        data_min=95,
        hour=23,
        tou_schedule=boundary_sched,
    )
    assert keep["target_soc"] == 1.0
    assert keep["desired_ess_kw"] >= 0
    # 僅有標籤時也須經 tpc 轉區間日（後備路徑）
    keep_ts = tou.intent(
        soc=0.9,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        mode="manual",
        period="off_peak",
        season="summer",
        timestamp=pd.Timestamp("2024-07-08 00:00:00"),
        data_min=95,
        hour=23,
        tou_schedule=boundary_sched,
    )
    assert keep_ts["target_soc"] == 1.0

    # intent + schedule：夏平日 10 點半尖峰應充電
    ts = pd.Timestamp("2024-07-01 10:00:00")  # 週一
    charge = tou.intent(
        soc=0.5,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        mode="auto",
        period="half_peak",
        season="summer",
        timestamp=ts,
        prices=prices,
        period_schedule=sch,
        tou_type="ThreeStage",
        hour=10,
    )
    assert charge["desired_ess_kw"] > 0

    hold = tou.intent(
        soc=0.5,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        mode="auto",
        period="half_peak",
        season="summer",
        timestamp=pd.Timestamp("2024-07-01 22:00:00"),
        prices=prices,
        period_schedule=sch,
        tou_type="ThreeStage",
        hour=22,
    )
    assert hold["desired_ess_kw"] == 0.0
    assert hold["target_soc"] == 0.5

    sat = tou.intent(
        soc=0.5,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        mode="auto",
        period="saturday_half_peak",
        season="summer",
        timestamp=pd.Timestamp("2024-07-06 12:00:00"),
        prices=prices,
        period_schedule=sch,
        tou_type="ThreeStage",
        hour=12,
    )
    assert sat["desired_ess_kw"] == 0.0

    dis = tou.intent(
        soc=0.5,
        e_nom_kwh=e_nom,
        charge_eff=eta,
        mode="auto",
        period="half_peak",
        season="non_summer",
        prices=prices,
    )
    assert dis["desired_ess_kw"] < 0

    # 夏半尖峰參考＋物化矩陣（平日最大尖峰 kWh → reserve SOC）
    rows = []
    for day in ("2024-07-01", "2024-07-02", "2024-07-03"):
        for h in range(24):
            for q in range(4):
                load = 50.0 if 16 <= h < 22 else (400.0 if 9 <= h < 16 else 80.0)
                ts = pd.Timestamp(f"{day} {h:02d}:{q * 15:02d}:00") + pd.Timedelta(minutes=15)
                rows.append(
                    {
                        "timestamp": ts,
                        "date": pd.Timestamp(day).date(),
                        "hour": float(h),
                        "min": h * 4 + q,
                        "kW": load,
                        "period": (
                            "peak"
                            if 16 <= h < 22
                            else ("half_peak" if 9 <= h < 16 or h >= 22 else "off_peak")
                        ),
                        "season": "summer",
                        "is_holiday": False,
                    }
                )
    # 假日尖峰極大，不得拉高 max_peak
    for h in range(24):
        for q in range(4):
            ts = pd.Timestamp(f"2024-07-04 {h:02d}:{q * 15:02d}:00") + pd.Timedelta(minutes=15)
            rows.append(
                {
                    "timestamp": ts,
                    "date": pd.Timestamp("2024-07-04").date(),
                    "hour": float(h),
                    "min": h * 4 + q,
                    "kW": 900.0 if 16 <= h < 22 else 80.0,
                    "period": "peak" if 16 <= h < 22 else "off_peak",
                    "season": "summer",
                    "is_holiday": True,
                }
            )
    df = pd.DataFrame(rows)
    ref_small_peak = tou.build_summer_halfpeak_ref(
        df,
        pcs_kw=500,
        batt_kwh=1000,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=eta,
        prices=prices,
    )
    assert ref_small_peak["enabled"] is True
    assert ref_small_peak["reason"] == "ok"
    assert 0.1 < ref_small_peak["reserve_soc"] < 0.9
    # 平日尖峰 50kW×6h＝300kWh；假日 900 不計入
    assert abs(float(ref_small_peak["max_peak_kwh"]) - 300.0) < 1.0
    mtx = tou.materialize_tou_schedule(
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        step_minutes=60,
        halfpeak_ref={**ref_small_peak, "season": "summer"},
        charge_eff=eta,
    )
    am = mtx["summer"]["weekday"][9:16]
    assert all(v == int(round(ref_small_peak["reserve_soc_pct"])) for v in am)
    assert mtx["summer"]["weekday"][16] == 0
    assert mtx["summer"]["weekday"][22] == 0  # 下一段離峰 → 放完，非 reserve
    assert mtx["summer"]["weekday"][0] == 100

    # 尖峰可放電量吃滿可用 SOC → 不預放；晚間中價仍放完
    rows2 = []
    for day in ("2024-07-01", "2024-07-02"):
        for h in range(24):
            for q in range(4):
                load = 800.0 if 16 <= h < 22 else 50.0
                ts = pd.Timestamp(f"{day} {h:02d}:{q * 15:02d}:00") + pd.Timedelta(minutes=15)
                rows2.append(
                    {
                        "timestamp": ts,
                        "date": pd.Timestamp(day).date(),
                        "hour": float(h),
                        "min": h * 4 + q,
                        "kW": load,
                        "period": "peak" if 16 <= h < 22 else ("half_peak" if 9 <= h < 16 or h >= 22 else "off_peak"),
                        "season": "summer",
                        "is_holiday": False,
                    }
                )
    ref_big = tou.build_summer_halfpeak_ref(
        pd.DataFrame(rows2),
        pcs_kw=500,
        batt_kwh=200,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=eta,
        prices=prices,
    )
    assert ref_big["enabled"] is False
    assert ref_big["reason"] == "peak_fills_usable"
    mtx2 = tou.materialize_tou_schedule(
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        halfpeak_ref={**ref_big, "season": "summer"},
        charge_eff=eta,
    )
    assert all(v is None for v in mtx2["summer"]["weekday"][9:16])
    assert mtx2["summer"]["weekday"][22] == 0

    # 兩段式無中價 → 不啟用預放
    plan2 = select_plan("HV", "TwoStage")
    ref2 = tou.build_midprice_reserve_ref(
        df,
        pcs_kw=500,
        batt_kwh=1000,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=eta,
        prices=plan2["prices"],
        season="summer",
    )
    assert ref2["enabled"] is False
    assert ref2["reason"] == "no_mid_tier"

    # 逐季預放：prepare_auto_tou 應帶 summer + non_summer
    local, meta = tou.prepare_auto_tou(
        df,
        {"touScheduleMode": "auto", "functions": ["tou"]},
        pcs_kw=500,
        batt_kwh=2000,
        tou_type="ThreeStage",
        prices=prices,
        period_schedule=sch,
        tou_step_minutes=60,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=eta,
    )
    assert local.get("touScheduleMode") == "manual"
    assert meta and "halfpeak_refs" in meta
    assert "summer" in meta["halfpeak_refs"] and "non_summer" in meta["halfpeak_refs"]

    print("ok", charge, hold, sat, dis, ref_small_peak["reserve_soc_pct"])


if __name__ == "__main__":
    main()
