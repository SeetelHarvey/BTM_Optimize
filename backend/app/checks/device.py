"""Device：PCS／SOC／效率／不逆送夾得住，SOC 依 η 更新。"""

from app.services.bess.device import Device, grid_kw
from app.services.schedule import hours_per_data_row


def main() -> None:
    d = Device(
        pcs_kw=100,
        batt_kwh=200,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.85,
        anti_export_kw=0,
    )
    soc = d.initial_soc()
    assert 0.1 <= soc <= 0.9

    ess, soc2 = d.apply(50, soc, load_kw=80)
    assert ess == 50
    dt = hours_per_data_row()
    expect = soc + (50 * dt * 0.85) / 200
    assert abs(soc2 - expect) < 1e-9
    assert abs(grid_kw(80, ess) - 130) < 1e-9

    ess_hi, _ = d.apply(999, soc2, load_kw=80)
    assert ess_hi == 100

    ess_d, soc3 = d.apply(-40, soc2, load_kw=80)
    assert ess_d == -40
    expect_d = soc2 - (40 * dt / 0.85) / 200
    assert abs(soc3 - expect_d) < 1e-9

    # 防逆送：load 已低於門檻 → 不強制充電；可閒置，不可再放電打穿
    d2 = Device(
        pcs_kw=100,
        batt_kwh=200,
        soc_min=0.1,
        soc_max=0.9,
        charge_eff=0.85,
        anti_export_kw=10,
    )
    lo, hi = d2.bounds(0.5, load_kw=5)
    assert lo == 0.0
    assert hi > 0
    ess_idle, _ = d2.apply(-100, 0.5, load_kw=5)
    assert ess_idle == 0.0
    ess_chg, _ = d2.apply(50, 0.5, load_kw=5)
    assert ess_chg == 50  # 允許主動充電，但不被硬逼

    # SOC 已滿且 load < anti → 閒置，不充電
    lo_full, hi_full = d2.bounds(0.9, load_kw=5)
    assert hi_full == 0.0
    assert lo_full == 0.0
    ess_full, soc_full = d2.apply(100, 0.9, load_kw=5)
    assert ess_full == 0.0
    assert abs(soc_full - 0.9) < 1e-9

    # load 夠高：放電下限 = anti − load（grid 不低於 anti）
    lo_ok, hi_ok = d2.bounds(0.5, load_kw=50)
    assert lo_ok == -40.0
    ess_dis, _ = d2.apply(-100, 0.5, load_kw=50)
    assert ess_dis == -40.0
    assert grid_kw(50, ess_dis) >= 10.0 - 1e-9

    lo_f, hi_f = d.bounds(0.9, load_kw=50)
    assert hi_f == 0
    print("ok", "soc0=", soc, "after_charge=", soc2, "after_discharge=", soc3)


if __name__ == "__main__":
    main()
