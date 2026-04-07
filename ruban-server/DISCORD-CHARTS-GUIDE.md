# Discord Chart Posting Guide

## Overview

Post Elite Dashboard performance charts and stats to Discord automatically.

---

## Quick Start

### 1. Post Chart Summary (Embed)
```bash
node discord-chart-poster.js summary premium-intel
```

**Output:**
- Embed card with key metrics
- Total profit, win rate, ROI, fights analyzed
- Pick distribution (wins/losses/pending)
- Timestamp

### 2. Post Detailed Breakdown (Text)
```bash
node discord-chart-poster.js breakdown premium-intel
```

**Output:**
- Profit growth timeline (last 60 days)
- Win rate trend (monthly)
- White House projection ($1.2M pool)
- Link to full dashboard

### 3. Post Both
```bash
node discord-chart-poster.js both premium-intel
```

**Output:**
- Embed + detailed text (2-second delay between)

---

## Usage Examples

### Daily Performance Update
```bash
# Post to #premium-intel every morning
node discord-chart-poster.js summary premium-intel
```

**Add to cron (daily at 9 AM):**
```bash
0 9 * * * cd /path/to/ruban-server && node discord-chart-poster.js summary premium-intel
```

### Weekly Deep Dive
```bash
# Post full breakdown every Sunday
node discord-chart-poster.js both premium-intel
```

**Add to cron (Sundays at 6 PM):**
```bash
0 18 * * 0 cd /path/to/ruban-server && node discord-chart-poster.js both premium-intel
```

### Event-Specific Updates
```bash
# Before White House event, post to #elite-room
node discord-chart-poster.js breakdown elite-room
```

---

## Chart Data

**Currently using mock data:**
```javascript
{
  totalProfit: '$142,890',
  winRate: '71%',
  fightsAnalyzed: 38,
  roiMultiple: '+2.8x',
  profitGrowth: [0, 12500, 28400, 45200, 67800, 89100, 118200, 142890],
  winRateByMonth: [64, 68, 71, 67, 71],
  pickDistribution: { wins: 27, losses: 11, pending: 13 }
}
```

**To use real data:**
1. Replace `CHART_DATA` object in `discord-chart-poster.js`
2. Pull from your database/tracking system
3. Or create API endpoint that returns this structure

---

## Discord Channels

**Target channels:**
- `premium-intel` → Premium members only (default)
- `elite-room` → Elite tier only
- `free-picks` → Public channel (summary only, no sensitive data)

**Change target channel:**
```bash
node discord-chart-poster.js summary elite-room
```

---

## Automation Options

### Option 1: Cron (Linux/Mac)
```bash
# Edit crontab
crontab -e

# Add daily update at 9 AM
0 9 * * * cd /home/user/ruban-server && node discord-chart-poster.js summary premium-intel

# Add weekly breakdown on Sundays at 6 PM
0 18 * * 0 cd /home/user/ruban-server && node discord-chart-poster.js both premium-intel
```

### Option 2: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 9:00 AM
4. Action: Start a program
   - Program: `node`
   - Arguments: `discord-chart-poster.js summary premium-intel`
   - Start in: `C:\Users\owedo\.openclaw\workspace\ruban-work\ruban-server`

### Option 3: Node Schedule (Always Running)
```javascript
const schedule = require('node-schedule');

// Every day at 9 AM
schedule.scheduleJob('0 9 * * *', () => {
  exec('node discord-chart-poster.js summary premium-intel');
});

// Every Sunday at 6 PM
schedule.scheduleJob('0 18 * * 0', () => {
  exec('node discord-chart-poster.js both premium-intel');
});
```

---

## Customization

### Change Embed Color
Edit line in `discord-chart-poster.js`:
```javascript
color: 0xA855F7, // Purple (default)
// OR
color: 0xFFD700, // Gold
color: 0x10B981, // Green
```

### Add More Metrics
Add to `embed.fields` array:
```javascript
{
  name: '🔥 Hot Streak',
  value: '5 wins in a row',
  inline: true
}
```

### Change Footer Link
Edit `embed.footer`:
```javascript
footer: {
  text: 'RUBAN | Elite Intelligence • Dashboard: yourdomain.com/elite'
}
```

---

## Elite Dashboard Integration

**Elite members can:**
1. View charts live at `/elite-dashboard.html`
2. Get updates posted to Discord (automated)
3. See same data in both places (consistency)

**Link in Discord posts:**
```
Full interactive charts: https://ruban.com/elite
```

---

## Testing

**Test in private channel first:**
```bash
# Create #test-charts channel
# Post there before going to production
node discord-chart-poster.js summary test-charts
```

**Verify:**
- ✅ Embed renders correctly
- ✅ Data is accurate
- ✅ Links work
- ✅ Formatting is clean

---

## Troubleshooting

### Bot not posting
- Check `DISCORD_BOT_TOKEN` in `.env`
- Verify bot has "Send Messages" permission in target channel
- Check bot is in the server

### Channel not found
- Verify channel name matches exactly
- Check channel name includes the string (e.g., "premium-intel" matches "💎┊premium-intel")
- Use exact name if special characters cause issues

### Embed not showing
- Check Discord embed permissions
- Verify `color` is valid hex (0x format)
- Check embed field limits (25 fields max)

---

## Next Steps

1. **Connect to real data** → Replace `CHART_DATA` with database queries
2. **Automate posting** → Set up cron/Task Scheduler
3. **Add more charts** → Performance charts, pick history, etc.
4. **Member-specific stats** → Tag users with their personal performance

---

**Commands:**
- `summary` → Quick embed with key metrics
- `breakdown` → Detailed text breakdown
- `both` → Embed + breakdown (full update)

**Example:**
```bash
node discord-chart-poster.js both premium-intel
```
