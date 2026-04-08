// RUBAN Daily Content Automation
// Runs on schedule to post free picks and premium intel from the live site data source

const fs = require('fs').promises;
const path = require('path');
const discordBot = require('./discord-bot');

const PREDICTIONS_FILE = path.join(__dirname, '..', 'ruban-frontend', 'app', 'data', 'predictions.json');

async function loadPredictions() {
  const raw = await fs.readFile(PREDICTIONS_FILE, 'utf8');
  return JSON.parse(raw);
}

function getMainEvent(data) {
  return data.predictions.find((fight) => fight.is_main_event) || data.predictions[0];
}

function buildFreePickPayload(data) {
  const fight = getMainEvent(data);

  return {
    fighter1: fight.fighter1,
    fighter2: fight.fighter2,
    event: data.event_name,
    date: data.event_date,
    pick: fight.winner,
    confidence: fight.confidence,
    method: fight.method,
    analysis: fight.analysis,
    risks: Array.isArray(fight.key_factors) && fight.key_factors.length
      ? fight.key_factors.slice(0, 3).join('\n• ')
      : 'Fight-week volatility remains live.',
    tier: fight.tier,
    weightClass: fight.weight_class,
  };
}

function buildPremiumPayload(data) {
  const mainCard = data.predictions
    .map((fight) => `• ${fight.fighter1} vs ${fight.fighter2} → **${fight.winner}** (${fight.method}) · ${fight.confidence}% · ${fight.tier}`)
    .join('\n');

  const parlayLines = [];
  if (data.parlay?.two_leg) {
    parlayLines.push(`Two-Leg: ${data.parlay.two_leg.picks.join(' + ')} · ${data.parlay.two_leg.combined_confidence}%`);
  }
  if (data.parlay?.three_leg) {
    parlayLines.push(`Three-Leg: ${data.parlay.three_leg.picks.join(' + ')} · ${data.parlay.three_leg.combined_confidence}%`);
  }

  const insights = [
    `Location: ${data.location}`,
    `Generated: ${data.generated_at}`,
    ...parlayLines,
  ].join('\n');

  return {
    event: data.event_name,
    date: data.event_date,
    mainCard,
    prelims: 'Current card board loaded from the live RUBAN prediction file.',
    insights,
  };
}

async function postDailyFreePick() {
  try {
    console.log('📅 Running daily free pick...');
    const data = await loadPredictions();
    await discordBot.postFreePick(buildFreePickPayload(data));
    console.log('✅ Daily free pick posted');
  } catch (error) {
    console.error('❌ Error posting daily free pick:', error);
  }
}

async function postPremiumIntel() {
  try {
    console.log('📅 Running premium intel drop...');
    const data = await loadPredictions();
    await discordBot.postPremiumIntel(buildPremiumPayload(data));
    console.log('✅ Premium intel posted');
  } catch (error) {
    console.error('❌ Error posting premium intel:', error);
  }
}

if (require.main === module) {
  const command = process.argv[2];

  if (command === 'free-pick') {
    postDailyFreePick();
  } else if (command === 'premium') {
    postPremiumIntel();
  } else {
    console.log('Usage: node daily-content.js [free-pick|premium]');
  }
}

module.exports = {
  postDailyFreePick,
  postPremiumIntel,
  loadPredictions,
  buildFreePickPayload,
  buildPremiumPayload,
};
