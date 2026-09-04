"""需量圖 API。"""

from fastapi import APIRouter, Form, HTTPException

from app.services.charts import build_charts
from app.services.import_store import ImportNotFound, get

router = APIRouter(prefix="/charts", tags=["charts"])


@router.post("")
async def api_charts(import_id: str = Form(...)):
    """已匯入序列 → heatmap / boxplot / line。"""
    try:
        stored = get(import_id)
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e

    df = stored.df.copy()
    out = build_charts(df, stored.tou_type)
    return {
        "voltage_level": stored.voltage_level,
        "tou_type": stored.tou_type,
        "start_date": stored.start_date,
        "end_date": stored.end_date,
        **out,
    }
