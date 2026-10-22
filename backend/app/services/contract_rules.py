"""契約容量、基本電費、超約規則。"""

from dataclasses import asdict, dataclass
from typing import Any

from app.services import settings as settings_svc
from app.services.quantize import ceil_to_step

CONTRACT_PROFILES: dict[str, dict[str, Any]] = {
    "ThreeStage": {
        "tier2_field": "half_peak_kw",
        "fields": [
            "regular_kw",
            "half_peak_kw",
            "saturday_half_peak_kw",
            "off_peak_kw",
        ],
        "forbidden": ("non_summer_kw",),
    },
    "TwoStage": {
        "tier2_field": "non_summer_kw",
        "fields": [
            "regular_kw",
            "non_summer_kw",
            "saturday_half_peak_kw",
            "off_peak_kw",
        ],
        "forbidden": ("half_peak_kw",),
    },
    "BatchStage": {
        "tier2_field": "non_summer_kw",
        "fields": [
            "regular_kw",
            "non_summer_kw",
            "saturday_half_peak_kw",
            "off_peak_kw",
        ],
        "forbidden": ("half_peak_kw",),
    },
}


@dataclass
class ContractCapacity:
    regular_kw: float
    half_peak_kw: float = 0.0
    saturday_half_peak_kw: float = 0.0
    off_peak_kw: float = 0.0
    non_summer_kw: float = 0.0

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ContractCapacity":
        return cls(
            regular_kw=float(data.get("regular_kw", 0)),
            half_peak_kw=float(data.get("half_peak_kw", 0)),
            saturday_half_peak_kw=float(data.get("saturday_half_peak_kw", 0)),
            off_peak_kw=float(data.get("off_peak_kw", 0)),
            non_summer_kw=float(data.get("non_summer_kw", 0)),
        )

    def to_dict(self) -> dict[str, float]:
        return asdict(self)


def tier2_kw(contracts: ContractCapacity) -> float:
    """半尖峰 + 非夏月。"""
    return contracts.half_peak_kw + contracts.non_summer_kw


def cumulative_ceiling(period: str, contracts: ContractCapacity) -> float:
    """各時段累計契約上限。"""
    t2 = tier2_kw(contracts)
    if period == "peak":
        return contracts.regular_kw
    if period == "half_peak":
        return contracts.regular_kw + contracts.half_peak_kw
    if period == "saturday_half_peak":
        return contracts.regular_kw + t2 + contracts.saturday_half_peak_kw
    if period == "off_peak":
        return (
            contracts.regular_kw
            + t2
            + contracts.saturday_half_peak_kw
            + contracts.off_peak_kw
        )
    raise ValueError(f"unknown period: {period!r}")


def schema(tou_type: str) -> dict[str, Any]:
    """該方案可填的契約欄位。"""
    if tou_type not in CONTRACT_PROFILES:
        raise ValueError(f"unknown tou_type: {tou_type!r}")
    profile = CONTRACT_PROFILES[tou_type]
    return {
        "tou_type": tou_type,
        "fields": list(profile["fields"]),
        "tier2_field": profile["tier2_field"],
        "forbidden": list(profile["forbidden"]),
    }


def all_schemas() -> dict[str, dict[str, Any]]:
    """各方案契約欄位。"""
    return {tou: schema(tou) for tou in CONTRACT_PROFILES}


def validate(contracts: ContractCapacity, tou_type: str) -> ContractCapacity:
    """驗證並正規化契約。"""
    profile = schema(tou_type)
    if contracts.regular_kw <= 0:
        raise ValueError("regular_kw must be > 0")

    data = contracts.to_dict()
    for key in profile["forbidden"]:
        data[key] = 0.0

    normalized = ContractCapacity.from_dict(data)
    if normalized.half_peak_kw > 0 and normalized.non_summer_kw > 0:
        raise ValueError("half_peak_kw and non_summer_kw are mutually exclusive")

    for key in (
        "half_peak_kw",
        "saturday_half_peak_kw",
        "off_peak_kw",
        "non_summer_kw",
    ):
        if getattr(normalized, key) < 0:
            raise ValueError(f"{key} must be >= 0")

    return normalized


def money(x: float) -> int:
    """金額四捨五入到整數。"""
    v = float(x or 0)
    return int(v + 0.5) if v >= 0 else int(v - 0.5)


def _rate(demand_rates: dict, key: str, bill_season: str) -> float:
    return float(demand_rates[key][bill_season])


def allowance_kw(contracts: ContractCapacity, tou_type: str) -> float:
    """容許額度 kW：(經常+次段)×50% − (週六半尖+離峰)；額度內不計該段基本費。"""
    c = validate(contracts, tou_type)
    allowance = (c.regular_kw + tier2_kw(c)) * 0.5
    used = c.saturday_half_peak_kw + c.off_peak_kw
    return max(0.0, round(allowance - used, 3))


def _period_max_kw(
    disp: Any,
    periods: frozenset[str],
    *,
    season: str | None = None,
) -> float:
    """調度後指定時段 grid 最大（有日期時：各月 max 再取最大）。"""
    import pandas as pd

    if disp is None or getattr(disp, "empty", True) or "grid_kw" not in disp.columns:
        return 0.0
    work = disp
    if "period" in work.columns:
        part = work.loc[work["period"].astype(str).isin(periods)]
        if part.empty:
            return 0.0
    else:
        part = work
    if season is not None and "season" in part.columns:
        part = part.loc[part["season"].astype(str) == season]
        if part.empty:
            return 0.0
    kw = part["grid_kw"].astype(float)
    if kw.empty:
        return 0.0
    if "date" in part.columns:
        months = pd.to_datetime(part["date"]).dt.strftime("%Y-%m")
        return round(float(kw.groupby(months).max().max()), 1)
    return round(float(kw.max()), 1)


def suggest_regular_kw_from_dispatch(
    disp: Any,
    *,
    current_regular_kw: float,
    buffer_kw: float = 0.0,
    target_periods: frozenset[str] | None = None,
) -> dict[str, float]:
    """整理契約重配所需的各時段調度後最大值。"""
    current = max(0.0, float(current_regular_kw))
    buf = max(0.0, float(buffer_kw))
    peak_periods = frozenset({"peak"})
    if target_periods is not None and "peak" not in target_periods:
        peak_periods = frozenset(target_periods)
    peak_max = _period_max_kw(disp, peak_periods)
    hp_max = _period_max_kw(disp, frozenset({"half_peak"}))
    non_summer_max = _period_max_kw(
        disp, frozenset({"peak"}), season="non_summer"
    )
    sat_max = _period_max_kw(disp, frozenset({"saturday_half_peak"}))
    off_max = _period_max_kw(disp, frozenset({"off_peak"}))
    floor_kw = max(10.0, ceil_to_step(peak_max + buf))
    return {
        "current_regular_kw": round(current, 1),
        "peak_grid_max_kw": peak_max,
        "half_peak_grid_max_kw": hp_max,
        "non_summer_grid_max_kw": non_summer_max,
        "saturday_half_peak_grid_max_kw": sat_max,
        "off_peak_grid_max_kw": off_max,
        "floor_regular_kw": round(floor_kw, 1),
        "suggested_regular_kw": round(floor_kw, 1),
        "reducible_kw": round(max(0.0, current - floor_kw), 1),
        "buffer_kw": round(buf, 1),
    }


def rule_based_contract_proposal(
    base_contracts: dict[str, Any] | ContractCapacity,
    tou_type: str,
    *,
    residual: dict[str, float],
    buffer_kw: float = 0.0,
) -> dict[str, Any]:
    """依四層累計規則產生唯一契約提案。"""
    base = validate(
        base_contracts
        if isinstance(base_contracts, ContractCapacity)
        else ContractCapacity.from_dict(base_contracts),
        tou_type,
    )
    profile = schema(tou_type)
    tier2_field = str(profile["tier2_field"])
    buf = max(0.0, float(buffer_kw))
    original_total = round(
        float(base.regular_kw)
        + tier2_kw(base)
        + float(base.saturday_half_peak_kw)
        + float(base.off_peak_kw),
        3,
    )
    peak_max = float(residual.get("peak_grid_max_kw") or 0)
    tier2_max_key = (
        "half_peak_grid_max_kw"
        if tier2_field == "half_peak_kw"
        else "non_summer_grid_max_kw"
    )
    tier2_max = float(residual.get(tier2_max_key) or 0)
    sat_max = float(residual.get("saturday_half_peak_grid_max_kw") or 0)

    regular = max(10.0, ceil_to_step(peak_max + buf))
    tier2_demand = ceil_to_step(tier2_max)
    tier2_ceiling = max(regular, min(tier2_demand, original_total))
    tier2 = max(0.0, tier2_ceiling - regular)
    free_total = round(tier2_ceiling * 0.5, 3)
    saturday_demand = ceil_to_step(sat_max)
    saturday_ceiling = max(
        tier2_ceiling,
        saturday_demand,
        tier2_ceiling + free_total,
    )
    saturday = max(0.0, saturday_ceiling - tier2_ceiling)
    off_peak_demand = ceil_to_step(
        float(residual.get("off_peak_grid_max_kw") or 0)
    )
    off_peak_ceiling = max(saturday_ceiling, off_peak_demand)
    off_peak = max(0.0, off_peak_ceiling - saturday_ceiling)

    data = base.to_dict()
    data.update(
        {
            "regular_kw": regular,
            tier2_field: tier2,
            "saturday_half_peak_kw": saturday,
            "off_peak_kw": off_peak,
        }
    )
    final = validate(ContractCapacity.from_dict(data), tou_type)
    lower_used = round(final.saturday_half_peak_kw + final.off_peak_kw, 3)
    free_used = min(free_total, lower_used)
    return {
        "id": "rule",
        "contracts": final.to_dict(),
        "regular_kw": round(final.regular_kw, 3),
        "half_peak_delta_kw": round(final.half_peak_kw - base.half_peak_kw, 3),
        "saturday_half_peak_delta_kw": round(
            final.saturday_half_peak_kw - base.saturday_half_peak_kw, 3
        ),
        "off_peak_added_kw": round(final.off_peak_kw - base.off_peak_kw, 3),
        "allowance_added_kw": round(free_used, 3),
        "allowance_kw": allowance_kw(final, tou_type),
        "original_total_kw": original_total,
        "free_allowance_total_kw": free_total,
        "free_allowance_used_kw": round(free_used, 3),
        "billable_lower_kw": round(max(0.0, lower_used - free_total), 3),
        "basis": [
            {
                "period": "peak",
                "max_grid_kw": round(peak_max, 3),
                "buffer_kw": round(buf, 3),
                "demand_ceiling_kw": round(regular, 3),
                "contract_kw": round(final.regular_kw, 3),
            },
            {
                "period": tier2_field.removesuffix("_kw"),
                "max_grid_kw": round(tier2_max, 3),
                "buffer_kw": 0.0,
                "demand_ceiling_kw": round(tier2_demand, 3),
                "contract_ceiling_kw": round(tier2_ceiling, 3),
                "contract_kw": round(tier2, 3),
            },
            {
                "period": "saturday_half_peak",
                "max_grid_kw": round(sat_max, 3),
                "buffer_kw": 0.0,
                "demand_ceiling_kw": round(saturday_demand, 3),
                "contract_ceiling_kw": round(saturday_ceiling, 3),
                "contract_kw": round(saturday, 3),
            },
            {
                "period": "off_peak",
                "max_grid_kw": float(residual.get("off_peak_grid_max_kw") or 0),
                "buffer_kw": 0.0,
                "demand_ceiling_kw": round(off_peak_demand, 3),
                "contract_ceiling_kw": round(off_peak_ceiling, 3),
                "contract_kw": round(off_peak, 3),
            },
        ],
    }


def _saturday_off_peak_billable_kw(contracts: ContractCapacity) -> float:
    """週六+離峰計費瓩數。"""
    raw = (
        contracts.saturday_half_peak_kw
        + contracts.off_peak_kw
        - (contracts.regular_kw + tier2_kw(contracts)) * 0.5
    )
    return max(0.0, raw)


def calc_basic_charge_lines(
    contracts: ContractCapacity,
    demand_rates: dict,
    bill_season: str,
    tou_type: str,
) -> dict[str, Any]:
    """單季基本電費明細。"""
    contracts = validate(contracts, tou_type)
    c = contracts
    lines: list[dict[str, Any]] = []

    def add(
        component: str,
        kw: float,
        rate: float,
        amount: float,
        *,
        contract_kw: float | None = None,
    ) -> None:
        row: dict[str, Any] = {
            "component": component,
            "kw": kw,
            "rate": rate,
            "amount": float(amount),
        }
        if contract_kw is not None:
            row["contract_kw"] = contract_kw
        lines.append(row)

    r_base = _rate(demand_rates, "base_prices", bill_season)
    add("regular", c.regular_kw, r_base, r_base * c.regular_kw)

    if tou_type == "ThreeStage":
        r_half = _rate(demand_rates, "half_peak_base_prices", bill_season)
        add("half_peak", c.half_peak_kw, r_half, r_half * c.half_peak_kw)

        # 台電：週六半尖峰或離峰契約電價 × max(0, sat+off − (regular+half)×0.5)
        r_sat_off = _rate(demand_rates, "saturday_base_prices", bill_season)
        contract_kw = c.saturday_half_peak_kw + c.off_peak_kw
        billable = _saturday_off_peak_billable_kw(c)
        add(
            "saturday_off_peak",
            billable,
            r_sat_off,
            r_sat_off * billable,
            contract_kw=contract_kw,
        )

    elif tou_type in ("TwoStage", "BatchStage"):
        r_ns = _rate(demand_rates, "non_summer_base_prices", bill_season)
        add("non_summer", c.non_summer_kw, r_ns, r_ns * c.non_summer_kw)

        r_sat_off = _rate(demand_rates, "saturday_base_prices", bill_season)
        contract_kw = c.saturday_half_peak_kw + c.off_peak_kw
        billable = _saturday_off_peak_billable_kw(c)
        add(
            "saturday_off_peak",
            billable,
            r_sat_off,
            r_sat_off * billable,
            contract_kw=contract_kw,
        )

    else:
        raise ValueError(f"unknown tou_type: {tou_type!r}")

    total = sum(line["amount"] for line in lines)
    return {"lines": lines, "total": total, "bill_season": bill_season}


def overage_tiers(rules: dict | None = None) -> list[dict[str, Any]]:
    """超約分段倍率。"""
    if rules is None:
        rules = settings_svc.default_overage_rules()
    return list(rules["tiers"])
