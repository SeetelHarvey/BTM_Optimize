"""即時備轉：需量反應履約估算、自動投標、額外收益結算。"""

from __future__ import annotations

import math
from typing import Any

import numpy as np
import pandas as pd

from app.services.bess.device import Device
from app.services.contracts import money
from app.services.features import tou as tou_feat
from app.services.schedule import DATA_INTERVAL_MINUTES, hours_per_data_row

EVENT_MINUTES = 70
RECOVERY_MINUTES = 120
OFFICIAL_WINDOW_START = 10  # 指令後第 10～69 分
OFFICIAL_WINDOW_LEN = 60
MW_STEP = 0.1
ROWS_PER_EVENT = math.ceil(EVENT_MINUTES / DATA_INTERVAL_MINUTES)  # 5
ROWS_PER_RECOVERY = math.ceil(RECOVERY_MINUTES / DATA_INTERVAL_MINUTES)  # 8


def validate_inputs(settings: dict[str, Any]) -> dict[str, float | int]:
    """容量／效能／電能價格與每月調度次數；非負有限。"""

    def _nonneg(name: str, default: float = 0.0) -> float:
        try:
            v = float(settings.get(name, default))
        except (TypeError, ValueError) as e:
            raise ValueError(f"{name} must be a number") from e
        if not math.isfinite(v) or v < 0:
            raise ValueError(f"{name} must be a finite non-negative number")
        return v

    count = settings.get("reserveMonthlyDispatchCount", 0)
    try:
        n = int(count)
    except (TypeError, ValueError) as e:
        raise ValueError("reserveMonthlyDispatchCount must be an integer") from e
    if n < 0:
        raise ValueError("reserveMonthlyDispatchCount must be >= 0")
    return {
        "capacity_price": _nonneg("reserveCapacityPrice"),
        "performance_price": _nonneg("reservePerformancePrice"),
        "energy_price": _nonneg("reserveEnergyPrice"),
        "monthly_dispatch_count": n,
    }


def quantize_mw(mw: float) -> float:
    """向下量化至 0.1 MW。"""
    if mw <= 0:
        return 0.0
    return round(math.floor(mw / MW_STEP + 1e-12) * MW_STEP, 1)


def service_quality(execution_pct: float) -> float:
    """官方服務品質係數。"""
    x = float(execution_pct)
    if x >= 95.0:
        return 1.0
    if x >= 85.0:
        return 0.7
    if x >= 70.0:
        return 0.0
    return -240.0


def _bid_from_manual(
    *,
    season: str | None,
    day_key: str | None,
    slot: int | None,
    schedule: dict | None,
) -> float:
    if not schedule or season is None or day_key is None or slot is None:
        return 0.0
    row = ((schedule.get(season) or {}).get(day_key)) or []
    if 0 <= int(slot) < len(row):
        try:
            return max(0.0, float(row[int(slot)]))
        except (TypeError, ValueError):
            return 0.0
    return 0.0


def empty_schedule(step_minutes: int = 60) -> dict[str, dict[str, list[float]]]:
    """依時段步階產生全 0 投標矩陣（60 分→24 格；30 分→48 格）。"""
    step = max(1, int(step_minutes) or 60)
    n = max(1, int(round((24 * 60) / step)))
    z = [0.0] * n
    return {
        "summer": {"weekday": list(z), "saturday": list(z), "sunday": list(z)},
        "non_summer": {"weekday": list(z), "saturday": list(z), "sunday": list(z)},
    }


def resolve_bids_series(
    df: pd.DataFrame,
    settings: dict[str, Any],
    *,
    step_minutes: int = 60,
) -> pd.Series:
    """整段 bid MW 序列。manual＝矩陣；auto＝settings['reserveSchedule']（先由推薦寫入）。"""
    mode = str(settings.get("reserveScheduleMode") or "auto").lower()
    sched = settings.get("reserveSchedule")
    bids: list[float] = []
    for i in range(len(df)):
        row = df.iloc[i]
        day_key = None
        slot = None
        hol = bool(row.get("is_holiday", False))
        if "date" in row.index and pd.notna(row.get("date")):
            day_key = tou_feat.schedule_day_key(row["date"], is_holiday=hol)
        elif row.get("timestamp") is not None:
            from app.services.cleaning.formats.tpc import interval_date

            day_key = tou_feat.schedule_day_key(
                interval_date(row["timestamp"]), is_holiday=hol
            )
        if "min" in row.index and pd.notna(row["min"]):
            slot = tou_feat.slot_index(
                step_minutes=step_minutes,
                data_min=int(row["min"]),
            )
        if mode == "manual" or sched:
            bids.append(
                _bid_from_manual(
                    season=row.get("season"),
                    day_key=day_key,
                    slot=slot,
                    schedule=sched,
                )
            )
        else:
            bids.append(0.0)
    return pd.Series(bids, index=df.index, dtype=float)


def hard_occupy(
    lo: float,
    hi: float,
    bid_mw: float,
    pcs_kw: float,
) -> tuple[float, float]:
    """投標硬佔用：保留 bid 功率，限縮可套利放電。"""
    bid_kw = max(0.0, float(bid_mw)) * 1000.0
    pcs = max(0.0, float(pcs_kw))
    if bid_kw <= 0 or pcs <= 0:
        return lo, hi
    reserve_headroom = max(0.0, pcs - bid_kw)
    lo = max(lo, -reserve_headroom)
    return lo, hi


def standby_soc_floor(
    bid_mw: float,
    *,
    e_nom: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
) -> float:
    """待命 SOC 底線：保留約 70 分鐘投標能量。"""
    bid_kw = max(0.0, float(bid_mw)) * 1000.0
    if bid_kw <= 0 or e_nom <= 0:
        return float(soc_min)
    eta = max(1e-9, float(charge_eff))
    need_kwh = bid_kw * (EVENT_MINUTES / 60.0) / eta
    return min(float(soc_max), float(soc_min) + need_kwh / e_nom)


def narrow_standby_soc(
    lo: float,
    hi: float,
    *,
    soc: float,
    bid_mw: float,
    device: Device,
    dt_h: float | None = None,
) -> tuple[float, float]:
    """待命時禁止把 SOC 放到底線以下。"""
    floor = standby_soc_floor(
        bid_mw,
        e_nom=device.e_nom,
        soc_min=device.soc_min,
        soc_max=device.soc_max,
        charge_eff=device.charge_eff,
    )
    dt = hours_per_data_row() if dt_h is None else float(dt_h)
    room = max(0.0, float(soc) - floor)
    eta = max(1e-9, device.charge_eff)
    discharge_cap = (room * device.e_nom * eta) / dt if dt > 0 else 0.0
    return max(lo, -discharge_cap), hi


def _factory_loads_ahead(load_kw: np.ndarray, start_row: int, minutes: int) -> np.ndarray:
    """從 start_row 起零階保持展開 minutes 筆工廠負載。"""
    out = np.zeros(minutes, dtype=float)
    n = len(load_kw)
    for m in range(minutes):
        r = start_row + m // DATA_INTERVAL_MINUTES
        if r >= n:
            out[m] = float(load_kw[n - 1]) if n else 0.0
        else:
            out[m] = float(load_kw[r])
    return out


def simulate_event(
    *,
    bid_kw: float,
    cbl_kw: float,
    factory_loads: np.ndarray,
    soc0: float,
    pcs_kw: float,
    e_nom: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
    anti_export_kw: float = 0.0,
) -> dict[str, Any]:
    """70 分鐘履約模擬（1 分鐘步）。ess 負＝放電。"""
    bid = max(0.0, float(bid_kw))
    cbl = max(0.0, float(cbl_kw))
    target_grid = max(0.0, cbl - bid)
    eta = max(1e-9, float(charge_eff))
    pcs = max(0.0, float(pcs_kw))
    soc = float(soc0)
    dt_h = 1.0 / 60.0

    delivered = np.zeros(EVENT_MINUTES, dtype=float)
    required = np.zeros(EVENT_MINUTES, dtype=float)
    actual_grid = np.zeros(EVENT_MINUTES, dtype=float)
    ess_kw = np.zeros(EVENT_MINUTES, dtype=float)
    fail_reason = None
    max_factory = float(np.max(factory_loads)) if len(factory_loads) else 0.0
    max_req = 0.0

    for m in range(EVENT_MINUTES):
        load = float(factory_loads[m]) if m < len(factory_loads) else 0.0
        req = max(0.0, load - target_grid)  # 需放電功率（正）
        required[m] = req
        max_req = max(max_req, req)

        # 可行放電：PCS、SOC、不逆送
        room_dn = max(0.0, soc - soc_min)
        discharge_cap = (room_dn * e_nom * eta) / dt_h
        ess_floor = anti_export_kw - load  # ess >= floor
        max_discharge = min(pcs, discharge_cap, max(0.0, -ess_floor) if ess_floor < 0 else pcs)
        # 目標 ess = target_grid - load（負＝放）
        desired = target_grid - load
        ess = max(-max_discharge, min(pcs, desired))
        # 禁止充電墊高交付：受令期間不充電
        ess = min(0.0, ess)
        grid = load + ess
        deliv = max(0.0, cbl - grid)
        delivered[m] = deliv
        actual_grid[m] = grid
        ess_kw[m] = ess

        if ess < 0:
            d_soc = -((-ess) * dt_h / eta) / e_nom
        else:
            d_soc = 0.0
        soc = min(soc_max, max(soc_min, soc + d_soc))

        if bid > 1e-9 and deliv + 1e-6 < bid and fail_reason is None:
            if req > pcs + 1e-6:
                fail_reason = "pcs_headroom"
            elif room_dn <= 1e-9 or discharge_cap + 1e-6 < req:
                fail_reason = "low_soc"
            elif grid < anti_export_kw - 1e-6:
                fail_reason = "anti_export"
            elif load > cbl + 1e-6:
                fail_reason = "factory_load_rise"
            else:
                fail_reason = "pcs_headroom"

    exec_pct = (delivered / bid * 100.0) if bid > 1e-9 else np.full(EVENT_MINUTES, 100.0)
    minute1_ok = bool(bid <= 1e-9 or delivered[0] + 1e-6 >= bid)
    strict_ok = bool(bid <= 1e-9 or np.all(delivered + 1e-6 >= bid))
    official = delivered[OFFICIAL_WINDOW_START : OFFICIAL_WINDOW_START + OFFICIAL_WINDOW_LEN]
    official_kwh = float(official.sum() / 60.0)
    # 60 分鐘目標電能 = bid_kw × 1 h（kWh）
    official_pct = (official_kwh / bid * 100.0) if bid > 1e-9 else 100.0

    return {
        "bid_kw": bid,
        "cbl_kw": cbl,
        "target_grid_kw": target_grid,
        "delivered_kw": delivered,
        "required_kw": required,
        "actual_grid_kw": actual_grid,
        "ess_kw": ess_kw,
        "execution_pct": exec_pct,
        "minute1_ok": minute1_ok,
        "strict_ok": strict_ok,
        "official_execution_pct": official_pct,
        "official_quality": service_quality(official_pct),
        "delivered_kwh": float(delivered.sum() / 60.0),
        "official_kwh": official_kwh,
        "soc_end": soc,
        "max_factory_kw": max_factory,
        "max_required_kw": max_req,
        "fail_reason": None if strict_ok else fail_reason,
        "charging_exception": False,
    }


def max_deliverable_kw(
    *,
    cbl_kw: float,
    factory_loads: np.ndarray,
    soc0: float,
    pcs_kw: float,
    e_nom: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
    anti_export_kw: float = 0.0,
    robust_no_charge_cbl: bool = True,
    factory_at_cbl: float | None = None,
    standby_ess_at_cbl: float = 0.0,
) -> tuple[float, str | None]:
    """二分求嚴格 70 分鐘可履約上限（kW）。"""
    cbl = max(0.0, float(cbl_kw))
    if robust_no_charge_cbl and standby_ess_at_cbl > 1e-9 and factory_at_cbl is not None:
        # 不依賴停止充電墊高 CBL
        cbl = max(0.0, float(factory_at_cbl))
    if cbl <= 0 or pcs_kw <= 0:
        return 0.0, "cbl"

    lo, hi = 0.0, min(cbl, float(pcs_kw))
    best = 0.0
    reason = None
    for _ in range(24):
        mid = (lo + hi) / 2.0
        ev = simulate_event(
            bid_kw=mid,
            cbl_kw=cbl,
            factory_loads=factory_loads,
            soc0=soc0,
            pcs_kw=pcs_kw,
            e_nom=e_nom,
            soc_min=soc_min,
            soc_max=soc_max,
            charge_eff=charge_eff,
            anti_export_kw=anti_export_kw,
        )
        if ev["strict_ok"]:
            best = mid
            lo = mid
        else:
            hi = mid
            reason = ev["fail_reason"]
    return best, reason


def recovery_minutes(
    *,
    bid_kw: float,
    soc_after: float,
    factory_loads: np.ndarray,
    pcs_kw: float,
    e_nom: float,
    soc_min: float,
    soc_max: float,
    charge_eff: float,
    anti_export_kw: float = 0.0,
) -> tuple[int | None, bool]:
    """120 分鐘內回到同一 Q 待命 SOC；回傳（分鐘, ok）。"""
    floor = standby_soc_floor(
        bid_kw / 1000.0,
        e_nom=e_nom,
        soc_min=soc_min,
        soc_max=soc_max,
        charge_eff=charge_eff,
    )
    if soc_after + 1e-9 >= floor:
        return 0, True
    eta = max(1e-9, float(charge_eff))
    dt_h = 1.0 / 60.0
    soc = float(soc_after)
    pcs = max(0.0, float(pcs_kw))
    for m in range(RECOVERY_MINUTES):
        load = float(factory_loads[m]) if m < len(factory_loads) else 0.0
        room_up = max(0.0, soc_max - soc)
        charge_cap = (room_up * e_nom / eta) / dt_h if dt_h > 0 else 0.0
        # 不逆送：ess <= load - anti_export（正＝充）
        export_cap = max(0.0, load - anti_export_kw)
        charge = min(pcs, charge_cap, export_cap)
        if charge > 0:
            soc = min(soc_max, soc + (charge * dt_h * eta) / e_nom)
        if soc + 1e-9 >= floor:
            return m + 1, True
    return None, False


def _percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    arr = np.array(values, dtype=float)
    return float(np.percentile(arr, p))


def build_auto_schedule(
    df: pd.DataFrame,
    standby: pd.DataFrame,
    device: Device,
    *,
    step_minutes: int = 60,
    capacity_price: float = 0.0,
    performance_price: float = 0.0,
) -> tuple[dict[str, dict[str, list[float]]], dict[str, Any]]:
    """依歷史事件第 5 百分位可履約量產生推薦矩陣。"""
    sched = empty_schedule(step_minutes)
    slot_count = len(sched["summer"]["weekday"])
    load = df["kW"].astype(float).to_numpy()
    grid = standby["grid_kw"].astype(float).to_numpy()
    ess = standby["ess_kw"].astype(float).to_numpy()
    soc = standby["soc"].astype(float).to_numpy()
    n = len(df)
    need_ahead = ROWS_PER_EVENT + ROWS_PER_RECOVERY
    buckets: dict[tuple[str, str, int], list[float]] = {}

    for i in range(n - need_ahead):
        row = df.iloc[i]
        season = str(row.get("season") or "")
        if season not in ("summer", "non_summer"):
            continue
        hol = bool(row.get("is_holiday", False))
        if "date" in row.index and pd.notna(row.get("date")):
            day_key = tou_feat.schedule_day_key(row["date"], is_holiday=hol)
        elif row.get("timestamp") is not None:
            from app.services.cleaning.formats.tpc import interval_date

            day_key = tou_feat.schedule_day_key(
                interval_date(row["timestamp"]), is_holiday=hol
            )
        else:
            continue
        slot = 0
        if "min" in df.columns and pd.notna(row["min"]):
            slot = tou_feat.slot_index(step_minutes=step_minutes, data_min=int(row["min"]))
        # 候選：區間結束 → 事件從下一列開始
        factory = _factory_loads_ahead(load, i + 1, EVENT_MINUTES)
        q_kw, _ = max_deliverable_kw(
            cbl_kw=float(grid[i]),
            factory_loads=factory,
            soc0=float(soc[i]),
            pcs_kw=device.pcs_kw,
            e_nom=device.e_nom,
            soc_min=device.soc_min,
            soc_max=device.soc_max,
            charge_eff=device.charge_eff,
            anti_export_kw=device.anti_export_kw,
            factory_at_cbl=float(load[i]),
            standby_ess_at_cbl=float(ess[i]),
        )
        key = (season, day_key, int(slot))
        buckets.setdefault(key, []).append(q_kw / 1000.0)

    meta_cells = 0
    for (season, day_key, slot), vals in buckets.items():
        mw = quantize_mw(_percentile(vals, 5))
        # 正淨值粗篩：有容量或效能價才保留（機會成本留給最終帳單）
        if mw > 0 and (capacity_price + performance_price) <= 0:
            mw = 0.0
        if season in sched and day_key in sched[season] and 0 <= slot < slot_count:
            sched[season][day_key][slot] = mw
            if mw > 0:
                meta_cells += 1
    return sched, {
        "cells_positive": meta_cells,
        "buckets": len(buckets),
        "estimate": "p05",
        "slot_count": slot_count,
        "step_minutes": int(step_minutes),
    }


def select_monthly_events(
    df: pd.DataFrame,
    standby: pd.DataFrame,
    bids: pd.Series,
    device: Device,
    *,
    monthly_count: int,
    step_minutes: int = 60,
) -> list[dict[str, Any]]:
    """每月選歷史可履約最差的得標時段事件。"""
    if monthly_count <= 0:
        return []
    load = df["kW"].astype(float).to_numpy()
    grid = standby["grid_kw"].astype(float).to_numpy()
    soc = standby["soc"].astype(float).to_numpy()
    n = len(df)
    need_ahead = ROWS_PER_EVENT + ROWS_PER_RECOVERY
    candidates: list[dict[str, Any]] = []

    slot_rows = max(1, int(step_minutes) // DATA_INTERVAL_MINUTES)
    for i in range(n - need_ahead):
        bid_mw = float(bids.iloc[i])
        if bid_mw <= 0:
            continue
        # 取該投標小時最後一個 15 分槽（min 為 0–95）作為受令邊界
        if "min" in df.columns and pd.notna(df.iloc[i]["min"]):
            if int(df.iloc[i]["min"]) % slot_rows != slot_rows - 1:
                continue
        row = df.iloc[i]
        month = pd.Timestamp(row["date"]).strftime("%Y-%m")
        factory = _factory_loads_ahead(load, i + 1, EVENT_MINUTES)
        bid_kw = bid_mw * 1000.0
        ev = simulate_event(
            bid_kw=bid_kw,
            cbl_kw=float(grid[i]),
            factory_loads=factory,
            soc0=float(soc[i]),
            pcs_kw=device.pcs_kw,
            e_nom=device.e_nom,
            soc_min=device.soc_min,
            soc_max=device.soc_max,
            charge_eff=device.charge_eff,
            anti_export_kw=device.anti_export_kw,
        )
        score = float(np.min(ev["execution_pct"])) if bid_kw > 0 else 100.0
        candidates.append(
            {
                "row": i,
                "month": month,
                "bid_mw": bid_mw,
                "bid_kw": bid_kw,
                "score": score,
                "event": ev,
                "date": str(row.get("date")),
                "timestamp": row.get("timestamp"),
            }
        )

    # 每小時只留一個候選：同 hour 取最差
    by_hour: dict[tuple[str, str, int], dict[str, Any]] = {}
    for c in candidates:
        row = df.iloc[c["row"]]
        hour = int(row["hour"]) if "hour" in df.columns and pd.notna(row.get("hour")) else 0
        key = (c["month"], str(row.get("date")), hour)
        prev = by_hour.get(key)
        if prev is None or c["score"] < prev["score"]:
            by_hour[key] = c
    candidates = list(by_hour.values())

    selected: list[dict[str, Any]] = []
    months = sorted({c["month"] for c in candidates})
    for month in months:
        pool = sorted(
            [c for c in candidates if c["month"] == month],
            key=lambda x: (x["score"], x["row"]),
        )
        taken = 0
        used_rows: list[int] = []
        for c in pool:
            if taken >= monthly_count:
                break
            start = c["row"] + 1
            span = ROWS_PER_EVENT + ROWS_PER_RECOVERY
            if any(not (start + span <= u or start >= u + span) for u in used_rows):
                continue
            selected.append(c)
            used_rows.append(start)
            taken += 1
    return selected


def apply_events_to_dispatch(
    df: pd.DataFrame,
    disp: pd.DataFrame,
    events: list[dict[str, Any]],
    device: Device,
) -> tuple[pd.DataFrame, list[dict[str, Any]]]:
    """把受令事件能量疊回 15 分序列並重算 SOC／grid。"""
    out = disp.copy()
    load = df["kW"].astype(float).to_numpy()
    ess = out["ess_kw"].astype(float).to_numpy().copy()
    n = len(df)
    details: list[dict[str, Any]] = []
    dt = hours_per_data_row()
    eta = max(1e-9, device.charge_eff)

    for c in events:
        i = int(c["row"])
        ev = c["event"]
        # 將 70 分鐘 ess 聚合成 15 分平均
        for k in range(ROWS_PER_EVENT):
            r = i + 1 + k
            if r >= n:
                break
            m0 = k * DATA_INTERVAL_MINUTES
            m1 = min(EVENT_MINUTES, m0 + DATA_INTERVAL_MINUTES)
            chunk = ev["ess_kw"][m0:m1]
            if len(chunk):
                ess[r] = float(np.mean(chunk))
        rec_loads = _factory_loads_ahead(load, i + 1 + ROWS_PER_EVENT, RECOVERY_MINUTES)
        rec_m, rec_ok = recovery_minutes(
            bid_kw=float(c["bid_kw"]),
            soc_after=float(ev["soc_end"]),
            factory_loads=rec_loads,
            pcs_kw=device.pcs_kw,
            e_nom=device.e_nom,
            soc_min=device.soc_min,
            soc_max=device.soc_max,
            charge_eff=device.charge_eff,
            anti_export_kw=device.anti_export_kw,
        )
        fail = ev["fail_reason"]
        if ev["strict_ok"] and not rec_ok:
            fail = "recovery"
        details.append(
            {
                "month": c["month"],
                "date": c["date"],
                "row": i,
                "bid_mw": c["bid_mw"],
                "cbl_kw": ev["cbl_kw"],
                "minute1_ok": ev["minute1_ok"],
                "strict_ok": bool(ev["strict_ok"] and rec_ok),
                "official_execution_pct": round(ev["official_execution_pct"], 2),
                "official_quality": ev["official_quality"],
                "delivered_kwh": round(ev["delivered_kwh"], 3),
                "official_kwh": round(ev["official_kwh"], 3),
                "max_required_kw": round(ev["max_required_kw"], 1),
                "recovery_minutes": rec_m,
                "fail_reason": fail,
                "below_platform_mw": c["bid_mw"] < 1.0,
            }
        )

    # 從頭重算 SOC／grid（事件後恢復由原 standby 意圖近似：非事件列保留原 ess 再夾 bounds）
    soc = device.initial_soc()
    grid_out = np.zeros(n, dtype=float)
    soc_out = np.zeros(n, dtype=float)
    ess_out = np.zeros(n, dtype=float)
    event_rows = set()
    for c in events:
        for k in range(ROWS_PER_EVENT):
            r = int(c["row"]) + 1 + k
            if r < n:
                event_rows.add(r)

    for r in range(n):
        lo, hi = device.bounds(soc, float(load[r]))
        desired = float(ess[r])
        if r not in event_rows:
            desired = float(disp["ess_kw"].iloc[r])
        e, soc = device.apply(desired, soc, float(load[r]))
        ess_out[r] = e
        grid_out[r] = float(load[r]) + e
        soc_out[r] = soc

    out["ess_kw"] = ess_out
    out["grid_kw"] = grid_out
    out["soc"] = soc_out
    if events:
        out["reserve_call"] = 0
        call = np.zeros(n, dtype=float)
        for c in events:
            for k in range(ROWS_PER_EVENT):
                r = int(c["row"]) + 1 + k
                if r < n:
                    call[r] = c["bid_kw"]
        out["reserve_call"] = call
    return out, details


def settle_income(
    df: pd.DataFrame,
    bids: pd.Series,
    event_details: list[dict[str, Any]],
    *,
    capacity_price: float,
    performance_price: float,
    energy_price: float,
    step_minutes: int = 60,
) -> dict[str, Any]:
    """容量／效能／調度電能 → reserve_income。

    容量與效能同一套：得標 MW × 1h × UI 單價 × 服務品質（1／0.7／0／−240）。
    第 1 分鐘／70 分鐘嚴格履約只影響事件判定與品質係數，不整月歸零效能費。
    """
    seen_hour: set[tuple[str, int]] = set()
    capacity = 0
    performance = 0
    monthly: dict[str, dict[str, Any]] = {}
    slot_rows = max(1, int(step_minutes) // DATA_INTERVAL_MINUTES)

    for i in range(len(df)):
        bid_mw = float(bids.iloc[i])
        if bid_mw <= 0:
            continue
        row = df.iloc[i]
        day = pd.Timestamp(row["date"]).strftime("%Y-%m-%d")
        hour = int(row["hour"]) if "hour" in df.columns and pd.notna(row.get("hour")) else 0
        key = (day, hour)
        if key in seen_hour:
            continue
        # min 為當日 15 分槽 0–95：取該小時代表列（區間結束＝最後一槽）
        if "min" in df.columns and pd.notna(row["min"]):
            if int(row["min"]) % slot_rows != slot_rows - 1:
                continue
        seen_hour.add(key)
        month = pd.Timestamp(row["date"]).strftime("%Y-%m")
        q = 1.0
        for ev in event_details:
            if ev["month"] == month and abs(int(ev["row"]) - i) <= slot_rows:
                q = float(ev["official_quality"])
                break
        cap_amt = money(bid_mw * 1.0 * capacity_price * q)
        perf_amt = money(bid_mw * 1.0 * performance_price * q)
        capacity += cap_amt
        performance += perf_amt
        bucket = monthly.setdefault(
            month,
            {
                "capacity": 0,
                "performance": 0,
                "activation_energy": 0,
                "total": 0,
                "bid_mwh": 0.0,
            },
        )
        bucket["capacity"] += cap_amt
        bucket["performance"] += perf_amt
        bucket["bid_mwh"] = float(bucket["bid_mwh"]) + bid_mw

    activation = 0
    for ev in event_details:
        # 電能收入用實際交付 MWh
        mwh = float(ev["delivered_kwh"]) / 1000.0
        amt = money(mwh * energy_price)
        activation += amt
        month = ev["month"]
        bucket = monthly.setdefault(
            month,
            {
                "capacity": 0,
                "performance": 0,
                "activation_energy": 0,
                "total": 0,
                "bid_mwh": 0,
            },
        )
        bucket["activation_energy"] += amt

    for bucket in monthly.values():
        bucket["total"] = (
            int(bucket["capacity"])
            + int(bucket["performance"])
            + int(bucket["activation_energy"])
        )

    total = capacity + performance + activation
    return {
        "capacity": capacity,
        "performance": performance,
        "activation_energy": activation,
        "total": total,
        "monthly": monthly,
        "events": event_details,
        "data_note": "15min_estimate",
    }


def run_reserve_layer(
    df: pd.DataFrame,
    standby: pd.DataFrame,
    device: Device,
    settings: dict[str, Any],
    *,
    step_minutes: int = 60,
) -> tuple[pd.DataFrame, pd.Series, dict[str, Any], dict[str, Any]]:
    """手動／已寫入矩陣之投標 → 事件 → 疊加調度 → 結算。"""
    prices = validate_inputs(settings)
    mode = str(settings.get("reserveScheduleMode") or "auto").lower()
    meta: dict[str, Any] = {"mode": mode, "data_note": "15min_estimate"}
    local_settings = dict(settings)

    if mode == "auto" and not local_settings.get("reserveSchedule"):
        sched, auto_meta = build_auto_schedule(
            df,
            standby,
            device,
            step_minutes=step_minutes,
            capacity_price=float(prices["capacity_price"]),
            performance_price=float(prices["performance_price"]),
        )
        local_settings["reserveSchedule"] = sched
        meta["auto"] = auto_meta
        meta["recommended_schedule"] = sched
    else:
        meta["recommended_schedule"] = local_settings.get("reserveSchedule")

    bids = resolve_bids_series(df, local_settings, step_minutes=step_minutes)
    events = select_monthly_events(
        df,
        standby,
        bids,
        device,
        monthly_count=int(prices["monthly_dispatch_count"]),
        step_minutes=step_minutes,
    )
    load = df["kW"].astype(float).to_numpy()
    grid = standby["grid_kw"].astype(float).to_numpy()
    soc = standby["soc"].astype(float).to_numpy()
    refreshed: list[dict[str, Any]] = []
    for c in events:
        i = int(c["row"])
        factory = _factory_loads_ahead(load, i + 1, EVENT_MINUTES)
        ev = simulate_event(
            bid_kw=float(c["bid_kw"]),
            cbl_kw=float(grid[i]),
            factory_loads=factory,
            soc0=float(soc[i]),
            pcs_kw=device.pcs_kw,
            e_nom=device.e_nom,
            soc_min=device.soc_min,
            soc_max=device.soc_max,
            charge_eff=device.charge_eff,
            anti_export_kw=device.anti_export_kw,
        )
        refreshed.append({**c, "event": ev})

    final_disp, details = apply_events_to_dispatch(df, standby, refreshed, device)
    income = settle_income(
        df,
        bids,
        details,
        capacity_price=float(prices["capacity_price"]),
        performance_price=float(prices["performance_price"]),
        energy_price=float(prices["energy_price"]),
        step_minutes=step_minutes,
    )
    meta["event_count"] = len(details)
    meta["inputs"] = prices
    return final_disp, bids, income, meta
