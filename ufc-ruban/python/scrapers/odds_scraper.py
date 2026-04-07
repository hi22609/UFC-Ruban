"""
UFC Ruban — Odds Scraper
Uses The Odds API (free tier: 500 requests/month) for real betting odds.
Get your free API key at: https://the-odds-api.com
Set ODDS_API_KEY in your .env file.

Fallback: manual odds entry via environment variable MANUAL_ODDS_JSON
"""

import os
import json
import sqlite3
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'ufc.db')
ODDS_API_KEY = os.getenv('ODDS_API_KEY', '')
ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def american_to_implied_prob(odds: int) -> float:
    if odds > 0:
        return 100 / (odds + 100)
    else:
        return abs(odds) / (abs(odds) + 100)

def remove_vig(prob1: float, prob2: float) -> tuple:
    total = prob1 + prob2
    return prob1 / total, prob2 / total

def fetch_odds_api() -> list:
    """Fetch UFC odds from The Odds API."""
    if not ODDS_API_KEY:
        print("No ODDS_API_KEY set. Add it to your .env file.")
        print("Get a free key at: https://the-odds-api.com")
        return []

    fights = []
    url = f'{ODDS_API_BASE}/sports/mma_mixed_martial_arts/odds/'
    params = {
        'apiKey': ODDS_API_KEY,
        'regions': 'us',
        'markets': 'h2h',
        'oddsFormat': 'american',
        'dateFormat': 'iso'
    }

    try:
        resp = requests.get(url, params=params, timeout=15)

        # Log remaining requests
        remaining = resp.headers.get('x-requests-remaining', 'unknown')
        print(f"Odds API requests remaining: {remaining}")

        if resp.status_code == 401:
            print("Invalid API key. Check ODDS_API_KEY in .env")
            return []
        if resp.status_code == 429:
            print("Odds API rate limit hit. Try again tomorrow.")
            return []

        resp.raise_for_status()
        events = resp.json()

        for event in events:
            if not event.get('bookmakers'):
                continue

            # Use first available bookmaker
            bookmaker = event['bookmakers'][0]
            market = next((m for m in bookmaker['markets'] if m['key'] == 'h2h'), None)
            if not market or len(market['outcomes']) < 2:
                continue

            o1 = market['outcomes'][0]
            o2 = market['outcomes'][1]

            f1_name = o1['name']
            f2_name = o2['name']
            odds1 = int(o1['price'])
            odds2 = int(o2['price'])

            raw1 = american_to_implied_prob(odds1)
            raw2 = american_to_implied_prob(odds2)
            p1, p2 = remove_vig(raw1, raw2)

            event_name = event.get('home_team', '') + ' vs ' + event.get('away_team', '')

            fights.append({
                'fighter_name': f1_name,
                'opponent_name': f2_name,
                'event_name': event_name,
                'american_odds': odds1,
                'implied_prob': round(p1, 4)
            })
            fights.append({
                'fighter_name': f2_name,
                'opponent_name': f1_name,
                'event_name': event_name,
                'american_odds': odds2,
                'implied_prob': round(p2, 4)
            })

            print(f"  {f1_name} ({p1*100:.1f}%) vs {f2_name} ({p2*100:.1f}%)")

    except Exception as e:
        print(f"Odds API error: {e}")

    return fights

def save_odds(conn, fights: list):
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()
    for fight in fights:
        cur.execute("""
            INSERT INTO fight_odds (fighter_name, opponent_name, event_name, american_odds, implied_prob, scraped_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (fight['fighter_name'], fight['opponent_name'], fight['event_name'],
              fight['american_odds'], fight['implied_prob'], now))
    conn.commit()
    return len(fights)

def main():
    print("UFC Ruban — Odds Scraper")
    print("=" * 50)

    conn = get_db()

    if not ODDS_API_KEY:
        print("\nTo get real odds:")
        print("1. Go to https://the-odds-api.com and sign up free")
        print("2. Copy your API key")
        print("3. Add ODDS_API_KEY=your_key to Railway Variables")
        print("\nFree tier: 500 requests/month — more than enough.")
        print("Predictions will use 50% market signal until odds are configured.")
        conn.close()
        return

    print("\nFetching UFC odds from The Odds API...")
    fights = fetch_odds_api()

    if fights:
        saved = save_odds(conn, fights)
        print(f"\nSaved {saved} odds records to database")
    else:
        print("No odds data returned.")

    conn.close()

if __name__ == '__main__':
    main()
