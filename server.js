/**
 * RUBAN Server - static site + safe API surface
 *
 * Canonical production path for the current live site.
 * Serves the static White House funnel and exposes lightweight APIs.
 * Stripe webhook remains disabled here until the payment flow is verified end-to-end.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEBSITE_DIR = path.join(__dirname, 'ufc-ruban/website');
const MEMORY_DIR = path.join(__dirname, '../memory');

app.use(express.static(WEBSITE_DIR));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ruban-static-site',
    timestamp: new Date().toISOString(),
    website_dir: WEBSITE_DIR,
    charts_available: fs.existsSync(path.join(WEBSITE_DIR, 'elite-dashboard.html')),
    stripe_mode: process.env.STRIPE_SECRET_KEY
      ? (process.env.STRIPE_SECRET_KEY.includes('_test_') ? 'test-configured' : 'configured')
      : 'not-configured'
  });
});

app.get('/api/predictions/teaser', async (req, res) => {
  res.json({
    available: true,
    event_name: 'UFC White House',
    event_date: 'April 19, 2026',
    message: 'Structured event teaser live. Full card remains gated.',
    main_event: {
      fighter1: 'Ilia Topuria',
      fighter2: 'Justin Gaethje',
      lean: 'Ilia Topuria',
      confidence: 68,
      volatility: 'MEDIUM'
    }
  });
});

app.get('/api/charts/status', (req, res) => {
  res.json({
    page_available: fs.existsSync(path.join(WEBSITE_DIR, 'elite-dashboard.html')),
    discord_chart_posting_ready: fs.existsSync(path.join(__dirname, 'ruban-server/discord-chart-poster.js')),
    note: 'Charts are accessible on-site. Discord posting script is prepared pending live data wiring.'
  });
});

app.post('/api/stripe/webhook', (req, res) => {
  res.status(503).json({
    error: 'Stripe webhook not active on this production path yet.',
    message: 'Payment flow is being finalized before activation.'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(WEBSITE_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 RUBAN Static Site Running');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Website dir: ${WEBSITE_DIR}`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Charts: http://localhost:${PORT}/elite-dashboard.html`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

module.exports = app;
