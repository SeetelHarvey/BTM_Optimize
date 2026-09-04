"""台電區間結束標籤 → date / min / hour。"""

import pandas as pd


def period_from_label(ts: pd.Series) -> tuple[pd.Series, pd.Series, pd.Series]:
    """標籤 → date、min、hour。"""
    ts = pd.to_datetime(pd.Series(ts))
    midnight = (ts.dt.hour == 0) & (ts.dt.minute == 0)
    day = ts.dt.normalize()
    day = day.where(~midnight, day - pd.Timedelta(days=1))
    minutes = ts.dt.hour * 60 + ts.dt.minute
    min15 = ((minutes - 15) // 15).astype(int)
    min15 = min15.where(~midnight, 95).astype(int)
    hour = (min15 // 4).astype(int)
    # 純日期，避免顯示成 2025-08-01 00:00:00
    date_only = pd.Series([d.date() for d in day], index=ts.index)
    return date_only, min15.astype(int), hour.astype(int)


def date_from_ts(ts: pd.Series) -> pd.Series:
    """00:00 歸前一日。"""
    ts = pd.to_datetime(pd.Series(ts))
    midnight = (ts.dt.hour == 0) & (ts.dt.minute == 0)
    day = ts.dt.normalize()
    return day.where(~midnight, day - pd.Timedelta(days=1))


def enrich_interval_end(df: pd.DataFrame, time_col: str = "timestamp") -> pd.DataFrame:
    """補 date / min / hour。"""
    out = df.copy()
    day, min15, hour = period_from_label(out[time_col])
    out["date"] = day
    out["min"] = min15
    out["hour"] = hour
    return out
