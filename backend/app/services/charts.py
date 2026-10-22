"""需量圖聚合：15 分 kW 收成每天 × 96 格。"""

from datetime import date
from typing import Any

import numpy as np
import pandas as pd

from app.services.schedule import DATA_INTERVAL_MINUTES, ROWS_PER_DAY


def _day_kind(d: date, is_holiday: bool) -> str:
    """假日＝國定假日或週日；平日＝週一～五且非假日；週六兩者皆非。"""
    if is_holiday or d.weekday() == 6:
        return "holiday"
    if d.weekday() < 5:
        return "weekday"
    return "saturday"


def _date_col(series: pd.Series) -> pd.Series:
    """統一成 date（向量化）。"""
    ts = pd.to_datetime(series)
    return ts.dt.date


def _heatmap(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        return {"dates": [], "values": [], "date_meta": {}}
    work = df.copy()
    work["_d"] = _date_col(work["date"])
    work["_min"] = work["min"].astype(int)
    work["_kw"] = work["kW"].astype(float)
    piv = work.pivot_table(index="_d", columns="_min", values="_kw", aggfunc="last")
    piv = piv.reindex(columns=list(range(ROWS_PER_DAY)))
    dates = sorted(piv.index)
    piv = piv.reindex(dates)
    raw = piv.to_numpy()
    values: list[list[float | None]] = []
    for row in raw:
        values.append(
            [
                None
                if (v is None or (isinstance(v, float) and np.isnan(v)))
                else round(float(v), 3)
                for v in row
            ]
        )

    firsts = work.sort_values("_min").groupby("_d", sort=True).first()
    date_meta: dict[str, dict[str, str]] = {}
    for d in dates:
        sea = "all"
        hol = False
        if d in firsts.index:
            if "season" in firsts.columns:
                sea = str(firsts.loc[d, "season"])
            if "is_holiday" in firsts.columns:
                hol = bool(firsts.loc[d, "is_holiday"])
        date_meta[d.isoformat()] = {
            "season": sea,
            "day_kind": _day_kind(d, hol),
            "month": f"{d.year:04d}-{d.month:02d}",
        }
    return {
        "dates": [d.isoformat() for d in dates],
        "values": values,
        "date_meta": date_meta,
    }


def build_charts(df: pd.DataFrame, tou_type: str = "ThreeStage") -> dict[str, Any]:
    """15 分 kW → 每天 × 96 格。"""
    return {
        "data_interval_minutes": DATA_INTERVAL_MINUTES,
        "heatmap": _heatmap(df),
    }


def _heatmap_col(df: pd.DataFrame, col: str) -> dict[str, Any]:
    tmp = df.copy()
    tmp["kW"] = tmp[col]
    return _heatmap(tmp)


_DISPATCH_SERIES = ("load_kw", "ess_kw", "net_kw", "soc_pct")


def build_dispatch_charts(df: pd.DataFrame, disp: pd.DataFrame) -> dict[str, Any]:
    """建議量體 dispatch → 四條序列的每天 × 96 格（放電正、充電負；淨負載＝原始−儲能）。"""
    work = df.copy()
    work["load_kw"] = work["kW"].astype(float)
    ess_raw = disp["ess_kw"].astype(float)
    work["ess_kw"] = -ess_raw
    work["net_kw"] = work["load_kw"] - work["ess_kw"]
    work["soc_pct"] = disp["soc"].astype(float) * 100.0
    grid = work["load_kw"] + ess_raw
    if float(grid.sub(work["net_kw"]).abs().max()) >= 1e-6:
        raise ValueError("net_kw must equal load_kw - ess_kw")
    return {
        "data_interval_minutes": DATA_INTERVAL_MINUTES,
        "heatmap": {k: _heatmap_col(work, k) for k in _DISPATCH_SERIES},
    }


def _selfcheck() -> None:
    """合成 2 日 → heatmap 2×96、第一格 10.0。"""
    rows = []
    d1 = date(2024, 7, 1)  # Mon summer
    d2 = date(2024, 7, 7)  # Sun summer
    for i in range(ROWS_PER_DAY):
        rows.append(
            {
                "date": d1,
                "min": i,
                "kW": 10.0 + i * 0.01,
                "season": "summer",
                "is_holiday": False,
                "period": "peak",
            }
        )
        rows.append(
            {
                "date": d2,
                "min": i,
                "kW": 5.0,
                "season": "summer",
                "is_holiday": False,
                "period": "off_peak",
            }
        )
    out = build_charts(pd.DataFrame(rows), "ThreeStage")
    assert len(out["heatmap"]["dates"]) == 2
    assert len(out["heatmap"]["values"]) == 2
    assert all(len(r) == ROWS_PER_DAY for r in out["heatmap"]["values"])
    assert out["heatmap"]["values"][0][0] == 10.0
    print("charts selfcheck ok")


if __name__ == "__main__":
    _selfcheck()
