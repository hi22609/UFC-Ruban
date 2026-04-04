// RUBAN Payment → Discord Workflow
// Triggered by Stripe webhook to grant Discord access

const discordBot = require('../discord-bot');
const fs = require('fs').promises;
const path = require('path');

const PENDING_FILE = path.join(__dirname, '..', 'pending-invites.json');

// Load pending invites
async function loadPending() {
  try {
    const data = await fs.readFile(PENDING_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { invites: [] };
  }
}

// Save pending invites
async function savePending(data) {
  await fs.writeFile(PENDING_FILE, JSON.stringify(data, null, 2));
}

// Process payment and grant access
async function processPayment(paymentData) {
  const { email, tier, stripeCustomerId, discordId } = paymentData;
  
  console.log(`💳 Processing payment for ${email} (${tier})`);
  
  if (discordId) {
    // User already linked Discord, grant access immediately
    const success = await discordBot.grantPremiumAccess(discordId, email, tier);
    
    if (success) {
      console.log(`✅ Granted Discord access to ${email}`);
      return { status: 'granted', discordId };
    } else {
      console.error(`❌ Failed to grant access to ${email}`);
      return { status: 'error', error: 'Failed to grant role' };
    }
  } else {
    // User needs to link Discord, save pending invite
    const pending = await loadPending();
    pending.invites.push({
      email,
      tier,
      stripeCustomerId,
      createdAt: new Date().toISOString(),
      status: 'pending_link'
    });
    await savePending(pending);
    
    console.log(`⏳ Saved pending invite for ${email}`);
    
    // In production: send email with Discord link instructions
    return {
      status: 'pending',
      message: 'Discord link required',
      inviteUrl: process.env.DISCORD_INVITE_URL
    };
  }
}

// Link Discord account to existing payment
async function linkDiscordAccount(email, discordId) {
  const pending = await loadPending();
  const invite = pending.invites.find(i => i.email === email && i.status === 'pending_link');
  
  if (!invite) {
    return { status: 'error', error: 'No pending invite found' };
  }
  
  // Grant access
  const success = await discordBot.grantPremiumAccess(discordId, email, invite.tier);
  
  if (success) {
    // Remove from pending
    invite.status = 'completed';
    invite.discordId = discordId;
    invite.completedAt = new Date().toISOString();
    await savePending(pending);
    
    console.log(`✅ Linked Discord ${discordId} to ${email}`);
    return { status: 'success', tier: invite.tier };
  } else {
    return { status: 'error', error: 'Failed to grant access' };
  }
}

// Cancel subscription workflow
async function cancelSubscription(email, discordId) {
  console.log(`🚫 Processing cancellation for ${email}`);
  
  if (discordId) {
    const success = await discordBot.revokePremiumAccess(discordId);
    
    if (success) {
      console.log(`✅ Revoked access for ${email}`);
      return { status: 'revoked' };
    }
  }
  
  return { status: 'no_action' };
}

module.exports = {
  processPayment,
  linkDiscordAccount,
  cancelSubscription
};
