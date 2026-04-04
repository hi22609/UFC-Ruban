/**
 * RUBAN Local Prediction Engine
 * Uses Ollama (local AI) — zero API cost, runs on your 32GB RAM
 * Falls back to Anthropic if Ollama is unavailable
 */

const http = require('http');
const https = require('https');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:14b';
const FALLBACK_MODEL = 'claude-sonnet-4-5';

// ── OLLAMA REQUEST ────────────────────────────────────────
function ollamaRequest(prompt, model = OLLAMA_MODEL) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
        top_p: 0.9,
        num_predict: 1500,
      }
    });

    const req = http.request({
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.response || '');
        } catch (e) {
          reject(new Error('Ollama parse error: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Ollama timeout')); });
    req.write(body);
    req.end();
  });
}

// ── CHECK OLLAMA HEALTH ───────────────────────────────────
function ollamaHealthCheck() {
  return new Promise((resolve) => {
    const req = http.get(`${OLLAMA_URL}/api/tags`, { timeout: 3000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

// ── BUILD PREDICTION PROMPT ───────────────────────────────
function buildPrompt(fighter1, fighter2, stats = {}) {
  return `You are RUBAN, an elite UFC prediction system. Analyze this fight with precision.

FIGHT: ${fighter1} vs ${fighter2}
${stats.weightClass ? `WEIGHT CLASS: ${stats.weightClass}` : ''}
${stats.f1Record ? `${fighter1} record: ${stats.f1Record}` : ''}
${stats.f2Record ? `${fighter2} record: ${stats.f2Record}` : ''}
${stats.f1Reach ? `${fighter1} reach: ${stats.f1Reach}"` : ''}
${stats.f2Reach ? `${fighter2} reach: ${stats.f2Reach}"` : ''}
${stats.f1StrikeAcc ? `${fighter1} striking accuracy: ${stats.f1StrikeAcc}%` : ''}
${stats.f2StrikeAcc ? `${fighter2} striking accuracy: ${stats.f2StrikeAcc}%` : ''}
${stats.f1TDacc ? `${fighter1} takedown accuracy: ${stats.f1TDacc}%` : ''}
${stats.f2TDacc ? `${fighter2} takedown accuracy: ${stats.f2TDacc}%` : ''}
${stats.marketOdds ? `Market odds: ${stats.marketOdds}` : ''}

Respond ONLY with a JSON object, no other text:
{
  "winner": "Fighter Name",
  "confidence": <number 50-76>,
  "tier": "LOCK|LEAN|TOSS-UP",
  "method": "KO/TKO|Submission|Decision",
  "method_breakdown": {"KO_TKO": <pct>, "Submission": <pct>, "Decision": <pct>},
  "key_factors": ["factor1", "factor2", "factor3"],
  "analysis": "2-3 sentence sharp analysis of why this fighter wins"
}

Rules:
- confidence MAX is 76 — never exceed this
- LOCK = 65-76%, LEAN = 54-64%, TOSS-UP = 50-53%
- method_breakdown must sum to 100
- Be brutally honest, data-driven, no bias`;
}

// ── MAIN PREDICT FUNCTION ─────────────────────────────────
async function predictFight(fighter1, fighter2, stats = {}) {
  const prompt = buildPrompt(fighter1, fighter2, stats);

  // Try Ollama first (free, local, fast)
  const ollamaAvailable = await ollamaHealthCheck();

  if (ollamaAvailable) {
    try {
      console.log(`[LocalAI] Using ${OLLAMA_MODEL} for ${fighter1} vs ${fighter2}`);
      const raw = await ollamaRequest(prompt);

      // Extract JSON from response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const prediction = JSON.parse(jsonMatch[0]);
        // Hard cap confidence
        prediction.confidence = Math.min(Number(prediction.confidence), 76);
        prediction.source = 'ollama';
        prediction.model = OLLAMA_MODEL;
        return prediction;
      }
    } catch (err) {
      console.warn(`[LocalAI] Ollama failed: ${err.message}, falling back to Anthropic`);
    }
  }

  // Fallback to Anthropic
  return predictViaAnthropic(fighter1, fighter2, stats, prompt);
}

// ── ANTHROPIC FALLBACK ────────────────────────────────────
async function predictViaAnthropic(fighter1, fighter2, stats, prompt) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log(`[CloudAI] Using claude-sonnet-4-5 for ${fighter1} vs ${fighter2}`);

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Anthropic response');

  const prediction = JSON.parse(jsonMatch[0]);
  prediction.confidence = Math.min(Number(prediction.confidence), 76);
  prediction.source = 'anthropic';
  prediction.model = 'claude-sonnet-4-5';
  return prediction;
}

// ── PREDICT FULL CARD ─────────────────────────────────────
async function predictCard(fights) {
  const results = [];
  for (const fight of fights) {
    try {
      const pred = await predictFight(fight.fighter1, fight.fighter2, fight.stats || {});
      results.push({ ...fight, ...pred, predicted_at: new Date().toISOString() });
      // Small delay to avoid hammering local GPU
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`[Predict] Failed ${fight.fighter1} vs ${fight.fighter2}: ${err.message}`);
      results.push({ ...fight, error: err.message });
    }
  }
  return results;
}

// ── CLI USAGE ─────────────────────────────────────────────
if (require.main === module) {
  const [,, f1, f2] = process.argv;
  if (!f1 || !f2) {
    console.log('Usage: node local-predict.js "Fighter1" "Fighter2"');
    process.exit(1);
  }
  predictFight(f1, f2).then(r => {
    console.log('\n=== RUBAN PREDICTION ===');
    console.log(JSON.stringify(r, null, 2));
  }).catch(console.error);
}

module.exports = { predictFight, predictCard, ollamaHealthCheck };
