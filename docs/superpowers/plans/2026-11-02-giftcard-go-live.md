# Gift Card Online Sales — Go-Live Plan (with electronic invoicing decision)

- **Date:** 2026-11-02
- **Builds on:** `docs/superpowers/plans/2026-09-19-giftcard-shop-launch.md` (Tasks 1–7, 10–12 done and deployed behind `FEATURES.giftShop=false`; Task 8 E2E paused on Tilopay; Task 9 flip pending) and `docs/superpowers/specs/2026-09-18-giftcard-shop-launch-design.md`.
- **Ledger:** `.superpowers/sdd/2026-09-19-giftcard-shop-launch/progress.md`

## 0. The invoicing decision (blocks Part B only)

**Current fiscal rule (accountant, 2026-08-17, encoded in `src/lib/efactura/emit.ts`, `buildInvoice.ts`, `fromMindbodySale.ts`):** a gift card sale is stored value, not a sale: receipt only. The factura is emitted at redemption, listing the service with its ITBMS and the gift card as *forma de pago 07*. Online gift card orders therefore never reach efactura today, by design.

**Owner request (2026-11-02):** every online gift card sale must send an electronic invoice through the existing efactura interface.

These conflict. Invoicing at sale **and** at redemption double-declares revenue and ITBMS. Before Part B starts, the owner obtains one of:

| Ruling | What it means for the build |
|---|---|
| **R1 — keep the rule** (receipt at sale, factura at redemption) | Part B is not built. The "interface" requirement is met at redemption as today (bridge now, counter sweep after cutover). The buyer gets the existing receipt email. Go-live = Part A only. |
| **R2 — invoice at sale** (factura for the gift card, exempt ITBMS for monetary cards, 7% for experiences; redemption then books the service against forma 07 without a new factura, or with one that nets to zero per the accountant's instruction) | Part B is built as specified below. The accountant must also say how the redemption document looks so the counter cutover follows the same rule. |

Also required before Part B, regardless of ruling: **efacturapty's written answer** on whether the bridge invoices the Mindbody `purchasegiftcard` sale the shop registers (if yes under R2, we must stop registering the sale in Mindbody as a sale, or get them to exclude channel-online sales, before emitting ourselves).

**Recommendation:** ask the accountant to confirm R1 or R2 this week; ask efacturapty the bridge question in the same message. Start Part A today; it is identical under both rulings.

---

## Part A — Launch readiness (same under R1 and R2)

### A1. Clear the two production hazards found in the Sep 22 health check (owner, 10 min)

1. **`GIFTCARD_TEST_MODE` in Vercel Production.** Its value is hidden. The variable prefixes `[TEST] ` on *every* email (`src/lib/email/resend.ts:35`): bookings, reminders, lifecycle, not only gift cards. Check one recent customer email or the Resend dashboard. If the prefix is there, delete the variable in Vercel (Production and Preview) and redeploy. The local test server sets it on its own.
2. **Tilopay.** The Sep 21 test purchase failed with `402 The commerce has a transaction block`. Get the block lifted and the production switch date from Tilopay. Decide Yappy (on/off at launch).

### A2. Owner configuration checklist (unchanged from Task 9, with current state)

| Item | State 2026-09-22 | Needed |
|---|---|---|
| Tilopay production credentials in Vercel | test mode | production keys, block lifted |
| Mindbody gift card product IDs on catalog items (`gc_catalog_items.mindbody_giftcard_id`) | unknown | set per item, or the order is marked `skipped` (card still issued, no Mindbody record) |
| Mindbody custom tenders `Yappy Web`, `Visa/MC Web`, `AMEX Web` | unknown | must exist or registration throws (cron retries 5×) |
| Catalog items | 1 active ($50) | final denominations, experiences, images |
| WATI template `giftcard_entrega` | pending Meta approval | needed only to enable WhatsApp delivery; email launch does not wait for it |
| `gc_shop_settings.shop_enabled` | true | keep |
| Vercel cron `/api/cron/giftcard-orders` `*/10` | present | keep |
| `GIFTCARD_TEST_MODE` | present in Production | remove before flip |

### A3. Task 8 — end-to-end run in test mode (controller + owner, ~2 h)

Prerequisite: A1.2 lifted. Local server `giftshop-e2e` (port 3100, `GIFTCARD_TEST_MODE=1`), `giftShop: true` flipped locally only. The owner types the Tilopay test cards; the controller never enters card data. Steps as written in the Sep 19 plan Task 8: (1) email delivery $50, (2) self delivery, (3) scheduled email, (4) WhatsApp only after approval, (5) validation, (6) callback replay and tampered amount → `reason=invalid`, (7) Visa/MC, AMEX, Yappy, (8) gift code in the booking note, (9) deliverability (inbox placement of `regalos@` and `compras@`), (10) front-desk scan of the barcode. Evidence per step goes in the ledger.

### A4. Post-launch follow-up commit (already listed in the ledger; ship before or right after the flip)

Panama-time dates on the receipt email and the card page's "Válida hasta", dead i18n keys and props, ARIA cleanups, honest `whatsappSent` counter, `todayIso` in Panama tz, chip dismiss strips `?gc=`. One commit, reviewed, cherry-picked.

### A5. Task 9 — launch flip (controller, after A1–A3 are green and the owner says go)

1. `src/lib/nav.ts`: `giftShop: true`, `GIFT_CARDS_PATH = '/giftcards'`, add `{ path: '/giftcards', sitemap: true, priority: 0.8 }` to `PUBLIC_ROUTES`.
2. Yappy copy in `es.json`/`en.json` only if Yappy stays off.
3. Build, commit, cherry-pick to `.worktrees/main`, push; verify `/es/giftcards`, `/en/giftcards`, header and footer links, sitemap, catalog API.
4. Soft launch: one real $50 purchase by the owner, verify the email, the card page, the Mindbody record and the admin order; refund it in the Tilopay portal and set `voided_at` on the card.
5. Rollback: `gc_shop_settings.shop_enabled=false` (instant, no deploy) or revert the commit.

### A6. What the buyer receives under R1

The existing receipt email (`buyerReceiptEmail`: item, value, order number, links). If the accountant wants the receipt to state "Este comprobante no es una factura fiscal; la factura se emite al canjear la gift card", that is a one-line template change in `src/lib/email/templates/giftcard.ts` — add it to A4.

---

## Part B — Electronic invoice at sale (only under ruling R2)

Design decisions, locked so the implementation plan can be written the day the ruling arrives:

- **Emitter:** `efactura_config` row `location_id = 0` (Mimosa Online, `codigo_sucursal 0002`), the channel that never overlaps the vendor bridge. Owner fills `api_key`, `environment`, `punto_facturacion`, emitter fields, and sets `enabled=true` on that row only. Rows 1 and 2 stay disabled until the counter cutover.
- **Document:** factura `01`, one line per order: `code 'GC<catalog_item_id short>'`, description `item_name`, `quantity 1`, `inclusiveCents = total_cents`; `taxRateCode = '00'` (exento) for monetary cards, `'01'` (7%) for experiences, matching `/api/checkout` today. Payment: `mindbody_tender` (`Visa/MC Web`, `AMEX Web` → forma 03; `Yappy Web` → 99 unless the accountant prefers 08: **decision needed**). Receptor: consumidor final (02) with buyer name and email, unless the buyer supplies RUC/DV (optional fields, see below).
- **Buyer tax data:** add an optional, collapsed "¿Necesitas factura con RUC?" block on the pay step: `buyerTaxId` (RUC or cédula), `buyerDv` (DV, required only with RUC), `buyerCompanyName`. Server validates format only; a PAC rejection on the tax id falls back to consumidor final (same rule as `emit.ts` today). New `gc_orders` columns `buyer_tax_id`, `buyer_dv`, `buyer_company_name`.
- **Where the invoice attaches:** `electronic_invoices.gc_order_id UUID REFERENCES gc_orders(id)` plus a partial unique index "one active factura per gc_order" (mirror of `electronic_invoices_one_active_factura`). `gc_orders` gets `invoice_id`, `invoice_status ('pending','emitting','authorized','rejected','skipped')`, `invoice_error`, `invoice_attempts`, `invoiced_at`.
- **When:** inside `fulfillOrder`, after Step 2 (Mindbody registration) and before delivery, so the CUFE can travel in the Mindbody gift card note and the delivery email. A new `emitInvoiceForGiftOrder(orderId)` in `src/lib/efactura/emitGift.ts` reuses `buildInvoiceRequest`, `emitInvoice`, `pacRejectionMessage`, `getClientTaxIds` (buyer Mindbody client id when available). Failure never blocks fulfillment: the order is still fulfilled and delivered; `invoice_status='rejected'` and the cron retries.
- **Retries:** new pass (g) in `/api/cron/giftcard-orders`: `fulfilled` orders with `invoice_status in ('pending','rejected')`, `invoice_attempts < 5`, one call per run, batch 25; ALARM log at 5. Mirrors the Mindbody pass (c).
- **Delivery:** buyer receipt email gains a "Factura electrónica" block with `numero_documento`, CUFE and a "Descargar CAFE" link (`/api/giftcards/invoice/<order token>` streaming `fetchCafePdf`); the recipient email is unchanged (the recipient is not the buyer).
- **Refunds:** the admin gift card orders refund action also emits a nota de crédito referenced (`04`) through a `emitCreditNoteForGiftOrder(orderId)` sibling, before `voided_at` is set.
- **Admin:** un-gate `/admin/facturas` from `FEATURES.bag` to `FEATURES.bag || FEATURES.giftShop` and show `gc_orders` invoices in it (column "Pedido" links to `/admin/giftcards/orders/<id>`).
- **Mindbody side:** keep `purchasegiftcard` registration only if efacturapty confirms the bridge excludes it; otherwise register the gift card in Mindbody with a note "Facturado en línea CUFE …" and have efacturapty exclude channel-online sales in writing before the flip.
- **Testing without a PAC sandbox:** the account is live. The E2E emits one real minimum-value factura from sucursal 0002 and cancels it the same day with `cancelInvoice` (reason: prueba de puesta en marcha). The accountant is told the date and CUFE.
- **Sequencing:** Part B ships behind `efactura_config(0).enabled=false`; the gift shop can go live under R1 first and switch to invoicing later without touching the shop UI, except the optional RUC block.

Estimated size once the ruling lands: 8 implementation tasks (migration; checkout + UI tax block; `emitGift.ts` with dry-run tests; fulfillment hook; cron pass; receipt email + CAFE download route; admin console; refund credit note), run subagent-driven like the shop, roughly two working days plus the live test.

---

## Owner actions this week

1. Accountant: confirm **R1 or R2** (and, under R2, the redemption document and the Yappy payment form code).
2. efacturapty: does the bridge invoice the Mindbody online `purchasegiftcard` sale? Written answer.
3. Vercel: check and remove `GIFTCARD_TEST_MODE` if it is `1`.
4. Tilopay: lift the transaction block, production switch date, Yappy decision.
5. Mindbody: gift card product IDs on each catalog item; the three `… Web` tenders.
6. Catalog: final items and images in `/admin/giftcards` shop settings.
7. Say "retry" for the E2E run once Tilopay is unblocked.
