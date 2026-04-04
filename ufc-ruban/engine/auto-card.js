/**
 * RUBAN Auto Card Generator
 * Runs fight week — scrapes ESPN, generates predictions, writes predictions.json
 * Triggered by scheduler.js automatically
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { predictCard } = require('./local-predict');

const PREDICTIONS_PATH = path.join(__dirname, '..', 'website', 'predictions.json');
const DATA_PATH = path.join(__dirname, '..', 'data');

// ── FETCH ESPN UFC DATA ───────────────────────────────────
function fetchESPN(date) {
  return new Promise((resolve, reject) => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard?dates=${date}`;
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// ── FIND UPCOMING CARD ────────────────────────────────────
async function findUpcomingCard() {
  const dates = [];
  for (let i = 0; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0].replace(/-/g, ''));
  }

  for (const date of dates) {
    try {
      const data = await fetchESPN(date);
      const events = data?.events || [];
      if (events.length > 0) {
        const ufc = events.find(e => e.name?.includes('UFC'));
        if (ufc) return { event: ufc, date };
      }
    } catch {}
  }
  return null;
}

// ── PARSE FIGHTS FROM ESPN ────────────────────────────────
function parseFights(espnEvent) {
  const fights = [];
  const comps = espnEvent?.competitions || [];

  comps.forEach((comp, idx) => {
    const competitors = comp?.competitors || [];
    if (competitors.length !== 2) return;

    const [c1, c2] = competitors;
    fights.push({
      fighter1: c1?.athlete?.displayName || c1?.team?.displayName || 'TBD',
      fighter2: c2?.athlete?.displayName || c2?.team?.displayName || 'TBD',
      weight_class: comp?.type?.text || 'Unknown',
      is_main_event: idx === 0,
      espn_id: comp?.id,
      stats: {
        weightClass: comp?.type?.text || '',
        f1Record: c1?.records?.[0]?.summary || '',
        f2Record: c2?.records?.[0]?.summary || '',
      }
    });
  });

  return fights;
}

// ── GENERATE PREDICTIONS ──────────────────────────────────
async function generateCardPredictions() {
  console.log('[AutoCard] Finding upcoming UFC event...');
  const result = await findUpcomingCard();

  if (!result) {
    console.log('[AutoCard] No upcoming UFC event found in next 14 days');
    return null;
  }

  const { event, date } = result;
  console.log(`[AutoCard] Found: ${event.name} on ${date}`);

  const fights = parseFights(event);
  if (fights.length === 0) {
    console.log('[AutoCard] No fights parsed from ESPN');
    return null;
  }

  console.log(`[AutoCard] Generating predictions for ${fights.length} fights...`);
  const predictions = await predictCard(fights);

  // Build parlay from LOCK picks
  const locks = predictions.filter(p => p.tier === 'LOCK' && p.winner);
  const leans = predictions.filter(p => p.tier === 'LEAN' && p.winner);

  const output = {
    event_name: event.name,
    event_date: date,
    location: event?.competitions?.[0]?.venue?.fullName || 'UFC Apex, Las Vegas',
    generated_at: new Date().toISOString(),
    predictions,
    parlay: buildParlay(locks, leans),
  };

  // Write to website
  fs.writeFileSync(PREDICTIONS_PATH, JSON.stringify(output, null, 2));
  console.log(`[AutoCard] Predictions written to ${PREDICTIONS_PATH}`);

  // Archive
  const archivePath = path.join(DATA_PATH, `predictions-${date}.json`);
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
  fs.writeFileSync(archivePath, JSON.stringify(output, null, 2));

  return output;
}

// ── BUILD PARLAY ──────────────────────────────────────────
function buildParlay(locks, leans) {
  const allPicks = [...locks, ...leans];
  if (allPicks.length < 2) return null;

  const twoLeg = allPicks.slice(0, 2);
  const threeLeg = allPicks.slice(0, 3);

  const avgConf = arr => Math.round(arr.reduce((s, p) => s + (p.confidence || 60), 0) / arr.length);

  return {
    two_leg: {
      picks: twoLeg.map(p => p.winner),
      combined_confidence: avgConf(twoLeg),
      note: `${twoLeg.map(p => p.tier).join(' + ')} picks. Both backed by ML + market.`
    },
    ...(threeLeg.length >= 3 ? {
      three_leg: {
        picks: threeLeg.map(p => p.winner),
        combined_confidence: avgConf(threeLeg),
        note: 'Add for parlay upside. Finish potential inflates value.'
      }
    } : {})
  };
}

// ── CLI ───────────────────────────────────────────────────
if (require.main === module) {
  generateCardPredictions()
    .then(r => { if (r) console.log(`\n✅ Generated ${r.predictions.length} predictions for ${r.event_name}`); })
    .catch(console.error);
}

module.exports = { generateCardPredictions };
