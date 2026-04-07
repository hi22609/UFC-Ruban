// Discord Chart Poster - Posts Elite Dashboard charts to Discord
// Usage: node discord-chart-poster.js [channel-name]

const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const GUILD_ID = process.env.DISCORD_GUILD_ID;

// Mock chart data (replace with real data from your system)
const CHART_DATA = {
  totalProfit: '$142,890',
  winRate: '71%',
  fightsAnalyzed: 38,
  roiMultiple: '+2.8x',
  profitGrowth: [0, 12500, 28400, 45200, 67800, 89100, 118200, 142890],
  winRateByMonth: [64, 68, 71, 67, 71],
  pickDistribution: { wins: 27, losses: 11, pending: 13 }
};

async function postChartUpdate(channelName = 'premium-intel') {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = guild.channels.cache.find(c => c.name.includes(channelName));
    
    if (!channel) {
      console.error(`❌ Channel "${channelName}" not found`);
      return;
    }

    // Create performance summary embed
    const embed = {
      color: 0xA855F7,
      title: '💠 ELITE MEMBER PERFORMANCE UPDATE',
      description: 'Real-time tracking across all RUBAN picks',
      fields: [
        {
          name: '💰 Total Tracked Profit',
          value: `**${CHART_DATA.totalProfit}**\n↑ $12,400 this week`,
          inline: true
        },
        {
          name: '🎯 Win Rate (Last 30 Days)',
          value: `**${CHART_DATA.winRate}**\n↑ 4% vs last month`,
          inline: true
        },
        {
          name: '📊 ROI Multiple',
          value: `**${CHART_DATA.roiMultiple}**\n↑ 0.3x vs baseline`,
          inline: true
        },
        {
          name: '🥊 Fights Analyzed',
          value: `**${CHART_DATA.fightsAnalyzed}** total\n13 pending (White House)`,
          inline: true
        },
        {
          name: '📈 Pick Distribution',
          value: `✅ ${CHART_DATA.pickDistribution.wins} wins\n❌ ${CHART_DATA.pickDistribution.losses} losses\n⏳ ${CHART_DATA.pickDistribution.pending} pending`,
          inline: true
        },
        {
          name: '📅 Last Updated',
          value: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          inline: true
        }
      ],
      footer: {
        text: 'RUBAN | Elite Intelligence • Full dashboard: ruban.com/elite'
      },
      timestamp: new Date()
    };

    await channel.send({ embeds: [embed] });
    console.log(`✅ Posted chart update to #${channel.name}`);

  } catch (error) {
    console.error('❌ Error posting chart:', error);
  }
}

// Post detailed breakdown
async function postDetailedBreakdown(channelName = 'premium-intel') {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = guild.channels.cache.find(c => c.name.includes(channelName));
    
    if (!channel) {
      console.error(`❌ Channel "${channelName}" not found`);
      return;
    }

    const message = `
**📊 PROFIT GROWTH BREAKDOWN**

**Last 60 Days:**
• Jan 1: $0
• Jan 15: $12,500
• Feb 1: $28,400
• Feb 15: $45,200
• Mar 1: $67,800
• Mar 15: $89,100
• Apr 1: $118,200
• **Today: $142,890**

**Win Rate Trend:**
• Dec: 64%
• Jan: 68%
• Feb: 71%
• Mar: 67%
• **Apr: 71%** ⬆️

**White House Projection:**
If members follow all 13 picks at $100/unit:
• Expected wins (67% rate): ~9 fights
• Average odds: +180
• **Projected profit pool: $1.2M+**

*Full interactive charts: https://ruban.com/elite*
    `;

    await channel.send(message);
    console.log(`✅ Posted detailed breakdown to #${channel.name}`);

  } catch (error) {
    console.error('❌ Error posting breakdown:', error);
  }
}

// Command line interface
client.once('ready', async () => {
  console.log(`✅ Bot connected as ${client.user.tag}`);
  
  const command = process.argv[2];
  const channelName = process.argv[3] || 'premium-intel';
  
  if (command === 'summary') {
    await postChartUpdate(channelName);
  } else if (command === 'breakdown') {
    await postDetailedBreakdown(channelName);
  } else if (command === 'both') {
    await postChartUpdate(channelName);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await postDetailedBreakdown(channelName);
  } else {
    console.log('Usage: node discord-chart-poster.js [summary|breakdown|both] [channel-name]');
  }
  
  process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN);
