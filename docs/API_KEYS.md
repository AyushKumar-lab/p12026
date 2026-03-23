# Where to get API keys

## Mapbox (map + geocoding on the site)

1. Create a free account: **https://account.mapbox.com/**
2. Go to **Account → Access tokens** (or **https://account.mapbox.com/access-tokens/**).
3. Copy the **Default public token** (starts with `pk.`) or create a new token with scopes that allow **styles** and **tile requests**.
4. Put it in **`.env`** or **`.env.local`** (not `.env.example`):

   ```env
   NEXT_PUBLIC_MAPBOX_API_KEY=pk.your_token_here
   ```

5. **URL restrictions:** If the token is restricted to certain URLs, add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
6. Restart the dev server: `Ctrl+C` then `npm run dev:3000`.

---

## Supabase (database / auth)

1. **https://supabase.com/dashboard** → your project.
2. **Settings → API**  
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` `public` key  
3. **Settings → API** → `service_role` (server only, never in client code) → `SUPABASE_SERVICE_ROLE_KEY`

---

## Google Places (optional)

**https://console.cloud.google.com/** → APIs & Services → enable **Places API** → Credentials → API key.  
Restrict the key (HTTP referrers / IPs) before production.

---

## Flask / Python backend

Default API URL from the browser: **`NEXT_PUBLIC_PYTHON_BACKEND_URL=http://localhost:5000`**

---

## Quick check

- If the map is blank, open the browser **DevTools → Console**.  
  You should **not** see “Missing NEXT_PUBLIC_MAPBOX_API_KEY”.  
- If you see **403** or Mapbox errors, check token restrictions and billing on Mapbox.
