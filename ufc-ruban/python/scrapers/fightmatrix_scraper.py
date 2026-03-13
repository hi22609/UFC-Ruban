"""
UFC Ruban — FightMatrix ELO Scraper
Scrapes divisional ELO ratings from fightmatrix.com
"""

import os
import re
import time
import sqlite3
import requests
from bs4 import BeautifulSoup
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'ufc.db')
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

DIVISIONS = {
    'Heavyweight': 'heavyweight',
    'Light Heavyweight': 'light-heavyweight',
    'Middleweight': 'middleweight',
    'Welterweight': 'welterweight',
    'Lightweight': 'lightweight',
    'Featherweight': 'featherweight',
    'Bantamweight': 'bantamweight',
    'Flyweight': 'flyweight',
    'Womens Strawweight': 'womens-strawweight',
    'Womens Flyweight': 'womens-flyweight',
    'Womens Bantamweight': 'womens-bantamweight',
    'Womens Featherweight': 'womens-featherweight',
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def scrape_division_rankings(division_name: str, division_slug: str) -> list:
    fighters = []
    url = f'https://www.fightmatrix.com/ufc-fighter-rankings/ufc-{division_slug}-rankings/'

    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'lxml')

        # Find rankings table
        table = soup.find('table', class_='rankTable')
        if not table:
            # Try alternate table structure
            table = soup.find('table')

        if not table:
            print(f"  No table found for {division_name}")
            return fighters

        rows = table.find_all('tr')
        for row in rows[1:]:  # skip header
            cols = row.find_all('td')
            if len(cols) < 3:
                continue

            rank_text = cols[0].get_text().strip()
            name_el = cols[1].find('a') or cols[1]
            name = name_el.get_text().strip() if name_el else ''
            elo_text = cols[2].get_text().strip() if len(cols) > 2 else ''

            if not name:
                continue

            try:
                rank = int(re.sub(r'[^0-9]', '', rank_text)) if rank_text else 999
            except:
                rank = 999

            try:
                elo = float(re.sub(r'[^0-9.]', '', elo_text)) if elo_text else 1500.0
            except:
                elo = 1500.0

            fighters.append({
                'fighter_name': name,
                'division': division_name,
                'rank': rank,
                'elo_rating': elo
            })

        print(f"  {division_name}: {len(fighters)} fighters")

    except Exception as e:
        print(f"  Error scraping {division_name}: {e}")

    return fighters

def main():
    print("UFC Ruban — FightMatrix ELO Scraper")
    print("=" * 50)

    conn = get_db()
    cur = conn.cursor()

    # Clear old rankings
    cur.execute("DELETE FROM fighter_rankings")
    conn.commit()

    total = 0
    now = datetime.utcnow().isoformat()

    for division_name, division_slug in DIVISIONS.items():
        print(f"Scraping {division_name}...")
        fighters = scrape_division_rankings(division_name, division_slug)

        for f in fighters:
            cur.execute("""
                INSERT INTO fighter_rankings (fighter_name, division, rank, elo_rating, scraped_at)
                VALUES (?, ?, ?, ?, ?)
            """, (f['fighter_name'], f['division'], f['rank'], f['elo_rating'], now))
            total += 1

        conn.commit()
        time.sleep(1.0)

    print(f"\nTotal: {total} fighter ELO ratings saved")
    conn.close()

if __name__ == '__main__':
    main()
