"""契約容量、基本電費、超約規則。"""

from dataclasses import asdict, dataclass
from typing import Any

from app.services import settings as settings_svc

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


def free_off_peak_kw(contracts: ContractCapacity, tou_type: str) -> float:
    """不增加基本電費可增離峰契約 kW。"""
    c = validate(contracts, tou_type)
    allowance = (c.regular_kw + tier2_kw(c)) * 0.5
    used = c.saturday_half_peak_kw + c.off_peak_kw
    return max(0.0, round(allowance - used, 3))


def with_off_peak_boost(
    contracts: ContractCapacity,
    add_kw: float,
    tou_type: str,
) -> ContractCapacity:
    """離峰契約加 kW（試算用，不改 session）。"""
    c = validate(contracts, tou_type)
    data = c.to_dict()
    data["off_peak_kw"] = round(float(data["off_peak_kw"]) + float(add_kw), 3)
    return validate(ContractCapacity.from_dict(data), tou_type)


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
