"""超約附加費。"""

from typing import Any

import pandas as pd

from app.services.billing.demand import (
    add_calendar_month,
    bill_mode,
    iter_billing_months,
)
from app.services.contracts import (
    ContractCapacity,
    cumulative_ceiling,
    money,
    overage_tiers,
    tier2_kw,
    validate,
)

PERIOD_ORDER: dict[str, tuple[str, ...]] = {
    "ThreeStage": ("peak", "half_peak", "saturday_half_peak", "off_peak"),
    "TwoStage": ("peak", "saturday_half_peak", "off_peak"),
    "BatchStage": ("peak", "saturday_half_peak", "off_peak"),
}

_RATE_KEY: dict[str, str] = {
    "peak": "base_prices",
    "half_peak": "half_peak_base_prices",
    "saturday_half_peak": "saturday_base_prices",
    "off_peak": "off_peak_base_prices",
}


def overage_ceiling(
    period: str,
    contracts: ContractCapacity,
    tou_type: str,
    mode: str,
) -> float:
    """超約比對用的累計契約上限。"""
    if (
        period == "peak"
        and tou_type in ("TwoStage", "BatchStage")
        and mode != "summer"
    ):
        return contracts.regular_kw + tier2_kw(contracts)
    return cumulative_ceiling(period, contracts)


def _base_rate(demand_rates: dict, period: str, mode: str) -> float:
    key = _RATE_KEY[period]
    prices = demand_rates[key]
    if mode == "split":
        return (float(prices["summer"]) + float(prices["non_summer"])) / 2
    return float(prices[mode])


def _quota_kw(ceiling_kw: float, tiers_rules: list[dict[str, Any]]) -> float | None:
    """第一段超約額度（契約上限 × upto_contract_ratio）。"""
    for rule in tiers_rules:
        ratio = rule.get("upto_contract_ratio")
        if ratio is not None:
            return round(float(ceiling_kw) * float(ratio), 3)
    return None


def _split_tiers(
    billed_kw: float,
    ceiling_kw: float,
    base_rate: float,
    tiers_rules: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    if billed_kw <= 0:
        return []

    out: list[dict[str, Any]] = []
    remain = billed_kw
    cursor = 0.0
    for rule in tiers_rules:
        if remain <= 0:
            break
        ratio = rule.get("upto_contract_ratio")
        if ratio is None:
            slice_kw = remain
        else:
            room = max(0.0, ceiling_kw * float(ratio) - cursor)
            slice_kw = min(remain, room)
        if slice_kw <= 0:
            continue
        mult = float(rule["rate_multiplier"])
        rate = base_rate * mult
        out.append(
            {
                "label": rule["label"],
                "kw": round(slice_kw, 3),
                "multiplier": mult,
                "rate": rate,
                "amount": rate * slice_kw,
            }
        )
        remain -= slice_kw
        cursor += slice_kw
    return out


def calc_month_overage(
    peaks: dict[str, float],
    contracts: ContractCapacity,
    demand_rates: dict,
    tou_type: str,
    mode: str,
    *,
    rules: dict | None = None,
) -> dict[str, Any]:
    """單月超約明細。"""
    contracts = validate(contracts, tou_type)
    if tou_type not in PERIOD_ORDER:
        raise ValueError(f"unknown tou_type: {tou_type!r}")

    tiers_rules = overage_tiers(rules)
    order = PERIOD_ORDER[tou_type]
    rows: list[dict[str, Any]] = []
    prev_max_raw = 0.0

    for period in order:
        ceiling = overage_ceiling(period, contracts, tou_type, mode)
        peak_kw = peaks.get(period)
        if peak_kw is None:
            rows.append(
                {
                    "period": period,
                    "peak_kw": None,
                    "ceiling_kw": ceiling,
                    "quota_kw": _quota_kw(ceiling, tiers_rules),
                    "raw_over_kw": None,
                    "billed_over_kw": None,
                    "base_rate": None,
                    "tiers": [],
                    "amount": 0.0,
                }
            )
            continue

        peak_f = float(peak_kw)
        raw = max(0.0, peak_f - ceiling)
        billed = max(0.0, raw - prev_max_raw)
        prev_max_raw = max(prev_max_raw, raw)
        base = _base_rate(demand_rates, period, mode)
        tiers = _split_tiers(billed, ceiling, base, tiers_rules)
        amount = money(sum(float(t["amount"]) for t in tiers))
        rows.append(
            {
                "period": period,
                "peak_kw": peak_f,
                "ceiling_kw": ceiling,
                "quota_kw": _quota_kw(ceiling, tiers_rules),
                "raw_over_kw": round(raw, 3),
                "billed_over_kw": round(billed, 3),
                "base_rate": base,
                "tiers": tiers,
                "amount": amount,
            }
        )

    total = sum(r["amount"] for r in rows)
    return {"periods": rows, "total": total}


def _peaks(part: pd.DataFrame) -> dict[str, float]:
    if part.empty:
        return {}
    return {
        str(period): float(kw)
        for period, kw in part.groupby("period", sort=True)["kW"].max().items()
    }


def _merge_period(a: dict[str, Any] | None, b: dict[str, Any] | None) -> dict[str, Any]:
    """5／10 月夏、非夏兩段超約合併為一列。"""
    if not a:
        return dict(b)
    if not b:
        return dict(a)
    a_billed = float(a.get("billed_over_kw") or 0)
    b_billed = float(b.get("billed_over_kw") or 0)
    if a_billed > 0 and b_billed <= 0:
        return dict(a)
    if b_billed > 0 and a_billed <= 0:
        return dict(b)
    if a_billed <= 0 and b_billed <= 0:
        ap, bp = a.get("peak_kw"), b.get("peak_kw")
        if ap is None:
            return dict(b)
        if bp is None or float(ap) >= float(bp):
            return dict(a)
        return dict(b)
    billed = a_billed + b_billed
    peaks = [x for x in (a.get("peak_kw"), b.get("peak_kw")) if x is not None]
    raw_a = float(a.get("raw_over_kw") or 0)
    raw_b = float(b.get("raw_over_kw") or 0)
    return {
        "period": a["period"],
        "peak_kw": max(peaks) if peaks else None,
        "ceiling_kw": a["ceiling_kw"] if a_billed >= b_billed else b["ceiling_kw"],
        "quota_kw": a.get("quota_kw") if a_billed >= b_billed else b.get("quota_kw"),
        "raw_over_kw": round(raw_a + raw_b, 3),
        "billed_over_kw": round(billed, 3),
        "base_rate": (float(a["base_rate"]) * a_billed + float(b["base_rate"]) * b_billed)
        / billed,
        "tiers": list(a.get("tiers") or []) + list(b.get("tiers") or []),
        "amount": int(a["amount"]) + int(b["amount"]),
    }


def _split_month_overage(
    part: pd.DataFrame,
    contracts: ContractCapacity,
    demand_rates: dict,
    tou_type: str,
    *,
    rules: dict | None,
) -> dict[str, Any]:
    """5／10 月：夏月日與非夏月日分開比契約、用該段單價（不是整月平均）。"""
    summer = calc_month_overage(
        _peaks(part.loc[part["season"] == "summer"]),
        contracts,
        demand_rates,
        tou_type,
        "summer",
        rules=rules,
    )
    non_summer = calc_month_overage(
        _peaks(part.loc[part["season"] == "non_summer"]),
        contracts,
        demand_rates,
        tou_type,
        "non_summer",
        rules=rules,
    )
    by_s = {r["period"]: r for r in summer["periods"]}
    by_n = {r["period"]: r for r in non_summer["periods"]}
    rows = [
        _merge_period(by_s.get(p), by_n.get(p))
        for p in PERIOD_ORDER[tou_type]
    ]
    return {"periods": rows, "total": sum(r["amount"] for r in rows)}


def calc_overage(
    df: pd.DataFrame,
    contracts: ContractCapacity | dict[str, Any],
    demand_rates: dict,
    tou_type: str,
    *,
    start_date: str,
    end_date: str,
    rules: dict | None = None,
) -> dict[str, Any]:
    """各月超約附加費。5／10 月依夏月區間切兩段，不用各半單價。"""
    if isinstance(contracts, dict):
        contracts = ContractCapacity.from_dict(contracts)
    contracts = validate(contracts, tou_type)

    work = add_calendar_month(df)
    months_out: list[dict[str, Any]] = []
    for month in iter_billing_months(start_date, end_date):
        mode = bill_mode(month)
        part = work.loc[work["month"] == month]
        if mode == "split" and "season" in part.columns:
            detail = _split_month_overage(
                part, contracts, demand_rates, tou_type, rules=rules
            )
        else:
            detail = calc_month_overage(
                _peaks(part),
                contracts,
                demand_rates,
                tou_type,
                mode,
                rules=rules,
            )
        months_out.append(
            {
                "month": month,
                "bill_mode": mode,
                **detail,
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


def _selfcheck() -> None:
    demand = {
        "base_prices": {"summer": 223.6, "non_summer": 166.9},
        "half_peak_base_prices": {"summer": 166.9, "non_summer": 166.9},
        "saturday_base_prices": {"summer": 44.7, "non_summer": 33.3},
        "off_peak_base_prices": {"summer": 44.7, "non_summer": 33.3},
        "non_summer_base_prices": {"summer": 0.0, "non_summer": 0.0},
    }
    df = pd.DataFrame(
        [
            {
                "date": "2025-10-10",
                "season": "summer",
                "period": "peak",
                "kW": 150.0,
            },
            {
                "date": "2025-10-20",
                "season": "non_summer",
                "period": "half_peak",
                "kW": 80.0,
            },
        ]
    )
    out = calc_overage(
        df,
        {"regular_kw": 100, "half_peak_kw": 0, "saturday_half_peak_kw": 0, "off_peak_kw": 0},
        demand,
        "ThreeStage",
        start_date="2025-10-01",
        end_date="2025-10-31",
    )
    peak = next(r for r in out["months"][0]["periods"] if r["period"] == "peak")
    assert peak["base_rate"] == 223.6
    assert peak["billed_over_kw"] == 50.0
    print("overage selfcheck ok")


if __name__ == "__main__":
    _selfcheck()
