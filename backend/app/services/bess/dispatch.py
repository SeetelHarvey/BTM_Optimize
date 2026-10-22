"""編排：各功能獨立算限制／意圖 → 中央仲裁 → device.apply。

優先序：PCS／SOC → 備援 → 防逆送／契約邊界 → 防超約 → TOU → HOLD。
即時備轉不改 ess／grid，另在 settle 層標 reserve_call。
"""

from typing import Any
import pandas as pd

from app.services.bess.device import Device, grid_kw
from app.services.contract_rules import ContractCapacity
from app.services.features import backup, tou
from app.services.features import grid_cap

def _month_key(date_val) -> str:
    return pd.Timestamp(date_val).strftime("%Y-%m")


def _arbitrate(
    *,
    lo: float,
    hi: float,
    tou_desired: float,
    demand_desired: float,
    needs_shave: bool,
) -> float:
    """中央仲裁：防超約優先；否則 TOU；最後夾入硬邊界。"""
    desired = demand_desired if needs_shave else tou_desired
    if lo > hi:
        # 不可行：偏閒置
        return hi if abs(hi) <= abs(lo) else lo
    return max(lo, min(hi, desired))


def run(
    df: pd.DataFrame,
    device: Device,
    settings: dict[str, Any],
    *,
    tou_type: str,
    contracts: dict[str, Any] | ContractCapacity,
    tou_step_minutes: int = 60,
    prices: dict | None = None,
    period_schedule: dict | None = None,
) -> pd.DataFrame:
    """逐列調度；回傳 ess_kw / grid_kw / soc 欄。"""
    if isinstance(contracts, ContractCapacity):
        cap = contracts
    else:
        cap = ContractCapacity.from_dict(contracts)

    functions = set(settings.get("functions") or ["tou"])
    use_backup = "backup" in functions

    buffer_kw = float(settings.get("demandBufferKw") or 0)

    dev = device
    if use_backup:
        dev = backup.adjusted_device(device, float(settings.get("backupReserveKwh") or 0))

    # 唯一 schedule：呼叫端可先 resolve；缺則此處補（保持 run 可單獨測）
    tou_schedule = settings.get("touSchedule")
    if not isinstance(tou_schedule, dict) or not tou_schedule:
        resolved, _meta = tou.resolve_tou_schedule(
            settings,
            tou_type=tou_type,
            prices=prices,
            period_schedule=period_schedule,
            tou_step_minutes=tou_step_minutes,
            soc_min=float(dev.soc_min),
            soc_max=float(dev.soc_max),
            charge_eff=float(dev.charge_eff),
        )
        tou_schedule = resolved.get("touSchedule")

    soc = dev.initial_soc()
    ess_out: list[float] = []
    grid_out: list[float] = []
    soc_out: list[float] = []

    loads = df["kW"].astype(float).to_numpy()
    n = len(df)
    periods = (
        df["period"].astype(object).tolist() if "period" in df.columns else [None] * n
    )
    seasons = (
        df["season"].astype(object).tolist() if "season" in df.columns else [None] * n
    )
    dates = df["date"].tolist() if "date" in df.columns else [None] * n
    timestamps = (
        [pd.Timestamp(x) if x is not None and pd.notna(x) else None for x in df["timestamp"].tolist()]
        if "timestamp" in df.columns
        else [None] * n
    )
    holidays = (
        df["is_holiday"].fillna(False).astype(bool).tolist()
        if "is_holiday" in df.columns
        else [False] * n
    )
    mins = df["min"].tolist() if "min" in df.columns else [None] * n

    for i in range(n):
        load = float(loads[i])
        # 1) PCS／SOC／防逆送
        lo, hi = dev.bounds(soc, load)
        period = periods[i]
        season = seasons[i]
        date_val = dates[i]
        ts = timestamps[i]
        is_hol = bool(holidays[i])
        data_min = int(mins[i]) if mins[i] is not None and pd.notna(mins[i]) else None

        # 2) 運行電網上限（契約 ceiling − 運行裕度）
        month = _month_key(date_val)
        cap_kw = grid_cap.cap_kw_for_row(
            period=period,
            month=month,
            contracts=cap,
            tou_type=tou_type,
            buffer_kw=buffer_kw,
        )
        if cap_kw is not None:
            lo, hi = grid_cap.narrow_grid_cap(lo, hi, load_kw=load, cap_kw=cap_kw)

        # 3–4) 軟意圖：運行削峰／TOU
        tou_out = tou.intent(
            soc=soc,
            e_nom_kwh=dev.e_nom,
            charge_eff=dev.charge_eff,
            season=season,
            date=date_val,
            timestamp=ts,
            is_holiday=is_hol,
            step_minutes=tou_step_minutes,
            data_min=data_min,
            tou_schedule=tou_schedule,
        )
        tou_desired = float(tou_out["desired_ess_kw"])
        d_out = grid_cap.intent(
            load_kw=load,
            period=period,
            month=month,
            contracts=cap,
            tou_type=tou_type,
            buffer_kw=buffer_kw,
        )
        needs_shave = bool(d_out["needs_shave"])
        demand_desired = float(d_out["desired_ess_kw"])

        desired = _arbitrate(
            lo=lo,
            hi=hi,
            tou_desired=tou_desired,
            demand_desired=demand_desired,
            needs_shave=needs_shave,
        )
        ess, soc = dev.apply(desired, soc, load)
        ess_out.append(ess)
        grid_out.append(grid_kw(load, ess))
        soc_out.append(soc)

    out = df.copy()
    out["ess_kw"] = ess_out
    out["grid_kw"] = grid_out
    out["soc"] = soc_out
    return out
