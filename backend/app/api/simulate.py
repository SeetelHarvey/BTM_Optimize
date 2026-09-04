"""量體試算與按需調度圖 API。"""

import asyncio
import json
from typing import Any

from fastapi import APIRouter, Form, HTTPException

from app.api import parse_json_form
from app.services.bess.run import run_dispatch_charts, run_sample, run_size
from app.services.import_store import ImportNotFound, get
from app.services.tariff import annotate, select_plan

router = APIRouter(prefix="/simulate", tags=["simulate"])


def _prepare_simulate(
    import_id: str,
    contracts: str,
    simulate: str,
    *,
    rates: str | None = None,
    schedule: str | None = None,
    holidays: str | None = None,
) -> tuple[
    Any,
    Any,
    dict[str, Any],
    dict[str, Any],
    dict[str, Any],
    str,
    dict | None,
    dict | None,
]:
    contracts_obj = parse_json_form(contracts, None)
    if not isinstance(contracts_obj, dict):
        raise ValueError("contracts must be a JSON object")
    sim_obj = parse_json_form(simulate, None)
    if not isinstance(sim_obj, dict):
        raise ValueError("simulate must be a JSON object")
    rates_obj = parse_json_form(rates, None)
    schedule_obj = parse_json_form(schedule, None)
    holidays_obj = parse_json_form(holidays, None)

    stored = get(import_id)
    simulate_tou = str(sim_obj.get("simulateTou") or stored.tou_type)
    plan = select_plan(
        stored.voltage_level,
        simulate_tou,
        rates=rates_obj,
        schedule=schedule_obj,
        holidays=holidays_obj,
    )
    df = annotate(stored.df.copy(), plan)
    return stored, df, plan, contracts_obj, sim_obj, simulate_tou, schedule_obj, holidays_obj


@router.post("/sample")
async def api_simulate_sample(
    import_id: str = Form(...),
    contracts: str = Form(...),
    simulate: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
):
    """試算前負載樣本／配置點數預覽（先於 /size）。"""
    try:
        _stored, df, _plan, contracts_obj, sim_obj, simulate_tou, schedule_obj, _holidays = (
            _prepare_simulate(
                import_id,
                contracts,
                simulate,
                rates=rates,
                schedule=schedule,
                holidays=holidays,
            )
        )
        return await asyncio.to_thread(
            run_sample,
            df,
            contracts_obj,
            sim_obj,
            tou_type=simulate_tou,
            schedule=schedule_obj,
        )
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
):
    """已匯入負載 + 試算參數 → 建議 PCS／Battery。"""
    try:
        stored, df, plan, contracts_obj, sim_obj, simulate_tou, schedule_obj, _holidays = (
            _prepare_simulate(
                import_id,
                contracts,
                simulate,
                rates=rates,
                schedule=schedule,
                holidays=holidays,
            )
        )
        rules_obj = parse_json_form(overage_rules, None)

        return await asyncio.to_thread(
            run_size,
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
        )
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
):
    """已匯入負載 + (pcs,batt) → 調度圖。"""
    try:
        _stored, df, plan, contracts_obj, sim_obj, simulate_tou, schedule_obj, _holidays = (
            _prepare_simulate(
                import_id,
                contracts,
                simulate,
                rates=rates,
                schedule=schedule,
                holidays=holidays,
            )
        )
        if pcs_kw <= 0 or batt_kwh <= 0:
            raise ValueError("pcs_kw and batt_kwh must be positive")
        return await asyncio.to_thread(
            run_dispatch_charts,
            df,
            plan,
            contracts_obj,
            sim_obj,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            tou_type=simulate_tou,
            period_schedule=schedule_obj,
        )
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e
