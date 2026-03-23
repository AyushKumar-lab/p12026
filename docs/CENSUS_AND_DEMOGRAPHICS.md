# Census and demographic sources (Phase 1B)

## United States

| Layer | Source | Script |
|-------|--------|--------|
| County FIPS from lat/lon | FCC Census Area API (free) | `get_census_data.get_state_county_from_coords` |
| Tract demographics | Census ACS 5-year (`config.CENSUS_BASE_URL`) | `get_census_data.download_census_data` / `get_census_summary` |
| Variables | `B01003` population, `B19013` median income, `B25064` median gross rent, `B08303` commute | `backend/config.py` → `CENSUS_VARIABLES` |

**Grain:** tract-level download; **summaries** in helpers are county aggregates (median of tract medians / sums as implemented).

## Non–United States

| Proxy | Source | Notes |
|-------|--------|------|
| Population | GeoNames (`population` on city seed / batches) | Primary global proxy today |
| Income / rent | *Not unified* | Add Eurostat, national ONS, World Bank, or commercial tiles per rollout tier |

## Testing the mapping

```bash
py -3 backend/test_demographic_mapping.py
```

Produces `artifacts/demographic_mapping_test_report.json` (US sample + non-US policy note).

## County rent/income feature file

```bash
py -3 backend/build_tier1_us_rent_features.py --max-cities 100
```

→ `data/processed/features/tier1_us_rent_income_features.csv` (join on `geonameid`).
