# What to add in Supabase for an advanced app

Use this as a checklist. All of these are **optional**; the app works without them.

---

## 1. Already in use (no change needed)

- **users** – name, phone, email, type (SEEKER | LANDLORD), verified  
- **properties** – listings with landlord_id, location, rent, size_sqft, type, amenities, images  
- **inquiries** – seeker_id, property_id, landlord_id, message, status  

Competitor names and scores come **live from OpenStreetMap** (Overpass API). They are not stored in Supabase.

---

## 2. Optional: Cache analysis results (faster repeat searches)

If you want to cache “Top 10” results so the same area + business type is not re-analysed every time:

```sql
CREATE TABLE analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  radius_km FLOAT NOT NULL,
  business_type TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_analysis_cache_key
  ON analysis_cache (ROUND(lat::numeric, 4), ROUND(lng::numeric, 4), radius_km, business_type);
```

Your app can then check this table before calling Overpass and use cached `result` when present (e.g. if `created_at` is within last 7 days).

---

## 3. Optional: Saved recommendations (user favourites)

Let users save “Top 10” or a single spot for later:

```sql
CREATE TABLE saved_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Snapshot of the recommendation (spot rank, score, lat, lng, place name, etc.)
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_saved_recommendations_user ON saved_recommendations(user_id);
```

You’ll need a “Save this spot” / “Save this list” flow in the app and an API that inserts into `saved_recommendations` with `user_id` and `payload`.

---

## 4. Optional: Competitor profiles (names + your own “experience” data)

Competitor **names** (and type) come from OpenStreetMap. OSM does **not** have “experience” or ratings. If you want to store extra data (e.g. “years in business”, “rating”, “notes”):

```sql
CREATE TABLE competitor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Optional link to OSM node (if you want to match by id later)
  osm_node_id BIGINT,
  name TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  business_type TEXT,
  -- Your own fields
  years_in_business INT,
  rating FLOAT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Then in your app you can match OSM competitors by name/lat/lng and show enriched data from `competitor_profiles` when available.

---

## 5. Optional: Property availability / calendar

If you want “available from date” or a simple calendar:

```sql
-- Add to existing properties table (run in SQL editor):
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS available_from DATE,
  ADD COLUMN IF NOT EXISTS notice_period_days INT DEFAULT 0;
```

Use these in your listing form and filters.

---

## 6. Optional: RLS for write access

You already have read policies. If you add auth (e.g. Supabase Auth), you can restrict writes:

- Only authenticated LANDLORD can INSERT/UPDATE their own properties.  
- Only authenticated user can INSERT their own inquiries.  

Example (after enabling Supabase Auth):

```sql
-- Example: only allow insert on properties when user is the landlord
CREATE POLICY "Landlords can insert own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);
```

---

## Summary

| Feature                    | Table / change              | Purpose                          |
|---------------------------|-----------------------------|----------------------------------|
| Cache analyses            | `analysis_cache`            | Faster repeat searches           |
| Save recommendations      | `saved_recommendations`     | User favourites                  |
| Competitor “experience”   | `competitor_profiles`       | Your own notes/ratings per place |
| Availability dates        | `properties.available_from`| When the space is free           |
| Secure writes             | RLS policies               | After you add auth               |

Competitor **names** and **actual scores** are from OpenStreetMap only; no Supabase table is required for that.
