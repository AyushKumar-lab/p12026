"""
Census 2011 Ward Data Importer
Downloads and parses ward-level demographics from Census 2011 CSV files.

Usage:
  python scripts/import_census.py --file data/census_ward_data.csv
  python scripts/import_census.py --download

Source: https://censusindia.gov.in/census.website/data/census-tables
  → Primary Census Abstract (PCA) → Town/Ward level

Output: data/census_wards_{state}.json

The CSV should have columns like:
  State/UT, District, Tehsil, Town/Ward, Total Population, Male, Female,
  Literates, Workers, Non-Workers, Households

Requirements: pip install requests pandas
"""

import json
import os
import sys
import re
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

# Supported city coordinates for geocoding wards to lat/lng
CITY_CENTERS = {
    "bhubaneswar": {"lat": 20.2961, "lng": 85.8245, "state": "Odisha", "district": "Khordha"},
    "cuttack": {"lat": 20.4625, "lng": 85.8830, "state": "Odisha", "district": "Cuttack"},
    "berhampur": {"lat": 19.3150, "lng": 84.7941, "state": "Odisha", "district": "Ganjam"},
    "sambalpur": {"lat": 21.4669, "lng": 83.9812, "state": "Odisha", "district": "Sambalpur"},
    "raipur": {"lat": 21.2514, "lng": 81.6296, "state": "Chhattisgarh", "district": "Raipur"},
}


def parse_census_csv(filepath: str) -> list[dict]:
    """Parse Census 2011 PCA ward-level CSV into structured records."""
    try:
        import pandas as pd
    except ImportError:
        print("Install pandas: pip install pandas")
        sys.exit(1)

    print(f"Reading CSV: {filepath}")
    df = pd.read_csv(filepath, encoding="utf-8", low_memory=False)

    # Normalize column names (Census CSVs vary in header naming)
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # Try to identify key columns with fuzzy matching
    col_map = identify_columns(df.columns.tolist())
    if not col_map:
        print("ERROR: Could not identify required columns.")
        print(f"Available columns: {df.columns.tolist()}")
        sys.exit(1)

    print(f"Identified columns: {col_map}")

    results = []
    for _, row in df.iterrows():
        try:
            record = extract_ward_record(row, col_map)
            if record and record.get("total_population", 0) > 0:
                results.append(record)
        except Exception as e:
            continue

    print(f"Parsed {len(results)} ward records from CSV")
    return results


def identify_columns(columns: list[str]) -> dict | None:
    """Identify Census CSV column names using fuzzy matching."""
    col_map = {}

    patterns = {
        "state": r"state|st_name",
        "district": r"district|dist|dt_name",
        "town": r"town|ward|tehsil|subdivision|sub_dist",
        "total_population": r"tot.*pop|total.*pop|p_total|population",
        "male_population": r"male.*pop|m_pop|p_male|tot_m",
        "female_population": r"fem.*pop|f_pop|p_female|tot_f",
        "literates": r"liter|p_lit|literate",
        "workers": r"total.*work|main.*work|p_w|workers",
        "households": r"household|no.*hh|hh_total",
        "area": r"area|sq.*km",
    }

    for key, pattern in patterns.items():
        for col in columns:
            if re.search(pattern, col, re.IGNORECASE):
                col_map[key] = col
                break

    # Must have at minimum: population and some location identifier
    required = ["total_population"]
    if not all(k in col_map for k in required):
        return None

    return col_map


def extract_ward_record(row, col_map: dict) -> dict | None:
    """Extract a structured ward record from a CSV row."""
    record = {"scraped_at": datetime.now().isoformat(), "source": "census_2011"}

    for key, col in col_map.items():
        val = row.get(col)
        if val is not None:
            if key in ("total_population", "male_population", "female_population",
                        "literates", "workers", "households"):
                try:
                    record[key] = int(float(str(val).replace(",", "")))
                except (ValueError, TypeError):
                    record[key] = 0
            elif key == "area":
                try:
                    record[key] = float(str(val).replace(",", ""))
                except (ValueError, TypeError):
                    pass
            else:
                record[key] = str(val).strip()

    # Derive additional metrics
    pop = record.get("total_population", 0)
    if pop > 0:
        lit = record.get("literates", 0)
        record["literacy_rate"] = round((lit / pop) * 100, 1) if lit else 0

        male = record.get("male_population", 0)
        female = record.get("female_population", 0)
        record["sex_ratio"] = round((female / male) * 1000) if male > 0 else 0

        workers = record.get("workers", 0)
        record["workforce_percent"] = round((workers / pop) * 100, 1) if workers else 0

        area = record.get("area", 0)
        record["population_density"] = round(pop / area) if area > 0 else 0

    return record


def filter_for_supported_cities(records: list[dict]) -> dict[str, list[dict]]:
    """Filter census records to only include supported cities."""
    city_records: dict[str, list[dict]] = {}

    for city_name, city_info in CITY_CENTERS.items():
        matching = []
        for record in records:
            district = record.get("district", "").lower()
            state = record.get("state", "").lower()
            town = record.get("town", "").lower()

            # Match by district or direct city name mention
            if (city_info["district"].lower() in district or
                city_name in town or
                city_name in district):
                if city_info["state"].lower() in state or not state:
                    matching.append(record)

        if matching:
            city_records[city_name] = matching
            print(f"  {city_name.title()}: {len(matching)} ward records")

    return city_records


def generate_typescript_seed(city_records: dict[str, list[dict]]) -> str:
    """Generate TypeScript seed data from parsed census records."""
    lines = [
        "// Auto-generated from Census 2011 data",
        f"// Generated at: {datetime.now().isoformat()}",
        "// Source: censusindia.gov.in",
        "",
    ]

    for city, records in city_records.items():
        lines.append(f"  // ── {city.title()} ──")
        for r in records[:10]:  # Max 10 wards per city for seed
            ward = r.get("town", "Unknown Ward")
            lines.append(
                f"  {{ wardName: '{ward}', city: '{city.title()}', "
                f"state: '{CITY_CENTERS[city]['state']}', "
                f"lat: {CITY_CENTERS[city]['lat']}, lng: {CITY_CENTERS[city]['lng']}, "
                f"populationDensity: {r.get('population_density', 0)}, "
                f"totalPopulation: {r.get('total_population', 0)}, "
                f"literacyRate: {r.get('literacy_rate', 0)}, "
                f"youthPercent: 30, workingAgePercent: 38, "
                f"households: {r.get('households', 0)}, "
                f"workforcePercent: {r.get('workforce_percent', 0)}, "
                f"spendingPowerIndex: 50, "
                f"sexRatio: {r.get('sex_ratio', 0)} }},"
            )
        lines.append("")

    return "\n".join(lines)


def save_results(city_records: dict[str, list[dict]]):
    """Save parsed census data as JSON files per city."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for city, records in city_records.items():
        filepath = os.path.join(OUTPUT_DIR, f"census_wards_{city}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "city": city.title(),
                    "state": CITY_CENTERS[city]["state"],
                    "source": "Census 2011 (censusindia.gov.in)",
                    "parsed_at": datetime.now().isoformat(),
                    "ward_count": len(records),
                    "wards": records,
                },
                f,
                indent=2,
                ensure_ascii=False,
            )
        print(f"  Saved {len(records)} wards to {filepath}")

    # Also generate TS seed snippet
    ts_snippet = generate_typescript_seed(city_records)
    ts_path = os.path.join(OUTPUT_DIR, "census_seed_snippet.ts")
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(ts_snippet)
    print(f"  TypeScript seed snippet: {ts_path}")


def download_sample():
    """Download Census 2011 Primary Census Abstract sample."""
    try:
        import requests
    except ImportError:
        print("Install requests: pip install requests")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Census 2011 data must be downloaded manually from:")
    print("  https://censusindia.gov.in/census.website/data/census-tables")
    print("")
    print("Steps:")
    print("  1. Go to censusindia.gov.in")
    print("  2. Navigate to Census Tables → Primary Census Abstract")
    print("  3. Select 'Town/Ward level' data")
    print("  4. Filter by State: Odisha / Chhattisgarh")
    print("  5. Download CSV for each state")
    print("  6. Save as: data/census_ward_odisha.csv, data/census_ward_chhattisgarh.csv")
    print("")
    print("Then run:")
    print("  python scripts/import_census.py --file data/census_ward_odisha.csv")
    print("  python scripts/import_census.py --file data/census_ward_chhattisgarh.csv")
    print("")
    print("Alternative: Use data.gov.in API")
    print("  https://data.gov.in/catalog/primary-census-abstract-towns")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Import Census 2011 ward-level data")
    parser.add_argument("--file", type=str, help="Path to Census CSV file")
    parser.add_argument("--download", action="store_true", help="Show download instructions")
    parser.add_argument("--generate-seed", action="store_true", help="Generate TS seed data from JSON files")
    args = parser.parse_args()

    if args.download:
        download_sample()
        return

    if args.generate_seed:
        # Read existing JSON files and generate TS
        city_records = {}
        for city in CITY_CENTERS:
            json_path = os.path.join(OUTPUT_DIR, f"census_wards_{city}.json")
            if os.path.exists(json_path):
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    city_records[city] = data.get("wards", [])
        if city_records:
            ts_snippet = generate_typescript_seed(city_records)
            print(ts_snippet)
        else:
            print("No JSON files found. Run with --file first.")
        return

    if args.file:
        if not os.path.exists(args.file):
            print(f"File not found: {args.file}")
            sys.exit(1)

        records = parse_census_csv(args.file)
        city_records = filter_for_supported_cities(records)

        if not city_records:
            print("No records matched supported cities.")
            print("Check that CSV contains Odisha or Chhattisgarh district data.")
            sys.exit(1)

        save_results(city_records)
        print(f"\nDone! Processed {sum(len(v) for v in city_records.values())} ward records")
    else:
        print("Specify --file <path> or --download")
        sys.exit(1)


if __name__ == "__main__":
    main()
