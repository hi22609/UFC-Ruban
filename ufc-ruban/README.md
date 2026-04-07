# UFC Ruban

**Built on data. Backed by odds. Honest about uncertainty.**

The most accurate, credible, professionally presented UFC prediction platform available to the public. Sharper than Fight Genie, more honest than casual AI tools.

---

## Architecture

Four-layer signal stack:
- **50% — Ensemble ML** (XGBoost + GradientBoosting + RandomForest + Logistic, isotonic calibration, 32 features)
- **35% — Market Consensus** (BestFightOdds vig-removed implied probability)
- **15% — FightMatrix ELO** (opponent-quality-adjusted divisional ratings)
- **+AI Review** (Claude qualitative analysis — max 74% adjusted confidence)

**Confidence hard cap: 76%.** Enforced twice in code. No exceptions. No bypasses.

---

## File Structure

```
ufc-ruban/
  python/
    model/
      predict.py           ← Full prediction engine
      model.pkl            ← Trained model (auto-generated)
    scrapers/
      ufc_stats_scraper.py ← All fighter stats from ufcstats.com
      upcoming_card_scraper.py
      odds_scraper.py      ← BestFightOdds + ESPN fallback
      fightmatrix_scraper.py
    tools/
      record_results.py    ← Accuracy tracking
  bot/
    utils/
      embeds.js            ← Discord embed builder
  server/
    index.js               ← Express server
    stripe.js              ← Stripe checkout + webhooks
    auth.js                ← Session management
    db.js                  ← SQLite helpers
  website/
    index.html             ← Landing page
    dashboard.html         ← Pro dashboard
    predictions.json       ← Auto-written by scheduler
  scheduler.js             ← Permanent Discord bot loop
  fix_missing_stats.py     ← Fix missing fighter data
  database/
    ufc.db                 ← SQLite database
  requirements.txt
  package.json
  .env.example
```

---

## Fresh Install

### 1. Prerequisites

- Python 3.10+
- Node.js 18+
- Your `.env` file (copy `.env.example` → `.env` and fill in all values)

### 2. Python setup

```bash
pip install -r requirements.txt
```

### 3. Node setup

```bash
npm install
```

### 4. Initialize database + scrape fighter data

This takes ~2-3 hours for the full fighter list. Run once.

```bash
python python/scrapers/ufc_stats_scraper.py
```

### 5. Train the ML model

Requires minimum 100 fights in DB (scraped above).

```bash
python python/model/predict.py --train
```

### 6. Start server + bot

Two separate processes:

```bash
# Terminal 1: Web server
node server/index.js

# Terminal 2: Discord bot + prediction scheduler
node scheduler.js
```

---

## Fight Week Workflow

Run these scrapers in the week before each event:

```bash
python python/scrapers/upcoming_card_scraper.py
python python/scrapers/odds_scraper.py
python python/scrapers/fightmatrix_scraper.py
```

The scheduler auto-detects the new card and posts to Discord + updates the website. **No manual intervention needed.**

---

## After Every Event

```bash
python python/tools/record_results.py --event "UFC 300"
python python/tools/record_results.py --stats
```

---

## Missing Stats Fix

```bash
python fix_missing_stats.py

# If bot already posted old card, reset it:
del database/posted_events.json    # Windows
rm database/posted_events.json     # Mac/Linux
node scheduler.js
```

---

## Manual Prediction

```bash
# Full upcoming card (JSON)
python python/model/predict.py --card

# Full upcoming card (formatted text)
python python/model/predict.py --card --format

# Single fight
python python/model/predict.py --fight "Max Holloway" "Ilia Topuria" "Featherweight" --format
```

---

## Confidence Tiers

| Tier | Threshold | Parlay Eligible |
|------|-----------|-----------------|
| 🔒 LOCK | ≥65% | ✅ (≥60%) |
| ✅ LEAN | ≥54% | ✅ (≥60%) |
| ⚖️ TOSS-UP | <54% | ❌ |

**Max confidence: 76%.** `hard_cap()` runs after blend AND as absolute final step.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Discord bot token |
| `PREDICTION_CHANNEL_ID` | ✅ | Channel to post predictions |
| `ANTHROPIC_API_KEY` | ✅ | Claude API key |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | ✅ | Monthly Pro price ID |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Optional | Yearly Pro price ID |
| `SESSION_SECRET` | ✅ | Long random string for sessions |
| `PORT` | Optional | Server port (default 3000) |
| `SITE_URL` | ✅ | Your domain (for Stripe redirects) |

---

## Stripe Setup

1. Create product in Stripe Dashboard: "UFC Ruban Pro"
2. Create monthly price: $9.99/month → copy Price ID to `STRIPE_PRO_PRICE_ID`
3. Create yearly price: $79.99/year → copy Price ID to `STRIPE_PRO_YEARLY_PRICE_ID`
4. Add webhook endpoint: `https://your-domain.com/webhook/stripe`
5. Listen for: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
6. Copy Signing Secret to `STRIPE_WEBHOOK_SECRET`

---

## Discord Bot Setup

1. Go to https://discord.com/developers/applications
2. Create new application → Bot tab → Reset token → copy to `DISCORD_TOKEN`
3. Enable Server Members Intent (not required but good practice)
4. Invite bot to your server with `applications.commands` + `bot` scopes
5. Copy your prediction channel ID to `PREDICTION_CHANNEL_ID`

---

## North Star

UFC Ruban exists to give fight fans something they can actually trust. When it says LOCK, it means something. When it says 68%, that number was earned by a calibrated ensemble model blended with sharp money and reviewed by AI with MMA domain knowledge.

Honest numbers build the kind of reputation that makes people subscribe, stay subscribed, and tell their friends.
