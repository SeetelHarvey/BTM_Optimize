"""基本電費／超約／流動電費（energy）API。"""

import json

from fastapi import APIRouter, Form, HTTPException

from app.api import parse_json_form
from app.services.billing import calc_full_bill
from app.services.import_store import ImportNotFound, get
from app.services.tariff import select_plan

router = APIRouter(prefix="/billing", tags=["billing"])


def _prepare_billing(
    import_id: str,
    *,
    contracts: str,
    rates: str | None,
    schedule: str | None,
    holidays: str | None,
    overage_rules: str | None,
):
    contracts_obj = parse_json_form(contracts, None)
    if not isinstance(contracts_obj, dict):
        raise ValueError("contracts must be a JSON object")
    rules_obj = parse_json_form(overage_rules, None)
    rates_obj = parse_json_form(rates, None)
    schedule_obj = parse_json_form(schedule, None)
    holidays_obj = parse_json_form(holidays, None)
    stored = get(import_id)
    df = stored.df.copy()
    plan = select_plan(
        stored.voltage_level,
        stored.tou_type,
        rates=rates_obj,
        schedule=schedule_obj,
        holidays=holidays_obj,
    )
    return (
        df,
        plan,
        contracts_obj,
        rules_obj,
        stored.voltage_level,
        stored.tou_type,
        stored.start_date,
        stored.end_date,
    )


@router.post("/basic")
async def api_billing_basic(
    import_id: str = Form(...),
    contracts: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
    overage_rules: str | None = Form(None),
):
    """已匯入序列 + 契約 → basic、overage、energy。"""
    try:
        df, plan, contracts_obj, rules_obj, voltage_level, tou_type, start_date, end_date = (
            _prepare_billing(
                import_id,
                contracts=contracts,
                rates=rates,
                schedule=schedule,
                holidays=holidays,
                overage_rules=overage_rules,
            )
        )
        return calc_full_bill(
            df,
            plan,
            contracts_obj,
            tou_type=tou_type,
            start_date=start_date,
            end_date=end_date,
            voltage_level=voltage_level,
            overage_rules=rules_obj,
        )
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
        raise HTTPException(400, str(e)) from e
