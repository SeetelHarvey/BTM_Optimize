"""FastAPI 入口。"""

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router

app = FastAPI(
    title="BTM Optimize API",
    description="Backend for BTM_Optimize. UI lives in frontend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

_frontend = Path(__file__).resolve().parents[2] / "frontend"
_SPA_SKIP = frozenset({"api", "docs", "redoc", "openapi.json"})
_SPA_FILES = {"favicon.ico": "assets/seetel_logo_s.png"}


def _safe_frontend_file(rel: str) -> Path | None:
    if not _frontend.is_dir() or not rel:
        return None
    root = _frontend.resolve()
    path = (root / rel).resolve()
    if root not in path.parents and path != root:
        return None
    return path if path.is_file() else None


if _frontend.is_dir():
    app.mount("/css", StaticFiles(directory=str(_frontend / "css")), name="css")
    app.mount("/js", StaticFiles(directory=str(_frontend / "js")), name="js")
    app.mount("/assets", StaticFiles(directory=str(_frontend / "assets")), name="assets")
    app.mount("/vendor", StaticFiles(directory=str(_frontend / "vendor")), name="vendor")

    @app.get("/")
    def spa_index():
        """前端首頁。"""
        return FileResponse(_frontend / "index.html")

    @app.get("/{full_path:path}")
    def spa_fallback(full_path: str):
        """前端路由重整仍回 index.html。"""
        head = full_path.split("/", 1)[0]
        if head in _SPA_SKIP:
            raise HTTPException(404, "not found")
        found = _safe_frontend_file(_SPA_FILES.get(full_path, full_path))
        if found:
            return FileResponse(found)
        return FileResponse(_frontend / "index.html")
