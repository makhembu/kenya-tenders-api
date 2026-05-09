# Kenya Tenders API — AI-Powered Government Tender Intelligence

A Cloudflare Worker-based SaaS API providing real-time access to Kenyan government tender data from the Public Procurement Information Portal (PPIP). Features AI-powered bid matching with scoring and recommendations, webhook notifications for new tenders, subscription-based keyword/county alerts, and tiered pricing. Data synced hourly via cron job.

Base URL: `https://kenya-tenders-api.shelflix.workers.dev`

## Quick Start

```bash
git clone https://github.com/makhembu/kenya-tenders-api
cd "Your env"
npm install
npx wrangler dev
# Requires 8 KV namespaces configured in wrangler.toml
```

Test with the included key: `tk_test123_testsecret123`

## API

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | System status, last sync, version |
| GET | `/` | Landing page with live test UI |

### Auth Required (api_key query param or Authorization: Bearer)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/keys` | Create API key `{name, email}` |
| GET | `/v1/tenders` | List tenders with filters (county, category, keyword, page) |
| GET | `/v1/tenders/:id` | Full tender details with match score |
| GET | `/v1/opportunities/trending` | Top 10 procurement categories |
| GET | `/v1/opportunities/count-by-county` | Tenders per county |
| GET | `/v1/opportunities/match` | AI matching with scores and recommendations |
| GET | `/v1/opportunities/high-value` | Recent high-bid-security tenders |
| POST | `/v1/subscriptions` | Create keyword/county alert |
| GET | `/v1/subscriptions` | List subscriptions |
| DELETE | `/v1/subscriptions/:id` | Remove subscription |
| POST | `/v1/webhooks` | Register webhook URL |
| GET | `/v1/webhooks` | List webhooks |
| DELETE | `/v1/webhooks/:id` | Remove webhook |
| GET | `/v1/webhooks/:id/deliveries` | Delivery history (last 50) |

## Architecture

```
PPIP API --(hourly cron)--> TENDER_CACHE KV --> API Layer --> Users
                                            --> Smart Endpoints (AI scoring)
                                            --> Webhooks (HMAC-SHA256 signed)
```

8 KV namespaces: `API_KEY`, `RATE_LIMIT`, `SUBSCRIPTIONS`, `WEBHOOKS`, `WEBHOOK_DELIVERIES`, `TENDER_CACHE`, `CRON_STATUS`, `IDEMPOTENCY`.

## Features

- **AI match scoring** — each tender scored 0-100 based on keyword match, AGPO status, close date, and bid security value. Produces bid/watch/ignore recommendations.
- **Smart webhooks** — auto-fires on new tenders with HMAC-SHA256 signed payloads, `X-Webhook-Signature` and `X-Webhook-Event` headers
- **Hourly cron sync** — fetches from PPIP, compares with cached IDs, detects new tenders
- **Rate limiting** — KV-based, 1K req/day (free) or 10K req/day (pro)
- **AGPO support** — flags tenders reserved for Access to Government Procurement Opportunities groups
- **47 counties** — covers all Kenyan counties with proper aggregation
- **Webhook payload example:**
  ```json
  {
    "event": "tender.new",
    "tender_id": 285667,
    "tender_ref": "KCG/KDSPII/RFP/2162863/2025/2026",
    "title": "CONSULTANCY SERVICES FOR ESIA...",
    "county": "Kilifi County Government",
    "category": "Consultancy Services",
    "close_at": "2026-04-08 10:00:00",
    "is_agpo": false
  }
  ```
- **WhatsApp alerts** — full architecture document at `WHATSAPP_SYSTEM.md` for Meta Business API integration

## Pricing

| Tier | Price | Requests/Day | Features |
|------|-------|-------------|----------|
| Free | KES 0 | 1,000 | All endpoints |
| Starter | KES 1,000 | 5,000 | Email alerts |
| Pro | KES 2,000 | 10,000 | Email + WhatsApp alerts |
| Business | KES 5,000 | 25,000 | Custom integration |

## Deployment

```bash
npx wrangler deploy     # Deploy to Cloudflare
npx wrangler dev        # Local development
node setup.js           # Create test API keys
```

Requires creating 8 KV namespaces and updating their IDs in `wrangler.toml` before first deploy.

## Testing

```bash
node test-api.js        # Full test suite (10 tests)
node run-tests.js       # Simplified test runner
```
