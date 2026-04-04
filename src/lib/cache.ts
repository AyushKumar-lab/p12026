/**
 * Cache utility — Upstash Redis with in-memory fallback
 *
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses Upstash.
 * Otherwise falls back to an in-memory Map (lost on restart, fine for dev).
 */

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface CacheAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
}

/* ------------------------------------------------------------------ */
/* In-memory fallback                                                   */
/* ------------------------------------------------------------------ */

const memStore = new Map<string, { value: string; expiresAt: number }>();

const memoryAdapter: CacheAdapter = {
  async get(key) {
    const entry = memStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memStore.delete(key);
      return null;
    }
    return entry.value;
  },
  async set(key, value, ttlSeconds) {
    memStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  },
  async del(key) {
    memStore.delete(key);
  },
};

/* ------------------------------------------------------------------ */
/* Upstash adapter (lazy-loaded)                                        */
/* ------------------------------------------------------------------ */

let _upstashAdapter: CacheAdapter | null = null;

function getUpstashAdapter(): CacheAdapter | null {
  if (_upstashAdapter) return _upstashAdapter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  // Simple Upstash REST adapter (no SDK dependency needed)
  _upstashAdapter = {
    async get(key: string) {
      try {
        const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.result ?? null;
      } catch {
        return null;
      }
    },
    async set(key: string, value: string, ttlSeconds: number) {
      try {
        await fetch(
          `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/ex/${ttlSeconds}`,
          { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        // Silently fail — caching is best-effort
      }
    },
    async del(key: string) {
      try {
        await fetch(`${url}/del/${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Silently fail
      }
    },
  };

  return _upstashAdapter;
}

/* ------------------------------------------------------------------ */
/* Public API                                                           */
/* ------------------------------------------------------------------ */

function getAdapter(): CacheAdapter {
  return getUpstashAdapter() ?? memoryAdapter;
}

/** Get a cached value, parsed from JSON */
export async function cacheGet<T = unknown>(key: string): Promise<T | null> {
  try {
    const raw = await getAdapter().get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Set a value in cache as JSON with TTL in seconds */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await getAdapter().set(key, JSON.stringify(value), ttlSeconds);
  } catch {
    // Best-effort — don't crash if cache write fails
  }
}

/** Delete a key from cache */
export async function cacheDel(key: string): Promise<void> {
  try {
    await getAdapter().del(key);
  } catch {
    // Best-effort
  }
}

/**
 * Build a deterministic cache key for analysis queries.
 * Rounds lat/lng to ~11m precision (4 decimals) to group nearby queries.
 */
export function buildAnalysisCacheKey(
  lat: number,
  lng: number,
  businessType: string,
  radiusKm: number
): string {
  const rlat = lat.toFixed(4);
  const rlng = lng.toFixed(4);
  const type = businessType.toLowerCase().replace(/\s+/g, '_');
  return `analysis:${rlat}:${rlng}:${type}:${radiusKm}`;
}

/**
 * Build a cache key for Overpass queries.
 * Uses a simple hash of the query string.
 */
export function buildOverpassCacheKey(query: string): string {
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // 32-bit int
  }
  return `overpass:${Math.abs(hash).toString(36)}`;
}

/** Cache TTL constants */
export const CACHE_TTL = {
  /** Full analysis result — 6 hours */
  ANALYSIS: 6 * 60 * 60,
  /** Individual Overpass API call — 24 hours */
  OVERPASS: 24 * 60 * 60,
  /** City-level data — 48 hours */
  CITY_DATA: 48 * 60 * 60,
} as const;

/**
 * Cache-or-fetch wrapper.
 * Checks cache first, calls fetchFn on miss, stores result.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return { data: cached, cached: true };
  }

  const data = await fetchFn();
  // Don't await cache write — fire and forget
  cacheSet(key, data, ttlSeconds).catch(() => {});
  return { data, cached: false };
}

/** Returns the current cache mode for diagnostics */
export function getCacheMode(): 'upstash' | 'memory' {
  return getUpstashAdapter() ? 'upstash' : 'memory';
}
