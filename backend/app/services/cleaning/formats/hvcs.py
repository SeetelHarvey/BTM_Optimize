"""HVCS 高壓站報表。"""

from typing import Any

import pandas as pd

from app.services.cleaning.formats.tpc import date_from_ts
from app.services.cleaning.io import peek_row_cells
from app.services.cleaning.types import HVCS_HEADER_ROW, HVCS_KW_COL, HVCS_TIME_COL


def detect(columns) -> bool:
    cols = {str(c).strip() for c in columns}
    return HVCS_TIME_COL in cols and HVCS_KW_COL in cols


def detect_file(file: Any) -> bool:
    row = set(peek_row_cells(file, HVCS_HEADER_ROW))
    return HVCS_TIME_COL in row and HVCS_KW_COL in row


def keep_valid_rows(df: pd.DataFrame) -> pd.DataFrame:
    """排除總和列。"""
    ts = pd.to_datetime(df[HVCS_TIME_COL], format="mixed", errors="coerce")
    return df.loc[ts.notna()].copy()


def date_series(df: pd.DataFrame) -> pd.Series:
    ts = pd.to_datetime(df[HVCS_TIME_COL], format="mixed", errors="coerce")
    return date_from_ts(ts)


def to_long(df: pd.DataFrame) -> pd.DataFrame:
    data = keep_valid_rows(df)
    ts = pd.to_datetime(data[HVCS_TIME_COL], format="mixed", errors="coerce")
    if ts.isna().all():
        raise ValueError("hvcs format: no valid timestamps parsed from `時段`")

    kW = pd.to_numeric(data[HVCS_KW_COL], errors="coerce").fillna(0.0)
    return (
        pd.DataFrame({"timestamp": ts, "kW": kW})
        .sort_values("timestamp")
        .reset_index(drop=True)
    )
