"""匯入並暫存清理後需量。"""

import json
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.api import parse_json_form
from app.services.cleaning import cleaning
from app.services.cleaning.io import rewind
from app.services.import_store import ImportNotFound, delete, put, status

router = APIRouter(prefix="/import", tags=["import"])

SAMPLE_DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "samples"
_SAMPLE_SUFFIX = {".csv", ".xlsx", ".xls", ".xlsm"}


@router.get("/samples")
async def api_import_samples():
    """匯入頁可選的示範檔名。"""
    if not SAMPLE_DATA_DIR.is_dir():
        return {"files": []}
    files = sorted(
        p.name
        for p in SAMPLE_DATA_DIR.iterdir()
        if p.suffix.lower() in _SAMPLE_SUFFIX
    )
    return {"files": files}


@router.get("/samples/{name}")
async def api_import_sample_file(name: str):
    """下載示範檔（供匯入頁載入）。"""
    path = (SAMPLE_DATA_DIR / name).resolve()
    if (
        path.parent != SAMPLE_DATA_DIR.resolve()
        or path.suffix.lower() not in _SAMPLE_SUFFIX
        or not path.is_file()
    ):
        raise HTTPException(404, "file not found")
    return FileResponse(path, filename=name)


@router.get("/{import_id}")
async def api_import_status(import_id: str):
    """暫存是否仍在、剩餘秒數。"""
    try:
        return status(import_id)
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e


@router.delete("/{import_id}")
async def api_import_delete(import_id: str):
    """刪除行程內暫存（不存在也回 ok）。"""
    delete(import_id)
    return {"ok": True, "import_id": import_id}


@router.post("")
async def api_import_create(
    file: UploadFile = File(...),
    voltage_level: str = Form("HV"),
    tou_type: str = Form("ThreeStage"),
    start_date: str = Form(...),
    end_date: str = Form(...),
    rates: str | None = Form(None),
    schedule: str | None = Form(None),
    holidays: str | None = Form(None),
):
    """上傳 → 清一次 → 暫存 → import_id。"""
    try:
        rates_obj = parse_json_form(rates, None)
        schedule_obj = parse_json_form(schedule, None)
        holidays_obj = parse_json_form(holidays, None)
        rewind(file)
        df = cleaning(
            file,
            voltage_level=voltage_level,
            tou_type=tou_type,
            start_date=start_date,
            end_date=end_date,
            rates=rates_obj,
            schedule=schedule_obj,
            holidays=holidays_obj,
        )
    except (ValueError, KeyError, TypeError, json.JSONDecodeError, ImportError) as e:
        raise HTTPException(400, str(e)) from e
    except Exception as e:
        raise HTTPException(400, f"Cannot read upload: {e}") from e
    import_id = put(
        df,
        voltage_level=voltage_level,
        tou_type=tou_type,
        start_date=start_date,
        end_date=end_date,
    )
    return status(import_id)
