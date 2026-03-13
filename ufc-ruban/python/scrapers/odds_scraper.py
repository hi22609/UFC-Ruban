"""
UFC Ruban — Odds Scraper
Primary: BestFightOdds (vig-removed implied probability)
Fallback: ESPN UFC odds page
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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def american_to_implied_prob(odds: int) -> float:
    """Convert American odds to implied probability (0-1). NOT vig-removed."""
    if odds > 0:
        return 100 / (odds + 100)
    else:
        return abs(odds) / (abs(odds) + 100)

def remove_vig(prob1: float, prob2: float) -> tuple[float, float]:
    """Remove vig from two-sided market. Returns true probabilities."""
    total = prob1 + prob2
    return prob1 / total, prob2 / total

def scrape_bestfightodds():
    """Scrape BestFightOdds for UFC upcoming fight odds."""
    fights = []
    url = 'https://www.bestfightodds.com/events'

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            print(f"BestFightOdds returned {resp.status_code}")
            return fights

        soup = BeautifulSoup(resp.text, 'lxml')

        # Find UFC events
        event_tables = soup.find_all('table', class_='odds-table')
        for table in event_tables:
            event_header = table.find_previous('h2') or table.find_previous('h3')
            event_name = event_header.text.strip() if event_header else 'Unknown Event'

            if 'UFC' not in event_name.upper():
                continue

            rows = table.find_all('tr')
            i = 0
            while i < len(rows) - 1:
                row1 = rows[i]
                row2 = rows[i + 1] if i + 1 < len(rows) else None

                if not row2:
                    i += 1
                    continue

                # Fighter names
                f1_el = row1.find('span', class_='t-name')
                f2_el = row2.find('span', class_='t-name')
                if not f1_el or not f2_el:
                    i += 1
                    continue

                f1 = f1_el.text.strip()
                f2 = f2_el.text.strip()

                # Best odds (use consensus/best available)
                odds1_el = row1.find('td', class_='best-odds')
                odds2_el = row2.find('td', class_='best-odds')

                if not odds1_el or not odds2_el:
                    i += 2
                    continue

                try:
                    odds1 = int(odds1_el.text.strip().replace('+', ''))
                    odds2 = int(odds2_el.text.strip().replace('+', ''))

                    raw_prob1 = american_to_implied_prob(odds1)
                    raw_prob2 = american_to_implied_prob(odds2)
                    clean_prob1, clean_prob2 = remove_vig(raw_prob1, raw_prob2)

                    fights.append({
                        'fighter_name': f1,
                        'opponent_name': f2,
                        'event_name': event_name,
                        'american_odds': odds1,
                        'implied_prob': round(clean_prob1, 4)
                    })
                    fights.append({
                        'fighter_name': f2,
                        'opponent_name': f1,
                        'event_name': event_name,
                        'american_odds': odds2,
                        'implied_prob': round(clean_prob2, 4)
                    })
                    print(f"  {f1} ({clean_prob1*100:.1f}%) vs {f2} ({clean_prob2*100:.1f}%)")
                except ValueError:
                    pass

                i += 2

    except Exception as e:
        print(f"BestFightOdds error: {e}")

    return fights

def scrape_espn_odds():
    """Fallback: scrape ESPN UFC odds."""
    fights = []
    url = 'https://www.espn.com/mma/fightcenter'

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, 'lxml')

        # ESPN renders via JS — this is a best-effort parse
        # For robust scraping ESPN requires Selenium; this handles static fallback
        fight_cards = soup.find_all('div', class_='MMAFightCard')
        for card in fight_cards:
            fighter_els = card.find_all('span', class_='name')
            odds_els = card.find_all('span', class_='odds')
            if len(fighter_els) >= 2 and len(odds_els) >= 2:
                f1 = fighter_els[0].text.strip()
                f2 = fighter_els[1].text.strip()
                try:
                    odds1 = int(odds_els[0].text.strip().replace('+', ''))
                    odds2 = int(odds_els[1].text.strip().replace('+', ''))
                    raw1 = american_to_implied_prob(odds1)
                    raw2 = american_to_implied_prob(odds2)
                    p1, p2 = remove_vig(raw1, raw2)
                    fights.append({'fighter_name': f1, 'opponent_name': f2,
                                   'event_name': 'ESPN', 'american_odds': odds1, 'implied_prob': round(p1, 4)})
                    fights.append({'fighter_name': f2, 'opponent_name': f1,
                                   'event_name': 'ESPN', 'american_odds': odds2, 'implied_prob': round(p2, 4)})
                except ValueError:
                    pass
    except Exception as e:
        print(f"ESPN fallback error: {e}")

    return fights

def save_odds(conn, fights: list):
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()

    saved = 0
    for fight in fights:
        cur.execute("""
            INSERT INTO fight_odds (fighter_name, opponent_name, event_name, american_odds, implied_prob, scraped_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            fight['fighter_name'], fight['opponent_name'], fight['event_name'],
            fight['american_odds'], fight['implied_prob'], now
        ))
        saved += 1

    conn.commit()
    return saved

def main():
    print("UFC Ruban — Odds Scraper")
    print("=" * 50)

    conn = get_db()

    print("\nScraping BestFightOdds (primary)...")
    fights = scrape_bestfightodds()

    if not fights:
        print("BestFightOdds returned no data. Trying ESPN fallback...")
        fights = scrape_espn_odds()

    if fights:
        saved = save_odds(conn, fights)
        print(f"\nSaved {saved} odds records to database")
    else:
        print("WARNING: No odds data scraped from any source.")
        print("Predictions will default market signal to 50% for all fights.")

    conn.close()

if __name__ == '__main__':
    main()
