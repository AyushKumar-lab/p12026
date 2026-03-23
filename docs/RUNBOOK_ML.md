# ML runbook (reproducible)

## 1) Feature extraction (Tier-1)

```bash
py -3 backend/run_tier1_extraction_cycle.py --osm-cities 2 --network-cities 1 --transit-cities 2 --competition-cities 1
```

Or run individual scripts. Optional US rent enrichment:

```bash
py -3 backend/build_tier1_us_rent_features.py --max-cities 100
```

## 2) Merge + impute

```bash
py -3 backend/merge_tier1_feature_table.py
py -3 backend/impute_tier1_features.py
```

Outputs: `data/processed/features/tier1_feature_table_ml_ready.csv`

## 3) Leakage check

```bash
py -3 backend/check_feature_leakage.py
```

## 4) Train + export bundle

```bash
pip install -r backend/ml_requirements.txt
py -3 backend/train_baseline_lightgbm.py --synthetic-target classification --export-dir artifacts/models/current --model-version v0.1.0
```

## 5) Serve inference (Flask)

```bash
set LOCINTEL_MODEL_DIR=artifacts\models\current
set LOCINTEL_PREDICTION_LOG=1
py -3 backend/app.py
```

```http
POST /predict/tabular
Content-Type: application/json

{"features": {"food_poi_count_filled": 10.0, "population": 500000}}
```

(Include **all** `feature_columns` from `model_manifest.json`.)

## 6) Labels (production)

See `docs/LABELS_AND_OUTCOMES.md` and `data/raw/labels/README.md`.
