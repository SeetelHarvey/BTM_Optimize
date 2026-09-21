"""量體 pipeline 自檢。"""

import os

import pandas as pd

from app.services.bess.run import (
    _contract_adjustment,
    _daily_avg_pcs_util_pct,
    _dispatch_metrics,
    _hourly_pcs_util_pct,
    build_export_frame,
    run_compare_bills,
    run_dispatch_charts,
    run_export_xlsx,
    run_sample,
    run_size,
)
from app.services.bess.size_grid import (
    SIZING_TIER_MAX,
    SIZING_TIER_P50,
    SIZING_TIER_P90,
    SIZING_TIER_TWO_CYCLE,
    diagnose_sizing,
    pcs_candidates_from_stats,
    pick_results,
    plan_sample_grid,
    profile_stats,
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
        strategies=[SIZING_TIER_P50, SIZING_TIER_P90, SIZING_TIER_MAX, SIZING_TIER_TWO_CYCLE],
        prices=plan.get("prices"),
        charge_eff=0.85,
    )
    assert sample["profile_stats"].get("ok") is True
    assert sample["grid_points"] > 0
    assert default_intraday_off_peak_hours("ThreeStage") == frozenset({11, 12, 13})
    assert sample["profile_stats"].get("two_cycle_sources")
    assert sample.get("diagnosis", {}).get("ok") is True
    diag = diagnose_sizing(
        df, "ThreeStage", prices=plan.get("prices"), charge_eff=0.85, contracts=contracts, buffer_kw=10
    )
    assert diag["ok"] is True
    assert 0 <= diag["peak_kwh_share"] <= 100
    assert 0 <= diag["half_peak_kwh_share"] <= 100
    assert "saturday_half_peak" not in (diag.get("target_periods") or [])
    assert set(diag.get("target_periods") or []) <= {"peak", "half_peak"}
    diag_peak_only = diagnose_sizing(
        df,
        "ThreeStage",
        prices=plan.get("prices"),
        charge_eff=0.85,
        contracts=contracts,
        buffer_kw=10,
        include_half_peak=False,
    )
    assert diag_peak_only.get("target_periods") == ["peak"]
    diag_batch = diagnose_sizing(
        df, "BatchStage", prices=plan.get("prices"), charge_eff=0.85, contracts=contracts, buffer_kw=10
    )
    tc_batch = next(
        (a for a in (diag_batch.get("available_strategies") or []) if a.get("id") == SIZING_TIER_TWO_CYCLE),
        None,
    )
    assert tc_batch is not None and tc_batch.get("ok") is False
    assert tc_batch.get("reason") == "no_midday_off_peak"
    # 僅 P50 × 一檔電池 → 點數少於全選
    p50_only = plan_sample_grid(
        df,
        contracts,
        tou_type="ThreeStage",
        buffer_kw=10,
        strategies=[SIZING_TIER_P50],
        energy_keys=["p50"],
        prices=plan.get("prices"),
        charge_eff=0.85,
    )
    assert len(pcs_candidates_from_stats(p50_only["profile_stats"], [SIZING_TIER_P50])) <= 1
    assert p50_only["grid_points"] < sample["grid_points"]
    assert p50_only["grid_points"] >= 1
    cross = plan_sample_grid(
        df,
        contracts,
        tou_type="ThreeStage",
        buffer_kw=10,
        strategies=[SIZING_TIER_P50, SIZING_TIER_P90],
        energy_keys=["min", "p50", "p90"],
        prices=plan.get("prices"),
        charge_eff=0.85,
    )
    assert 1 <= cross["grid_points"] <= 4
    for c in cross.get("combinations") or []:
        assert c.get("seed_source") == "cross"
    empty_batt = plan_sample_grid(
        df,
        contracts,
        tou_type="ThreeStage",
        buffer_kw=10,
        strategies=[SIZING_TIER_P50],
        energy_keys=[],
        prices=plan.get("prices"),
        charge_eff=0.85,
    )
    assert empty_batt["grid_points"] == 0
    all_stats = profile_stats(
        df, contracts, "ThreeStage", buffer_kw=10, prices=plan.get("prices"), charge_eff=0.85
    )
    assert "max" in (all_stats.get("pcs_sample") or {})
    dual = all_stats.get("by_half_peak") or {}
    assert "true" in dual and "false" in dual
    assert "pcs_sample" in dual["true"] and "pcs_sample" in dual["false"]
    # 開半尖峰的分位／Max PCS ≥ 僅尖峰（需量只多不少）
    for tid in (SIZING_TIER_P50, SIZING_TIER_P90, SIZING_TIER_MAX):
        on_kw = float((dual["true"]["pcs_sample"] or {}).get(tid) or 0)
        off_kw = float((dual["false"]["pcs_sample"] or {}).get(tid) or 0)
        if on_kw > 0 and off_kw > 0:
            assert on_kw + 1e-9 >= off_kw
    fc_off_src = dual["false"].get("max_sources") or {}
    assert "peak" in (fc_off_src.get("periods") or ["peak"])
    assert "half_peak" not in (fc_off_src.get("periods") or [])
    fc_on_src = dual["true"].get("max_sources") or {}
    if fc_on_src:
        assert "half_peak" in (fc_on_src.get("periods") or [])
    # 能量種子固定僅尖峰：半尖峰開／關兩組相同
    e_off = (dual["false"].get("energy_shift") or {}).get("seeds") or {}
    e_on = (dual["true"].get("energy_shift") or {}).get("seeds") or {}
    for k in ("min", "p50", "p90", "max"):
        assert float((e_off.get(k) or {}).get("batt_kwh") or 0) == float(
            (e_on.get(k) or {}).get("batt_kwh") or 0
        )
        assert (e_off.get(k) or {}).get("periods", ["peak"]) == ["peak"]
    assert len(pcs_candidates_from_stats(sample["profile_stats"])) >= 2
    ess_u = sample["profile_stats"].get("peak_ess_util") or {}
    cov = sample["profile_stats"].get("peak_coverage") or {}
    assert ess_u.get("p50") is not None and 0 <= float(ess_u["p50"]) <= 100
    assert cov.get("p50") is not None and 0 <= float(cov["p50"]) <= 100
    fc = sample["profile_stats"].get("max_sources") or {}
    assert float((sample["profile_stats"].get("pcs_sample") or {}).get("max") or 0) > 0
    assert fc.get("max_kw", 0) > 0
    assert "max_day_kwh" not in fc
    # Max（全覆蓋）受同日離峰可充限制
    assert float(fc["pcs_kw"]) <= float(fc["max_kw"]) + 1e-9
    assert abs(
        float(fc["pcs_kw"])
        - float((sample["profile_stats"].get("pcs_sample") or {})["max"])
    ) < 1e-6
    assert sample["grid_points"] > 0
    assert sample.get("sample_source") in ("profile", "none")
    energy = (sample["profile_stats"].get("energy_shift") or {}).get("seeds") or {}
    assert any(float((energy.get(k) or {}).get("pcs_kw") or 0) > 0 for k in ("min", "p50", "p90", "max"))
    tc_pcs = round(float((sample["profile_stats"].get("pcs_sample") or {}).get("two_cycle") or 0), 3)
    if tc_pcs > 0:
        tc_src = sample["profile_stats"]["two_cycle_sources"]
        assert tc_src.get("half_peak")
        assert tc_src.get("mid_off_margin")
        assert "off_margin" not in tc_src
        # 交叉組合：同一 PCS 可配多檔電池（去重後）
        tc_rows = [
            c for c in sample["combinations"]
            if abs(float(c["pcs_kw"]) - tc_pcs) < 1e-6
        ]
        assert len(tc_rows) >= 1

    preview = run_sample(
        df, contracts, settings, tou_type="ThreeStage", prices=plan.get("prices")
    )
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
    assert one["daily_cycle_pct_non_summer"] in (0.0, None)
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
    assert out["profile_stats"].get("peak_ess_util") is not None
    assert out["sample_source"] in ("profile", "none")
    assert out["grid_points"] > 0
    assert out["grid"]
    rec = out["recommended"]
    assert rec is not None
    assert rec["recommended"] is True
    assert rec.get("engineering_score_parts", {}).get("includes_capex") is False
    assert any(r["recommended"] for r in out["grid"])
    assert rec["pcs_daily_avg_pct_summer"] is None or rec["pcs_daily_avg_pct_summer"] >= 0
    if rec["pcs_daily_avg_pct_summer"] is not None:
        assert rec["pcs_daily_avg_pct_summer"] <= 100.0
    assert rec["daily_cycle_pct_summer"] is None or rec["daily_cycle_pct_summer"] > 0
    # 主報告 after 在無 stage2 時對齊推薦
    assert out["after"]["total"] == (rec or out["best_effort"])["after_total"]
    assert any(r["savings"] > 0 for r in out["grid"])
    assert out["viable"] is True
    assert out["max_util"] is not None
    assert any(r["max_util"] for r in out["grid"])
    assert rec["after_basic_total"] is not None
    assert out.get("timing") and "dispatch_count" in out["timing"]
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
        assert "engineering_score" in row
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
    # 工程折衷：savings × 循環利用率 → 300
    assert savings_pick["recommended"]["batt_kwh"] == 300
    assert "engineering_score_parts" in savings_pick["recommended"]

    # 同時打分：高循環／低節省  vs  均衡  vs  最高節省／低循環
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
    # 工程折衷：100×0.7 勝 50×1.0 與 120×0.4
    assert joint_pick["recommended"]["batt_kwh"] == 300
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
    # savings × 循環：400 最高
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
        "evaluateContractReduction": True,
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
    # 離峰免費增額改在契約候選層，不再於第1層套用
    ca = adj_out["contract_adjustment"]
    assert ca["applied"] is False
    assert ca["reason"] == "disabled"
    s2 = adj_out.get("stage2") or {}
    final = s2.get("final") or {}
    sel = final.get("selected_contract") or {}
    # 候選專屬免費增額（若可行）
    assert "free_off_peak_added_kw" in sel or not s2.get("enabled")
    if sel.get("free_off_peak_added_kw"):
        assert float(sel["free_off_peak_added_kw"]) > 0

    # 即時備轉：同步帳單 + 額外收益恆等式；不混入 energy
    reserve_settings = {
        "functions": ["tou", "reserve"],
        "touScheduleMode": "auto",
        "reserveScheduleMode": "manual",
        "reserveSchedule": {
            "summer": {"weekday": [0.0] * 10 + [0.5] + [0.0] * 13, "saturday": [0.0] * 24, "sunday": [0.0] * 24},
            "non_summer": {"weekday": [0.0] * 24, "saturday": [0.0] * 24, "sunday": [0.0] * 24},
        },
        "reserveCapacityPrice": 200,
        "reservePerformancePrice": 100,
        "reserveEnergyPrice": 1000,
        "reserveMonthlyDispatchCount": 1,
        "socMin": 0.1,
        "socMax": 0.9,
        "chargeEff": 0.85,
        "antiExportKw": 0,
        "simulateTou": "ThreeStage",
    }
    reserve_contracts = ContractCapacity(regular_kw=2000).to_dict()
    # 縮小網格：只跑 sample 後的第一個點級別會慢；用短 df
    r_df = _df().copy()
    r_out = run_size(
        r_df,
        plan,
        reserve_contracts,
        reserve_settings,
        tou_type="ThreeStage",
        start_date=str(r_df["date"].min()),
        end_date=str(r_df["date"].max()),
        voltage_level="HV",
    )
    ri = r_out.get("reserve_income") or {}
    assert "capacity" in ri and "performance" in ri and "activation_energy" in ri
    assert "energy" not in ri
    # 備轉可能因無淨增益回退；有投標收入或回退標記皆可
    meta = r_out.get("reserve_meta") or {}
    assert int(ri.get("capacity") or 0) > 0 or meta.get("rolled_back") or meta.get("reason") == "no_net_gain"
    split = r_out.get("benefit_split") or {}
    assert "sizing_savings" in split and "reserve_gain" in split
    assert int(r_out["savings"]) == int(split.get("total") or r_out["savings"])
    assert int((r_out.get("after") or {}).get("energy_total") or 0) >= 0
    assert "energy" not in (r_out.get("after") or {})
    # BatchStage 備轉格數
    from app.services.features.reserve import empty_schedule as _empty_sched
    assert len(_empty_sched(30)["summer"]["weekday"]) == 48
    assert len(_empty_sched(60)["summer"]["weekday"]) == 24
    assert r_out.get("stage2") and r_out["stage2"].get("enabled") is True
    assert r_out["stage2"].get("reserve") is True
    # stage2 只處理推薦點；stage1 三點身分保留且不被覆寫
    s1 = r_out.get("stage1") or {}
    assert s1.get("recommended")
    assert round(float(s1["recommended"]["pcs_kw"]), 3) == round(
        float(r_out["recommended"]["pcs_kw"]), 3
    )
    assert round(float(s1["recommended"]["batt_kwh"]), 3) == round(
        float(r_out["recommended"]["batt_kwh"]), 3
    )
    # stage2 只有一個 final 點
    assert len(r_out["stage2"].get("points") or []) == 1
    assert r_out["stage2"].get("final")
    # 網格列仍是第1層電費（無備轉合計混入）
    for row in r_out.get("grid") or []:
        assert int(row.get("reserve_income_total") or 0) == 0
        assert int(row["savings"]) == int(row["bill_savings"])

    # 契約降容 what-if：第2層 regular ≤ 第1層；階層候選
    cut_settings = {
        **settings,
        "functions": ["tou"],
        "evaluateContractReduction": True,
        "demandBufferKw": 10,
        "autoAdjustOffPeakContract": True,
    }
    cut_out = run_size(
        df,
        plan,
        contracts,
        cut_settings,
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
    )
    assert cut_out.get("stage2") and cut_out["stage2"].get("evaluate_contract_reduction") is True
    s1_reg = float((cut_out.get("stage1") or {}).get("contracts", {}).get("regular_kw") or 0)
    assert len(cut_out["stage2"].get("points") or []) == 1
    for pt in cut_out["stage2"].get("points") or []:
        used = float((pt.get("stage2_contracts") or {}).get("regular_kw") or s1_reg)
        assert used <= s1_reg + 1e-6
        cr = pt.get("contract_reduction") or {}
        assert "peak_day_avg_kw" in cr and "peak_grid_p95_kw" in cr
        cands = pt.get("contract_candidates") or []
        assert len(cands) >= 1
        assert pt.get("selected_contract")
        # 階層：降經常 → 半尖峰補齊 → 剩餘轉離峰
        for c in cands:
            if c.get("id") == "current":
                continue
            off = float(c.get("off_peak_replaced_kw") or 0)
            hp = max(0.0, float(c.get("half_peak_delta_kw") or 0))
            sat = max(0.0, float(c.get("saturday_half_peak_delta_kw") or 0))
            assert off >= -1e-9
            reg_d = float(c.get("regular_delta_kw") or 0)
            assert off + hp + sat <= reg_d + 1e-6
        assert "half_peak_grid_max_kw" in cr
        assert "half_peak_delta_kw" in (pt.get("selected_contract") or {})
    assert cut_out.get("benefit_split")
    assert "sizing_savings" in cut_out["benefit_split"]

    # 換方案：原始電費走 baseline，模擬走情境
    plan_two = select_plan("HV", "TwoStage")
    raw_cols = [c for c in df.columns if c in ("timestamp", "kW")]
    df_two = annotate(label_periods(df[raw_cols].copy(), {
        "tou_slot_minutes": plan_two["tou_slot_minutes"],
        "matrix": plan_two["matrix"],
        "summer_range": plan_two["summer_range"],
        "holidays": plan_two["holidays"],
    }), plan_two)
    contracts_two = ContractCapacity(regular_kw=1000, non_summer_kw=200).to_dict()
    cross = run_size(
        df_two,
        plan_two,
        contracts_two,
        settings,
        tou_type="TwoStage",
        start_date="2024-07-01",
        end_date="2024-07-03",
        voltage_level="HV",
        baseline_tou_type="ThreeStage",
        baseline_contracts=contracts,
        baseline_plan=plan,
        baseline_df=df,
    )
    assert cross["baseline_tou_type"] == "ThreeStage"
    assert cross["simulate_tou_type"] == "TwoStage"
    assert int(cross["before"]["total"]) == int(out["before"]["total"])

    # 匯出：時間／用電／功率／電價／金額
    hi = out.get("recommended") or out.get("best_effort")
    assert hi
    frame = build_export_frame(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=float(hi["pcs_kw"]),
        batt_kwh=float(hi["batt_kwh"]),
        tou_type="ThreeStage",
    )
    assert list(frame.columns) == [
        "時間",
        "原始用電",
        "功率",
        "調整後用電",
        "SOC百分比",
        "原始電價",
        "新方案電價",
        "原始金額",
        "新金額",
        "差額",
    ]
    assert len(frame) == len(df)
    xlsx = run_export_xlsx(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=float(hi["pcs_kw"]),
        batt_kwh=float(hi["batt_kwh"]),
        tou_type="ThreeStage",
    )
    assert isinstance(xlsx, (bytes, bytearray)) and len(xlsx) > 100
    assert xlsx[:2] == b"PK"  # zip/xlsx

    # 方案比對：完整電費（months／summary）；日期與 run_size 同口徑
    cmp = run_compare_bills(
        df,
        plan,
        contracts,
        settings,
        pcs_kw=float(hi["pcs_kw"]),
        batt_kwh=float(hi["batt_kwh"]),
        tou_type="ThreeStage",
        start_date="2024-07-01",
        end_date="2024-07-03",
        voltage_level="HV",
    )
    assert "months" in cmp["baseline"] and "summary" in cmp["baseline"]
    assert "months" in cmp["scheme"] and "summary" in cmp["scheme"]
    assert cmp["baseline"]["months"] and cmp["scheme"]["months"]
    assert int(cmp["scheme"]["energy_total"]) > 0
    assert abs(int(cmp["scheme"]["total"]) - int(hi["after_total"])) < max(
        5000, abs(int(hi["after_total"])) // 5
    )

    # 用電大戶：<5MW 不可用；≥5MW 仍 pending／skipped（義務未定）
    from app.services.bess.dispatch import skipped_functions
    assert "large_user" in skipped_functions(["tou", "large_user"])
    lu_low = run_size(
        df,
        plan,
        ContractCapacity(regular_kw=4999).to_dict(),
        {**settings, "functions": ["tou", "large_user"]},
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
    )
    assert lu_low.get("large_user_status") == "ineligible"
    assert "large_user" in (lu_low.get("skipped") or [])
    lu_hi = run_size(
        df,
        plan,
        ContractCapacity(regular_kw=5000).to_dict(),
        {**settings, "functions": ["tou", "large_user"]},
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
    )
    assert lu_hi.get("large_user_status") == "pending"
    assert "large_user" in (lu_hi.get("skipped") or [])

    # 兩段：stage1 不含契約／備轉；stage2 才補 proposal／feasibility
    from app.services.bess.run import run_size_stage1, run_size_stage2

    s1_only = run_size_stage1(
        df,
        plan,
        contracts,
        cut_settings,
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
    )
    assert s1_only.get("need_full") is True
    assert s1_only.get("stage2") is None
    assert int((s1_only.get("benefit_split") or {}).get("contract_gain") or 0) == 0
    s2_only = run_size_stage2(
        s1_only,
        df,
        plan,
        contracts,
        cut_settings,
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
    )
    assert s2_only.get("stage2") and s2_only["stage2"].get("enabled")
    fin = s2_only["stage2"]["final"]
    assert fin.get("proposal") and fin.get("constraints") and isinstance(fin.get("feasibility"), list)
    assert int(s2_only["savings"]) == int((s2_only.get("benefit_split") or {}).get("total") or 0)

    # 非推薦標註點也可跑 stage2；不覆寫頂層推薦口徑
    rec_key = (
        round(float(fin["pcs_kw"]), 3),
        round(float(fin["batt_kwh"]), 3),
    )
    alt = None
    for cand in (
        s1_only.get("best_effort"),
        s1_only.get("max_util"),
        *((s1_only.get("grid") or [])),
    ):
        if not cand:
            continue
        key = (round(float(cand["pcs_kw"]), 3), round(float(cand["batt_kwh"]), 3))
        if key != rec_key:
            alt = cand
            break
    assert alt is not None, "fixture grid needs a non-recommended size"
    s2_alt = run_size_stage2(
        s1_only,
        df,
        plan,
        contracts,
        cut_settings,
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
        pcs_kw=float(alt["pcs_kw"]),
        batt_kwh=float(alt["batt_kwh"]),
    )
    alt_fin = (s2_alt.get("stage2") or {}).get("final") or {}
    assert round(float(alt_fin["pcs_kw"]), 3) == round(float(alt["pcs_kw"]), 3)
    assert round(float(alt_fin["batt_kwh"]), 3) == round(float(alt["batt_kwh"]), 3)
    assert round(float(s2_alt["recommended"]["pcs_kw"]), 3) == round(
        float(s1_only["recommended"]["pcs_kw"]), 3
    )
    # 頂層 savings／benefit 仍為 stage1；非推薦不覆寫推薦口徑
    assert int(s2_alt["savings"]) == int(s1_only["savings"])
    assert (s2_alt.get("benefit_split") or {}) == (s1_only.get("benefit_split") or {})

    print("ok recommended", rec, "grid", len(out["grid"]), "contract_adj", ca["added_kw"], "reserve", ri.get("total"))


if __name__ == "__main__":
    main()
