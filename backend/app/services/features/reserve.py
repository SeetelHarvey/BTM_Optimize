"""即時備轉"""

from typing import Any
import pandas as pd
from app.services.features import tou as tou_feat


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


def resolve_bids_series(
    df: pd.DataFrame,
    settings: dict[str, Any],
    *,
    step_minutes: int = 60,
) -> pd.Series:
    """整段 bid MW 序列。manual＝矩陣；auto＝暫全 0（推薦排程尚未實作）。"""
    mode = str(settings.get("reserveScheduleMode") or "auto").lower()
    sched = settings.get("reserveSchedule")
    bids: list[float] = []
    for i in range(len(df)):
        row = df.iloc[i]
        if mode == "manual":
            day_key = None
            slot = None
            if row.get("timestamp") is not None:
                day_key = tou_feat.schedule_day_key(
                    row["timestamp"],
                    is_holiday=bool(row.get("is_holiday", False)),
                )
            if "min" in row.index and pd.notna(row["min"]):
                slot = tou_feat.slot_index(
                    step_minutes=step_minutes,
                    data_min=int(row["min"]),
                )
            bids.append(
                _bid_from_manual(
                    season=row.get("season"),
                    day_key=day_key,
                    slot=slot,
                    schedule=sched,
                )
            )
        else:
            # ponytail: auto 推薦排程尚未做；bid=0，尖峰均分也不會被觸發
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
