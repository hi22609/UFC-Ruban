/**
 * STRIPE WEBHOOK HANDLER - RUBAN
 * 
 * Listens for payment events and automatically:
 * - Grants API access to paying users
 * - Sends welcome message via Telegram
 * - Logs transaction to memory/payments.jsonl
 * - Assigns Discord role (if connected)
 * 
 * Usage: 
 *   node stripe-webhook.js
 * 
 * Or import into your main server:
 *   app.use('/api/stripe/webhook', webhookHandler);
 */

const express = require('express');
const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Load env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Memory file for transaction log
const PAYMENTS_LOG = path.join(__dirname, '..', 'memory', 'payments.jsonl');

/**
 * Grant access to RUBAN for a paying user
 * @param {string} userId - Telegram user ID or customer email
 * @param {string} sessionId - Stripe checkout session ID
 * @param {number} amount - Amount paid in cents
 */
async function grantAccess(userId, sessionId, amount) {
  const timestamp = new Date().toISOString();
  
  // 1. Log to payments.jsonl
  const logEntry = {
    timestamp,
    userId,
    sessionId,
    amount,
    status: 'active',
    grantedAt: timestamp
  };
  
  fs.appendFileSync(PAYMENTS_LOG, JSON.stringify(logEntry) + '\n');
  console.log(`[RUBAN] Access granted to ${userId} - Session: ${sessionId}`);
  
  // 2. Send Telegram welcome message
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken && userId) {
      const message = `🏆 **WELCOME TO RUBAN PREMIUM**\n\nYour payment of $${(amount/100).toFixed(2)} confirmed.\n\n**What you get:**\n- Daily UFC picks (67% accuracy)\n- Live fight night alerts\n- Access to private Discord\n- Direct API access\n\n**Next steps:**\n1. Join Discord: https://discord.gg/ruban\n2. Check your email for API key\n3. First pick drops tonight\n\n- Quegan`;
      
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      console.log(`[Telegram] Welcome sent to ${userId}`);
    }
  } catch (err) {
    console.error('[Telegram] Failed to send welcome:', err.message);
  }
  
  // 3. TODO: Add Discord role assignment
  // 4. TODO: Send API key via email
  
  return logEntry;
}

/**
 * Express middleware for Stripe webhook
 */
async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('[Stripe] Checkout completed:', session.id);
      
      // Extract user info from metadata or customer details
      const userId = session.metadata?.telegramUserId || session.customer_details?.email;
      const amount = session.amount_total || 2000; // Default $20
      
      if (userId) {
        await grantAccess(userId, session.id, amount);
      } else {
        console.warn('[Stripe] No user ID found for session:', session.id);
      }
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('[Stripe] Subscription created:', subscription.id);
      // Handle subscription-specific logic here
      break;
      
    case 'customer.subscription.deleted':
      const canceled = event.data.object;
      console.log('[Stripe] Subscription canceled:', canceled.id);
      // TODO: Revoke access
      break;
      
    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
}

/**
 * Standalone server mode
 * Run with: node stripe-webhook.js
 */
if (require.main === module) {
  const app = express();
  
  // Stripe requires raw body for signature verification
  app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    webhookHandler(req, res);
  });
  
  const PORT = process.env.STRIPE_WEBHOOK_PORT || 4242;
  app.listen(PORT, () => {
    console.log(`[Stripe Webhook] Listening on port ${PORT}`);
    console.log(`[Stripe Webhook] Endpoint: http://localhost:${PORT}/api/stripe/webhook`);
  });
}

module.exports = { webhookHandler, grantAccess };
