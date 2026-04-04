"""
NoBroker Residential Rent Scraper
Scrapes residential property rent data for LocIntel's 5 supported cities.

Usage:
  python scripts/scrape_nobroker.py --city bhubaneswar
  python scripts/scrape_nobroker.py --all

Output: data/residential_rents_{city}.json

Requirements: pip install selenium beautifulsoup4 webdriver-manager
Note: NoBroker is JS-heavy, requires Selenium with headless Chrome.
"""

import json
import os
import sys
import time
import random
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
except ImportError:
    print("Install dependencies: pip install selenium webdriver-manager")
    sys.exit(1)

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Install: pip install beautifulsoup4")
    sys.exit(1)

CITIES = {
    "bhubaneswar": {"url_slug": "bhubaneswar", "state": "Odisha"},
    "cuttack": {"url_slug": "cuttack", "state": "Odisha"},
    "berhampur": {"url_slug": "berhampur", "state": "Odisha"},
    "sambalpur": {"url_slug": "sambalpur", "state": "Odisha"},
    "raipur": {"url_slug": "raipur", "state": "Chhattisgarh"},
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def create_driver() -> webdriver.Chrome:
    """Create a headless Chrome driver."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )

    try:
        from webdriver_manager.chrome import ChromeDriverManager
        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=options)
    except Exception:
        # Try without webdriver-manager
        return webdriver.Chrome(options=options)


def scrape_nobroker_residential(city: str, city_config: dict, max_scrolls: int = 10) -> list[dict]:
    """Scrape residential rent listings from NoBroker for a city."""
    results = []
    slug = city_config["url_slug"]

    for prop_type in ["1bhk", "2bhk", "3bhk"]:
        url = f"https://www.nobroker.in/property/rent/{slug}/{slug.title()}/{prop_type}?searchParam=W3sibGF0IjoiIiwibG9uIjoiIiwidHlwZSI6IiJ9XQ==&radius=2.0&city={slug}&locality="
        print(f"  Scraping {prop_type.upper()} in {city.title()}: {url[:80]}...")

        try:
            driver = create_driver()
            driver.get(url)

            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            # Scroll to load more listings
            for scroll_num in range(max_scrolls):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
                delay = 2.0 + random.random() * 1.0
                time.sleep(delay)

                # Check if more content is loading
                cards = driver.find_elements(By.CSS_SELECTOR, "[class*='card'], [class*='listing'], [class*='property']")
                if len(cards) > 50:
                    break

                print(f"    Scroll {scroll_num + 1}/{max_scrolls} — {len(cards)} items loaded")

            # Parse loaded content
            soup = BeautifulSoup(driver.page_source, "html.parser")
            cards = soup.select("[class*='card'], [class*='listing'], article")

            print(f"  Found {len(cards)} listing cards for {prop_type.upper()}")

            for card in cards:
                try:
                    listing = parse_nobroker_card(card, city, prop_type)
                    if listing and listing.get("monthly_rent"):
                        results.append(listing)
                except Exception as e:
                    continue

            driver.quit()

        except Exception as e:
            print(f"  Error scraping {prop_type}: {e}")
            try:
                driver.quit()
            except Exception:
                pass

        # Delay between property types
        time.sleep(3 + random.random() * 2)

    return results


def parse_nobroker_card(card, city: str, prop_type: str) -> dict | None:
    """Parse a single NoBroker listing card."""
    import re

    result = {
        "city": city.title(),
        "type": prop_type.upper(),
        "source": "nobroker",
        "scraped_at": datetime.now().isoformat(),
    }

    # Extract locality
    locality_el = card.select_one("[class*='title'], [class*='locality'], [class*='address'], h2, h3")
    if locality_el:
        result["locality"] = locality_el.get_text(strip=True)[:80]

    # Extract rent
    rent_el = card.select_one("[class*='rent'], [class*='price'], [class*='amount']")
    if rent_el:
        rent_text = rent_el.get_text(strip=True)
        rent_text = re.sub(r"[^\d]", "", rent_text)
        if rent_text and int(rent_text) > 1000:
            result["monthly_rent"] = int(rent_text)

    # Extract deposit
    deposit_el = card.select_one("[class*='deposit']")
    if deposit_el:
        dep_text = re.sub(r"[^\d]", "", deposit_el.get_text(strip=True))
        if dep_text:
            result["deposit"] = int(dep_text)

    # Extract area
    area_el = card.select_one("[class*='area'], [class*='size'], [class*='sqft']")
    if area_el:
        area_text = re.sub(r"[^\d]", "", area_el.get_text(strip=True))
        if area_text and int(area_text) > 50:
            result["area_sqft"] = int(area_text)

    # Extract furnished status
    furnished_el = card.select_one("[class*='furnish']")
    if furnished_el:
        text = furnished_el.get_text(strip=True).lower()
        if "fully" in text or "furnished" == text:
            result["furnished"] = "furnished"
        elif "semi" in text:
            result["furnished"] = "semi-furnished"
        else:
            result["furnished"] = "unfurnished"

    return result if result.get("monthly_rent") else None


def save_results(results: list[dict], city: str):
    """Save scraped results to JSON file."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, f"residential_rents_{city}.json")

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

    parser = argparse.ArgumentParser(description="Scrape NoBroker residential rent data")
    parser.add_argument("--city", type=str, help="City to scrape")
    parser.add_argument("--all", action="store_true", help="Scrape all 5 cities")
    parser.add_argument("--scrolls", type=int, default=10, help="Max scroll iterations per page")
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
        print(f"Scraping NoBroker residential rent for {city.title()}...")
        print(f"{'='*50}")

        results = scrape_nobroker_residential(city, CITIES[city], max_scrolls=args.scrolls)
        save_results(results, city)
        total += len(results)

        if len(cities) > 1:
            time.sleep(5)  # Wait between cities

    print(f"\nDone! Total listings scraped: {total}")


if __name__ == "__main__":
    main()
