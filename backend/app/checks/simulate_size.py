"""量體 pipeline 自檢。"""

import os

import pandas as pd

from app.services.bess.run import (
    _contract_adjustment,
    _daily_avg_pcs_util_pct,
    _dispatch_metrics,
    _hourly_pcs_util_pct,
    run_dispatch_charts,
    run_sample,
    run_size,
)
from app.services.bess.size_grid import (
    pick_results,
    plan_sample_grid,
)
from app.services.contracts import (
    ContractCapacity,
    calc_basic_charge_lines,
    free_off_peak_kw,
    with_off_peak_boost,
)
from app.services.schedule import default_intraday_off_peak_hours, label_periods
from app.services.tariff import annotate, get_rates, select_plan


def _df() -> pd.DataFrame:
    plan = select_plan("HV", "ThreeStage")
    ctx = {
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "matrix": plan["matrix"],
        "summer_range": plan["summer_range"],
        "holidays": plan["holidays"],
    }
    rows = []
    for day in ("2024-07-01", "2024-07-02", "2024-07-03"):
        for h in range(24):
            load = 900.0 if 9 <= h < 15 else 250.0
            ts = pd.Timestamp(f"{day} {h:02d}:00:00")
            rows.append({"timestamp": ts, "kW": load})
    for day in ("2024-01-08", "2024-01-09"):
        for h in range(24):
            if 11 <= h < 14:
                load = 200.0
            elif 6 <= h < 11 or 14 <= h < 24:
                load = 600.0
            else:
                load = 150.0
            ts = pd.Timestamp(f"{day} {h:02d}:00:00")
            rows.append({"timestamp": ts, "kW": load})
    raw = label_periods(pd.DataFrame(rows), ctx)
    return annotate(raw, plan)


def _adjustment_contracts() -> dict[str, float]:
    return ContractCapacity(
        regular_kw=100,
        half_peak_kw=50,
        saturday_half_peak_kw=30,
        off_peak_kw=20,
    ).to_dict()


def _adjustment_df() -> pd.DataFrame:
    plan = select_plan("HV", "ThreeStage")
    ctx = {
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "matrix": plan["matrix"],
        "summer_range": plan["summer_range"],
        "holidays": plan["holidays"],
    }
    rows = []
    for h in range(24):
        load = 900.0 if 9 <= h < 15 else 185.0
        rows.append({"timestamp": pd.Timestamp("2024-07-01") + pd.Timedelta(hours=h), "kW": load})
    raw = label_periods(pd.DataFrame(rows), ctx)
    return annotate(raw, plan)


_SEASON_METRIC_KEYS = (
    "pcs_daily_avg_pct_summer",
    "pcs_daily_avg_pct_non_summer",
    "daily_cycle_pct_summer",
    "daily_cycle_pct_non_summer",
)


def _cycle_disp(*, daily_kwh: float, pcs_kw: float = 100.0, season: str = "summer") -> pd.DataFrame:
    """合成 dispatch：單日固定放電 kWh（15 分一列）。"""
    step_kwh = pcs_kw * 0.25
    n = int(round(daily_kwh / step_kwh))
    ess = [0.0] * (96 - n) + [-pcs_kw] * n
    return pd.DataFrame({"date": ["2024-07-01"] * 96, "season": [season] * 96, "ess_kw": ess})


def main() -> None:
    df = _df()
    plan = select_plan("HV", "ThreeStage")
    contracts = ContractCapacity(regular_kw=1000).to_dict()
    settings = {
        "functions": ["tou", "demand"],
        "touScheduleMode": "auto",
        "demandBufferKw": 10,
        "socMin": 0.1,
        "socMax": 0.9,
        "chargeEff": 0.85,
        "antiExportKw": 0,
        "simulateTou": "ThreeStage",
    }
    sample = plan_sample_grid(
        df,
        contracts,
        tou_type="ThreeStage",
        buffer_kw=settings["demandBufferKw"],
    )
    assert sample["profile_stats"].get("ok") is True
    assert sample["grid_points"] > 0
    assert default_intraday_off_peak_hours("ThreeStage") == frozenset({11, 12, 13})
    assert sample["profile_stats"].get("two_cycle_sources")
    assert sample["peak_hours_max"] == 6
    assert sample.get("two_cycle_hours_max") == 6
    from app.services.bess.size_grid import pcs_candidates_from_stats
    assert len(pcs_candidates_from_stats(sample["profile_stats"])) >= 2
    ess_u = sample["profile_stats"].get("peak_ess_util") or {}
    cov = sample["profile_stats"].get("peak_coverage") or {}
    assert ess_u.get("avg") is not None and 0 <= float(ess_u["avg"]) <= 100
    assert cov.get("avg") is not None and 0 <= float(cov["avg"]) <= 100
    fc = sample["profile_stats"].get("full_cover_sources") or {}
    assert float((sample["profile_stats"].get("pcs_sample") or {}).get("full_cover") or 0) > 0
    assert fc.get("max_peak_kw", 0) > 0
    assert fc.get("max_day_peak_kwh", 0) > 0
    assert abs(float(fc["pcs_kw"]) - float(fc["max_peak_kw"])) < 1e-6
    assert float(fc["max_peak_kw"]) == float(
        (sample["profile_stats"].get("pcs_sample") or {})["full_cover"]
    )
    tc_pcs = round(float((sample["profile_stats"].get("pcs_sample") or {}).get("two_cycle") or 0), 3)
    if tc_pcs > 0:
        tc_hours = {
            round(c["hours"])
            for c in sample["combinations"]
            if abs(float(c["pcs_kw"]) - tc_pcs) < 1e-6
        }
        assert tc_hours == set(range(2, 7))
        assert sample["profile_stats"]["two_cycle_sources"].get("half_peak")

    preview = run_sample(df, contracts, settings, tou_type="ThreeStage")
    assert preview["grid_points"] == sample["grid_points"]
    assert preview["profile_stats"].get("ok") is True
    assert "contract_adjustment" in preview

    batt, soc_lo, soc_hi, eff = 100.0, 0.0, 1.0, 1.0
    usable = batt * (soc_hi - soc_lo) * eff
    one = _dispatch_metrics(
        _cycle_disp(daily_kwh=usable, pcs_kw=100.0),
        pcs_kw=100.0,
        batt_kwh=batt,
        soc_min=soc_lo,
        soc_max=soc_hi,
        charge_eff=eff,
    )
    two = _dispatch_metrics(
        _cycle_disp(daily_kwh=usable * 2, pcs_kw=100.0),
        pcs_kw=100.0,
        batt_kwh=batt,
        soc_min=soc_lo,
        soc_max=soc_hi,
        charge_eff=eff,
    )
    assert abs(one["daily_cycle_pct_summer"] - 100.0) < 0.5
    assert abs(two["daily_cycle_pct_summer"] - 200.0) < 0.5
    assert one["daily_cycle_pct_non_summer"] == 0.0
    assert "pcs_util_pct_summer" not in one
    assert 0 <= one["pcs_daily_avg_pct_summer"] <= 100.0

    pcs = 100.0
    mixed = pd.DataFrame({
        "date": ["2024-07-01"] * 4,
        "hour": [10, 10, 10, 10],
        "season": ["summer"] * 4,
        "ess_kw": [-pcs, -pcs * 0.25, -pcs * 0.25, -pcs * 0.25],
    })
    discharge = (-mixed["ess_kw"].astype(float)).clip(lower=0.0)
    assert isinstance(discharge, pd.Series)
    step_mean = float(discharge.mean() / pcs * 100.0)
    hour_peak = _hourly_pcs_util_pct(mixed, discharge, pcs_kw=pcs)
    assert step_mean < 60.0
    assert abs(hour_peak - 100.0) < 0.5

    two_day = pd.DataFrame({
        "date": ["2024-07-01", "2024-07-01", "2024-07-02", "2024-07-02"],
        "hour": [10, 11, 10, 11],
        "season": ["summer"] * 4,
        "ess_kw": [-pcs, -pcs * 0.5, -pcs * 0.8, -pcs * 0.2],
    })
    dis2 = (-two_day["ess_kw"].astype(float)).clip(lower=0.0)
    assert isinstance(dis2, pd.Series)
    day_avg = _daily_avg_pcs_util_pct(two_day, dis2, pcs_kw=pcs)
    assert abs(day_avg - 90.0) < 0.5

    # 空轉日計 0%，與 SOC 日循環同為全日曆平均
    with_idle = pd.DataFrame({
        "date": ["2024-07-01", "2024-07-01", "2024-07-02", "2024-07-02"],
        "hour": [10, 11, 10, 11],
        "season": ["summer"] * 4,
        "ess_kw": [-pcs, -pcs * 0.5, 0.0, 0.0],
    })
    dis_idle = (-with_idle["ess_kw"].astype(float)).clip(lower=0.0)
    idle_avg = _daily_avg_pcs_util_pct(with_idle, dis_idle, pcs_kw=pcs)
    assert abs(idle_avg - 50.0) < 0.5

    out = run_size(
        df,
        plan,
        contracts,
        settings,
        tou_type="ThreeStage",
        start_date="2024-07-01",
        end_date="2024-07-03",
        voltage_level="HV",
    )
    assert out["profile_stats"].get("ok") is True
    assert "pcs_sample" in out["profile_stats"]
    assert out["profile_stats"].get("peak_load")
    assert out["profile_stats"].get("off_margin")
    assert out["profile_stats"].get("peak_ess_util") is not None
    assert out["sample_source"] in ("profile", "fallback")
    assert out["grid_points"] > 0
    assert out["grid"]
    rec = out["recommended"]
    assert rec is not None
    assert rec["recommended"] is True
    assert any(r["recommended"] for r in out["grid"])
    assert rec["pcs_daily_avg_pct_summer"] >= 0
    assert rec["pcs_daily_avg_pct_summer"] <= 100.0
    assert rec["daily_cycle_pct_summer"] > 0
    assert out["after"]["total"] == (rec or out["best_effort"])["after_total"]
    assert any(r["savings"] > 0 for r in out["grid"])
    assert out["viable"] is True
    assert out["max_util"] is not None
    assert any(r["max_util"] for r in out["grid"])
    assert rec["after_basic_total"] is not None
    dc = out.get("dispatch_charts")
    assert dc is not None
    assert "hourly_mean" in dc and "soc_pct" in dc["hourly_mean"]
    assert "net_kw" in dc["hourly_mean"] and "ess_kw" in dc["hourly_mean"]
    assert dc["pcs_kw"] == rec["pcs_kw"]
    for row in out["grid"]:
        for key in _SEASON_METRIC_KEYS:
            assert key in row
        assert "capacity_efficient" not in row
        assert "pcs_util_pct" not in row
        assert "daily_cycle_pct" not in row
    lazy = run_dispatch_charts(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=float(rec["pcs_kw"]),
        batt_kwh=float(rec["batt_kwh"]),
        tou_type="ThreeStage",
    )
    assert lazy["charts"]["pcs_kw"] == rec["pcs_kw"]
    prev_workers = os.environ.get("SIM_SIZE_WORKERS")
    os.environ["SIM_SIZE_WORKERS"] = "1"
    try:
        seq = run_size(
            df,
            plan,
            contracts,
            settings,
            tou_type="ThreeStage",
            start_date="2024-07-01",
            end_date="2024-07-03",
            voltage_level="HV",
        )
    finally:
        if prev_workers is None:
            os.environ.pop("SIM_SIZE_WORKERS", None)
        else:
            os.environ["SIM_SIZE_WORKERS"] = prev_workers
    assert seq["recommended"]["pcs_kw"] == rec["pcs_kw"]
    assert seq["recommended"]["batt_kwh"] == rec["batt_kwh"]
    assert len(seq["grid"]) == len(out["grid"])

    neg = pick_results(
        [
            {"pcs_kw": 100, "batt_kwh": 100, "hours": 1, "savings": -10, "after_total": 0},
            {"pcs_kw": 100, "batt_kwh": 200, "hours": 2, "savings": -5, "after_total": 0},
        ],
        before_total=1000,
    )
    assert neg["viable"] is False and neg["recommended"] is None
    assert neg["best_effort"]["savings"] == -5

    savings_pick = pick_results(
        [
            {
                "pcs_kw": 100,
                "batt_kwh": 200,
                "hours": 2,
                "savings": 100,
                "after_total": 900,
                "pcs_daily_avg_pct_summer": 70,
                "pcs_daily_avg_pct_non_summer": 60,
                "daily_cycle_pct_summer": 70,
                "daily_cycle_pct_non_summer": 60,
            },
            {
                "pcs_kw": 100,
                "batt_kwh": 300,
                "hours": 3,
                "savings": 120,
                "after_total": 880,
                "pcs_daily_avg_pct_summer": 80,
                "pcs_daily_avg_pct_non_summer": 75,
                "daily_cycle_pct_summer": 80,
                "daily_cycle_pct_non_summer": 75,
            },
            {
                "pcs_kw": 100,
                "batt_kwh": 400,
                "hours": 4,
                "savings": 115,
                "after_total": 885,
                "pcs_daily_avg_pct_summer": 65,
                "pcs_daily_avg_pct_non_summer": 55,
                "daily_cycle_pct_summer": 65,
                "daily_cycle_pct_non_summer": 55,
            },
        ],
        before_total=1000,
    )
    assert savings_pick["best_effort"]["batt_kwh"] == 300
    assert savings_pick["max_util"]["batt_kwh"] == 200
    # 四項相乘×總節省：300
    assert savings_pick["recommended"]["batt_kwh"] == 300

    # 同時打分：高使用率／低節省  vs  均衡  vs  最高節省／低使用率
    joint_pick = pick_results(
        [
            {
                "pcs_kw": 80,
                "batt_kwh": 160,
                "savings": 50,
                "pcs_daily_avg_pct_summer": 100,
                "pcs_daily_avg_pct_non_summer": 100,
                "daily_cycle_pct_summer": 100,
                "daily_cycle_pct_non_summer": 100,
            },
            {
                "pcs_kw": 100,
                "batt_kwh": 300,
                "savings": 100,
                "pcs_daily_avg_pct_summer": 70,
                "pcs_daily_avg_pct_non_summer": 70,
                "daily_cycle_pct_summer": 70,
                "daily_cycle_pct_non_summer": 70,
            },
            {
                "pcs_kw": 120,
                "batt_kwh": 480,
                "savings": 120,
                "pcs_daily_avg_pct_summer": 40,
                "pcs_daily_avg_pct_non_summer": 40,
                "daily_cycle_pct_summer": 40,
                "daily_cycle_pct_non_summer": 40,
            },
            {
                "pcs_kw": 200,
                "batt_kwh": 200,
                "savings": -1,
                "pcs_daily_avg_pct_summer": 100,
                "pcs_daily_avg_pct_non_summer": 100,
                "daily_cycle_pct_summer": 100,
                "daily_cycle_pct_non_summer": 100,
            },
        ],
        before_total=1000,
    )
    assert joint_pick["best_effort"]["batt_kwh"] == 480
    # 單位電容量節省：100/300 > 50/160 > 120/480
    assert joint_pick["max_util"]["batt_kwh"] == 300
    # 四項滿分×總節省：160 仍勝（效率乘積壓過較低總額）
    assert joint_pick["recommended"]["batt_kwh"] == 160
    assert joint_pick["recommended"]["recommended"] is True
    assert joint_pick["viable"] is True
    assert joint_pick["max_util"]["batt_kwh"] != joint_pick["best_effort"]["batt_kwh"]

    util_pick = pick_results(
        [
            {
                "pcs_kw": 100,
                "batt_kwh": 200,
                "savings": 100,
                "pcs_daily_avg_pct_summer": 80,
                "pcs_daily_avg_pct_non_summer": 70,
                "daily_cycle_pct_summer": 80,
                "daily_cycle_pct_non_summer": 70,
            },
            {
                "pcs_kw": 100,
                "batt_kwh": 300,
                "savings": 120,
                "pcs_daily_avg_pct_summer": 90,
                "pcs_daily_avg_pct_non_summer": 85,
                "daily_cycle_pct_summer": 90,
                "daily_cycle_pct_non_summer": 85,
            },
            {
                "pcs_kw": 100,
                "batt_kwh": 400,
                "savings": 115,
                "pcs_daily_avg_pct_summer": 95,
                "pcs_daily_avg_pct_non_summer": 92,
                "daily_cycle_pct_summer": 95,
                "daily_cycle_pct_non_summer": 92,
            },
            {
                "pcs_kw": 200,
                "batt_kwh": 200,
                "savings": -1,
                "pcs_daily_avg_pct_summer": 100,
                "pcs_daily_avg_pct_non_summer": 100,
                "daily_cycle_pct_summer": 100,
                "daily_cycle_pct_non_summer": 100,
            },
        ],
        before_total=1000,
    )
    assert util_pick["best_effort"]["batt_kwh"] == 300
    assert util_pick["max_util"]["batt_kwh"] == 200
    # 四項相乘×總節省：400 效率乘積最高且總額不差 → 勝
    assert util_pick["recommended"]["batt_kwh"] == 400
    # 虧損點即使使用率滿分也不進正向池
    assert util_pick["max_util"]["savings"] > 0
    assert util_pick["recommended"]["savings"] > 0

    # 同額節省時高循環勝
    over_cycle = pick_results(
        [
            {
                "pcs_kw": 100,
                "batt_kwh": 200,
                "savings": 100,
                "pcs_daily_avg_pct_summer": 100,
                "pcs_daily_avg_pct_non_summer": 100,
                "daily_cycle_pct_summer": 100,
                "daily_cycle_pct_non_summer": 100,
            },
            {
                "pcs_kw": 100,
                "batt_kwh": 150,
                "savings": 100,
                "pcs_daily_avg_pct_summer": 100,
                "pcs_daily_avg_pct_non_summer": 100,
                "daily_cycle_pct_summer": 180,
                "daily_cycle_pct_non_summer": 180,
            },
        ],
        before_total=1000,
    )
    assert over_cycle["max_util"]["batt_kwh"] == 150
    assert over_cycle["recommended"]["batt_kwh"] == 150

    cap = ContractCapacity.from_dict(_adjustment_contracts())
    assert free_off_peak_kw(cap, "ThreeStage") == 25.0
    rates = get_rates("HV", "ThreeStage")["demand"]
    before_basic = calc_basic_charge_lines(cap, rates, "summer", "ThreeStage")["total"]
    boosted = with_off_peak_boost(cap, 25.0, "ThreeStage")
    after_basic = calc_basic_charge_lines(boosted, rates, "summer", "ThreeStage")["total"]
    assert before_basic == after_basic

    adj_df = _adjustment_df()
    _, off_info = _contract_adjustment(
        adj_df,
        cap,
        "ThreeStage",
        enabled=True,
        buffer_kw=10,
    )
    assert off_info["applied"] is True
    assert off_info["added_kw"] == 25.0
    assert off_info["off_peak_kw_after"] == 45.0
    assert off_info["peak_kwh"] > off_info["off_peak_headroom_kwh"]

    _, disabled_info = _contract_adjustment(
        adj_df,
        cap,
        "ThreeStage",
        enabled=False,
        buffer_kw=10,
    )
    assert disabled_info["applied"] is False
    assert disabled_info["reason"] == "disabled"

    full_cap = ContractCapacity(
        regular_kw=100,
        half_peak_kw=50,
        saturday_half_peak_kw=50,
        off_peak_kw=25,
    )
    assert free_off_peak_kw(full_cap, "ThreeStage") == 0.0
    _, no_quota = _contract_adjustment(
        adj_df,
        full_cap,
        "ThreeStage",
        enabled=True,
        buffer_kw=10,
    )
    assert no_quota["applied"] is False
    assert no_quota["reason"] == "no_free_quota"

    adj_plan = select_plan("HV", "ThreeStage")
    adj_settings = {
        "functions": ["tou"],
        "touScheduleMode": "auto",
        "demandBufferKw": 10,
        "autoAdjustOffPeakContract": True,
        "socMin": 0.1,
        "socMax": 0.9,
        "chargeEff": 0.85,
        "antiExportKw": 0,
        "simulateTou": "ThreeStage",
    }
    adj_out = run_size(
        adj_df,
        adj_plan,
        _adjustment_contracts(),
        adj_settings,
        tou_type="ThreeStage",
        start_date="2024-07-01",
        end_date="2024-07-01",
        voltage_level="HV",
    )
    ca = adj_out["contract_adjustment"]
    assert ca["applied"] is True
    assert ca["off_peak_kw_after"] == 45.0

    print("ok recommended", rec, "grid", len(out["grid"]), "contract_adj", ca["added_kw"])


if __name__ == "__main__":
    main()
