# Phase 14 — Legal, Data & Kenya DPA Compliance

## 1. ODPC Registration
- **Requirement:** As BakiPay handles financial and identifying data of Kenyan citizens (PII), registration with the Office of the Data Protection Commissioner (ODPC) as a **Data Processor** is mandatory.
- **Category:** "Financial Services" / "Telecommunications Adjacency."
- **Annual Fee:** KES 4,000 (for Small Entities).

## 2. Personal Identifiable Information (PII) Inventory
| Field | Reason for Processing | Protection Level |
|-------|-----------------------|------------------|
| Member Name | Dividend Attribution | Encrypted at Rest |
| Member Phone | Payout (M-Pesa) | High (Tokenized where possible) |
| Contribution Amt | Dividend Logic | Auditable Log |

## 3. Data Localization
- Cloudflare Workers data in KV is globally distributed.
- **Compliance Action:** For strict DPA compliance, we utilize Cloudflare's **Jurisdictional Overrides** (where available) or document that financial "transaction metadata" is the primary storage, with the "Source of Truth" remaining the Chama's legal registration book.

## 4. Right to Erasure
- Members have the right to request deletion of their phone numbers from the API registry.
- **Implementation:** `DELETE /v1/members/:id` will mask the phone and name but retain the contribution amount to preserve total group ledger integrity.

## 5. Security Guardrails
- **Encryption:** All transit is via TLS 1.3.
- **Logging:** No raw CSV contribution data is logged in plain text. Only `group_id` and `transaction_id`.
- **Privacy Policy:** Must be displayed (or referenced via SMS) when a member is first registered by the Treasurer.
