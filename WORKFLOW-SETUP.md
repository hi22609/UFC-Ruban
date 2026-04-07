# RUBAN Complete Workflow System

## 🎯 OVERVIEW

Complete end-to-end automation for UFC RUBAN:
- ✅ Payment → Discord access
- ✅ Daily content posting
- ✅ Member management
- ✅ 3D fight visualization

---

## 📦 WHAT WAS BUILT

### 1. Discord Bot (`discord-bot.js`)
**Purpose:** Automated Discord server management

**Features:**
- Welcome messages on join
- Premium role auto-assignment
- Free pick posting (#free-picks)
- Premium intel posting (#premium-intel, members-only)
- Payment webhook integration

**Functions:**
```javascript
grantPremiumAccess(userId, email, tier)  // Grant role after payment
revokePremiumAccess(userId)               // Remove role on cancel
postFreePick(fightData)                   // Daily free pick
postPremiumIntel(cardData)                // Premium content drop
```

### 2. Payment Workflow (`workflows/payment-to-discord.js`)
**Purpose:** Connect Stripe payments to Discord access

**Flow:**
1. User pays via Stripe
2. Webhook triggers workflow
3. If Discord linked → Instant access
4. If not linked → Pending invite saved
5. User joins Discord → Access granted

**Functions:**
```javascript
processPayment(paymentData)              // Handle new payment
linkDiscordAccount(email, discordId)     // Link Discord to payment
cancelSubscription(email, discordId)     // Handle cancellation
```

### 3. Daily Content (`workflows/daily-content.js`)
**Purpose:** Automated content posting

**Schedule:**
- 9:00 AM ET: Free pick posted to #free-picks
- 6 hours before event: Premium intel to #premium-intel

**Manual Triggers:**
```bash
node daily-content.js free-pick    # Post free pick now
node daily-content.js premium      # Post premium intel now
```

### 4. 3D Fight Page (`ruban-frontend/app/white-house/page.tsx`)
**Purpose:** Interactive 3D fight visualization

**Features:**
- Interactive octagon arena (React Three Fiber)
- Fighter corners with stats
- Animated VS divider
- Orbit controls (rotate, zoom)
- Fighter stat cards (overlays)
- Mobile responsive
- Links to pricing page

**Route:** `/white-house`

---

## 🚀 SETUP GUIDE

### Step 1: Install Dependencies

```bash
cd ruban-server
npm install discord.js dotenv cors
```

### Step 2: Environment Variables

Create `.env` in `ruban-server/`:

```env
# Discord
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_guild_id_here
DISCORD_INVITE_URL=https://discord.gg/your_invite

# Stripe (already configured)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
PAYMENT_URL=https://ruban.com/pricing
```

### Step 3: Start Discord Bot

```bash
node discord-bot.js
```

**What happens:**
- Bot connects to Discord
- Creates channels: #welcome, #free-picks, #premium-intel
- Creates "Premium Member" role
- Ready for webhook events

### Step 4: Update Stripe Webhook

In `stripe-webhook.js`, add at top:

```javascript
const paymentWorkflow = require('./workflows/payment-to-discord');
```

In payment success handler:

```javascript
const result = await paymentWorkflow.processPayment({
  email,
  tier,
  stripeCustomerId: customer,
  discordId: null // Will be linked when user joins Discord
});
```

### Step 5: Frontend 3D Page

```bash
cd ruban-work/ruban-frontend
npm install @react-three/fiber @react-three/drei three framer-motion
npm run build
```

**New route:** `https://your-site.com/white-house`

---

## 🔄 COMPLETE WORKFLOW

### New Member Flow:
1. User visits ruban.com
2. Sees free pick on homepage
3. Clicks "Get Full Card" → `/pricing`
4. Pays via Stripe ($20/mo or $120/yr)
5. **Webhook triggers payment workflow**
6. User receives email: "Welcome! Join Discord: [link]"
7. User joins Discord server
8. **Bot sends welcome message**
9. User types: `/link-account your@email.com`
10. **Workflow grants premium role**
11. User gains access to #premium-intel
12. **Done! Premium member.**

### Daily Content Flow:
1. **9:00 AM ET:** Bot posts free pick to #free-picks
2. All users see pick + CTA to upgrade
3. **6 hours before event:** Bot posts full card to #premium-intel
4. Premium members get full analysis
5. Free users see locked message

### Cancellation Flow:
1. User cancels subscription in Stripe
2. **Webhook triggers cancellation workflow**
3. Bot removes premium role
4. User loses access to #premium-intel
5. Bot sends DM: "Subscription cancelled. Re-subscribe anytime!"

---

## 🎨 3D FIGHT PAGE FEATURES

### Interactive Elements:
- **Octagon Arena:** 8-sided cage with metallic posts
- **Fighter Corners:** Red corner (Topuria) vs Blue corner (Gaethje)
- **VS Divider:** Animated gold text
- **Orbit Controls:** Mouse drag to rotate, scroll to zoom
- **Auto-Rotate:** Smooth rotation (can pause)

### Overlays:
- Event info (UFC 322: White House)
- Fighter stat cards (record, height, reach, age)
- Control buttons (pause/rotate, get access)

### Tech Stack:
- React Three Fiber (3D rendering)
- @react-three/drei (helpers)
- Framer Motion (animations)
- Next.js (SSR)
- Tailwind CSS (styling)

---

## 🧪 TESTING

### Test Discord Bot:
```bash
# Post test free pick
node workflows/daily-content.js free-pick

# Post test premium intel
node workflows/daily-content.js premium
```

### Test Payment Flow:
1. Use Stripe test mode
2. Test card: `4242 4242 4242 4242`
3. Complete checkout
4. Check `pending-invites.json` for entry
5. Join Discord
6. Run link command
7. Verify premium role granted

### Test 3D Page:
1. Visit `/white-house`
2. Drag to rotate octagon
3. Scroll to zoom
4. Click pause/rotate button
5. Click "Get Full Analysis" → should go to `/pricing`

---

## 📊 FILE STRUCTURE

```
ruban-server/
├── discord-bot.js                    # Main bot
├── stripe-webhook.js                 # Webhook handler (update to use workflows)
├── server.js                         # Express server
├── members.json                      # Member database
├── pending-invites.json              # Pending Discord links
├── stripe-events.log                 # All webhook events
├── workflows/
│   ├── payment-to-discord.js         # Payment automation
│   └── daily-content.js              # Content posting
└── package.json                      # Dependencies

ruban-frontend/
└── app/
    ├── page.tsx                      # Homepage (free pick hook)
    ├── pricing/page.tsx              # Pricing (payment links)
    ├── white-house/page.tsx          # 3D fight visualization (NEW)
    └── ...
```

---

## 🔧 MAINTENANCE

### Daily Tasks:
- Monitor `stripe-events.log` for errors
- Check `pending-invites.json` for stuck invites
- Verify bot is online (Discord status)

### Weekly Tasks:
- Update fight data in daily-content.js
- Review member stats in members.json
- Test payment flow end-to-end

### Monthly Tasks:
- Clear old logs
- Archive cancelled members
- Review Discord engagement metrics

---

## 🚨 TROUBLESHOOTING

### Bot won't start:
- Check DISCORD_BOT_TOKEN in .env
- Verify bot has "bot" and "applications.commands" scopes
- Check DISCORD_GUILD_ID is correct

### Webhook not triggering:
- Verify STRIPE_WEBHOOK_SECRET matches Stripe Dashboard
- Check server.js is listening on correct port
- Ensure Railway webhook URL is configured in Stripe

### Role not granted:
- Check bot has "Manage Roles" permission
- Verify "Premium Member" role exists
- Check bot role is higher than Premium Member role in hierarchy

### 3D page blank:
- Check browser console for errors
- Verify Three.js dependencies installed
- Test in Chrome/Firefox (Safari can have WebGL issues)

---

## 💡 NEXT STEPS

1. **Deploy Discord Bot** → Run on Railway alongside server
2. **Update Webhook** → Integrate payment-to-discord workflow
3. **Test End-to-End** → Pay → Join Discord → Get access
4. **Deploy 3D Page** → Push frontend to production
5. **Schedule Content** → Set up cron for daily picks

---

**All workflows ready to ship. Need help with deployment? Just ask.** 🚀🥊
