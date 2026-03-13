// UFC Ruban — Stripe Handler
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('./db');

const PRICES = {
  monthly: process.env.STRIPE_PRO_PRICE_ID,
  yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
};

async function createCheckoutSession(email, plan = 'monthly') {
  const priceId = PRICES[plan] || PRICES.monthly;
  if (!priceId) throw new Error('STRIPE_PRO_PRICE_ID not configured in .env');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.SITE_URL || 'http://localhost:3000'}/dashboard?subscribed=true`,
    cancel_url: `${process.env.SITE_URL || 'http://localhost:3000'}/?cancelled=true`,
    metadata: { email },
  });

  return session;
}

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
      if (email) {
        db.upsertSubscriber(email, 'pro', session.customer, 'active');
        console.log(`[Stripe] New Pro subscriber: ${email}`);
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
        if (email) {
          db.updateSubscriberTier(email, 'pro', 'active');
          console.log(`[Stripe] Subscription reactivated: ${email}`);
        }
      }
      break;
    }

    default:
      // Unhandled events — ok
  }

  res.json({ received: true });
}

module.exports = { createCheckoutSession, handleStripeWebhook };
