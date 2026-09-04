"""資料清理：讀檔、篩日期、轉 long、標註電價。"""
from datetime import date, datetime
from typing import Any

import pandas as pd

from app.services.cleaning.formats import crawler, hvcs, wide
from app.services.cleaning.formats.tpc import enrich_interval_end
from app.services.cleaning.io import is_excel, read_upload, rewind
from app.services.cleaning.types import Format, FilterDateResult, HVCS_HEADER_ROW
from app.services.tariff import annotate, select_plan

_SPECS = {
    "wide": wide,
    "hvcs": hvcs,
    "crawler": crawler,
}

def detect_format(df: pd.DataFrame) -> Format:
    """判斷 wide / hvcs / crawler。"""
    if hvcs.detect(df.columns):
        return "hvcs"
    if crawler.detect(df.columns):
        return "crawler"
    if wide.detect(df.columns):
        return "wide"
    raise ValueError("非預期格式，請確認資料格式是否正確")

def detect_format_from_file(file: Any) -> Format:
    """從檔案表頭判斷格式。"""
    if isinstance(file, pd.DataFrame):
        return detect_format(file)

    if hvcs.detect_file(file):
        return "hvcs"

    rewind(file)
    if is_excel(file):
        header = read_upload(file, header=HVCS_HEADER_ROW, nrows=1)
        if crawler.detect(header.columns):
            return "crawler"
        if wide.detect(header.columns):
            return "wide"
        raise ValueError(
            "Unable to detect Excel format. hvcs: use HV site report; "
            "other formats: prefer CSV."
        )

    header = read_upload(file, nrows=0)
    rewind(file)
    return detect_format(header)

def load_raw(file: Any, fmt: Format | None = None) -> tuple[pd.DataFrame, Format]:
    """讀原始表（hvcs 用第 5 列表頭）。"""
    if isinstance(file, pd.DataFrame):
        fmt = fmt or detect_format(file)
        return file.copy(), fmt

    fmt = fmt or detect_format_from_file(file)
    rewind(file)
    df = read_upload(file, fmt=fmt)
    if fmt == "hvcs":
        df = hvcs.keep_valid_rows(df)
    return df, fmt

def to_long(df: pd.DataFrame, fmt: Format | None = None) -> pd.DataFrame:
    """轉成 timestamp + kW。"""
    fmt = fmt or detect_format(df)
    return _SPECS[fmt].to_long(df)

def date_series(df: pd.DataFrame, fmt: Format) -> pd.Series:
    """原始表日期序列。"""
    return _SPECS[fmt].date_series(df)

def _parse_date(v: str | date | None) -> date | None:
    """字串或 date → date。"""
    if v is None:
        return None
    if isinstance(v, date) and not isinstance(v, datetime):
        return v
    return pd.to_datetime(v).date()

def _filter_by_date_range(
    df: pd.DataFrame,
    fmt: Format,
    start_date: str | date,
    end_date: str | date,
) -> pd.DataFrame:
    """在原始表上篩日期。"""
    start = pd.to_datetime(start_date).normalize()
    end = pd.to_datetime(end_date).normalize()
    days = date_series(df, fmt)
    return df.loc[(days >= start) & (days <= end)].copy()


def filter_date(file: Any) -> FilterDateResult:
    """格式與可選日期範圍。"""
    raw, fmt = load_raw(file)
    dates = date_series(raw, fmt).dropna()
    if dates.empty:
        raise ValueError("No valid dates found in upload.")
    return FilterDateResult(
        format=fmt,
        date_min=dates.min().date(),
        date_max=dates.max().date(),
    )


def cleaning(
    file: Any,
    *,
    voltage_level: str,
    tou_type: str,
    start_date: str | date | None = None,
    end_date: str | date | None = None,
    rates: dict | None = None,
    schedule: dict | None = None,
    holidays: list[dict] | None = None,
) -> pd.DataFrame:
    """讀檔 → 篩日期 → long → 標註電價。"""
    if isinstance(file, pd.DataFrame):
        raw = file.copy()
        fmt = detect_format(raw)
    else:
        raw, fmt = load_raw(file)

    sd = _parse_date(start_date)
    ed = _parse_date(end_date)
    if sd is not None and ed is not None:
        raw = _filter_by_date_range(raw, fmt, sd, ed)
    elif sd is not None or ed is not None:
        raise ValueError("Both start_date and end_date are required to filter.")

    if raw.empty:
        raise ValueError("No data in selected date range.")

    long_df = to_long(raw, fmt)
    long_df = enrich_interval_end(long_df)
    plan = select_plan(
        voltage_level,
        tou_type,
        rates=rates,
        schedule=schedule,
        holidays=holidays,
    )
    return annotate(long_df, plan, time_col="timestamp")
