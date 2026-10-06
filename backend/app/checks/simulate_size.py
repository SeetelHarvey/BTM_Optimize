"""量體 pipeline 自檢。"""

import os

import pandas as pd

from app.services.bess.run import (
    _daily_avg_pcs_util_pct,
    _dispatch_metrics,
    _hourly_pcs_util_pct,
    build_export_frame,
    run_compare_bills,
    run_dispatch_charts,
    run_export_xlsx,
    manual_size_point,
    run_sample,
    run_size,
)
from app.services.quantize import ceil_to_step
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
    shortlist_combinations,
)
from app.services.contracts import (
    ContractCapacity,
    allowance_kw,
    calc_basic_charge_lines,
    rule_based_contract_proposal,
    validate,
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
            # 夏：對齊標註後 tip 尖峰列（含 22:00），batt/PCS ≥ 2h
            if 16 <= h <= 22:
                load = 400.0
            elif 9 <= h < 16:
                load = 280.0
            else:
                load = 80.0
            ts = pd.Timestamp(f"{day} {h:02d}:00:00")
            rows.append({"timestamp": ts, "kW": load})
    for day in ("2024-01-08", "2024-01-09"):
        for h in range(24):
            if 11 <= h < 14:
                load = 100.0
            elif 6 <= h < 11 or 14 <= h < 24:
                load = 300.0
            else:
                load = 80.0
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


def _assert_benefit_report(out: dict, *, pending: bool | None = None) -> dict:
    """效益報告金額皆由後端提供且維持加總恆等式。"""
    report = out.get("benefit_report") or {}
    summary = report.get("summary") or {}
    sections = report.get("sections") or {}
    assert {"basic", "energy", "overage", "extra"} <= set(sections)
    basic = sections["basic"]
    energy = sections["energy"]
    overage = sections["overage"]
    extra = sections["extra"]
    bill_savings = sum(
        int(section.get("benefit") or 0)
        for section in (basic, energy, overage)
    )
    assert int(summary.get("bill_savings") or 0) == bill_savings
    assert int(summary.get("total_benefit") or 0) == (
        bill_savings + int(summary.get("extra_income") or 0)
    )
    assert int(summary.get("extra_income") or 0) == int(extra.get("benefit") or 0)
    assert int(summary.get("after_bill_total") or 0) == sum(
        int(section.get("after") or 0)
        for section in (basic, energy, overage)
    )
    transfer = energy.get("transfer") or {}
    if transfer.get("energy_total_delta") is not None:
        assert int(transfer["energy_total_delta"]) == -int(energy["benefit"])
    if pending is not None:
        assert bool(summary.get("pending")) is pending
    return report


def main() -> None:
    assert manual_size_point({"sizingMode": "grid", "manualPcsKw": 100, "manualBattKwh": 200}) is None
    assert manual_size_point({"sizingMode": "single", "manualPcsKw": 125.4, "manualBattKwh": 400}) == (125.4, 400.0)
    try:
        manual_size_point({"sizingMode": "single", "manualPcsKw": 0, "manualBattKwh": 10})
        raise AssertionError("zero pcs should fail")
    except ValueError:
        pass
    assert ceil_to_step(0) == 0
    assert ceil_to_step(0.1) == 10
    assert ceil_to_step(10) == 10
    assert ceil_to_step(10.01) == 20
    assert ceil_to_step(237.4) == 240

    # 0.5C 過濾：hours < 2 不進網格
    _crate = shortlist_combinations(
        {
            "ok": True,
            "pcs_sample": {"p50": 100, "p90": 200, "max": 300},
            "energy_shift": {
                "seeds": {
                    "min": {"batt_kwh": 100, "pcs_kw": 50},
                    "p50": {"batt_kwh": 200, "pcs_kw": 100},
                    "p90": {"batt_kwh": 400, "pcs_kw": 100},
                    "max": {"batt_kwh": 600, "pcs_kw": 100},
                }
            },
        },
        ["p50", "p90", "max"],
        energy_keys=["min", "p50", "p90", "max"],
    )
    assert _crate["grid_points"] == 6
    assert all(float(c["hours"]) + 1e-9 >= 2.0 for c in _crate["combinations"])
    assert not any(c["pcs_kw"] == 300 and c["batt_kwh"] == 100 for c in _crate["combinations"])

    df = _df()
    plan = select_plan("HV", "ThreeStage")
    contracts = ContractCapacity(regular_kw=1000).to_dict()
    settings = {
        "functions": ["tou"],
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
    for combo in sample.get("combinations") or []:
        assert float(combo["pcs_kw"]) % 10 == 0
        assert float(combo["batt_kwh"]) % 10 == 0
        assert float(combo["hours"]) + 1e-9 >= 2.0
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
    # 開／關半尖峰兩組都有 PCS 樣本（需量高低視負載形狀，不強制 on≥off）
    for tid in (SIZING_TIER_P50, SIZING_TIER_P90, SIZING_TIER_MAX):
        on_kw = float((dual["true"]["pcs_sample"] or {}).get(tid) or 0)
        off_kw = float((dual["false"]["pcs_sample"] or {}).get(tid) or 0)
        assert on_kw > 0 and off_kw > 0
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
    assert "contract_adjustment" not in preview

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
    _assert_benefit_report(out, pending=False)
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
    assert "soc_pct" in dc["heatmap"] and "net_kw" in dc["heatmap"] and "ess_kw" in dc["heatmap"]
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
    assert allowance_kw(cap, "ThreeStage") == 25.0
    # 規則式重配：只有經常加預留；半尖累計以原總量為上限
    rule = rule_based_contract_proposal(
        {"regular_kw": 1300, "half_peak_kw": 0, "saturday_half_peak_kw": 0, "off_peak_kw": 0},
        "ThreeStage",
        residual={
            "peak_grid_max_kw": 774,
            "half_peak_grid_max_kw": 1380,
            "saturday_half_peak_grid_max_kw": 1500,
            "off_peak_grid_max_kw": 0,
        },
        buffer_kw=40,
    )
    rule_c = rule["contracts"]
    assert rule_c["regular_kw"] == 820.0
    assert rule_c["half_peak_kw"] == 480.0
    assert rule_c["regular_kw"] + rule_c["half_peak_kw"] == 1300.0
    # 週六至少吃滿免費額度：C3 = C2 + 650 = 1950
    assert rule_c["saturday_half_peak_kw"] == 650.0
    assert rule_c["off_peak_kw"] == 0.0
    assert rule["free_allowance_total_kw"] == 650.0
    assert rule["free_allowance_used_kw"] == 650.0
    assert rule["billable_lower_kw"] == 0.0
    # 週六超過免費額度仍完整補足，只對超出部分計費
    paid_sat = rule_based_contract_proposal(
        {"regular_kw": 1300, "half_peak_kw": 0, "saturday_half_peak_kw": 0, "off_peak_kw": 0},
        "ThreeStage",
        residual={
            "peak_grid_max_kw": 774,
            "half_peak_grid_max_kw": 1380,
            "saturday_half_peak_grid_max_kw": 2100,
            "off_peak_grid_max_kw": 0,
        },
        buffer_kw=40,
    )
    assert paid_sat["contracts"]["saturday_half_peak_kw"] == 800.0
    assert paid_sat["billable_lower_kw"] == 150.0
    # 離峰依實際最大值補足，不再固定維持原現行總量
    keep_total = rule_based_contract_proposal(
        {"regular_kw": 100, "half_peak_kw": 0, "saturday_half_peak_kw": 0, "off_peak_kw": 100},
        "ThreeStage",
        residual={
            "peak_grid_max_kw": 80,
            "half_peak_grid_max_kw": 80,
            "saturday_half_peak_grid_max_kw": 80,
            "off_peak_grid_max_kw": 300,
        },
        buffer_kw=0,
    )
    keep_c = keep_total["contracts"]
    assert keep_c["regular_kw"] == 80.0
    assert keep_c["saturday_half_peak_kw"] == 40.0
    assert keep_c["off_peak_kw"] == 180.0
    assert sum(keep_c[k] for k in ("regular_kw", "half_peak_kw", "saturday_half_peak_kw", "off_peak_kw")) == 300.0
    # 兩段式沿用 non_summer_kw 作為次段欄位
    two_rule = rule_based_contract_proposal(
        {"regular_kw": 100, "non_summer_kw": 50, "saturday_half_peak_kw": 0, "off_peak_kw": 0},
        "TwoStage",
        residual={
            "peak_grid_max_kw": 80,
            "non_summer_grid_max_kw": 140,
            "saturday_half_peak_grid_max_kw": 0,
            "off_peak_grid_max_kw": 0,
        },
        buffer_kw=0,
    )
    assert two_rule["contracts"]["regular_kw"] == 80.0
    assert two_rule["contracts"]["non_summer_kw"] == 60.0
    assert two_rule["contracts"]["half_peak_kw"] == 0.0
    # 計費：週六落在容許額度內時基本費不變（契約優化不強制灌滿額度）
    rates = get_rates("HV", "ThreeStage")["demand"]
    before_basic = calc_basic_charge_lines(cap, rates, "summer", "ThreeStage")["total"]
    allow = allowance_kw(cap, "ThreeStage")
    sat_boosted = validate(
        ContractCapacity.from_dict({
            **cap.to_dict(),
            "saturday_half_peak_kw": float(cap.saturday_half_peak_kw) + allow,
        }),
        "ThreeStage",
    )
    after_basic = calc_basic_charge_lines(sat_boosted, rates, "summer", "ThreeStage")["total"]
    assert before_basic == after_basic
    assert sat_boosted.off_peak_kw == cap.off_peak_kw
    assert sat_boosted.saturday_half_peak_kw == cap.saturday_half_peak_kw + allow

    full_cap = ContractCapacity(
        regular_kw=100,
        half_peak_kw=50,
        saturday_half_peak_kw=50,
        off_peak_kw=25,
    )
    assert allowance_kw(full_cap, "ThreeStage") == 0.0

    adj_plan = select_plan("HV", "ThreeStage")
    adj_settings = {
        "functions": ["tou", "demand"],
        "touScheduleMode": "auto",
        "demandBufferKw": 10,
        "evaluateContractReduction": True,
        "socMin": 0.1,
        "socMax": 0.9,
        "chargeEff": 0.85,
        "antiExportKw": 0,
        "simulateTou": "ThreeStage",
    }
    adj_out = run_size(
        _adjustment_df(),
        adj_plan,
        _adjustment_contracts(),
        adj_settings,
        tou_type="ThreeStage",
        start_date="2024-07-01",
        end_date="2024-07-01",
        voltage_level="HV",
    )
    assert "contract_adjustment" not in adj_out
    s2 = adj_out.get("stage2") or {}
    final = s2.get("final") or {}
    sel = final.get("selected_contract") or {}
    assert s2.get("enabled")
    assert "allowance_added_kw" in sel
    if sel.get("allowance_added_kw"):
        assert float(sel["allowance_added_kw"]) > 0

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
    reserve_report = _assert_benefit_report(r_out, pending=False)
    assert reserve_report["sections"]["extra"]["visible"] is True
    assert int(reserve_report["summary"]["extra_income"]) == int(
        (r_out.get("reserve_income") or {}).get("total") or 0
    )
    ri = r_out.get("reserve_income") or {}
    assert "capacity" in ri and "performance" in ri and "activation_energy" in ri
    assert "energy" not in ri
    # 備轉可能因無淨增益回退；有投標收入或回退標記皆可
    meta = r_out.get("reserve_meta") or {}
    assert int(ri.get("capacity") or 0) > 0 or meta.get("rolled_back") or meta.get("reason") == "no_net_gain"
    split = r_out.get("benefit_split") or {}
    assert "sizing_savings" in split and "reserve_gain" in split
    reserve_summaries = {
        item["id"]: item for item in (r_out.get("feature_summaries") or [])
    }
    assert set(reserve_summaries) == {"reserve"}
    reserve_summary = reserve_summaries["reserve"]
    assert reserve_summary["status"] in {"adopted", "rolled_back"}
    assert reserve_summary["benefit"] == int(split.get("reserve_gain") or 0)
    assert "reserve_income" in {
        metric["key"] for metric in reserve_summary.get("metrics") or []
    }
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

    # 契約規則式重配：唯一提案重跑，較貴時維持現行
    cut_settings = {
        **settings,
        "functions": ["tou", "demand"],
        "evaluateContractReduction": True,
        "demandBufferKw": 10,
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
    cut_report = _assert_benefit_report(cut_out, pending=False)
    assert cut_out.get("stage2") and cut_out["stage2"].get("evaluate_contract_reduction") is True
    s1_before = (cut_out.get("stage1") or {}).get("before") or cut_out.get("before") or {}
    # Stage2 before 必須與 Stage1 原始帳單同口徑（不可用降約後契約重算 before）
    assert int(cut_report["sections"]["basic"]["before"]) == int(
        s1_before.get("basic_total") or 0
    )
    assert int(cut_report["sections"]["overage"]["before"]) == int(
        s1_before.get("overage_total") or 0
    )
    assert len(cut_out["stage2"].get("points") or []) == 1
    for pt in cut_out["stage2"].get("points") or []:
        cr = pt.get("contract_reduction") or {}
        assert "peak_grid_max_kw" in cr
        assert "half_peak_grid_max_kw" in cr
        proposal = ((pt.get("proposal") or {}).get("contracts") or {})
        rule_row = proposal.get("rule") or {}
        selected = pt.get("selected_contract") or {}
        assert rule_row.get("id") == "rule"
        assert selected.get("id") in {"rule", "baseline"}
        assert len(rule_row.get("basis") or []) == 4
        assert proposal.get("current_bill") and proposal.get("proposed_bill")
        current_total = int(proposal["current_bill"]["total"])
        proposed_total = int(proposal["proposed_bill"]["total"])
        if selected.get("id") == "rule":
            assert proposed_total < current_total
            assert rule_row.get("adopted") is True
        else:
            assert proposed_total >= current_total
            assert rule_row.get("adopted") is False
    assert cut_out.get("benefit_split")
    assert "sizing_savings" in cut_out["benefit_split"]
    cut_summaries = {
        item["id"]: item for item in (cut_out.get("feature_summaries") or [])
    }
    assert set(cut_summaries) == {"demand"}
    assert cut_summaries["demand"]["status"] in {"adopted", "unchanged"}
    assert isinstance(cut_summaries["demand"]["benefit"], int)
    assert cut_summaries["demand"]["reason"] in {
        "contract_rule_adopted",
        "contract_no_gain",
    }
    assert {"regular_kw", "reducible_kw", "max_kw"} <= {
        metric["key"] for metric in cut_summaries["demand"].get("metrics") or []
    }
    decision = cut_summaries["demand"].get("decision") or {}
    assert {
        "current_contracts",
        "proposed_contracts",
        "selected_contracts",
        "current_regular_kw",
        "selected_regular_kw",
        "selected_id",
        "basis",
        "current_bill",
        "proposed_bill",
        "adjustments",
    } <= set(decision)
    assert isinstance(decision["current_contracts"], dict)
    assert isinstance(decision["selected_contracts"], dict)
    assert "regular_kw" in decision["selected_contracts"]
    assert len(decision.get("basis") or []) == 4
    assert int(decision["proposed_bill"]["total"]) - int(
        decision["current_bill"]["total"]
    ) == int(decision.get("bill_delta") or 0)
    if cut_summaries["demand"]["status"] == "adopted":
        assert cut_report["sections"]["basic"]["visible"] is True

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
    cross_report = _assert_benefit_report(cross, pending=False)
    assert cross["baseline_tou_type"] == "ThreeStage"
    assert cross["simulate_tou_type"] == "TwoStage"
    assert int(cross["before"]["total"]) == int(out["before"]["total"])
    if cross_report["sections"]["basic"]["benefit"] != 0:
        assert cross_report["sections"]["basic"]["visible"] is True
        assert cross_report["sections"]["basic"]["source"] == "plan"

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
    _assert_benefit_report(s1_only, pending=True)
    assert s1_only.get("need_full") is True
    assert s1_only.get("stage2") is None
    assert int((s1_only.get("benefit_split") or {}).get("contract_gain") or 0) == 0
    s1_summary_ids = {
        item["id"] for item in (s1_only.get("feature_summaries") or [])
    }
    # 第2層未評估前不湊契約容量空卡
    assert "demand" not in s1_summary_ids
    assert "reserve" not in s1_summary_ids
    s1_dispatch = int((s1_only.get("timing") or {}).get("dispatch_count") or 0)
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
    _assert_benefit_report(s2_only, pending=False)
    assert s2_only.get("stage2") and s2_only["stage2"].get("enabled")
    fin = s2_only["stage2"]["final"]
    assert fin.get("proposal") and fin.get("constraints") and isinstance(fin.get("feasibility"), list)
    assert fin.get("feature_summaries")
    assert s2_only.get("feature_summaries") == fin.get("feature_summaries")
    assert "demand" in {
        item["id"] for item in fin.get("feature_summaries") or []
    }
    assert int(s2_only["savings"]) == int((s2_only.get("benefit_split") or {}).get("total") or 0)
    # Stage2：1 次殘差調度 + 最多 1 次唯一提案重跑；選後不再多跑
    s2_dispatch = int((s2_only.get("timing") or {}).get("dispatch_count") or 0)
    stage2_extra = s2_dispatch - s1_dispatch
    assert stage2_extra <= 2
    assert stage2_extra >= 1
    assert ((fin.get("proposal") or {}).get("contracts") or {}).get("rule")

    # 備援摘要直接使用運算後 SOC 下限，不另做前端推算
    from app.services.bess.run import _feature_summaries

    backup_summary = {
        item["id"]: item
        for item in _feature_summaries(
            settings={"backupReserveKwh": 150},
            functions=["backup"],
            constraints={"soc_min": 0.25},
            benefit_split={},
        )
    }["backup"]
    backup_metrics = {
        metric["key"]: metric["value"]
        for metric in backup_summary.get("metrics") or []
    }
    assert backup_metrics == {"backup_kwh": 150.0, "soc_min_pct": 25.0}

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
        baseline_contracts=contracts,
    )
    alt_fin = (s2_alt.get("stage2") or {}).get("final") or {}
    assert round(float(alt_fin["pcs_kw"]), 3) == round(float(alt["pcs_kw"]), 3)
    assert round(float(alt_fin["batt_kwh"]), 3) == round(float(alt["batt_kwh"]), 3)
    assert round(float(s2_alt["recommended"]["pcs_kw"]), 3) == round(
        float(s1_only["recommended"]["pcs_kw"]), 3
    )
    alt_report = alt_fin.get("benefit_report") or (s2_alt.get("stage2") or {}).get(
        "benefit_report"
    )
    assert alt_report and alt_report.get("sections")
    s1_before_alt = (s1_only.get("before") or {})
    assert int(alt_report["sections"]["basic"]["before"]) == int(
        s1_before_alt.get("basic_total") or 0
    )
    assert int(alt_report["sections"]["overage"]["before"]) == int(
        s1_before_alt.get("overage_total") or 0
    )
    # 各配置共用同一 before；after 才依量體不同
    rec_report = (s2_only.get("stage2") or {}).get("final", {}).get(
        "benefit_report"
    ) or s2_only.get("benefit_report")
    if rec_report and rec_report.get("sections"):
        assert int(alt_report["sections"]["basic"]["before"]) == int(
            rec_report["sections"]["basic"]["before"]
        )
        assert int(alt_report["sections"]["overage"]["before"]) == int(
            rec_report["sections"]["overage"]["before"]
        )
        assert int(alt_report["sections"]["energy"]["before"]) == int(
            rec_report["sections"]["energy"]["before"]
        )
    # 頂層 savings／benefit 仍為 stage1；非推薦不覆寫推薦口徑
    assert int(s2_alt["savings"]) == int(s1_only["savings"])
    assert (s2_alt.get("benefit_split") or {}) == (s1_only.get("benefit_split") or {})

    # Final Bundle：need_full 的 stage1 不物化；stage2 留下工作表
    assert s1_only.get("_final_bundle") is None
    assert s1_only.get("dispatch_charts") is None
    fb = s2_only.get("_final_bundle")
    assert isinstance(fb, dict) and fb.get("worksheet") is not None
    assert "ess_kw" in fb["worksheet"].columns and "grid_kw" in fb["worksheet"].columns
    assert fb.get("charts") is not None
    assert fb.get("scheme") is not None and "total" in fb["scheme"]
    assert fb.get("energy_transfer") and "energy_total_delta" in fb["energy_transfer"]
    xfer = fb["energy_transfer"]
    assert "effective_transfer_kwh" in xfer
    assert any("delta_amount" in (r or {}) for r in (xfer.get("rows") or []))
    # 由表衍生匯出／比對不再另調度
    from app.services.bess.run import export_frame_from_worksheet, views_from_worksheet
    from app.services.import_cache import final_bundle_fingerprint
    from app.services.import_store import get_final_bundle, put_final_bundle

    xf = export_frame_from_worksheet(fb["worksheet"])
    assert list(xf.columns)[:4] == ["時間", "原始用電", "功率", "調整後用電"]
    assert len(xf) == len(fb["worksheet"])
    assert abs(float(xf["調整後用電"].iloc[0]) - round(float(fb["worksheet"]["grid_kw"].iloc[0]), 4)) < 1e-9
    again = views_from_worksheet(
        fb["worksheet"],
        plan,
        fb.get("scheme_contracts") or contracts,
        pcs_kw=float(fb["pcs_kw"]),
        batt_kwh=float(fb["batt_kwh"]),
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
        baseline_df=df,
    )
    assert int(again["scheme"]["total"]) == int(fb["scheme"]["total"])
    # sizing vs full fingerprint 隔離
    k_size = final_bundle_fingerprint(
        plan_key="plan:x",
        contracts=contracts,
        simulate={"functions": ["tou"]},
        pcs_kw=float(fb["pcs_kw"]),
        batt_kwh=float(fb["batt_kwh"]),
        scheme_contracts=None,
        functions=["tou"],
    )
    k_full = final_bundle_fingerprint(
        plan_key="plan:x",
        contracts=contracts,
        simulate={"functions": ["tou"]},
        pcs_kw=float(fb["pcs_kw"]),
        batt_kwh=float(fb["batt_kwh"]),
        scheme_contracts=fb.get("scheme_contracts") or contracts,
        functions=["tou"],
    )
    assert k_size != k_full or (fb.get("scheme_contracts") in (None, contracts))
    caches: dict = {}
    put_final_bundle(caches, k_full, fb)
    assert get_final_bundle(caches, k_full) is not None

    # 無需 Stage2 時 stage1 直接物化
    assert out.get("_final_bundle") is None or out.get("need_full") is False
    if not out.get("need_full"):
        # run_size 經 API 才 strip；此處直接呼叫仍可能帶 _final_bundle
        pass
    no_full = run_size_stage1(
        df,
        plan,
        contracts,
        settings,
        tou_type="ThreeStage",
        start_date=str(df["date"].min()),
        end_date=str(df["date"].max()),
        voltage_level="HV",
    )
    assert no_full.get("need_full") is False
    assert no_full.get("_final_bundle") is not None
    assert no_full.get("dispatch_charts") is not None
    assert "energy_total_delta" in (no_full.get("energy_transfer") or {})

    sel_allow = ((cut_out.get("stage2") or {}).get("final") or {}).get("selected_contract") or {}
    print(
        "ok recommended",
        rec,
        "grid",
        len(out["grid"]),
        "allowance",
        sel_allow.get("allowance_added_kw"),
        "reserve",
        ri.get("total"),
    )


if __name__ == "__main__":
    main()
