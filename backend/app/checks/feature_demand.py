"""demand 併網硬上限 + 削峰意圖自檢。"""

from app.services.contracts import ContractCapacity
from app.services.features import demand


def main() -> None:
    settings = {"bufferPct": 3}
    assert demand.suggested_buffer_kw(1000, settings) == 30.0
    assert demand.suggested_buffer_kw(333, settings) == 10.0  # 9.99 → 10
    assert demand.scaled_buffer_kw(1000, settings) == 30.0
    assert demand.seed_buffer_kw(settings, contract_kw=1000) == 30.0
    # 使用者填寫優先，同樣向上取 10
    assert demand.resolve_buffer_kw(
        {"bufferPct": 3, "demandBufferKw": 12}, contract_kw=1000, key="demandBufferKw"
    ) == 20.0
    assert demand.resolve_buffer_kw(
        {"bufferPct": 3, "antiExportKw": 8}, contract_kw=1000, key="antiExportKw"
    ) == 10.0
    assert demand.scaled_buffer_kw(1000, {"demandBufferKw": 10}) == 10.0

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
