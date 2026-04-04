#!/usr/bin/env python3
"""
Run local ML training steps in order: mobility scaler + web export, then LightGBM baseline.

Mobility uses Movement Distribution parquet; tabular training uses backend/train_baseline_lightgbm.py.
For a full environment:

  pip install -r scripts/movement_distribution/requirements.txt
  pip install -r backend/ml_requirements.txt

Examples:

  python scripts/run_local_training.py
  python scripts/run_local_training.py --only mobility
  python scripts/run_local_training.py --only lightgbm
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable

MOVEMENT_REQ = REPO_ROOT / "scripts" / "movement_distribution" / "requirements.txt"
TRAIN_MOBILITY = REPO_ROOT / "scripts" / "movement_distribution" / "train_mobility_index.py"
EXPORT_MOBILITY_WEB = REPO_ROOT / "scripts" / "movement_distribution" / "export_india_mobility_for_web.py"
PARQUET = REPO_ROOT / "data" / "processed" / "movement-distribution" / "india_gadm2_daily.parquet"

LIGHTGBM_TRAIN = REPO_ROOT / "backend" / "train_baseline_lightgbm.py"
ML_REQ = REPO_ROOT / "backend" / "ml_requirements.txt"
DEFAULT_EXPORT_DIR = REPO_ROOT / "artifacts" / "baseline_lightgbm"


def run_step(name: str, args: list[str]) -> None:
    print(f"\n=== {name} ===", flush=True)
    subprocess.run(args, cwd=str(REPO_ROOT), check=True)


def mobility_pipeline() -> None:
    if not PARQUET.is_file():
        raise SystemExit(
            f"Missing {PARQUET}\n"
            "Ingest movement data first (see scripts/movement_distribution/README.md)."
        )
    run_step(
        "Mobility StandardScaler",
        [PY, str(TRAIN_MOBILITY), "--input", str(PARQUET)],
    )
    run_step(
        "Export meta-mobility JSON for web",
        [PY, str(EXPORT_MOBILITY_WEB)],
    )


def lightgbm_pipeline(export_dir: Path) -> None:
    if not LIGHTGBM_TRAIN.is_file():
        raise SystemExit(
            f"Missing {LIGHTGBM_TRAIN}. Clone or restore backend/ (currently gitignored in this repo)."
        )
    export_dir.mkdir(parents=True, exist_ok=True)
    run_step(
        "LightGBM baseline (synthetic target; use real labels for production)",
        [
            PY,
            str(LIGHTGBM_TRAIN),
            "--synthetic-target",
            "classification",
            "--export-dir",
            str(export_dir),
        ],
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Local ML training orchestrator")
    ap.add_argument(
        "--only",
        choices=("all", "mobility", "lightgbm"),
        default="all",
        help="Run only mobility, only LightGBM, or everything (default).",
    )
    ap.add_argument(
        "--export-dir",
        type=Path,
        default=DEFAULT_EXPORT_DIR,
        help="Directory for model.joblib + manifest (LightGBM).",
    )
    args = ap.parse_args()

    print("LocIntel local training", flush=True)
    print(f"Repo root: {REPO_ROOT}", flush=True)

    if args.only in ("all", "mobility"):
        mobility_pipeline()
    if args.only in ("all", "lightgbm"):
        lightgbm_pipeline(args.export_dir)

    print("\nDone.", flush=True)


if __name__ == "__main__":
    main()
