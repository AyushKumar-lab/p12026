#!/usr/bin/env python3
"""
LocIntel Dataset Downloader
Downloads training datasets from Kaggle and open sources.
Run: python scripts/download_datasets.py
"""
from __future__ import annotations

import os
import sys
import shutil
import zipfile
import urllib.request
import ssl
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "raw"

# Disable SSL verification for some gov sites with bad certs
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def download_file(url: str, dest: Path, desc: str = "") -> bool:
    """Download a file with progress indication."""
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"  ✅ Already exists: {dest.name} ({dest.stat().st_size / 1024:.0f} KB)")
        return True

    print(f"  ⬇️  Downloading {desc or dest.name}...")
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=120, context=ctx) as resp:
            dest.parent.mkdir(parents=True, exist_ok=True)
            with open(dest, "wb") as f:
                total = 0
                while True:
                    chunk = resp.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)
                    total += len(chunk)
        print(f"  ✅ Downloaded: {dest.name} ({total / 1024:.0f} KB)")
        return True
    except Exception as e:
        print(f"  ❌ Failed: {e}")
        if dest.exists():
            dest.unlink()
        return False


def unzip_file(zip_path: Path, extract_to: Path) -> bool:
    """Extract a zip file."""
    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(extract_to)
        print(f"  📦 Extracted to {extract_to}")
        return True
    except Exception as e:
        print(f"  ❌ Unzip failed: {e}")
        return False


def download_kaggle_datasets():
    """Download critical Kaggle datasets using opendatasets."""
    try:
        import opendatasets as od
    except ImportError:
        print("  ⚠️  opendatasets not installed. Run: pip install opendatasets")
        return

    datasets = [
        # (url, destination folder name, description)
        (
            "https://www.kaggle.com/datasets/himanshupoddar/zomato-bangalore-restaurants",
            DATA_DIR / "zomato",
            "Zomato Bangalore (51K restaurants with ratings + open/closed status)"
        ),
        (
            "https://www.kaggle.com/datasets/danofer/india-census",
            DATA_DIR / "census_2011",
            "India Census 2011 (District-level demographics)"
        ),
        (
            "https://www.kaggle.com/datasets/rajanand/rainfall-in-india",
            DATA_DIR / "rainfall",
            "India Rainfall Data 1901-2017 (District-level monthly rainfall)"
        ),
        (
            "https://www.kaggle.com/datasets/sagyamthapa/99acres-housing-price-dataset",
            DATA_DIR / "rent",
            "99acres Housing Prices (Property prices across Indian cities)"
        ),
        (
            "https://www.kaggle.com/datasets/chirag19/indian-cities-database",
            DATA_DIR / "pois",
            "Indian Cities Database (City-level features)"
        ),
    ]

    print("\n" + "=" * 60)
    print("📦 KAGGLE DATASETS")
    print("=" * 60)
    print("\n⚠️  You'll need your Kaggle credentials.")
    print("   Get them from: https://www.kaggle.com/settings → API → Create New Token")
    print("   This downloads kaggle.json with your username + key.\n")

    for url, dest_dir, desc in datasets:
        print(f"\n🔹 {desc}")
        try:
            od.download(url, data_dir=str(dest_dir.parent))
            # opendatasets creates a subfolder with the dataset name
            dataset_name = url.rstrip("/").split("/")[-1]
            downloaded_dir = dest_dir.parent / dataset_name
            if downloaded_dir.exists() and downloaded_dir != dest_dir:
                if dest_dir.exists():
                    shutil.rmtree(dest_dir)
                shutil.move(str(downloaded_dir), str(dest_dir))
            print(f"  ✅ Saved to {dest_dir}")
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            print(f"     Manual download: {url}")


def download_open_datasets():
    """Download freely available datasets (no auth required)."""

    print("\n" + "=" * 60)
    print("🌐 OPEN DATASETS (No authentication required)")
    print("=" * 60)

    # 1. Geofabrik OSM India (PBF format - contains all POIs, transit, buildings)
    print("\n🔹 OpenStreetMap India Extract (Geofabrik) — All POIs, transit, buildings")
    # This is large (~1.5GB). Download the Odisha + Chhattisgarh specific extracts instead
    osm_urls = [
        (
            "https://download.geofabrik.de/asia/india/eastern-zone-latest.osm.pbf",
            DATA_DIR / "pois" / "eastern-zone-latest.osm.pbf",
            "OSM Eastern Zone (Odisha, Jharkhand, Bihar, WB)"
        ),
    ]
    for url, dest, desc in osm_urls:
        print(f"\n  ℹ️  {desc}")
        print(f"  ⚠️  Large file (~500MB). Download manually if needed:")
        print(f"     {url}")
        # Skip auto-download for very large files
        # download_file(url, dest, desc)

    # 2. India Pincode database (small, useful for lat/lng mapping)
    print("\n🔹 India Pincode Database (lat/lng for all pincodes)")
    download_file(
        "https://raw.githubusercontent.com/AnjaliSharma1234/India-Pincode-Lat-Long-Data/main/India_Pincodes.csv",
        DATA_DIR / "pois" / "india_pincodes.csv",
        "India Pincodes with lat/lng"
    )

    # 3. India district boundaries GeoJSON
    print("\n🔹 India District Boundaries GeoJSON")
    download_file(
        "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson",
        DATA_DIR / "pois" / "india_districts.geojson",
        "India District Boundaries"
    )

    # 4. India state boundaries GeoJSON  
    print("\n🔹 India State Boundaries GeoJSON")
    download_file(
        "https://raw.githubusercontent.com/Subhash9325/GeoJSON-Polygons-of-the-United-States/master/India_States_Geo.geojson",
        DATA_DIR / "pois" / "india_states.geojson",
        "India State Boundaries"
    )


def download_census_direct():
    """Download Census summary data from direct sources."""
    print("\n🔹 Census 2011 Summary Data (Town-level)")

    # Primary Census Abstract - Town level
    census_urls = [
        (
            "https://raw.githubusercontent.com/datameet/india-census-2011/master/csv/pca-full/DDW-PCA-MDDS-0000-towns.csv",
            DATA_DIR / "census_2011" / "census_towns_pca.csv",
            "Census PCA Towns"
        ),
        (
            "https://raw.githubusercontent.com/datameet/india-census-2011/master/csv/pca-full/DDW-PCA-MDDS-2100-towns.csv",
            DATA_DIR / "census_2011" / "census_odisha_towns.csv",
            "Census Odisha PCA Towns"
        ),
        (
            "https://raw.githubusercontent.com/datameet/india-census-2011/master/csv/pca-full/DDW-PCA-MDDS-2200-towns.csv",
            DATA_DIR / "census_2011" / "census_chhattisgarh_towns.csv",
            "Census Chhattisgarh PCA Towns"
        ),
    ]
    for url, dest, desc in census_urls:
        download_file(url, dest, desc)


def create_kaggle_credentials_guide():
    """Print instructions for setting up Kaggle API."""
    guide_path = DATA_DIR / "KAGGLE_SETUP.md"
    guide_path.write_text("""# Kaggle API Setup

## Steps:
1. Go to https://www.kaggle.com/settings
2. Scroll to "API" section
3. Click "Create New Token" — downloads `kaggle.json`
4. Move it to: `C:\\Users\\<YOUR_USER>\\.kaggle\\kaggle.json`
5. Re-run: `python scripts/download_datasets.py`

## Alternative: Manual Download
If you don't want to set up the API, download these manually:

1. **Zomato Bangalore** (MOST IMPORTANT for success labels)
   https://www.kaggle.com/datasets/himanshupoddar/zomato-bangalore-restaurants
   → Save to: data/raw/zomato/

2. **India Census 2011**
   https://www.kaggle.com/datasets/danofer/india-census
   → Save to: data/raw/census_2011/

3. **India Rainfall**
   https://www.kaggle.com/datasets/rajanand/rainfall-in-india
   → Save to: data/raw/rainfall/

4. **99acres Rent Data**
   https://www.kaggle.com/datasets/sagyamthapa/99acres-housing-price-dataset
   → Save to: data/raw/rent/
""", encoding="utf-8")
    print(f"\n📄 Kaggle setup guide saved to: {guide_path}")


def main():
    print("🚀 LocIntel Dataset Downloader")
    print(f"📁 Data directory: {DATA_DIR}\n")

    # Ensure directories exist
    for d in ["foursquare_places", "zomato", "census_2011", "rainfall", "rent", "mobility", "labels", "pois"]:
        (DATA_DIR / d).mkdir(parents=True, exist_ok=True)

    # Phase 1: Open datasets (no auth)
    download_open_datasets()
    download_census_direct()

    # Phase 2: Kaggle datasets (needs credentials)
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if kaggle_json.exists():
        download_kaggle_datasets()
    else:
        print("\n" + "=" * 60)
        print("⚠️  KAGGLE CREDENTIALS NOT FOUND")
        print("=" * 60)
        create_kaggle_credentials_guide()
        print("\n🔧 To download Kaggle datasets:")
        print("   1. Go to https://www.kaggle.com/settings → API → Create New Token")
        print(f"   2. Save kaggle.json to: {kaggle_json}")
        print("   3. Re-run this script: python scripts/download_datasets.py")
        print("\n   OR use Kaggle CLI directly:")
        print("   kaggle datasets download -d himanshupoddar/zomato-bangalore-restaurants -p data/raw/zomato --unzip")
        print("   kaggle datasets download -d danofer/india-census -p data/raw/census_2011 --unzip")
        print("   kaggle datasets download -d rajanand/rainfall-in-india -p data/raw/rainfall --unzip")
        print("   kaggle datasets download -d sagyamthapa/99acres-housing-price-dataset -p data/raw/rent --unzip")

    # Summary
    print("\n" + "=" * 60)
    print("📊 DOWNLOAD SUMMARY")
    print("=" * 60)
    for d in sorted(DATA_DIR.iterdir()):
        if d.is_dir():
            files = list(d.rglob("*"))
            file_count = len([f for f in files if f.is_file()])
            total_size = sum(f.stat().st_size for f in files if f.is_file())
            status = "✅" if file_count > 0 else "❌"
            print(f"  {status} {d.name}: {file_count} files ({total_size / 1024:.0f} KB)")

    print("\n🎯 Next steps:")
    print("   1. Set up Kaggle credentials (if not done)")
    print("   2. Re-run this script to download Kaggle datasets")
    print("   3. Run: python scripts/build_training_data.py (to merge into training CSV)")
    print("   4. Run: python scripts/train_xgboost.py (to retrain model)")


if __name__ == "__main__":
    main()
