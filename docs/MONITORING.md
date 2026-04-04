# Monitoring, Drift Detection & Retraining (Phase 5)

## Prediction Logging

When `LOCINTEL_PREDICTION_LOG=1`, Flask appends one JSON line per `/predict/tabular` call to:

`artifacts/prediction_log.jsonl`

Fields include `logged_at_utc`, request feature keys, and model output. **Do not log PII.**

---

## Drift Detection (Evidently AI — Automated)

### Quick Start

```bash
# Install Evidently
pip install evidently>=0.4.0

# Run drift check (reference = training CSV, current = prediction log)
python backend/run_drift_report.py

# With custom paths
python backend/run_drift_report.py \
  --reference artifacts/tier1_feature_table.csv \
  --current  artifacts/prediction_log.jsonl \
  --out      artifacts/drift_reports

# Include label drift (when ground-truth labels are available)
python backend/run_drift_report.py --target success_12m

# Monitor specific features only
python backend/run_drift_report.py \
  --features "food_poi_count_filled,transit_count_filled,residential_count_filled"
```

### What It Does

| Check | Method | Threshold |
|-------|--------|-----------|
| Feature distribution shift | PSI / KS test per column (Evidently auto-selects) | p < 0.05 = drift |
| Dataset-level drift | Share of drifted features | > 50% = CRITICAL, > 30% = WARNING |
| Label drift (optional) | Target distribution shift | PSI on `success_12m` |
| Geography shift | Compare country/city mix vs training | Alert on new geography |

### Alert Levels

| Level | Drift Share | Exit Code | Action |
|-------|-------------|-----------|--------|
| `OK` | ≤ 10% | 0 | No action |
| `NOTICE` | 10–30% | 0 | Review report, monitor |
| `WARNING` | 30–50% | 1 | Schedule retrain |
| `CRITICAL` | > 50% | 2 | **Retrain immediately** |

### Output Files

Each run generates two files in `artifacts/drift_reports/`:

- `drift_report_YYYYMMDD_HHMMSS.html` — Full interactive Evidently report (open in browser)
- `drift_summary_YYYYMMDD_HHMMSS.json` — Machine-readable summary with per-feature drift scores

### Automation (GitHub Actions)

```yaml
# .github/workflows/drift-check.yml
name: Monthly Drift Check
on:
  schedule:
    - cron: '0 6 1 * *'  # 1st of every month at 6 AM UTC
  workflow_dispatch:

jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r backend/ml_requirements.txt evidently>=0.4.0
      - run: python backend/run_drift_report.py
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: drift-report
          path: artifacts/drift_reports/
```

---

## A/B Testing (Rule-Based vs ML)

The frontend analyze API (`src/app/api/analyze/route.ts`) implements a traffic-split A/B test:

| Arm | Traffic | Scoring Method |
|-----|---------|---------------|
| `ml` | 80% | ML model via `POST /predict/tabular` (Flask backend) |
| `rule_based` | 20% (control) | Existing rule-based `analyzeLocation()` in `src/lib/analysis.ts` |

### How It Works

1. Each request gets a deterministic arm assignment based on `hash(lat + lng + businessType) % 100`
2. If arm = `ml` AND the ML backend is reachable → use ML score
3. If ML backend is unreachable → graceful fallback to rule-based (logged as `ml_fallback`)
4. Response includes `abTest: { arm, scoringMethod, mlBackendUsed }` for tracking

### Configuration

```env
# .env.local
LOCINTEL_ML_BACKEND_URL=http://localhost:5000    # Flask backend URL
LOCINTEL_AB_ML_PERCENT=80                         # ML traffic % (0-100)
```

### Tracking

Every A/B response logs to `artifacts/ab_test_log.jsonl`:

```json
{
  "timestamp": "2026-04-02T10:00:00Z",
  "arm": "ml",
  "scoring_method": "ml_model",
  "ml_backend_used": true,
  "overall_score": 72,
  "lat": 20.296,
  "lng": 85.824,
  "business_type": "Restaurant",
  "response_time_ms": 1200
}
```

### Analysis

Compare arms on:
- Mean score difference (should converge as ML improves)
- User engagement (return visits, PDF purchases)
- Prediction accuracy (backtest against outcomes)

---

## Retraining Schedule

| Trigger | Frequency | Action |
|---------|-----------|--------|
| Calendar | Quarterly | Full Tier-1 extract → merge → impute → retrain |
| New labels | When ≥ +1,000 new labeled rows | Retrain + compare AUC |
| Drift alert | WARNING or CRITICAL | Retrain immediately |
| Query change | After Overpass query or census vintage update | Retrain + re-extract |

### Retrain Checklist

1. Run `python backend/run_drift_report.py` — check alert level
2. Run full extraction cycle: `python backend/run_tier1_extraction_cycle.py`
3. Merge features: `python backend/merge_tier1_feature_table.py`
4. Impute: `python backend/impute_tier1_features.py`
5. Check leakage: `python backend/check_feature_leakage.py`
6. Train + export: `python backend/train_baseline_lightgbm.py --export-dir artifacts/models/current --model-version vX.Y.Z`
7. Compare models: `python backend/train_compare_models.py`
8. Deploy new model: update `LOCINTEL_MODEL_DIR` to new export path
9. Run drift check on new model's first week of predictions
