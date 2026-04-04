// UFC Ruban - Scheduler + Discord Bot
// discord.js v13 — runs alongside server/index.js
// Handles: fight card detection, AI predictions, Discord posting

const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const POLL_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const PREDICTIONS_PATH = path.join(__dirname, 'website', 'predictions.json');
const POSTED_EVENTS_PATH = path.join(__dirname, 'database', 'posted_events.json');

// Channel IDs
const FREE_CHANNEL  = process.env.CHANNEL_FREE_PICKS  || process.env.PREDICTION_CHANNEL_ID;
const PRO_CHANNEL   = process.env.CHANNEL_PRO_PICKS;
const ANN_CHANNEL   = process.env.CHANNEL_ANNOUNCEMENTS;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('[Bot] FATAL: No Discord token. Set DISCORD_TOKEN in Railway vars.');
  process.exit(1);
}

// ── DISCORD CLIENT ────────────────────────────────────────
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

// ── POSTED EVENTS TRACKING ────────────────────────────────
function loadPostedEvents() {
  try {
    if (!fs.existsSync(POSTED_EVENTS_PATH)) return {};
    return JSON.parse(fs.readFileSync(POSTED_EVENTS_PATH, 'utf8'));
  } catch { return {}; }
}

function markEventPosted(eventName) {
  const posted = loadPostedEvents();
  posted[eventName] = new Date().toISOString();
  const dir = path.dirname(POSTED_EVENTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(POSTED_EVENTS_PATH, JSON.stringify(posted, null, 2));
}

function isEventPosted(eventName) {
  return !!loadPostedEvents()[eventName];
}

// ── LOAD PREDICTIONS ──────────────────────────────────────
function loadPredictions() {
  try {
    if (!fs.existsSync(PREDICTIONS_PATH)) return null;
    return JSON.parse(fs.readFileSync(PREDICTIONS_PATH, 'utf8'));
  } catch { return null; }
}

// ── BUILD EMBEDS ──────────────────────────────────────────
function buildMainEventEmbed(data) {
  const mainEvent = (data.predictions || []).find(p => p.is_main_event) || data.predictions?.[0];
  if (!mainEvent) return null;

  const tierColor = { LOCK: 0x00C851, LEAN: 0x2196F3, 'TOSS-UP': 0xFF9800 };
  const tierEmoji = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' };

  return new MessageEmbed()
    .setColor(tierColor[mainEvent.tier] || 0xE8002A)
    .setTitle(`🥊 ${data.event_name}`)
    .setDescription(`**Main Event Preview** — ${data.event_date} | ${data.location || 'UFC Apex'}`)
    .addField('Matchup', `**${mainEvent.fighter1}** vs **${mainEvent.fighter2}**`, false)
    .addField('RUBAN Pick', `${tierEmoji[mainEvent.tier] || ''} **${mainEvent.winner}**`, true)
    .addField('Tier', `**${mainEvent.tier}**`, true)
    .addField('Method', mainEvent.method || 'Decision', true)
    .addField('Analysis', mainEvent.analysis?.substring(0, 300) || 'Loading...', false)
    .setFooter({ text: 'Free tier preview • Subscribe at ruban.gg for full card + confidence scores' })
    .setTimestamp();
}

function buildFullCardEmbed(data) {
  const embed = new MessageEmbed()
    .setColor(0xE8002A)
    .setTitle(`📊 Full Card — ${data.event_name}`)
    .setDescription('Complete RUBAN predictions with confidence scores')
    .setTimestamp()
    .setFooter({ text: 'RUBAN UFC Intelligence • Powered by ML + Sharp Money + ELO' });

  const preds = data.predictions || [];
  for (const p of preds.slice(0, 10)) {
    const tierEmoji = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' }[p.tier] || '📊';
    const conf = p.confidence ? `${p.confidence}%` : '—';
    embed.addField(
      `${p.fighter1} vs ${p.fighter2}`,
      `${tierEmoji} **${p.winner}** | ${conf} | ${p.method || 'Dec'} | ${p.tier}`,
      false
    );
  }

  return embed;
}

function buildParlayEmbed(data) {
  if (!data.parlay) return null;
  const embed = new MessageEmbed()
    .setColor(0xC9A84C)
    .setTitle('💰 RUBAN Parlay Builder')
    .setDescription('High-confidence picks for parlay consideration');

  if (data.parlay.two_leg) {
    embed.addField(
      `2-Leg Parlay (${data.parlay.two_leg.combined_confidence}% avg confidence)`,
      data.parlay.two_leg.picks.join(' + ') + `\n_${data.parlay.two_leg.note || ''}_`,
      false
    );
  }
  if (data.parlay.three_leg) {
    embed.addField(
      `3-Leg Parlay (${data.parlay.three_leg.combined_confidence}% avg confidence)`,
      data.parlay.three_leg.picks.join(' + ') + `\n_${data.parlay.three_leg.note || ''}_`,
      false
    );
  }

  embed.setFooter({ text: '⚠️ For entertainment only. Always gamble responsibly.' });
  return embed;
}

// ── POST TO DISCORD ───────────────────────────────────────
async function postPredictions(data) {
  try {
    // Post main event teaser to FREE channel
    if (FREE_CHANNEL) {
      const channel = await client.channels.fetch(FREE_CHANNEL).catch(() => null);
      if (channel) {
        const mainEmbed = buildMainEventEmbed(data);
        if (mainEmbed) {
          await channel.send({ embeds: [mainEmbed] });
          console.log(`[Bot] Posted main event to free channel`);
        }
      }
    }

    await sleep(1000);

    // Post full card to PRO channel
    if (PRO_CHANNEL) {
      const proChannel = await client.channels.fetch(PRO_CHANNEL).catch(() => null);
      if (proChannel) {
        await proChannel.send({ embeds: [buildFullCardEmbed(data)] });
        const parlayEmbed = buildParlayEmbed(data);
        if (parlayEmbed) await proChannel.send({ embeds: [parlayEmbed] });
        console.log(`[Bot] Posted full card to pro channel`);
      }
    }

    return true;
  } catch (err) {
    console.error('[Bot] Post error:', err.message);
    return false;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── FETCH ESPN CARD ───────────────────────────────────────
async function fetchUpcomingCard() {
  const https = require('https');
  for (let i = 0; i <= 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const date = d.toISOString().split('T')[0].replace(/-/g, '');

    const data = await new Promise((resolve) => {
      https.get(
        `https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard?dates=${date}`,
        { timeout: 8000 },
        (res) => {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve(null); } });
        }
      ).on('error', () => resolve(null));
    });

    const events = data?.events || [];
    const ufc = events.find(e => e.name?.includes('UFC'));
    if (ufc) return { name: ufc.name, date, espn: ufc };
  }
  return null;
}

// ── MAIN CYCLE ────────────────────────────────────────────
async function runCycle() {
  console.log(`[Bot] Cycle at ${new Date().toISOString()}`);

  // Check predictions.json first (might already be written by local engine)
  let data = loadPredictions();

  if (!data) {
    // Try to fetch from ESPN and generate
    try {
      const card = await fetchUpcomingCard();
      if (!card) { console.log('[Bot] No upcoming UFC card found'); return; }
      console.log(`[Bot] Found: ${card.name}`);

      // Use existing predictions.json if we have it for this event
      data = loadPredictions();
      if (!data || data.event_name !== card.name) {
        console.log('[Bot] No predictions yet for this card — will post when ready');
        return;
      }
    } catch (err) {
      console.error('[Bot] Fetch error:', err.message);
      return;
    }
  }

  if (!data || !data.event_name) { console.log('[Bot] No prediction data available'); return; }

  if (isEventPosted(data.event_name)) {
    console.log(`[Bot] ${data.event_name} already posted`);
    return;
  }

  console.log(`[Bot] Posting: ${data.event_name}`);
  const ok = await postPredictions(data);
  if (ok) markEventPosted(data.event_name);
}

// ── STARTUP ───────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`[Bot] Online as ${client.user.tag}`);
  console.log(`[Bot] Free channel: ${FREE_CHANNEL}`);
  console.log(`[Bot] Pro channel: ${PRO_CHANNEL}`);

  // Run immediately on startup
  await runCycle();

  // Then every 6 hours
  setInterval(runCycle, POLL_INTERVAL_MS);
});

client.on('error', (err) => console.error('[Bot] Client error:', err.message));

process.on('uncaughtException', (err) => console.error('[Bot] Uncaught:', err.message));
process.on('unhandledRejection', (r) => console.error('[Bot] Rejection:', r));

client.login(DISCORD_TOKEN)
  .then(() => console.log('[Bot] Login sent'))
  .catch(err => console.error('[Bot] Login FAILED:', err.message));
