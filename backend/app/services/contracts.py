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


def _grid_residual_stats(disp: Any, periods: frozenset[str]) -> dict[str, float]:
    """調度後指定時段 grid 殘差：月 max／p95／尖峰日日均。"""
    import pandas as pd

    empty = {"max_kw": 0.0, "p95_kw": 0.0, "day_avg_kw": 0.0}
    if disp is None or getattr(disp, "empty", True) or "grid_kw" not in disp.columns:
        return empty
    work = disp
    if "period" in work.columns:
        part = work.loc[work["period"].astype(str).isin(periods)]
        if part.empty:
            return empty
    else:
        part = work
    kw = part["grid_kw"].astype(float)
    if kw.empty:
        return empty
    residual_max = float(kw.max())
    residual_p95 = float(kw.quantile(0.95)) if len(kw) else residual_max
    day_avg = 0.0
    if "date" in part.columns:
        dates = pd.to_datetime(part["date"]).dt.normalize()
        daily_max = kw.groupby(dates).max()
        if len(daily_max):
            top_day = daily_max.idxmax()
            day_avg = float(kw.loc[dates == top_day].mean())
        months = pd.to_datetime(part["date"]).dt.strftime("%Y-%m")
        residual_max = float(kw.groupby(months).max().max())
    return {
        "max_kw": round(residual_max, 1),
        "p95_kw": round(residual_p95, 1),
        "day_avg_kw": round(day_avg, 1),
    }


def suggest_regular_kw_from_dispatch(
    disp: Any,
    *,
    current_regular_kw: float,
    buffer_kw: float = 0.0,
    target_periods: frozenset[str] | None = None,
) -> dict[str, float]:
    """由調度後尖峰 grid 殘差建議經常；並附半尖峰／週六半尖殘差供階層候選。"""
    current = max(0.0, float(current_regular_kw))
    buf = max(0.0, float(buffer_kw))
    # 經常只看尖峰；半尖峰另以 half_peak_* 欄位補契約（勿把半尖併進經常）
    peak_periods = frozenset({"peak"})
    if target_periods is not None and "peak" not in target_periods:
        peak_periods = frozenset(target_periods)
    peak = _grid_residual_stats(disp, peak_periods)
    hp = _grid_residual_stats(disp, frozenset({"half_peak"}))
    sat = _grid_residual_stats(disp, frozenset({"saturday_half_peak"}))
    residual_max = float(peak["max_kw"])
    residual_p95 = float(peak["p95_kw"])
    day_avg = float(peak["day_avg_kw"])
    suggested = min(current, max(0.0, round(residual_max + buf, 1)))
    return {
        "current_regular_kw": round(current, 1),
        "peak_grid_max_kw": residual_max,
        "peak_day_avg_kw": day_avg,
        "peak_grid_p95_kw": residual_p95,
        "half_peak_grid_max_kw": float(hp["max_kw"]),
        "half_peak_day_avg_kw": float(hp["day_avg_kw"]),
        "half_peak_grid_p95_kw": float(hp["p95_kw"]),
        "saturday_half_peak_grid_max_kw": float(sat["max_kw"]),
        "saturday_half_peak_day_avg_kw": float(sat["day_avg_kw"]),
        "saturday_half_peak_grid_p95_kw": float(sat["p95_kw"]),
        "suggested_regular_kw": suggested,
        "reducible_kw": round(max(0.0, current - suggested), 1),
        "buffer_kw": round(buf, 1),
    }


def _residual_metric(residual: dict[str, float], prefix: str, label: str) -> float:
    """階層標籤 → 殘差指標。"""
    if label == "peak_day_avg":
        return float(residual.get(f"{prefix}_day_avg_kw") or 0)
    if label == "p95":
        return float(residual.get(f"{prefix}_grid_p95_kw") or 0)
    if label == "max":
        return float(residual.get(f"{prefix}_grid_max_kw") or 0)
    return 0.0


def hierarchical_contract_candidates(
    base_contracts: dict[str, Any] | ContractCapacity,
    tou_type: str,
    *,
    residual: dict[str, float],
    buffer_kw: float = 0.0,
    apply_free_boost: bool = True,
) -> list[dict[str, Any]]:
    """階層契約候選：降經常 → 半尖峰／週六半尖補齊 → 剩餘轉離峰 → 免費增額。"""
    base = validate(
        base_contracts
        if isinstance(base_contracts, ContractCapacity)
        else ContractCapacity.from_dict(base_contracts),
        tou_type,
    )
    fields = set(schema(tou_type)["fields"])
    current = float(base.regular_kw)
    buf = max(0.0, float(buffer_kw))
    raw_vals = [
        current,
        float(residual.get("peak_day_avg_kw") or 0) + buf,
        float(residual.get("peak_grid_p95_kw") or 0) + buf,
        float(residual.get("peak_grid_max_kw") or 0) + buf,
    ]
    labels = ["current", "peak_day_avg", "p95", "max"]
    seen: set[tuple[float, float, float]] = set()
    out: list[dict[str, Any]] = []
    for label, raw in zip(labels, raw_vals):
        if raw <= 0 and label != "current":
            continue
        r_new = round(min(current, max(0.0, raw)), 1)
        if label == "current":
            hp_new = float(base.half_peak_kw)
            sat_new = float(base.saturday_half_peak_kw)
        else:
            hp_need = _residual_metric(residual, "half_peak", label) + buf
            sat_need = _residual_metric(residual, "saturday_half_peak", label) + buf
            if "half_peak_kw" in fields:
                hp_new = max(0.0, round(hp_need - r_new, 1))
            else:
                hp_new = 0.0
            # 週六半尖上限 = 經常 + tier2 + saturday；tier2 先用 hp_new／non_summer
            t2 = hp_new if "half_peak_kw" in fields else float(base.non_summer_kw)
            if "saturday_half_peak_kw" in fields:
                sat_new = max(0.0, round(sat_need - r_new - t2, 1))
            else:
                sat_new = 0.0

        key = (r_new, round(hp_new, 1), round(sat_new, 1))
        if key in seen:
            continue
        seen.add(key)

        delta_reg = max(0.0, current - r_new)
        hp_raise = max(0.0, hp_new - float(base.half_peak_kw))
        sat_raise = max(0.0, sat_new - float(base.saturday_half_peak_kw))
        # 經常降幅優先補半尖／週六半尖，剩餘才轉離峰
        off_add = max(0.0, delta_reg - hp_raise - sat_raise)

        data = base.to_dict()
        data["regular_kw"] = r_new
        if "half_peak_kw" in fields:
            data["half_peak_kw"] = round(hp_new, 3)
        if "saturday_half_peak_kw" in fields:
            data["saturday_half_peak_kw"] = round(sat_new, 3)
        data["off_peak_kw"] = round(float(base.off_peak_kw) + off_add, 3)
        replaced = validate(ContractCapacity.from_dict(data), tou_type)
        free_kw = free_off_peak_kw(replaced, tou_type) if apply_free_boost else 0.0
        final = with_off_peak_boost(replaced, free_kw, tou_type) if free_kw > 0 else replaced
        out.append(
            {
                "id": label,
                "contracts": final.to_dict(),
                "regular_kw": r_new,
                "half_peak_kw": round(float(final.half_peak_kw), 3),
                "half_peak_delta_kw": round(float(final.half_peak_kw) - float(base.half_peak_kw), 3),
                "saturday_half_peak_kw": round(float(final.saturday_half_peak_kw), 3),
                "saturday_half_peak_delta_kw": round(
                    float(final.saturday_half_peak_kw) - float(base.saturday_half_peak_kw), 3
                ),
                "off_peak_replaced_kw": round(off_add, 3),
                "free_off_peak_added_kw": round(free_kw, 3),
                "regular_delta_kw": round(delta_reg, 3),
            }
        )
    return out


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
