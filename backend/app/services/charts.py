"""需量圖聚合：熱力／箱型／折線（pandas／numpy 聚合）。"""

from datetime import date, datetime
from typing import Any

import numpy as np
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


def _day_kind_array(dates: pd.Series, is_holiday: pd.Series | None) -> np.ndarray:
    """向量化日別。"""
    ts = pd.to_datetime(dates)
    wd = ts.dt.weekday.to_numpy()
    if is_holiday is None:
        hol = np.zeros(len(ts), dtype=bool)
    else:
        hol = is_holiday.fillna(False).astype(bool).to_numpy()
    hol = hol | (wd == 6)
    out = np.full(len(ts), "saturday", dtype=object)
    out[hol] = "holiday"
    out[(~hol) & (wd < 5)] = "weekday"
    return out


def _date_col(series: pd.Series) -> pd.Series:
    """統一成 date（向量化）。"""
    ts = pd.to_datetime(series)
    return ts.dt.date


def _prepare_work(df: pd.DataFrame) -> pd.DataFrame:
    """共用 date／hour／day_kind 欄。"""
    work = df.copy()
    work["_d"] = _date_col(work["date"])
    if "hour" in work.columns:
        work["_hour"] = work["hour"].astype(int)
    else:
        work["_hour"] = work["min"].astype(int) // 4
    hol = work["is_holiday"] if "is_holiday" in work.columns else None
    work["_kind"] = _day_kind_array(work["date"], hol)
    return work


def _five(s: pd.Series) -> dict[str, Any] | None:
    """Tukey：鬚＝fence 內 min/max；其餘為離群。"""
    if s.empty:
        return None
    return _five_np(s.astype(float).to_numpy())


def _five_np(vals: np.ndarray) -> dict[str, Any] | None:
    """Tukey（numpy）。"""
    if vals.size == 0:
        return None
    q1, med, q3 = np.quantile(vals, [0.25, 0.5, 0.75])
    q1, med, q3 = float(q1), float(med), float(q3)
    iqr = q3 - q1
    lo_f, hi_f = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    inside = vals[(vals >= lo_f) & (vals <= hi_f)]
    wlo = float(inside.min()) if inside.size else float(vals.min())
    whi = float(inside.max()) if inside.size else float(vals.max())
    outs = vals[(vals < wlo) | (vals > whi)]
    return {
        "n": int(vals.size),
        "min": float(vals.min()),
        "q1": q1,
        "median": med,
        "q3": q3,
        "max": float(vals.max()),
        "whisker_low": wlo,
        "whisker_high": whi,
        "outliers": [round(float(x), 3) for x in outs],
    }


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


def _line(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        return {"dates": [], "peak_kw": [], "mean_kw": []}
    work = df.copy()
    work["_d"] = _date_col(work["date"])
    g = work.groupby("_d", sort=True)["kW"]
    return {
        "dates": [d.isoformat() for d in g.mean().index],
        "peak_kw": [round(float(x), 3) for x in g.max().to_numpy()],
        "mean_kw": [round(float(x), 3) for x in g.mean().to_numpy()],
    }


def _boxplot_bucket(part: pd.DataFrame) -> dict[str, Any]:
    """單一季×日別：一次 groupby 小時。"""
    bucket: dict[str, Any] = {}
    if part.empty:
        return bucket
    for h, s in part.groupby("_hour", sort=True)["kW"]:
        stats = _five(s)
        if stats:
            bucket[str(int(h))] = stats
    return bucket


def _boxplot(df: pd.DataFrame) -> dict[str, Any]:
    hours = list(_HOURS)
    groups: dict[str, dict[str, dict[str, Any]]] = {
        sea: {day: {} for day in _DAYS} for sea in _SEASONS
    }
    if df.empty:
        return {"hours": hours, "groups": groups}

    work = _prepare_work(df)
    for sea in _SEASONS:
        part_s = work if sea == "all" else work[work["season"] == sea]
        for day in _DAYS:
            part = part_s if day == "all" else part_s[part_s["_kind"] == day]
            groups[sea][day] = _boxplot_bucket(part)
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

    work = _prepare_work(df)
    for sea in _SEASONS:
        part_s = work if sea == "all" else work[work["season"] == sea]
        for day in _DAYS:
            part = part_s if day == "all" else part_s[part_s["_kind"] == day]
            if part.empty:
                groups[sea][day] = {}
                continue
            means = part.groupby("_hour", sort=True)[col].mean()
            groups[sea][day] = {
                str(int(h)): round(float(v), 3) for h, v in means.items()
            }
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
