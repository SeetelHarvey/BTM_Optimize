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
    materialize_final_point,
    profile_bundle_from_sample,
    run_compare_bills,
    run_export_xlsx,
    run_sample,
    run_sample_from_profile_cache,
    run_size_stage1,
    run_size_stage2,
    _functions_without_reserve,
    _stage1_target_row,
)
from app.services.import_cache import (
    compare_bill_fingerprint,
    final_bundle_fingerprint,
    full_fingerprint,
    plan_fingerprint,
    profile_fingerprint,
    sample_fingerprint,
    stage1_fingerprint,
)
from app.services.bess.size_grid import normalize_energy_seeds, normalize_sizing_strategies
from app.services.features.demand import seed_buffer_kw
from app.services.import_store import ImportNotFound, get, get_final_bundle, put_final_bundle
from app.services.tariff import annotate, apply_energy_prices, select_plan

router = APIRouter(prefix="/simulate", tags=["simulate"])


def _public_sample(result: dict[str, Any]) -> dict[str, Any]:
    """對外 sample 回應（去掉內部快取欄）。"""
    out = dict(result)
    out.pop("regular_kw", None)
    return out


def _strip_internal_bundles(result: dict[str, Any]) -> dict[str, Any]:
    """回傳／摘要快取前去掉 worksheet 正本。"""
    out = dict(result)
    out.pop("_final_bundle", None)
    out.pop("_sizing_bundle", None)
    return out


def _store_final_bundle(
    stored: Any,
    *,
    plan_key: str,
    contracts_obj: dict[str, Any],
    sim_obj: dict[str, Any],
    bundle: dict[str, Any],
    functions: list[str] | None = None,
) -> str | None:
    """寫入最終工作表 LRU；回傳 fingerprint。"""
    if not isinstance(bundle, dict) or bundle.get("worksheet") is None:
        return None
    pcs = float(bundle["pcs_kw"])
    batt = float(bundle["batt_kwh"])
    scheme = bundle.get("scheme_contracts") or contracts_obj
    fns = list(functions or sim_obj.get("functions") or ["tou"])
    fk = final_bundle_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        simulate=sim_obj,
        pcs_kw=pcs,
        batt_kwh=batt,
        scheme_contracts=scheme,
        functions=fns,
    )
    put_final_bundle(stored.caches, fk, bundle)
    return fk


def _lookup_final_bundle(
    stored: Any,
    *,
    plan_key: str,
    contracts_obj: dict[str, Any],
    sim_obj: dict[str, Any],
    pcs_kw: float,
    batt_kwh: float,
    scheme_contracts: dict[str, Any] | None = None,
    functions: list[str] | None = None,
) -> tuple[str, dict[str, Any] | None]:
    """依最終口徑取工作表 bundle。"""
    scheme = scheme_contracts if scheme_contracts is not None else contracts_obj
    fns = list(functions or sim_obj.get("functions") or ["tou"])
    fk = final_bundle_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        simulate=sim_obj,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        scheme_contracts=scheme,
        functions=fns,
    )
    return fk, get_final_bundle(stored.caches, fk)


def _profile_sample_keys(
    plan_key: str,
    contracts_obj: dict[str, Any],
    sim_obj: dict[str, Any],
) -> tuple[str, str, list[str]]:
    profile_key = profile_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        buffer_kw=seed_buffer_kw(
            sim_obj, contract_kw=float(contracts_obj.get("regular_kw") or 0)
        ),
        charge_eff=float(sim_obj.get("chargeEff") or 0.85),
        include_half_peak=sim_obj.get("includeHalfPeak"),
    )
    tiers = normalize_sizing_strategies(sim_obj.get("sizingStrategies"))
    ekeys = normalize_energy_seeds(sim_obj.get("sizingEnergySeeds"))
    sample_key = sample_fingerprint(
        profile_key=profile_key, strategies=tiers, energy_keys=ekeys
    )
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
            return _strip_internal_bundles(hit)

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
        final_bundle = result.get("_final_bundle")
        sizing_fns = _functions_without_reserve(
            list(result.get("functions") or sim_obj.get("functions") or ["tou"])
        )
        if final_bundle is not None:
            _store_final_bundle(
                stored,
                plan_key=plan_key,
                contracts_obj=contracts_obj,
                sim_obj=sim_obj,
                bundle=final_bundle,
                functions=sizing_fns,
            )
        result = {**_strip_internal_bundles(result), "stage1_key": s1_key}
        stored.caches[s1_key] = result
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
            return _strip_internal_bundles(hit)

        if not stage1.get("need_full"):
            result = {**stage1, "stage1_key": stage1_key, "need_full": False}
            stored.caches[full_key] = _strip_internal_bundles(result)
            return stored.caches[full_key]

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
            baseline_contracts=baseline_contracts_obj,
            baseline_plan=_baseline_plan,
            pcs_kw=target_pcs,
            batt_kwh=target_batt,
        )
        final_bundle = result.get("_final_bundle")
        final = (result.get("stage2") or {}).get("final") or result.get("final")
        adopted = (final or {}).get("stage2_contracts") or contracts_obj
        full_fns = list(result.get("functions") or sim_obj.get("functions") or ["tou"])
        # rollback 備轉時功能集合不含 reserve（物化時已用 l1 settings）
        if (final or {}).get("stage2_warning") == "reserve_no_net_gain" or (
            (final or {}).get("reserve_meta") or {}
        ).get("rolled_back"):
            full_fns = _functions_without_reserve(full_fns)
        if final_bundle is not None:
            _store_final_bundle(
                stored,
                plan_key=plan_key,
                contracts_obj=contracts_obj,
                sim_obj=sim_obj,
                bundle=final_bundle,
                functions=full_fns,
            )
        result = {**_strip_internal_bundles(result), "stage1_key": stage1_key}
        if adopted:
            result["scheme_contracts"] = adopted
        stored.caches[full_key] = result
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
    scheme_contracts: str | None = Form(None),
):
    """已匯入負載 + (pcs,batt) → 調度圖（優先讀最終工作表）。"""
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
        scheme_raw = parse_json_form(scheme_contracts, None) if scheme_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        # 有採用契約＝最終層（含契約／備轉）；否則僅儲能功能集合
        if scheme_obj is not None:
            fns = list(sim_obj.get("functions") or ["tou"])
        else:
            fns = _functions_without_reserve(list(sim_obj.get("functions") or ["tou"]))
        _fk, bundle = _lookup_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            scheme_contracts=scheme_obj,
            functions=fns,
        )
        if bundle is not None:
            return {
                "key": bundle.get("key"),
                "pcs_kw": bundle["pcs_kw"],
                "batt_kwh": bundle["batt_kwh"],
                "charts": bundle.get("charts"),
                "tou_meta": bundle.get("tou_meta"),
                "reserve_meta": bundle.get("reserve_meta"),
                "energy_transfer": bundle.get("energy_transfer"),
            }

        result = await asyncio.to_thread(
            materialize_final_point,
            df,
            plan,
            contracts_obj,
            {**sim_obj, "functions": fns},
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=simulate_tou,
            start_date=str(stored.start_date),
            end_date=str(stored.end_date),
            voltage_level=str(stored.voltage_level),
            period_schedule=schedule_obj,
            overage_rules=sim_obj.get("overageRules")
            if isinstance(sim_obj.get("overageRules"), dict)
            else None,
            baseline_df=baseline_df,
            baseline_tou=_baseline_tou,
            scheme_contracts=scheme_obj or contracts_obj,
        )
        _store_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            bundle=result,
            functions=fns,
        )
        return {
            "key": result.get("key"),
            "pcs_kw": result["pcs_kw"],
            "batt_kwh": result["batt_kwh"],
            "charts": result.get("charts"),
            "tou_meta": result.get("tou_meta"),
            "reserve_meta": result.get("reserve_meta"),
            "energy_transfer": result.get("energy_transfer"),
        }
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
        if pcs_kw <= 0 or batt_kwh <= 0:
            raise ValueError("pcs_kw and batt_kwh must be positive")
        scheme_raw = parse_json_form(scheme_contracts, None) if scheme_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        if scheme_obj is not None:
            fns = list(sim_obj.get("functions") or ["tou"])
        else:
            fns = _functions_without_reserve(list(sim_obj.get("functions") or ["tou"]))
        _fk, bundle = _lookup_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            scheme_contracts=scheme_obj,
            functions=fns,
        )
        if bundle is not None and bundle.get("baseline") is not None and bundle.get("scheme") is not None:
            return {
                "baseline": bundle["baseline"],
                "scheme": bundle["scheme"],
                "reserve_income": bundle.get("reserve_income"),
                "meta": {
                    "pcs_kw": pcs_kw,
                    "batt_kwh": batt_kwh,
                    "baseline_tou": baseline_tou,
                    "simulate_tou": simulate_tou,
                    "baseline_contracts": baseline_contracts_obj,
                    "scheme_contracts": scheme_obj or contracts_obj,
                },
            }

        compare_key = compare_bill_fingerprint(
            plan_key=plan_key,
            contracts=contracts_obj,
            simulate=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            baseline_contracts=baseline_contracts_obj,
            baseline_tou=baseline_tou,
            scheme_contracts=scheme_obj,
        )
        hit = stored.caches.get(compare_key)
        if isinstance(hit, dict) and hit.get("baseline") is not None and hit.get("scheme") is not None:
            return hit

        result = await asyncio.to_thread(
            run_compare_bills,
            df,
            plan,
            contracts_obj,
            {**sim_obj, "functions": fns},
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
            worksheet=bundle.get("worksheet") if bundle else None,
        )
        inner = result.pop("_bundle", None)
        if inner is not None:
            _store_final_bundle(
                stored,
                plan_key=plan_key,
                contracts_obj=contracts_obj,
                sim_obj=sim_obj,
                bundle=inner,
                functions=fns,
            )
        stored.caches[compare_key] = result
        return result
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
        if pcs_kw <= 0 or batt_kwh <= 0:
            raise ValueError("pcs_kw and batt_kwh must be positive")
        scheme_raw = parse_json_form(scheme_contracts, None) if scheme_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        if scheme_obj is not None:
            fns = list(sim_obj.get("functions") or ["tou"])
        else:
            fns = _functions_without_reserve(list(sim_obj.get("functions") or ["tou"]))
        _fk, bundle = _lookup_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            scheme_contracts=scheme_obj,
            functions=fns,
        )
        ws = bundle.get("worksheet") if bundle else None
        if ws is None and bundle is None:
            # miss：物化一次再匯出
            made = await asyncio.to_thread(
                materialize_final_point,
                df,
                plan,
                contracts_obj,
                {**sim_obj, "functions": fns},
                pcs_kw=pcs_kw,
                batt_kwh=batt_kwh,
                tou_type=simulate_tou,
                start_date=str(stored.start_date),
                end_date=str(stored.end_date),
                voltage_level=str(stored.voltage_level),
                period_schedule=schedule_obj,
                baseline_df=baseline_df,
                baseline_tou=baseline_tou,
                baseline_contracts=baseline_contracts_obj,
                baseline_plan=baseline_plan,
                scheme_contracts=scheme_obj or contracts_obj,
            )
            _store_final_bundle(
                stored,
                plan_key=plan_key,
                contracts_obj=contracts_obj,
                sim_obj=sim_obj,
                bundle=made,
                functions=fns,
            )
            ws = made["worksheet"]
        raw = await asyncio.to_thread(
            run_export_xlsx,
            df,
            plan,
            contracts_obj,
            {**sim_obj, "functions": fns},
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
            worksheet=ws,
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
