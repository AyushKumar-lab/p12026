# Data dictionary (Tier-1 feature table)

Primary merged file: `data/processed/features/tier1_feature_table.csv`  
ML-ready (with `*_filled` + imputation flags): `tier1_feature_table_ml_ready.csv`

## Identity / geography

| Column | Description |
|--------|-------------|
| geonameid | GeoNames id (join key; **do not** use as model feature) |
| name, country_code, admin1_code, admin2_code | Metadata |
| latitude, longitude | City centroid |
| population | GeoNames population |
| batch_index, tier | Rollout metadata |
| timezone | IANA string |

## Core OSM / network / transit (raw)

See `merge_tier1_feature_table.py` for exact names. Flags: `has_osm_features`, `has_network_features`, `has_transit_features`.

## Competition / anchors (multi-ring)

Counts at **500m, 1km, 2km** from centroid. Prefixes: `comp_food_poi`, `comp_pharmacy`, `comp_beauty_salon`, `anchor_school`, `anchor_university`, `anchor_hospital`, `anchor_clinic_doctors`, `anchor_office`, `anchor_mall`, `anchor_rail_station`.  
Suffixes: `_500m`, `_1km`, `_2km`.  
Flag: `has_competition_demand_features`.

## US ACS proxies (merged)

| Column | Description |
|--------|-------------|
| us_acs_median_income | County-level median household income (tract rollup) |
| us_acs_median_gross_rent | Median gross rent |
| us_acs_tract_count | Number of tracts |
| us_acs_tract_total_population | Sum population across tracts |
| us_acs_census_fetch_ok | 1 if ACS call succeeded |
| us_acs_state_fips, us_acs_county_fips | FIPS strings |
| us_acs_census_error_message | Error text if any |
| has_us_rent_features | Row present in rent extract |

## ML columns (`*_filled`)

Median-imputed copies of numeric raw columns when the corresponding `has_*` block is 0. Extra flags: `imputed_osm`, `imputed_network`, `imputed_transit`, `imputed_competition_demand`, `imputed_us_rent`.

## Versioning

Feature pipeline version is implied by git commit + timestamps in `artifacts/*_manifest.json` files.
