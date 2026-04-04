#!/usr/bin/env python3
"""Download missing city POIs from Overpass API."""
import os
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

cities = {
    "berhampur": (19.25, 84.72, 19.38, 84.85),
    "sambalpur": (21.38, 83.90, 21.52, 84.05),
    "raipur": (21.15, 81.53, 21.32, 81.72),
}

for city, (s, w, n, e) in cities.items():
    dest = POIS_DIR / f"osm_{city}_pois.csv"
    if dest.exists() and dest.stat().st_size > 500:
        print(f"[SKIP] {city} already exists ({dest.stat().st_size // 1024} KB)")
        continue

    print(f"Fetching {city} POIs from Overpass API...")

    query = (
        '[out:csv(::id,::lat,::lon,name,amenity,shop,cuisine;true;"|")]'
        '[timeout:90];'
        '('
        f'node["amenity"~"restaurant|cafe|fast_food|pharmacy|hospital|bank|atm|fuel|school|college|gym|clinic"]({s},{w},{n},{e});'
        f'node["shop"~"supermarket|convenience|clothes|electronics|hairdresser|beauty|mobile_phone|jewelry|bakery|butcher"]({s},{w},{n},{e});'
        ');'
        'out body;'
    )

    url = "https://overpass-api.de/api/interpreter"
    try:
        data = urllib.parse.urlencode({"data": query}).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={
            "User-Agent": "LocIntel/1.0 (research project)",
            "Content-Type": "application/x-www-form-urlencoded",
        })
        resp = urllib.request.urlopen(req, timeout=120, context=ctx)
        result = resp.read()
        with open(dest, "wb") as f:
            f.write(result)
        lines = result.decode("utf-8", errors="ignore").strip().split("\n")
        print(f"[OK] {city}: {len(lines) - 1} POIs ({len(result) // 1024} KB)")
    except Exception as e:
        print(f"[FAIL] {city}: {e}")

    time.sleep(8)

print("\nDone! Now re-run: python scripts/download_all_data.py")
print("Then: python scripts/train_xgboost.py")
