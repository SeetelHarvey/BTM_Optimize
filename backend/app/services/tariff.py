"""電價：組 plan、標註 energy_price。"""

import pandas as pd

from app.services import schedule as schedule_svc
from app.services import settings as settings_svc

_DEMAND_KEYS = (
    "base_prices",
    "non_summer_base_prices",
    "half_peak_base_prices",
    "saturday_base_prices",
    "off_peak_base_prices",
)


def get_rates(
    voltage: str,
    tou_type: str,
    *,
    rates: dict | None = None,
) -> dict:
    """流動電價 + 基本電費單價。"""
    rates = rates if rates is not None else settings_svc.default_rates()
    plan_rates = rates[voltage][tou_type]
    demand = {k: plan_rates[k] for k in _DEMAND_KEYS}
    return {"prices": plan_rates["prices"], "demand": demand}


def apply_energy_prices(df: pd.DataFrame, prices: dict) -> pd.DataFrame:
    """依 season / period 寫入 energy_price。"""
    out = df.copy()
    sea = out["season"].astype(str)
    per = out["period"].astype(str)
    # 建 lookup 表一次 merge，避免逐列 dict 查
    pairs = {
        (s, p): float(v)
        for s, block in (prices or {}).items()
        if isinstance(block, dict)
        for p, v in block.items()
        if v is not None
    }
    keys = list(zip(sea.tolist(), per.tolist()))
    out["energy_price"] = [pairs.get(k) for k in keys]
    return out


def select_plan(
    voltage: str,
    tou_type: str,
    *,
    rates: dict | None = None,
    schedule: dict | None = None,
    holidays: list[dict] | None = None,
) -> dict:
    """組出試算用 plan（可覆寫 JSON 預設）。"""
    rate_part = get_rates(voltage, tou_type, rates=rates)
    ctx = schedule_svc.build_context(
        tou_type, schedule=schedule, holidays=holidays
    )
    return {
        "voltage": voltage,
        "tou_type": tou_type,
        "data_interval_minutes": ctx["data_interval_minutes"],
        "tou_slot_minutes": ctx["tou_slot_minutes"],
        "demand": rate_part["demand"],
        "prices": rate_part["prices"],
        "matrix": ctx["matrix"],
        "summer_range": ctx["summer_range"],
        "holidays": ctx["holidays"],
    }


def annotate(df: pd.DataFrame, plan: dict, time_col: str = "timestamp") -> pd.DataFrame:
    """標註 is_holiday / season / period / energy_price。"""
    ctx = {
        "tou_slot_minutes": plan["tou_slot_minutes"],
        "matrix": plan["matrix"],
        "summer_range": plan["summer_range"],
        "holidays": plan["holidays"],
    }
    out = schedule_svc.label_periods(df, ctx, time_col=time_col)
    return apply_energy_prices(out, plan["prices"])
