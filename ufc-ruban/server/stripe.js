// UFC Ruban — Stripe Handler
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('./db');
const referral = require('./referral');

const PRICES = {
  sharp_monthly:  process.env.STRIPE_SHARP_MONTHLY_PRICE_ID  || process.env.STRIPE_PRO_PRICE_ID,
  sharp_yearly:   process.env.STRIPE_SHARP_YEARLY_PRICE_ID   || process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  capper_monthly: process.env.STRIPE_CAPPER_MONTHLY_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
  capper_yearly:  process.env.STRIPE_CAPPER_YEARLY_PRICE_ID  || process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  // Legacy fallbacks
  monthly: process.env.STRIPE_PRO_PRICE_ID,
  yearly:  process.env.STRIPE_PRO_YEARLY_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
};

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// ── CHECKOUT SESSION ─────────────────────────────────────
async function createCheckoutSession(email, plan = 'monthly', tier = 'sharp', refCode = null) {
  const key = `${tier}_${plan}`;
  const priceId = PRICES[key] || PRICES[plan] || PRICES.monthly;
  if (!priceId) throw new Error('Stripe price ID not configured. Check Railway env vars.');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/dashboard?subscribed=true`,
    cancel_url:  `${SITE_URL}/?cancelled=true`,
    metadata: { email, tier, plan, ref_code: refCode || '' },
    subscription_data: {
      metadata: { email, tier, ref_code: refCode || '' }
    },
    allow_promotion_codes: true,
  });

  return session;
}

// ── STRIPE CUSTOMER PORTAL (login via Stripe) ────────────
// Subscribers click "Log in" → we find their Stripe customer → redirect to portal
// Portal lets them manage billing, download invoices, cancel — all Stripe-hosted
async function createCustomerPortalSession(email) {
  // Search for customer by email
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (!customers.data.length) {
    throw new Error('No subscription found for this email. Please subscribe first.');
  }

  const customerId = customers.data[0].id;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${SITE_URL}/dashboard`,
  });

  return session;
}

// ── WEBHOOK ──────────────────────────────────────────────
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object;
      const email = session.metadata?.email || session.customer_email;
      const tier = session.metadata?.tier || 'sharp';
      if (email) {
        db.upsertSubscriber(email, tier, session.customer, 'active');
        console.log(`[Stripe] New ${tier} subscriber: ${email}`);
      }
      break;
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.paused': {
      const sub = event.data.object;
      const customer = await stripe.customers.retrieve(sub.customer);
      const email = customer.email;
      if (email) {
        db.updateSubscriberTier(email, 'free', 'cancelled');
        console.log(`[Stripe] Subscription cancelled: ${email}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      if (sub.status === 'active') {
        const customer = await stripe.customers.retrieve(sub.customer);
        const email = customer.email;
        const tier = sub.metadata?.tier || 'sharp';
        if (email) {
          db.updateSubscriberTier(email, tier, 'active');
          console.log(`[Stripe] Subscription updated: ${email} → ${tier}`);
        }
      }
      break;
    }

    default:
      break;
  }

  res.json({ received: true });
}

module.exports = { createCheckoutSession, createCustomerPortalSession, handleStripeWebhook };

