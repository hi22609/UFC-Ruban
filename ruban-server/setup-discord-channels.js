// Setup Discord Channels with Proper Names and Topics
// Run this once to create/update all channels

const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const GUILD_ID = process.env.DISCORD_GUILD_ID;

const CHANNELS = [
  {
    name: '👋┊welcome',
    topic: 'Welcome to RUBAN! The premium UFC intelligence community.',
    category: 'INFO',
    isPrivate: false
  },
  {
    name: '🆓┊free-picks',
    topic: 'Daily free picks and main event analysis',
    category: 'FREE',
    isPrivate: false
  },
  {
    name: '💎┊premium-intel',
    topic: 'Full card breakdowns, live updates, insider intel (Premium Members Only)',
    category: 'PREMIUM',
    isPrivate: true
  },
  {
    name: '📖┊subscribe',
    topic: 'Get Pro ($9/mo) or Elite ($9/mo) access',
    category: 'INFO',
    isPrivate: false
  },
  {
    name: '💬┊fight-chat',
    topic: 'General UFC discussion and fight talk',
    category: 'COMMUNITY',
    isPrivate: false
  }
];

async function setupChannels() {
  const guild = await client.guilds.fetch(GUILD_ID);
  console.log(`✅ Connected to guild: ${guild.name}`);
  
  // Get or create Premium Member role
  let premiumRole = guild.roles.cache.find(r => r.name === 'Premium Member');
  if (!premiumRole) {
    premiumRole = await guild.roles.create({
      name: 'Premium Member',
      color: 0x4F46E5,
      reason: 'Premium access role'
    });
    console.log('✅ Created Premium Member role');
  }
  
  // Create categories
  const categories = {};
  for (const categoryName of ['INFO', 'FREE', 'PREMIUM', 'COMMUNITY']) {
    let category = guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);
    if (!category) {
      category = await guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory
      });
      console.log(`✅ Created category: ${categoryName}`);
    }
    categories[categoryName] = category;
  }
  
  // Create/update channels
  for (const channelConfig of CHANNELS) {
    let channel = guild.channels.cache.find(c => c.name === channelConfig.name);
    
    if (!channel) {
      // Create new channel
      channel = await guild.channels.create({
        name: channelConfig.name,
        type: ChannelType.GuildText,
        topic: channelConfig.topic,
        parent: categories[channelConfig.category].id,
        permissionOverwrites: channelConfig.isPrivate ? [
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
      console.log(`✅ Created channel: ${channelConfig.name}`);
    } else {
      // Update existing channel topic
      await channel.edit({
        topic: channelConfig.topic,
        parent: categories[channelConfig.category].id
      });
      console.log(`✅ Updated channel: ${channelConfig.name}`);
    }
  }
  
  console.log('🎉 Discord server setup complete!');
  process.exit(0);
}

client.once('ready', setupChannels);
client.login(process.env.DISCORD_BOT_TOKEN);
