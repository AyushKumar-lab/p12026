# Labels and outcome sources (Phase 2)

## Target definitions (locked)

Aligned with `update.md`:

| Target | Type | Description |
|--------|------|-------------|
| `success_12m` | Classification (0/1) | Business still active / successful at 12 months |
| `monthly_revenue` | Regression | Continuous or log-transformed revenue |
| `break_even_months` | Regression | Months to break even |

Train **A → B → C** in that order.

## Outcome data sources (integrated paths)

1. **CSV export** (default pipeline): `data/raw/labels/locations_labeled.csv`  
   Template: `locations_labeled.example.csv` — see `data/raw/labels/README.md`.

2. **Supabase / app database**  
   Export query results to the same CSV shape (`geonameid` + targets).  
   App already uses `NEXT_PUBLIC_SUPABASE_*` and service role for server scripts (`scripts/collect_real_properties.py`, API routes).

3. **Internal analytics**  
   Batch dumps from warehouse → same schema.

## Label generation (merge with features)

```bash
py -3 backend/build_training_labels.py \
  --features-csv data/processed/features/tier1_feature_table_ml_ready.csv \
  --labels-csv data/raw/labels/locations_labeled.csv \
  --output-csv data/processed/training/tier1_labeled_training_set.csv
```

## Quality gates

```bash
py -3 backend/check_label_quality.py --csv data/processed/training/tier1_labeled_training_set.csv --target success_12m
```

Report: `artifacts/label_quality_report.json`.

## Minimum dataset size

**Production goal:** ≥ **5,000** labeled rows with reliable `success_12m` (or chosen primary target).  
The quality script enforces reporting against this threshold; reaching the count is an **operational** milestone (exports from the live product), not something the repo can fabricate.
