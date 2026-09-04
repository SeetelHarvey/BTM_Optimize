"""需量圖聚合：熱力／箱型／折線。"""

from datetime import date, datetime
from typing import Any

import pandas as pd

from app.services.schedule import DATA_INTERVAL_MINUTES, ROWS_PER_DAY

_HOURS = tuple(range(24))
_SEASONS = ("all", "summer", "non_summer")
_DAYS = ("all", "weekday", "holiday")


def _as_date(v) -> date:
    if isinstance(v, datetime):
        return v.date()
    if isinstance(v, date):
        return v
    return pd.Timestamp(v).date()


def _day_kind(d: date, is_holiday: bool) -> str:
    """假日＝國定假日或週日；平日＝週一～五且非假日；週六兩者皆非。"""
    if is_holiday or d.weekday() == 6:
        return "holiday"
    if d.weekday() < 5:
        return "weekday"
    return "saturday"


def _five(s: pd.Series) -> dict[str, Any] | None:
    """Tukey：鬚＝fence 內 min/max；其餘為離群。"""
    if s.empty:
        return None
    vals = s.astype(float)
    q = vals.quantile([0.25, 0.5, 0.75])
    q1, med, q3 = float(q.loc[0.25]), float(q.loc[0.5]), float(q.loc[0.75])
    iqr = q3 - q1
    lo_f, hi_f = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    inside = vals[(vals >= lo_f) & (vals <= hi_f)]
    wlo = float(inside.min()) if len(inside) else float(vals.min())
    whi = float(inside.max()) if len(inside) else float(vals.max())
    outs = vals[(vals < wlo) | (vals > whi)]
    return {
        "n": int(len(vals)),
        "min": float(vals.min()),
        "q1": q1,
        "median": med,
        "q3": q3,
        "max": float(vals.max()),
        "whisker_low": wlo,
        "whisker_high": whi,
        "outliers": [round(float(x), 3) for x in outs.to_numpy()],
    }


def _heatmap(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        return {"dates": [], "values": []}
    work = df.copy()
    work["_d"] = work["date"].map(_as_date)
    dates = sorted(work["_d"].unique())
    values: list[list[float | None]] = []
    for d in dates:
        row: list[float | None] = [None] * ROWS_PER_DAY
        part = work.loc[work["_d"] == d, ["min", "kW"]]
        for slot, kw in zip(part["min"].to_numpy(), part["kW"].to_numpy()):
            i = int(slot)
            if 0 <= i < ROWS_PER_DAY:
                row[i] = round(float(kw), 3)
        values.append(row)
    return {"dates": [d.isoformat() for d in dates], "values": values}


def _line(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        return {"dates": [], "peak_kw": [], "mean_kw": []}
    work = df.copy()
    work["_d"] = work["date"].map(_as_date)
    g = work.groupby("_d", sort=True)["kW"]
    return {
        "dates": [d.isoformat() for d in g.mean().index],
        "peak_kw": [round(float(x), 3) for x in g.max().to_numpy()],
        "mean_kw": [round(float(x), 3) for x in g.mean().to_numpy()],
    }


def _boxplot(df: pd.DataFrame) -> dict[str, Any]:
    hours = list(_HOURS)
    groups: dict[str, dict[str, dict[str, Any]]] = {
        sea: {day: {} for day in _DAYS} for sea in _SEASONS
    }
    if df.empty:
        return {"hours": hours, "groups": groups}

    work = df.copy()
    work["_d"] = work["date"].map(_as_date)
    if "hour" in work.columns:
        work["_hour"] = work["hour"].astype(int)
    else:
        work["_hour"] = work["min"].astype(int) // 4
    work["_kind"] = [
        _day_kind(d, bool(h)) for d, h in zip(work["_d"], work["is_holiday"])
    ]
    for sea in _SEASONS:
        part_s = work if sea == "all" else work[work["season"] == sea]
        for day in _DAYS:
            part = part_s if day == "all" else part_s[part_s["_kind"] == day]
            bucket: dict[str, Any] = {}
            for h in hours:
                stats = _five(part.loc[part["_hour"] == h, "kW"])
                if stats:
                    bucket[str(h)] = stats
            groups[sea][day] = bucket
    return {"hours": hours, "groups": groups}


def build_charts(df: pd.DataFrame, tou_type: str = "ThreeStage") -> dict[str, Any]:
    """15 分 kW → heatmap / boxplot / line。"""
    kw = df["kW"] if not df.empty else pd.Series(dtype=float)
    return {
        "data_interval_minutes": DATA_INTERVAL_MINUTES,
        "kW": {
            "min": float(kw.min()) if len(kw) else 0.0,
            "max": float(kw.max()) if len(kw) else 0.0,
        },
        "heatmap": _heatmap(df),
        "line": _line(df),
        "boxplot": _boxplot(df),
    }


def _series_range(df: pd.DataFrame, col: str) -> dict[str, float]:
    s = df[col] if col in df.columns else pd.Series(dtype=float)
    if s.empty:
        return {"min": 0.0, "max": 0.0}
    return {"min": float(s.min()), "max": float(s.max())}


def _heatmap_col(df: pd.DataFrame, col: str) -> dict[str, Any]:
    tmp = df.copy()
    tmp["kW"] = tmp[col]
    return _heatmap(tmp)


def _line_col(df: pd.DataFrame, col: str) -> dict[str, Any]:
    tmp = df.copy()
    tmp["kW"] = tmp[col]
    return _line(tmp)


def _boxplot_col(df: pd.DataFrame, col: str) -> dict[str, Any]:
    tmp = df.copy()
    tmp["kW"] = tmp[col]
    return _boxplot(tmp)


def _hourly_mean(df: pd.DataFrame, col: str) -> dict[str, Any]:
    """各季×日別×小時平均。"""
    hours = list(_HOURS)
    groups: dict[str, dict[str, dict[str, float]]] = {
        sea: {day: {} for day in _DAYS} for sea in _SEASONS
    }
    if df.empty or col not in df.columns:
        return {"hours": hours, "groups": groups}

    work = df.copy()
    work["_d"] = work["date"].map(_as_date)
    if "hour" in work.columns:
        work["_hour"] = work["hour"].astype(int)
    else:
        work["_hour"] = work["min"].astype(int) // 4
    work["_kind"] = [
        _day_kind(d, bool(h)) for d, h in zip(work["_d"], work["is_holiday"])
    ]
    for sea in _SEASONS:
        part_s = work if sea == "all" else work[work["season"] == sea]
        for day in _DAYS:
            part = part_s if day == "all" else part_s[part_s["_kind"] == day]
            bucket: dict[str, float] = {}
            for h in hours:
                vals = part.loc[part["_hour"] == h, col].astype(float)
                if vals.empty:
                    continue
                bucket[str(h)] = round(float(vals.mean()), 3)
            groups[sea][day] = bucket
    return {"hours": hours, "groups": groups}


_DISPATCH_SERIES = ("load_kw", "ess_kw", "net_kw", "soc_pct")


def build_dispatch_charts(df: pd.DataFrame, disp: pd.DataFrame) -> dict[str, Any]:
    """建議量體 dispatch → 熱力／箱型／折線／時均（放電正、充電負；淨負載＝原始−儲能）。"""
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
        "ranges": {k: _series_range(work, k) for k in _DISPATCH_SERIES},
        "heatmap": {k: _heatmap_col(work, k) for k in _DISPATCH_SERIES},
        "line": {k: _line_col(work, k) for k in _DISPATCH_SERIES},
        "boxplot": {k: _boxplot_col(work, k) for k in _DISPATCH_SERIES},
        "hourly_mean": {k: _hourly_mean(work, k) for k in _DISPATCH_SERIES},
    }


def _selfcheck() -> None:
    """合成 2 日 → heatmap 2×96、line 2 點、summer+holiday n。"""
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
    assert len(out["line"]["dates"]) == 2
    assert len(out["line"]["peak_kw"]) == 2
    assert out["boxplot"]["hours"] == list(range(24))
    hol = out["boxplot"]["groups"]["summer"]["holiday"]
    assert hol["0"]["n"] == 4
    assert len(hol) == 24
    wd = out["boxplot"]["groups"]["summer"]["weekday"]
    assert wd["0"]["n"] == 4
    both = out["boxplot"]["groups"]["all"]["all"]
    assert both["0"]["n"] == 8
    spike = _five(pd.Series([1.0, 1.0, 1.0, 1.0, 100.0]))
    assert spike is not None
    assert spike["whisker_high"] == 1.0
    assert spike["outliers"] == [100.0]
    print("charts selfcheck ok")


if __name__ == "__main__":
    _selfcheck()
