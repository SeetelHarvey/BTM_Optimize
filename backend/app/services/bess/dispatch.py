"""編排：硬 bounds（含併網上限）→ 軟意圖 merge → device.apply。"""

from typing import Any
import pandas as pd

from app.services.bess.device import Device, grid_kw
from app.services.contracts import ContractCapacity
from app.services.features import backup, demand, reserve, tou
from app.services import settings as settings_svc

# ponytail: large_user 義務時段／履約公式未定，暫不進實作集合，勾選只標 skipped
IMPLEMENTED_FUNCTIONS = frozenset(
    {"tou", "demand", "backup", "reserve"}
)


def _month_key(date_val) -> str:
    return pd.Timestamp(date_val).strftime("%Y-%m")


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
    use_reserve = "reserve" in functions and bid_series is not None

    buffer_kw = float(settings.get("demandBufferKw") or 0)
    use_demand = "demand" in functions or buffer_kw > 0
    tou_mode = str(settings.get("touScheduleMode") or "auto")
    tou_schedule = settings.get("touSchedule")
    sched = period_schedule if period_schedule is not None else settings_svc.default_schedule()

    dev = device
    if use_backup:
        dev = backup.adjusted_device(device, float(settings.get("backupReserveKwh") or 0))

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
    hours = df["hour"].tolist() if "hour" in df.columns else [None] * n
    prices_col = (
        df["energy_price"].tolist() if "energy_price" in df.columns else [None] * n
    )

    for i in range(n):
        load = float(loads[i])
        lo, hi = dev.bounds(soc, load)
        period = periods[i]
        season = seasons[i]
        date_val = dates[i]
        ts = timestamps[i]
        is_hol = bool(holidays[i])
        data_min = int(mins[i]) if mins[i] is not None and pd.notna(mins[i]) else None
        hour_v = float(hours[i]) if hours[i] is not None and pd.notna(hours[i]) else None
        energy_price = (
            float(prices_col[i])
            if prices_col[i] is not None and pd.notna(prices_col[i])
            else None
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
            month = _month_key(date_val)
            cap_kw = demand.cap_kw_for_row(
                period=period,
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
            period=period,
            season=season,
            date=date_val,
            timestamp=ts,
            is_holiday=is_hol,
            step_minutes=tou_step_minutes,
            data_min=data_min,
            hour=hour_v,
            tou_schedule=tou_schedule,
            prices=prices,
            energy_price=energy_price,
            period_schedule=sched,
            tou_type=tou_type,
        )
        tou_desired = float(tou_out["desired_ess_kw"])
        needs_shave = False
        demand_desired = 0.0

        if use_demand:
            month = _month_key(date_val)
            d_out = demand.intent(
                load_kw=load,
                period=period,
                month=month,
                contracts=cap,
                tou_type=tou_type,
                buffer_kw=buffer_kw,
            )
            needs_shave = bool(d_out["needs_shave"])
            demand_desired = float(d_out["desired_ess_kw"])

        desired = _merge_soft(tou_desired, demand_desired, needs_shave)
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
