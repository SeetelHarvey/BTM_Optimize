"""設定 API。"""

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services import settings as settings_svc
from app.services.contracts import all_schemas
from app.services.tariff import select_plan

router = APIRouter(prefix="/settings", tags=["settings"])

class PlanIn(BaseModel):
    voltage: str = Field(examples=["HV"])
    tou_type: str = Field(examples=["ThreeStage"])
    rates: dict[str, Any] | None = None
    schedule: dict[str, Any] | None = None
    holidays: list[dict[str, Any]] | None = None

@router.get("/defaults")
def get_defaults():
    """電價／時段／假日／超約／模擬參數／TOU 策略預設。"""
    return settings_svc.default_settings()

@router.get("/contracts")
def get_contracts():
    """各方案可填的契約欄位。"""
    return all_schemas()

@router.post("/plan")
def preview_plan(body: PlanIn):
    """預覽 demand / prices / matrix。"""
    try:
        plan = select_plan(
            body.voltage,
            body.tou_type,
            rates=body.rates,
            schedule=body.schedule,
            holidays=body.holidays,
        )
    except (KeyError, ValueError, TypeError) as e:
        raise HTTPException(400, str(e)) from e

    return {
        "voltage": plan["voltage"],
        "tou_type": plan["tou_type"],
        "data_interval_minutes": plan["data_interval_minutes"],
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "demand": plan["demand"],
        "prices": plan["prices"],
        "summer_range": plan["summer_range"],
        "matrix": {
            "summer": plan["matrix"]["summer"].tolist(),
            "non_summer": plan["matrix"]["non_summer"].tolist(),
        },
    }
