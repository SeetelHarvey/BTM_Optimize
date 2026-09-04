"""契約容量削峰：併網硬上限 + 削峰軟意圖。"""

from app.services.billing.demand import bill_mode
from app.services.billing.overage import overage_ceiling
from app.services.contracts import ContractCapacity


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
    """削峰軟意圖：load 超 cap 時放電使 grid≈cap。"""
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
