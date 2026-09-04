"""讀取 app/data 預設 JSON。"""

import json
from copy import deepcopy
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA = Path(__file__).resolve().parents[1] / "data"


def _read_json(name: str) -> Any:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def _rates_cache() -> dict:
    return _read_json("tariff.json")


@lru_cache(maxsize=1)
def _schedule_cache() -> dict:
    return _read_json("tou_schedule.json")


@lru_cache(maxsize=1)
def _holidays_cache() -> list[dict]:
    return list(_read_json("holiday.json"))


@lru_cache(maxsize=1)
def _overage_rules_cache() -> dict:
    return _read_json("overage_rules.json")


@lru_cache(maxsize=1)
def _simulate_defaults_cache() -> dict:
    return _read_json("simulate_defaults.json")


def default_rates() -> dict:
    """預設電價。"""
    return deepcopy(_rates_cache())


def default_schedule() -> dict:
    """預設時段表。"""
    return deepcopy(_schedule_cache())


def default_holidays() -> list[dict]:
    """預設假日列表。"""
    return deepcopy(_holidays_cache())


def default_overage_rules() -> dict:
    """預設超約倍率。"""
    return deepcopy(_overage_rules_cache())


def default_simulate() -> dict:
    """模擬數值參數預設（SOC／效率／預留等）。"""
    return deepcopy(_simulate_defaults_cache())


def default_settings() -> dict:
    """設定頁一次載入。"""
    return {
        "rates": default_rates(),
        "schedule": default_schedule(),
        "holidays": default_holidays(),
        "overage_rules": default_overage_rules(),
        "simulate": default_simulate(),
    }
