/**
 * RUBAN Server - Express + Stripe Webhook
 * 
 * This server:
 * 1. Serves the static website (ufc-ruban/website/)
 * 2. Handles Stripe payment webhooks
 * 3. Provides API endpoints for predictions
 * 
 * Deploy to Railway: 
 *   - Root Directory: ruban-server
 *   - Build Command: npm install
 *   - Start Command: node server.js
 */

const express = require('express');
const path = require('path');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3000;

// Serve static files from the website
app.use(express.static(path.join(__dirname, '../ufc-ruban/website')));

// Parse JSON for API routes
app.use(express.json());

// STRIPE WEBHOOK ROUTE
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 Payment received:', session.id);
        
        // Log to payments.jsonl
        const fs = require('fs');
        const logPath = path.join(__dirname, '../memory/payments.jsonl');
        const logEntry = {
          timestamp: new Date().toISOString(),
          sessionId: session.id,
          amount: session.amount_total,
          customer: session.customer_details?.email,
          status: 'active'
        };
        fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        
        // TODO: Send welcome message, grant access, etc.
        break;
        
      default:
        console.log(`Unhandled event: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// API endpoint for predictions (proxy to your main API)
app.get('/api/predictions/teaser', async (req, res) => {
  try {
    // TODO: Fetch from your main RUBAN API
    res.json({
      available: true,
      event_name: 'UFC Fight Night',
      event_date: new Date().toLocaleDateString(),
      main_event: {
        fighter1: 'Ilia Topuria',
        fighter2: 'Justin Gaethje',
        winner: 'Ilia Topuria',
        tier: 'LEAN',
        weight_class: 'Lightweight'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RUBAN Server running on port ${PORT}`);
  console.log(`📍 Website: http://localhost:${PORT}`);
  console.log(`💳 Webhook: http://localhost:${PORT}/api/stripe/webhook`);
});

module.exports = app;
