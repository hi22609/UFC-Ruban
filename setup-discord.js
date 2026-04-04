/**
 * RUBAN DISCORD - ONE-CLICK SETUP
 * 
 * Run this ONCE to create pro Discord structure:
 * - Channels: #announcements, #picks-live, #results-proof, #vip-lounge, #affiliate-hq
 * - Roles: CEO, Admin, VIP, Affiliate, Bot
 * 
 * SETUP:
 * 1. Create a Discord bot at https://discord.com/developers
 * 2. Get your bot token and server ID
 * 3. Run: DISCORD_TOKEN=your_token SERVER_ID=your_id node setup-discord.js
 */

const https = require('https');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.SERVER_ID;

if (!TOKEN || !GUILD_ID) {
  console.error('❌ Missing DISCORD_TOKEN or SERVER_ID');
  console.log('Usage: DISCORD_TOKEN=xxx SERVER_ID=xxx node setup-discord.js');
  process.exit(1);
}

const API = 'https://discord.com/api/v10';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Authorization': `Bot ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(`${API}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function setup() {
  console.log('🚀 Setting up RUBAN Discord...\n');

  // 1. Create Roles
  console.log('📋 Creating roles...');
  const roles = [
    { name: 'CEO', color: 0xA855F7, permissions: '8' }, // Admin
    { name: 'Admin', color: 0xC026D3, permissions: '8' },
    { name: 'VIP', color: 0x10B981, permissions: '0' },
    { name: 'Affiliate', color: 0xF59E0B, permissions: '0' },
  ];

  for (const role of roles) {
    const result = await request('POST', `/guilds/${GUILD_ID}/roles`, role);
    console.log(`  ✅ Created: ${role.name}`);
  }

  // 2. Create Channels
  console.log('\n📁 Creating channels...');
  const channels = [
    { name: '📢-announcements', type: 0, topic: 'Big wins, fight night alerts (CEO only)' },
    { name: '🎯-picks-live', type: 0, topic: 'Live fight predictions' },
    { name: '🏆-results-proof', type: 0, topic: 'Winning tickets, track record' },
    { name: '💎-vip-lounge', type: 0, topic: 'Subscriber-only chat' },
    { name: '🤝-affiliate-hq', type: 0, topic: 'Partners only' },
    { name: '📜-welcome-rules', type: 0, topic: 'Start here' },
  ];

  for (const channel of channels) {
    const result = await request('POST', `/guilds/${GUILD_ID}/channels`, channel);
    console.log(`  ✅ Created: ${channel.name}`);
  }

  console.log('\n✅ RUBAN Discord setup complete!');
  console.log('\nNext steps:');
  console.log('1. Go to your Discord server');
  console.log('2. Assign yourself the CEO role');
  console.log('3. Lock #announcements to CEO-only posting');
  console.log('4. Set #vip-lounge permissions (VIP role required)');
}

setup().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
