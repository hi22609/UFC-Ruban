// UFC Ruban — SQLite DB helpers for server
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'ufc.db');
let sqlite3;

// Graceful fallback if better-sqlite3 fails to compile
try {
  sqlite3 = require('better-sqlite3');
} catch (e) {
  console.warn('better-sqlite3 unavailable, using in-memory store:', e.message);
  sqlite3 = null;
}

// In-memory fallback store
const memStore = {
  subscribers: {},
  predictions: []
};

function getDb() {
  if (!sqlite3) return null;
  // Ensure directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = sqlite3(DB_PATH);

  // Create tables if not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      email TEXT PRIMARY KEY,
      tier TEXT DEFAULT 'free',
      stripe_customer_id TEXT,
      subscription_status TEXT DEFAULT 'inactive',
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS prediction_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT,
      fighter1 TEXT,
      fighter2 TEXT,
      predicted_winner TEXT,
      actual_winner TEXT,
      confidence INTEGER,
      tier TEXT,
      correct INTEGER,
      predicted_at TEXT
    );
  `);

  return db;
}

function getSubscriberByEmail(email) {
  const db = getDb();
  if (!db) return memStore.subscribers[email] || null;
  const row = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email);
  db.close();
  return row || null;
}

function upsertSubscriber(email, tier, stripeCustomerId, status) {
  const db = getDb();
  const now = new Date().toISOString();

  if (!db) {
    memStore.subscribers[email] = { email, tier, stripe_customer_id: stripeCustomerId, subscription_status: status, updated_at: now };
    return;
  }

  db.prepare(`
    INSERT INTO subscribers (email, tier, stripe_customer_id, subscription_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      tier = excluded.tier,
      stripe_customer_id = excluded.stripe_customer_id,
      subscription_status = excluded.subscription_status,
      updated_at = excluded.updated_at
  `).run(email, tier, stripeCustomerId, status, now, now);
  db.close();
}

function updateSubscriberTier(email, tier, status) {
  const db = getDb();
  if (!db) {
    if (memStore.subscribers[email]) {
      memStore.subscribers[email].tier = tier;
      memStore.subscribers[email].subscription_status = status;
    }
    return;
  }
  db.prepare(`
    UPDATE subscribers SET tier = ?, subscription_status = ?, updated_at = ?
    WHERE email = ?
  `).run(tier, status, new Date().toISOString(), email);
  db.close();
}

function getAccuracyStats() {
  const db = getDb();
  if (!db) return { overall: { total: 0, wins: 0, pct: null }, lock: { total: 0, wins: 0, pct: null }, lean: { total: 0, wins: 0, pct: null }, tossup: { total: 0, wins: 0, pct: null } };

  const overall = db.prepare(`
    SELECT COUNT(*) as total, SUM(correct) as wins
    FROM prediction_results WHERE actual_winner IS NOT NULL
  `).get();

  const byTier = {};
  for (const tier of ['LOCK', 'LEAN', 'TOSS-UP']) {
    const row = db.prepare(`
      SELECT COUNT(*) as total, SUM(correct) as wins
      FROM prediction_results WHERE tier = ? AND actual_winner IS NOT NULL
    `).get(tier);
    byTier[tier.toLowerCase().replace('-', '')] = {
      total: row.total || 0,
      wins: row.wins || 0,
      pct: row.total > 0 ? Math.round((row.wins / row.total) * 100) : null
    };
  }

  db.close();
  return {
    overall: { total: overall.total || 0, wins: overall.wins || 0, pct: overall.total > 0 ? Math.round((overall.wins / overall.total) * 100) : null },
    ...byTier
  };
}

function getPredictionHistory() {
  const db = getDb();
  if (!db) return memStore.predictions;
  const rows = db.prepare(`
    SELECT event_name, fighter1, fighter2, predicted_winner, actual_winner,
           confidence, tier, correct, predicted_at
    FROM prediction_results
    ORDER BY predicted_at DESC
    LIMIT 200
  `).all();
  db.close();
  return rows;
}

module.exports = { getSubscriberByEmail, upsertSubscriber, updateSubscriberTier, getAccuracyStats, getPredictionHistory };
