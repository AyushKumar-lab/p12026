# Execution Checklist (LocIntel Real-Data Model)

Use this checklist to track implementation progress task-by-task.
Update status immediately when a task is completed.

Legend:
- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked

---

## Phase 0 - Project Setup

- [x] Confirm target variable (`success_12m` or alternative)
- [x] Confirm geographic unit (H3 or fixed radius) — `docs/GEOGRAPHIC_UNIT.md`
- [x] Finalize global rollout tiers (worldwide coverage plan)
- [x] Create data folder structure (`data/raw`, `data/processed`, `artifacts`)
- [x] Define environment variables and API keys needed — `docs/ENVIRONMENT.md`, `.env.example`

---

## Phase 1 - Data Collection

### 1A) Geospatial Base Data
- [x] OSM POI collector implemented/verified
- [x] OSM roads/intersections collector implemented/verified
- [x] Transit data collector (OSM/GTFS) implemented/verified

### 1B) Demographic Data
- [x] Census data sources selected per city/state (`docs/CENSUS_AND_DEMOGRAPHICS.md` — US ACS + FCC; non-US GeoNames + future national sources)
- [x] Census ingestion script implemented
- [x] Population/income proxy mapping tested (`backend/test_demographic_mapping.py` → `artifacts/demographic_mapping_test_report.json`)

### 1C) Competition and Demand
- [x] Competitor count by business type within 500m/1km/2km (`backend/extract_tier1_competition_demand_features.py`)
- [x] Competitor quality proxy (ratings/reviews) integrated (optional Google Places: `backend/fetch_competitor_quality_google_places.py` + `GOOGLE_PLACES_API_KEY`; see `docs/COMPETITION_AND_ANCHORS.md`)
- [x] Anchor-demand features (schools, offices, malls, hospitals, stations) (same OSM multi-ring extractor)

### 1D) Cost Features
- [x] Rent/property data source identified (`docs/RENT_AND_COST_FEATURES.md` — US ACS median gross rent; non-US TBD)
- [x] Rent estimator pipeline implemented (`backend/build_tier1_us_rent_features.py` + Census join)
- [x] Budget-to-rent feature implemented (`backend/compute_budget_to_rent.py`)

---

## Phase 2 - Label Creation

- [x] Label definition finalized and documented (`docs/LABELS_AND_OUTCOMES.md`, `update.md`)
- [x] Outcome data source integrated (CSV + Supabase export path documented; `data/raw/labels/README.md`)
- [x] Label generation script added (`backend/build_training_labels.py`)
- [x] Data quality checks for missing/noisy labels (`backend/check_label_quality.py` → `artifacts/label_quality_report.json`)
- [ ] Minimum dataset target reached (>= 5,000 labeled samples) — **operational:** fill `data/raw/labels/locations_labeled.csv` from production exports, then re-run quality script

---

## Phase 3 - Feature Engineering

- [x] Unified feature schema defined
- [x] Feature generation pipeline implemented
- [x] Feature versioning system added
- [x] Null/imputation strategy implemented
- [x] Leakage checks completed

---

## Phase 4 - Training and Validation

- [x] Baseline model (LightGBM) training script added
- [x] Comparative models (XGBoost/CatBoost) added
- [x] Spatial validation split implemented
- [x] Temporal validation split implemented (optional `--temporal-column` when timestamps exist)
- [x] Metrics report generated (AUC/F1 or MAE/MAPE)
- [x] Model calibration checked (if classification)

---

## Phase 5 - Deployment and Monitoring

- [x] Best model exported with version tag (`train_baseline_lightgbm.py --export-dir` → `model.joblib` + `model_manifest.json`)
- [x] Inference pipeline integrated into API (`POST /predict/tabular`, env `LOCINTEL_MODEL_DIR`)
- [x] Prediction logging enabled (optional `LOCINTEL_PREDICTION_LOG=1` → `artifacts/prediction_log.jsonl`)
- [x] Drift monitoring checks defined (`docs/MONITORING.md`)
- [x] Retraining schedule documented (`docs/MONITORING.md`)

---

## Phase 6 - Documentation and Handoff

- [x] `update.md` updated with current state
- [x] Data dictionary documented (`docs/DATA_DICTIONARY.md`)
- [x] Model card created (`docs/MODEL_CARD.md`)
- [x] Reproducible runbook documented (`docs/RUNBOOK_ML.md`)

---

## Progress Log

Add one entry whenever a meaningful task is completed.

- YYYY-MM-DD - Initialized execution checklist.
- 2026-03-21 - Step 1 started: target variable definition in progress.
- 2026-03-21 - Step 1 completed: multi-target strategy finalized (A, B, C). Execution order: A first, then B, then C.
- 2026-03-21 - Global scope selected: rollout will be worldwide in tiers (Tier-1 -> Tier-2 -> full global), not one-shot.
- 2026-03-21 - Global reference ingestion completed: 68,135 cities + 258 countries + 4,596 states prepared.
- 2026-03-21 - Tiered rollout batches built from global seed: Tier1=366, Tier2=5,639, Global=12,045.
- 2026-03-21 - Tier-1 OSM feature extractor implemented and verified (sample cities processed successfully with endpoint failover).
- 2026-03-21 - Tier-1 network feature extractor implemented and verified (roads + intersections).
- 2026-03-21 - Tier-1 transit feature extractor implemented and verified (OSM transit categories + density).
- 2026-03-21 - Tier-1 unified feature table pipeline implemented with quality report and coverage metrics.
- 2026-03-21 - Additional extraction pass executed (OSM + transit improved coverage; network extractor faces intermittent Overpass throttling).
- 2026-03-21 - Added one-command queued extraction orchestrator and verified full successful cycle.
- 2026-03-21 - Tier-1 null/imputation: `backend/impute_tier1_features.py` writes `tier1_feature_table_ml_ready.csv` + `artifacts/tier1_imputation_report.json`; orchestrator runs impute after merge.
- 2026-03-21 - Leakage audit script `backend/check_feature_leakage.py` + baseline trainer `backend/train_baseline_lightgbm.py` (country holdout + optional temporal split); `backend/ml_requirements.txt`; reports `tier1_leakage_report.json`, `baseline_lightgbm_report.json`.
- 2026-03-21 - Comparative training: `backend/ml_tabular_common.py`, `backend/train_compare_models.py` (LightGBM + XGBoost + CatBoost, same split); classification calibration (Brier + calibration bins); `artifacts/comparative_models_report.json`.
- 2026-03-21 - Phases 0–2 closed out in repo: `docs/` (geo unit, ENV, census, competition/anchors, rent/cost, labels); `backend/overpass_utils.py`; competition/anchor extractor; US rent + budget-to-rent; demographic mapping test; label merge + quality; `.env.example` expanded. **5k labels** remains until real export.
- 2026-03-21 - Merge pipeline extended: competition + US ACS columns in `merge_tier1_feature_table.py`; `tier1_feature_schema.py`; imputation + auto `*_filled` features in training; orchestrator runs competition step; Phase 5–6: model export, `/predict/tabular`, monitoring docs, data dictionary, model card, runbook.

