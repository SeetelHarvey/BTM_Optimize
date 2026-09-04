"""健康檢查。"""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    """服務狀態。"""
    return {"status": "ok"}
