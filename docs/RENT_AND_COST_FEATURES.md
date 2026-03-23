# Rent and cost features (Phase 1D)

## Data source (identified)

| Region | Primary source | Implementation |
|--------|----------------|----------------|
| **US** | ACS 5-year median gross rent + median income (tract → county summary) | `build_tier1_us_rent_features.py` + `get_census_data.py` |
| **Non-US** | TBD by market | Document Eurostat, national stats, or paid rent indices before Tier-2 expansion |

## Rent estimator pipeline

1. Run `py -3 backend/build_tier1_us_rent_features.py` to populate `tier1_us_rent_income_features.csv`.
2. Join to feature or training tables on `geonameid`.
3. For **non-US**, either leave columns null and rely on imputation flags later, or add a country-specific enricher.

## Budget-to-rent feature

After labels include **`monthly_budget`** and rent proxy exists (e.g. `median_gross_rent_proxy`):

```bash
py -3 backend/compute_budget_to_rent.py ^
  --input-csv data/processed/training/tier1_labeled_training_set.csv ^
  --output-csv data/processed/training/tier1_with_budget_to_rent.csv
```

Formula: `budget_to_rent_ratio = monthly_budget / max(rent, 1)`.

Override columns with `--budget-column` / `--rent-column` if names differ.

## External (future)

- Property listing APIs (Zillow-style, commercial data vendors) for fine-grained rent surfaces where licensed.
