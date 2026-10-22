"""匯入後的清理序列：行程內短命暫存（同時只留一筆）。"""

import logging
import time
import uuid
from collections import OrderedDict
from dataclasses import dataclass, field
from typing import Any

import pandas as pd

log = logging.getLogger(__name__)

TTL_SEC = 3600
# 最終 15 分工作表最多三份；第四份淘汰最久未用
FINAL_WORKSHEET_LRU_MAX = 3
_FINAL_LRU_ORDER = "_final_ws_lru"


class ImportNotFound(KeyError):
    """import_id 過期或不存在。"""


@dataclass
class ImportedLoad:
    df: pd.DataFrame
    voltage_level: str
    tou_type: str
    start_date: str
    end_date: str
    created: float
    # L1 工作 df／L2 profile／sample 等；put 換檔即丟
    caches: dict[str, Any] = field(default_factory=dict)


@dataclass
class _Slot:
    import_id: str
    load: ImportedLoad


_slot: _Slot | None = None


def _purge() -> None:
    global _slot
    if _slot is None:
        return
    if time.monotonic() - _slot.load.created > TTL_SEC:
        _slot = None


def _remaining_sec(item: ImportedLoad, now: float | None = None) -> float:
    t0 = now if now is not None else time.monotonic()
    return max(0.0, TTL_SEC - (t0 - item.created))


def peek(import_id: str) -> ImportedLoad:
    """查暫存；不續期。"""
    _purge()
    if _slot is None or _slot.import_id != import_id:
        raise ImportNotFound(import_id)
    return _slot.load


def status(import_id: str) -> dict:
    """是否仍在、剩餘秒數（不含 df）。"""
    item = peek(import_id)
    return {
        "import_id": import_id,
        "row_count": len(item.df),
        "voltage_level": item.voltage_level,
        "tou_type": item.tou_type,
        "start_date": item.start_date,
        "end_date": item.end_date,
        "remaining_sec": round(_remaining_sec(item), 1),
        "ttl_sec": TTL_SEC,
    }


def put(
    df: pd.DataFrame,
    *,
    voltage_level: str,
    tou_type: str,
    start_date: str,
    end_date: str,
) -> str:
    """寫入並取代上一筆暫存。"""
    global _slot
    iid = uuid.uuid4().hex
    _slot = _Slot(
        import_id=iid,
        load=ImportedLoad(
            df=df,
            voltage_level=voltage_level,
            tou_type=tou_type,
            start_date=start_date,
            end_date=end_date,
            created=time.monotonic(),
        ),
    )
    log.info("import stored %s rows=%s", iid, len(df))
    return iid


def get(import_id: str) -> ImportedLoad:
    """讀暫存並續期（操作中不會因閒置上限被清）。"""
    item = peek(import_id)
    item.created = time.monotonic()
    log.info("import hit %s rows=%s", import_id, len(item.df))
    return item


def delete(import_id: str) -> bool:
    """刪除暫存；不存在也當成功（前端清狀態用）。"""
    global _slot
    _purge()
    if _slot is None or _slot.import_id != import_id:
        return False
    _slot = None
    log.info("import deleted %s", import_id)
    return True


def put_final_bundle(caches: dict[str, Any], fingerprint: str, bundle: dict[str, Any]) -> None:
    """寫入最終 bundle；同一鍵觸碰排序，超過三份淘汰最舊。"""
    order: OrderedDict[str, None]
    raw = caches.get(_FINAL_LRU_ORDER)
    if isinstance(raw, OrderedDict):
        order = raw
    elif isinstance(raw, list):
        order = OrderedDict((k, None) for k in raw if isinstance(k, str))
    else:
        order = OrderedDict()
    if fingerprint in order:
        order.move_to_end(fingerprint)
    else:
        order[fingerprint] = None
    caches[fingerprint] = bundle
    while len(order) > FINAL_WORKSHEET_LRU_MAX:
        old, _ = order.popitem(last=False)
        caches.pop(old, None)
    caches[_FINAL_LRU_ORDER] = order


def get_final_bundle(caches: dict[str, Any], fingerprint: str) -> dict[str, Any] | None:
    """讀最終 bundle；命中時觸碰 LRU。"""
    hit = caches.get(fingerprint)
    if not isinstance(hit, dict) or hit.get("worksheet") is None:
        return None
    order = caches.get(_FINAL_LRU_ORDER)
    if isinstance(order, OrderedDict) and fingerprint in order:
        order.move_to_end(fingerprint)
    elif isinstance(order, list) and fingerprint in order:
        order.remove(fingerprint)
        order.append(fingerprint)
        caches[_FINAL_LRU_ORDER] = OrderedDict((k, None) for k in order)
    return hit


def _selfcheck() -> None:
    iid = put(
        pd.DataFrame({"kW": [1.0]}),
        voltage_level="HV",
        tou_type="ThreeStage",
        start_date="2024-01-01",
        end_date="2024-01-02",
    )
    st = status(iid)
    assert st["remaining_sec"] > TTL_SEC - 5
    item = get(iid)
    assert len(item.df) == 1
    item.caches["probe"] = {"ok": True}
    assert get(iid).caches["probe"]["ok"] is True
    iid2 = put(
        pd.DataFrame({"kW": [2.0, 3.0]}),
        voltage_level="HV",
        tou_type="ThreeStage",
        start_date="2024-01-01",
        end_date="2024-01-02",
    )
    try:
        get(iid)
        raise AssertionError("old import should be replaced")
    except ImportNotFound:
        pass
    assert len(get(iid2).df) == 2
    assert get(iid2).caches == {}
    # 最終工作表 LRU：第四份淘汰最舊
    put_final_bundle(get(iid2).caches, "final:a", {"worksheet": pd.DataFrame({"kW": [1.0]})})
    put_final_bundle(get(iid2).caches, "final:b", {"worksheet": pd.DataFrame({"kW": [2.0]})})
    put_final_bundle(get(iid2).caches, "final:c", {"worksheet": pd.DataFrame({"kW": [3.0]})})
    assert get_final_bundle(get(iid2).caches, "final:a") is not None  # touch a → newest
    put_final_bundle(get(iid2).caches, "final:d", {"worksheet": pd.DataFrame({"kW": [4.0]})})
    assert get_final_bundle(get(iid2).caches, "final:b") is None
    assert get_final_bundle(get(iid2).caches, "final:a") is not None
    assert get_final_bundle(get(iid2).caches, "final:d") is not None
    assert delete(iid2) is True
    assert delete(iid2) is False
    try:
        get("missing")
        raise AssertionError("expected ImportNotFound")
    except ImportNotFound:
        pass
    print("import_store selfcheck ok")


if __name__ == "__main__":
    _selfcheck()
