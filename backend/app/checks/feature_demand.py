"""demand 併網硬上限 + 削峰意圖自檢。"""

from app.services.contracts import ContractCapacity
from app.services.features import demand


def main() -> None:
    c = ContractCapacity(regular_kw=1000)
    out = demand.intent(
        load_kw=1050,
        period="peak",
        month="2024-07",
        contracts=c,
        tou_type="ThreeStage",
        buffer_kw=10,
    )
    assert out["needs_shave"] is True
    assert out["desired_ess_kw"] == -60.0

    ok = demand.intent(
        load_kw=500,
        period="peak",
        month="2024-07",
        contracts=c,
        tou_type="ThreeStage",
        buffer_kw=10,
    )
    assert ok["needs_shave"] is False
    assert ok["desired_ess_kw"] == 0.0

    lo, hi = demand.narrow_grid_cap(-200.0, 500.0, load_kw=350.0, cap_kw=800.0)
    assert hi == 450.0
    assert lo == -200.0

    lo2, hi2 = demand.narrow_grid_cap(-200.0, 500.0, load_kw=920.0, cap_kw=800.0)
    assert hi2 == -120.0

    cap = demand.cap_kw_for_row(
        period="peak",
        month="2024-07",
        contracts=c,
        tou_type="ThreeStage",
        buffer_kw=10,
    )
    assert cap == 990.0
    print("ok", out, ok, hi, hi2)


if __name__ == "__main__":
    main()
