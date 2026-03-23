# Run on localhost

## 1) Frontend (Next.js) — port **3000**

From the repo root:

```powershell
cd d:\Workspace\p12026
npm install
npm run dev:3000
```

Open **http://localhost:3000**

**Map / search:** put your Mapbox **public** token in **`.env.local`** or **`.env`** (not `.env.example` — that file is ignored by Next.js):

```env
NEXT_PUBLIC_MAPBOX_API_KEY=pk.your_token_here
```

See **`docs/API_KEYS.md`**. After any env change, **restart** `npm run dev:3000`.

## 2) Python API (Flask) — port **5000**

In a **second** terminal:

```powershell
cd d:\Workspace\p12026
py -3 -m pip install flask flask-cors folium requests pandas geopy osmnx
py -3 backend/app.py
```

Open **http://127.0.0.1:5000** — JSON info at `/`, health at `/health`.

The Next app talks to the API using **`NEXT_PUBLIC_PYTHON_BACKEND_URL`** (default `http://localhost:5000` in `src/lib/api.ts`).

## 3) Optional: tabular ML predict

After training with `--export-dir`:

```powershell
set LOCINTEL_MODEL_DIR=artifacts\models\current
py -3 backend/app.py
```

Then `POST http://127.0.0.1:5000/predict/tabular` with a JSON body (see `docs/RUNBOOK_ML.md`).

## Note

Use `npm run dev:3000` (not `npm run dev -- -p 3000` on Windows), or Next may mis-parse the port.
