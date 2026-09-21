"""需量圖 API。"""

from fastapi import APIRouter, Form, HTTPException

from app.services.import_cache import demand_charts_fingerprint
from app.services.charts import build_charts
from app.services.import_store import ImportNotFound, get

router = APIRouter(prefix="/charts", tags=["charts"])


@router.post("")
async def api_charts(import_id: str = Form(...)):
    """已匯入序列 → heatmap / boxplot / line（同 import 快取）。"""
    try:
        stored = get(import_id)
    except ImportNotFound as e:
        raise HTTPException(404, "import not found") from e

    key = demand_charts_fingerprint(tou_type=stored.tou_type)
    hit = stored.caches.get(key)
    if isinstance(hit, dict) and "heatmap" in hit:
        return hit

    df = stored.df  # 只讀聚合，不 copy 整表
    body = {
        "voltage_level": stored.voltage_level,
        "tou_type": stored.tou_type,
        "start_date": stored.start_date,
        "end_date": stored.end_date,
        **build_charts(df, stored.tou_type),
    }
    stored.caches[key] = body
    return body
