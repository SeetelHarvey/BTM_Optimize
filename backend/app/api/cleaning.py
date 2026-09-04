"""資料清理 API。"""

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.services.cleaning import filter_date

router = APIRouter(prefix="/cleaning", tags=["cleaning"])


class FilterDateOut(BaseModel):
    format: str
    date_min: str
    date_max: str


@router.post("/filter-date", response_model=FilterDateOut)
async def api_filter_date(file: UploadFile = File(...)):
    """上傳檔 → 格式與可選日期範圍。"""
    try:
        meta = filter_date(file)
    except (ValueError, ImportError) as e:
        raise HTTPException(400, str(e)) from e
    except Exception as e:
        raise HTTPException(400, f"Cannot read upload: {e}") from e
    return FilterDateOut(
        format=meta.format,
        date_min=meta.date_min.isoformat(),
        date_max=meta.date_max.isoformat(),
    )
