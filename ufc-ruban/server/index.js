// UFC Ruban — Express Server
// Auth, Stripe webhooks, predictions API, subscriber gating
// node server/index.js

const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { handleStripeWebhook, createCheckoutSession, createCustomerPortalSession } = require('./stripe');
const { getSubscriber, isProSubscriber } = require('./auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

// Stripe webhooks need raw body — must be before express.json()
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'ufc-ruban-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Static files
app.use(express.static(path.join(__dirname, '..', 'website')));

// ─────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────

// Check session status
app.get('/api/auth/status', (req, res) => {
  if (req.session.email) {
    const subscriber = getSubscriber(req.session.email);
    res.json({
      authenticated: true,
      email: req.session.email,
      tier: subscriber?.tier || 'free',
      isPro: isProSubscriber(req.session.email)
    });
  } else {
    res.json({ authenticated: false, tier: 'free', isPro: false });
  }
});

// Magic link login (simplified — generates token, real impl would email it)
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Check if subscriber exists
  const subscriber = getSubscriber(email);
  if (!subscriber) {
    return res.status(404).json({ error: 'No subscription found for this email. Subscribe first.' });
  }

  // In production: send magic link email. For now: direct session
  req.session.email = email;
  res.json({ success: true, tier: subscriber.tier });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// STRIPE ROUTES
// ─────────────────────────────────────────────

app.post('/api/subscribe', async (req, res) => {
  const { email, plan } = req.body; // plan: 'monthly' or 'yearly'
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const session = await createCheckoutSession(email, plan);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment setup failed. Try again.' });
  }
});

// ─────────────────────────────────────────────
// PREDICTIONS API
// ─────────────────────────────────────────────
const PREDICTIONS_PATH = path.join(__dirname, '..', 'website', 'predictions.json');

function loadPredictions() {
  if (!fs.existsSync(PREDICTIONS_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(PREDICTIONS_PATH, 'utf8'));
  } catch {
    return null;
  }
}

// Free tier: main event only (redacted)
app.get('/api/predictions/teaser', (req, res) => {
  const data = loadPredictions();
  if (!data) return res.json({ available: false });

  const mainEvent = (data.predictions || []).find(p => p.is_main_event) || data.predictions?.[0];
  if (!mainEvent) return res.json({ available: false });

  res.json({
    available: true,
    event_name: data.event_name,
    event_date: data.event_date,
    location: data.location,
    main_event: {
      fighter1: mainEvent.fighter1,
      fighter2: mainEvent.fighter2,
      weight_class: mainEvent.weight_class,
      winner: mainEvent.winner,
      tier: mainEvent.tier,
      // No confidence, no method, no analysis — that's Pro
    },
    total_fights: (data.predictions || []).length,
    locked: true
  });
});

// Pro tier: full card
app.get('/api/predictions/full', (req, res) => {
  if (!req.session.email || !isProSubscriber(req.session.email)) {
    return res.status(401).json({ error: 'Pro subscription required' });
  }

  const data = loadPredictions();
  if (!data) return res.json({ available: false });

  res.json(data);
});

// ─────────────────────────────────────────────
// Stripe Customer Portal — subscribers log in here
app.post('/api/auth/portal', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const session = await createCustomerPortalSession(email);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err.message);
    res.status(404).json({ error: err.message });
  }
});

// HISTORY API (public — shows recorded results)
// ─────────────────────────────────────────────
app.get('/api/history', (req, res) => {
  try {
    const rows = db.getPredictionHistory();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load history' });
  }
});

// ─────────────────────────────────────────────
// ACCURACY STATS API (public)
// ─────────────────────────────────────────────
app.get('/api/stats/accuracy', (req, res) => {
  try {
    const stats = db.getAccuracyStats();
    res.json(stats);
  } catch (err) {
    res.json({ overall: null, lock: null, lean: null, tossup: null });
  }
});

// ─────────────────────────────────────────────
// SERVE PAGES
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'website', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  // If coming from Stripe (subscribed=true), serve the page and let the frontend
  // show a login form — the webhook has already activated their subscription.
  if (req.query.subscribed === 'true') {
    return res.sendFile(path.join(__dirname, '..', 'website', 'dashboard.html'));
  }
  if (!req.session.email || !isProSubscriber(req.session.email)) {
    return res.redirect('/?upgrade=true');
  }
  res.sendFile(path.join(__dirname, '..', 'website', 'dashboard.html'));
});

app.get('/history', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'website', 'history.html'));
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`UFC Ruban server running on port ${PORT}`);
  console.log(`Predictions path: ${PREDICTIONS_PATH}`);
});

module.exports = app;

