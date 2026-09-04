"""BESS 裝置物理：PCS／SOC／效率／不逆送；一條電網側 ess_kw。"""

from dataclasses import dataclass
from app.services.schedule import hours_per_data_row


def _clamp(x: float, lo: float, hi: float) -> float:
    if lo > hi:
        return (lo + hi) / 2.0
    return max(lo, min(hi, x))


@dataclass(frozen=True)
class Device:
    """PCS＋Battery 物理可行性。"""

    pcs_kw: float
    batt_kwh: float
    soc_min: float
    soc_max: float
    charge_eff: float
    anti_export_kw: float = 0.0

    def __post_init__(self) -> None:
        if self.pcs_kw < 0:
            raise ValueError("pcs_kw must be >= 0")
        if self.batt_kwh <= 0:
            raise ValueError("batt_kwh must be > 0")
        if not (0 <= self.soc_min <= self.soc_max <= 1):
            raise ValueError("need 0 <= soc_min <= soc_max <= 1")
        if not (0 < self.charge_eff <= 1):
            raise ValueError("charge_eff must be in (0, 1]")

    @property
    def e_nom(self) -> float:
        """名目庫存 kWh。"""
        return self.batt_kwh

    def initial_soc(self) -> float:
        """預設從 SOC 窗中點起。"""
        mid = (self.soc_min + self.soc_max) / 2.0
        return _clamp(mid, self.soc_min, self.soc_max)

    def bounds(self, soc: float, load_kw: float) -> tuple[float, float]:
        """本步可行 ess_kw 區間 [lo, hi]（AC／電網側）。"""
        dt = hours_per_data_row()
        eta = self.charge_eff
        e_nom = self.e_nom
        pcs = self.pcs_kw

        # 充電上限：SOC 升到 soc_max
        room_up = max(0.0, self.soc_max - soc)
        charge_cap = (room_up * e_nom) / (dt * eta) if eta > 0 else 0.0
        # 放電上限：SOC 降到 soc_min（電網側 |ess|）
        room_dn = max(0.0, soc - self.soc_min)
        discharge_cap = (room_dn * e_nom * eta) / dt

        # 不逆送：load + ess >= anti_export → ess >= anti_export - load
        ess_floor = self.anti_export_kw - float(load_kw)

        lo = max(-pcs, -discharge_cap, ess_floor)
        hi = min(pcs, charge_cap)
        return lo, hi

    def apply(
        self,
        desired_ess_kw: float,
        soc: float,
        load_kw: float,
    ) -> tuple[float, float]:
        """夾到可行區間並更新 SOC；回傳 (ess_kw, soc_next)。"""
        lo, hi = self.bounds(soc, load_kw)
        ess = _clamp(float(desired_ess_kw), lo, hi)
        dt = hours_per_data_row()
        eta = self.charge_eff
        e_nom = self.e_nom
        if ess > 0:
            d_soc = (ess * dt * eta) / e_nom
        elif ess < 0:
            d_soc = -((-ess) * dt / eta) / e_nom
        else:
            d_soc = 0.0
        soc_next = _clamp(soc + d_soc, self.soc_min, self.soc_max)
        return ess, soc_next


def grid_kw(load_kw: float, ess_kw: float) -> float:
    """電網需量 = 負載 + ESS（充電為正）。"""
    return float(load_kw) + float(ess_kw)
