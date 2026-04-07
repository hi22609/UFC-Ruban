/**
 * RUBAN Model Benchmarking System
 * Tests all available Ollama models with UFC prediction prompts
 * Measures: response time, JSON validity, prediction quality
 * Auto-selects the best performing model
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { listOllamaModels } = require('./model-manager');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const BENCHMARK_FILE = path.join(__dirname, '.benchmark-results.json');

// Test fight for benchmarking
const TEST_FIGHT = {
  fighter1: 'Alex Pereira',
  fighter2: 'Jan Blachowicz',
  stats: {
    weightClass: 'Light Heavyweight',
    f1Record: '11-2-0',
    f2Record: '29-10-1',
    f1Reach: '79"',
    f2Reach: '78"',
    f1StrikeAcc: '58%',
    f2StrikeAcc: '49%'
  }
};

// ── BUILD TEST PROMPT ─────────────────────────────────────
function buildTestPrompt() {
  const { fighter1, fighter2, stats } = TEST_FIGHT;
  return `You are RUBAN, an elite UFC prediction system. Analyze this fight with precision.

FIGHT: ${fighter1} vs ${fighter2}
WEIGHT CLASS: ${stats.weightClass}
${fighter1} record: ${stats.f1Record}
${fighter2} record: ${stats.f2Record}
${fighter1} reach: ${stats.f1Reach}
${fighter2} reach: ${stats.f2Reach}
${fighter1} striking accuracy: ${stats.f1StrikeAcc}
${fighter2} striking accuracy: ${stats.f2StrikeAcc}

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

// ── OLLAMA GENERATION REQUEST ─────────────────────────────
function ollamaGenerate(model, prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.1,
        top_p: 0.85,
        top_k: 40,
        num_predict: 800,
        repeat_penalty: 1.4,
        stop: ["\n\n\n", "```", "Human:", "User:"],
        ...options
      }
    });

    const startTime = Date.now();

    const req = http.request({
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 120000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({
            response: parsed.response || '',
            responseTime,
            totalDuration: parsed.total_duration || 0
          });
        } catch (e) {
          reject(new Error('Ollama parse error: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(body);
    req.end();
  });
}

// ── VALIDATE JSON OUTPUT ──────────────────────────────────
function validatePrediction(text) {
  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { valid: false, error: 'No JSON found in response' };
    }

    const prediction = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    const required = ['winner', 'confidence', 'tier', 'method', 'method_breakdown', 'key_factors', 'analysis'];
    const missing = required.filter(f => !(f in prediction));
    if (missing.length > 0) {
      return { valid: false, error: `Missing fields: ${missing.join(', ')}` };
    }

    // Validate data types and ranges
    if (typeof prediction.confidence !== 'number' || prediction.confidence < 50 || prediction.confidence > 76) {
      return { valid: false, error: `Invalid confidence: ${prediction.confidence}` };
    }

    if (!['LOCK', 'LEAN', 'TOSS-UP'].includes(prediction.tier)) {
      return { valid: false, error: `Invalid tier: ${prediction.tier}` };
    }

    const breakdownSum = Object.values(prediction.method_breakdown).reduce((a, b) => a + b, 0);
    if (Math.abs(breakdownSum - 100) > 0.1) {
      return { valid: false, error: `method_breakdown doesn't sum to 100 (got ${breakdownSum})` };
    }

    return { valid: true, prediction, jsonText: jsonMatch[0] };
  } catch (e) {
    return { valid: false, error: 'JSON parse error: ' + e.message };
  }
}

// ── SCORE PREDICTION QUALITY ──────────────────────────────
function scorePrediction(validation) {
  if (!validation.valid) return 0;

  const pred = validation.prediction;
  let score = 100; // Start at 100, deduct for issues

  // Check for repeat/garbage text
  const text = validation.jsonText.toLowerCase();
  if (text.includes('human:') || text.includes('user:') || text.includes('assistant:')) {
    score -= 20;
  }

  // Check key_factors quality
  if (!Array.isArray(pred.key_factors) || pred.key_factors.length < 2) {
    score -= 15;
  }

  // Check analysis quality (not empty, reasonable length)
  if (!pred.analysis || pred.analysis.length < 50) {
    score -= 15;
  }

  // Check if winner matches one of the fighters
  const { fighter1, fighter2 } = TEST_FIGHT;
  if (pred.winner !== fighter1 && pred.winner !== fighter2) {
    score -= 25;
  }

  // Bonus for good tier/confidence alignment
  if (pred.tier === 'LOCK' && pred.confidence >= 65 && pred.confidence <= 76) {
    score += 10;
  } else if (pred.tier === 'LEAN' && pred.confidence >= 54 && pred.confidence < 65) {
    score += 10;
  } else if (pred.tier === 'TOSS-UP' && pred.confidence >= 50 && pred.confidence < 54) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

// ── BENCHMARK A SINGLE MODEL ──────────────────────────────
async function benchmarkModel(model) {
  console.log(`\n[Benchmark] Testing ${model}...`);
  
  try {
    const prompt = buildTestPrompt();
    const result = await ollamaGenerate(model, prompt);
    
    const validation = validatePrediction(result.response);
    const qualityScore = scorePrediction(validation);

    const benchmark = {
      model,
      success: validation.valid,
      responseTime: result.responseTime,
      qualityScore,
      error: validation.error || null,
      timestamp: new Date().toISOString()
    };

    if (validation.valid) {
      console.log(`  ✓ Valid JSON output`);
      console.log(`  ⏱️  Response time: ${result.responseTime}ms`);
      console.log(`  📊 Quality score: ${qualityScore}/100`);
    } else {
      console.log(`  ✗ Failed: ${validation.error}`);
    }

    return benchmark;
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    return {
      model,
      success: false,
      responseTime: 0,
      qualityScore: 0,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

// ── BENCHMARK ALL MODELS ──────────────────────────────────
async function benchmarkAll() {
  console.log('=== RUBAN MODEL BENCHMARKING ===');
  console.log(`Test fight: ${TEST_FIGHT.fighter1} vs ${TEST_FIGHT.fighter2}`);
  
  try {
    const models = await listOllamaModels();
    console.log(`Found ${models.length} Ollama models: ${models.join(', ')}`);

    const results = [];
    for (const model of models) {
      const benchmark = await benchmarkModel(model);
      results.push(benchmark);
      // Delay between tests to avoid overload
      await new Promise(r => setTimeout(r, 2000));
    }

    // Sort by quality (success first, then by score and speed)
    results.sort((a, b) => {
      if (a.success !== b.success) return b.success - a.success;
      if (a.qualityScore !== b.qualityScore) return b.qualityScore - a.qualityScore;
      return a.responseTime - b.responseTime;
    });

    // Save results
    const benchmarkData = {
      results,
      best: results.find(r => r.success) || null,
      benchmarked_at: new Date().toISOString(),
      test_fight: TEST_FIGHT
    };

    fs.writeFileSync(BENCHMARK_FILE, JSON.stringify(benchmarkData, null, 2));
    console.log(`\n✓ Benchmark results saved to ${BENCHMARK_FILE}`);

    return benchmarkData;
  } catch (err) {
    console.error(`Benchmark failed: ${err.message}`);
    throw err;
  }
}

// ── GET BEST MODEL FROM BENCHMARK ─────────────────────────
function getBestFromBenchmark() {
  try {
    if (!fs.existsSync(BENCHMARK_FILE)) {
      throw new Error('No benchmark results found. Run benchmark first.');
    }
    const data = JSON.parse(fs.readFileSync(BENCHMARK_FILE, 'utf8'));
    return data.best;
  } catch (err) {
    console.error(`Failed to load benchmark: ${err.message}`);
    return null;
  }
}

// ── CLI INTERFACE ─────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--get-best')) {
    const best = getBestFromBenchmark();
    if (best) {
      console.log('Best model:', best.model);
      console.log('Quality score:', best.qualityScore);
      console.log('Response time:', best.responseTime + 'ms');
    } else {
      console.log('No benchmark results available');
    }
  } else {
    benchmarkAll().then(data => {
      console.log('\n=== RESULTS SUMMARY ===');
      data.results.forEach((r, i) => {
        const badge = i === 0 ? '🏆' : r.success ? '✓' : '✗';
        console.log(`${badge} ${r.model}: ${r.success ? `${r.qualityScore}/100 (${r.responseTime}ms)` : r.error}`);
      });
      if (data.best) {
        console.log(`\n🏆 WINNER: ${data.best.model}`);
      }
    }).catch(err => {
      console.error('ERROR:', err.message);
      process.exit(1);
    });
  }
}

module.exports = { benchmarkModel, benchmarkAll, getBestFromBenchmark, validatePrediction };
