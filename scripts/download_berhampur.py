#!/usr/bin/env python3
"""
Download Berhampur POIs from Overpass API using chunked bounding boxes
to avoid timeout issues. Splits the city bbox into smaller quadrants.
"""
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POIS_DIR = ROOT / "data" / "raw" / "pois"
POIS_DIR.mkdir(parents=True, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def fetch_overpass_chunk(s, w, n, e, timeout=120):
    """Fetch POIs for a single bounding box chunk."""
    query = (
        '[out:csv(::id,::lat,::lon,name,amenity,shop,cuisine;true;"|")]'
        f'[timeout:{timeout}];'
        '('
        f'node["amenity"~"restaurant|cafe|fast_food|pharmacy|hospital|bank|atm|fuel|school|college|gym|clinic"]({s},{w},{n},{e});'
        f'node["shop"~"supermarket|convenience|clothes|electronics|hairdresser|beauty|mobile_phone|jewelry|bakery|butcher"]({s},{w},{n},{e});'
        ');'
        'out body;'
    )

    url = "https://overpass-api.de/api/interpreter"
    data = urllib.parse.urlencode({"data": query}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={
        "User-Agent": "LocIntel/1.0 (research project)",
        "Content-Type": "application/x-www-form-urlencoded",
    })
    resp = urllib.request.urlopen(req, timeout=timeout + 30, context=ctx)
    return resp.read().decode("utf-8", errors="ignore")


def split_bbox(s, w, n, e, rows=2, cols=2):
    """Split a bounding box into a grid of smaller chunks."""
    lat_step = (n - s) / rows
    lon_step = (e - w) / cols
    chunks = []
    for r in range(rows):
        for c in range(cols):
            cs = round(s + r * lat_step, 4)
            cn = round(s + (r + 1) * lat_step, 4)
            cw = round(w + c * lon_step, 4)
            ce = round(w + (c + 1) * lon_step, 4)
            chunks.append((cs, cw, cn, ce))
    return chunks


def main():
    city = "berhampur"
    dest = POIS_DIR / f"osm_{city}_pois.csv"

    # Berhampur core urban area (tighter than before)
    full_bbox = (19.28, 84.76, 19.36, 84.84)

    # Split into 4 quadrants to reduce per-query load
    chunks = split_bbox(*full_bbox, rows=2, cols=2)

    print(f"Fetching {city} POIs in {len(chunks)} chunks...")
    all_lines = []
    header = None

    for i, (s, w, n, e) in enumerate(chunks):
        label = f"  Chunk {i+1}/{len(chunks)} ({s},{w} -> {n},{e})"
        print(f"{label}...", end=" ", flush=True)

        retries = 3
        for attempt in range(retries):
            try:
                result = fetch_overpass_chunk(s, w, n, e, timeout=90)
                lines = result.strip().split("\n")

                if not header and lines:
                    header = lines[0]

                # Skip header line, collect data lines
                data_lines = [l for l in lines[1:] if l.strip()]
                all_lines.extend(data_lines)
                print(f"OK ({len(data_lines)} POIs)")
                break
            except Exception as ex:
                if attempt < retries - 1:
                    wait = 10 * (attempt + 1)
                    print(f"RETRY ({ex}), waiting {wait}s...", end=" ", flush=True)
                    time.sleep(wait)
                else:
                    print(f"FAIL ({ex})")

        # Rate limit between chunks
        if i < len(chunks) - 1:
            time.sleep(8)

    # Deduplicate by OSM ID (first field)
    seen_ids = set()
    unique_lines = []
    for line in all_lines:
        osm_id = line.split("|")[0] if "|" in line else line
        if osm_id not in seen_ids:
            seen_ids.add(osm_id)
            unique_lines.append(line)

    if unique_lines and header:
        with open(dest, "w", encoding="utf-8") as f:
            f.write(header + "\n")
            for line in unique_lines:
                f.write(line + "\n")
        print(f"\n[OK] Saved {len(unique_lines)} unique POIs to {dest}")
        print(f"     File size: {dest.stat().st_size // 1024} KB")
    else:
        print(f"\n[FAIL] No data retrieved for {city}")
        # Fallback: try single query with very tight bbox (just city center)
        print("Trying fallback with very tight bbox (city center only)...")
        try:
            result = fetch_overpass_chunk(19.30, 84.78, 19.33, 84.82, timeout=120)
            with open(dest, "wb") as f:
                f.write(result.encode("utf-8"))
            lines = result.strip().split("\n")
            print(f"[OK] Fallback got {len(lines)-1} POIs")
        except Exception as ex:
            print(f"[FAIL] Fallback also failed: {ex}")


if __name__ == "__main__":
    main()
