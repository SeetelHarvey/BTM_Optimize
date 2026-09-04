"""完整電費：basic＋overage＋energy＋summary（與 /api/billing/basic 同形）。"""

from typing import Any
import pandas as pd

from app.services.billing.basic_charge import calc_basic_charge
from app.services.billing.energy_charge import calc_energy_charge
from app.services.billing.overage import PERIOD_ORDER, calc_overage


def summarize_months(months: list[dict[str, Any]], tou_type: str) -> dict[str, Any]:
    """全年基本／流動加總；超約按月列出。"""
    basic_by: dict[str, dict[str, Any]] = {}
    over_rows: list[dict[str, Any]] = []
    energy_by: dict[tuple[str, str], dict[str, Any]] = {}

    for m in months:
        for line in m.get("lines") or []:
            c = str(line["component"])
            if c not in basic_by:
                basic_by[c] = {
                    "component": c,
                    "kw": line.get("kw"),
                    "contract_kw": line.get("contract_kw"),
                    "amount": 0,
                }
            basic_by[c]["amount"] += int(line.get("amount") or 0)

        for row in (m.get("overage") or {}).get("periods") or []:
            billed = float(row.get("billed_over_kw") or 0)
            amount = int(row.get("amount") or 0)
            if billed <= 0 and amount <= 0:
                continue
            over_rows.append(
                {
                    "month": m.get("month"),
                    "period": row.get("period"),
                    "peak_kw": row.get("peak_kw"),
                    "ceiling_kw": row.get("ceiling_kw"),
                    "quota_kw": row.get("quota_kw"),
                    "billed_over_kw": row.get("billed_over_kw"),
                    "base_rate": row.get("base_rate"),
                    "tiers": row.get("tiers") or [],
                    "amount": amount,
                }
            )

        energy = m.get("energy") or {}
        rows = energy.get("by_season_period") or [
            {
                "season": "",
                "period": r["period"],
                "kwh": r.get("kwh"),
                "amount": r.get("amount"),
            }
            for r in (energy.get("by_period") or [])
        ]
        for row in rows:
            sea = str(row.get("season") or "")
            p = str(row["period"])
            key = (sea, p)
            if key not in energy_by:
                energy_by[key] = {
                    "season": sea or None,
                    "period": p,
                    "kwh": 0.0,
                    "amount": 0,
                    "price": row.get("avg_price"),
                }
            energy_by[key]["kwh"] = round(
                float(energy_by[key]["kwh"]) + float(row.get("kwh") or 0), 3
            )
            energy_by[key]["amount"] += int(row.get("amount") or 0)
            if energy_by[key].get("price") is None and row.get("avg_price") is not None:
                energy_by[key]["price"] = row.get("avg_price")

    order = PERIOD_ORDER.get(tou_type, ())
    energy_rows = []
    for sea in ("summer", "non_summer", ""):
        for p in order:
            row = energy_by.get((sea, p))
            if not row:
                continue
            kwh = row["kwh"]
            price = row.get("price") or (row["amount"] / kwh if kwh else None)
            energy_rows.append({**row, "price": price, "avg_price": price})
    leftover = [energy_by[k] for k in energy_by if k[1] not in order]
    for row in leftover:
        kwh = row["kwh"]
        price = row.get("price") or (row["amount"] / kwh if kwh else None)
        energy_rows.append({**row, "price": price, "avg_price": price})

    return {
        "basic": list(basic_by.values()),
        "overage": over_rows,
        "energy": energy_rows,
    }


def calc_full_bill(
    df: pd.DataFrame,
    plan: dict,
    contracts: dict,
    *,
    tou_type: str,
    start_date: str,
    end_date: str,
    voltage_level: str,
    overage_rules: dict | None = None,
) -> dict[str, Any]:
    """已標註 df 上算 basic＋overage＋energy（結構同 /api/billing/basic）。"""
    basic = calc_basic_charge(
        df,
        contracts,
        plan["demand"],
        tou_type,
        start_date=start_date,
        end_date=end_date,
    )
    overage = calc_overage(
        df,
        contracts,
        plan["demand"],
        tou_type,
        start_date=start_date,
        end_date=end_date,
        rules=overage_rules,
    )
    energy = calc_energy_charge(df, start_date=start_date, end_date=end_date)
    overage_by_month = {m["month"]: m for m in overage["months"]}
    energy_by_month = {m["month"]: m for m in energy["months"]}
    months = []
    for m in basic["months"]:
        o = overage_by_month.get(m["month"], {"periods": [], "total": 0.0})
        e = energy_by_month.get(
            m["month"],
            {"by_period": [], "by_season_period": [], "kwh": 0.0, "total": 0.0},
        )
        basic_total = int(m["total"] or 0)
        overage_total = int(o.get("total", 0) or 0)
        energy_total = int(e.get("total", 0) or 0)
        months.append(
            {
                **m,
                "basic_total": basic_total,
                "overage": {"periods": o.get("periods", []), "total": overage_total},
                "energy": {
                    "by_period": e.get("by_period", []),
                    "by_season_period": e.get("by_season_period", []),
                    "kwh": e.get("kwh", 0.0),
                    "total": energy_total,
                },
                "demand_total": basic_total + overage_total,
                "bill_total": basic_total + overage_total + energy_total,
            }
        )

    basic_total = int(basic["total"] or 0)
    overage_total = int(overage["total"] or 0)
    energy_total = int(energy["total"] or 0)
    return {
        "voltage_level": voltage_level,
        "tou_type": tou_type,
        "start_date": start_date,
        "end_date": end_date,
        "row_count": len(df),
        "data_interval_minutes": int(plan["data_interval_minutes"]),
        "tou_slot_minutes": int(plan["tou_slot_minutes"]),
        "contracts": basic["contracts"],
        "summary": summarize_months(months, tou_type),
        "months": months,
        "billing_month_count": len(months),
        "basic_total": basic_total,
        "overage_total": overage_total,
        "energy_total": energy_total,
        "energy_kwh": energy["kwh"],
        "demand_total": basic_total + overage_total,
        "total": basic_total + overage_total + energy_total,
    }
