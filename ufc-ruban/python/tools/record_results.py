"""
UFC Ruban — Record Results
Run after every UFC event to log actual results vs predictions and track accuracy.
Usage: python record_results.py --event "UFC 300" [--stats]
"""

import os
import sys
import json
import sqlite3
import argparse
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

def fetch_event_results(event_name: str) -> list:
    """Fetch actual fight results from ufcstats.com for a completed event."""
    search_url = f'{BASE_URL}/statistics/events/completed?page=all'
    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(resp.text, 'lxml')

        # Find the event
        event_links = soup.find_all('a', class_='b-link b-link_style_black')
        event_url = None
        for link in event_links:
            if event_name.lower() in link.text.lower():
                event_url = link.get('href')
                break

        if not event_url:
            print(f"Event '{event_name}' not found on ufcstats.com")
            return []

        resp = requests.get(event_url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(resp.text, 'lxml')

        results = []
        rows = soup.find_all('tr', class_='b-fight-details__table-row b-fight-details__table-row__hover js-fight-details-click')
        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 8:
                continue
            fighters = cols[1].find_all('p')
            if len(fighters) < 2:
                continue

            f1 = fighters[0].get_text().strip()
            f2 = fighters[1].get_text().strip()
            winner_el = cols[0].find('p')
            winner = winner_el.get_text().strip() if winner_el else None
            method = cols[7].get_text().strip() if len(cols) > 7 else ''

            results.append({
                'fighter1': f1,
                'fighter2': f2,
                'winner': winner,
                'method': method
            })

        return results

    except Exception as e:
        print(f"Error fetching results: {e}")
        return []

def record_results(conn, event_name: str, actual_results: list):
    cur = conn.cursor()

    # Get predictions for this event
    cur.execute("""
        SELECT * FROM prediction_results
        WHERE LOWER(event_name) LIKE LOWER(?) AND actual_winner IS NULL
    """, (f"%{event_name}%",))
    predictions = [dict(r) for r in cur.fetchall()]

    if not predictions:
        print(f"No unrecorded predictions found for '{event_name}'")
        print("Tip: Predictions are auto-saved by scheduler.js when the card is posted.")
        return

    updated = 0
    for pred in predictions:
        # Find matching result
        actual = None
        for result in actual_results:
            if (pred['fighter1'].lower() in result['fighter1'].lower() or
                pred['fighter1'].lower() in result['fighter2'].lower()):
                actual = result
                break

        if not actual:
            continue

        correct = 1 if pred['predicted_winner'].lower() in actual['winner'].lower() else 0
        cur.execute("""
            UPDATE prediction_results
            SET actual_winner = ?, correct = ?, recorded_at = ?
            WHERE id = ?
        """, (actual['winner'], correct, datetime.utcnow().isoformat(), pred['id']))
        updated += 1

        status = "✅" if correct else "❌"
        print(f"  {status} {pred['predicted_winner']} vs {actual['winner']} (actual)")

    conn.commit()
    print(f"\nRecorded {updated} results for {event_name}")

def print_stats(conn):
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) as total, SUM(correct) as wins FROM prediction_results WHERE actual_winner IS NOT NULL")
    row = dict(cur.fetchone())
    total = row['total'] or 0
    wins = int(row['wins'] or 0)

    if total == 0:
        print("No recorded prediction results yet.")
        return

    overall_pct = wins / total * 100

    # By tier
    for tier in ['LOCK', 'LEAN', 'TOSS-UP']:
        cur.execute("""
            SELECT COUNT(*) as total, SUM(correct) as wins FROM prediction_results
            WHERE tier = ? AND actual_winner IS NOT NULL
        """, (tier,))
        t = dict(cur.fetchone())
        t_total = t['total'] or 0
        t_wins = int(t['wins'] or 0)
        t_pct = t_wins / t_total * 100 if t_total > 0 else 0
        print(f"  {tier}: {t_wins}/{t_total} ({t_pct:.1f}%)")

    print(f"\nOverall: {wins}/{total} ({overall_pct:.1f}%)")
    print(f"Rolling 50: {_rolling_accuracy(conn, 50):.1f}%")

def _rolling_accuracy(conn, n: int) -> float:
    cur = conn.cursor()
    cur.execute("""
        SELECT correct FROM prediction_results
        WHERE actual_winner IS NOT NULL
        ORDER BY recorded_at DESC LIMIT ?
    """, (n,))
    rows = cur.fetchall()
    if not rows:
        return 0.0
    return sum(r['correct'] for r in rows) / len(rows) * 100

def main():
    parser = argparse.ArgumentParser(description='Record UFC event results')
    parser.add_argument('--event', type=str, help='Event name (e.g. "UFC 300")')
    parser.add_argument('--stats', action='store_true', help='Print accuracy stats')
    args = parser.parse_args()

    conn = get_db()

    if args.stats:
        print("UFC Ruban — Prediction Accuracy")
        print("=" * 50)
        print_stats(conn)

    if args.event:
        print(f"\nFetching results for: {args.event}")
        actual = fetch_event_results(args.event)
        if actual:
            print(f"Found {len(actual)} fight results")
            record_results(conn, args.event, actual)
        else:
            print("No results found. Try running after the event is posted on ufcstats.com")

    conn.close()

if __name__ == '__main__':
    main()
