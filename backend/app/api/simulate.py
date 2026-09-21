"""量體試算與按需調度圖 API。"""

import asyncio
import json
from io import BytesIO
from typing import Any

import pandas as pd
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import StreamingResponse

from app.api import parse_json_form
from app.services.bess.run import (
    profile_bundle_from_sample,
    run_compare_bills,
    run_dispatch_charts,
    run_export_xlsx,
    run_sample,
    run_sample_from_profile_cache,
    run_size_stage1,
    run_size_stage2,
    _stage1_target_row,
)
from app.services.import_cache import (
    charts_fingerprint,
    full_fingerprint,
    plan_fingerprint,
    profile_fingerprint,
    sample_fingerprint,
    stage1_fingerprint,
)
from app.services.bess.size_grid import normalize_sizing_strategies
from app.services.import_store import ImportNotFound, get
from app.services.tariff import annotate, apply_energy_prices, select_plan

router = APIRouter(prefix="/simulate", tags=["simulate"])


def _public_sample(result: dict[str, Any]) -> dict[str, Any]:
    """對外 sample 回應（去掉內部快取欄）。"""
    out = dict(result)
    out.pop("regular_kw", None)
    return out


def _profile_sample_keys(
    plan_key: str,
    contracts_obj: dict[str, Any],
    sim_obj: dict[str, Any],
) -> tuple[str, str, list[str]]:
    profile_key = profile_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        buffer_kw=float(sim_obj.get("demandBufferKw") or 0),
        charge_eff=float(sim_obj.get("chargeEff") or 0.85),
        include_half_peak=sim_obj.get("includeHalfPeak"),
        auto_adjust_off_peak=bool(sim_obj.get("autoAdjustOffPeakContract")),
    )
    tiers = normalize_sizing_strategies(sim_obj.get("sizingStrategies"))
    sample_key = sample_fingerprint(profile_key=profile_key, strategies=tiers)
    return profile_key, sample_key, tiers


def _labeled_frame(
    stored: Any,
    *,
    tou_type: str,
    plan: dict[str, Any],
    plan_key: str,
) -> Any:
    """依方案取／建標註 DF（寫入 import 快取）。"""
    cached = stored.caches.get(plan_key)
    if isinstance(cached, pd.DataFrame):
        return cached.copy()
    have_labels = {"period", "season", "is_holiday"}.issubset(stored.df.columns)
    if have_labels and tou_type == stored.tou_type:
        df = apply_energy_prices(stored.df.copy(), plan["prices"])
    else:
        # 換方案必須重標 period；先剝舊標註以免殘留三段式半尖峰等
        raw = stored.df.copy()
        for col in ("period", "season", "is_holiday", "energy_price"):
            if col in raw.columns:
                raw.drop(columns=[col], inplace=True)
        df = annotate(raw, plan)
    stored.caches[plan_key] = df.copy()
    return df


def _prepare_simulate(
    import_id: str,
    contracts: str,
    simulate: str,
    *,
    rates: str | None = None,
    schedule: str | None = None,
    holidays: str | None = None,
    baseline_contracts: str | None = None,
) -> tuple[
    Any,
    Any,
    dict[str, Any],
    dict[str, Any],
    dict[str, Any],
    str,
    dict | None,
    dict | None,
    str,
    dict[str, Any],
    str,
    dict[str, Any],
    Any,
]:
    contracts_obj = parse_json_form(contracts, None)
    if not isinstance(contracts_obj, dict):
        raise ValueError("contracts must be a JSON object")
    sim_obj = parse_json_form(simulate, None)
    if not isinstance(sim_obj, dict):
        raise ValueError("simulate must be a JSON object")
    # 用電大戶：經常契約 < 5MW 不可勾；本輪義務調度未完成，僅作資格保護
    fns = list(sim_obj.get("functions") or [])
    regular = float(contracts_obj.get("regular_kw") or 0)
    if "large_user" in fns and regular < 5000:
        sim_obj = {**sim_obj, "functions": [f for f in fns if f != "large_user"]}
    if "reserve" in (sim_obj.get("functions") or []):
        from app.services.features import reserve as reserve_feat

        reserve_feat.validate_inputs(sim_obj)
    rates_obj = parse_json_form(rates, None)
    schedule_obj = parse_json_form(schedule, None)
    holidays_obj = parse_json_form(holidays, None)
    baseline_raw = parse_json_form(baseline_contracts, None) if baseline_contracts else None

    stored = get(import_id)
    simulate_tou = str(sim_obj.get("simulateTou") or stored.tou_type)
    baseline_tou = stored.tou_type
    baseline_contracts_obj = (
        baseline_raw if isinstance(baseline_raw, dict) else dict(contracts_obj)
    )

    plan_key = plan_fingerprint(
        simulate_tou=simulate_tou,
        rates=rates_obj if isinstance(rates_obj, dict) else None,
        schedule=schedule_obj if isinstance(schedule_obj, dict) else None,
        holidays=holidays_obj,
    )
    plan = select_plan(
        stored.voltage_level,
        simulate_tou,
        rates=rates_obj,
        schedule=schedule_obj,
        holidays=holidays_obj,
    )
    df = _labeled_frame(stored, tou_type=simulate_tou, plan=plan, plan_key=plan_key)

    if baseline_tou == simulate_tou:
        baseline_plan = plan
        baseline_df = df
        baseline_plan_key = plan_key
    else:
        baseline_plan_key = plan_fingerprint(
            simulate_tou=baseline_tou,
            rates=rates_obj if isinstance(rates_obj, dict) else None,
            schedule=schedule_obj if isinstance(schedule_obj, dict) else None,
            holidays=holidays_obj,
        )
        baseline_plan = select_plan(
            stored.voltage_level,
            baseline_tou,
            rates=rates_obj,
            schedule=schedule_obj,
            holidays=holidays_obj,
        )
        baseline_df = _labeled_frame(
            stored,
            tou_type=baseline_tou,
            plan=baseline_plan,
            plan_key=baseline_plan_key,
        )

    return (
        stored,
        df,
        plan,
        contracts_obj,
        sim_obj,
        simulate_tou,
        schedule_obj,
        holidays_obj,
        plan_key,
        baseline_contracts_obj,
        baseline_tou,
        baseline_plan,
        baseline_df,
    )


@router.post("/sample")
async def api_simulate_sample(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
):
    """試算前負載樣本／配置點數預覽（先於 /size）。"""
    try:
        (
            stored,
            df,
            plan,
            contracts_obj,
            sim_obj,
            simulate_tou,
            schedule_obj,
            _holidays,
            plan_key,
            *_baseline,
        ) = _prepare_simulate(
            import_id,
            contracts,
            simulate,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            baseline_contracts=baseline_contracts,
        )
        profile_key, sample_key, _tiers = _profile_sample_keys(
            plan_key, contracts_obj, sim_obj
        )
        hit = stored.caches.get(sample_key)
        if isinstance(hit, dict) and "profile_stats" in hit:
            return _public_sample(hit)

        prof = stored.caches.get(profile_key)
        if isinstance(prof, dict) and "profile_stats" in prof:
            result = run_sample_from_profile_cache(
                prof,
                sim_obj,
                tou_type=simulate_tou,
                schedule=schedule_obj,
            )
            stored.caches[sample_key] = result
            return _public_sample(result)

        result = await asyncio.to_thread(
            run_sample,
            df,
            contracts_obj,
            sim_obj,
            tou_type=simulate_tou,
            schedule=schedule_obj,
            prices=plan.get("prices"),
        )
        stored.caches[profile_key] = profile_bundle_from_sample(result)
        stored.caches[sample_key] = result
        return _public_sample(result)
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/size")
async def api_simulate_size(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
):
    """已匯入負載 + 試算參數 → 建議 PCS／Battery（電價調度）。"""
    try:
        (
            stored,
            df,
            plan,
            contracts_obj,
            sim_obj,
            simulate_tou,
            schedule_obj,
            _holidays,
            plan_key,
            baseline_contracts_obj,
            baseline_tou,
            baseline_plan,
            baseline_df,
        ) = _prepare_simulate(
            import_id,
            contracts,
            simulate,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            baseline_contracts=baseline_contracts,
        )
        rules_obj = parse_json_form(overage_rules, None)
        sim_cache = {
            **sim_obj,
            "_baseline_tou": baseline_tou,
            "_baseline_contracts": baseline_contracts_obj,
        }
        s1_key = stage1_fingerprint(
            plan_key=plan_key,
            contracts=contracts_obj,
            simulate=sim_cache,
            overage_rules=rules_obj,
        )
        hit = stored.caches.get(s1_key)
        if isinstance(hit, dict) and "grid" in hit:
            return hit

        profile_key, _sample_key, _tiers = _profile_sample_keys(
            plan_key, contracts_obj, sim_obj
        )
        prof = stored.caches.get(profile_key)
        cached_profile = prof if isinstance(prof, dict) else None

        result = await asyncio.to_thread(
            run_size_stage1,
            df,
            plan,
            contracts_obj,
            sim_obj,
            tou_type=simulate_tou,
            start_date=stored.start_date,
            end_date=stored.end_date,
            voltage_level=stored.voltage_level,
            schedule=schedule_obj,
            overage_rules=rules_obj,
            cached_profile=cached_profile,
            baseline_tou_type=baseline_tou,
            baseline_contracts=baseline_contracts_obj,
            baseline_plan=baseline_plan,
            baseline_df=baseline_df,
        )
        result = {**result, "stage1_key": s1_key}
        stored.caches[s1_key] = result
        # 僅儲能調度圖進 charts 快取（表單契約）；契約調整後圖由 /full 另存
        rec = result.get("recommended") or result.get("best_effort")
        if rec and result.get("dispatch_charts"):
            ck = charts_fingerprint(
                plan_key=plan_key,
                contracts=contracts_obj,
                simulate=sim_obj,
                pcs_kw=float(rec["pcs_kw"]),
                batt_kwh=float(rec["batt_kwh"]),
            )
            stored.caches[ck] = {
                "key": f'{round(float(rec["pcs_kw"]), 3)}_{round(float(rec["batt_kwh"]), 3)}',
                "pcs_kw": float(rec["pcs_kw"]),
                "batt_kwh": float(rec["batt_kwh"]),
                "charts": result["dispatch_charts"],
                "tou_meta": result.get("tou_meta"),
                "reserve_meta": result.get("reserve_meta"),
                "energy_transfer": result.get("energy_transfer"),
            }
        return result
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/full")
async def api_simulate_full(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    stage1_key: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    pcs_kw: str | None = Form(None),
    batt_kwh: str | None = Form(None),
):
    """契約／備轉合併重算（綁定 stage1_key 與目標量體；不符回 409）。"""
    try:
        (
            stored,
            df,
            plan,
            contracts_obj,
            sim_obj,
            simulate_tou,
            schedule_obj,
            _holidays,
            plan_key,
            baseline_contracts_obj,
            baseline_tou,
            _baseline_plan,
            baseline_df,
        ) = _prepare_simulate(
            import_id,
            contracts,
            simulate,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            baseline_contracts=baseline_contracts,
        )
        rules_obj = parse_json_form(overage_rules, None)
        sim_cache = {
            **sim_obj,
            "_baseline_tou": baseline_tou,
            "_baseline_contracts": baseline_contracts_obj,
        }
        expected = stage1_fingerprint(
            plan_key=plan_key,
            contracts=contracts_obj,
            simulate=sim_cache,
            overage_rules=rules_obj,
        )
        if stage1_key != expected:
            raise HTTPException(409, "請重新試算")
        stage1 = stored.caches.get(stage1_key)
        if not isinstance(stage1, dict) or "grid" not in stage1:
            raise HTTPException(409, "請重新試算")

        target_pcs = float(pcs_kw) if pcs_kw not in (None, "") else None
        target_batt = float(batt_kwh) if batt_kwh not in (None, "") else None
        if (target_pcs is None) ^ (target_batt is None):
            raise HTTPException(400, "pcs_kw 與 batt_kwh 需同時提供")
        target = _stage1_target_row(stage1, target_pcs, target_batt)
        if target is None:
            raise HTTPException(400, "目標量體不在試算結果中")
        target_pcs = float(target["pcs_kw"])
        target_batt = float(target["batt_kwh"])

        full_key = full_fingerprint(
            stage1_key=stage1_key,
            simulate=sim_cache,
            overage_rules=rules_obj,
            pcs_kw=target_pcs,
            batt_kwh=target_batt,
        )
        hit = stored.caches.get(full_key)
        if isinstance(hit, dict) and "grid" in hit:
            return hit

        if not stage1.get("need_full"):
            result = {**stage1, "stage1_key": stage1_key, "need_full": False}
            stored.caches[full_key] = result
            return result

        result = await asyncio.to_thread(
            run_size_stage2,
            stage1,
            df,
            plan,
            contracts_obj,
            sim_obj,
            tou_type=simulate_tou,
            start_date=stored.start_date,
            end_date=stored.end_date,
            voltage_level=stored.voltage_level,
            schedule=schedule_obj,
            overage_rules=rules_obj,
            baseline_tou_type=baseline_tou,
            baseline_df=baseline_df,
            pcs_kw=target_pcs,
            batt_kwh=target_batt,
        )
        result = {**result, "stage1_key": stage1_key}
        stored.caches[full_key] = result

        final = (result.get("stage2") or {}).get("final") or result.get("final")
        adopted = (final or {}).get("stage2_contracts") or contracts_obj
        if final and final.get("dispatch_charts"):
            ck = charts_fingerprint(
                plan_key=plan_key,
                contracts=adopted,
                simulate=sim_obj,
                pcs_kw=float(final["pcs_kw"]),
                batt_kwh=float(final["batt_kwh"]),
            )
            # 勿覆寫僅儲能調度圖：採用契約不同時 key 本就不同
            stored.caches[ck] = {
                "key": f'{round(float(final["pcs_kw"]), 3)}_{round(float(final["batt_kwh"]), 3)}',
                "pcs_kw": float(final["pcs_kw"]),
                "batt_kwh": float(final["batt_kwh"]),
                "charts": final["dispatch_charts"],
                "tou_meta": (final or {}).get("tou_meta") or result.get("tou_meta"),
                "reserve_meta": (final or {}).get("reserve_meta")
                or result.get("reserve_meta"),
                "energy_transfer": (final or {}).get("energy_transfer")
                or result.get("energy_transfer"),
            }
        return result
    except HTTPException:
        raise
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/dispatch-charts")
async def api_simulate_dispatch_charts(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    pcs_kw: float = Form(...),
    batt_kwh: float = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
):
    """已匯入負載 + (pcs,batt) → 調度圖。"""
    try:
        (
            stored,
            df,
            plan,
            contracts_obj,
            sim_obj,
            simulate_tou,
            schedule_obj,
            _holidays,
            plan_key,
            _baseline_contracts_obj,
            _baseline_tou,
            _baseline_plan,
            baseline_df,
        ) = _prepare_simulate(
            import_id,
            contracts,
            simulate,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            baseline_contracts=baseline_contracts,
        )
        if pcs_kw <= 0 or batt_kwh <= 0:
            raise ValueError("pcs_kw and batt_kwh must be positive")
        chart_key = charts_fingerprint(
            plan_key=plan_key,
            contracts=contracts_obj,
            simulate=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
        )
        hit = stored.caches.get(chart_key)
        if isinstance(hit, dict) and hit.get("charts") is not None:
            return hit

        result = await asyncio.to_thread(
            run_dispatch_charts,
            df,
            plan,
            contracts_obj,
            sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=simulate_tou,
            period_schedule=schedule_obj,
            baseline_df=baseline_df,
            baseline_tou=_baseline_tou,
        )
        stored.caches[chart_key] = result
        return result
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/compare-bill")
async def api_simulate_compare_bill(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    pcs_kw: float = Form(...),
    batt_kwh: float = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    scheme_contracts: str | None = Form(None),
):
    """原始 vs 新方案完整電費（months／summary，同電費試算口徑）。"""
    try:
        (
            stored,
            df,
            plan,
            contracts_obj,
            sim_obj,
            simulate_tou,
            schedule_obj,
            _holidays,
            _plan_key,
            baseline_contracts_obj,
            baseline_tou,
            baseline_plan,
            baseline_df,
        ) = _prepare_simulate(
            import_id,
            contracts,
            simulate,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            baseline_contracts=baseline_contracts,
        )
        if pcs_kw <= 0 or batt_kwh <= 0:
            raise ValueError("pcs_kw and batt_kwh must be positive")
        scheme_raw = parse_json_form(scheme_contracts, None) if scheme_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        return await asyncio.to_thread(
            run_compare_bills,
            df,
            plan,
            contracts_obj,
            sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=simulate_tou,
            start_date=str(stored.start_date),
            end_date=str(stored.end_date),
            voltage_level=str(stored.voltage_level),
            period_schedule=schedule_obj,
            baseline_df=baseline_df,
            baseline_contracts=baseline_contracts_obj,
            baseline_tou=baseline_tou,
            baseline_plan=baseline_plan,
            scheme_contracts=scheme_obj,
        )
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/export")
async def api_simulate_export(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    pcs_kw: float = Form(...),
    batt_kwh: float = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    scheme_contracts: str | None = Form(None),
):
    """15 分用電／金額對照表 → xlsx。"""
    try:
        (
            stored,
            df,
            plan,
            contracts_obj,
            sim_obj,
            simulate_tou,
            schedule_obj,
            _holidays,
            _plan_key,
            baseline_contracts_obj,
            baseline_tou,
            baseline_plan,
            baseline_df,
        ) = _prepare_simulate(
            import_id,
            contracts,
            simulate,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            baseline_contracts=baseline_contracts,
        )
        if pcs_kw <= 0 or batt_kwh <= 0:
            raise ValueError("pcs_kw and batt_kwh must be positive")
        scheme_raw = parse_json_form(scheme_contracts, None) if scheme_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        raw = await asyncio.to_thread(
            run_export_xlsx,
            df,
            plan,
            contracts_obj,
            sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=simulate_tou,
            period_schedule=schedule_obj,
            baseline_df=baseline_df,
            baseline_contracts=baseline_contracts_obj,
            baseline_tou=baseline_tou,
            baseline_plan=baseline_plan,
            scheme_contracts=scheme_obj,
            start_date=str(stored.start_date),
            end_date=str(stored.end_date),
            voltage_level=str(stored.voltage_level),
        )
        name = f"btm_sim_{round(pcs_kw)}_{round(batt_kwh)}kWh_15min.xlsx"
        return StreamingResponse(
            BytesIO(raw),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{name}"'},
        )
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e
