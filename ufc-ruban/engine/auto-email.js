/**
 * RUBAN Auto Email
 * Sends fight night picks to Pro subscribers via AgentMail API
 * Rate limit: 1 email/second
 */

const https = require('https');
const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const AGENTMAIL_TOKEN = process.env.AGENTMAIL_TOKEN || 'am_us_2c3b1a03e927a9d8441e4fcbc4e73ac29fe5a25062f58fff69e5e34fbaa626a4';
const AGENTMAIL_INBOX = 'ruban@agentmail.to';
const SITE_URL = process.env.SITE_URL || 'https://ruban.gg';

// ── SUBSCRIBER SOURCE ─────────────────────────────────────
let getProSubscribers;
try {
  getProSubscribers = require('./db').getProSubscribers;
} catch {
  getProSubscribers = () => {
    console.error('[Email] db.js not found — no subscribers loaded');
    return [];
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── EMAIL HTML ────────────────────────────────────────────
function buildEmailHTML(data) {
  const main = (data.predictions || []).find(p => p.is_main_event) || data.predictions?.[0];
  const picks = (data.predictions || []).slice(0, 10);
  const te = { LOCK: '🔒', LEAN: '⚡', 'TOSS-UP': '🎲' };

  const picksRows = picks.map(p => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a2e;font-size:13px;">${p.fighter1} vs ${p.fighter2}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a2e;font-size:13px;color:#e74c3c;font-weight:600;">${p.winner}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a2e;font-size:12px;color:#888;">${te[p.tier] || ''} ${p.tier}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a2e;font-size:12px;color:#c9a84c;">${p.confidence ? p.confidence + '%' : '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a2e;font-size:12px;color:#888;">${p.method || 'Decision'}</td>
    </tr>`).join('');

  const parlaySection = data.parlay ? `
    <div style="background:#0f0f12;border:1px solid #1a1a2e;border-radius:8px;padding:24px;margin:24px 0;">
      <p style="font-family:monospace;font-size:10px;color:#c9a84c;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">💰 Parlay Builder</p>
      ${data.parlay.two_leg ? `<p style="margin:0 0 8px;font-size:13px;"><strong>2-Leg (${data.parlay.two_leg.combined_confidence}% avg):</strong> ${data.parlay.two_leg.picks.join(' + ')}</p>` : ''}
      ${data.parlay.three_leg ? `<p style="margin:0;font-size:13px;"><strong>3-Leg (${data.parlay.three_leg.combined_confidence}% avg):</strong> ${data.parlay.three_leg.picks.join(' + ')}</p>` : ''}
    </div>` : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#f2f2f4;">
  <div style="max-width:620px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;padding:32px 0;border-bottom:2px solid #e74c3c;margin-bottom:32px;">
      <h1 style="font-size:30px;letter-spacing:4px;margin:0;font-family:Georgia,serif;">
        UFC <span style="color:#e74c3c;">RUBAN</span>
      </h1>
      <p style="font-family:monospace;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:2px;margin:8px 0 0;">
        Fight Night Intelligence
      </p>
    </div>

    <!-- Event -->
    <h2 style="font-size:22px;margin:0 0 4px;">${data.event_name}</h2>
    <p style="font-family:monospace;font-size:11px;color:#888;margin:0 0 32px;">
      ${data.event_date} | ${data.location || 'UFC Apex'}
    </p>

    ${main ? `
    <!-- Main event highlight -->
    <div style="background:#1a1a2e;border-left:4px solid #e74c3c;border-radius:0 8px 8px 0;padding:24px;margin-bottom:32px;">
      <p style="font-family:monospace;font-size:9px;color:#e74c3c;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Main Event Pick</p>
      <h3 style="font-size:18px;margin:0 0 10px;">${main.fighter1} vs ${main.fighter2}</h3>
      <p style="font-size:20px;font-weight:700;color:#e74c3c;margin:0 0 6px;">${main.winner}</p>
      <p style="font-family:monospace;font-size:11px;color:#888;margin:0;">
        ${te[main.tier] || ''} ${main.tier} | ${main.method || 'Decision'} | ${main.confidence ? main.confidence + '%' : '—'}
      </p>
    </div>` : ''}

    <!-- Full card table -->
    <p style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#888;margin:0 0 12px;">
      Full Card Predictions
    </p>
    <table style="width:100%;border-collapse:collapse;background:#0f0f12;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#1a1a2e;">
          <th style="padding:10px 16px;text-align:left;font-family:monospace;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;">Matchup</th>
          <th style="padding:10px 16px;text-align:left;font-family:monospace;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;">Pick</th>
          <th style="padding:10px 16px;text-align:left;font-family:monospace;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;">Tier</th>
          <th style="padding:10px 16px;text-align:left;font-family:monospace;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;">Conf</th>
          <th style="padding:10px 16px;text-align:left;font-family:monospace;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;">Method</th>
        </tr>
      </thead>
      <tbody>${picksRows}</tbody>
    </table>

    ${parlaySection}

    <!-- CTA -->
    <div style="text-align:center;margin:40px 0;">
      <a href="${SITE_URL}" style="display:inline-block;background:#e74c3c;color:#fff;text-decoration:none;padding:14px 32px;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-radius:4px;">
        Full Analysis →
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a2e;padding-top:24px;text-align:center;">
      <p style="font-family:monospace;font-size:10px;color:#555;margin:0 0 6px;">RUBAN UFC Intelligence | ${SITE_URL}</p>
      <p style="font-family:monospace;font-size:9px;color:#444;margin:0 0 6px;">For entertainment only. Always gamble responsibly.</p>
      <p style="font-family:monospace;font-size:9px;color:#333;margin:0;">
        You're receiving this as a Pro subscriber.
        <a href="${SITE_URL}/unsubscribe" style="color:#555;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ── AGENTMAIL API ─────────────────────────────────────────
function sendEmail(to, subject, html) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ to, subject, html });
    const options = {
      hostname: 'api.agentmail.to',
      path: `/v0/inboxes/${AGENTMAIL_INBOX}/messages/send`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AGENTMAIL_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ ok: true });
        else reject(new Error(`AgentMail ${res.statusCode}: ${data}`));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

// ── MAIN EXPORT ───────────────────────────────────────────
async function sendFightNightEmails(data) {
  const subscribers = getProSubscribers();
  if (!subscribers.length) {
    console.log('[Email] No Pro subscribers found');
    return { sent: 0, failed: 0 };
  }

  const subject = `Fight Night Picks — ${data.event_name}`;
  const html = buildEmailHTML(data);
  let sent = 0, failed = 0;

  console.log(`[Email] Sending to ${subscribers.length} Pro subscribers...`);

  for (const subscriber of subscribers) {
    const email = typeof subscriber === 'string' ? subscriber : subscriber.email;
    if (!email || !email.includes('@')) continue;

    try {
      await sendEmail(email, subject, html);
      sent++;
      await sleep(1000); // 1 email/second
    } catch (err) {
      console.error(`[Email] Failed to send to ${email}:`, err.message);
      failed++;
    }
  }

  console.log(`[Email] Done — ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

module.exports = { sendFightNightEmails };

// CLI usage: node auto-email.js
if (require.main === module) {
  const fs = require('fs');
  const predictionsPath = path.join(__dirname, '..', 'website', 'predictions.json');
  try {
    const data = JSON.parse(fs.readFileSync(predictionsPath, 'utf8'));
    sendFightNightEmails(data).catch(console.error);
  } catch (err) {
    console.error('[Email] Could not load predictions:', err.message);
    process.exit(1);
  }
}
