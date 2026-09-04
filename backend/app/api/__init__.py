"""HTTP 路由模組。"""

import json
from typing import Any


def parse_json_form(raw: str | None, default: Any) -> Any:
    if raw is None or raw.strip() == "":
        return default
    return json.loads(raw)
