# Geographic unit (Phase 0 — locked)

## Primary: fixed-radius buffers

All Tier-1 OSM-derived features use **great-circle buffers** around a single anchor point per city:

- **Anchor:** GeoNames city centroid (`latitude`, `longitude` from `tier1_city_batches.csv`).
- **Radius:** configurable per script (common values: **500 m**, **800 m**, **1,000 m**, **2,000 m**).
- **Competition / anchor script** (`extract_tier1_competition_demand_features.py`) uses **three rings**: 500 m, 1 km, 2 km for direct comparability.

This matches the current Overpass `around:` queries and keeps the stack free of H3 / heavy GIS dependencies.

## Secondary (future): H3

**H3** (or similar discrete grid) is reserved for:

- Point-of-interest or street-level samples (not whole-city centroid),
- Consistent global cells when we move beyond city-level aggregates.

No H3 dependency until labels are tied to specific sub-city coordinates.

## Validation implication

Train/evaluate with **spatial splits** (e.g. country holdout) because fixed-radius features around nearby cities can correlate.
