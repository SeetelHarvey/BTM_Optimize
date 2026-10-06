"""契約容量削峰：併網硬上限 + 削峰軟意圖。"""

from typing import Any

from app.services.billing.demand import bill_mode
from app.services.billing.overage import overage_ceiling
from app.services.contracts import ContractCapacity
from app.services.quantize import ceil_to_step


def ceiling_for_row(
    *,
    period: str,
    month: str,
    contracts: ContractCapacity,
    tou_type: str,
) -> float:
    """本列時段之超約比對上限。"""
    mode = bill_mode(month)
    return float(overage_ceiling(period, contracts, tou_type, mode))


def regular_kw_of(contracts: Any) -> float:
    """經常契約 kW（dict 或 ContractCapacity）。"""
    if isinstance(contracts, ContractCapacity):
        return max(0.0, float(contracts.regular_kw or 0))
    if isinstance(contracts, dict):
        return max(0.0, float(contracts.get("regular_kw") or 0))
    return 0.0


def suggested_buffer_kw(contract_kw: float, settings: dict) -> float:
    """建議預留＝經常契約 × 預留比例，向上取 10。"""
    pct = max(0.0, float(settings.get("bufferPct") or 0))
    raw = max(0.0, float(contract_kw)) * pct / 100.0
    return ceil_to_step(raw)


def resolve_buffer_kw(
    settings: dict,
    *,
    contract_kw: float = 0.0,
    key: str = "demandBufferKw",
) -> float:
    """使用者填寫的 kW 優先（向上取 10）；缺欄才用契約×比例建議值。"""
    if key in settings and settings.get(key) is not None and settings.get(key) != "":
        return ceil_to_step(max(0.0, float(settings[key])))
    return suggested_buffer_kw(contract_kw, settings)


def seed_buffer_kw(settings: dict, *, contract_kw: float = 0.0) -> float:
    """選量體／契約調整用的防超約預留。"""
    return resolve_buffer_kw(settings, contract_kw=contract_kw, key="demandBufferKw")


def scaled_buffer_kw(contract_kw: float, settings: dict) -> float:
    """防超約預留 kW（契約×比例或使用者 demandBufferKw）。"""
    return resolve_buffer_kw(settings, contract_kw=contract_kw, key="demandBufferKw")


def cap_kw_for_row(
    *,
    period: str | None,
    month: str,
    contracts: ContractCapacity,
    tou_type: str,
    buffer_kw: float = 0.0,
) -> float | None:
    """併網允許上限（契約累計 − 裕度）；無時段則 None。"""
    if period is None:
        return None
    ceiling = ceiling_for_row(
        period=str(period),
        month=month,
        contracts=contracts,
        tou_type=tou_type,
    )
    return max(0.0, ceiling - float(buffer_kw))


def narrow_grid_cap(
    lo: float,
    hi: float,
    *,
    load_kw: float,
    cap_kw: float,
) -> tuple[float, float]:
    """併網硬限制：grid=load+ess 不得超 cap → ess <= cap − load。"""
    return lo, min(hi, float(cap_kw) - float(load_kw))


def intent(
    *,
    load_kw: float,
    period: str | None,
    month: str,
    contracts: ContractCapacity,
    tou_type: str,
    buffer_kw: float = 0.0,
) -> dict[str, float | bool]:
    """削峰軟意圖：load 超 cap 時放電使 grid≈cap；未超則不動作。"""
    if period is None:
        return {"needs_shave": False, "desired_ess_kw": 0.0, "ceiling_kw": 0.0, "cap_kw": 0.0}
    ceiling = ceiling_for_row(
        period=str(period),
        month=month,
        contracts=contracts,
        tou_type=tou_type,
    )
    cap = max(0.0, ceiling - float(buffer_kw))
    load = float(load_kw)
    if load <= cap:
        return {
            "needs_shave": False,
            "desired_ess_kw": 0.0,
            "ceiling_kw": ceiling,
            "cap_kw": cap,
        }
    return {
        "needs_shave": True,
        "desired_ess_kw": cap - load,
        "ceiling_kw": ceiling,
        "cap_kw": cap,
    }
