"""實際功率矩陣聚合：15 分 ess_kw → TOU 時段平均（與 frontend aggregateEssKwToTouMatrix 對齊）。"""


def schedule_day_from_heatmap_kind(kind: str) -> str:
    if kind == "holiday":
        return "sunday"
    if kind == "saturday":
        return "saturday"
    return "weekday"


def aggregate_ess_kw_to_tou_matrix(ess_heatmap: dict, slot_minutes: int = 60) -> dict:
    step = max(1, int(slot_minutes or 60))
    n = round((24 * 60) / step)
    per_slot = max(1, round(step / 15))
    buckets = {
        sea: {day: [[] for _ in range(n)] for day in ("weekday", "saturday", "sunday")}
        for sea in ("summer", "non_summer")
    }
    dates = ess_heatmap.get("dates") or []
    values = ess_heatmap.get("values") or []
    meta = ess_heatmap.get("date_meta") or {}
    for di, d in enumerate(dates):
        m = meta.get(d) or {}
        season = m.get("season")
        if season not in ("summer", "non_summer"):
            continue
        day = schedule_day_from_heatmap_kind(str(m.get("day_kind") or ""))
        row = values[di] if di < len(values) else []
        for slot in range(n):
            i0 = slot * per_slot
            i1 = min(len(row), i0 + per_slot)
            for i in range(i0, i1):
                v = row[i]
                if v is None:
                    continue
                try:
                    buckets[season][day][slot].append(float(v))
                except (TypeError, ValueError):
                    continue
    out: dict = {}
    for season in ("summer", "non_summer"):
        out[season] = {}
        for day in ("weekday", "saturday", "sunday"):
            out[season][day] = [
                None if not arr else round(sum(arr) / len(arr), 1)
                for arr in buckets[season][day]
            ]
    return out


def main() -> None:
    # 1 夏平日：0–3 槽放電 40；4–7 充電 -20 → 小時槽 0 平均 40、槽 1 平均 -20
    hm = {
        "dates": ["2024-07-01"],
        "values": [[40.0] * 4 + [-20.0] * 4 + [0.0] * 88],
        "date_meta": {"2024-07-01": {"season": "summer", "day_kind": "weekday"}},
    }
    out = aggregate_ess_kw_to_tou_matrix(hm, 60)
    assert out["summer"]["weekday"][0] == 40.0
    assert out["summer"]["weekday"][1] == -20.0
    assert out["summer"]["weekday"][2] == 0.0
    # 假日 → sunday 列
    hm2 = {
        "dates": ["2024-07-07"],
        "values": [[10.0] * 96],
        "date_meta": {"2024-07-07": {"season": "summer", "day_kind": "holiday"}},
    }
    out2 = aggregate_ess_kw_to_tou_matrix(hm2, 60)
    assert out2["summer"]["sunday"][0] == 10.0
    assert out2["summer"]["weekday"][0] is None
    print("pcs_power_matrix ok")


if __name__ == "__main__":
    main()
