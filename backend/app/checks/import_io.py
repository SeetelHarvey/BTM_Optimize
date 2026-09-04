"""匯入副檔名讀檔自檢。"""

import importlib.util
import io

import pandas as pd

from app.services.cleaning.io import excel_engine, read_upload
from app.services.import_store import delete, put, status


class _Upload:
    def __init__(self, filename: str, data: bytes):
        self.filename = filename
        self.file = io.BytesIO(data)


def main() -> None:
    assert importlib.util.find_spec("xlrd") is not None, "xlrd missing for .xls"
    assert importlib.util.find_spec("openpyxl") is not None, "openpyxl missing"
    assert excel_engine("a.xls") == "xlrd"
    assert excel_engine("a.xlsx") == "openpyxl"
    assert excel_engine("a.xlsm") == "openpyxl"

    df = pd.DataFrame({"date": ["2024-01-01"], "kW": [100.0]})
    buf = io.BytesIO()
    df.to_excel(buf, index=False, engine="openpyxl")
    out = read_upload(_Upload("t.xlsx", buf.getvalue()))
    assert len(out) == 1

    iid = put(
        pd.DataFrame({"kW": [1.0]}),
        voltage_level="HV",
        tou_type="ThreeStage",
        start_date="2024-01-01",
        end_date="2024-01-02",
    )
    st = status(iid)
    assert st["import_id"] == iid
    assert st["ttl_sec"] == 3600
    iid2 = put(
        pd.DataFrame({"kW": [9.0]}),
        voltage_level="HV",
        tou_type="ThreeStage",
        start_date="2024-02-01",
        end_date="2024-02-02",
    )
    assert iid2 != iid
    try:
        status(iid)
        raise AssertionError("expected ImportNotFound for replaced import")
    except KeyError:
        pass
    assert status(iid2)["row_count"] == 1
    assert delete(iid2) is True
    try:
        status(iid2)
        raise AssertionError("expected ImportNotFound")
    except KeyError:
        pass
    print("ok import io", list(out.columns))


if __name__ == "__main__":
    main()
