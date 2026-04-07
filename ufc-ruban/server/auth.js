// UFC Ruban — Auth helpers
const db = require('./db');

function getSubscriber(email) {
  return db.getSubscriberByEmail(email);
}

function isProSubscriber(email) {
  const sub = getSubscriber(email);
  return sub && sub.tier === 'pro' && sub.subscription_status === 'active';
}

module.exports = { getSubscriber, isProSubscriber };
