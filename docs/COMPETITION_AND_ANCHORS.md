# Competition and demand (Phase 1C)

## A) Competitor counts by distance (OSM — implemented)

Script: `backend/extract_tier1_competition_demand_features.py`

For each Tier-1 city centroid, **counts** of OSM elements at **500 m, 1 km, 2 km**:

| Prefix | Meaning |
|--------|---------|
| `comp_food_poi_*` | restaurant, cafe, fast_food, bar |
| `comp_pharmacy_*` | `amenity=pharmacy` |
| `comp_beauty_salon_*` | `shop=beauty`, `amenity=hairdresser` |

Suffixes: `_500m`, `_1km`, `_2km`.

These are **global, free** proxies for “how crowded” a category is near the centroid (not street-front accuracy).

## B) Anchor demand (OSM — same script)

| Prefix | Tags |
|--------|------|
| `anchor_school_*` | `amenity=school` |
| `anchor_university_*` | `amenity=university` |
| `anchor_hospital_*` | `amenity=hospital` |
| `anchor_clinic_doctors_*` | `amenity` clinic/doctors |
| `anchor_office_*` | any `office=*` |
| `anchor_mall_*` | `shop=mall` |
| `anchor_rail_station_*` | `railway=station` |

## C) Competitor quality (ratings / reviews — optional)

OSM does not provide ratings. Optional path:

- **Google Places API** (paid): `backend/fetch_competitor_quality_google_places.py`  
  Requires `GOOGLE_PLACES_API_KEY`. Use for pilots or high-value metros.

Join quality aggregates back to `geonameid` in ETL (mean rating, review count) as separate columns.

## Operations

Resumable CSV output; same Overpass etiquette as other Tier-1 scripts (small batches, sleep).

```bash
py -3 backend/extract_tier1_competition_demand_features.py --max-cities 3 --sleep-sec 1.2
```
