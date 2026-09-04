"""日曆月切帳、需量尖峰、基本電費季節。"""

from collections.abc import Iterator
from datetime import date, timedelta

import pandas as pd

TPC_DAYS_PER_MONTH = 30


def _parse_date(value: str | date) -> date:
    if isinstance(value, date):
        return value
    return pd.Timestamp(value).date()


def iter_calendar_months(start: str | date, end: str | date) -> list[str]:
    """列出區間涵蓋的日曆月。"""
    start_d = _parse_date(start)
    end_d = _parse_date(end)
    if end_d < start_d:
        raise ValueError("end_date must be >= start_date")

    months: list[str] = []
    cur = date(start_d.year, start_d.month, 1)
    end_month = date(end_d.year, end_d.month, 1)
    while cur <= end_month:
        months.append(cur.strftime("%Y-%m"))
        if cur.month == 12:
            cur = date(cur.year + 1, 1, 1)
        else:
            cur = date(cur.year, cur.month + 1, 1)
    return months


def bill_mode(month: str) -> str:
    """該月基本電費季節：summer / non_summer / split（5、10 月）。"""
    cal_month = int(month.split("-")[1])
    if cal_month in (5, 10):
        return "split"
    if cal_month in (6, 7, 8, 9):
        return "summer"
    return "non_summer"


def covered_days(month: str, start: str | date, end: str | date) -> int:
    """該月落在 [start, end] 內的天數。"""
    start_d = _parse_date(start)
    end_d = _parse_date(end)
    y, m = map(int, month.split("-"))
    month_start = date(y, m, 1)
    if m == 12:
        month_end = date(y + 1, 1, 1) - timedelta(days=1)
    else:
        month_end = date(y, m + 1, 1) - timedelta(days=1)

    overlap_start = max(start_d, month_start)
    overlap_end = min(end_d, month_end)
    if overlap_start > overlap_end:
        return 0
    return (overlap_end - overlap_start).days + 1


def calendar_days_in_month(month: str) -> int:
    """該日曆月天數（28–31）。"""
    y, m = map(int, month.split("-"))
    if m == 12:
        return (date(y + 1, 1, 1) - date(y, m, 1)).days
    return (date(y, m + 1, 1) - date(y, m, 1)).days


def basic_proration_factor(month: str, start: str | date, end: str | date) -> float:
    """基本電費比例：足月 1.0；不足月 covered_days/30（台電）。"""
    days = covered_days(month, start, end)
    if days == calendar_days_in_month(month):
        return 1.0
    return days / TPC_DAYS_PER_MONTH


def iter_billing_months(
    start: str | date, end: str | date
) -> Iterator[str]:
    """有效出帳月 YYYY-MM（covered_days > 0）。"""
    for month in iter_calendar_months(start, end):
        if covered_days(month, start, end) > 0:
            yield month


def add_calendar_month(df: pd.DataFrame, date_col: str = "date") -> pd.DataFrame:
    """加上 month（YYYY-MM）欄。"""
    out = df.copy()
    out["month"] = pd.to_datetime(out[date_col]).dt.strftime("%Y-%m")
    return out


def monthly_peak_by_period(df: pd.DataFrame) -> dict[str, dict[str, float]]:
    """每月各時段最高需量 (kW)。"""
    if df.empty:
        return {}
    work = add_calendar_month(df)
    grouped = work.groupby(["month", "period"], sort=True)["kW"].max()
    out: dict[str, dict[str, float]] = {}
    for (month, period), kw in grouped.items():
        out.setdefault(str(month), {})[str(period)] = float(kw)
    return out


if __name__ == "__main__":
    assert basic_proration_factor("2024-01", "2024-01-01", "2024-01-31") == 1.0
    assert basic_proration_factor("2024-02", "2024-02-01", "2024-02-29") == 1.0
    assert basic_proration_factor("2024-01", "2024-01-10", "2024-01-19") == 10 / 30
    print("ok")
