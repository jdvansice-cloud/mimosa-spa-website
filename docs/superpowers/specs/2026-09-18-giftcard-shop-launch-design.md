# Gift Card Online Shop Launch — Design

- **Date:** 2026-09-18
- **Status:** approved in brainstorming, pending implementation plan
- **Owner decisions:** standalone gift shop, no services in the bag, no online payment for bookings, recipient receives the card by email or WhatsApp

## 1. Goal

Sell gift cards on www.mimosaretreat.com with electronic delivery. A buyer picks a card, says who it is for and how it should reach them, pays with Tilopay, and the recipient gets the card by email or WhatsApp with a code they present at the spa. The flow must be obvious to a first-time visitor on a phone.

## 2. Decisions taken

| Decision | Choice | Why |
|---|---|---|
| Purchase flow | Standalone 3-step shop at `/[locale]/giftcards` | Simplest to understand; no coupling to prepaid bookings or invoicing |
| Shared bag (`FEATURES.bag`) | Stays **off** | The bag requires `checkout_enabled`, which also turns on prepaid service bookings and therefore direct DGI invoicing |
| Online payment for bookings | **Not** in this sub-project | Owner: "just the gift card option, no services for now" |
| Redemption | At the spa: front desk scans or types the serial at the Mindbody POS | No online payment exists, so no online balance application |
| Delivery | Email and/or WhatsApp, chosen explicitly by the buyer; or the buyer hands it over themselves | Owner requirement: recipient receives an email or WhatsApp message with the card |
| Fiscal | Gift-card sale emits **no invoice**, only the receipt email | Accountant ruling Aug 17 2026, already encoded (invoice at redemption with forma de pago 07) |

## 3. Current state (verified 2026-09-18)

- **Production (`main`)** has the August gift-shop scaffolding behind `FEATURES.giftShop = false`. Its fulfillment is the pre-Aug-18 version: it does not use the MO serial series, does not send the serial as the Mindbody barcode, and predates the column-name fix. It must not launch.
- **Branch `feat/unified-checkout-efactura`** holds the tested version in 9 commits: `1a6331a5`, `aff00f5a`, `d377e77d`, `4163d7ff`, `be9c170a`, `5d40e1f3`, `9357696b`, `198361c0`, `04ab69cf`. The current checkout (`feat/wati-ai-receptionist`) was forked from that branch and contains the same files unchanged since Aug 23.
- **Database:** all migrations through `20260920_pos_invoicing.sql` are applied per the Aug 23 summary and the Sep 5 handoff. No new migration is needed for this work. `gc_shop_settings.shop_enabled` is already `true`; `whatsapp_delivery_enabled` is `false`.
- **Tilopay:** credentials in Vercel and `.env.local`; account in **test mode**. `GIFTCARD_TEST_MODE=1` prefixes emails with `[TEST]` and makes the Mindbody registration a `Test:true` preflight.
- **Resend:** domain verified; senders `regalos@` (recipient), `compras@` (buyer receipt), `citas@` (appointments).
- **WATI:** template `giftcard_entrega` has not been created. Delivery code exists and is gated by the setting plus the template.
- **Merge state:** a test merge of the branch onto `main` conflicts in 16 files, all outside the gift-shop purchase path: gift-card staff screens (`issue`, `issued`, `issued/[id]`, its API route), `ClientLookupInput`, `GiftCardDetail`, `adminNav`, TV agenda files, `package.json`, `package-lock.json`, `.env.example`, `tsconfig.json`, two spike scripts.

## 4. Architecture

### 4.1 Unchanged purchase pipeline

```
/[locale]/giftcards (GiftShopClient, 3 steps)
  → POST /api/giftcards/checkout        creates gc_orders(pending), returns Tilopay hosted URL
  → Tilopay hosted payment (cards, Yappy when enabled)
  → GET /api/giftcards/checkout/callback validates OrderHash, marks paid (idempotent), runs fulfillment
  → fulfillOrder: mint MO serial → gift_cards row → Mindbody purchasegiftcard (serial as BarcodeId)
                  → bonus rule → deliverOrder
  → deliverOrder: recipient email (if address) + buyer receipt (always) + WhatsApp template (if opted in and enabled)
  → /api/cron/giftcard-orders every 10 min: completes stuck paid orders, sends scheduled deliveries,
    retries Mindbody, expires abandoned drafts, flags paid-but-unfulfilled
```

No change to `fulfillOrder`, the callback, Tilopay signing, serial minting or Mindbody registration.

### 4.2 Foundation: land the branch on `main`

Cherry-pick the 9 commits onto `main` in order, with every new switch off:

- `FEATURES.bag = false`, `checkout_settings.checkout_enabled = false`, all three `efactura_config.enabled = false`. Publishing turns nothing on.
- Conflict policy: keep **main's** version for the gift-card staff screens, `ClientLookupInput`, `GiftCardDetail`, TV agenda and `adminNav` entries that main already has; union for `package.json`, `.env.example`, `tsconfig.json`; regenerate `package-lock.json` with `npm install`; keep both spike scripts.
- Gate the four inert admin consoles (`/admin/pedidos`, `/admin/facturas`, `/admin/impresion`, `/admin/promocodes`) in `adminNav.ts` behind `FEATURES.bag` so staff never see empty screens. The routes remain reachable by URL for testing.
- `vercel.json` gains the `orders` and `efactura` crons. Both find nothing and return zero counts; acceptable.
- `npm run build` must pass. Deploy by pushing `main`.
- Never `git add` Finder-duplicate files (` 2.ts`, ` 10.tsx`, …) or `.next/`.

### 4.3 Shop UI: explicit delivery choice (step 2)

`GiftShopClient` step "Personaliza" gets a required control **"¿Cómo se lo entregamos?"** with three options:

| Option | Fields shown | Server flags |
|---|---|---|
| Por correo | recipient email (required) | `delivery_email = true`, `delivery_whatsapp = false` |
| Por WhatsApp | recipient phone via `PhoneInput` (required) | `delivery_email = false`, `delivery_whatsapp = true` |
| Yo se lo entrego | none; helper text "Recibirás el enlace de la gift card en tu comprobante" | both `false` |

- Exactly one channel per order. Each option shows only its own field; the other contact field is not offered, so the buyer never wonders whether both will be used. The server keeps its existing rule (email whenever an address exists, WhatsApp additive), which with one field filled means one delivery.
- The **WhatsApp option is hidden** until `whatsapp_delivery_enabled` is true. `GET /api/giftcards/catalog` exposes `whatsappDeliveryEnabled` for this.
- The **send-date field is hidden** for "Yo se lo entrego" (nothing is sent to a recipient).
- Request body gains `deliveryMethod: 'email' | 'whatsapp' | 'self'`. `POST /api/giftcards/checkout` validates it, requires the matching contact field, and derives the two flags. Requests without `deliveryMethod` keep today's derivation for backward compatibility.
- Recipient name stays required in all three cases (it prints on the card).

### 4.4 Thank-you page (`/[locale]/giftcards/gracias`)

One sentence built from the order: who receives it, by which channel, and when.

- email: "María recibirá su gift card por correo (maria@…) ahora mismo." / "… el 20 de septiembre."
- whatsapp: "María recibirá su gift card por WhatsApp (+507 6…) …"
- self: "Aquí tienes la gift card para María." with the card link and a **"Enviar por WhatsApp"** button (existing `wa.me` forward text).
- Always: "Enviamos tu comprobante a {buyer_email}."

`gc_orders` already stores `delivery_email`, `delivery_whatsapp`, `recipient_email`, `recipient_phone`, `scheduled_send_at`; no schema change.

### 4.5 Recipient card page and gift email copy

Replace the online-payment promise with redemption at the spa, in ES and EN:

- Card page (`/gift/[token]`): button **"Reservar mi cita"** → `/es/reservar?gc=<code>` (EN → `/en/reservar`). Note: "Elige tu tratamiento y horario. Presenta este código al pagar en el spa."
- Recipient email footnote: "Reserva en línea o por WhatsApp y presenta este código al pagar en el spa."
- The card conditions block (from `/admin/giftcards/settings`) already says to present the card at the spa; unchanged.

### 4.6 Booking widget: gift code rides along

`BookingPageContent` already stores `?gc=` in `sessionStorage['mimosa-gc']`.

- **Chip:** the widget shows a small gold chip "Gift card ····{last 4} lista para usar en el spa" on the services and confirm steps while a code is stored. Dismissable; dismiss clears the storage key.
- **Notes:** `POST /api/mindbody/book` accepts optional `giftCode` (uppercase alphanumeric and hyphen, max 20 chars, otherwise ignored). It appends `Gift card: <code>` to the existing `noteParts` joined by ` | `, so the front desk sees it on the Mindbody appointment.
- **Success step** repeats the chip text. Storage key is cleared after a successful booking.
- No validation against `gift_cards` at booking time (the code is informational; the POS validates at payment).

### 4.7 Cron: WhatsApp delivery after template approval

`/api/cron/giftcard-orders` gets pass **(c)**: when `whatsapp_delivery_enabled` is true, select up to 20 orders with `status = fulfilled`, `delivery_whatsapp = true`, `recipient_phone` not null, `whatsapp_sent_at` null, `whatsapp_error` null, `scheduled_send_at` null or past, and call `deliverOrder`. `deliverOrder` is idempotent: the email block is skipped by `email_sent_at`, so only the WhatsApp template is sent. This gives every pre-approval order exactly one automatic attempt. An attempt that fails records `whatsapp_error` and is not retried automatically; it stays visible with its error text in `/admin/giftcards/orders` for manual follow-up, and the buyer's receipt already carries the WhatsApp forward link as the fallback. No schema change.

### 4.8 Launch flips (single commit on `main`)

- `FEATURES.giftShop = true`
- `GIFT_CARDS_PATH = '/giftcards'`
- Pay CTA copy: "Pagar con tarjeta o Yappy" if the owner confirms Yappy is enabled in Tilopay, otherwise "Pagar con tarjeta". Same rule for the page subtitle.
- Vercel: remove `GIFTCARD_TEST_MODE`. Tilopay: switch account to production. These two happen together, immediately before the flip deploys.

## 5. Copy and i18n

All new strings go in `src/messages/es.json` and `en.json` under `giftShop` (delivery choice labels, helper texts, thank-you sentences) and in the existing inline ES/EN pairs for the card page and emails. Spanish is the primary voice; English mirrors it. No `title-decorated` class; follow the marketing `SectionHeader` system already on the page.

## 6. Error handling

Existing behaviour is kept: 503 while the shop is disabled or Tilopay is unconfigured, honeypot field, per-buyer rate limit, forged-hash callback lands on the error page with the order left pending, replayed callback is a no-op, fulfillment is checkpointed per column and the cron completes it. New code adds only field validation for `deliveryMethod` and `giftCode`, returning 400 with a Spanish message consistent with the existing ones.

## 7. Testing

**Unit (vitest, already in the repo):**
- `deliveryFlagsFor(deliveryMethod, email, phone)` → flags and validation errors.
- `thankYouSentence(order, locale)` → the four variants, with and without a scheduled date.
- `sanitizeGiftCode(input)` → accepted and rejected inputs.
- Note builder: `giftCode` appended after the existing parts.

**End to end in test mode on the production URL (Tilopay still in test mode, `GIFTCARD_TEST_MODE=1`):**
1. One purchase per delivery choice: email, WhatsApp (after template approval), self.
2. One purchase per payment method: Visa, Mastercard, AMEX, Yappy when enabled. Check "Método" in `/admin/giftcards/orders` and the tender on the Mindbody sale.
3. Scheduled send: date tomorrow, confirm the cron delivers it.
4. Replay the exact callback → no duplicate; alter `amount` → `invalid` error page.
5. Kill fulfillment after the card insert → cron completes without a second card, bonus or email.
6. Deliverability to Gmail, Outlook and iCloud: DKIM pass, not spam.
7. Front desk scans the barcode on `/gift/[token]` from a phone at the POS.
8. Book from the card page: chip shows, Mindbody note carries `Gift card: <code>`.

**Soft launch (production mode):** one real purchase, one Yappy if enabled, one refund through the Tilopay portal with the card voided in Supabase (`voided_at`).

## 8. Owner checklist (outside the code)

1. Tilopay: switch the account to production. Enable Yappy Comercial via Banco General if wanted at launch.
2. Vercel (scope `mimosa-spa`): confirm `TILOPAY_API_KEY`, `TILOPAY_API_USER`, `TILOPAY_PASSWORD`, `RESEND_API_KEY`, `GIFTCARD_EMAIL_FROM`, `PURCHASE_EMAIL_FROM` exist in Production; remove `GIFTCARD_TEST_MODE` at launch; confirm the plan runs `*/10` crons.
3. Mindbody: every active catalog item has its Mindbody gift-card product ID in `/admin/giftcards/shop`; custom tenders **Yappy Web**, **Visa/MC Web**, **AMEX Web** exist.
4. WATI: create template `giftcard_entrega` (UTILITY, Spanish). Body: "Hola {{nombre}} 🎁 {{remitente}} te envió una Gift Card de Mimosa Spa por {{monto}}. Tócala aquí para verla." Dynamic URL button: `https://www.mimosaretreat.com/gift/{{1}}`. Submit to Meta; on approval tick "Entrega por WhatsApp" in `/admin/giftcards/shop`.
5. Catalog: activate the denominations and experiences to sell, with images, in `/admin/giftcards/shop`.

## 9. Rollout and rollback

1. Land the branch on `main` (switches off). Deploy. Smoke-test admin and the public menu.
2. Ship the UI and cron changes. Deploy. Run the test-mode E2E on the production URL.
3. Owner completes the checklist. Template approval can arrive after launch; WhatsApp switches on independently.
4. Launch flip commit + Tilopay production + env change. Soft launch.

Rollback at any point: set `FEATURES.giftShop = false` and `GIFT_CARDS_PATH = '/menu/giftcards'` (one commit) or set `shop_enabled = false` in the database (immediate 503 on checkout, page shows "muy pronto"). Cards already sold remain valid.

## 10. Out of scope

Shared bag and prepaid bookings, online invoicing of any order, gift cards as an online payment method, one-click refunds, the bonus redemption screen, corporate orders, showing the remaining balance on the card page.
