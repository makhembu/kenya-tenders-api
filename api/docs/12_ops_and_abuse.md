# Phase 12 — Onboarding, Ops & Abuse Policy

## 1. Onboarding Guide (For Treasurers)
- **Step 1: API Registration.** Treasurer registers the Chama on the BakiPay dashboard (Simulated via CLI).
- **Step 2: Member Import.** Use `POST /v1/members` to bulk upload the existing member list from an Excel export.
- **Step 3: History Backfill.** Log past year contributions using `POST /v1/contributions` with historical dates.
- **Step 4: Payout Simulation.** Run `POST /v1/payouts/calculate` to verify that the API's math matches the group's "Constitution" rules.

## 2. Operations Manual
- **Monitoring:** Monitor `X-Request-ID` in logs for failed M-Pesa callbacks.
- **Support:** Priority given to "Payout Blockers" (Errors in `v1/payouts`).
- **Data Retention:** 7 years as per Kenya Tax laws for financial records.

## 3. Abuse & Data Policy
- **No Private Data Sale:** BakiPay will never sell contribution patterns to third-party lenders.
- **Group Privacy:** Only authenticated admins with a valid `Idempotency-Key` and `API-Key` can see group financial summaries.
- **Abuse Prevention:** Strictly enforced rate limits (60 RPM) to prevent scraping of member phone numbers.
- **Kenya DPA:** We act as a "Data Processor"; the Chama is the "Data Controller."
- **Suspension Policy:** Accounts involved in fraudulent B2C payout requests (e.g., mismatch between member name and M-Pesa KYC) will be flagged for manual review within 12 hours.
