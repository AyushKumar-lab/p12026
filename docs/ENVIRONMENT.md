# Environment variables and API keys (Phase 0)

Copy `.env.example` to `.env.local` (Next.js) and set secrets as needed.

## Frontend (Next.js — `NEXT_PUBLIC_*` exposed to browser)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_MAPBOX_API_KEY` | **Yes** (map + geocode) | Mapbox GL token |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Alias some code paths accept |
| `NEXT_PUBLIC_MAPBOX_STYLE` | No | Default `mapbox/satellite-streets-v12` |
| `NEXT_PUBLIC_SUPABASE_URL` | If using Supabase | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | If using Supabase | Public anon key |
| `NEXT_PUBLIC_API_URL` | No | Custom API base |
| `NEXT_PUBLIC_PYTHON_BACKEND_URL` | No | Default `http://localhost:5000` |

## Server-only / scripts

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server routes, collectors, seed scripts |
| `GOOGLE_PLACES_API_KEY` | Optional competitor quality (`fetch_competitor_quality_google_places.py`) |
| `FLASK_DEBUG`, `PORT`, `HOST` | `backend/config.py` Flask |
| `SEED_SECRET` | `src/app/api/seed-properties/route.ts` |
| `LOCINTEL_MODEL_DIR` | Folder with `model.joblib` + `model_manifest.json` (see `train_baseline_lightgbm.py --export-dir`) |
| `LOCINTEL_PREDICTION_LOG` | Set to `1` to append `artifacts/prediction_log.jsonl` on `/predict/tabular` |

## Data APIs used without keys

- OpenStreetMap / Overpass  
- US Census ACS (via `backend/get_census_data.py`)  
- FCC geocode (county FIPS)  

## Rotation / prod

- Never commit `.env.local` or service role keys.  
- Use separate Mapbox tokens for dev vs production URL restrictions.
