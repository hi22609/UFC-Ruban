"""
UFC Ruban — FightMatrix ELO Scraper
Scrapes divisional rankings from fightmatrix.com/mma-ranks/
"""

import os
import re
import time
import sqlite3
import requests
from bs4 import BeautifulSoup
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'ufc.db')
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

DIVISIONS = {
    'Heavyweight': 'https://www.fightmatrix.com/mma-ranks/heavyweight-265-lbs/',
    'Light Heavyweight': 'https://www.fightmatrix.com/mma-ranks/light-heavyweight-185-205-lbs/',
    'Middleweight': 'https://www.fightmatrix.com/mma-ranks/middleweight/',
    'Welterweight': 'https://www.fightmatrix.com/mma-ranks/welterweight/',
    'Lightweight': 'https://www.fightmatrix.com/mma-ranks/lightweight/',
    'Featherweight': 'https://www.fightmatrix.com/mma-ranks/featherweight/',
    'Bantamweight': 'https://www.fightmatrix.com/mma-ranks/bantamweight/',
    'Flyweight': 'https://www.fightmatrix.com/mma-ranks/flyweight/',
    'Womens Strawweight': 'https://www.fightmatrix.com/mma-ranks/womens-strawweight/',
    'Womens Flyweight': 'https://www.fightmatrix.com/mma-ranks/womens-flyweight/',
    'Womens Bantamweight': 'https://www.fightmatrix.com/mma-ranks/womens-bantamweight/',
    'Womens Featherweight': 'https://www.fightmatrix.com/mma-ranks/womens-featheweight/',
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def scrape_division_rankings(division_name: str, url: str) -> list:
    fighters = []
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'lxml')

        # FightMatrix uses a table with class 'table' or similar
        tables = soup.find_all('table')
        if not tables:
            print(f"  No table found for {division_name}")
            return fighters

        # Find the rankings table — look for one with rank numbers
        for table in tables:
            rows = table.find_all('tr')
            for row in rows[1:101]:  # top 100
                cols = row.find_all('td')
                if len(cols) < 2:
                    continue

                rank_text = cols[0].get_text().strip()
                name_el = cols[1].find('a') or cols[1]
                name = name_el.get_text().strip() if name_el else ''

                # Rating is usually in col 2 or 3
                rating_text = ''
                for col in cols[2:5]:
                    t = col.get_text().strip()
                    if re.match(r'^\d+\.?\d*$', t):
                        rating_text = t
                        break

                if not name or len(name) < 2:
                    continue

                try:
                    rank = int(re.sub(r'[^0-9]', '', rank_text)) if rank_text else 999
                except:
                    rank = 999

                try:
                    elo = float(rating_text) if rating_text else 1500.0
                    # FightMatrix ratings are often in 100s-1000s range
                    # normalize to ELO-like scale if needed
                    if elo < 100:
                        elo = 1500.0
                except:
                    elo = 1500.0

                fighters.append({
                    'fighter_name': name,
                    'division': division_name,
                    'rank': rank,
                    'elo_rating': elo
                })

            if fighters:
                break  # found the right table

        print(f"  {division_name}: {len(fighters)} fighters")

    except Exception as e:
        print(f"  Error scraping {division_name}: {e}")

    return fighters

def main():
    print("UFC Ruban — FightMatrix Scraper")
    print("=" * 50)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM fighter_rankings")
    conn.commit()

    total = 0
    now = datetime.utcnow().isoformat()

    for division_name, url in DIVISIONS.items():
        print(f"Scraping {division_name}...")
        fighters = scrape_division_rankings(division_name, url)

        for f in fighters:
            cur.execute("""
                INSERT INTO fighter_rankings (fighter_name, division, rank, elo_rating, scraped_at)
                VALUES (?, ?, ?, ?, ?)
            """, (f['fighter_name'], f['division'], f['rank'], f['elo_rating'], now))
            total += 1

        conn.commit()
        time.sleep(1.5)

    print(f"\nTotal: {total} fighter ratings saved")
    conn.close()

if __name__ == '__main__':
    main()
