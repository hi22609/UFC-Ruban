"""
UFC Ruban — Fix Missing Stats
Detects fighters with zero/missing stats and re-scrapes them individually.
Also handles upcoming fighters not yet in the DB.
Run this before fight week predictions if any fighters show missing data.
"""

import os
import sys
import time
import sqlite3
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Add scrapers to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python', 'scrapers'))
from ufc_stats_scraper import scrape_fighter_page, upsert_fighter, get_all_fighter_urls

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'ufc.db')
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
BASE_URL = 'http://www.ufcstats.com'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def find_missing_fighters(conn) -> list:
    """Find fighters in upcoming_cards that are missing from fighters table or have zero stats."""
    cur = conn.cursor()

    # Fighters in upcoming card
    cur.execute("SELECT DISTINCT fighter1 as name FROM upcoming_cards UNION SELECT DISTINCT fighter2 as name FROM upcoming_cards")
    card_fighters = [row['name'] for row in cur.fetchall()]

    missing = []
    for name in card_fighters:
        cur.execute("SELECT * FROM fighters WHERE LOWER(name) LIKE LOWER(?)", (f"%{name}%",))
        row = cur.fetchone()
        if not row:
            missing.append({'name': name, 'reason': 'NOT IN DATABASE'})
        else:
            row = dict(row)
            if all(row.get(k, 0) in [0, None] for k in ['slpm', 'sapm', 'td_avg', 'sub_avg']):
                missing.append({'name': name, 'reason': 'ZERO STATS — needs re-scrape', 'url': row.get('fighter_url')})

    return missing

def search_fighter_url(name: str) -> str | None:
    """Search ufcstats.com for a specific fighter by name."""
    # Try name search
    parts = name.split()
    for char in [parts[0][0].lower()] if parts else ['a']:
        url = f'{BASE_URL}/statistics/fighters?char={char}&page=all'
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            soup = BeautifulSoup(resp.text, 'lxml')
            links = soup.find_all('a', class_='b-link b-link_style_black')
            for link in links:
                if name.lower() in link.text.lower():
                    return link.get('href')
        except Exception as e:
            print(f"  Search error for {name}: {e}")
    return None

def main():
    print("UFC Ruban — Fix Missing Stats")
    print("=" * 50)

    conn = get_db()

    missing = find_missing_fighters(conn)

    if not missing:
        print("✅ All fighters on the upcoming card have stats. No action needed.")
        conn.close()
        return

    print(f"\n⚠️ Found {len(missing)} fighters with missing/zero stats:\n")
    for f in missing:
        print(f"  • {f['name']} — {f['reason']}")

    print("\nAttempting to re-scrape...")
    fixed = 0
    failed = []

    for fighter_info in missing:
        name = fighter_info['name']
        url = fighter_info.get('url')

        print(f"\nFixing: {name}")

        # If we have a URL, use it directly
        if not url:
            url = search_fighter_url(name)

        if not url:
            print(f"  ❌ Could not find URL for {name}")
            failed.append(name)
            continue

        data = scrape_fighter_page(url)
        if data and 'name' in data:
            # Use the card name if the scraped name doesn't match
            if name.lower() not in data['name'].lower():
                data['name'] = name  # Keep original name for DB consistency
            try:
                upsert_fighter(conn, data)
                conn.commit()
                print(f"  ✅ Fixed: {name} — SLpM: {data.get('slpm', 'N/A')}, TD Avg: {data.get('td_avg', 'N/A')}")
                fixed += 1
            except Exception as e:
                print(f"  ❌ DB error for {name}: {e}")
                failed.append(name)
        else:
            print(f"  ❌ Failed to scrape {name}")
            failed.append(name)

        time.sleep(0.5)

    print(f"\n{'='*50}")
    print(f"Fixed: {fixed}/{len(missing)} fighters")
    if failed:
        print(f"\n❌ Still missing ({len(failed)}):")
        for name in failed:
            print(f"  • {name}")
        print("\nThese fighters may be:")
        print("  - Too new (debut fight)")
        print("  - Name spelled differently in ufcstats.com")
        print("  - Misspelled in upcoming_cards table")
        print("\nCheck ufcstats.com manually and update the DB if needed.")

    conn.close()

if __name__ == '__main__':
    main()
