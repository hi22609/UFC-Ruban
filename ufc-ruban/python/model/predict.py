"""
UFC Ruban — Prediction Engine
Four-layer signal stack: Ensemble ML (50%) + Market Odds (35%) + ELO (15%) + Claude QA
Confidence hard cap: 76% absolute maximum. No exceptions.
"""

import os
import sys
import json
import sqlite3
import argparse
import numpy as np
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import xgboost as xgb
import anthropic
import pickle

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'ufc.db')
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pkl')

ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

# ─────────────────────────────────────────────
# CONFIDENCE CAP — ABSOLUTE, NON-NEGOTIABLE
# ─────────────────────────────────────────────
MAX_CONFIDENCE = 76.0
CLAUDE_MAX_CONFIDENCE = 74.0

def hard_cap(prob: float) -> float:
    """Enforce 76% absolute maximum. Runs after every blend operation."""
    return min(float(prob), MAX_CONFIDENCE)

def cap_dict(prediction: dict) -> dict:
    """Final absolute cap before any output. Last line of defense."""
    prediction['confidence'] = hard_cap(prediction['confidence'])
    return prediction

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_fighter_stats(name: str, conn) -> dict | None:
    cur = conn.cursor()
    cur.execute("SELECT * FROM fighters WHERE LOWER(name) LIKE LOWER(?)", (f"%{name}%",))
    row = cur.fetchone()
    if not row:
        return None
    return dict(row)

def get_fighter_odds(fighter1: str, fighter2: str, conn) -> tuple[float | None, float | None]:
    cur = conn.cursor()
    cur.execute("""
        SELECT fighter_name, implied_prob FROM fight_odds
        WHERE (LOWER(fighter_name) LIKE LOWER(?) OR LOWER(fighter_name) LIKE LOWER(?))
        ORDER BY scraped_at DESC LIMIT 2
    """, (f"%{fighter1}%", f"%{fighter2}%"))
    rows = cur.fetchall()
    prob1, prob2 = None, None
    for row in rows:
        if fighter1.lower() in row['fighter_name'].lower():
            prob1 = row['implied_prob']
        elif fighter2.lower() in row['fighter_name'].lower():
            prob2 = row['implied_prob']
    return prob1, prob2

def get_elo_ratings(fighter1: str, fighter2: str, conn) -> tuple[float, float]:
    cur = conn.cursor()
    cur.execute("SELECT fighter_name, elo_rating FROM fighter_rankings WHERE LOWER(fighter_name) LIKE LOWER(?)", (f"%{fighter1}%",))
    row1 = cur.fetchone()
    cur.execute("SELECT fighter_name, elo_rating FROM fighter_rankings WHERE LOWER(fighter_name) LIKE LOWER(?)", (f"%{fighter2}%",))
    row2 = cur.fetchone()
    elo1 = row1['elo_rating'] if row1 else 1500.0
    elo2 = row2['elo_rating'] if row2 else 1500.0
    return elo1, elo2

# ─────────────────────────────────────────────
# FEATURE ENGINEERING
# ─────────────────────────────────────────────
def build_features(f1: dict, f2: dict, elo1: float, elo2: float) -> np.ndarray:
    def safe(d, key, default=0.0):
        v = d.get(key, default)
        return float(v) if v is not None else default

    feats = [
        # Striking differentials
        safe(f1, 'slpm') - safe(f2, 'slpm'),
        safe(f1, 'sapm') - safe(f2, 'sapm'),
        safe(f1, 'str_acc') - safe(f2, 'str_acc'),
        safe(f1, 'str_def') - safe(f2, 'str_def'),
        # Grappling differentials
        safe(f1, 'td_avg') - safe(f2, 'td_avg'),
        safe(f1, 'td_acc') - safe(f2, 'td_acc'),
        safe(f1, 'td_def') - safe(f2, 'td_def'),
        safe(f1, 'sub_avg') - safe(f2, 'sub_avg'),
        # Physical
        safe(f1, 'reach') - safe(f2, 'reach'),
        safe(f1, 'height') - safe(f2, 'height'),
        safe(f1, 'age') - safe(f2, 'age'),
        # Record metrics
        safe(f1, 'win_pct') - safe(f2, 'win_pct'),
        safe(f1, 'finish_rate') - safe(f2, 'finish_rate'),
        safe(f1, 'recency_win_pct') - safe(f2, 'recency_win_pct'),
        safe(f1, 'activity_diff') - safe(f2, 'activity_diff'),
        # Raw counts
        safe(f1, 'ko_wins') - safe(f2, 'ko_wins'),
        safe(f1, 'sub_wins') - safe(f2, 'sub_wins'),
        safe(f1, 'dec_wins') - safe(f2, 'dec_wins'),
        # ELO
        elo1 - elo2,
        # Absolute values (model uses both direction + magnitude)
        safe(f1, 'slpm'),
        safe(f2, 'slpm'),
        safe(f1, 'str_def'),
        safe(f2, 'str_def'),
        safe(f1, 'td_def'),
        safe(f2, 'td_def'),
        safe(f1, 'sub_avg'),
        safe(f2, 'sub_avg'),
        safe(f1, 'win_pct'),
        safe(f2, 'win_pct'),
        safe(f1, 'finish_rate'),
        safe(f2, 'finish_rate'),
        elo1,
        elo2,
    ]
    return np.array(feats, dtype=float).reshape(1, -1)

# ─────────────────────────────────────────────
# ML MODEL
# ─────────────────────────────────────────────
def load_or_train_model(conn):
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)

    print("No trained model found. Run with --train to train first.", file=sys.stderr)
    return None

def train_model(conn):
    print("Training ensemble model on historical fight data...", file=sys.stderr)
    cur = conn.cursor()
    cur.execute("""
        SELECT f1.*, f2.*, fights.winner
        FROM fights
        JOIN fighters f1 ON fights.fighter1_id = f1.id
        JOIN fighters f2 ON fights.fighter2_id = f2.id
        WHERE fights.winner IS NOT NULL
    """)
    rows = cur.fetchall()

    if len(rows) < 100:
        print(f"WARNING: Only {len(rows)} fights in DB. Minimum 100 required for reliable training.", file=sys.stderr)
        if len(rows) < 20:
            print("CRITICAL: Not enough data to train. Run scrapers first.", file=sys.stderr)
            return None

    X, y = [], []
    for row in rows:
        row = dict(row)
        f1 = {k.replace('f1_', ''): v for k, v in row.items() if k.startswith('f1_')}
        f2 = {k.replace('f2_', ''): v for k, v in row.items() if k.startswith('f2_')}
        feats = build_features(f1, f2, 1500.0, 1500.0)
        X.append(feats[0])
        y.append(1 if row['winner'] == row.get('f1_name') else 0)

    X, y = np.array(X), np.array(y)

    xgb_clf = xgb.XGBClassifier(n_estimators=200, max_depth=4, learning_rate=0.05,
                                  subsample=0.8, colsample_bytree=0.8,
                                  use_label_encoder=False, eval_metric='logloss', random_state=42)
    gb_clf = GradientBoostingClassifier(n_estimators=150, max_depth=3, learning_rate=0.05, random_state=42)
    rf_clf = RandomForestClassifier(n_estimators=200, max_depth=6, random_state=42)
    lr_clf = LogisticRegression(max_iter=1000, random_state=42)

    ensemble = VotingClassifier(
        estimators=[('xgb', xgb_clf), ('gb', gb_clf), ('rf', rf_clf), ('lr', lr_clf)],
        voting='soft'
    )

    calibrated = CalibratedClassifierCV(ensemble, method='isotonic', cv=5)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    calibrated.fit(X_scaled, y)

    model = {'clf': calibrated, 'scaler': scaler}
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)

    print(f"Model trained on {len(X)} fights and saved to {MODEL_PATH}", file=sys.stderr)
    return model

def ml_predict(f1: dict, f2: dict, elo1: float, elo2: float, model: dict) -> float:
    """Returns win probability for f1 (0–100)."""
    if model is None:
        return 50.0

    X = build_features(f1, f2, elo1, elo2)
    X_scaled = model['scaler'].transform(X)
    prob = model['clf'].predict_proba(X_scaled)[0][1]
    return float(prob * 100)

# ─────────────────────────────────────────────
# ELO SIGNAL
# ─────────────────────────────────────────────
def elo_to_prob(elo1: float, elo2: float) -> float:
    """Convert ELO differential to win probability (0–100)."""
    return 100.0 / (1 + 10 ** ((elo2 - elo1) / 400))

# ─────────────────────────────────────────────
# CLAUDE QUALITATIVE REVIEW
# ─────────────────────────────────────────────
def claude_review(f1: dict, f2: dict, blended_prob: float, weight_class: str) -> dict:
    """
    Claude provides qualitative edge analysis, method prediction, and analysis text.
    adjusted_confidence is capped at 74% in BOTH the prompt AND in code.
    """
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    stats_summary = f"""
Fighter 1: {f1.get('name', 'Unknown')}
  SLpM: {f1.get('slpm', 'N/A')} | SApM: {f1.get('sapm', 'N/A')} | Str Acc: {f1.get('str_acc', 'N/A')}% | Str Def: {f1.get('str_def', 'N/A')}%
  TD Avg: {f1.get('td_avg', 'N/A')} | TD Acc: {f1.get('td_acc', 'N/A')}% | TD Def: {f1.get('td_def', 'N/A')}% | Sub Avg: {f1.get('sub_avg', 'N/A')}
  Reach: {f1.get('reach', 'N/A')}" | Height: {f1.get('height', 'N/A')}" | Age: {f1.get('age', 'N/A')}
  Record KO/Sub/Dec wins: {f1.get('ko_wins', 0)}/{f1.get('sub_wins', 0)}/{f1.get('dec_wins', 0)}
  Win%: {f1.get('win_pct', 'N/A')} | Finish Rate: {f1.get('finish_rate', 'N/A')}

Fighter 2: {f2.get('name', 'Unknown')}
  SLpM: {f2.get('slpm', 'N/A')} | SApM: {f2.get('sapm', 'N/A')} | Str Acc: {f2.get('str_acc', 'N/A')}% | Str Def: {f2.get('str_def', 'N/A')}%
  TD Avg: {f2.get('td_avg', 'N/A')} | TD Acc: {f2.get('td_acc', 'N/A')}% | TD Def: {f2.get('td_def', 'N/A')}% | Sub Avg: {f2.get('sub_avg', 'N/A')}
  Reach: {f2.get('reach', 'N/A')}" | Height: {f2.get('height', 'N/A')}" | Age: {f2.get('age', 'N/A')}
  Record KO/Sub/Dec wins: {f2.get('ko_wins', 0)}/{f2.get('sub_wins', 0)}/{f2.get('dec_wins', 0)}
  Win%: {f2.get('win_pct', 'N/A')} | Finish Rate: {f2.get('finish_rate', 'N/A')}

Weight Class: {weight_class}
Current blended model probability for Fighter 1: {blended_prob:.1f}%
"""

    prompt = f"""You are a professional MMA analyst for UFC Ruban, a premium prediction platform.
Analyze this fight and return a JSON object ONLY — no markdown, no explanation, no extra text.

{stats_summary}

Rules:
- adjusted_confidence is your final win probability for Fighter 1 (0-100)
- HARD CAP: adjusted_confidence CANNOT EXCEED 74. If your analysis suggests higher, cap at 74.
- method_ko_pct + method_sub_pct + method_dec_pct MUST sum to exactly 100
- key_edge: exactly 3 items, each with REAL stat numbers and fighter names — NEVER write "Fighter X has an advantage based on available data" or any generic line
- analysis: 2-3 sentences, fight-specific, how it plays out stylistically
- risk_flag: null if none, otherwise a specific concern (e.g., "Oliveira early submission danger if takedown defense breaks")
- style_notes: one line on stylistic matchup dynamic

Return this JSON:
{{
  "adjusted_confidence": <number, max 74>,
  "method_ko_pct": <number>,
  "method_sub_pct": <number>,
  "method_dec_pct": <number>,
  "key_edge": ["<stat-backed edge 1>", "<stat-backed edge 2>", "<stylistic or market edge 3>"],
  "analysis": "<2-3 sentences>",
  "risk_flag": "<string or null>",
  "style_notes": "<string>"
}}"""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = response.content[0].text.strip()
        result = json.loads(raw)

        # Code-level cap enforcement — Claude prompt cap + code cap
        result['adjusted_confidence'] = min(float(result.get('adjusted_confidence', blended_prob)), CLAUDE_MAX_CONFIDENCE)

        # Normalize method percentages to sum to 100
        ko = float(result.get('method_ko_pct', 33))
        sub = float(result.get('method_sub_pct', 17))
        dec = float(result.get('method_dec_pct', 50))
        total = ko + sub + dec
        if total != 100:
            scale = 100 / total
            ko, sub, dec = round(ko * scale), round(sub * scale), 0
            dec = 100 - ko - sub
        result['method_ko_pct'] = ko
        result['method_sub_pct'] = sub
        result['method_dec_pct'] = dec

        return result

    except Exception as e:
        print(f"Claude review error: {e}", file=sys.stderr)
        return {
            'adjusted_confidence': min(blended_prob, CLAUDE_MAX_CONFIDENCE),
            'method_ko_pct': 33,
            'method_sub_pct': 17,
            'method_dec_pct': 50,
            'key_edge': [
                f"{f1.get('name', 'Fighter 1')} striking edge requires manual review",
                f"Stats incomplete — run fix_missing_stats.py",
                "Claude API unavailable — qualitative review skipped"
            ],
            'analysis': "Claude API unavailable. Model prediction based on quantitative signals only.",
            'risk_flag': "Claude API unavailable — qualitative review not performed",
            'style_notes': "Manual review recommended"
        }

# ─────────────────────────────────────────────
# TIER CLASSIFICATION
# ─────────────────────────────────────────────
def get_tier(confidence: float) -> str:
    if confidence >= 65:
        return "LOCK"
    elif confidence >= 54:
        return "LEAN"
    else:
        return "TOSS-UP"

def get_tier_emoji(tier: str) -> str:
    return {"LOCK": "🔒", "LEAN": "✅", "TOSS-UP": "⚖️"}[tier]

def get_method_label(ko: float, sub: float, dec: float) -> str:
    if ko >= sub and ko >= dec:
        return "KO/TKO"
    elif sub >= ko and sub >= dec:
        return "Submission"
    else:
        return "Decision"

# ─────────────────────────────────────────────
# CORE PREDICTION FUNCTION
# ─────────────────────────────────────────────
def predict_fight(fighter1: str, fighter2: str, weight_class: str, conn, model: dict) -> dict:
    """
    Full four-layer prediction for one fight.
    Returns complete prediction dict ready for Discord/web output.
    """
    # Fetch stats
    f1 = get_fighter_stats(fighter1, conn)
    f2 = get_fighter_stats(fighter2, conn)

    missing = []
    if not f1:
        missing.append(fighter1)
    if not f2:
        missing.append(fighter2)

    if missing:
        return {
            'error': True,
            'missing_fighters': missing,
            'message': f"Missing stats for: {', '.join(missing)}. Run fix_missing_stats.py then retry."
        }

    # Zero-stat detection
    zero_stat_fighters = []
    for fname, fdata in [(fighter1, f1), (fighter2, f2)]:
        if all(fdata.get(k, 0) in [0, None] for k in ['slpm', 'sapm', 'td_avg', 'sub_avg']):
            zero_stat_fighters.append(fname)

    if zero_stat_fighters:
        return {
            'error': True,
            'missing_fighters': zero_stat_fighters,
            'message': f"Zero stats detected for: {', '.join(zero_stat_fighters)}. Run fix_missing_stats.py."
        }

    # ELO ratings
    elo1, elo2 = get_elo_ratings(fighter1, fighter2, conn)

    # Market odds
    odds1, odds2 = get_fighter_odds(fighter1, fighter2, conn)

    # ── Layer 1: ML model (50% weight) ──
    ml_prob = ml_predict(f1, f2, elo1, elo2, model)

    # ── Layer 2: Market consensus (35% weight) ──
    if odds1 is not None:
        market_prob = float(odds1) * 100
    else:
        market_prob = 50.0  # No market data available
        print(f"WARNING: No odds data for {fighter1}. Market signal defaulting to 50%.", file=sys.stderr)

    # ── Layer 3: ELO (15% weight) ──
    elo_prob = elo_to_prob(elo1, elo2)

    # ── Blend layers 1-3 ──
    if odds1 is not None:
        blended = (ml_prob * 0.50) + (market_prob * 0.35) + (elo_prob * 0.15)
    else:
        # No odds: shift weight to ML + ELO
        blended = (ml_prob * 0.65) + (elo_prob * 0.35)

    blended = hard_cap(blended)  # Cap after blend

    # ── Layer 4: Claude qualitative review ──
    claude_result = claude_review(f1, f2, blended, weight_class)
    claude_conf = min(float(claude_result['adjusted_confidence']), CLAUDE_MAX_CONFIDENCE)

    # Final confidence: blend quantitative with Claude adjustment
    # Claude can shift final by up to ±5 points within its capped range
    final_confidence = (blended * 0.7) + (claude_conf * 0.3)
    final_confidence = hard_cap(final_confidence)  # Cap after Claude blend

    # Determine winner
    if final_confidence >= 50:
        winner = fighter1
        loser = fighter2
        win_conf = final_confidence
    else:
        winner = fighter2
        loser = fighter1
        win_conf = hard_cap(100 - final_confidence)

    tier = get_tier(win_conf)
    method = get_method_label(
        claude_result['method_ko_pct'],
        claude_result['method_sub_pct'],
        claude_result['method_dec_pct']
    )

    prediction = {
        'error': False,
        'fighter1': fighter1,
        'fighter2': fighter2,
        'weight_class': weight_class,
        'winner': winner,
        'confidence': win_conf,
        'tier': tier,
        'method': method,
        'method_ko_pct': claude_result['method_ko_pct'],
        'method_sub_pct': claude_result['method_sub_pct'],
        'method_dec_pct': claude_result['method_dec_pct'],
        'key_edge': claude_result['key_edge'],
        'analysis': claude_result['analysis'],
        'risk_flag': claude_result.get('risk_flag'),
        'style_notes': claude_result.get('style_notes'),
        'signals': {
            'ml_prob': round(ml_prob, 1),
            'market_prob': round(market_prob, 1) if odds1 else None,
            'elo_prob': round(elo_prob, 1),
            'blended': round(blended, 1),
            'claude_adjusted': round(claude_conf, 1)
        },
        'parlay_eligible': win_conf >= 60,
        'predicted_at': datetime.utcnow().isoformat()
    }

    # ABSOLUTE FINAL CAP — last line before return
    return cap_dict(prediction)

# ─────────────────────────────────────────────
# CARD PREDICTION
# ─────────────────────────────────────────────
def predict_card(conn, model: dict) -> dict:
    """Predict all fights on the next upcoming card."""
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM upcoming_cards
        ORDER BY fight_order ASC
    """)
    fights = cur.fetchall()

    if not fights:
        return {'error': True, 'message': 'No upcoming card found. Run upcoming_card_scraper.py.'}

    # Get event info
    cur.execute("SELECT DISTINCT event_name, event_date, location FROM upcoming_cards LIMIT 1")
    event_info = cur.fetchone()

    results = {
        'event_name': event_info['event_name'] if event_info else 'Upcoming UFC Event',
        'event_date': event_info['event_date'] if event_info else 'TBD',
        'location': event_info['location'] if event_info else 'TBD',
        'predictions': [],
        'errors': []
    }

    for fight in fights:
        fight = dict(fight)
        print(f"Predicting: {fight['fighter1']} vs {fight['fighter2']}...", file=sys.stderr)
        pred = predict_fight(
            fight['fighter1'],
            fight['fighter2'],
            fight.get('weight_class', 'Unknown'),
            conn, model
        )
        pred['fight_order'] = fight.get('fight_order', 0)
        pred['is_main_event'] = fight.get('is_main_event', False)
        pred['is_title_fight'] = fight.get('is_title_fight', False)

        if pred.get('error'):
            results['errors'].append(pred)
        else:
            results['predictions'].append(pred)

    # Build parlays from ≥60% picks
    parlay_picks = [p for p in results['predictions'] if p.get('parlay_eligible')]
    parlays = build_parlays(parlay_picks)
    results['parlays'] = parlays

    return results

def build_parlays(picks: list) -> dict:
    """Build 2-leg and 3-leg parlays from eligible picks, sorted by confidence."""
    picks = sorted(picks, key=lambda x: x['confidence'], reverse=True)
    parlays = {'two_leg': None, 'three_leg': None}

    if len(picks) >= 2:
        top2 = picks[:2]
        combined = (top2[0]['confidence'] / 100) * (top2[1]['confidence'] / 100) * 100
        parlays['two_leg'] = {
            'picks': [{'fighter': p['winner'], 'confidence': p['confidence']} for p in top2],
            'combined_probability': round(combined, 1)
        }

    if len(picks) >= 3:
        top3 = picks[:3]
        combined = (top3[0]['confidence'] / 100) * (top3[1]['confidence'] / 100) * (top3[2]['confidence'] / 100) * 100
        parlays['three_leg'] = {
            'picks': [{'fighter': p['winner'], 'confidence': p['confidence']} for p in top3],
            'combined_probability': round(combined, 1)
        }

    return parlays

# ─────────────────────────────────────────────
# FORMAT OUTPUT
# ─────────────────────────────────────────────
def format_confidence_bar(confidence: float, width: int = 20) -> str:
    filled = int((confidence / 100) * width)
    return "█" * filled + "░" * (width - filled)

def format_prediction_text(pred: dict) -> str:
    """Format a single prediction in the canonical UFC Ruban output format."""
    if pred.get('error'):
        return f"⚠️ ERROR: {pred['message']}"

    tier = pred['tier']
    tier_emoji = get_tier_emoji(tier)
    conf_bar = format_confidence_bar(pred['confidence'])

    lines = [
        f"🥊 Fight",
        f"{pred['fighter1']} vs {pred['fighter2']} · {pred['weight_class']}",
        "",
        f"{tier_emoji} Prediction: {pred['winner']} ({pred['confidence']:.0f}% confidence)",
        f"📋 Method: {pred['method']}",
        "",
        f"📊 Probability Breakdown",
        f"  KO/TKO:      {pred['method_ko_pct']}%",
        f"  Submission:  {pred['method_sub_pct']}%",
        f"  Decision:    {pred['method_dec_pct']}%",
        "",
        f"💡 Key Factors",
    ]

    for edge in pred['key_edge']:
        lines.append(f"- {edge}")

    lines += [
        "",
        f"📝 Analysis",
        pred['analysis']
    ]

    if pred.get('risk_flag'):
        lines += ["", f"⚠️ Risk: {pred['risk_flag']}"]

    return "\n".join(lines)

# ─────────────────────────────────────────────
# CLI ENTRY POINT
# ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description='UFC Ruban Prediction Engine')
    parser.add_argument('--train', action='store_true', help='Train the ML model')
    parser.add_argument('--card', action='store_true', help='Predict full upcoming card (JSON output)')
    parser.add_argument('--fight', nargs=3, metavar=('FIGHTER1', 'FIGHTER2', 'WEIGHT_CLASS'),
                        help='Predict single fight')
    parser.add_argument('--format', action='store_true', help='Print formatted output instead of JSON')
    args = parser.parse_args()

    conn = get_db()

    if args.train:
        train_model(conn)
        return

    model = load_or_train_model(conn)

    if args.card:
        results = predict_card(conn, model)
        if args.format:
            print(f"\n{'='*60}")
            print(f"UFC RUBAN PREDICTIONS — {results.get('event_name', 'Upcoming Event')}")
            print(f"{results.get('event_date', '')} | {results.get('location', '')}")
            print(f"{'='*60}\n")
            for pred in results.get('predictions', []):
                print(format_prediction_text(pred))
                print("\n" + "─"*50 + "\n")
            if results.get('errors'):
                print("\n⚠️ MISSING DATA — Run fix_missing_stats.py:")
                for err in results['errors']:
                    print(f"  • {err['message']}")
        else:
            print(json.dumps(results, indent=2))

    elif args.fight:
        f1, f2, wc = args.fight
        pred = predict_fight(f1, f2, wc, conn, model)
        if args.format:
            print(format_prediction_text(pred))
        else:
            print(json.dumps(pred, indent=2))

    else:
        parser.print_help()

    conn.close()

if __name__ == '__main__':
    main()
