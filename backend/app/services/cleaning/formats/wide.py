"""寬表：date + 0..95 欄。"""

import pandas as pd

from app.services.cleaning.types import WIDE_DATE_COLS


def detect(columns) -> bool:
    cols = {str(c).strip() for c in columns}
    if not any(c in cols for c in WIDE_DATE_COLS):
        return False
    slots = {c for c in cols if c.isdigit() and 0 <= int(c) <= 95}
    return len(slots) >= 90


def date_series(df: pd.DataFrame) -> pd.Series:
    date_col = next((c for c in WIDE_DATE_COLS if c in df.columns), None)
    if date_col is None:
        raise ValueError("wide format missing `date`/`Date` column")
    return pd.to_datetime(df[date_col], errors="coerce").dt.normalize()


def to_long(df: pd.DataFrame) -> pd.DataFrame:
    date_col = next((c for c in WIDE_DATE_COLS if c in df.columns), None)
    if date_col is None:
        raise ValueError("wide format missing `date`/`Date` column")

    slot_cols = []
    for c in df.columns:
        s = str(c).strip()
        if s.isdigit():
            i = int(s)
            if 0 <= i <= 95:
                slot_cols.append(c)

    base = pd.to_datetime(df[date_col], errors="coerce").dt.normalize()
    if base.isna().any():
        raise ValueError("wide format: invalid dates in date column")

    out = df.melt(
        id_vars=[date_col],
        value_vars=slot_cols,
        var_name="min",
        value_name="kW",
    ).copy()

    out["min"] = out["min"].astype(int)
    out["kW"] = pd.to_numeric(out["kW"], errors="coerce").fillna(0.0)
    out["date"] = pd.to_datetime(out[date_col], errors="coerce").dt.normalize()

    # Taiwan TPC: label `00:15` = interval 00:00–00:15
    out["timestamp"] = out["date"] + pd.to_timedelta(out["min"] * 15 + 15, unit="m")

    return out[["timestamp", "kW"]].sort_values("timestamp").reset_index(drop=True)
