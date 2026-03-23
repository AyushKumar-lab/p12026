# Model card (tabular baseline)

## Overview

- **Type:** Gradient boosted trees (LightGBM default; XGBoost/CatBoost in `train_compare_models.py`).
- **Intended use:** Location / city-level scoring from OSM + census proxies (Tier-1).
- **Not for:** Legal, lending, or compliance decisions without human review.

## Inputs

- **Table:** `tier1_feature_table_ml_ready.csv` row aligned with `model_manifest.json` → `feature_columns`.
- **Types:** Numeric `*_filled` columns + selected imputation flags + `population`.
- **Geography:** City centroid features; **country holdout** recommended for validation.

## Outputs

- **Classification:** class + `predict_proba` (binary) via `/predict/tabular`.
- **Regression:** continuous prediction (when `task` is `regression` in manifest).

## Limitations

- OSM completeness varies by region; imputation injects medians — review `imputed_*` flags.
- US rent/income columns are **US-only**; other countries need other enrichers.
- Synthetic targets (`--synthetic-target`) are for **pipeline tests only**.

## Metrics

See `artifacts/baseline_lightgbm_report.json` and `artifacts/comparative_models_report.json` after training runs.

## Ethics / privacy

- No individual PII in Tier-1 aggregate features.
- Google Places (optional) is subject to Google Maps Platform terms.
