"""
UFC Ruban — UFC Stats Scraper
Scrapes all fighter stats from ufcstats.com and writes to fighters table.
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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

BASE_URL = 'http://www.ufcstats.com'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS fighters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            nickname TEXT,
            height REAL,
            weight REAL,
            reach REAL,
            stance TEXT,
            age REAL,
            slpm REAL DEFAULT 0,
            sapm REAL DEFAULT 0,
            str_acc REAL DEFAULT 0,
            str_def REAL DEFAULT 0,
            td_avg REAL DEFAULT 0,
            td_acc REAL DEFAULT 0,
            td_def REAL DEFAULT 0,
            sub_avg REAL DEFAULT 0,
            wins INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            draws INTEGER DEFAULT 0,
            ko_wins INTEGER DEFAULT 0,
            sub_wins INTEGER DEFAULT 0,
            dec_wins INTEGER DEFAULT 0,
            win_pct REAL DEFAULT 0,
            finish_rate REAL DEFAULT 0,
            recency_win_pct REAL DEFAULT 0,
            activity_diff REAL DEFAULT 0,
            fighter_url TEXT,
            scraped_at TEXT
        );

        CREATE TABLE IF NOT EXISTS fights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            event_date TEXT,
            fighter1 TEXT,
            fighter2 TEXT,
            winner TEXT,
            method TEXT,
            round INTEGER,
            time TEXT,
            weight_class TEXT,
            scraped_at TEXT
        );

        CREATE TABLE IF NOT EXISTS upcoming_cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            event_date TEXT,
            location TEXT,
            fighter1 TEXT,
            fighter2 TEXT,
            weight_class TEXT,
            fight_order INTEGER,
            is_main_event INTEGER DEFAULT 0,
            is_title_fight INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS fight_odds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fighter_name TEXT,
            opponent_name TEXT,
            event_name TEXT,
            american_odds INTEGER,
            implied_prob REAL,
            scraped_at TEXT
        );

        CREATE TABLE IF NOT EXISTS fighter_rankings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fighter_name TEXT,
            division TEXT,
            rank INTEGER,
            elo_rating REAL DEFAULT 1500,
            scraped_at TEXT
        );

        CREATE TABLE IF NOT EXISTS prediction_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            fighter1 TEXT,
            fighter2 TEXT,
            predicted_winner TEXT,
            actual_winner TEXT,
            confidence REAL,
            tier TEXT,
            correct INTEGER,
            predicted_at TEXT,
            recorded_at TEXT
        );

        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            tier TEXT DEFAULT 'free',
            stripe_customer_id TEXT,
            subscription_status TEXT DEFAULT 'inactive',
            created_at TEXT,
            updated_at TEXT
        );
    """)
    conn.commit()
    print("Database schema initialized.")

def safe_float(text: str) -> float | None:
    if not text or text.strip() in ['--', '', 'N/A']:
        return None
    text = text.strip().replace('%', '').replace('"', '').replace("'", '')
    try:
        return float(text)
    except:
        return None

def parse_height(text: str) -> float | None:
    """Convert 5' 11" to inches."""
    if not text or '--' in text:
        return None
    m = re.match(r"(\d+)' (\d+)", text)
    if m:
        return int(m.group(1)) * 12 + int(m.group(2))
    return safe_float(text)

def parse_record(record_text: str) -> tuple[int, int, int]:
    """Parse '23-3-0' into wins, losses, draws."""
    if not record_text:
        return 0, 0, 0
    m = re.match(r'(\d+)-(\d+)-(\d+)', record_text.strip())
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3))
    return 0, 0, 0

def scrape_fighter_page(url: str) -> dict | None:
    """Scrape individual fighter stats page."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'lxml')

        data = {'fighter_url': url}

        # Name
        name_el = soup.find('span', class_='b-content__title-highlight')
        if name_el:
            data['name'] = name_el.text.strip()

        # Nickname
        nick_el = soup.find('p', class_='b-content__Nickname')
        if nick_el:
            data['nickname'] = nick_el.text.strip().strip('"')

        # Physical stats
        stat_items = soup.find_all('li', class_='b-list__box-list-item b-list__box-list-item_type_block')
        for item in stat_items:
            text = item.get_text(separator='|').strip()
            if 'Height:' in text:
                data['height'] = parse_height(text.split('|')[-1].strip())
            elif 'Weight:' in text:
                w = text.split('|')[-1].strip().replace('lbs.', '')
                data['weight'] = safe_float(w)
            elif 'Reach:' in text:
                data['reach'] = safe_float(text.split('|')[-1].strip())
            elif 'STANCE:' in text:
                data['stance'] = text.split('|')[-1].strip()
            elif 'DOB:' in text:
                dob_str = text.split('|')[-1].strip()
                if dob_str and dob_str != '--':
                    try:
                        dob = datetime.strptime(dob_str, '%b %d, %Y')
                        data['age'] = (datetime.now() - dob).days / 365.25
                    except:
                        pass

        # Career stats
        career_stats = soup.find_all('li', class_='b-list__box-list-item')
        for item in career_stats:
            text = item.get_text(separator='|').strip()
            if 'SLpM:' in text:
                data['slpm'] = safe_float(text.split('|')[-1].strip())
            elif 'Str. Acc.:' in text:
                data['str_acc'] = safe_float(text.split('|')[-1].strip())
            elif 'SApM:' in text:
                data['sapm'] = safe_float(text.split('|')[-1].strip())
            elif 'Str. Def:' in text:
                data['str_def'] = safe_float(text.split('|')[-1].strip())
            elif 'TD Avg.:' in text:
                data['td_avg'] = safe_float(text.split('|')[-1].strip())
            elif 'TD Acc.:' in text:
                data['td_acc'] = safe_float(text.split('|')[-1].strip())
            elif 'TD Def.:' in text:
                data['td_def'] = safe_float(text.split('|')[-1].strip())
            elif 'Sub. Avg.:' in text:
                data['sub_avg'] = safe_float(text.split('|')[-1].strip())

        # Record + finish counts from fight table
        fight_rows = soup.find_all('tr', class_='b-fight-details__table-row')
        wins, losses, draws = 0, 0, 0
        ko_wins, sub_wins, dec_wins = 0, 0, 0

        for row in fight_rows[1:]:  # skip header
            cols = row.find_all('td')
            if len(cols) < 8:
                continue
            result = cols[0].get_text().strip()
            method = cols[7].get_text().strip() if len(cols) > 7 else ''

            if result == 'win':
                wins += 1
                method_lower = method.lower()
                if 'ko' in method_lower or 'tko' in method_lower:
                    ko_wins += 1
                elif 'sub' in method_lower:
                    sub_wins += 1
                else:
                    dec_wins += 1
            elif result == 'loss':
                losses += 1
            elif result == 'draw' or result == 'nc':
                draws += 1

        data['wins'] = wins
        data['losses'] = losses
        data['draws'] = draws
        data['ko_wins'] = ko_wins
        data['sub_wins'] = sub_wins
        data['dec_wins'] = dec_wins

        total = wins + losses
        data['win_pct'] = round(wins / total * 100, 1) if total > 0 else 0
        data['finish_rate'] = round((ko_wins + sub_wins) / wins * 100, 1) if wins > 0 else 0

        # Recency: last 5 fights win %
        recent_rows = fight_rows[1:6]
        recent_wins = sum(1 for r in recent_rows
                         if r.find_all('td') and r.find_all('td')[0].get_text().strip() == 'win')
        data['recency_win_pct'] = round(recent_wins / min(len(recent_rows), 5) * 100, 1) if recent_rows else 0

        data['scraped_at'] = datetime.utcnow().isoformat()
        return data

    except Exception as e:
        print(f"  Error scraping {url}: {e}")
        return None

def get_all_fighter_urls() -> list[str]:
    """Get all fighter URLs from the ufcstats fighter list."""
    urls = []
    for char in 'abcdefghijklmnopqrstuvwxyz':
        url = f'{BASE_URL}/statistics/fighters?char={char}&page=all'
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            soup = BeautifulSoup(resp.text, 'lxml')
            links = soup.find_all('a', class_='b-link b-link_style_black')
            for link in links:
                href = link.get('href', '')
                if '/fighter-details/' in href:
                    urls.append(href)
            print(f"  Found {len(links)} fighters for '{char}'")
            time.sleep(0.5)
        except Exception as e:
            print(f"  Error fetching fighter list for '{char}': {e}")
    return list(set(urls))

def upsert_fighter(conn, data: dict):
    cur = conn.cursor()
    cols = [k for k in data.keys() if k != 'id']
    placeholders = ', '.join(['?' for _ in cols])
    updates = ', '.join([f'{c} = excluded.{c}' for c in cols if c != 'name'])
    values = [data.get(c) for c in cols]

    cur.execute(f"""
        INSERT INTO fighters ({', '.join(cols)})
        VALUES ({placeholders})
        ON CONFLICT(name) DO UPDATE SET {updates}
    """, values)

def scrape_fight_history(conn):
    """Scrape completed UFC event results for training data."""
    print("\nScraping fight history for ML training data...")
    url = f'{BASE_URL}/statistics/events/completed?page=all'
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(resp.text, 'lxml')
        event_links = soup.find_all('a', class_='b-link b-link_style_black')
        event_urls = [l['href'] for l in event_links if '/event-details/' in l.get('href', '')]
        print(f"Found {len(event_urls)} completed events")

        cur = conn.cursor()
        for event_url in event_urls[:50]:  # Start with most recent 50
            try:
                resp = requests.get(event_url, headers=HEADERS, timeout=10)
                soup = BeautifulSoup(resp.text, 'lxml')

                # Event name + date
                name_el = soup.find('span', class_='b-content__title-highlight')
                event_name = name_el.text.strip() if name_el else 'Unknown'

                date_el = soup.find('li', class_='b-list__box-list-item')
                event_date = date_el.text.split(':')[-1].strip() if date_el else 'Unknown'

                fight_rows = soup.find_all('tr', class_='b-fight-details__table-row b-fight-details__table-row__hover js-fight-details-click')
                for row in fight_rows:
                    cols = row.find_all('td')
                    if len(cols) < 8:
                        continue
                    fighters = cols[1].find_all('p')
                    if len(fighters) < 2:
                        continue
                    f1 = fighters[0].get_text().strip()
                    f2 = fighters[1].get_text().strip()

                    winner_col = cols[0].find_all('p')
                    winner = winner_col[0].get_text().strip() if winner_col else None

                    method = cols[7].get_text().strip() if len(cols) > 7 else ''
                    weight_class = cols[6].get_text().strip() if len(cols) > 6 else ''

                    cur.execute("""
                        INSERT OR IGNORE INTO fights (event_name, event_date, fighter1, fighter2, winner, method, weight_class, scraped_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (event_name, event_date, f1, f2, winner, method, weight_class, datetime.utcnow().isoformat()))

                conn.commit()
                time.sleep(0.3)
            except Exception as e:
                print(f"  Error scraping event {event_url}: {e}")

        count = cur.execute("SELECT COUNT(*) FROM fights").fetchone()[0]
        print(f"Fight history: {count} fights in database")

    except Exception as e:
        print(f"Error fetching event list: {e}")

def main():
    print("UFC Ruban — UFC Stats Scraper")
    print("=" * 50)

    conn = get_db()
    init_db(conn)

    print("\nFetching all fighter URLs from ufcstats.com...")
    urls = get_all_fighter_urls()
    print(f"Total fighters to scrape: {len(urls)}")

    scraped = 0
    errors = 0
    for i, url in enumerate(urls):
        data = scrape_fighter_page(url)
        if data and 'name' in data:
            try:
                upsert_fighter(conn, data)
                conn.commit()
                scraped += 1
                if scraped % 50 == 0:
                    print(f"  Progress: {scraped}/{len(urls)} scraped")
            except Exception as e:
                print(f"  DB error for {url}: {e}")
                errors += 1
        else:
            errors += 1
        time.sleep(0.3)

    print(f"\nScraping complete: {scraped} fighters scraped, {errors} errors")

    # Scrape fight history for ML training
    scrape_fight_history(conn)

    conn.close()

if __name__ == '__main__':
    main()
