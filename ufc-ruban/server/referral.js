// UFC Ruban — Referral & Commission System
// Affiliates get a unique code → user signs up with code → affiliate earns 20% recurring

const db = require('./db');
const crypto = require('crypto');

const COMMISSION_RATE = 0.20; // 20% of subscription revenue

// ── GENERATE REFERRAL CODE ───────────────────────────────
function generateCode(name) {
  const base = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${base}-${suffix}`;
}

// ── CREATE AFFILIATE ─────────────────────────────────────
function createAffiliate(name, email, paypalEmail) {
  const d = db.getDb();
  if (!d) return null;

  d.exec(`
    CREATE TABLE IF NOT EXISTS affiliates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      paypal_email TEXT,
      code TEXT UNIQUE NOT NULL,
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      total_earned REAL DEFAULT 0,
      paid_out REAL DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS referral_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      subscriber_email TEXT NOT NULL,
      plan TEXT,
      amount_usd REAL,
      commission_usd REAL,
      stripe_invoice_id TEXT,
      paid INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const code = generateCode(name);
  try {
    d.prepare(`
      INSERT INTO affiliates (name, email, paypal_email, code)
      VALUES (?, ?, ?, ?)
    `).run(name, email, paypalEmail || email, code);
    d.close();
    return code;
  } catch (e) {
    d.close();
    if (e.message.includes('UNIQUE')) return getAffiliateCode(email);
    throw e;
  }
}

// ── GET AFFILIATE BY CODE ─────────────────────────────────
function getAffiliate(code) {
  const d = db.getDb();
  if (!d) return null;
  try {
    const row = d.prepare('SELECT * FROM affiliates WHERE code = ? AND active = 1').get(code);
    d.close();
    return row;
  } catch { d.close(); return null; }
}

function getAffiliateCode(email) {
  const d = db.getDb();
  if (!d) return null;
  try {
    const row = d.prepare('SELECT code FROM affiliates WHERE email = ?').get(email);
    d.close();
    return row?.code || null;
  } catch { d.close(); return null; }
}

// ── TRACK CLICK ──────────────────────────────────────────
function trackClick(code) {
  const d = db.getDb();
  if (!d) return;
  try {
    d.prepare('UPDATE affiliates SET clicks = clicks + 1 WHERE code = ?').run(code);
    d.close();
  } catch { d.close(); }
}

// ── RECORD CONVERSION ────────────────────────────────────
function recordConversion(code, subscriberEmail, plan, amountUsd, stripeInvoiceId) {
  const d = db.getDb();
  if (!d) return;
  try {
    const commission = Math.round(amountUsd * COMMISSION_RATE * 100) / 100;
    d.prepare(`
      INSERT INTO referral_events (code, subscriber_email, plan, amount_usd, commission_usd, stripe_invoice_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(code, subscriberEmail, plan, amountUsd, commission, stripeInvoiceId || '');
    d.prepare(`
      UPDATE affiliates SET conversions = conversions + 1, total_earned = total_earned + ?
      WHERE code = ?
    `).run(commission, code);
    d.close();
    console.log(`[Referral] ${code} earned $${commission} from ${subscriberEmail}`);
  } catch (e) { d.close(); console.error('[Referral] Error:', e.message); }
}

// ── GET AFFILIATE STATS ──────────────────────────────────
function getAffiliateStats(code) {
  const d = db.getDb();
  if (!d) return null;
  try {
    const affiliate = d.prepare('SELECT * FROM affiliates WHERE code = ?').get(code);
    if (!affiliate) { d.close(); return null; }
    const events = d.prepare('SELECT * FROM referral_events WHERE code = ? ORDER BY created_at DESC LIMIT 50').all(code);
    d.close();
    return {
      ...affiliate,
      pending_payout: affiliate.total_earned - affiliate.paid_out,
      recent_events: events
    };
  } catch { d.close(); return null; }
}

// ── LIST ALL AFFILIATES (admin) ──────────────────────────
function listAffiliates() {
  const d = db.getDb();
  if (!d) return [];
  try {
    const rows = d.prepare('SELECT * FROM affiliates ORDER BY total_earned DESC').all();
    d.close();
    return rows;
  } catch { d.close(); return []; }
}

module.exports = {
  createAffiliate,
  getAffiliate,
  trackClick,
  recordConversion,
  getAffiliateStats,
  listAffiliates,
  COMMISSION_RATE
};
