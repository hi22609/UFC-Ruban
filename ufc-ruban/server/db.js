// UFC Ruban — SQLite DB helpers for server
const path = require('path');
const sqlite3 = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', 'database', 'ufc.db');

function getDb() {
  return sqlite3(DB_PATH);
}

function getSubscriberByEmail(email) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email);
  db.close();
  return row || null;
}

function upsertSubscriber(email, tier, stripeCustomerId, status) {
  const db = getDb();
  const now = new Date().toISOString();
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
  db.prepare(`
    UPDATE subscribers SET tier = ?, subscription_status = ?, updated_at = ?
    WHERE email = ?
  `).run(tier, status, new Date().toISOString(), email);
  db.close();
}

function getAccuracyStats() {
  const db = getDb();

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
    overall: {
      total: overall.total || 0,
      wins: overall.wins || 0,
      pct: overall.total > 0 ? Math.round((overall.wins / overall.total) * 100) : null
    },
    ...byTier
  };
}

module.exports = {
  getSubscriberByEmail,
  upsertSubscriber,
  updateSubscriberTier,
  getAccuracyStats
};
