// UFC Ruban — Scheduler
// Permanent runtime. Polls every 6 hours for new UFC cards.
// discord.js v13 ONLY
// Run: node scheduler.js

const { Client, Intents } = require('discord.js');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');
require('dotenv').config();

const {
  buildHeaderEmbed,
  buildMainCardEmbeds,
  buildParlayEmbed,
  buildErrorEmbed,
  buildFooterEmbed,
} = require('./bot/utils/embeds');

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const POLL_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const PREDICTIONS_PATH = path.join(__dirname, 'website', 'predictions.json');
const POSTED_EVENTS_PATH = path.join(__dirname, 'database', 'posted_events.json');
const DB_PATH = path.join(__dirname, 'database', 'ufc.db');

const CHANNEL_ID = process.env.PREDICTION_CHANNEL_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN || !CHANNEL_ID) {
  console.error('FATAL: DISCORD_TOKEN and PREDICTION_CHANNEL_ID must be set in .env');
  process.exit(1);
}

// ─────────────────────────────────────────────
// DISCORD CLIENT — v13 syntax ONLY
// ─────────────────────────────────────────────
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// ─────────────────────────────────────────────
// POSTED EVENTS TRACKING
// ─────────────────────────────────────────────
function loadPostedEvents() {
  if (!fs.existsSync(POSTED_EVENTS_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(POSTED_EVENTS_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function markEventPosted(eventName) {
  const posted = loadPostedEvents();
  posted[eventName] = new Date().toISOString();
  fs.writeFileSync(POSTED_EVENTS_PATH, JSON.stringify(posted, null, 2));
}

function isEventPosted(eventName) {
  const posted = loadPostedEvents();
  return !!posted[eventName];
}

// ─────────────────────────────────────────────
// RUN PREDICTION PIPELINE
// ─────────────────────────────────────────────
function runPredictions() {
  console.log('[Scheduler] Running prediction pipeline...');
  try {
    const output = execSync(
      `python3 python/model/predict.py --card`,
      { cwd: __dirname, timeout: 300000, encoding: 'utf8' }
    );
    return JSON.parse(output);
  } catch (err) {
    console.error('[Scheduler] Prediction pipeline error:', err.message);
    return null;
  }
}

function savePredictionsJson(results) {
  const websiteDir = path.join(__dirname, 'website');
  if (!fs.existsSync(websiteDir)) fs.mkdirSync(websiteDir, { recursive: true });
  fs.writeFileSync(PREDICTIONS_PATH, JSON.stringify(results, null, 2));
  console.log('[Scheduler] predictions.json updated');
}

function savePredictionsToDB(results) {
  if (!fs.existsSync(DB_PATH)) return;
  try {
    const db = sqlite3(DB_PATH);
    const insert = db.prepare(`
      INSERT OR IGNORE INTO prediction_results
      (event_name, fighter1, fighter2, predicted_winner, confidence, tier, predicted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((preds) => {
      for (const p of preds) {
        insert.run(
          results.event_name,
          p.fighter1,
          p.fighter2,
          p.winner,
          p.confidence,
          p.tier,
          p.predicted_at
        );
      }
    });

    insertMany(results.predictions || []);
    db.close();
    console.log(`[Scheduler] Saved ${(results.predictions || []).length} predictions to DB`);
  } catch (err) {
    console.error('[Scheduler] DB save error:', err.message);
  }
}

// ─────────────────────────────────────────────
// POST TO DISCORD
// ─────────────────────────────────────────────
async function postCard(results) {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) {
    console.error('[Scheduler] Cannot find Discord channel:', CHANNEL_ID);
    return;
  }

  // 1. Header embed
  await channel.send({ embeds: [buildHeaderEmbed(results)] });

  // 2. Main event + full card embeds
  const predictions = (results.predictions || []).sort((a, b) => a.fight_order - b.fight_order);
  const cardEmbeds = buildMainCardEmbeds(predictions);
  for (const embed of cardEmbeds) {
    await channel.send({ embeds: [embed] });
    await sleep(500); // rate limit safety
  }

  // 3. Parlay builder
  if (results.parlays) {
    const parlayEmbed = buildParlayEmbed(results.parlays);
    if (parlayEmbed) await channel.send({ embeds: [parlayEmbed] });
  }

  // 4. Error report (missing fighters)
  if (results.errors && results.errors.length > 0) {
    const errorEmbed = buildErrorEmbed(results.errors);
    if (errorEmbed) await channel.send({ embeds: [errorEmbed] });
  }

  // 5. Footer
  await channel.send({ embeds: [buildFooterEmbed()] });

  console.log(`[Scheduler] Posted card for ${results.event_name}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// CHECK FOR NEW EVENT
// ─────────────────────────────────────────────
function getNextEventFromDB() {
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    const db = sqlite3(DB_PATH);
    const row = db.prepare("SELECT DISTINCT event_name FROM upcoming_cards LIMIT 1").get();
    db.close();
    return row ? row.event_name : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// MAIN LOOP
// ─────────────────────────────────────────────
async function runCycle() {
  console.log(`\n[Scheduler] ${new Date().toISOString()} — Running cycle`);

  const eventName = getNextEventFromDB();
  if (!eventName) {
    console.log('[Scheduler] No upcoming card in DB. Run upcoming_card_scraper.py.');
    return;
  }

  if (isEventPosted(eventName)) {
    console.log(`[Scheduler] ${eventName} already posted. Skipping.`);
    return;
  }

  console.log(`[Scheduler] New event detected: ${eventName}`);

  const results = runPredictions();
  if (!results || results.error) {
    console.error('[Scheduler] Prediction failed:', results?.message || 'Unknown error');
    return;
  }

  // Save to website JSON (auto-updates web platform)
  savePredictionsJson(results);

  // Save to DB for accuracy tracking
  savePredictionsToDB(results);

  // Post to Discord
  try {
    await postCard(results);
    markEventPosted(eventName);
  } catch (err) {
    console.error('[Scheduler] Discord post error:', err.message);
  }
}

// ─────────────────────────────────────────────
// STARTUP
// ─────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`[Scheduler] Discord bot ready as ${client.user.tag}`);
  console.log(`[Scheduler] Posting to channel: ${CHANNEL_ID}`);

  // Run immediately, then every 6 hours
  await runCycle();
  setInterval(runCycle, POLL_INTERVAL_MS);
});

client.login(DISCORD_TOKEN);

process.on('uncaughtException', (err) => {
  console.error('[Scheduler] Uncaught exception:', err);
  // Don't exit — keep running
});

process.on('unhandledRejection', (reason) => {
  console.error('[Scheduler] Unhandled rejection:', reason);
});
