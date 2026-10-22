"""數值階梯（量體／契約共用）。"""

import math

SIZE_STEP = 10

def ceil_to_step(x: float, step: float = SIZE_STEP) -> float:
    """向上取至 step 的倍數（step=10 等同 CEILING(x, 10)）。"""
    v = float(x)
    s = float(step)
    if v <= 0 or s <= 0:
        return 0.0
    return float(math.ceil(v / s - 1e-12) * s)
