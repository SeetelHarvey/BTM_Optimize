"""demand 併網硬上限 + 削峰意圖自檢。"""

from app.services.contract_rules import ContractCapacity
from app.services.features import grid_cap


def main() -> None:
    settings = {"bufferPct": 3}
    assert grid_cap.suggested_buffer_kw(1000, settings) == 30.0
    assert grid_cap.suggested_buffer_kw(333, settings) == 10.0  # 9.99 → 10
    assert grid_cap.scaled_buffer_kw(1000, settings) == 30.0
    assert grid_cap.seed_buffer_kw(settings, contract_kw=1000) == 30.0
    # 使用者填寫優先，向遠離 0 取 10
    assert grid_cap.resolve_buffer_kw(
        {"bufferPct": 3, "demandBufferKw": 12}, contract_kw=1000, key="demandBufferKw"
    ) == 20.0
    assert grid_cap.resolve_buffer_kw(
        {"bufferPct": 3, "antiExportKw": 8}, contract_kw=1000, key="antiExportKw"
    ) == 10.0
    assert grid_cap.scaled_buffer_kw(1000, {"demandBufferKw": 10}) == 10.0
    # 負裕度：未勾 demand 可生效；勾 demand 夾到 0
    assert grid_cap.resolve_buffer_kw(
        {"demandBufferKw": -12, "functions": ["tou"]},
        contract_kw=1000,
        key="demandBufferKw",
    ) == -20.0
    assert grid_cap.resolve_buffer_kw(
        {"demandBufferKw": -12, "functions": ["tou", "demand"]},
        contract_kw=1000,
        key="demandBufferKw",
    ) == 0.0
    assert grid_cap.resolve_buffer_kw(
        {"antiExportKw": -8}, contract_kw=1000, key="antiExportKw"
    ) == 0.0
    # 負 buffer → 運行 cap 高於契約 ceiling
    assert (
        grid_cap.cap_kw_for_row(
            period="peak",
            month="2024-07",
            contracts=ContractCapacity(regular_kw=1000),
            tou_type="ThreeStage",
            buffer_kw=-100,
        )
        == 1100.0
    )

    c = ContractCapacity(regular_kw=1000)
    out = grid_cap.intent(
        load_kw=1050,
        period="peak",
        month="2024-07",
        contracts=c,
        tou_type="ThreeStage",
        buffer_kw=10,
    )
    assert out["needs_shave"] is True
    assert out["desired_ess_kw"] == -60.0

    ok = grid_cap.intent(
        load_kw=500,
        period="peak",
        month="2024-07",
        contracts=c,
        tou_type="ThreeStage",
        buffer_kw=10,
    )
    assert ok["needs_shave"] is False
    assert ok["desired_ess_kw"] == 0.0

    lo, hi = grid_cap.narrow_grid_cap(-200.0, 500.0, load_kw=350.0, cap_kw=800.0)
    assert hi == 450.0
    assert lo == -200.0

    lo2, hi2 = grid_cap.narrow_grid_cap(-200.0, 500.0, load_kw=920.0, cap_kw=800.0)
    assert hi2 == -120.0

    cap = grid_cap.cap_kw_for_row(
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
