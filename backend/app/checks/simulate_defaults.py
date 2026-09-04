"""模擬預設 JSON 可讀、欄位齊全。"""

from app.services.settings import default_settings, default_simulate


def main() -> None:
    sim = default_simulate()
    assert 0 <= sim["socMin"] < sim["socMax"] <= 1
    assert 0.5 <= sim["chargeEff"] <= 1
    assert "calendarDeg" not in sim
    bundle = default_settings()
    assert "simulate" in bundle
    print("ok", sorted(sim.keys()))


if __name__ == "__main__":
    main()
