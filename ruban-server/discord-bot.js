// RUBAN Discord Bot - Automated Workflows
// Handles: member onboarding, payment webhooks, content drops

const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  TOKEN: process.env.DISCORD_BOT_TOKEN,
  GUILD_ID: process.env.DISCORD_GUILD_ID,
  PREMIUM_ROLE_NAME: 'Premium Member',
  CHANNELS: {
    welcome: 'welcome',
    freePicks: 'free-picks',
    premiumIntel: 'premium-intel',
    general: 'general'
  },
  PAYMENT_URL: process.env.PAYMENT_URL || 'https://ruban.com/pricing',
  BRAND_COLOR: 0x4F46E5, // Indigo
  MEMBER_FILE: path.join(__dirname, 'members.json')
};

// Initialize client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Load members database
async function loadMembers() {
  try {
    const data = await fs.readFile(CONFIG.MEMBER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { members: {} };
  }
}

// Save members database
async function saveMembers(data) {
  await fs.writeFile(CONFIG.MEMBER_FILE, JSON.stringify(data, null, 2));
}

// Get or create premium role
async function getPremiumRole(guild) {
  let role = guild.roles.cache.find(r => r.name === CONFIG.PREMIUM_ROLE_NAME);
  
  if (!role) {
    role = await guild.roles.create({
      name: CONFIG.PREMIUM_ROLE_NAME,
      color: CONFIG.BRAND_COLOR,
      permissions: [],
      reason: 'Premium member access'
    });
    console.log(`✅ Created role: ${CONFIG.PREMIUM_ROLE_NAME}`);
  }
  
  return role;
}

// Get or create channel
async function getOrCreateChannel(guild, channelName, isPrivate = false) {
  let channel = guild.channels.cache.find(c => c.name === channelName);
  
  if (!channel) {
    const premiumRole = await getPremiumRole(guild);
    
    channel = await guild.channels.create({
      name: channelName,
      type: 0, // Text channel
      permissionOverwrites: isPrivate ? [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: premiumRole.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        }
      ] : []
    });
    console.log(`✅ Created channel: #${channelName}`);
  }
  
  return channel;
}

// Welcome message
async function sendWelcomeMessage(member) {
  const welcomeChannel = await getOrCreateChannel(member.guild, CONFIG.CHANNELS.welcome);
  
  const embed = new EmbedBuilder()
    .setColor(CONFIG.BRAND_COLOR)
    .setTitle('🥊 Welcome to UFC RUBAN')
    .setDescription(`Welcome ${member}, the premium UFC intelligence network.`)
    .addFields(
      { name: '🆓 Free Access', value: 'Check #free-picks for daily predictions' },
      { name: '💎 Premium Access', value: `Unlock full card analysis, live updates, and insider intel\n[Get Premium →](${CONFIG.PAYMENT_URL})` },
      { name: '📊 Track Record', value: '67% win rate • 8+ data lenses • 24/7 analysis' }
    )
    .setFooter({ text: 'Black Label Intelligence' })
    .setTimestamp();
  
  await welcomeChannel.send({ content: `<@${member.id}>`, embeds: [embed] });
}

// Grant premium access
async function grantPremiumAccess(userId, email, tier) {
  try {
    const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
    if (!guild) {
      console.error('❌ Guild not found');
      return false;
    }
    
    const member = await guild.members.fetch(userId);
    if (!member) {
      console.error('❌ Member not found');
      return false;
    }
    
    const premiumRole = await getPremiumRole(guild);
    await member.roles.add(premiumRole);
    
    // Update members database
    const members = await loadMembers();
    members.members[userId] = {
      email,
      tier,
      status: 'active',
      discordId: userId,
      grantedAt: new Date().toISOString()
    };
    await saveMembers(members);
    
    // Send DM
    const embed = new EmbedBuilder()
      .setColor(CONFIG.BRAND_COLOR)
      .setTitle('✅ Premium Access Granted')
      .setDescription(`Welcome to **${tier === 'annual' ? 'RUBAN Syndicate' : 'RUBAN Operator'}**!`)
      .addFields(
        { name: '🔓 Unlocked', value: '#premium-intel channel' },
        { name: '📊 Access', value: 'Full fight card analysis\nLive updates\nInsider intel' },
        { name: '🎯 Next Steps', value: 'Check #premium-intel for tonight\'s card' }
      )
      .setFooter({ text: 'Questions? DM the mods' })
      .setTimestamp();
    
    await member.send({ embeds: [embed] });
    
    console.log(`✅ Granted premium access to ${email} (${userId})`);
    return true;
  } catch (error) {
    console.error('❌ Error granting premium access:', error);
    return false;
  }
}

// Revoke premium access
async function revokePremiumAccess(userId) {
  try {
    const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
    if (!guild) return false;
    
    const member = await guild.members.fetch(userId);
    if (!member) return false;
    
    const premiumRole = await getPremiumRole(guild);
    await member.roles.remove(premiumRole);
    
    // Update members database
    const members = await loadMembers();
    if (members.members[userId]) {
      members.members[userId].status = 'cancelled';
      members.members[userId].cancelledAt = new Date().toISOString();
      await saveMembers(members);
    }
    
    console.log(`✅ Revoked premium access for ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error revoking access:', error);
    return false;
  }
}

// Post free pick
async function postFreePick(fightData) {
  const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
  if (!guild) return;
  
  const channel = await getOrCreateChannel(guild, CONFIG.CHANNELS.freePicks);
  
  const embed = new EmbedBuilder()
    .setColor(CONFIG.BRAND_COLOR)
    .setTitle(`🆓 FREE PICK: ${fightData.fighter1} vs ${fightData.fighter2}`)
    .setDescription(`**${fightData.event}** • ${fightData.date}`)
    .addFields(
      { name: '🎯 Pick', value: `**${fightData.pick}** to win`, inline: true },
      { name: '📊 Confidence', value: `${fightData.confidence}%`, inline: true },
      { name: '⚡ Method', value: fightData.method, inline: true },
      { name: '📈 Analysis', value: fightData.analysis },
      { name: '⚠️ Risk Factors', value: fightData.risks },
      { name: '💎 Want the Full Card?', value: `Unlock 12+ premium picks\n[Get Access →](${CONFIG.PAYMENT_URL})` }
    )
    .setFooter({ text: 'Black Label Intelligence • Track Record: 67% Win Rate' })
    .setTimestamp();
  
  await channel.send({ embeds: [embed] });
  console.log('✅ Posted free pick');
}

// Post premium intel
async function postPremiumIntel(cardData) {
  const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
  if (!guild) return;
  
  const channel = await getOrCreateChannel(guild, CONFIG.CHANNELS.premiumIntel, true);
  
  const embed = new EmbedBuilder()
    .setColor(CONFIG.BRAND_COLOR)
    .setTitle(`💎 PREMIUM INTEL: ${cardData.event}`)
    .setDescription(`Full card analysis for ${cardData.date}`)
    .addFields(
      { name: '🎯 Main Card Picks', value: cardData.mainCard },
      { name: '📊 Prelims Analysis', value: cardData.prelims },
      { name: '⚡ Live Updates', value: 'Fight night commentary in this channel' },
      { name: '🔥 Key Insights', value: cardData.insights }
    )
    .setFooter({ text: 'Black Label Intelligence • Premium Members Only' })
    .setTimestamp();
  
  await channel.send({ content: '@everyone', embeds: [embed] });
  console.log('✅ Posted premium intel');
}

// Bot ready
client.once('ready', async () => {
  console.log(`✅ Discord bot logged in as ${client.user.tag}`);
  
  const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
  if (guild) {
    // Setup channels
    await getOrCreateChannel(guild, CONFIG.CHANNELS.welcome);
    await getOrCreateChannel(guild, CONFIG.CHANNELS.freePicks);
    await getOrCreateChannel(guild, CONFIG.CHANNELS.premiumIntel, true);
    await getOrCreateChannel(guild, CONFIG.CHANNELS.general);
    
    console.log('✅ Discord server setup complete');
  }
});

// Member join
client.on('guildMemberAdd', async (member) => {
  await sendWelcomeMessage(member);
});

// Export functions for webhook integration
module.exports = {
  client,
  grantPremiumAccess,
  revokePremiumAccess,
  postFreePick,
  postPremiumIntel,
  start: () => client.login(CONFIG.TOKEN)
};

// Start if run directly
if (require.main === module) {
  client.login(CONFIG.TOKEN);
}
