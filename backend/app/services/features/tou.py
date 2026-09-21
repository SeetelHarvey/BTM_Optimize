"""時間電價：auto／manual 目標 SOC → 軟意圖 ess_kw。

auto 策略：
1. 電價階層＋中價預放參考 → 物化推薦 SOC 矩陣後以 manual 路徑執行（所見即所得）。
2. 價差須蓋過往返損耗：P_hi/P_lo ≥ 1/η²。
3. 矩陣 cascade：最低→100、最高→0；中價且下一段更便宜→0；中價且下一段更貴→reserve%；其餘 HOLD。
"""

from typing import Any

import pandas as pd

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


def schedule_day_key(day, *, is_holiday: bool = False) -> str:
    """區間所屬日 → weekday／saturday／sunday（假日當 sunday）。

    day 必須是 enrich 後的 date（或可 weekday 的日），不是 interval-end 標籤。
    """
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


def row_hour(
    *,
    hour: float | int | None = None,
    data_min: int | None = None,
    timestamp=None,
) -> float | None:
    """列所屬整點（優先 hour／min；timestamp 後備走 tpc）。"""
    if hour is not None:
        return float(hour)
    if data_min is not None:
        return float(int(data_min) // 4)
    if timestamp is not None:
        from app.services.cleaning.formats.tpc import period_from_label

        _d, _m, h = period_from_label(pd.Series([timestamp]))
        return float(h.iloc[0])
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


def priced_discharge_periods(
    prices: dict | None,
    *,
    charge_eff: float,
    season: str | None = None,
    exclude_periods: frozenset[str] | None = None,
) -> dict[str, frozenset[str]]:
    """各季相對最低價過套利門檻的放電 period（預設不含離峰／週六半尖峰）。"""
    skip = exclude_periods or frozenset({"off_peak", "saturday_half_peak"})
    seasons = (season,) if season else ("summer", "non_summer")
    out: dict[str, frozenset[str]] = {}
    for sea in seasons:
        smap = season_price_map(prices, sea)
        if not smap:
            out[sea] = frozenset()
            continue
        p_lo = min(smap.values())
        discharge = {
            p
            for p, pr in smap.items()
            if p not in skip and pr > p_lo + 1e-12 and worth_arbitrage(pr, p_lo, charge_eff)
        }
        out[sea] = frozenset(discharge)
    return out


def midprice_periods(
    prices: dict | None,
    *,
    charge_eff: float,
    season: str,
) -> tuple[str | None, frozenset[str]]:
    """回傳 (最高放電 period, 中價放電 period 集合)；無中價則 mid 空。"""
    smap = season_price_map(prices, season)
    discharge = priced_discharge_periods(prices, charge_eff=charge_eff, season=season).get(
        season, frozenset()
    )
    if not discharge or not smap:
        return None, frozenset()
    peak_period = max(discharge, key=lambda p: (smap.get(p, 0.0), p))
    peak_price = float(smap[peak_period])
    mid = frozenset(
        p for p in discharge if p != peak_period and float(smap[p]) < peak_price - 1e-12
    )
    return peak_period, mid


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
    date=None,
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
    if is_holiday:
        day_key = "sunday"
    elif date is not None:
        day_key = schedule_day_key(date)
    elif timestamp is not None:
        from app.services.cleaning.formats.tpc import interval_date

        day_key = schedule_day_key(interval_date(timestamp))
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


def _row_hour_val(row: pd.Series) -> float | None:
    if "hour" in row.index and pd.notna(row.get("hour")):
        return float(row["hour"])
    if "min" in row.index and pd.notna(row.get("min")):
        return float(int(row["min"]) // 4)
    ts = row.get("timestamp")
    if ts is not None and pd.notna(ts):
        from app.services.cleaning.formats.tpc import period_from_label

        _d, _m, h = period_from_label(pd.Series([ts]))
        return float(h.iloc[0])
    return None


def build_midprice_reserve_ref(
    df: pd.DataFrame,
    *,
    pcs_kw: float,
    batt_kwh: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
    prices: dict | None = None,
    season: str = "summer",
) -> dict[str, Any]:
    """平日非假日 → 最高價時段單日最大可放電 kWh → 中價預放保留 SOC。"""
    pcs = max(0.0, float(pcs_kw))
    batt = max(0.0, float(batt_kwh))
    lo = float(soc_min)
    hi = float(soc_max)
    eta = max(0.0, float(charge_eff))
    usable = batt * max(0.0, hi - lo) * eta
    empty = {
        "enabled": False,
        "reserve_soc": hi,
        "reserve_soc_pct": round(hi * 100.0, 1),
        "usable_kwh": round(usable, 1),
        "max_peak_kwh": 0.0,
        "peak_soc_need": 0.0,
        "peak_period": None,
        "mid_periods": [],
        "reason": "no_data",
    }
    if df is None or df.empty or usable <= 0 or pcs <= 0 or batt <= 0 or eta <= 0:
        return empty

    peak_period, mid = midprice_periods(prices, charge_eff=eta, season=season)
    if not peak_period or not mid:
        return {**empty, "reason": "no_mid_tier", "peak_period": peak_period, "mid_periods": sorted(mid)}

    work = df
    if "season" in work.columns:
        work = work.loc[work["season"].astype(str) == str(season)]
    if work.empty:
        return {**empty, "reason": "no_season", "peak_period": peak_period, "mid_periods": sorted(mid)}
    if "is_holiday" in work.columns:
        work = work.loc[~work["is_holiday"].fillna(False).astype(bool)]
    if "date" in work.columns:
        wd = pd.to_datetime(work["date"]).dt.weekday
        work = work.loc[wd < 5]
    elif "timestamp" in work.columns:
        from app.services.cleaning.formats.tpc import date_from_ts

        wd = date_from_ts(work["timestamp"]).dt.weekday
        work = work.loc[wd < 5]
    if work.empty or "period" not in work.columns or "kW" not in work.columns:
        return {**empty, "reason": "no_weekday", "peak_period": peak_period, "mid_periods": sorted(mid)}

    dt = hours_per_data_row()
    if "date" in work.columns:
        dates = work["date"]
    else:
        from app.services.cleaning.formats.tpc import date_from_ts

        dates = date_from_ts(work["timestamp"]).dt.date
    absorb = work["kW"].astype(float).clip(upper=pcs) * dt
    peak_m = work["period"].astype(str) == str(peak_period)
    if not peak_m.any():
        return {
            **empty,
            "reason": "no_peak_rows",
            "peak_period": peak_period,
            "mid_periods": sorted(mid),
        }
    daily = absorb.loc[peak_m].groupby(dates.loc[peak_m]).sum()
    max_peak_kwh = float(daily.max()) if len(daily) else 0.0
    # 電網側可放 kWh → 電池 SOC 需求（放電經 η）
    peak_soc_need = (max_peak_kwh / eta) / batt if batt > 0 and eta > 0 else 0.0
    reserve_soc = lo + peak_soc_need
    reserve_soc = max(lo, min(hi, float(reserve_soc)))
    if reserve_soc >= hi - 1e-9:
        return {
            "enabled": False,
            "reserve_soc": hi,
            "reserve_soc_pct": round(hi * 100.0, 1),
            "usable_kwh": round(usable, 1),
            "max_peak_kwh": round(max_peak_kwh, 1),
            "peak_soc_need": round(peak_soc_need * 100.0, 1),
            "peak_period": peak_period,
            "mid_periods": sorted(mid),
            "reason": "peak_fills_usable",
        }
    return {
        "enabled": True,
        "reserve_soc": reserve_soc,
        "reserve_soc_pct": round(reserve_soc * 100.0, 1),
        "usable_kwh": round(usable, 1),
        "max_peak_kwh": round(max_peak_kwh, 1),
        "peak_soc_need": round(peak_soc_need * 100.0, 1),
        "peak_period": peak_period,
        "mid_periods": sorted(mid),
        "reason": "ok",
    }


def build_summer_halfpeak_ref(
    df: pd.DataFrame,
    *,
    pcs_kw: float,
    batt_kwh: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
    prices: dict | None = None,
) -> dict[str, Any]:
    """夏平日中價預放參考（build_midprice_reserve_ref 別名）。"""
    return build_midprice_reserve_ref(
        df,
        pcs_kw=pcs_kw,
        batt_kwh=batt_kwh,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=charge_eff,
        prices=prices,
        season="summer",
    )


def materialize_tou_schedule(
    *,
    tou_type: str,
    prices: dict | None,
    period_schedule: dict | None,
    step_minutes: int = 60,
    halfpeak_ref: dict[str, Any] | None = None,
    halfpeak_refs: dict[str, dict[str, Any]] | None = None,
    charge_eff: float = 0.85,
) -> dict[str, dict[str, list[Any]]]:
    """電價 cascade＋中價預放 → 推薦目標 SOC% 矩陣（空白＝HOLD）。"""
    step = int(step_minutes) or 60
    n = max(1, int(round((24 * 60) / step)))
    refs = dict(halfpeak_refs or {})
    if halfpeak_ref and "summer" not in refs:
        refs["summer"] = halfpeak_ref
    out: dict[str, dict[str, list[Any]]] = {}
    for season in ("summer", "non_summer"):
        ref = refs.get(season) or {}
        enabled = bool(ref.get("enabled"))
        reserve_pct = int(round(float(ref.get("reserve_soc_pct") or 100)))
        mid_set = frozenset(str(x) for x in (ref.get("mid_periods") or []))
        season_prices = season_price_map(prices, season)
        vals = list(season_prices.values())
        p_min = min(vals) if vals else None
        p_max = max(vals) if vals else None
        arb = (
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
                if not arb or not season_prices or not period:
                    row.append(None)
                    continue
                try:
                    price = float(season_prices[period])
                except (KeyError, TypeError, ValueError):
                    row.append(None)
                    continue

                if p_min is not None and price <= p_min + 1e-12:
                    row.append(100)
                    continue
                if p_max is not None and price >= p_max - 1e-12:
                    row.append(0)
                    continue

                nxt = next_period(
                    period_schedule,
                    tou_type,
                    season=season,
                    day_key=day_key,
                    hour=hour,
                )
                next_price = None
                if nxt and nxt in season_prices:
                    try:
                        next_price = float(season_prices[nxt])
                    except (TypeError, ValueError):
                        next_price = None

                is_mid = period in mid_set or (
                    p_min is not None
                    and p_max is not None
                    and p_min + 1e-12 < price < p_max - 1e-12
                    and period
                    in priced_discharge_periods(prices, charge_eff=charge_eff, season=season).get(
                        season, frozenset()
                    )
                )

                if is_mid and next_price is not None:
                    if next_price < price - 1e-12:
                        row.append(0)
                        continue
                    if (
                        enabled
                        and next_price > price + 1e-12
                        and day_key == "weekday"
                    ):
                        row.append(reserve_pct)
                        continue
                row.append(None)
            day_map[day_key] = row
        out[season] = day_map
    return out


def prepare_auto_tou(
    df: pd.DataFrame,
    settings: dict[str, Any],
    *,
    pcs_kw: float,
    batt_kwh: float,
    tou_type: str,
    prices: dict | None,
    period_schedule: dict | None,
    tou_step_minutes: int,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
) -> tuple[dict[str, Any], dict[str, Any] | None]:
    """auto → 物化推薦表並改走 manual；回傳 (local_settings, tou_meta)。"""
    from app.services import settings as settings_svc

    local = dict(settings)
    if str(local.get("touScheduleMode") or "auto").lower() != "auto":
        return local, None
    sched_periods = period_schedule if period_schedule is not None else settings_svc.default_schedule()
    refs: dict[str, dict[str, Any]] = {}
    for season in ("summer", "non_summer"):
        ref = build_midprice_reserve_ref(
            df,
            pcs_kw=pcs_kw,
            batt_kwh=batt_kwh,
            soc_min=soc_min,
            soc_max=soc_max,
            charge_eff=charge_eff,
            prices=prices,
            season=season,
        )
        refs[season] = {**ref, "season": season}
    sched = materialize_tou_schedule(
        tou_type=tou_type,
        prices=prices,
        period_schedule=sched_periods,
        step_minutes=tou_step_minutes,
        halfpeak_refs=refs,
        charge_eff=charge_eff,
    )
    local = {
        **local,
        "touSchedule": sched,
        "touScheduleMode": "manual",
    }
    meta = {
        "mode": "auto",
        "recommended_schedule": sched,
        "halfpeak_ref": refs.get("summer"),
        "halfpeak_refs": refs,
    }
    return local, meta

