"""爬蟲：年月日 + 時分 + 各時段需量。"""

import pandas as pd

from app.services.cleaning.formats.tpc import date_from_ts
from app.services.cleaning.types import (
    CRAWLER_DATE_COL,
    CRAWLER_DEMAND_COLS,
    CRAWLER_TIME_COL,
)


def detect(columns) -> bool:
    cols = {str(c).strip() for c in columns}
    return (
        CRAWLER_DATE_COL in cols
        and CRAWLER_TIME_COL in cols
        and any(c in cols for c in CRAWLER_DEMAND_COLS)
    )


def parse_timestamp(df: pd.DataFrame) -> pd.Series:
    day = pd.to_datetime(df[CRAWLER_DATE_COL], format="mixed", errors="coerce").dt.normalize()
    parts = df[CRAWLER_TIME_COL].astype(str).str.strip().str.split(":", expand=True)
    if parts.shape[1] < 2:
        raise ValueError("crawler format: `時分` must be HH:MM")

    hours = pd.to_numeric(parts[0], errors="coerce").fillna(0).astype(int)
    minutes = pd.to_numeric(parts[1], errors="coerce").fillna(0).astype(int)
    return day + pd.to_timedelta(hours, unit="h") + pd.to_timedelta(minutes, unit="m")


def date_series(df: pd.DataFrame) -> pd.Series:
    return date_from_ts(parse_timestamp(df))


def _coalesce_demand(df: pd.DataFrame) -> pd.Series:
    kw = pd.Series([pd.NA] * len(df), index=df.index, dtype="object")
    for c in CRAWLER_DEMAND_COLS:
        if c not in df.columns:
            continue
        vals = pd.to_numeric(df[c], errors="coerce")
        kw = kw.combine_first(vals)
    return pd.to_numeric(kw, errors="coerce").fillna(0.0)


def to_long(df: pd.DataFrame) -> pd.DataFrame:
    timestamp = parse_timestamp(df)
    if timestamp.isna().all():
        raise ValueError("crawler format: cannot parse timestamps")

    out = pd.DataFrame({"timestamp": timestamp, "kW": _coalesce_demand(df)})
    return out.dropna(subset=["timestamp"]).sort_values("timestamp").reset_index(drop=True)
