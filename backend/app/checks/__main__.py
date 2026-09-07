"""一次跑完所有 assert 自檢。"""

import importlib
import sys

_MODULES = (
    "app.checks.device",
    "app.checks.dispatch",
    "app.checks.feature_demand",
    "app.checks.feature_tou",
    "app.checks.feature_reserve",
    "app.checks.calc_full_bill",
    "app.checks.simulate_defaults",
    "app.checks.simulate_size",
    "app.checks.import_io",
)

def main() -> None:
    failed: list[tuple[str, BaseException]] = []
    for name in _MODULES:
        mod = importlib.import_module(name)
        try:
            mod.main()
        except Exception as exc:
            failed.append((name, exc))
            print(f"FAIL {name}: {exc}", file=sys.stderr)
    if failed:
        sys.exit(1)
    print(f"all checks ok ({len(_MODULES)})")


if __name__ == "__main__":
    main()
