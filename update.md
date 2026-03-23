# LocIntel Model Training Plan (Real Data, End-to-End)

This document captures the full plan to build a more accurate location analysis model using real data, so work can continue even if the current session ends.

## Goal

Train a reliable model that predicts business location potential with real-world accuracy (not only heuristic scoring).

## Execution Decision (Locked)

User chose to include all targets:

- A) `success_12m` (classification)
- B) `monthly_revenue` (regression)
- C) `break_even_months` (regression)

Execution order is fixed for stability:

1. Train A first (best starting point, easiest to validate)
2. Add B after A baseline is stable
3. Add C after B data quality is acceptable

This avoids project failure due to label sparsity in early stages.

## Global Coverage Decision (Locked)

User wants worldwide access for all cities.

Execution approach:

1. Use globally available core features first (OSM + global demographic proxies).
2. Roll out in tiers:
   - Tier-1 countries/cities with highest data quality
   - Tier-2 expansion countries
   - Full global coverage
3. Keep one shared global model baseline, then optional region-specific calibration if needed.

Reason:

- One-shot full-world launch without staged validation usually fails quality checks due to inconsistent regional data.

---

## 1) Define the Prediction Target (First, Mandatory)

Pick one clear target label before collecting data:

- `success_12m` (binary): business active after 12 months (1/0)
- `monthly_revenue` (regression)
- `break_even_months` (regression)

Without a real label, model accuracy will not generalize.

---

## 2) Standardize the Geographic Unit

Use one consistent unit for every sample:

- H3 hex cells (recommended), or
- fixed-radius buffer around `lat,lng` (e.g., 500m / 1km)

This keeps features comparable across locations.

---

## 3) Collect Base Geospatial Features

### Data Sources

- OpenStreetMap / Overpass (POIs, roads, transit, amenities, land use)
- Census/government data (population, density, literacy, income proxies)
- Optional proxies (nightlights/economic activity, flood/elevation risk)

### Features to Create

- POI density by category
- road density
- intersection density
- transit stop count/access score
- land use mix index
- population density

---

## 4) Collect Competition + Demand Features

- Competitor count by business type within 500m/1km/2km
- Average competitor rating and review count (where legally/technically available)
- Anchor demand generators nearby (offices, schools, hospitals, malls, stations)
- Footfall/mobility proxies if available

---

## 5) Collect Rent/Property + Affordability Features

- Estimated rent/sqft and sale rates
- Budget-to-rent ratio
- Local affordability/income proxy

These strongly influence survivability of small businesses.

---

## 6) Collect Real Outcome Labels (Most Important)

Label examples:

- Business open/closed after 12 months
- Revenue band (if available)
- Survival duration in months

Possible sources:

- Official business registry/open-close data
- Commercial business databases/APIs
- Internal app/customer outcome data (best long-term source)

Target scale: at least 5,000 to 20,000 labeled samples for initial stable model.

---

## 7) Build One Clean Training Table

Each row should represent one location + business type + timestamp.

### Suggested Schema

- `sample_id`
- `timestamp`
- `city`, `state`, `country`
- `lat`, `lng`, `geo_unit_id` (H3 or grid id)
- `business_type`
- engineered features (all numeric/categorical)
- target label (`success_12m` or other)

Keep feature generation versioned for reproducibility.

---

## 8) Model Training (Baseline First)

Start with tabular ML (strong baseline):

- LightGBM (recommended first)
- XGBoost
- CatBoost

Then compare with ensembles only after baseline is stable.

---

## 9) Proper Validation (Avoid Fake Accuracy)

Do NOT rely only on random split.

Use:

- spatial split (train/test in different areas)
- temporal split (train older period, test newer period)

Metrics:

- Classification: ROC-AUC, PR-AUC, F1, Precision@K
- Regression: MAE, RMSE, MAPE

Also calibrate predicted probabilities if using classification.

---

## 10) Deployment + Monitoring

- Save model artifact + feature schema + version
- Track prediction quality over time (drift)
- Retrain monthly/quarterly as new labels arrive
- Add audit logs for feature availability and model confidence

---

## Recommended MVP Scope (Fastest Useful Result)

Start with:

- 3 cities
- 3 business types (e.g., cafe, pharmacy, salon)
- 5,000 to 10,000 labeled samples

Train LightGBM baseline and deploy one scoring endpoint.

---

## Data Source Categories (Practical)

- OSM/Overpass: free geospatial base data
- Census/government portals: demographic features
- GTFS/transit/open mobility datasets: accessibility
- Property/rent datasets or portals: cost features
- Listing/review APIs (paid likely): demand/competition quality
- Internal business outcomes: best label quality over time

---

## Implementation Plan for This Repo (Suggested)

1. Create training data schema and storage tables.
2. Expand collectors in `backend/` for OSM + census + competition/rent proxies.
3. Add feature engineering pipeline and versioned feature store.
4. Add `train.py` for LightGBM/XGBoost baseline.
5. Add evaluation report generation (AUC/MAE, spatial/time validation).
6. Export model and integrate into analysis API.
7. Add retraining and monitoring scripts.

---

## Notes for Continuity

- Keep this file updated at every major step.
- Store dataset snapshots and model versions with dates.
- Track assumptions explicitly (label quality, missing data, sampling bias).
- Track granular task progress in `EXECUTION_CHECKLIST.md`.

## Progress Update - 2026-03-21

Completed global reference ingestion setup:

- Added script: `backend/prepare_global_reference_data.py`
- Script input:
  - `data/raw/geonames/cities5000.txt`
  - `data/raw/boundaries/ne_10m_admin_0_countries.shp`
  - `data/raw/boundaries/ne_10m_admin_1_states_provinces.shp`
- Script output:
  - `data/processed/reference/global_cities_seed.csv`
  - `data/processed/reference/countries_boundaries.csv`
  - `data/processed/reference/states_boundaries.csv`
  - `artifacts/global_reference_manifest.json`

Current output sizes:

- Cities: 68,135
- Countries: 258
- States/Provinces: 4,596

Completed city batch generation for global rollout:

- Added script: `backend/build_city_batches.py`
- Generated:
  - `data/processed/reference/city_batches/tier1_city_batches.csv`
  - `data/processed/reference/city_batches/tier2_city_batches.csv`
  - `data/processed/reference/city_batches/global_city_batches.csv`
  - `artifacts/city_batch_manifest.json`

Batch stats:

- Tier-1: 366 cities (1 batch of 500)
- Tier-2: 5,639 cities (6 batches of 1,000)
- Global baseline: 12,045 cities (7 batches of 2,000)

Completed Tier-1 OSM feature extraction runner:

- Added script: `backend/extract_tier1_osm_features.py`
- Capabilities:
  - Resumable processing using existing output rows (`geonameid`)
  - Batch limit via CLI (`--max-cities`)
  - Configurable radius (`--radius-m`)
  - Retry + endpoint failover across Overpass servers
  - Run manifest output for observability
- Outputs:
  - `data/processed/features/tier1_osm_features.csv`
  - `artifacts/tier1_osm_run_manifest.json`

Verified with sample processed rows (Mumbai, Sao Paulo, Mexico City).

Completed Tier-1 roads/intersections extractor:

- Added script: `backend/extract_tier1_network_features.py`
- Features generated per city:
  - `road_way_count`
  - `intersection_count_proxy`
  - `intersection_density_proxy`
  - `road_class_distribution_json`
- Outputs:
  - `data/processed/features/tier1_network_features.csv`
  - `artifacts/tier1_network_run_manifest.json`

Verified with sample city run (Mumbai) and successful artifact generation.

Completed Tier-1 transit feature extractor:

- Added script: `backend/extract_tier1_transit_features.py`
- Transit features generated per city:
  - `transit_total_count`
  - `transit_density`
  - `bus_stop_count`
  - `bus_station_count`
  - `rail_station_count`
  - `subway_entrance_count`
  - `tram_stop_count`
  - `ferry_terminal_count`
- Outputs:
  - `data/processed/features/tier1_transit_features.csv`
  - `artifacts/tier1_transit_run_manifest.json`

Verified with sample run and successful artifact generation.

Completed Tier-1 feature merge and quality pipeline:

- Added script: `backend/merge_tier1_feature_table.py`
- Merged sources:
  - `tier1_osm_features.csv`
  - `tier1_network_features.csv`
  - `tier1_transit_features.csv`
  - `tier1_city_batches.csv` (reference backbone)
- Outputs:
  - `data/processed/features/tier1_feature_table.csv`
  - `artifacts/tier1_feature_quality_report.json`

Current quality snapshot (expected at this stage due to small smoke-run extraction):

- Total Tier-1 reference cities: 366
- OSM coverage: 0.82%
- Network coverage: 0.27%
- Transit coverage: 0.27%

These low percentages are normal now because only a few sample cities were extracted. Coverage will increase as batch extraction is run at scale.

Progress update after larger batch run:

- Executed additional extraction passes.
- Updated merged coverage:
  - OSM coverage: 1.91% (7/366)
  - Network coverage: 0.27% (1/366)
  - Transit coverage: 1.64% (6/366)

Operational note:

- Overpass API intermittently throttles/blocks long network queries for some cities.
- Current scripts already support retry + endpoint failover.
- Recommended strategy: run smaller frequent batches and continue resume-based accumulation.

Completed queued extraction orchestrator:

- Added script: `backend/run_tier1_extraction_cycle.py`
- Purpose: execute small resumable chunks in one command:
  1. OSM extraction
  2. Network extraction
  3. Transit extraction
  4. Unified merge refresh
- Run log output:
  - `artifacts/tier1_cycle_run_log.json`

Verified cycle run (all steps OK):

- OSM: +1 city
- Network: +1 city
- Transit: +1 city
- Merge refreshed successfully

Updated coverage after verified cycle:

- OSM coverage: 8.74% (50/366)
- Network coverage: 1.91% (9/366)
- Transit coverage: 1.91% (7/366)

### Null / imputation strategy (Tier-1)

- **Script:** `backend/impute_tier1_features.py`
- **Input:** `data/processed/features/tier1_feature_table.csv`
- **Output:**
  - `data/processed/features/tier1_feature_table_ml_ready.csv` — original columns plus `*_filled` numeric columns and `road_class_distribution_json_filled`, plus flags `imputed_osm`, `imputed_network`, `imputed_transit`
  - `artifacts/tier1_imputation_report.json` — medians used (computed on rows where each block was observed), row counts/rates of imputation
- **Rule:** For each block (OSM / network / transit), if `has_*_features=0`, numeric features are filled with the **median** of that column among rows where the block **was** observed; flags record that imputation occurred. Use `*_filled` columns for training to avoid treating zeros as real measurements when data was missing.
- **Orchestrator:** `backend/run_tier1_extraction_cycle.py` runs imputation after merge.

### Leakage checks + baseline training

- **Leakage audit:** `backend/check_feature_leakage.py` → `artifacts/tier1_leakage_report.json` (warns on raw+`*_filled` pairs; recommends safe columns; never use `geonameid` as a feature).
- **Deps:** `pip install -r backend/ml_requirements.txt` (numpy, pandas, scikit-learn, lightgbm).
- **Baseline trainer:** `backend/train_baseline_lightgbm.py`
  - Default **spatial** validation: hold out ~20% of **countries** (`--test-country-fraction`).
  - **Temporal** validation: `--temporal-column COL` (numeric epoch or ISO datetime), last `--temporal-test-fraction` of time-ordered rows as test.
  - Smoke test: `--synthetic-target classification` (population median split) or `regression` (`log1p(population)`).
  - Real labels: `--target success_12m` (or other column) when available.
  - Report: `artifacts/baseline_lightgbm_report.json`.

### Tier-1 merge + Phase 5–6 (deployment docs)

- `merge_tier1_feature_table.py` now joins **competition/anchor** columns (from `tier1_competition_demand_features.csv` when present) and **US ACS** columns (from `tier1_us_rent_income_features.csv`), with `has_competition_demand_features` / `has_us_rent_features`.
- `impute_tier1_features.py` adds `*_filled` + `imputed_competition_demand` / `imputed_us_rent` for those blocks.
- `run_tier1_extraction_cycle.py` runs `extract_tier1_competition_demand_features.py` before merge (`--competition-cities`).
- Training uses **all numeric `*_filled`** columns automatically (`ml_tabular_common.feature_columns_for_header`).
- **Export:** `train_baseline_lightgbm.py --export-dir artifacts/models/current --model-version …`
- **API:** `POST /predict/tabular` + env `LOCINTEL_MODEL_DIR`; optional `LOCINTEL_PREDICTION_LOG`.
- Docs: `docs/RUNBOOK_ML.md`, `DATA_DICTIONARY.md`, `MODEL_CARD.md`, `MONITORING.md`.

### Phases 0–2 (setup, collection, labels) — repo completion

- **Phase 0:** Geographic unit = **fixed-radius** buffers (see `docs/GEOGRAPHIC_UNIT.md`). Env vars: `docs/ENVIRONMENT.md`, `.env.example`.
- **Phase 1B:** Census strategy `docs/CENSUS_AND_DEMOGRAPHICS.md`; mapping test `backend/test_demographic_mapping.py`.
- **Phase 1C:** `backend/extract_tier1_competition_demand_features.py` (500m/1km/2km + anchors); optional Google Places `backend/fetch_competitor_quality_google_places.py`.
- **Phase 1D:** `backend/build_tier1_us_rent_features.py`, `backend/compute_budget_to_rent.py`; `docs/RENT_AND_COST_FEATURES.md`.
- **Phase 2:** `docs/LABELS_AND_OUTCOMES.md`, `data/raw/labels/*`, `backend/build_training_labels.py`, `backend/check_label_quality.py`. **≥5,000 labels** = production export (checklist item stays open until count met).

### Comparative models (same split)

- **Shared helpers:** `backend/ml_tabular_common.py` (feature list, splits, synthetic target).
- **Script:** `backend/train_compare_models.py` — trains **LightGBM**, **XGBoost**, and **CatBoost** on identical train/test data.
- **Classification:** per-model **Brier score**, **calibration_curve** bins, coarse **ece_bin_mean_abs_gap** diagnostic.
- **Deps:** `xgboost`, `catboost` added in `backend/ml_requirements.txt`.
- **Report:** `artifacts/comparative_models_report.json`.

