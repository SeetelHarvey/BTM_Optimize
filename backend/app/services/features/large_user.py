"""用電大戶：硬約束占位。"""

def narrow_bounds(
    lo: float,
    hi: float,
    *,
    enabled: bool,
    load_kw: float,
    period: str | None,
    obligation_kw: float,
) -> tuple[float, float]:
    """義務時段放電下限（簡化：尖峰且 load 低於義務時鼓勵放電）。"""
    if not enabled or obligation_kw <= 0 or period != "peak":
        return lo, hi
    if float(load_kw) >= obligation_kw:
        return lo, hi
    # 至少放至義務（ess 使 grid 接近 obligation，簡化為 ess 下限）
    need = obligation_kw - float(load_kw)
    lo = max(lo, -need)
    return lo, hi


def obligation_kw(regular_kw: float, ratio: float, power_ratio: float) -> float:
    """義務功率 kW。"""
    return max(0.0, float(regular_kw) * float(ratio) * float(power_ratio))
