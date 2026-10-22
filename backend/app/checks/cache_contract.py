"""快取鍵與契約規則自檢。"""

from app.services import import_cache
from app.services.contract_rules import ContractCapacity, schema, validate


def main() -> None:
    """檢查正式流程共用的快取鍵與契約欄位。"""
    import_cache._selfcheck()
    batch = schema("BatchStage")
    assert batch["tier2_field"] == "non_summer_kw"
    assert "non_summer_kw" in batch["fields"]
    normalized = validate(
        ContractCapacity(regular_kw=100, half_peak_kw=20, non_summer_kw=30),
        "BatchStage",
    )
    assert normalized.half_peak_kw == 0
    assert normalized.non_summer_kw == 30
    print("cache_contract ok")


if __name__ == "__main__":
    main()
