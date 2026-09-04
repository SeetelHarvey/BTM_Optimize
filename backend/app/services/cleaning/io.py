"""讀檔工具。"""

import csv
import importlib.util
from pathlib import Path
from typing import Any, Literal, TextIO

import pandas as pd

from app.services.cleaning.types import EXCEL_SUFFIXES, Format, HVCS_HEADER_ROW

ExcelEngine = Literal["xlrd", "openpyxl"]
_CSV_ENCODING = "utf-8-sig"


def upload_name(file: Any) -> str:
    """取檔名。"""
    if isinstance(file, (str, Path)):
        return str(file)
    return str(getattr(file, "filename", None) or getattr(file, "name", "") or "")


def is_excel(file: Any) -> bool:
    """是否 Excel 副檔名。"""
    return Path(upload_name(file)).suffix.lower() in EXCEL_SUFFIXES


def excel_engine(file: Any) -> ExcelEngine:
    """Excel engine。"""
    if Path(upload_name(file)).suffix.lower() == ".xls":
        return "xlrd"
    return "openpyxl"


def _require_xlrd() -> None:
    """.xls 需 xlrd。"""
    if importlib.util.find_spec("xlrd") is None:
        raise ValueError(
            "Reading .xls requires xlrd (pip install xlrd). Or save as .xlsx."
        )


def _read_excel(
    fileobj: Any,
    file: Any,
    *,
    header: int | Literal["infer"] | None,
    nrows: int | None,
) -> pd.DataFrame:
    """讀 Excel；.xls 先 xlrd，失敗再試 openpyxl（副檔名誤標）。"""
    engine = excel_engine(file)
    if engine == "xlrd":
        _require_xlrd()
    hdr: int | Literal["infer"] | None
    if header is None:
        hdr = None
    elif header == "infer":
        hdr = 0
    else:
        hdr = int(header)
    kwargs: dict[str, Any] = {"header": hdr}
    if nrows is not None:
        kwargs["nrows"] = nrows
    rewind(file)
    try:
        return pd.read_excel(fileobj, engine=engine, **kwargs)
    except Exception as primary:
        if engine != "xlrd":
            raise ValueError(f"Cannot read Excel file: {primary}") from primary
        rewind(file)
        try:
            return pd.read_excel(fileobj, engine="openpyxl", **kwargs)
        except Exception:
            raise ValueError(
                f"Cannot read .xls (tried xlrd and openpyxl): {primary}"
            ) from primary


def rewind(file: Any) -> None:
    """檔案指標回開頭。"""
    if isinstance(file, (str, Path)):
        return
    inner = getattr(file, "file", file)
    if hasattr(inner, "seek"):
        inner.seek(0)


def _open_text(file: Any) -> tuple[TextIO, bool]:
    """開文字流（Path/str 會 close）。"""
    if isinstance(file, (str, Path)):
        return open(file, encoding=_CSV_ENCODING, newline=""), True
    inner = getattr(file, "file", file)
    return inner, False


def peek_row_cells(file: Any, row_index: int) -> list[str]:
    """讀指定列（表頭偵測）。"""
    rewind(file)
    stream: Any = None
    close = False
    try:
        if is_excel(file):
            path_or_obj = file if isinstance(file, (str, Path)) else getattr(file, "file", file)
            df = _read_excel(
                path_or_obj,
                file,
                header=None,
                nrows=row_index + 1,
            )
            if len(df) <= row_index:
                return []
            return [
                str(c).strip()
                for c in df.iloc[row_index]
                if pd.notna(c) and str(c).strip()
            ]

        stream, close = _open_text(file)
        for i, raw in enumerate(stream):
            if i == row_index:
                line = raw.decode("utf-8-sig") if isinstance(raw, bytes) else raw
                return [c.strip() for c in next(csv.reader([line])) if c.strip()]
        return []
    finally:
        if close and stream is not None:
            stream.close()
        else:
            rewind(file)


def read_upload(
    file: Any,
    *,
    fmt: Format | None = None,
    header: int | Literal["infer"] | None = "infer",
    nrows: int | None = None,
) -> pd.DataFrame:
    """讀 CSV / Excel。"""
    if isinstance(file, (str, Path)):
        fileobj: Any = file
    else:
        fileobj = getattr(file, "file", file)

    resolved_header: int | Literal["infer"] | None = header
    if fmt == "hvcs" and header == "infer":
        resolved_header = HVCS_HEADER_ROW

    if is_excel(file):
        return _read_excel(
            fileobj,
            file,
            header=resolved_header,
            nrows=nrows,
        )

    return pd.read_csv(
        fileobj,
        header=resolved_header,
        nrows=nrows,
        encoding=_CSV_ENCODING,
    )
