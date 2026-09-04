"""緊急備援：鎖住不可調度 kWh（提高 SOC 下限）。"""

from app.services.bess.device import Device

def adjusted_device(device: Device, backup_kwh: float) -> Device:
    """備援保留能量 → 有效 soc_min 上移。"""
    kwh = max(0.0, float(backup_kwh))
    if kwh <= 0 or device.e_nom <= 0:
        return device
    extra = min(device.soc_max - device.soc_min, kwh / device.e_nom)
    if extra <= 0:
        return device
    return Device(
        pcs_kw=device.pcs_kw,
        batt_kwh=device.batt_kwh,
        soc_min=min(device.soc_max, device.soc_min + extra),
        soc_max=device.soc_max,
        charge_eff=device.charge_eff,
        anti_export_kw=device.anti_export_kw,
    )
