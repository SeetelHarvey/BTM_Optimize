# BTM Optimize

台電高壓需量電費試算與表後儲能（BESS）量體／功能模擬。**frontend/** 產品 UI（匯入 → 視覺化 → 電費試算 → 儲能模擬 → 設定），**backend/** FastAPI；開發時一個 uvicorn 同源餵靜態頁與 `/api`。

## 初次安裝

Git Bash（Windows）或 WSL／Linux／macOS：

```bash
cd backend
python -m venv .venv
# Git Bash (Windows)：
source .venv/Scripts/activate
# WSL / Linux / macOS：
# source .venv/bin/activate
pip install -r requirements.txt
```

## 開啟

每次開發開一個終端即可（API + UI 同源）：

```bash
cd backend
.venv/Scripts/activate
uvicorn app.main:app --reload --app-dir .
```


|          | URL                                                      |
| -------- | -------------------------------------------------------- |
| UI       | [http://127.0.0.1:8000/](http://127.0.0.1:8000/)         |
| API docs | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |


預設進 **匯入**（`/import`）。設定與電價細節見 `backend/README.md`；頁面路由見 `frontend/README.md`。

## 自檢

```bash
cd backend
.venv/Scripts/activate
python -m app.checks
```

單項：`python -m app.checks.device` 等（見 `app/checks/`）。
