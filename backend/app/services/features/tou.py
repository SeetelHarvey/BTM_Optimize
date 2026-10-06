"""時間電價：唯一 schedule 解析 → 目標 SOC → 軟意圖 ess_kw。

Auto／Manual 差異只在矩陣來源；執行端只讀 schedule。
Auto：相鄰時段價差過 η² 門檻後，以理論 0／100% 目標套利（不預測未來需求；device 再夾有效窗）。
ponytail: 相鄰時段 heuristic；日後可升級 24–48h 滾動最佳化。
"""

from typing import Any

import pandas as pd

from app.services.schedule import hours_per_data_row

HOLD = None  # 維持 SOC，不充不放

_NEXT_DAY_KEY = {
    "weekday": "weekday",
    "saturday": "sunday",
    "sunday": "weekday",
}


def _as_soc01(v: Any, fallback: float = 0.5) -> float:
    """矩陣為 0–100%；後端統一 0–1。"""
    try:
        x = float(v)
    except (TypeError, ValueError):
        return max(0.0, min(1.0, fallback))
    if x > 1.0:
        x = x / 100.0
    return max(0.0, min(1.0, x))


def _cell_hold(v: Any) -> bool:
    """空白／null＝HOLD。"""
    if v is None:
        return True
    if isinstance(v, str) and not v.strip():
        return True
    return False


def _soc_pct(soc01: float) -> int:
    """0–1 → 整數百分比。"""
    return int(round(max(0.0, min(1.0, float(soc01))) * 100.0))


def schedule_day_key(day, *, is_holiday: bool = False) -> str:
    """區間所屬日 → weekday／saturday／sunday（假日當 sunday）。"""
    if is_holiday:
        return "sunday"
    try:
        if hasattr(day, "weekday") and not isinstance(day, (int, float)):
            wd = int(pd.Timestamp(day).weekday())
        else:
            wd = int(day)
    except (TypeError, ValueError, OverflowError):
        return "weekday"
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
    """當日時段槽：優先用資料列 min(0–95)。"""
    step = int(step_minutes) or 60
    per = max(1, step // 15)
    if data_min is not None:
        return max(0, int(data_min) // per)
    if ts is None:
        return 0
    from app.services.cleaning.formats.tpc import period_from_label

    _d, min15, _h = period_from_label(pd.Series([ts]))
    return max(0, int(min15.iloc[0]) // per)


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


def season_price_map(prices: dict | None, season: str) -> dict[str, float]:
    """單季 period→電價（略過無效值）。"""
    block = (prices or {}).get(season) if prices else None
    if not isinstance(block, dict):
        return {}
    out: dict[str, float] = {}
    for k, v in block.items():
        try:
            x = float(v)
        except (TypeError, ValueError):
            continue
        if x > 0:
            out[str(k)] = x
    return out


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
        if h >= float(segs[-1]["start"]):
            idx = len(segs) - 1
        else:
            return None
    if idx + 1 < len(segs):
        return str(segs[idx + 1]["period"])
    nxt_key = _NEXT_DAY_KEY.get(day_key)
    nxt = list(block.get(nxt_key) or []) if nxt_key else []
    return str(nxt[0]["period"]) if nxt else None


def period_at_hour(
    schedule: dict | None,
    tou_type: str | None,
    *,
    season: str,
    day_key: str,
    hour: float,
) -> str | None:
    """指定時刻所屬時段名。"""
    if not schedule or not tou_type:
        return None
    block = (schedule.get(tou_type) or {}).get(season)
    if not isinstance(block, dict):
        return None
    segs = list(block.get(day_key) or [])
    if not segs:
        return None
    h = float(hour)
    for seg in segs:
        start = float(seg["start"])
        end = float(seg["end"])
        if start <= h < end:
            return str(seg["period"])
    if h >= float(segs[-1]["start"]):
        return str(segs[-1]["period"])
    return None


def empty_tou_schedule(step_minutes: int = 60) -> dict[str, dict[str, list[Any]]]:
    """全 HOLD 矩陣。"""
    step = int(step_minutes) or 60
    n = max(1, int(round((24 * 60) / step)))
    z = [None] * n
    return {
        "summer": {"weekday": list(z), "saturday": list(z), "sunday": list(z)},
        "non_summer": {"weekday": list(z), "saturday": list(z), "sunday": list(z)},
    }


def normalize_tou_schedule(
    raw: Any,
    *,
    step_minutes: int = 60,
) -> dict[str, dict[str, list[Any]]]:
    """正規化使用者／推薦矩陣；缺格補 HOLD。"""
    step = int(step_minutes) or 60
    n = max(1, int(round((24 * 60) / step)))
    base = empty_tou_schedule(step)
    if not isinstance(raw, dict):
        return base
    out: dict[str, dict[str, list[Any]]] = {}
    for season in ("summer", "non_summer"):
        src_season = raw.get(season) if isinstance(raw.get(season), dict) else {}
        day_map: dict[str, list[Any]] = {}
        for day_key in ("weekday", "saturday", "sunday"):
            row_raw = src_season.get(day_key)
            row: list[Any] = []
            for i in range(n):
                cell = row_raw[i] if isinstance(row_raw, (list, tuple)) and i < len(row_raw) else None
                if _cell_hold(cell):
                    row.append(None)
                else:
                    row.append(_soc_pct(_as_soc01(cell, 0.0)))
            day_map[day_key] = row
        out[season] = day_map
    return out


def build_auto_tou_schedule(
    *,
    tou_type: str,
    prices: dict | None,
    period_schedule: dict | None,
    step_minutes: int = 60,
    charge_eff: float = 0.85,
    soc_min: float = 0.1,
    soc_max: float = 0.9,
) -> dict[str, dict[str, list[Any]]]:
    """Auto：相鄰時段 η² 套利 → 理論 0／100% 目標矩陣（執行端再夾 soc_min／soc_max）。"""
    # soc_min／soc_max 仍由 resolve_tou_schedule 寫入 meta；矩陣刻意用理論上下限
    step = int(step_minutes) or 60
    n = max(1, int(round((24 * 60) / step)))
    lo_pct, hi_pct = 0, 100
    out: dict[str, dict[str, list[Any]]] = {}
    for season in ("summer", "non_summer"):
        season_prices = season_price_map(prices, season)
        vals = list(season_prices.values())
        p_min = min(vals) if vals else None
        p_max = max(vals) if vals else None
        season_arb = (
            p_min is not None
            and p_max is not None
            and worth_arbitrage(p_max, p_min, charge_eff)
        )
        day_map: dict[str, list[Any]] = {}
        for day_key in ("weekday", "saturday", "sunday"):
            row: list[Any] = []
            for slot in range(n):
                hour = slot * (step / 60.0)
                period = period_at_hour(
                    period_schedule,
                    tou_type,
                    season=season,
                    day_key=day_key,
                    hour=hour,
                )
                if not season_arb or not season_prices or not period:
                    row.append(None)
                    continue
                try:
                    price = float(season_prices[period])
                except (KeyError, TypeError, ValueError):
                    row.append(None)
                    continue

                if p_min is not None and price <= p_min + 1e-12:
                    row.append(hi_pct)
                    continue
                if p_max is not None and price >= p_max - 1e-12:
                    row.append(lo_pct)
                    continue

                nxt = next_period(
                    period_schedule,
                    tou_type,
                    season=season,
                    day_key=day_key,
                    hour=hour,
                )
                if not nxt or nxt not in season_prices:
                    row.append(None)
                    continue
                try:
                    next_price = float(season_prices[nxt])
                except (TypeError, ValueError):
                    row.append(None)
                    continue

                if next_price > price + 1e-12 and worth_arbitrage(next_price, price, charge_eff):
                    row.append(hi_pct)
                elif next_price < price - 1e-12 and worth_arbitrage(price, next_price, charge_eff):
                    row.append(lo_pct)
                else:
                    row.append(None)
            day_map[day_key] = row
        out[season] = day_map
    return out


def resolve_tou_schedule(
    settings: dict[str, Any],
    *,
    tou_type: str,
    prices: dict | None,
    period_schedule: dict | None,
    tou_step_minutes: int,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """唯一 schedule 入口：Auto 產生／Manual 正規化；回傳 (local_settings, tou_meta)。"""
    from app.services import settings as settings_svc

    local = dict(settings)
    step = int(tou_step_minutes) or 60
    mode = str(local.get("touScheduleMode") or "auto").lower()
    sched_periods = (
        period_schedule if period_schedule is not None else settings_svc.default_schedule()
    )
    if mode == "manual":
        sched = normalize_tou_schedule(local.get("touSchedule"), step_minutes=step)
        source = "manual"
    else:
        sched = build_auto_tou_schedule(
            tou_type=tou_type,
            prices=prices,
            period_schedule=sched_periods,
            step_minutes=step,
            charge_eff=charge_eff,
            soc_min=soc_min,
            soc_max=soc_max,
        )
        source = "auto"
    local = {**local, "touSchedule": sched}
    meta = {
        "mode": source,
        "source": source,
        "recommended_schedule": sched,
        "soc_min": float(soc_min),
        "soc_max": float(soc_max),
    }
    return local, meta


def target_soc(
    *,
    season: str | None = None,
    day_key: str | None = None,
    slot: int | None = None,
    tou_schedule: dict | None = None,
) -> float | None:
    """讀 schedule 單格目標 SOC（0–1）；空白＝HOLD。"""
    if not tou_schedule or season is None or day_key is None or slot is None:
        return HOLD
    row = ((tou_schedule.get(season) or {}).get(day_key)) or []
    if not (0 <= int(slot) < len(row)):
        return HOLD
    cell = row[int(slot)]
    if _cell_hold(cell):
        return HOLD
    return _as_soc01(cell, 0.0)


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
    season: str | None = None,
    date=None,
    timestamp=None,
    is_holiday: bool = False,
    step_minutes: int = 60,
    data_min: int | None = None,
    tou_schedule: dict | None = None,
    dt_h: float | None = None,
) -> dict[str, float | str | None]:
    """一步 TOU 軟意圖：只追蹤 schedule 目標 SOC。"""
    day_key = None
    slot = None
    if is_holiday:
        day_key = "sunday"
    elif date is not None:
        day_key = schedule_day_key(date)
    elif timestamp is not None:
        from app.services.cleaning.formats.tpc import interval_date

        day_key = schedule_day_key(interval_date(timestamp))
    if timestamp is not None or data_min is not None:
        slot = slot_index(timestamp, step_minutes=step_minutes, data_min=data_min)

    tgt = target_soc(
        season=season,
        day_key=day_key,
        slot=slot,
        tou_schedule=tou_schedule,
    )
    if tgt is HOLD:
        return {"target_soc": float(soc), "desired_ess_kw": 0.0}
    ess = desired_ess_kw(
        soc=soc,
        target=float(tgt),
        e_nom_kwh=e_nom_kwh,
        charge_eff=charge_eff,
        dt_h=dt_h,
    )
    return {"target_soc": float(tgt), "desired_ess_kw": ess}
