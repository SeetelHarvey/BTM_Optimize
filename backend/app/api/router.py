"""彙整 /api 路由。"""

from fastapi import APIRouter

from app.api import billing, charts, cleaning, health, imports, settings, simulate

api_router = APIRouter(prefix="/api")
api_router.include_router(health.router)
api_router.include_router(settings.router)
api_router.include_router(cleaning.router)
api_router.include_router(imports.router)
api_router.include_router(billing.router)
api_router.include_router(simulate.router)
api_router.include_router(charts.router)
