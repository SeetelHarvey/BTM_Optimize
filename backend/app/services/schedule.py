"""時段矩陣 → season / period。"""

from datetime import date
from functools import lru_cache

import numpy as np
import pandas as pd

from app.services import settings as settings_svc
from app.services.cleaning.formats.tpc import enrich_interval_end

# 台電需量列固定 15 分；電價時段槽見 tou_schedule.json 的 step_minutes（60/30）
DATA_INTERVAL_MINUTES = 15
ROWS_PER_DAY = 1440 // DATA_INTERVAL_MINUTES


def hours_per_data_row() -> float:
    """單列需量換算小時（kWh = kW × 此值）。"""
    return DATA_INTERVAL_MINUTES / 60.0


def tou_slot_minutes(schedule: dict, tou_type: str) -> int:
    """電價時段槽寬（分）。"""
    return int(schedule[tou_type]["step_minutes"])


def slots_per_tou_slot(tou_slot: int) -> int:
    """一個時段槽含幾列 15 分鐘需量。"""
    if tou_slot % DATA_INTERVAL_MINUTES != 0:
        raise ValueError(
            f"tou_slot_minutes must be multiple of {DATA_INTERVAL_MINUTES}, got {tou_slot}"
        )
    return tou_slot // DATA_INTERVAL_MINUTES


def holiday_dates(holidays: list[dict] | None = None) -> frozenset[str]:
    """假日日期集合。"""
    rows = holidays if holidays is not None else settings_svc.default_holidays()
    return frozenset(str(r["date"]) for r in rows)


def is_summer(d: date, summer_range: dict) -> bool:
    md = (d.month, d.day)
    return (
        (summer_range["start_month"], summer_range["start_day"])
        <= md
        <= (summer_range["end_month"], summer_range["end_day"])
    )


def fill_day(slots: list[dict], tou_slot: int) -> list[str]:
    """單日時段列（半開區間）。"""
    n = 1440 // tou_slot
    row = ["off_peak"] * n
    for s in slots:
        i0 = int(round(s["start"] * 60 / tou_slot))
        i1 = int(round(s["end"] * 60 / tou_slot))
        i0 = max(0, min(n, i0))
        i1 = max(0, min(n, i1))
        for i in range(i0, i1):
            row[i] = s["period"]
    return row


def intraday_off_peak_hours(
    tou_type: str, schedule: dict | None = None
) -> frozenset[int]:
    """非夏 weekday 日間 off_peak 整點（排除 0 點起的離峰段）。"""
    sched = schedule if schedule is not None else settings_svc.default_schedule()
    if tou_type not in sched:
        return frozenset()
    rules = sched[tou_type].get("non_summer", {}).get("weekday", [])
    hours: set[int] = set()
    for seg in rules:
        if seg.get("period") != "off_peak":
            continue
        start = float(seg["start"])
        if start == 0:
            continue
        end = int(seg["end"]) if float(seg["end"]).is_integer() else int(np.ceil(float(seg["end"])))
        for h in range(int(start), end):
            hours.add(h)
    return frozenset(hours)


@lru_cache(maxsize=8)
def default_intraday_off_peak_hours(tou_type: str) -> frozenset[int]:
    """預設 tou_schedule 日間離峰整點（試算每 tou 只解析一次）。"""
    return intraday_off_peak_hours(tou_type, settings_svc.default_schedule())


def build_matrix(schedule: dict, tou_type: str, season: str) -> np.ndarray:
    """7×N 時段矩陣（週一～週日）。"""
    slot = tou_slot_minutes(schedule, tou_type)
    rules = schedule[tou_type][season]
    weekday = fill_day(rules["weekday"], slot)
    saturday = fill_day(rules["saturday"], slot)
    sunday = fill_day(rules["sunday"], slot)
    return np.array([weekday] * 5 + [saturday, sunday], dtype=object)


def build_context(
    tou_type: str,
    *,
    schedule: dict | None = None,
    holidays: list[dict] | None = None,
) -> dict:
    """時段 context（矩陣、假日、夏月）。"""
    schedule = schedule if schedule is not None else settings_svc.default_schedule()
    holiday_set = holiday_dates(holidays)
    slot = tou_slot_minutes(schedule, tou_type)
    return {
        "tou_type": tou_type,
        "data_interval_minutes": DATA_INTERVAL_MINUTES,
        "tou_slot_minutes": slot,
        "matrix": {
            "summer": build_matrix(schedule, tou_type, "summer"),
            "non_summer": build_matrix(schedule, tou_type, "non_summer"),
        },
        "summer_range": schedule["summer_range"],
        "holidays": holiday_set,
    }


def label_periods(
    df: pd.DataFrame,
    ctx: dict,
    *,
    time_col: str = "timestamp",
) -> pd.DataFrame:
    """標註 is_holiday / season / period。"""
    out = df.copy()
    if not {"date", "min", "hour"}.issubset(out.columns):
        out = enrich_interval_end(out, time_col=time_col)

    holidays = ctx["holidays"]
    tou_slot = ctx["tou_slot_minutes"]
    summer_range = ctx["summer_range"]
    per_slot = slots_per_tou_slot(tou_slot)

    is_holiday, season, period = [], [], []
    for i in range(len(out)):
        d = out["date"].iloc[i]
        if not isinstance(d, date):
            d = pd.Timestamp(d).date()
        min15 = int(out["min"].iloc[i])
        hol = d.isoformat() in holidays
        sea = "summer" if is_summer(d, summer_range) else "non_summer"
        wd = d.weekday()
        sl = min15 // per_slot
        p = "off_peak" if hol else str(ctx["matrix"][sea][wd, sl])
        is_holiday.append(hol)
        season.append(sea)
        period.append(p)

    out["is_holiday"] = is_holiday
    out["season"] = season
    out["period"] = period
    return out
