"""編排：硬 bounds（含併網上限）→ 軟意圖 merge → device.apply。"""

from typing import Any
import pandas as pd

from app.services.bess.device import Device, grid_kw
from app.services.contracts import ContractCapacity
from app.services.features import backup, demand, large_user, reserve, tou
from app.services import settings as settings_svc

IMPLEMENTED_FUNCTIONS = frozenset(
    {"tou", "demand", "backup", "large_user", "reserve"}
)


def _month_key(date_val) -> str:
    return pd.Timestamp(date_val).strftime("%Y-%m")


def _remaining_peak_steps(df: pd.DataFrame, start: int) -> int:
    if start >= len(df):
        return 0
    row = df.iloc[start]
    day = row.get("date")
    n = 0
    for j in range(start, len(df)):
        r = df.iloc[j]
        if r.get("date") != day:
            break
        if r.get("period") == "peak":
            n += 1
    return max(1, n)


def skipped_functions(functions: list[str] | None) -> list[str]:
    """勾選但未實作的功能。"""
    fns = list(functions or ["tou"])
    return sorted(f for f in fns if f not in IMPLEMENTED_FUNCTIONS)


def _merge_soft(
    tou_desired: float,
    demand_desired: float,
    needs_shave: bool,
) -> float:
    """削峰優先，否則 TOU 意圖。"""
    if needs_shave:
        return demand_desired
    return tou_desired


def run(
    df: pd.DataFrame,
    device: Device,
    settings: dict[str, Any],
    *,
    tou_type: str,
    contracts: dict[str, Any] | ContractCapacity,
    tou_step_minutes: int = 60,
    bid_series: pd.Series | None = None,
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
    use_large = "large_user" in functions
    use_reserve = "reserve" in functions and bid_series is not None
    # 有實際得標才均分尖峰放電；勾選備轉但 bid 全 0（含 auto）不改變 TOU
    peak_ration = bool(use_reserve and bid_series is not None and (bid_series.fillna(0) > 0).any())

    buffer_kw = float(settings.get("demandBufferKw") or 0)
    use_demand = "demand" in functions or buffer_kw > 0
    tou_mode = str(settings.get("touScheduleMode") or "auto")
    tou_schedule = settings.get("touSchedule")
    sched = period_schedule if period_schedule is not None else settings_svc.default_schedule()

    dev = device
    if use_backup:
        dev = backup.adjusted_device(device, float(settings.get("backupReserveKwh") or 0))

    obl_kw = 0.0
    if use_large:
        obl_kw = large_user.obligation_kw(
            cap.regular_kw,
            float(settings.get("largeUserRatio") or 0),
            float(settings.get("largeUserPowerRatio") or 0.8),
        )

    soc = dev.initial_soc()
    ess_out: list[float] = []
    grid_out: list[float] = []
    soc_out: list[float] = []

    for i in range(len(df)):
        row = df.iloc[i]
        load = float(row["kW"])
        lo, hi = dev.bounds(soc, load)

        if use_large:
            lo, hi = large_user.narrow_bounds(
                lo,
                hi,
                enabled=True,
                load_kw=load,
                period=row.get("period"),
                obligation_kw=obl_kw,
            )

        if use_reserve and bid_series is not None:
            bid_mw = float(bid_series.iloc[i])
            lo, hi = reserve.hard_occupy(lo, hi, bid_mw, dev.pcs_kw)
            lo, hi = reserve.narrow_standby_soc(
                lo,
                hi,
                soc=soc,
                bid_mw=bid_mw,
                device=dev,
            )

        cap_kw = None
        if use_demand:
            month = _month_key(row["date"])
            cap_kw = demand.cap_kw_for_row(
                period=row.get("period"),
                month=month,
                contracts=cap,
                tou_type=tou_type,
                buffer_kw=buffer_kw,
            )
            if cap_kw is not None:
                lo, hi = demand.narrow_grid_cap(lo, hi, load_kw=load, cap_kw=cap_kw)

        tou_out = tou.intent(
            soc=soc,
            e_nom_kwh=dev.e_nom,
            charge_eff=dev.charge_eff,
            mode=tou_mode,
            period=row.get("period"),
            season=row.get("season"),
            timestamp=row.get("timestamp"),
            is_holiday=bool(row.get("is_holiday", False)),
            step_minutes=tou_step_minutes,
            data_min=int(row["min"]) if "min" in row.index and pd.notna(row["min"]) else None,
            hour=float(row["hour"]) if "hour" in row.index and pd.notna(row.get("hour")) else None,
            tou_schedule=tou_schedule,
            prices=prices,
            energy_price=float(row["energy_price"])
            if "energy_price" in row.index and pd.notna(row.get("energy_price"))
            else None,
            period_schedule=sched,
            tou_type=tou_type,
        )
        tou_desired = float(tou_out["desired_ess_kw"])
        needs_shave = False
        demand_desired = 0.0

        if use_demand:
            month = _month_key(row["date"])
            d_out = demand.intent(
                load_kw=load,
                period=row.get("period"),
                month=month,
                contracts=cap,
                tou_type=tou_type,
                buffer_kw=buffer_kw,
            )
            needs_shave = bool(d_out["needs_shave"])
            demand_desired = float(d_out["desired_ess_kw"])

        desired = _merge_soft(tou_desired, demand_desired, needs_shave)

        if peak_ration and row.get("period") == "peak" and desired < 0:
            desired = tou.ration_peak_discharge(
                desired,
                soc=soc,
                soc_min=dev.soc_min,
                e_nom_kwh=dev.e_nom,
                charge_eff=dev.charge_eff,
                remaining_peak_steps=_remaining_peak_steps(df, i),
            )

        desired = max(lo, min(hi, desired))
        ess, soc = dev.apply(desired, soc, load)
        ess_out.append(ess)
        grid_out.append(grid_kw(load, ess))
        soc_out.append(soc)

    out = df.copy()
    out["ess_kw"] = ess_out
    out["grid_kw"] = grid_out
    out["soc"] = soc_out
    return out
