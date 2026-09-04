# BTM Optimize Frontend

產品 UI：暗色 HUD 殼 + 匯入／電費／視覺化／試算／設定。

用 FastAPI 一起開（同源，可打 `/api`）：

```bash
cd backend
uvicorn app.main:app --reload --app-dir .
```

開 http://127.0.0.1:8000/

| 頁面 | 路由 | 說明 |
|------|------|------|
| 匯入 | `/import` | 上傳檔、日期、方案、契約；匯入後出圖與電費。 |
| 電費試算 | `/dashboard` | KPI＋結構表＋月帳單。 |
| 視覺化 | `/charts` | 熱力／箱型／折線。 |
| 儲能試算 | `/simulate` | 樣本統計 → 配置組合試算 → 報告。 |
| 設定 | `/settings` | 電價與時段；「重新載入系統預設」重置編輯。覆寫只留在瀏覽器。 |

殼層（背景漸層、側欄、HUD 框、語系）為本專案前端樣式。
