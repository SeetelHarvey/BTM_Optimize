"""即時備轉：需量反應履約估算、自動投標、額外收益結算。"""

from __future__ import annotations

import math
from typing import Any

import numpy as np
import pandas as pd

from app.services.bess.device import Device
from app.services.contract_rules import money
from app.services.features import tou as tou_feat
from app.services.schedule import DATA_INTERVAL_MINUTES, hours_per_data_row

EVENT_MINUTES = 70
RECOVERY_MINUTES = 120
OFFICIAL_WINDOW_START = 10  # 指令後第 10～69 分
OFFICIAL_WINDOW_LEN = 60
MW_STEP = 0.1


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


def service_quality_standby(execution_pct: float) -> float:
    """待命品質：≥95→1，≥85→0.7，≥70→0，低於 70→−1。"""
    x = float(execution_pct)
    if x >= 95.0:
        return 1.0
    if x >= 85.0:
        return 0.7
    if x >= 70.0:
        return 0.0
    return -1.0


def service_quality(execution_pct: float) -> float:
    """被調度品質：級距與待命相同，低於 70% 為 −240。"""
    if float(execution_pct) < 70.0:
        return -240.0
    return service_quality_standby(execution_pct)


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
    """全 0 的 24 格投標矩陣。即時備轉固定一小時，不跟時間電價的 30 分。"""
    del step_minutes
    z = [0.0] * 24
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
    del step_minutes
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
        if "hour" in row.index and pd.notna(row.get("hour")):
            slot = int(row["hour"])
        elif "min" in row.index and pd.notna(row["min"]):
            # min 為當日 15 分槽 0–95
            slot = int(row["min"]) // 4
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
    """依已採用調度的每小時最小淨負載第 5 百分位產生 24 格投標。

    15 分資料看不到該格裡面的分鐘起伏。投標取該小時最小值，不先平均。
    """
    del device, step_minutes
    sched = empty_schedule()
    day_keys: list[str | None] = []
    for i in range(len(df)):
        row = df.iloc[i]
        hol = bool(row.get("is_holiday", False))
        key = None
        if "date" in row.index and pd.notna(row.get("date")):
            key = tou_feat.schedule_day_key(row["date"], is_holiday=hol)
        elif row.get("timestamp") is not None:
            from app.services.cleaning.formats.tpc import interval_date

            key = tou_feat.schedule_day_key(
                interval_date(row["timestamp"]), is_holiday=hol
            )
        day_keys.append(key)
    if "hour" in df.columns:
        hours = df["hour"].astype(int)
    elif "min" in df.columns:
        hours = df["min"].astype(int) // 4
    else:
        hours = pd.Series(0, index=df.index)
    season = (
        df["season"].astype(str).to_numpy()
        if "season" in df.columns
        else [""] * len(df)
    )
    dates = (
        pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
        if "date" in df.columns
        else pd.Series("", index=df.index)
    )
    work = pd.DataFrame(
        {
            "season": season,
            "day_key": day_keys,
            "date": dates,
            "hour": hours.to_numpy(),
            "grid_kw": standby["grid_kw"].astype(float).to_numpy(),
        }
    )
    work = work[work["season"].isin(["summer", "non_summer"]) & work["day_key"].notna()]
    if work.empty:
        return sched, {
            "cells_positive": 0,
            "buckets": 0,
            "estimate": "p05_hour_min",
            "slot_count": 24,
        }
    mins = (
        work.groupby(["season", "day_key", "date", "hour"], sort=False)["grid_kw"]
        .min()
        .reset_index()
    )
    meta_cells = 0
    buckets = 0
    for (season_key, day_key, hour), part in mins.groupby(
        ["season", "day_key", "hour"], sort=False
    ):
        buckets += 1
        mw = quantize_mw(_percentile(part["grid_kw"].tolist(), 5) / 1000.0)
        if mw > 0 and (capacity_price + performance_price) <= 0:
            mw = 0.0
        slot = int(hour)
        if season_key in sched and day_key in sched[season_key] and 0 <= slot < 24:
            sched[season_key][day_key][slot] = mw
            if mw > 0:
                meta_cells += 1
    return sched, {
        "cells_positive": meta_cells,
        "buckets": buckets,
        "estimate": "p05_hour_min",
        "slot_count": 24,
        "step_minutes": 60,
    }


def hourly_reserve_table(
    df: pd.DataFrame,
    disp: pd.DataFrame,
    bids: pd.Series,
    *,
    monthly_dispatch_count: int,
) -> pd.DataFrame:
    """每個時鐘小時一列。15 分進同一小時後取 min／max，不先平均。

    待命執行率＝該小時最小淨負載 / 投標。
    被調度執行率＝(前一小時最後一格基準線 − 該小時最高淨負載) / 投標。
    """
    work = pd.DataFrame(
        {
            "date": pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d"),
            "hour": df["hour"].astype(int).to_numpy(),
            "grid_kw": disp["grid_kw"].astype(float).to_numpy(),
            "bid_mw": pd.Series(bids).astype(float).to_numpy(),
        }
    )
    if "min" in df.columns:
        work["min"] = pd.to_numeric(df["min"], errors="coerce").to_numpy()
        work = work.sort_values(["date", "hour", "min"], kind="mergesort")
    out = (
        work.groupby(["date", "hour"], sort=False)
        .agg(
            grid_min_kw=("grid_kw", "min"),
            grid_max_kw=("grid_kw", "max"),
            grid_last_kw=("grid_kw", "last"),
            bid_mw=("bid_mw", "max"),
        )
        .reset_index()
    )
    # 基準線＝這一小時開始前的最後一格 15 分淨負載
    out["cbl_kw"] = out["grid_last_kw"].shift(1)
    out["month"] = out["date"].str.slice(0, 7)
    bid_kw = out["bid_mw"] * 1000.0
    out["standby_pct"] = 0.0
    has_bid = bid_kw > 0
    out.loc[has_bid, "standby_pct"] = (
        out.loc[has_bid, "grid_min_kw"] / bid_kw[has_bid] * 100.0
    )
    out["dispatched"] = False
    if monthly_dispatch_count > 0:
        picked: list[int] = []
        for _, part in out[has_bid].groupby("month", sort=False):
            worst = part.sort_values(["standby_pct", "date", "hour"]).head(
                int(monthly_dispatch_count)
            )
            picked.extend(int(i) for i in worst.index)
        if picked:
            out.loc[picked, "dispatched"] = True
    out.loc[out["cbl_kw"].isna(), "dispatched"] = False
    out["execution_pct"] = out["standby_pct"]
    called = out["dispatched"]
    out.loc[called, "execution_pct"] = (
        (out.loc[called, "cbl_kw"] - out.loc[called, "grid_max_kw"])
        / (out.loc[called, "bid_mw"] * 1000.0)
        * 100.0
    )
    cbl_map = out.set_index(["date", "hour"])["cbl_kw"]
    work = work.merge(
        out.loc[out["dispatched"], ["date", "hour"]],
        on=["date", "hour"],
        how="inner",
    )
    if work.empty:
        out["reduction_kwh"] = 0.0
        return out
    work["cbl_kw"] = [
        float(cbl_map.loc[(d, h)]) for d, h in zip(work["date"], work["hour"])
    ]
    dt_h = hours_per_data_row()
    work["drop_kwh"] = (work["cbl_kw"] - work["grid_kw"]).clip(lower=0) * dt_h
    red = work.groupby(["date", "hour"], sort=False)["drop_kwh"].sum()
    out = out.merge(red.rename("reduction_kwh"), on=["date", "hour"], how="left")
    out["reduction_kwh"] = out["reduction_kwh"].fillna(0.0)
    return out


def income_from_hours(
    hours: pd.DataFrame,
    *,
    capacity_price: float,
    performance_price: float,
    energy_price: float,
) -> dict[str, Any]:
    """每個得標小時：容量與效能各四捨五入一次；被調度才加實際壓低電量的電能費。"""
    capacity = 0
    performance = 0
    activation = 0
    monthly: dict[str, dict[str, Any]] = {}
    for row in hours.itertuples(index=False):
        bid_mw = float(row.bid_mw)
        if bid_mw <= 0:
            continue
        q = (
            service_quality(row.execution_pct)
            if row.dispatched
            else service_quality_standby(row.execution_pct)
        )
        cap_amt = money(bid_mw * capacity_price * q)
        perf_amt = money(bid_mw * performance_price * q)
        energy_amt = (
            money(float(row.reduction_kwh) / 1000.0 * energy_price)
            if row.dispatched
            else 0
        )
        capacity += cap_amt
        performance += perf_amt
        activation += energy_amt
        bucket = monthly.setdefault(
            row.month,
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
        bucket["activation_energy"] += energy_amt
        bucket["bid_mwh"] = float(bucket["bid_mwh"]) + bid_mw
    for bucket in monthly.values():
        bucket["total"] = (
            int(bucket["capacity"])
            + int(bucket["performance"])
            + int(bucket["activation_energy"])
        )
    return {
        "capacity": capacity,
        "performance": performance,
        "activation_energy": activation,
        "total": capacity + performance + activation,
        "monthly": monthly,
        "hour_count": int(len(hours)),
        "events": [],
        "data_note": "15min_estimate",
    }


def mark_reserve_calls(
    df: pd.DataFrame,
    disp: pd.DataFrame,
    hours: pd.DataFrame,
) -> pd.DataFrame:
    """被調度小時的 4 列標 reserve_call（kW）。不改 ess／grid／soc。"""
    out = disp.copy()
    called = hours.loc[hours["dispatched"], ["date", "hour", "bid_mw"]]
    keys = pd.DataFrame(
        {
            "date": pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d"),
            "hour": df["hour"].astype(int).to_numpy(),
        }
    )
    if called.empty:
        out["reserve_call"] = 0.0
        return out
    merged = keys.merge(called, on=["date", "hour"], how="left")
    out["reserve_call"] = merged["bid_mw"].fillna(0.0).to_numpy() * 1000.0
    return out


def run_reserve_layer(
    df: pd.DataFrame,
    standby: pd.DataFrame,
    device: Device,
    settings: dict[str, Any],
    *,
    step_minutes: int = 60,
) -> tuple[pd.DataFrame, pd.Series, dict[str, Any], dict[str, Any]]:
    """已寫入矩陣之投標 → 同一張小時表結算，並標被調度小時。"""
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
    hours = hourly_reserve_table(
        df,
        standby,
        bids,
        monthly_dispatch_count=int(prices["monthly_dispatch_count"]),
    )
    income = income_from_hours(
        hours,
        capacity_price=float(prices["capacity_price"]),
        performance_price=float(prices["performance_price"]),
        energy_price=float(prices["energy_price"]),
    )
    final_disp = mark_reserve_calls(df, standby, hours)
    meta["event_count"] = int(hours["dispatched"].sum())
    meta["inputs"] = prices
    return final_disp, bids, income, meta

