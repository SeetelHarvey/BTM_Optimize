# BTM Optimize Backend (FastAPI)

```bash
cd backend
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --app-dir .
```

## 正式 API


| Method | Path                        | 說明                                    |
| ------ | --------------------------- | ------------------------------------- |
| GET    | `/api/settings/defaults`    | 電價／時段／假日／超約／模擬參數／TOU 策略預設         |
| GET    | `/api/settings/contracts`   | 各方案契約欄位（fields / tier2 / forbidden）   |
| POST   | `/api/settings/plan`        | 預覽 demand / prices / matrix（可帶覆寫，不寫檔） |
| POST   | `/api/cleaning/filter-date` | 上傳檔 → format + 日期範圍                   |
| GET    | `/api/import/samples`       | 匯入頁示範檔名列表 |
| GET    | `/api/import/samples/{name}` | 下載示範檔 |
| POST   | `/api/import`               | 上傳 → 清一次 → 暫存 → `import_id`           |
| DELETE | `/api/import/{import_id}`   | 刪除行程內暫存（不存在也 ok）                 |
| POST   | `/api/billing/basic`        | `import_id` + 契約 → basic + overage + energy |
| POST   | `/api/simulate/size`        | `import_id` + 契約 + simulate → 完整試算報告 |
| POST   | `/api/charts`               | `import_id` → heatmap / boxplot / line |

## 自檢

```bash
python -m app.checks              # 全部
python -m app.checks.simulate_size  # 單項
```

模組在 `app/checks/`（assert 自檢，非 pytest）。

## 設定原則

JSON（`app/data/`）= 系統預設（含 `simulate_defaults.json`）；試算以 UI 傳入為準。  
不要把多使用者設定寫回共用 JSON。

## 計費命名


| 中文   | 程式 / API  | 說明                      |
| ---- | --------- | ----------------------- |
| 基本電費 | `basic`   | 契約容量；足月全額，不足月 × days/30 |
| 超約   | `overage` | 需量超過契約                  |
| 流動電費 | `energy`  | kWh × 時段電價              |




## 時間間隔（`schedule.py` 頂部常數）


| 欄位                      | 值       | 用途                             |
| ----------------------- | ------- | ------------------------------ |
| `DATA_INTERVAL_MINUTES` | 15      | 需量列、kWh、96 列/日                 |
| `tou_slot_minutes`      | 60 / 30 | 電價時段矩陣（JSON 欄位 `step_minutes`） |




## 模組

```
app/api/cleaning.py            # 清理 API
app/api/imports.py             # 匯入、示範檔、暫存
app/api/simulate.py            # POST /sample、/size 量體試算
app/api/charts.py              # POST /（heatmap + boxplot + line）
app/api/settings.py            # 設定 API
app/services/import_store.py   # 匯入序列 dict（TTL、非帳號資料）
app/services/charts.py         # 需量圖、調度圖聚合
app/services/schedule.py       # 時間間隔常數、時段矩陣、label_periods
app/services/settings.py       # 讀預設 JSON
app/services/tariff.py         # select_plan / annotate
app/services/contracts.py      # 契約、基本電費公式
app/services/billing/          # demand、basic、overage、energy、calc_full_bill（run）
app/services/bess/             # device、dispatch、size_grid、run
app/services/features/         # tou、demand、backup、large_user、reserve
app/services/cleaning/         # filter_date / cleaning
app/data/samples/              # 匯入頁示範 CSV（經 /api/import/samples 提供）
app/checks/                      # 開發自檢：python -m app.checks
```



## cleaning 輸出欄位

**DataFrame：** `timestamp`, `kW`, `date`, `min`(0–95), `hour`, `is_holiday`, `season`, `period`, `energy_price`
