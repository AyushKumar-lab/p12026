"""
99acres Commercial Rent Scraper
Scrapes commercial property rent data for LocIntel's 5 supported cities.

Usage:
  python scripts/scrape_99acres.py --city bhubaneswar
  python scripts/scrape_99acres.py --all

Output: data/commercial_rents_{city}.json

Requirements: pip install requests beautifulsoup4
"""

import json
import os
import sys
import time
import random
from datetime import datetime

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Install dependencies: pip install requests beautifulsoup4")
    sys.exit(1)

CITIES = {
    "bhubaneswar": "bhubaneswar",
    "cuttack": "cuttack",
    "berhampur": "berhampur",
    "sambalpur": "sambalpur",
    "raipur": "raipur",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def scrape_99acres_commercial(city: str, max_pages: int = 3) -> list[dict]:
    """Scrape commercial rent listings from 99acres for a city."""
    results = []
    base_url = f"https://www.99acres.com/commercial-property-for-rent-in-{city}-ffid"

    for page in range(1, max_pages + 1):
        url = f"{base_url}/page-{page}" if page > 1 else base_url
        print(f"  Fetching page {page}: {url}")

        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                print(f"  HTTP {resp.status_code} — skipping page {page}")
                break

            soup = BeautifulSoup(resp.text, "html.parser")

            # 99acres uses various card classes — try common selectors
            cards = soup.select(".srp__card, .srpTuple, .nb__cardWrapper")
            if not cards:
                # Try alternative selectors
                cards = soup.select("[data-listing-id], .pageComponent")

            print(f"  Found {len(cards)} listing cards")

            for card in cards:
                try:
                    listing = parse_listing_card(card, city)
                    if listing and listing.get("monthly_rent"):
                        results.append(listing)
                except Exception as e:
                    print(f"  Error parsing card: {e}")
                    continue

        except requests.exceptions.RequestException as e:
            print(f"  Request error: {e}")
            break

        # Polite delay: 1-3 seconds between pages
        delay = 1.0 + random.random() * 2.0
        print(f"  Waiting {delay:.1f}s...")
        time.sleep(delay)

    return results


def parse_listing_card(card, city: str) -> dict | None:
    """Parse a single listing card from 99acres HTML."""
    result = {
        "city": city.title(),
        "source": "99acres",
        "scraped_at": datetime.now().isoformat(),
    }

    # Try to extract locality name
    locality_el = card.select_one(".body__title, .srpTuple__locName, .nb__cardTitle, h2, h3")
    if locality_el:
        result["locality"] = locality_el.get_text(strip=True)[:80]

    # Try to extract rent
    rent_el = card.select_one(".body__price, .srpTuple__price, .nb__cardPrice, [class*='price']")
    if rent_el:
        rent_text = rent_el.get_text(strip=True)
        result["monthly_rent"] = parse_rent(rent_text)

    # Try to extract area
    area_el = card.select_one("[class*='area'], [class*='size'], .body__areaLabel")
    if area_el:
        area_text = area_el.get_text(strip=True)
        result["area_sqft"] = parse_area(area_text)

    # Try to extract type (shop, office, etc.)
    type_el = card.select_one("[class*='type'], .body__type, .srpTuple__type")
    if type_el:
        result["property_type"] = type_el.get_text(strip=True)[:50]

    return result if result.get("monthly_rent") else None


def parse_rent(text: str) -> int | None:
    """Parse rent amount from text like '₹ 15,000 / month' or '15K'."""
    import re

    text = text.replace(",", "").replace("₹", "").strip().lower()

    # Match patterns like "15000", "15k", "1.5 lakh"
    match = re.search(r"([\d.]+)\s*(k|lakh|lac)?", text)
    if not match:
        return None

    amount = float(match.group(1))
    unit = match.group(2)

    if unit in ("lakh", "lac"):
        amount *= 100000
    elif unit == "k":
        amount *= 1000

    return int(amount) if amount > 500 else None  # Filter unrealistic values


def parse_area(text: str) -> int | None:
    """Parse area from text like '350 sq.ft' or '500 sqft'."""
    import re

    text = text.replace(",", "").lower()
    match = re.search(r"(\d+)\s*(?:sq\.?\s*ft|sqft|sft)", text)
    return int(match.group(1)) if match else None


def save_results(results: list[dict], city: str):
    """Save scraped results to JSON file."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, f"commercial_rents_{city}.json")

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(
            {
                "city": city.title(),
                "scraped_at": datetime.now().isoformat(),
                "count": len(results),
                "listings": results,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )

    print(f"  Saved {len(results)} listings to {filepath}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Scrape 99acres commercial rent data")
    parser.add_argument("--city", type=str, help="City to scrape")
    parser.add_argument("--all", action="store_true", help="Scrape all 5 cities")
    parser.add_argument("--pages", type=int, default=3, help="Max pages per city")
    args = parser.parse_args()

    if args.all:
        cities = list(CITIES.keys())
    elif args.city:
        city = args.city.lower()
        if city not in CITIES:
            print(f"Unknown city: {city}. Available: {', '.join(CITIES.keys())}")
            sys.exit(1)
        cities = [city]
    else:
        print("Specify --city <name> or --all")
        sys.exit(1)

    total = 0
    for city in cities:
        print(f"\n{'='*50}")
        print(f"Scraping 99acres commercial rent for {city.title()}...")
        print(f"{'='*50}")

        results = scrape_99acres_commercial(CITIES[city], max_pages=args.pages)
        save_results(results, city)
        total += len(results)

        if len(cities) > 1:
            time.sleep(3)  # Wait between cities

    print(f"\nDone! Total listings scraped: {total}")


if __name__ == "__main__":
    main()
