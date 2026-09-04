"""時間電價：auto／manual 目標 SOC → 軟意圖 ess_kw。

auto 策略（非寫死時段名）：
1. 價差須蓋過往返損耗：P_hi/P_lo ≥ 1/η²，否則不為流動電費循環。
2. 當季最高／最低：過門檻則放電(0)／充電(1)。
3. 中價：看下一個相鄰時段電價——next 更貴且過門檻則充(1)；否則維持(HOLD)。
"""

from typing import Any

from app.services.schedule import hours_per_data_row

HOLD = None  # 維持 SOC，不充不放

# 時段矩陣日鍵：跨日 look-ahead（weekday 模板當週一～四／五夜間皆接下一日離峰起點）
_NEXT_DAY_KEY = {
    "weekday": "weekday",
    "saturday": "sunday",
    "sunday": "weekday",
}


def _as_soc01(v: Any, fallback: float = 0.5) -> float:
    """手動矩陣為 0–100百分比；後端統一 0–1 小數。"""
    try:
        x = float(v)
    except (TypeError, ValueError):
        return max(0.0, min(1.0, fallback))
    if x > 1.0:
        x = x / 100.0
    return max(0.0, min(1.0, x))


def _manual_cell_hold(v: Any) -> bool:
    """空白／null＝維持（對齊 auto HOLD）。"""
    if v is None:
        return True
    if isinstance(v, str) and not v.strip():
        return True
    return False


def schedule_day_key(ts, *, is_holiday: bool = False) -> str:
    """對齊前端矩陣：weekday／saturday／sunday（假日當 sunday）。"""
    if is_holiday:
        return "sunday"
    wd = int(ts.weekday()) if hasattr(ts, "weekday") else int(ts)
    if wd == 5:
        return "saturday"
    if wd == 6:
        return "sunday"
    return "weekday"


def slot_index(
    ts=None,
    *,
    step_minutes: int = 60,
    data_min: int | None = None,
) -> int:
    """當日時段槽：優先用資料列 min(0–95)，否則用 timestamp。"""
    step = int(step_minutes) or 60
    per = max(1, step // 15)
    if data_min is not None:
        return max(0, int(data_min) // per)
    if ts is None:
        return 0
    minutes = int(ts.hour) * 60 + int(ts.minute)
    if minutes == 0:
        min15 = 95
    else:
        min15 = (minutes - 15) // 15
    return max(0, min15 // per)


def row_hour(
    *,
    hour: float | int | None = None,
    data_min: int | None = None,
    timestamp=None,
) -> float | None:
    """列所屬整點（對齊 tpc interval-end 的 hour）。"""
    if hour is not None:
        return float(hour)
    if data_min is not None:
        return float(int(data_min) // 4)
    if timestamp is not None:
        return float(int(timestamp.hour)) + float(getattr(timestamp, "minute", 0) or 0) / 60.0
    return None


def worth_arbitrage(p_hi: float, p_lo: float, charge_eff: float) -> bool:
    """價差是否蓋過 η² 往返損耗。"""
    try:
        hi = float(p_hi)
        lo = float(p_lo)
        eta = float(charge_eff)
    except (TypeError, ValueError):
        return False
    if hi <= 0 or lo <= 0 or eta <= 0:
        return False
    return hi / lo >= 1.0 / (eta * eta)


def next_period(
    schedule: dict | None,
    tou_type: str | None,
    *,
    season: str,
    day_key: str,
    hour: float,
) -> str | None:
    """下一個相鄰時段名稱（同日下一段，或跨日首段）。"""
    if not schedule or not tou_type:
        return None
    block = (schedule.get(tou_type) or {}).get(season)
    if not isinstance(block, dict):
        return None
    segs = list(block.get(day_key) or [])
    if not segs:
        return None
    h = float(hour)
    idx = None
    for i, seg in enumerate(segs):
        start = float(seg["start"])
        end = float(seg["end"])
        if start <= h < end:
            idx = i
            break
    if idx is None:
        # 落在最後一段終點附近（例如 h=24）
        if h >= float(segs[-1]["start"]):
            idx = len(segs) - 1
        else:
            return None
    if idx + 1 < len(segs):
        return str(segs[idx + 1]["period"])
    nxt_key = _NEXT_DAY_KEY.get(day_key)
    nxt = list(block.get(nxt_key) or []) if nxt_key else []
    return str(nxt[0]["period"]) if nxt else None


def auto_target_soc(
    *,
    season: str | None,
    period: str | None,
    prices: dict | None,
    energy_price: float | None = None,
    charge_eff: float = 0.85,
    next_period_name: str | None = None,
) -> float | None:
    """auto：效率門檻 + 高低價；中價依下一相鄰時段決定充／維持。"""
    if season is None or period is None or not prices:
        return HOLD
    season_prices = prices.get(season)
    if not isinstance(season_prices, dict) or period not in season_prices:
        return HOLD
    vals = [float(v) for v in season_prices.values() if v is not None]
    if not vals:
        return HOLD
    p_min = min(vals)
    p_max = max(vals)
    if p_max <= p_min:
        return HOLD
    try:
        price = float(
            energy_price
            if energy_price is not None
            else season_prices[period]
        )
    except (TypeError, ValueError):
        return HOLD

    if price >= p_max:
        return 0.0 if worth_arbitrage(p_max, p_min, charge_eff) else HOLD
    if price <= p_min:
        return 1.0 if worth_arbitrage(p_max, p_min, charge_eff) else HOLD

    # 中價：僅當下一時段更貴且過門檻才預充電
    if not next_period_name or next_period_name not in season_prices:
        return HOLD
    try:
        next_price = float(season_prices[next_period_name])
    except (TypeError, ValueError):
        return HOLD
    if next_price > price and worth_arbitrage(next_price, price, charge_eff):
        return 1.0
    return HOLD


def target_soc(
    *,
    mode: str,
    period: str | None,
    season: str | None = None,
    day_key: str | None = None,
    slot: int | None = None,
    tou_schedule: dict | None = None,
    prices: dict | None = None,
    energy_price: float | None = None,
    charge_eff: float = 0.85,
    next_period_name: str | None = None,
) -> float | None:
    """解析本步目標 SOC（0–1）；auto／manual 空白＝HOLD。"""
    mode = (mode or "auto").lower()

    if mode == "manual" and tou_schedule and season and day_key is not None and slot is not None:
        row = ((tou_schedule.get(season) or {}).get(day_key)) or []
        if 0 <= int(slot) < len(row):
            cell = row[int(slot)]
            if _manual_cell_hold(cell):
                return HOLD
            return _as_soc01(cell, 0.0)
        return HOLD

    if mode == "auto":
        return auto_target_soc(
            season=season,
            period=period,
            prices=prices,
            energy_price=energy_price,
            charge_eff=charge_eff,
            next_period_name=next_period_name,
        )

    return HOLD


def desired_ess_kw(
    *,
    soc: float,
    target: float,
    e_nom_kwh: float,
    charge_eff: float,
    dt_h: float | None = None,
) -> float:
    """朝目標 SOC 的電網側意圖功率（不夾 PCS；由 device.apply 再夾）。"""
    dt = hours_per_data_row() if dt_h is None else float(dt_h)
    eta = float(charge_eff)
    if e_nom_kwh <= 0 or eta <= 0 or dt <= 0:
        return 0.0
    d_soc = float(target) - float(soc)
    if abs(d_soc) < 1e-12:
        return 0.0
    if d_soc > 0:
        return (d_soc * e_nom_kwh) / (dt * eta)
    return (d_soc * e_nom_kwh * eta) / dt


def intent(
    *,
    soc: float,
    e_nom_kwh: float,
    charge_eff: float,
    mode: str = "auto",
    period: str | None = None,
    season: str | None = None,
    timestamp=None,
    is_holiday: bool = False,
    step_minutes: int = 60,
    data_min: int | None = None,
    hour: float | int | None = None,
    tou_schedule: dict | None = None,
    prices: dict | None = None,
    energy_price: float | None = None,
    dt_h: float | None = None,
    period_schedule: dict | None = None,
    tou_type: str | None = None,
) -> dict[str, float | str | None]:
    """一步 TOU 軟意圖：目標 SOC + desired ess_kw。"""
    day_key = None
    slot = None
    if timestamp is not None:
        day_key = schedule_day_key(timestamp, is_holiday=is_holiday)
    elif is_holiday:
        day_key = "sunday"
    if timestamp is not None or data_min is not None:
        slot = slot_index(timestamp, step_minutes=step_minutes, data_min=data_min)

    nxt = None
    h = row_hour(hour=hour, data_min=data_min, timestamp=timestamp)
    if (
        (mode or "auto").lower() == "auto"
        and season
        and day_key
        and h is not None
        and period_schedule
        and tou_type
    ):
        nxt = next_period(
            period_schedule,
            tou_type,
            season=str(season),
            day_key=str(day_key),
            hour=h,
        )

    tgt = target_soc(
        mode=mode,
        period=period,
        season=season,
        day_key=day_key,
        slot=slot,
        tou_schedule=tou_schedule,
        prices=prices,
        energy_price=energy_price,
        charge_eff=charge_eff,
        next_period_name=nxt,
    )
    if tgt is HOLD:
        ess = 0.0
        tgt_out = float(soc)
    else:
        ess = desired_ess_kw(
            soc=soc,
            target=float(tgt),
            e_nom_kwh=e_nom_kwh,
            charge_eff=charge_eff,
            dt_h=dt_h,
        )
        tgt_out = float(tgt)
    return {"target_soc": tgt_out, "desired_ess_kw": ess, "mode": (mode or "auto").lower()}


def ration_peak_discharge(
    desired: float,
    *,
    soc: float,
    soc_min: float,
    e_nom_kwh: float,
    charge_eff: float,
    remaining_peak_steps: int,
) -> float:
    """剩餘尖峰均分放電上限（ess 為負）。"""
    if desired >= 0 or remaining_peak_steps <= 0 or e_nom_kwh <= 0:
        return desired
    dt = hours_per_data_row()
    eta = float(charge_eff)
    room = max(0.0, float(soc) - float(soc_min))
    if room <= 0 or dt <= 0 or eta <= 0:
        return desired
    max_kw = (room * e_nom_kwh * eta) / dt / max(1, int(remaining_peak_steps))
    return max(float(desired), -max_kw)
