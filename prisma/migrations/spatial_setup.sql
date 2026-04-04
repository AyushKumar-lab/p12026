-- ============================================================
-- LocIntel PostGIS Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================

-- 1. Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add geography column to location_scores table
ALTER TABLE location_scores
  ADD COLUMN IF NOT EXISTS geog GEOGRAPHY(Point, 4326);

-- Populate from existing lat/lng
UPDATE location_scores
  SET geog = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::GEOGRAPHY
  WHERE geog IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- GIST index for fast radius queries
CREATE INDEX IF NOT EXISTS idx_location_scores_geog
  ON location_scores USING GIST(geog);

-- 3. Add geography column to properties table
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS geog GEOGRAPHY(Point, 4326);

-- Populate from existing lat/lng
UPDATE properties
  SET geog = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::GEOGRAPHY
  WHERE geog IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- GIST index for fast radius queries
CREATE INDEX IF NOT EXISTS idx_properties_geog
  ON properties USING GIST(geog);

-- 4. Create analysis_cache table for persisting analysis results
CREATE TABLE IF NOT EXISTS analysis_cache (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geog          GEOGRAPHY(Point, 4326) NOT NULL,
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  city          TEXT,
  business_type TEXT NOT NULL,
  radius_km     DOUBLE PRECISION NOT NULL,
  overall_score INT NOT NULL DEFAULT 0,
  result_json   JSONB NOT NULL,
  source        TEXT DEFAULT 'overpass',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '6 hours')
);

-- Spatial index on analysis_cache
CREATE INDEX IF NOT EXISTS idx_analysis_cache_geog
  ON analysis_cache USING GIST(geog);

-- Composite index for cache lookups
CREATE INDEX IF NOT EXISTS idx_analysis_cache_lookup
  ON analysis_cache (business_type, radius_km, expires_at);

-- 5. Create a trigger to auto-populate geog on insert/update for location_scores
CREATE OR REPLACE FUNCTION update_location_scores_geog()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::GEOGRAPHY;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_location_scores_geog ON location_scores;
CREATE TRIGGER trg_location_scores_geog
  BEFORE INSERT OR UPDATE OF latitude, longitude ON location_scores
  FOR EACH ROW EXECUTE FUNCTION update_location_scores_geog();

-- 6. Create a trigger to auto-populate geog on insert/update for properties
CREATE OR REPLACE FUNCTION update_properties_geog()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::GEOGRAPHY;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_properties_geog ON properties;
CREATE TRIGGER trg_properties_geog
  BEFORE INSERT OR UPDATE OF latitude, longitude ON properties
  FOR EACH ROW EXECUTE FUNCTION update_properties_geog();

-- 7. Helper function: find nearby locations within radius (meters)
CREATE OR REPLACE FUNCTION find_nearby_locations(
  p_lat     DOUBLE PRECISION,
  p_lng     DOUBLE PRECISION,
  p_radius_m DOUBLE PRECISION DEFAULT 5000
)
RETURNS SETOF location_scores AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM location_scores
    WHERE ST_DWithin(
      geog,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::GEOGRAPHY,
      p_radius_m
    )
    ORDER BY overall_score DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 8. Helper function: find nearby properties within radius (meters)
CREATE OR REPLACE FUNCTION find_nearby_properties(
  p_lat     DOUBLE PRECISION,
  p_lng     DOUBLE PRECISION,
  p_radius_m DOUBLE PRECISION DEFAULT 5000,
  p_type    TEXT DEFAULT NULL
)
RETURNS SETOF properties AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM properties
    WHERE ST_DWithin(
      geog,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::GEOGRAPHY,
      p_radius_m
    )
    AND (p_type IS NULL OR type::TEXT = p_type)
    AND status = 'AVAILABLE'
    ORDER BY rent ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 9. Create residential_listings table
CREATE TABLE IF NOT EXISTS residential_listings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geog              GEOGRAPHY(Point, 4326),
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  city              TEXT NOT NULL,
  locality          TEXT,
  property_type     TEXT NOT NULL DEFAULT '2BHK',  -- 1BHK, 2BHK, 3BHK, PG, Studio, Room
  bhk               INT,
  monthly_rent      INT NOT NULL,
  deposit           INT,
  furnished         TEXT DEFAULT 'unfurnished',     -- furnished, semi-furnished, unfurnished
  contact_whatsapp  TEXT,
  owner_name        TEXT,
  owner_phone       TEXT,
  verified          BOOLEAN DEFAULT false,
  photos            TEXT[] DEFAULT '{}',
  listed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GIST index for fast spatial queries on residential_listings
CREATE INDEX IF NOT EXISTS idx_residential_listings_geog
  ON residential_listings USING GIST(geog);

-- Composite indexes for common filter patterns
CREATE INDEX IF NOT EXISTS idx_residential_listings_city
  ON residential_listings (city, property_type);

CREATE INDEX IF NOT EXISTS idx_residential_listings_rent
  ON residential_listings (monthly_rent);

-- 10. Trigger to auto-populate geog on residential_listings
CREATE OR REPLACE FUNCTION update_residential_listings_geog()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::GEOGRAPHY;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_residential_listings_geog ON residential_listings;
CREATE TRIGGER trg_residential_listings_geog
  BEFORE INSERT OR UPDATE OF latitude, longitude ON residential_listings
  FOR EACH ROW EXECUTE FUNCTION update_residential_listings_geog();

-- 11. Helper function: find nearby residential listings within radius
CREATE OR REPLACE FUNCTION find_nearby_residential(
  p_lat       DOUBLE PRECISION,
  p_lng       DOUBLE PRECISION,
  p_radius_m  DOUBLE PRECISION DEFAULT 5000,
  p_type      TEXT DEFAULT NULL,
  p_max_rent  INT DEFAULT NULL
)
RETURNS SETOF residential_listings AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM residential_listings
    WHERE ST_DWithin(
      geog,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::GEOGRAPHY,
      p_radius_m
    )
    AND (p_type IS NULL OR property_type = p_type)
    AND (p_max_rent IS NULL OR monthly_rent <= p_max_rent)
    ORDER BY monthly_rent ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 12. Cleanup function: remove expired analysis cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM analysis_cache WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Done! Verify PostGIS is enabled:
SELECT PostGIS_Version();
