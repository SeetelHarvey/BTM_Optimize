"""流動電費（energy）：區間 kWh × 時段電價。"""

from typing import Any

import pandas as pd

from app.services.billing.demand import add_calendar_month, iter_billing_months
from app.services.contracts import money
from app.services.schedule import DATA_INTERVAL_MINUTES, hours_per_data_row


def calc_energy_charge(
    df: pd.DataFrame,
    *,
    start_date: str,
    end_date: str,
) -> dict[str, Any]:
    """各月流動電費：kWh × energy_price（依 15 分鐘需量列）。"""
    required = {"date", "kW", "period", "energy_price"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"dataframe missing columns: {sorted(missing)}")

    hours = hours_per_data_row()
    months_out: list[dict[str, Any]] = []

    if df.empty:
        return {
            "data_interval_minutes": DATA_INTERVAL_MINUTES,
            "months": [],
            "billing_month_count": 0,
            "kwh": 0.0,
            "total": 0.0,
        }

    work = add_calendar_month(df)
    work["kwh"] = work["kW"].astype(float) * hours
    if bool(work["energy_price"].isna().any()):
        bad = work[work["energy_price"].isna()][["date", "period", "season"]].head(5)
        raise ValueError(f"energy_price has null rows, e.g.: {bad.to_dict(orient='records')}")
    work["amount"] = work["kwh"] * work["energy_price"].astype(float)

    for month in iter_billing_months(start_date, end_date):
        part = work[work["month"] == month]
        if part.empty:
            months_out.append(
                {
                    "month": month,
                    "by_period": [],
                    "by_season_period": [],
                    "kwh": 0.0,
                    "total": 0.0,
                }
            )
            continue

        by_period: list[dict[str, Any]] = []
        grouped = part.groupby("period", sort=True)
        for period, g in grouped:
            kwh = float(g["kwh"].sum())
            amount = float(g["amount"].sum())
            prices = g["energy_price"].astype(float).unique()
            by_period.append(
                {
                    "period": str(period),
                    "kwh": round(kwh, 3),
                    "amount": money(amount),
                    "avg_price": float(prices[0]) if len(prices) == 1 else (
                        amount / kwh if kwh > 0 else None
                    ),
                }
            )

        by_season_period: list[dict[str, Any]] = []
        if "season" in part.columns:
            for (season, period), g in part.groupby(["season", "period"], sort=True):
                kwh = float(g["kwh"].sum())
                amount = float(g["amount"].sum())
                prices = g["energy_price"].astype(float).unique()
                by_season_period.append(
                    {
                        "season": str(season),
                        "period": str(period),
                        "kwh": round(kwh, 3),
                        "amount": money(amount),
                        "avg_price": float(prices[0]) if len(prices) == 1 else (
                            amount / kwh if kwh > 0 else None
                        ),
                    }
                )

        month_kwh = float(part["kwh"].sum())
        detail = by_season_period or by_period
        months_out.append(
            {
                "month": month,
                "by_period": by_period,
                "by_season_period": by_season_period,
                "kwh": round(month_kwh, 3),
                "total": sum(r["amount"] for r in detail),
            }
        )

    grand_kwh = round(sum(m["kwh"] for m in months_out), 3)
    grand_total = sum(m["total"] for m in months_out)
    return {
        "data_interval_minutes": DATA_INTERVAL_MINUTES,
        "months": months_out,
        "billing_month_count": len(months_out),
        "kwh": grand_kwh,
        "total": grand_total,
    }
