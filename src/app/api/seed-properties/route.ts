/**
 * Property Seeder API Route
 * Call this endpoint ONCE from the browser to seed Supabase with real
 * commercial property data fetched from OpenStreetMap Overpass API.
 * 
 * Usage: GET /api/seed-properties
 * Access: http://localhost:3000/api/seed-properties
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --------------------------------------------------------------------------
// City + area definitions
// --------------------------------------------------------------------------
const AREAS = [
  { city: "Bangalore", area: "Koramangala",   lat: 12.9352, lng: 77.6245, r: 1200 },
  { city: "Bangalore", area: "Indiranagar",   lat: 12.9784, lng: 77.6408, r: 1000 },
  { city: "Bangalore", area: "MG Road",       lat: 12.9716, lng: 77.5946, r: 800  },
  { city: "Bangalore", area: "HSR Layout",    lat: 12.9121, lng: 77.6446, r: 1200 },
  { city: "Bangalore", area: "Whitefield",    lat: 12.9698, lng: 77.7500, r: 1500 },
  { city: "Delhi",     area: "Connaught Place",lat: 28.6327, lng: 77.2201, r: 900  },
  { city: "Delhi",     area: "Lajpat Nagar",  lat: 28.5677, lng: 77.2415, r: 1000 },
  { city: "Delhi",     area: "Karol Bagh",    lat: 28.6519, lng: 77.1909, r: 1000 },
  { city: "Mumbai",    area: "Andheri West",  lat: 19.1297, lng: 72.8349, r: 1200 },
  { city: "Mumbai",    area: "Bandra West",   lat: 19.0596, lng: 72.8295, r: 900  },
  { city: "Hyderabad", area: "Hitech City",   lat: 17.4504, lng: 78.3816, r: 1500 },
  { city: "Hyderabad", area: "Banjara Hills", lat: 17.4156, lng: 78.4421, r: 1000 },
  { city: "Chennai",   area: "T Nagar",       lat: 13.0370, lng: 80.2315, r: 1000 },
  { city: "Chennai",   area: "Anna Nagar",    lat: 13.0862, lng: 80.2101, r: 1200 },
];

// Market rent per sqft (₹) per city/area
const RENT_RANGES: Record<string, Record<string, [number, number]>> = {
  Bangalore:  { Koramangala: [70, 110], Indiranagar: [60, 90], "MG Road": [150, 200], "HSR Layout": [50, 80], Whitefield: [45, 70] },
  Delhi:      { "Connaught Place": [200, 350], "Lajpat Nagar": [80, 130], "Karol Bagh": [90, 150] },
  Mumbai:     { "Andheri West": [120, 180], "Bandra West": [180, 280] },
  Hyderabad:  { "Hitech City": [55, 90], "Banjara Hills": [70, 120] },
  Chennai:    { "T Nagar": [60, 100], "Anna Nagar": [45, 80] },
};

const TYPE_IMAGES: Record<string, string[]> = {
  SHOP:      ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
               "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"],
  OFFICE:    ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
               "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"],
  RETAIL:    ["https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
               "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"],
  WAREHOUSE: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
  FOOD_COURT:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"],
  OTHER:     ["https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80"],
};

const AMENITY_SETS: Record<string, string[]> = {
  SHOP:      ["Water", "Power"],
  OFFICE:    ["Water", "Power", "Parking", "Security", "Lift", "AC Ready"],
  RETAIL:    ["Water", "Power", "Parking"],
  WAREHOUSE: ["Water", "Power", "Loading Dock", "24/7 Access", "Security"],
  FOOD_COURT:["Water", "Power", "Exhaust", "Drainage", "Security"],
  OTHER:     ["Water", "Power"],
};

function osmToPropType(tags: Record<string, string>): string {
  const amenity = tags.amenity || "";
  const office  = tags.office  || "";
  const shop    = tags.shop    || "";
  const building= tags.building || "";
  if (["restaurant","cafe","fast_food","food_court"].includes(amenity)) return "FOOD_COURT";
  if (office || building === "office") return "OFFICE";
  if (["supermarket","clothes","department_store"].includes(shop)) return "RETAIL";
  if (["warehouse","industrial"].includes(building)) return "WAREHOUSE";
  if (shop) return "SHOP";
  if (["commercial","retail"].includes(building)) return "RETAIL";
  return "SHOP";
}

function randInt(lo: number, hi: number): number {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function getSizeForType(t: string) {
  const m: Record<string, [number, number]> = {
    SHOP: [150, 600], RETAIL: [250, 800], OFFICE: [400, 2000],
    WAREHOUSE: [800, 3000], FOOD_COURT: [200, 700], OTHER: [100, 400],
  };
  const [lo, hi] = m[t] || [200, 600];
  return randInt(lo, hi);
}

async function fetchAreaProperties(
  lat: number, lng: number, radiusM: number
): Promise<any[]> {
  const query = `
[out:json][timeout:25];
(
  node["shop"]["name"](around:${radiusM},${lat},${lng});
  node["office"]["name"](around:${radiusM},${lat},${lng});
  node["amenity"~"restaurant|cafe|fast_food"]["name"](around:${radiusM},${lat},${lng});
  way["building"~"commercial|retail|office"]["name"](around:${radiusM},${lat},${lng});
);
out body center 40;
`;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(28000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.elements || [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const secretHeader = req.headers.get("x-seed-secret");
  const secret = process.env.SEED_SECRET || "locintel-seed-2026";
  if (secretHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized. Pass header: x-seed-secret: locintel-seed-2026" }, { status: 401 });
  }

  try {
    // Get or create a system landlord
    const { data: existingLandlord } = await supabase
      .from("users")
      .select("id")
      .eq("phone", "+910000000000")
      .single();

    let landlordId: string;

    if (existingLandlord) {
      landlordId = existingLandlord.id;
    } else {
      const { data: newLandlord, error: landlordErr } = await supabase
        .from("users")
        .insert([{
          phone: "+910000000000",
          email: "verified@locintel.in",
          name: "LocIntel Verified Partner",
          type: "LANDLORD",
          verified: true,
        }])
        .select("id")
        .single();

      if (landlordErr || !newLandlord) {
        return NextResponse.json({ error: "Could not create system landlord: " + landlordErr?.message }, { status: 500 });
      }
      landlordId = newLandlord.id;
    }

    const results: { area: string; count: number }[] = [];
    const seenKeys = new Set<string>();

    for (const areaInfo of AREAS) {
      const { city, area, lat, lng, r } = areaInfo;
      const elements = await fetchAreaProperties(lat, lng, r);

      const rows: any[] = [];
      for (let idx = 0; idx < elements.length; idx++) {
        const el = elements[idx];
        const tags = el.tags || {};
        const name = (tags.name || "").trim();
        if (!name) continue;

        const key = `${name.toLowerCase()}_${city.toLowerCase()}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        // Get lat/lng from node or way center
        const elLat = el.type === "node" ? el.lat : el.center?.lat;
        const elLng = el.type === "node" ? el.lon : el.center?.lon;
        if (!elLat || !elLng) continue;

        const propType = osmToPropType(tags);
        const size = getSizeForType(propType);
        const rentRange = RENT_RANGES[city]?.[area] || [40, 80];
        const rent = randInt(rentRange[0], rentRange[1]) * size;
        const score = randInt(65, 97);
        const imgs = TYPE_IMAGES[propType] || TYPE_IMAGES.OTHER;
        const amenities = AMENITY_SETS[propType] || AMENITY_SETS.OTHER;

        const shopTag = tags.shop || tags.amenity || tags.office || "";
        const typeLabel = shopTag.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || propType;

        rows.push({
          landlord_id:  landlordId,
          title:        `${name} — ${typeLabel}, ${area}`.slice(0, 200),
          location:     `${area}, ${city}`,
          city,
          latitude:     parseFloat(elLat.toFixed(6)),
          longitude:    parseFloat(elLng.toFixed(6)),
          rent,
          size_sqft:    size,
          type:         propType,
          status:       "AVAILABLE",
          verified:     true,
          amenities:    [amenities],
          images:       [imgs[idx % imgs.length]],
          match_score:  score,
          badge:        score >= 90 ? "Featured" : score >= 85 ? "Hot" : null,
          views_count:  0,
        });
      }

      if (rows.length > 0) {
        const { data: inserted, error: insertErr } = await supabase
          .from("properties")
          .insert(rows)
          .select("id");

        results.push({ area: `${area}, ${city}`, count: inserted?.length || 0 });

        if (insertErr) {
          console.error(`Error inserting ${area}:`, insertErr.message);
        }
      } else {
        results.push({ area: `${area}, ${city}`, count: 0 });
      }

      // Small delay to respect Overpass rate limits
      await new Promise(r => setTimeout(r, 1500));
    }

    const total = results.reduce((s, r) => s + r.count, 0);
    return NextResponse.json({
      success: true,
      message: `Seeded ${total} real properties from OpenStreetMap into Supabase`,
      breakdown: results,
      landlordId,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
