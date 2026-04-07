// UFC Ruban — Scheduler + Discord Bot
// discord.js v13 | Runs alongside server/index.js

const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const POLL_INTERVAL_MS  = 6 * 60 * 60 * 1000;
const SCHEDULE_CHECK_MS = 60 * 1000;
const PREDICTIONS_PATH  = path.join(__dirname, 'website', 'predictions.json');
const POSTED_EVENTS_PATH = path.join(__dirname, 'database', 'posted_events.json');

const COLORS = { DARK: 0x1a1a2e, RED: 0xe74c3c, GOLD: 0xc9a84c };
const FOOTER = { text: 'RUBAN | UFC Intelligence' };

const FREE_CHANNEL  = process.env.CHANNEL_FREE_PICKS  || process.env.PREDICTION_CHANNEL_ID;
const PRO_CHANNEL   = process.env.CHANNEL_PRO_PICKS;
const ANN_CHANNEL   = process.env.CHANNEL_ANNOUNCEMENTS;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;
const SITE_URL      = process.env.SITE_URL || 'https://ruban.gg';

if (!DISCORD_TOKEN) {
  console.error('[Bot] FATAL: No Discord token. Set DISCORD_TOKEN in env.');
  process.exit(1);
}

// ── CLIENT ────────────────────────────────────────────────
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// ── AUTO-RESPONSES (mention-only) ─────────────────────────
const AUTO_RESPONSES = {
  'subscribe': () => ({
    title: 'Subscribe to RUBAN Pro',
    description: `Full card predictions, confidence scores, and parlay builders.\n\n**$9.99/month** or **$79.99/year** (save 17%)\n\n[Subscribe →](${SITE_URL})`,
    color: COLORS.RED,
  }),
  'free pick': () => {
    const data = loadPredictions();
    const main = data?.predictions?.find(p => p.is_main_event) || data?.predictions?.[0];
    if (!main) return {
      title: 'Free Pick',
      description: `Main event prediction posted here before every card — no subscription needed.\n\n[Subscribe for full card →](${SITE_URL})`,
      color: COLORS.DARK,
    };
    const e = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' };
    return {
      title: `Today's Free Pick — ${data.event_name}`,
      description: `${e[main.tier] || '🥊'} **${main.fighter1} vs ${main.fighter2}**\n\n**Pick:** ${main.winner}\n**Tier:** ${main.tier}\n**Method:** ${main.method || 'Decision'}\n\n[Full card →](${SITE_URL})`,
      color: COLORS.RED,
    };
  },
  'what is ruban': () => ({
    title: 'What is RUBAN?',
    description: `Data-driven UFC prediction platform.\n\n**Signal stack:**\n• 50% ML (XGBoost, 32 features)\n• 35% Sharp money consensus\n• 15% FightMatrix ELO\n• Claude AI review\n\nConfidence capped at 76%. Track record published every event.\n\n[Learn more →](${SITE_URL})`,
    color: COLORS.DARK,
  }),
  'accuracy': () => ({
    title: 'RUBAN Accuracy',
    description: `🔒 **LOCK** (≥65%) — High confidence\n⚡ **LEAN** (54–64%) — Solid edge\n🎲 **TOSS-UP** (<54%) — No strong lean\n\nMax confidence: 76%. Track record published after every event.\n\n[Full history →](${SITE_URL}/history)`,
    color: COLORS.GOLD,
  }),
};

function buildAutoEmbed({ title, description, color }) {
  return new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter(FOOTER)
    .setTimestamp();
}

// ── MESSAGE HANDLER — mentions only ──────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.mentions.has(client.user)) return;

  const content = message.content.toLowerCase();

  for (const [trigger, buildData] of Object.entries(AUTO_RESPONSES)) {
    if (content.includes(trigger)) {
      try {
        const data = typeof buildData === 'function' ? buildData() : buildData;
        await message.reply({ embeds: [buildAutoEmbed(data)] });
      } catch (err) {
        console.error('[Bot] Reply error:', err.message);
      }
      return;
    }
  }

  // Default: show available commands
  try {
    await message.reply({
      embeds: [new MessageEmbed()
        .setColor(COLORS.DARK)
        .setTitle('RUBAN UFC Intelligence')
        .setDescription('Use `/picks` for today\'s free pick or `/subscribe` for plan info.\nOr ask me: `subscribe` · `free pick` · `accuracy` · `what is ruban`')
        .setFooter(FOOTER)
        .setTimestamp()
      ],
    });
  } catch (err) {
    console.error('[Bot] Default reply error:', err.message);
  }
});

// ── SLASH COMMANDS ────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    if (interaction.commandName === 'picks') {
      const data = loadPredictions();
      const main = data?.predictions?.find(p => p.is_main_event) || data?.predictions?.[0];

      if (!main) {
        return interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(COLORS.DARK)
            .setTitle('No Pick Available')
            .setDescription('No upcoming event predictions yet. Check back closer to fight night.')
            .setFooter(FOOTER)
            .setTimestamp()
          ],
          ephemeral: true,
        });
      }

      const tierEmoji = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' }[main.tier] || '🥊';
      return interaction.reply({
        embeds: [new MessageEmbed()
          .setColor(COLORS.RED)
          .setTitle(`Free Pick — ${data.event_name}`)
          .setDescription(`${tierEmoji} **${main.fighter1} vs ${main.fighter2}**`)
          .addField('Pick', `**${main.winner}**`, true)
          .addField('Tier', main.tier, true)
          .addField('Method', main.method || 'Decision', true)
          .addField('Full Card', `[Subscribe for all picks →](${SITE_URL})`, false)
          .setFooter(FOOTER)
          .setTimestamp()
        ],
      });
    }

    if (interaction.commandName === 'subscribe') {
      return interaction.reply({
        embeds: [new MessageEmbed()
          .setColor(COLORS.RED)
          .setTitle('RUBAN Subscription Plans')
          .setDescription('Institutional-grade UFC analysis. Pick your tier.')
          .addField('Scout — Free', 'Main event picks · ELO rankings · Community Discord', false)
          .addField('Sharp — $9.99/mo', 'Full card · Confidence scores · Parlay builder · Line alerts', false)
          .addField('Capper — $79.99/yr', 'Everything in Sharp · API access · Raw model outputs', false)
          .addField('Subscribe', `[ruban.gg →](${SITE_URL})`, false)
          .setFooter(FOOTER)
          .setTimestamp()
        ],
        ephemeral: true,
      });
    }
  } catch (err) {
    console.error('[Bot] Interaction error:', err.message);
  }
});

// ── POSTED EVENTS ─────────────────────────────────────────
function loadPostedEvents() {
  try {
    if (!fs.existsSync(POSTED_EVENTS_PATH)) return {};
    return JSON.parse(fs.readFileSync(POSTED_EVENTS_PATH, 'utf8'));
  } catch { return {}; }
}

function markPosted(key) {
  const posted = loadPostedEvents();
  posted[key] = new Date().toISOString();
  const dir = path.dirname(POSTED_EVENTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(POSTED_EVENTS_PATH, JSON.stringify(posted, null, 2));
}

function isPosted(key) { return !!loadPostedEvents()[key]; }

// ── PREDICTIONS ───────────────────────────────────────────
function loadPredictions() {
  try {
    if (!fs.existsSync(PREDICTIONS_PATH)) return null;
    return JSON.parse(fs.readFileSync(PREDICTIONS_PATH, 'utf8'));
  } catch { return null; }
}

// ── EMBED BUILDERS ────────────────────────────────────────
function buildMainEventEmbed(data) {
  const main = (data.predictions || []).find(p => p.is_main_event) || data.predictions?.[0];
  if (!main) return null;

  const tierEmoji = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' }[main.tier] || '🥊';

  return new MessageEmbed()
    .setColor(COLORS.RED)
    .setTitle(`🥊 ${data.event_name}`)
    .setDescription(`**${main.fighter1} vs ${main.fighter2}**\n${data.event_date} | ${data.location || 'UFC Apex'}`)
    .addField('RUBAN Pick', `${tierEmoji} **${main.winner}** — ${main.tier}`, true)
    .addField('Method', main.method || 'Decision', true)
    .addField('Analysis', (main.analysis || '').substring(0, 280) || 'Analysis loading...', false)
    .addField('Full Card', `[Subscribe →](${SITE_URL})`, false)
    .setFooter(FOOTER)
    .setTimestamp();
}

function buildFullCardEmbed(data) {
  const embed = new MessageEmbed()
    .setColor(COLORS.DARK)
    .setTitle(`📊 Full Card — ${data.event_name}`)
    .setDescription(`${data.event_date} | ${data.location || 'UFC Apex'}`)
    .setFooter(FOOTER)
    .setTimestamp();

  for (const p of (data.predictions || []).slice(0, 10)) {
    const t = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' }[p.tier] || '📊';
    const conf = p.confidence ? `${p.confidence}%` : '—';
    embed.addField(
      `${p.fighter1} vs ${p.fighter2}`,
      `${t} **${p.winner}** | ${conf} | ${p.method || 'Dec'} | ${p.tier}`,
      false
    );
  }

  return embed;
}

function buildParlayEmbed(data) {
  if (!data.parlay) return null;
  const embed = new MessageEmbed()
    .setColor(COLORS.GOLD)
    .setTitle('💰 RUBAN Parlay Builder')
    .setDescription('High-confidence picks for parlay consideration')
    .setFooter({ text: '⚠️ For entertainment only. Gamble responsibly. | RUBAN | UFC Intelligence' })
    .setTimestamp();

  if (data.parlay.two_leg) embed.addField(
    `2-Leg Parlay — ${data.parlay.two_leg.combined_confidence}% avg`,
    data.parlay.two_leg.picks.join(' + '), false
  );
  if (data.parlay.three_leg) embed.addField(
    `3-Leg Parlay — ${data.parlay.three_leg.combined_confidence}% avg`,
    data.parlay.three_leg.picks.join(' + '), false
  );

  return embed;
}

function buildReminderEmbed(data) {
  return new MessageEmbed()
    .setColor(COLORS.RED)
    .setTitle(`⚡ Fight Night Tonight — ${data.event_name}`)
    .setDescription(`Doors open soon. RUBAN picks are live.\n\n${data.event_date} | ${data.location || 'UFC Apex'}`)
    .addField('Full card analysis', `[Get picks →](${SITE_URL})`, false)
    .setFooter(FOOTER)
    .setTimestamp();
}

function buildResultsTemplateEmbed(data) {
  return new MessageEmbed()
    .setColor(COLORS.DARK)
    .setTitle(`📋 Post-Fight Results — ${data.event_name}`)
    .setDescription('Fight night wrapped. RUBAN results will be posted shortly.\n\nTrack record updated after every event.')
    .addField('View history', `[Full record →](${SITE_URL}/history)`, false)
    .setFooter(FOOTER)
    .setTimestamp();
}

// ── CHANNEL POST ──────────────────────────────────────────
async function postToChannel(channelId, embed) {
  if (!channelId) return;
  try {
    const ch = await client.channels.fetch(channelId).catch(() => null);
    if (ch) await ch.send({ embeds: [embed] });
  } catch (err) {
    console.error('[Bot] Channel post error:', err.message);
  }
}

async function postPredictions(data) {
  try {
    if (FREE_CHANNEL) {
      const embed = buildMainEventEmbed(data);
      if (embed) await postToChannel(FREE_CHANNEL, embed);
    }

    await sleep(1000);

    if (PRO_CHANNEL) {
      const ch = await client.channels.fetch(PRO_CHANNEL).catch(() => null);
      if (ch) {
        await ch.send({ embeds: [buildFullCardEmbed(data)] });
        const parlay = buildParlayEmbed(data);
        if (parlay) await ch.send({ embeds: [parlay] });
      }
    }

    return true;
  } catch (err) {
    console.error('[Bot] Post error:', err.message);
    return false;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── ESPN CARD FETCH ───────────────────────────────────────
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

    const ufc = (data?.events || []).find(e => e.name?.includes('UFC'));
    if (ufc) return { name: ufc.name, date, espn: ufc };
  }
  return null;
}

// ── SCHEDULER (ET timezone) ───────────────────────────────
function getETDate() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

const scheduledToday = new Set();

async function checkSchedule() {
  const et  = getETDate();
  const day = et.getDay();   // 0=Sun, 6=Sat, 1=Mon
  const h   = et.getHours();
  const m   = et.getMinutes();
  const dk  = `${et.getFullYear()}-${et.getMonth()}-${et.getDate()}`;

  // ── SATURDAY FIGHT NIGHTS ──────────────────────────────
  if (day === 6) {
    const data = loadPredictions();
    if (data) {
      // 2 PM ET — reminder
      if (h === 14 && m < 5) {
        const key = `${dk}:reminder`;
        if (!scheduledToday.has(key)) {
          scheduledToday.add(key);
          const embed = buildReminderEmbed(data);
          await postToChannel(FREE_CHANNEL, embed);
          await postToChannel(ANN_CHANNEL, embed);
        }
      }

      // 6 PM ET — post free pick + trigger emails
      if (h === 18 && m < 5) {
        const key = `${dk}:free-pick-6pm`;
        if (!scheduledToday.has(key)) {
          scheduledToday.add(key);
          const embed = buildMainEventEmbed(data);
          if (embed) await postToChannel(FREE_CHANNEL, embed);

          try {
            const { sendFightNightEmails } = require('./engine/auto-email');
            await sendFightNightEmails(data);
          } catch (err) {
            console.error('[Bot] Email trigger error:', err.message);
          }
        }
      }
    }
  }

  // ── POST-FIGHT RESULTS — midnight ET ──────────────────
  if (h === 0 && m < 5 && (day === 0 || day === 6)) {
    const key = `${dk}:results`;
    const data = loadPredictions();
    if (data && !scheduledToday.has(key)) {
      scheduledToday.add(key);
      await postToChannel(FREE_CHANNEL, buildResultsTemplateEmbed(data));
    }
  }

  // ── MONDAY 9 AM — check for card this week ─────────────
  if (day === 1 && h === 9 && m < 5) {
    const key = `${dk}:auto-card`;
    if (!scheduledToday.has(key)) {
      scheduledToday.add(key);
      try {
        const card = await fetchUpcomingCard();
        if (card) {
          const { generateCardPredictions } = require('./engine/auto-card');
          await generateCardPredictions();
        }
      } catch (err) {
        console.error('[Bot] Auto-card error:', err.message);
      }
    }
  }
}

// ── MAIN PREDICTION CYCLE ─────────────────────────────────
async function runCycle() {
  let data = loadPredictions();

  if (!data) {
    try {
      const card = await fetchUpcomingCard();
      if (!card) return;
      data = loadPredictions();
      if (!data || data.event_name !== card.name) return;
    } catch (err) {
      console.error('[Bot] Fetch error:', err.message);
      return;
    }
  }

  if (!data?.event_name) return;

  const postKey = `${data.event_name}:main`;
  if (isPosted(postKey)) return;

  const ok = await postPredictions(data);
  if (ok) markPosted(postKey);
}

// ── STARTUP ───────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`[Bot] Online as ${client.user.tag}`);

  try {
    await client.application.commands.set([
      { name: 'picks',     description: "Get today's free pick" },
      { name: 'subscribe', description: 'View RUBAN subscription plans' },
    ]);
  } catch (err) {
    console.error('[Bot] Command registration error:', err.message);
  }

  await runCycle();
  setInterval(runCycle, POLL_INTERVAL_MS);
  setInterval(checkSchedule, SCHEDULE_CHECK_MS);
});

client.on('error', (err) => console.error('[Bot] Client error:', err.message));
process.on('uncaughtException', (err) => console.error('[Bot] Uncaught:', err.message));
process.on('unhandledRejection', (r) => console.error('[Bot] Rejection:', r));

client.login(DISCORD_TOKEN).catch(err => console.error('[Bot] Login FAILED:', err.message));
