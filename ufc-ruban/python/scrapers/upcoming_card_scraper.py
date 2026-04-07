"""
UFC Ruban — Upcoming Card Scraper
Scrapes the next UFC event fight card from ufcstats.com
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
BASE_URL = 'http://www.ufcstats.com'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def scrape_upcoming_card():
    """Scrape the next upcoming UFC event from ufcstats.com."""
    url = f'{BASE_URL}/statistics/events/upcoming?page=all'
    resp = requests.get(url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(resp.text, 'lxml')

    # Get first upcoming event
    event_rows = soup.find_all('tr', class_='b-statistics__table-row')
    event_url = None
    event_name = None
    event_date = None
    location = None

    for row in event_rows[1:]:  # skip header
        cols = row.find_all('td')
        if not cols:
            continue
        link = cols[0].find('a')
        if link:
            event_url = link.get('href')
            event_name = link.text.strip()
            if len(cols) > 1:
                event_date = cols[1].text.strip()
            if len(cols) > 2:
                location = cols[2].text.strip()
            break

    if not event_url:
        print("No upcoming events found.")
        return []

    print(f"Event: {event_name}")
    print(f"Date: {event_date}")
    print(f"Location: {location}")
    print(f"URL: {event_url}")

    # Scrape fight card
    resp = requests.get(event_url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(resp.text, 'lxml')

    fights = []
    fight_rows = soup.find_all('tr', class_='b-fight-details__table-row b-fight-details__table-row__hover js-fight-details-click')

    for i, row in enumerate(fight_rows):
        cols = row.find_all('td')
        if len(cols) < 7:
            continue

        fighters_col = cols[1].find_all('p')
        if len(fighters_col) < 2:
            continue

        f1 = fighters_col[0].get_text().strip()
        f2 = fighters_col[1].get_text().strip()
        weight_class = cols[6].get_text().strip() if len(cols) > 6 else 'Unknown'

        is_title = 'title' in weight_class.lower() or 'championship' in weight_class.lower()
        is_main = (i == 0)  # First fight listed = main event

        fights.append({
            'event_name': event_name,
            'event_date': event_date,
            'location': location,
            'fighter1': f1,
            'fighter2': f2,
            'weight_class': weight_class,
            'fight_order': i,
            'is_main_event': 1 if is_main else 0,
            'is_title_fight': 1 if is_title else 0
        })

    print(f"Found {len(fights)} fights on card")
    return fights

def main():
    print("UFC Ruban — Upcoming Card Scraper")
    print("=" * 50)

    conn = get_db()

    # Clear old upcoming card
    conn.execute("DELETE FROM upcoming_cards")
    conn.commit()

    fights = scrape_upcoming_card()

    if not fights:
        print("No fights scraped.")
        conn.close()
        return

    cur = conn.cursor()
    for fight in fights:
        cur.execute("""
            INSERT INTO upcoming_cards
            (event_name, event_date, location, fighter1, fighter2, weight_class, fight_order, is_main_event, is_title_fight)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            fight['event_name'], fight['event_date'], fight['location'],
            fight['fighter1'], fight['fighter2'], fight['weight_class'],
            fight['fight_order'], fight['is_main_event'], fight['is_title_fight']
        ))

    conn.commit()
    print(f"\nSaved {len(fights)} fights to upcoming_cards table")

    # List the card
    print("\nFight Card:")
    for f in fights:
        tag = " [MAIN]" if f['is_main_event'] else ""
        title_tag = " [TITLE]" if f['is_title_fight'] else ""
        print(f"  {f['fighter1']} vs {f['fighter2']} — {f['weight_class']}{tag}{title_tag}")

    conn.close()

if __name__ == '__main__':
    main()
