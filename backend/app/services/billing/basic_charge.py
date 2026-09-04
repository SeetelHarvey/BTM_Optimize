"""契約基本電費（不含超約）。"""

from typing import Any

import pandas as pd

from app.services.billing.demand import (
    basic_proration_factor,
    bill_mode,
    covered_days,
    iter_billing_months,
    monthly_peak_by_period,
)
from app.services.contracts import ContractCapacity, calc_basic_charge_lines, money, validate


def _full_month_basic(
    contracts: ContractCapacity,
    demand_rates: dict,
    tou_type: str,
    mode: str,
) -> dict[str, Any]:
    """整月基本電費（未四捨五入）；5/10 月取夏、非夏各半。"""
    if mode == "split":
        summer = calc_basic_charge_lines(
            contracts, demand_rates, "summer", tou_type
        )
        non_summer = calc_basic_charge_lines(
            contracts, demand_rates, "non_summer", tou_type
        )
        lines: list[dict[str, Any]] = []
        for s_line, n_line in zip(summer["lines"], non_summer["lines"]):
            row: dict[str, Any] = {
                "component": s_line["component"],
                "kw": s_line["kw"],
                "rate": (s_line["rate"] + n_line["rate"]) / 2,
                "amount": (s_line["amount"] + n_line["amount"]) / 2,
            }
            if "contract_kw" in s_line:
                row["contract_kw"] = s_line["contract_kw"]
            lines.append(row)
        return {"lines": lines, "total": sum(l["amount"] for l in lines)}

    result = calc_basic_charge_lines(contracts, demand_rates, mode, tou_type)
    return {"lines": result["lines"], "total": result["total"]}


def _prorate_lines(lines: list[dict[str, Any]], factor: float) -> list[dict[str, Any]]:
    """不足月：amount × factor（仍未四捨五入）。"""
    if factor == 1.0:
        return [dict(line) for line in lines]
    out: list[dict[str, Any]] = []
    for line in lines:
        row = dict(line)
        row["amount"] = line["amount"] * factor
        out.append(row)
    return out


def _round_lines(lines: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], int]:
    """每筆金額四捨五入一次；合計為加總。"""
    out: list[dict[str, Any]] = []
    for line in lines:
        row = dict(line)
        row["amount"] = money(line["amount"])
        out.append(row)
    return out, sum(r["amount"] for r in out)


def calc_basic_charge(
    df: pd.DataFrame,
    contracts: ContractCapacity | dict[str, Any],
    demand_rates: dict,
    tou_type: str,
    *,
    start_date: str,
    end_date: str,
) -> dict[str, Any]:
    """依契約容量算各月基本電費（足月全額；不足月 × days/30）。"""
    if isinstance(contracts, dict):
        contracts = ContractCapacity.from_dict(contracts)
    contracts = validate(contracts, tou_type)

    peaks = monthly_peak_by_period(df)
    months_out: list[dict[str, Any]] = []

    for month in iter_billing_months(start_date, end_date):
        days = covered_days(month, start_date, end_date)
        mode = bill_mode(month)
        full = _full_month_basic(contracts, demand_rates, tou_type, mode)
        factor = basic_proration_factor(month, start_date, end_date)
        lines, total = _round_lines(_prorate_lines(full["lines"], factor))

        months_out.append(
            {
                "month": month,
                "bill_mode": mode,
                "covered_days": days,
                "proration": round(factor, 6),
                "full_month_total": money(full["total"]),
                "demand_peaks": peaks.get(month, {}),
                "lines": lines,
                "total": total,
            }
        )

    grand = sum(m["total"] for m in months_out)
    return {
        "tou_type": tou_type,
        "contracts": contracts.to_dict(),
        "months": months_out,
        "billing_month_count": len(months_out),
        "total": grand,
    }
