# Home Care Plan launch record

Release: 2026-10-04.1. Production project: itclasssamplewebsite,
prj_gLbAlV2xcXufIJ7qo39xtMyMXLtx. Domain: www.operationcleanfreedom.com.
Rollback source: 75bc19bc84c99f25ba9bbbe7870244387ac0dd00,
branch rollback/pre-home-care-2026-10-04. Previous production:
dpl_BJTQEMaR12Q7oaibkNm97RaTh1U6.

## Implemented scope

All seven service categories are selectable in the original builder. Choices,
frequency, property details and payment preference stay in the same editable
device-local draft. The server revalidates catalog and pricing at review.
Every unpriced selection remains visible as quote pending, with null amounts.
Only the documented annual exterior-window entry scope (up to 20 standard,
readily accessible windows, normal maintenance soil, exterior glass) has a
conditional $240 annual maintenance estimate. Source: existing OCF Outreach
Tracker, Maintenance Pilot B26. Initial window cleaning is still separately
quoted. Driveway and gutter handoff examples remain conditional examples;
their eligibility rules have not been established, so they are not payable rates.
Monthly standard pricing, quarterly 2% and annual prepayment 5% are calculated
in integer cents without stacking another discount. Tax is not fabricated.

## Customer handoff

The customer reviews the plan, then explicitly sends its full text to the
verified Quo number +13466236767, or copies it into the existing secure
Jobber request form. Opening a composer is not sending; opening the Jobber
form is not submission. Draft storage is not a Jobber record. No direct
website-to-Jobber plan-save endpoint is claimed.

The sole existing inbound responder must match the request reference and
contact/property against live Jobber before creating or updating a request.
Keep all selections, requested frequencies, scope answers and quote-pending
items in request details. Verify service/address or ZIP/timeframe/intent/contact
preference before notifying Eric. A submission is never an appointment.
Confirm actual price, scope, duration and complete availability before booking.
Honor opt-outs, takeover, dedup, quota and existing transaction locks.

## Billing and agreements

Checkout and automatic maintenance activation are disabled. This release
creates no invoices, subscriptions, charges, signed contracts or accounting
entries. Reuse Jobber's supported quote/signing/payment path; never add a
second billing system. A customer-specific finalized agreement must retain
the accepted scope, pricing/terms versions, 12-month price snapshot, signature
evidence, payment authorization, future service obligations and date schedule.
Initial cleaning is separate and paid upfront. Maintenance cannot activate
until payment is confirmed, initial work completed, maintenance scope finalized
and separate recurring authorization plus accepted terms verified. Calculate
the first charge about 30 days after actual completion; rescheduling does not
start billing. Preserve signed prices until renewal and require new agreement
for renewal. No automatic first-clean surcharge. Severe/misrepresented
conditions require a documented stop before work and approval for changes.

October 4 owner decision: no refunds on voluntary cancellation, exceptions
case by case, subject to required legal rights. Do not silently create a
penalty, accelerated unpaid balance or settlement formula. Specific settlement
terms still need finalization before customer signature or paid enrollment.
Do not alter existing signed obligations. QuickBooks must distinguish completed
initial service income and future prepaid obligations using the verified
existing accounting setup; no fake test revenue is permissible.

## Verification and limits

Run: node node_modules/typescript/bin/tsc lib/home-care.ts --outDir
/tmp/ocf-home-care-tests --module commonjs --target es2020 --skipLibCheck;
node --test test/home-care.test.cjs; npm run build.
The status endpoint /api/home-care/status exposes the real quote-review mode.
API review is read-only and deterministic; duplicate review creates no records.
Reference-based responder matching reduces repeat customer handoffs; it is not
atomic, exactly-once submission protection. Native Jobber duplicate behavior,
full mobile/composer submission, contract signatures and sandbox payments
require their own end-to-end evidence before claims of completion.

Remaining dependencies: direct durable plan saving in Jobber; production
full-plan customer send and native responder log verification; supported
payment sandbox/activation API; finalized early termination settlement; verified
accounting mapping for prepaid service; actual scheduled website checks with
permissions to repair. Saved prompts and deployed pages do not prove these.
