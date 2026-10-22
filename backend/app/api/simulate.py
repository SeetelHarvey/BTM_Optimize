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
    functions_without_reserve,
    run_capacity,
    run_contract,
    run_reserve,
    capacity_target_row,
)
from app.services.import_cache import (
    compare_bill_fingerprint,
    final_bundle_fingerprint,
    capacity_fingerprint,
    contract_fingerprint,
    reserve_fingerprint,
    plan_fingerprint,
    profile_fingerprint,
    sample_fingerprint,
)
from app.services.bess.size_grid import (
    contract_sizing_open,
    normalize_energy_seeds,
    normalize_sizing_strategies,
)
from app.services.features.grid_cap import seed_buffer_kw
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
    scheme = bundle.get("adopted_contracts") or contracts_obj
    fns = list(functions or sim_obj.get("functions") or ["tou"])
    fk = final_bundle_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        simulate=sim_obj,
        pcs_kw=pcs,
        batt_kwh=batt,
        adopted_contracts=scheme,
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
    adopted_contracts: dict[str, Any] | None = None,
    functions: list[str] | None = None,
) -> tuple[str, dict[str, Any] | None]:
    """依最終口徑取工作表 bundle。"""
    scheme = adopted_contracts if adopted_contracts is not None else contracts_obj
    fns = list(functions or sim_obj.get("functions") or ["tou"])
    fk = final_bundle_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        simulate=sim_obj,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        adopted_contracts=scheme,
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
        ignore_off_peak=contract_sizing_open(sim_obj),
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
    """試算前負載樣本／配置點數預覽（先於 /capacity）。"""
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


def _effective_overage_rules(raw: str | None, settings: dict) -> dict | None:
    """統一取得表單或試算設定中的超約規則。"""
    parsed = parse_json_form(raw, None)
    if parsed is not None:
        return parsed
    value = settings.get("overageRules")
    return value if isinstance(value, dict) else None


def _followup_common(
    *,
    import_id: str,
    contracts: str,
    simulate: str,
    capacity_key: str,
    rates: str | None,
    schedule: str | None,
    holidays: str | None,
    overage_rules: str | None,
    baseline_contracts: str | None,
    pcs_kw: str | None,
    batt_kwh: str | None,
):
    """capacity 快取＋目標量體；不符回 409。"""
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
    rules_obj = _effective_overage_rules(overage_rules, sim_obj)
    sim_cache = {
        **sim_obj,
        "_baseline_tou": baseline_tou,
        "_baseline_contracts": baseline_contracts_obj,
    }
    expected = capacity_fingerprint(
        plan_key=plan_key,
        contracts=contracts_obj,
        simulate=sim_cache,
        overage_rules=rules_obj,
    )
    if capacity_key != expected:
        raise HTTPException(409, "請重新試算")
    capacity = stored.caches.get(capacity_key)
    if not isinstance(capacity, dict) or "grid" not in capacity:
        raise HTTPException(409, "請重新試算")

    target_pcs = float(pcs_kw) if pcs_kw not in (None, "") else None
    target_batt = float(batt_kwh) if batt_kwh not in (None, "") else None
    if (target_pcs is None) ^ (target_batt is None):
        raise HTTPException(400, "pcs_kw 與 batt_kwh 需同時提供")
    target = capacity_target_row(capacity, target_pcs, target_batt)
    if target is None:
        raise HTTPException(400, "目標量體不在試算結果中")
    return {
        "stored": stored,
        "df": df,
        "plan": plan,
        "contracts_obj": contracts_obj,
        "sim_obj": sim_obj,
        "simulate_tou": simulate_tou,
        "schedule_obj": schedule_obj,
        "plan_key": plan_key,
        "baseline_contracts_obj": baseline_contracts_obj,
        "baseline_tou": baseline_tou,
        "baseline_plan": baseline_plan,
        "baseline_df": baseline_df,
        "rules_obj": rules_obj,
        "sim_cache": sim_cache,
        "capacity": capacity,
        "capacity_key": capacity_key,
        "target_pcs": float(target["pcs_kw"]),
        "target_batt": float(target["batt_kwh"]),
    }


async def _store_followup_bundle(stored, plan_key, contracts_obj, sim_obj, result):
    final_bundle = result.get("_final_bundle")
    point_key = ""
    if isinstance(final_bundle, dict):
        point_key = (
            f"{float(final_bundle.get('pcs_kw') or 0):g}_"
            f"{float(final_bundle.get('batt_kwh') or 0):g}"
        )
    evaluation = (result.get("resultByPoint") or {}).get(point_key) or {}
    final = evaluation.get("final") or {}
    adopted = final.get("adopted_contracts") or contracts_obj
    fns = list(result.get("functions") or sim_obj.get("functions") or ["tou"])
    if final.get("warning") == "reserve_no_net_gain" or (
        final.get("reserve_meta") or {}
    ).get("rolled_back"):
        fns = functions_without_reserve(fns)
    if final_bundle is not None:
        _store_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            bundle=final_bundle,
            functions=fns,
        )
    return adopted


@router.post("/capacity")
async def api_simulate_capacity(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
):
    """決定容量：選 pcs／kWh 並跑時間電價調度。"""
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
        cap_key = capacity_fingerprint(
            plan_key=plan_key,
            contracts=contracts_obj,
            simulate=sim_cache,
            overage_rules=rules_obj,
        )
        hit = stored.caches.get(cap_key)
        if isinstance(hit, dict) and "grid" in hit:
            return _strip_internal_bundles(hit)

        profile_key, _sample_key, _tiers = _profile_sample_keys(
            plan_key, contracts_obj, sim_obj
        )
        prof = stored.caches.get(profile_key)
        cached_profile = prof if isinstance(prof, dict) else None

        result = await asyncio.to_thread(
            run_capacity,
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
        sizing_fns = functions_without_reserve(
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
        cached_result = {
            **result,
            "capacity_key": cap_key,
        }
        stored.caches[cap_key] = cached_result
        return _strip_internal_bundles(cached_result)
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/contract")
async def api_simulate_contract(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    capacity_key: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    pcs_kw: str | None = Form(None),
    batt_kwh: str | None = Form(None),
):
    """自動契約（綁定 capacity_key＋目標量體）。"""
    try:
        ctx = _followup_common(
            import_id=import_id,
            contracts=contracts,
            simulate=simulate,
            capacity_key=capacity_key,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            overage_rules=overage_rules,
            baseline_contracts=baseline_contracts,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
        )
        ck = contract_fingerprint(
            capacity_key=ctx["capacity_key"],
            simulate=ctx["sim_cache"],
            overage_rules=ctx["rules_obj"],
            pcs_kw=ctx["target_pcs"],
            batt_kwh=ctx["target_batt"],
        )
        hit = ctx["stored"].caches.get(ck)
        if isinstance(hit, dict) and "grid" in hit:
            return _strip_internal_bundles(hit)

        if "demand" not in (ctx["sim_obj"].get("functions") or []):
            result = {
                **ctx["capacity"],
                "capacity_key": ctx["capacity_key"],
                "contract_key": ck,
            }
            ctx["stored"].caches[ck] = _strip_internal_bundles(result)
            return ctx["stored"].caches[ck]

        result = await asyncio.to_thread(
            run_contract,
            ctx["capacity"],
            ctx["df"],
            ctx["plan"],
            ctx["contracts_obj"],
            ctx["sim_obj"],
            tou_type=ctx["simulate_tou"],
            start_date=ctx["stored"].start_date,
            end_date=ctx["stored"].end_date,
            voltage_level=ctx["stored"].voltage_level,
            schedule=ctx["schedule_obj"],
            overage_rules=ctx["rules_obj"],
            baseline_tou_type=ctx["baseline_tou"],
            baseline_df=ctx["baseline_df"],
            baseline_contracts=ctx["baseline_contracts_obj"],
            baseline_plan=ctx["baseline_plan"],
            pcs_kw=ctx["target_pcs"],
            batt_kwh=ctx["target_batt"],
        )
        await _store_followup_bundle(
            ctx["stored"], ctx["plan_key"], ctx["contracts_obj"], ctx["sim_obj"], result
        )
        cached_result = {
            **result,
            "capacity_key": ctx["capacity_key"],
            "contract_key": ck,
        }
        ctx["stored"].caches[ck] = cached_result
        return _strip_internal_bundles(cached_result)
    except HTTPException:
        raise
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e


@router.post("/reserve")
async def api_simulate_reserve(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    capacity_key: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    pcs_kw: str | None = Form(None),
    batt_kwh: str | None = Form(None),
    contract_key: str | None = Form(None),
):
    """即時備轉結算（綁定 capacity；有契約則用 contract_key 上游）。"""
    try:
        ctx = _followup_common(
            import_id=import_id,
            contracts=contracts,
            simulate=simulate,
            capacity_key=capacity_key,
            rates=rates,
            schedule=schedule,
            holidays=holidays,
            overage_rules=overage_rules,
            baseline_contracts=baseline_contracts,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
        )
        upstream = ctx["capacity"]
        upstream_key = ctx["capacity_key"]
        if contract_key:
            expected_contract_key = contract_fingerprint(
                capacity_key=ctx["capacity_key"],
                simulate=ctx["sim_cache"],
                overage_rules=ctx["rules_obj"],
                pcs_kw=ctx["target_pcs"],
                batt_kwh=ctx["target_batt"],
            )
            if contract_key != expected_contract_key:
                raise HTTPException(409, "契約結果已過期，請重新執行契約容量試算")
            hit_c = ctx["stored"].caches.get(contract_key)
            if not isinstance(hit_c, dict) or "grid" not in hit_c:
                raise HTTPException(409, "契約結果已過期，請重新執行契約容量試算")
            upstream = hit_c
            upstream_key = contract_key

        rk = reserve_fingerprint(
            upstream_key=upstream_key,
            simulate=ctx["sim_cache"],
            overage_rules=ctx["rules_obj"],
            pcs_kw=ctx["target_pcs"],
            batt_kwh=ctx["target_batt"],
        )
        hit = ctx["stored"].caches.get(rk)
        if isinstance(hit, dict) and "grid" in hit:
            return _strip_internal_bundles(hit)

        if "reserve" not in (ctx["sim_obj"].get("functions") or []):
            result = {
                **upstream,
                "capacity_key": ctx["capacity_key"],
                "reserve_key": rk,
            }
            if contract_key:
                result["contract_key"] = contract_key
            ctx["stored"].caches[rk] = _strip_internal_bundles(result)
            return ctx["stored"].caches[rk]

        result = await asyncio.to_thread(
            run_reserve,
            upstream,
            ctx["df"],
            ctx["plan"],
            ctx["contracts_obj"],
            ctx["sim_obj"],
            tou_type=ctx["simulate_tou"],
            start_date=ctx["stored"].start_date,
            end_date=ctx["stored"].end_date,
            voltage_level=ctx["stored"].voltage_level,
            schedule=ctx["schedule_obj"],
            overage_rules=ctx["rules_obj"],
            baseline_tou_type=ctx["baseline_tou"],
            baseline_df=ctx["baseline_df"],
            baseline_contracts=ctx["baseline_contracts_obj"],
            baseline_plan=ctx["baseline_plan"],
            pcs_kw=ctx["target_pcs"],
            batt_kwh=ctx["target_batt"],
        )
        await _store_followup_bundle(
            ctx["stored"], ctx["plan_key"], ctx["contracts_obj"], ctx["sim_obj"], result
        )
        cached_result = {
            **result,
            "capacity_key": ctx["capacity_key"],
            "reserve_key": rk,
        }
        if contract_key:
            cached_result["contract_key"] = contract_key
        ctx["stored"].caches[rk] = cached_result
        return _strip_internal_bundles(cached_result)
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
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    adopted_contracts: str | None = Form(None),
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
        rules_obj = _effective_overage_rules(overage_rules, sim_obj)
        if rules_obj is not None:
            sim_obj["overageRules"] = rules_obj
        scheme_raw = parse_json_form(adopted_contracts, None) if adopted_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        # 有採用契約＝最終層（含契約／備轉）；否則僅儲能功能集合
        if scheme_obj is not None:
            fns = list(sim_obj.get("functions") or ["tou"])
        else:
            fns = functions_without_reserve(list(sim_obj.get("functions") or ["tou"]))
        _fk, bundle = _lookup_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            adopted_contracts=scheme_obj,
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
            overage_rules=rules_obj,
            baseline_df=baseline_df,
            baseline_tou=baseline_tou,
            baseline_contracts=baseline_contracts_obj,
            baseline_plan=baseline_plan,
            adopted_contracts=scheme_obj or contracts_obj,
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
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    adopted_contracts: str | None = Form(None),
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
        rules_obj = _effective_overage_rules(overage_rules, sim_obj)
        if rules_obj is not None:
            sim_obj["overageRules"] = rules_obj
        scheme_raw = parse_json_form(adopted_contracts, None) if adopted_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        if scheme_obj is not None:
            fns = list(sim_obj.get("functions") or ["tou"])
        else:
            fns = functions_without_reserve(list(sim_obj.get("functions") or ["tou"]))
        _fk, bundle = _lookup_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            adopted_contracts=scheme_obj,
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
                    "adopted_contracts": scheme_obj or contracts_obj,
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
            adopted_contracts=scheme_obj,
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
            adopted_contracts=scheme_obj,
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
    overage_rules: str | None = Form(None),
    baseline_contracts: str | None = Form(None),
    adopted_contracts: str | None = Form(None),
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
        rules_obj = _effective_overage_rules(overage_rules, sim_obj)
        if rules_obj is not None:
            sim_obj["overageRules"] = rules_obj
        scheme_raw = parse_json_form(adopted_contracts, None) if adopted_contracts else None
        scheme_obj = scheme_raw if isinstance(scheme_raw, dict) else None
        if scheme_obj is not None:
            fns = list(sim_obj.get("functions") or ["tou"])
        else:
            fns = functions_without_reserve(list(sim_obj.get("functions") or ["tou"]))
        _fk, bundle = _lookup_final_bundle(
            stored,
            plan_key=plan_key,
            contracts_obj=contracts_obj,
            sim_obj=sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            adopted_contracts=scheme_obj,
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
                overage_rules=rules_obj,
                baseline_df=baseline_df,
                baseline_tou=baseline_tou,
                baseline_contracts=baseline_contracts_obj,
                baseline_plan=baseline_plan,
                adopted_contracts=scheme_obj or contracts_obj,
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
            adopted_contracts=scheme_obj,
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
