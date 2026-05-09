# Phase 3 — Idea Generation (Evidence-Constrained)

Exactly 10 API-first business ideas derived from the VIABLE niches identified in Phase 2.

---

## 1. LeagueCenter API
- **Niche:** Community Sports League Management
- **Evidence:** `https://www.facebook.com/nairobieastfkf/` - Verified manual fixture/standings workflow.
- **Problem:** Branch secretaries spend hours manually updating fixtures and standings from WhatsApp messages into PDF branch circulars.
- **Solution:** 
  - `POST /v1/fixtures`: Schedule matches between registered clubs.
  - `POST /v1/results`: Submit match scores via authenticated callback (e.g., from a pitch-side official).
  - `GET /v1/standings`: Instantly fetch live table data for embedding in websites or SMS broadcasts.
- **Integration:** Africa's Talking (SMS) for match result notifications.
- **Customer:** Branch Secretary of a registered county football league.
- **Price:** KES 2,500/month (Justified by current spend on clerical staff/stationery).
- **Why ignored:** Too local/fragmented for global sports software; requires deep understanding of Kenyan lower-tier league administration.
- **Data moat:** Cumulative historical performance data of local community clubs not tracked by big data providers.

## 2. Tabiri Sports
- **Niche:** Community Sports League Management
- **Evidence:** FKF Nairobi East Branch notices regarding player eligibility and clearing dues.
- **Problem:** Leagues struggle with "match-day eligibility fraud" where suspended or unregistered players participate.
- **Solution:** 
  - `GET /v1/players/:id/eligibility`: Check if a player is cleared to play in the current fixture.
  - `POST /v1/players/suspend`: Log disciplinary actions that block eligibility automatically.
  - `GET /v1/leagues/cleared-lists`: Generate real-time match lineups.
- **Integration:** M-Pesa (Daraja) for automated clearing of player fines to restore eligibility.
- **Customer:** League Competition Manager.
- **Price:** KES 5,000/season/league.
- **Why ignored:** Higher-end systems assume full digital entry; community leagues need a thin, single-purpose API for verification.
- **Data moat:** Verified disciplinary and registration history of community-level players.

## 3. StandingWatch
- **Niche:** Community Sports League Management
- **Evidence:** FKF branch circulars showing manual calculation of Goal Difference and Head-to-Head tie-breakers.
- **Problem:** Manual standings calculation leads to errors and disputes during promotion/relegation playoff season.
- **Solution:** 
  - `GET /v1/standings/live`: Real-time calculation engine with Kenyan branch tie-breaker logic.
  - `POST /v1/leagues/tie-breakers`: Configure custom promotion rules.
  - `GET /v1/history/standings`: Historical archive for dispute resolution.
- **Integration:** Cloudflare KV for sub-second lookup of complex calculated tables.
- **Customer:** County Sports Department registrar.
- **Price:** KES 1,000/month per league.
- **Why ignored:** Considered a "feature" in larger apps, but community leagues need it as a standalone API to fix their existing Excel mess.
- **Data moat:** The logic set for specific Kenyan lower-tier league tie-breaker rules.

## 4. WelfarePoint
- **Niche:** Micro-Sacco / Burial Society (Welfare Groups)
- **Evidence:** Chama Networks Kenya Facebook Group - pain quote regarding lost notebooks.
- **Problem:** Treasurers struggle to issue real-time contribution statements to members, leading to transparency disputes.
- **Solution:** 
  - `POST /v1/contributions`: Log member payments (source: M-Pesa callback).
  - `GET /v1/members/:id/statement`: Periodic financial summaries for a member.
  - `GET /v1/statements/group`: Total group liquidity overview.
- **Integration:** M-Pesa (Daraja) STK Push for automated contribution collection.
- **Customer:** Treasurer of a registered self-help group/Chama.
- **Price:** KES 500/month (Below the KES 1,000 threshold for small digital tools).
- **Why ignored:** Traditional banking apps are too complex for informal group governance; this is API-first for group apps.
- **Data moat:** Granular contribution behavior data for informal savings groups.

## 5. ClaimsCheck
- **Niche:** Micro-Sacco / Burial Society (Welfare Groups)
- **Evidence:** `https://aak.or.ke/` benevolent fund claim forms requiring burial permits and notifications.
- **Problem:** Burial societies are slow to payout due to manual verification of death notifications and relationship to the group.
- **Solution:** 
  - `POST /v1/claims/verify`: Upload burial permit data for automated OCR/validation.
  - `GET /v1/claims/:id/status`: Real-time tracking of claim approval stages.
  - `POST /v1/claims/fund-release`: Trigger payout upon verified conditions.
- **Integration:** Africa's Talking (SMS) to update bereaved families on claim status.
- **Customer:** Administrator of a Burial Society.
- **Price:** KES 50 per claim processed.
- **Why ignored:** High manual friction in verification; requires a specialized API layer for local documents.
- **Data moat:** The largest database of verified burial society claim behaviors in Kenya.

## 6. SaccoSync
- **Niche:** Micro-Sacco / Burial Society (Welfare Groups)
- **Evidence:** `https://chamasoft.com/blog/chama-contribution-form-sample/`
- **Problem:** Secretaries of large umbrella organizations (Mult-Chama groups) cannot see consolidated financial positions across sub-groups.
- **Solution:** 
  - `GET /v1/groups/consolidated`: Aggregated ledger views.
  - `POST /v1/groups/sync`: Pull data from sub-group spreadsheets into a unified API.
  - `GET /v1/reports/compliance`: Auto-generate reports for the Ministry of Social Development.
- **Integration:** Cloudflare R2 for storing scanned ledger photos.
- **Customer:** Secretary of a registered umbrella community organization.
- **Price:** KES 3,500/month.
- **Why ignored:** Umbrella groups are underserved; most software targets single small groups.
- **Data moat:** Multi-layered group hierarchy data for community welfare.

## 7. BakiPay
- **Niche:** Micro-Sacco / Burial Society (Welfare Groups)
- **Evidence:** `https://digichama.co.ke/pricing/` - Evidence of tiered systems for withdrawal/dividends.
- **Problem:** Calculating "merry-go-round" or dividend payouts at year-end is a manual nightmare for Treasurers.
- **Solution:** 
  - `POST /v1/payouts/calculate`: Dividend logic engine based on contribution tenure.
  - `GET /v1/payouts/schedule`: Projected payout dates for members.
  - `POST /v1/payouts/execute`: Bulk distribution trigger.
- **Integration:** M-Pesa (Daraja) B2C for automated holiday dividend payouts.
- **Customer:** Treasurer of a registered Sacco/Chama.
- **Price:** KES 1,000 per payout cycle.
- **Why ignored:** Seasonal complexity; core core-banking software is too expensive for small annual cycles.
- **Data moat:** Payout-to-contribution ratio benchmarks for Kenyan Chamas.

## 8. ArtisanBill
- **Niche:** Jua Kali "Piecework" Invoicing
- **Evidence:** `https://juakalismart.com/` - verified pain around order tracking.
- **Problem:** Workshop owners lose track of material costs vs labor on complex furniture or metalwork orders.
- **Solution:** 
  - `POST /v1/orders`: Define order, deposit, and estimated completion.
  - `POST /v1/invoices/generate`: Create WhatsApp-shareable PDF invoices with itemized labor/materials.
  - `GET /v1/orders/aging`: List of unpaid or overdue workshop orders.
- **Integration:** Pesapal for deposit collection and final payment settlement.
- **Customer:** Owner of a Jua Kali workshop (Small Business < 50 employees).
- **Price:** KES 1,500/month.
- **Why ignored:** Low-trust environment; needs a simple, portable API for non-technical workshop owners to use via WhatsApp bots.
- **Data moat:** Historical material cost vs finished product price data for informal manufacturing.

## 9. MaterialLog
- **Niche:** Jua Kali "Piecework" Invoicing
- **Evidence:** `https://fumbua.ke/guides/business-bookkeeping/` - simple income/expense tracking recommendation.
- **Problem:** Sole traders in Gikomba/Kamukunji don't know if they are profitable because they don't track material waste.
- **Solution:** 
  - `POST /v1/usage/materials`: Log quantity of timber/metal used for an order.
  - `GET /v1/reports/margin`: Real-time profit margin calculation per order.
  - `GET /v1/inventory/alerts`: Low-material notifications.
- **Integration:** Africa's Talking (SMS) for automated reorder reminders to suppliers.
- **Customer:** Jua Kali Sole Trader.
- **Price:** KES 300/month (Matches physical receipt book cost).
- **Why ignored:** Perceived low-margin customer; ignore high volume of small traders.
- **Data moat:** Benchmarks for material efficiency in informal sector manufacturing.

## 10. FundiTrack
- **Niche:** Jua Kali "Piecework" Invoicing
- **Evidence:** AMSEK (Association of Micro and Small Enterprises of Kenya) - verified pain around fundi reputation/skills.
- **Problem:** Workshop owners struggle to find reliable "fundis" for piecework during high-volume contract periods.
- **Solution:** 
  - `GET /v1/fundis/:id/history`: Skill certification and past piecework performance.
  - `POST /v1/ratings/piecework`: Post-completion rating of quality and timeliness.
  - `GET /v1/fundis/search`: Find available fundis by skill/location.
- **Integration:** Africa's Talking (Voice/SMS) to verify fundi identities.
- **Customer:** Small business owner (workshop proprietor).
- **Price:** KES 2,000/month for "Gold Bench" access.
- **Why ignored:** Informal labor market is messy; needs a structured API to manage reputation.
- **Data moat:** The first verifiable reputation and work-history dataset for Jua Kali informal laborers.
