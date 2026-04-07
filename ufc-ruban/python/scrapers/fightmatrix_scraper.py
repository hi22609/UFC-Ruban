"""
UFC Ruban — Rankings Scraper
Scrapes UFC official rankings from ufcstats.com since FightMatrix uses JS rendering.
Assigns ELO-equivalent ratings based on rank position.
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

# UFC Stats rankings page
RANKINGS_URL = 'http://www.ufcstats.com/statistics/rankings'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def rank_to_elo(rank: int) -> float:
    """Convert rank position to ELO-equivalent rating. Champion=2000, #1=1900, etc."""
    if rank == 0:  # Champion
        return 2000.0
    elo = max(1200.0, 1900.0 - (rank - 1) * 50)
    return elo

def scrape_ufc_rankings() -> list:
    fighters = []
    try:
        resp = requests.get(RANKINGS_URL, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'lxml')

        # Find all ranking tables
        divisions = soup.find_all('div', class_='b-ranking__block')

        for division_block in divisions:
            # Get division name
            title_el = division_block.find('h2', class_='b-ranking__block-title')
            if not title_el:
                continue
            division_name = title_el.text.strip()

            # Get champion
            champ_el = division_block.find('div', class_='b-ranking__block-champion')
            if champ_el:
                champ_name_el = champ_el.find('a')
                if champ_name_el:
                    fighters.append({
                        'fighter_name': champ_name_el.text.strip(),
                        'division': division_name,
                        'rank': 0,
                        'elo_rating': rank_to_elo(0)
                    })

            # Get ranked fighters
            rows = division_block.find_all('tr', class_='b-ranking__row')
            for row in rows:
                rank_el = row.find('td', class_='b-ranking__table-col_rank')
                name_el = row.find('a')
                if not rank_el or not name_el:
                    continue
                rank_text = rank_el.text.strip()
                name = name_el.text.strip()
                try:
                    rank = int(re.sub(r'[^0-9]', '', rank_text))
                except:
                    continue

                fighters.append({
                    'fighter_name': name,
                    'division': division_name,
                    'rank': rank,
                    'elo_rating': rank_to_elo(rank)
                })

        print(f"Found {len(fighters)} ranked fighters across all divisions")

    except Exception as e:
        print(f"Error scraping UFC rankings: {e}")

    return fighters

def main():
    print("UFC Ruban — Rankings Scraper (ufcstats.com)")
    print("=" * 50)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM fighter_rankings")
    conn.commit()

    fighters = scrape_ufc_rankings()

    if not fighters:
        print("No rankings found. ELO will default to 1500 for all fighters.")
        conn.close()
        return

    now = datetime.utcnow().isoformat()
    for f in fighters:
        cur.execute("""
            INSERT INTO fighter_rankings (fighter_name, division, rank, elo_rating, scraped_at)
            VALUES (?, ?, ?, ?, ?)
        """, (f['fighter_name'], f['division'], f['rank'], f['elo_rating'], now))

    conn.commit()
    print(f"Saved {len(fighters)} fighter rankings to database")

    # Show sample
    cur.execute("SELECT fighter_name, division, rank, elo_rating FROM fighter_rankings ORDER BY elo_rating DESC LIMIT 10")
    print("\nTop 10 by ELO:")
    for row in cur.fetchall():
        print(f"  {row[0]} ({row[1]}) — Rank #{row[2]} — ELO: {row[3]}")

    conn.close()

if __name__ == '__main__':
    main()
