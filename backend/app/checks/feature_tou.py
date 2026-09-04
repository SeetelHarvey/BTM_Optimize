"""TOU 功能：效率門檻 + look-ahead／manual 矩陣 → 意圖功率。"""

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

    # intent + schedule：夏平日 10 點半尖峰應充電
    import pandas as pd

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
    print("ok", charge, hold, sat, dis)


if __name__ == "__main__":
    main()
