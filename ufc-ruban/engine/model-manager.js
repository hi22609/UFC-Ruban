/**
 * RUBAN Model Manager
 * Automatically selects the best available model for predictions
 * Falls back through: deepseek-r1:8b → phi4:14b → qwen3.5 → claude-sonnet-4-5
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const CACHE_FILE = path.join(__dirname, '.model-cache.json');

// Model fallback chain (in priority order)
const MODEL_CHAIN = [
  { name: 'deepseek-r1:8b', type: 'ollama', reasoning: 'best', size: '5GB' },
  { name: 'phi4:14b', type: 'ollama', reasoning: 'excellent', size: '9GB' },
  { name: 'qwen2.5:14b', type: 'ollama', reasoning: 'good', size: '9GB' },
  { name: 'qwen3.5', type: 'ollama', reasoning: 'good', size: '6.6GB' },
  { name: 'claude-sonnet-4-5', type: 'anthropic', reasoning: 'premium', size: 'cloud' }
];

// ── LIST AVAILABLE OLLAMA MODELS ──────────────────────────
async function listOllamaModels() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Ollama API returned ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const models = (parsed.models || []).map(m => m.name);
          resolve(models);
        } catch (e) {
          reject(new Error('Failed to parse Ollama response: ' + e.message));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Ollama connection timeout'));
    });
  });
}

// ── CHECK IF ANTHROPIC IS AVAILABLE ───────────────────────
function isAnthropicAvailable() {
  return !!process.env.ANTHROPIC_API_KEY;
}

// ── SELECT BEST MODEL FROM FALLBACK CHAIN ─────────────────
async function selectBestModel() {
  try {
    const ollamaModels = await listOllamaModels();
    console.log(`[ModelManager] Available Ollama models: ${ollamaModels.join(', ')}`);

    // Check fallback chain in order
    for (const candidate of MODEL_CHAIN) {
      if (candidate.type === 'ollama') {
        // Check if model exists in Ollama
        const exists = ollamaModels.some(m => m.startsWith(candidate.name.split(':')[0]));
        if (exists) {
          console.log(`[ModelManager] Selected: ${candidate.name} (${candidate.reasoning} reasoning, ${candidate.size})`);
          return { model: candidate.name, type: 'ollama', info: candidate };
        }
      } else if (candidate.type === 'anthropic') {
        if (isAnthropicAvailable()) {
          console.log(`[ModelManager] Selected: ${candidate.name} (fallback to cloud)`);
          return { model: candidate.name, type: 'anthropic', info: candidate };
        }
      }
    }

    throw new Error('No available models found in fallback chain');
  } catch (err) {
    console.warn(`[ModelManager] Ollama unavailable: ${err.message}`);
    if (isAnthropicAvailable()) {
      console.log(`[ModelManager] Selected: claude-sonnet-4-5 (fallback to cloud)`);
      return { model: 'claude-sonnet-4-5', type: 'anthropic', info: MODEL_CHAIN[MODEL_CHAIN.length - 1] };
    }
    throw new Error('No prediction models available (Ollama offline, no Anthropic key)');
  }
}

// ── CACHE WORKING MODEL ───────────────────────────────────
function cacheWorkingModel(modelInfo) {
  try {
    const cache = {
      model: modelInfo.model,
      type: modelInfo.type,
      cached_at: new Date().toISOString(),
      info: modelInfo.info
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.warn(`[ModelManager] Failed to cache model: ${err.message}`);
  }
}

// ── LOAD CACHED MODEL ─────────────────────────────────────
function loadCachedModel() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      // Cache valid for 24 hours
      const ageMs = Date.now() - new Date(cache.cached_at).getTime();
      if (ageMs < 24 * 60 * 60 * 1000) {
        return cache;
      }
    }
  } catch (err) {
    console.warn(`[ModelManager] Failed to load cache: ${err.message}`);
  }
  return null;
}

// ── GET BEST MODEL (WITH CACHING) ─────────────────────────
async function getBestModel(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = loadCachedModel();
    if (cached) {
      console.log(`[ModelManager] Using cached model: ${cached.model} (type: ${cached.type})`);
      return cached;
    }
  }

  const selected = await selectBestModel();
  cacheWorkingModel(selected);
  return selected;
}

// ── CLI INTERFACE ─────────────────────────────────────────
if (require.main === module) {
  const forceRefresh = process.argv.includes('--refresh');
  
  getBestModel(forceRefresh).then(result => {
    console.log('\n=== RUBAN MODEL SELECTION ===');
    console.log(`Model: ${result.model}`);
    console.log(`Type: ${result.type}`);
    console.log(`Reasoning: ${result.info.reasoning}`);
    console.log(`Size: ${result.info.size}`);
    console.log(`Cached at: ${result.cached_at || 'just now'}`);
  }).catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
  });
}

module.exports = { getBestModel, selectBestModel, listOllamaModels, MODEL_CHAIN };
