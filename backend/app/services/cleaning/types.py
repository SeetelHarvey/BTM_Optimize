"""共用型別與欄位常數。"""

from dataclasses import dataclass
from datetime import date
from typing import Literal

Format = Literal["wide", "hvcs", "crawler"]

WIDE_DATE_COLS = ("date", "Date")

HVCS_TIME_COL = "時段"
HVCS_KW_COL = "kW_del"
HVCS_HEADER_ROW = 4  # 0-based; Excel row 5

CRAWLER_DATE_COL = "年月日"
CRAWLER_TIME_COL = "時分"
CRAWLER_DEMAND_COLS = ("尖峰", "半尖峰", "週六半尖峰", "離峰")

EXCEL_SUFFIXES = frozenset({".xls", ".xlsx", ".xlsm"})


@dataclass(frozen=True)
class FilterDateResult:
    """filter_date 回傳。"""
    format: Format
    date_min: date
    date_max: date
