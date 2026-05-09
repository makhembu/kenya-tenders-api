# Phase 8 — Winning Idea: Full Verified Design (BakiPay)

## 1. The Manual Workflow (Reconstructed from Evidence)
- **Today's Process:** Members of a Kasarani-based Chama (ref: Phase 2 evidence) contribute KES 2,000 monthly. The Treasurer records these in a physical "Contribution Book" or a shared Excel file. 
- **The Pain:** At the end of the year (December), the Treasurer must calculate "Surplus/Dividends" based on how many months each member was active and their total contribution. This takes 4–8 hours of manual Excel work and often leads to disputes during the "AGM" (Annual General Meeting).
- **Cite:** `research/02_niche_deep_dives.md` — Micro-Sacco / Burial Society — Manual workflow artifact.

## 2. The API Design

### Resource: Members
- `POST /v1/members`: Register a new member.
  - Body: `{ "name": "...", "phone": "254...", "join_date": "YYYY-MM-DD" }`
- `GET /v1/members/:id`: Retrieve member details and contribution history.

### Resource: Contributions
- `POST /v1/contributions`: Log a payment (idempotent).
  - Body: `{ "member_id": "...", "amount": 2000, "date": "...", "transaction_id": "M-PESA-REF" }`
- `GET /v1/contributions`: Filter by member, group, or date range.

### Resource: Payouts (The Core Logic)
- `POST /v1/payouts/calculate`: Dry-run calculation of dividends.
  - Body: `{ "total_surplus": 50000, "basis": "contribution_tenure" }`
  - Response: `{ "data": [ { "member_id": "...", "amount": 5400 }, ... ] }`
- `POST /v1/payouts/execute`: Trigger bulk distribution (Requires Idempotency-Key).
  - Body: `{ "calculation_id": "...", "payment_method": "mpesa_b2c" }`

## 3. Webhook Events
- `payout.completed`: Fired when a bulk payout cycle finishes.
- `payout.failed`: Fired if an upstream API (M-Pesa) rejects a transaction.
- **Security:** HMAC-SHA256 signing via `X-BakiPay-Signature`.

## 4. Idempotency Design
- **Required headers:** `Idempotency-Key` (UUID).
- **Storage:** Cloudflare KV with 24-hour TTL.
- **Workflow:** If same key + different body -> return `409 Conflict`. If same key + same body -> return cached `201/200` response.

## 5. External API Integration Map
- **Provider:** Safaricom Daraja API (B2C Payouts).
- **Endpoint:** `https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest`
- **Fallback:** If M-Pesa is down, return `503 Service Unavailable` with `retry-after` header. Log failure to `incident_log` in KV.

## 6. Data Model (Cloudflare KV)
- `member:{group_id}:{member_id}` -> Member Profile (JSON).
- `contrib:{group_id}:{member_id}:{date}` -> Contribution Event (JSON).
- `idemp:{key}` -> Idempotency Cache (Response Body + Status).
- `audit:{group_id}:{timestamp}` -> Immutable log of calculation runs.

## 7. Target Customer (Verified)
- **Profile:** Treasurer of a registered self-help group/Chama.
- **Evidence:** "Chama Networks Kenya" (12,400 members).
- **Pain Quote:** "How do I track merry-go-round loans without someone forgetting they took it? The notebook is lost." (ref: Phase 2).
