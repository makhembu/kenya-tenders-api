# Kenya Tenders SaaS - WhatsApp Alert System Architecture

## Overview

WhatsApp is the primary communication channel for Kenyan businesses. 
Adding WhatsApp alerts will significantly increase conversion and retention.

## API Base URL

The Kenya Tenders API is accessible at: `https://kenya-tenders-api.shelflix.workers.dev`

All API endpoints are accessed relative to this base URL.

## System Components

### 1. WhatsApp Business Account Setup

```
Requirements:
- Facebook Business Manager account
- WhatsApp Business API access
- Verified business phone number
- Message templates (pre-approved)
```

### 2. Template Messages (Approved Formats)

**New Tender Alert (Template)**
```
Tender Alert 🔔

{tender_title}

County: {county}
Category: {category}
Close: {close_date}
Match Score: {score}/100

View: {short_url}
```

**Daily Digest (Template)**
```
📊 Your Daily Tender Digest

{tenders_count} new tenders matching your alerts:

{tender_1_title} - {tender_1_county}
{tender_2_title} - {tender_2_county}
...

View all: {dashboard_url}
```

**Bid Recommendation (Template)**
```
🎯 High-Value Opportunity

{tender_title}

Win Probability: {win_probability}%
Est. Value: {estimated_value}
Your Match Score: {score}/100

→ Recommended to BID

{details_url}
```

## Integration Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Cron Worker    │──────▶  Alert Engine    │──────▶  WhatsApp API  │
│  (hourly)       │      │  (match logic)    │      │  (Meta)         │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  D1 Database     │
                        │  (users, prefs)  │
                        └──────────────────┘
```

## Implementation Steps

### Step 1: WhatsApp API Integration

```javascript
// worker.js - WhatsApp notification function

const WHATSAPP_TOKEN = env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_ID;

async function sendWhatsApp(to, template, params) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to.replace('+254', '254'), // WhatsApp format
      type: 'template',
      template: {
        name: template,
        language: { code: 'en_US' },
        components: params.map(p => ({
          type: 'body',
          parameters: [{ type: 'text', text: p }]
        }))
      }
    })
  });
  
  return response.json();
}
```

### Step 2: Alert Matching Logic

```javascript
async function processAlerts(env) {
  // Get all active subscriptions with WhatsApp enabled
  const subs = await env.D1.prepare(`
    SELECT s.*, u.phone, u.mpesa_phone, u.whatsapp_enabled 
    FROM subscriptions s
    JOIN users u ON s.user_id = u.id
    WHERE s.is_active = 1 AND s.whatsapp_alert = 1 AND u.whatsapp_enabled = 1
  `).all();
  
  // Get new tenders since last check
  const newTenders = await env.D1.prepare(`
    SELECT * FROM tenders 
    WHERE created_at > datetime('now', '-1 hour')
  `).all();
  
  for (const sub of subs) {
    const keywords = JSON.parse(sub.keywords);
    
    for (const tender of newTenders) {
      // Check if tender matches subscription
      const isMatch = keywords.some(kw => 
        tender.title.toLowerCase().includes(kw.toLowerCase())
      );
      
      if (isMatch) {
        await sendWhatsApp(
          sub.phone,
          'tender_alert',
          [
            tender.title.substring(0, 60),
            tender.county_name,
            tender.procurement_category,
            tender.close_at,
            tender.match_score?.toString() || '70'
          ]
        );
        
        // Log alert
        await logAlert(sub.id, tender.id, 'whatsapp');
      }
    }
  }
}
```

### Step 3: User Opt-In Flow

```
1. User signs up for Pro/Business tier
2. System prompts: "Enable WhatsApp alerts?"
3. User enters phone number
4. System sends verification code via WhatsApp
5. User confirms → alerts enabled
6. Saved in user_preferences table
```

## Pricing Impact

| Tier | WhatsApp Access | Price (KES) |
|------|-----------------|-------------|
| Free | ❌ | 0 |
| Starter | ❌ | 1,000 |
| Pro | ✅ (daily) | 2,000 |
| Business | ✅ (instant) | 5,000 |
| Enterprise | ✅ + bulk | 20,000+ |

## WhatsApp Business Requirements

1. **Message Templates** - Must be pre-approved by Meta
2. **24-hour window** - Can only send template messages (not free-form)
3. **Opt-in required** - User must explicitly consent
4. **Rate limits** - 1,000 messages/hour, 10,000/day

## Cost Calculation

```
WhatsApp Business API:
- Per message: ~KES 1-3 (depends on region)
- Free 100,000 messages/month for first 3 months

At 10,000 active users:
- Daily digests (1/day): 300K messages/month
- Cost: ~KES 300,000/month

This is included in Pro tier pricing.
```

## Migration Plan

### Phase 1 (Current)
- Webhook alerts (done)
- Email alerts (done)

### Phase 2 (Next)
- Add WhatsApp phone field to user signup
- Build WhatsApp API integration
- Create approved templates

### Phase 3 (Future)
- Two-way messaging (replies)
- Rich cards with images
- Interactive buttons

## Success Metrics

- WhatsApp opt-in rate: Target 60% of Pro users
- Alert open rate: Target 80%+ (vs 20% email)
- User retention: Target 90%+ monthly
- NPS: Target 50+