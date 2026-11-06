# Unified Bag, Gift Cards First — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch online gift card sales through the unified bag and `/checkout` (one Tilopay checkout, `orders` pipeline, gift card fulfilment), with prepaid treatments kept behind a separate server-side switch so they can be turned on later without a rebuild.

**Architecture:** `FEATURES.bag` and `FEATURES.giftShop` go on together; the shop's details step ends in "Agregar a la bolsa", the drawer leads to `/checkout`, `POST /api/checkout` creates an `orders` row whose gift-card lines are handed to the existing `gc_orders` fulfilment (serial, Mindbody, delivery). A new `checkout_settings.services_enabled` flag (default false) gates "Pagar ahora" in the widget, service lines in the API, and the service CTAs in the bag. The standalone shop checkout (`/api/giftcards/checkout`) stays in the codebase as the rollback path (flip `bag` off and it returns).

**Tech Stack:** Next.js 16.3, React 19, zustand persisted bag store, Supabase (service role), Tilopay hosted checkout (HMAC callback), Mindbody v6, Resend, WATI, vitest (`src/**/*.test.ts`, node env).

**Spec:** `docs/superpowers/specs/2026-09-18-giftcard-shop-launch-design.md` (+ the 2026-11-02 amendment at its end) — the shop's customer rules (one delivery channel per order, WhatsApp hidden until enabled, redemption at the spa, receipt at sale) bind the bag path too. Invoicing stays on ruling R1 (receipt at sale, factura at redemption) per `docs/superpowers/plans/2026-11-02-giftcard-go-live.md` §0; Part B of that plan is unaffected.

## Global Constraints

- Bag, checkout, gracias and error copy is **inline bilingual** (`en ? '…' : '…'`), the existing pattern; the shop step components use the `giftShop` i18n namespace. Do not migrate between the two.
- Every new control ≥ **44px** tall, labelled, inline errors with `aria-describedby`.
- **Server decides**: prices from `gc_catalog_items`, delivery validity from `resolveDelivery()`, service acceptance from `checkout_settings.services_enabled`. Client values are never trusted.
- Gift-card-only orders are **captured immediately** (`capture:1`); service orders keep authorise-then-capture.
- Nothing flips in Tasks 1–9: `FEATURES.bag`, `FEATURES.giftShop`, `GIFT_CARDS_PATH`, `checkout_settings.checkout_enabled` stay as they are. Task 10 is the flip.
- Never `git add` files whose name contains a space, `.next/`, `node_modules/`, `.claude/launch.json`. Never push. Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Migrations are run by hand in the Supabase SQL editor; code tolerates a missing column by treating it as the default.
- Before each commit: `npx vitest run`, `npx tsc --noEmit`, `npm run lint` (0 errors).

---

## File structure

| File | Responsibility |
|---|---|
| `supabase/migrations/20261102_bag_giftcards_first.sql` | `checkout_settings.services_enabled`; `order_items.gc_delivery_method`, `gc_recipient_phone`, `gc_design_slug` |
| `src/app/api/checkout/config/route.ts` | expose `servicesEnabled` |
| `src/app/api/checkout/route.ts` | services gate; gift card parity (shop gate, delivery, limits); `capture` mode |
| `src/lib/orders/giftCardItems.ts` (+test) | pure: bag gift card → validated order line; order line → `gc_orders` child row |
| `src/lib/orders/pipeline.ts` | child rows from the pure helper; captured-by-callback handling |
| `src/app/api/checkout/callback/route.ts` | `capture:1` outcome |
| `src/app/api/cron/orders/route.ts` | resume gift-card-only orders stuck in `posted` |
| `src/lib/bag/store.ts` | `deliveryMethod`, `recipientPhone` on `BagGiftCard` |
| `src/components/giftshop/GiftShopClient.tsx`, `ShopStepHeader.tsx` | bag mode: validate, back button, 2-step header |
| `src/components/bag/BagDrawer.tsx`, `src/app/[locale]/checkout/CheckoutClient.tsx` | gift-card-only states, service CTAs behind the switch, generic payment note |
| `src/app/[locale]/checkout/gracias/page.tsx`, `error/page.tsx` | paid check, gift card links + thank-you sentence, gift-card error paths |
| `src/components/booking/steps/ConfirmStep.tsx` | `servicesEnabled` in `canPayOnline` |
| `src/components/admin/adminNav.ts`, `src/app/admin/pedidos/page.tsx` | nav gating, gift card child links, "Online" sucursal |
| `src/lib/nav.ts` | `FEATURES.prepay` (admin-only gate for the invoice consoles) |

---

### Task 1: Services switch and delivery columns (migration, config, API gate, widget gate)

**Files:**
- Create: `supabase/migrations/20261102_bag_giftcards_first.sql`
- Modify: `src/app/api/checkout/config/route.ts` (line 14-18), `src/app/api/checkout/route.ts` (gate at 57-62, 88, 102), `src/components/booking/steps/ConfirmStep.tsx` (12-19, 68-69), `src/lib/nav.ts` (5-11)

**Interfaces:**
- Produces: `GET /api/checkout/config` → `{ ..., servicesEnabled: boolean }`; `POST /api/checkout` → `503 { error: 'El pago en línea de servicios no está disponible todavía.' }` when `session` is present and the flag is off; `FEATURES.prepay: false` (admin nav only, Task 8).

- [ ] **Step 1: Migration**

```sql
-- supabase/migrations/20261102_bag_giftcards_first.sql
-- Launch the unified bag with gift cards only: prepaid services get their own switch,
-- and bag gift cards carry the same delivery choice as the standalone shop.
ALTER TABLE public.checkout_settings
  ADD COLUMN IF NOT EXISTS services_enabled BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS gc_delivery_method TEXT CHECK (gc_delivery_method IN ('email','whatsapp','self')),
  ADD COLUMN IF NOT EXISTS gc_recipient_phone TEXT,
  ADD COLUMN IF NOT EXISTS gc_design_slug TEXT;

COMMENT ON COLUMN public.checkout_settings.services_enabled IS
  'Prepaid treatments ("Pagar ahora" + service lines in /api/checkout). Off = gift cards only.';
```

- [ ] **Step 2: Config route**

In `config/route.ts`, select `services_enabled` with the other columns and return `servicesEnabled: row?.services_enabled === true` (false when the column is missing or the query errors).

- [ ] **Step 3: API gate**

In `src/app/api/checkout/route.ts`, right after the `checkout_enabled` 503 (line 57), where `settings` is loaded, add:

```ts
const servicesEnabled = settings?.services_enabled === true
const wantsServices = !!body.session && Array.isArray(body.session.services) && body.session.services.length > 0
if (wantsServices && !servicesEnabled) {
  return NextResponse.json({ error: 'El pago en línea de servicios no está disponible todavía.' }, { status: 503 })
}
```

Make the settings select include `services_enabled` (tolerate a missing column: if the select errors with a message matching `/services_enabled/`, retry selecting only `checkout_enabled` and treat services as off).

- [ ] **Step 4: Widget gate**

`ConfirmStep.tsx`: add `servicesEnabled: boolean` to `CheckoutCfg`; change the gate to

```ts
const canPayOnline =
  FEATURES.bag && !!checkoutCfg?.enabled && !!checkoutCfg?.servicesEnabled && !activePromotion && !replaceAppointmentId
```

- [ ] **Step 5: `FEATURES.prepay`**

`src/lib/nav.ts`: add `prepay: false,` after `bag: false,` with the comment `// Admin consoles that only matter once prepaid services are sold (facturas, impresión).`

- [ ] **Step 6: Verify and commit**

`npx tsc --noEmit && npm run lint`; dev server: `curl -s localhost:3000/api/checkout/config` shows `servicesEnabled:false`; `curl -s -X POST localhost:3000/api/checkout -H 'content-type: application/json' -d '{"buyerName":"A","buyerEmail":"a@b.co","session":{"services":[{"sessionTypeId":1}],"startDateTime":"2030-01-01T10:00:00"},"giftCards":[],"redemptions":[],"website":""}'` → 503 with the services message (or the `checkout_enabled` 503 if that is still off locally — both prove the gate order).

```bash
git add supabase/migrations/20261102_bag_giftcards_first.sql src/app/api/checkout/config/route.ts src/app/api/checkout/route.ts src/components/booking/steps/ConfirmStep.tsx src/lib/nav.ts
git commit -m "feat(checkout): services_enabled switch; bag gift-card delivery columns"
```

---

### Task 2: Pure gift card line helpers with tests

**Files:**
- Create: `src/lib/orders/giftCardItems.ts`, `src/lib/orders/giftCardItems.test.ts`

**Interfaces:**
- Consumes: `resolveDelivery` from `src/lib/giftshop/delivery.ts` (`resolveDelivery({ deliveryMethod, recipientEmail, recipientPhone })` → `{ ok: true, method, recipientEmail, recipientPhone, deliveryEmail, deliveryWhatsapp, allowSchedule } | { ok: false, error }`), `itbmsCentsFor(item)` from `src/lib/giftshop/data.ts`.
- Produces:

```ts
export interface BagGiftCardInput {
  catalogItemId: string
  recipientName?: string
  recipientEmail?: string
  recipientPhone?: string
  deliveryMethod?: 'email' | 'whatsapp' | 'self'   // undefined = legacy email rule in resolveDelivery
  message?: string
  deliveryDate?: string   // YYYY-MM-DD
  designSlug?: string
}
export interface CatalogItemLite {
  id: string; kind: 'monetary' | 'experience'; name_es: string; name_en: string
  amount_cents: number; itbms_cents: number; treatment_names?: string[] | null; default_design_slug?: string | null; is_active: boolean
}
export interface GiftCardLine {
  catalogItemId: string; kind: 'monetary' | 'experience'; nameEs: string; nameEn: string
  unitPriceCents: number        // tax-inclusive
  taxRateCode: '00' | '01'; taxCents: number
  recipientName: string; recipientEmail: string | null; recipientPhone: string | null
  deliveryMethod: 'email' | 'whatsapp' | 'self'; deliveryEmail: boolean; deliveryWhatsapp: boolean
  message: string | null; deliveryDate: string | null; designSlug: string
  treatmentNames: string[] | null
}
export type GiftCardLineResult = { ok: true; line: GiftCardLine } | { ok: false; error: string }

export function buildGiftCardLine(input: BagGiftCardInput, item: CatalogItemLite | undefined, opts: {
  whatsappEnabled: boolean; todayIso: string /* YYYY-MM-DD, Panama */
}): GiftCardLineResult

/** Row for gc_orders, built from an order_items row + its parent order (used by handoffGiftCardItems). */
export function giftCardChildRow(args: {
  orderNumber: string; index: number; order: { buyer_name: string | null; buyer_email: string; buyer_phone: string | null; locale: string | null; location_id: number | null; hasServices: boolean }
  item: { gc_catalog_item_id: string; name_es: string; total_cents: number; tax_cents: number; gc_recipient_name: string | null; gc_recipient_email: string | null; gc_recipient_phone: string | null; gc_delivery_method: string | null; gc_message: string | null; gc_delivery_date: string | null; gc_design_slug: string | null }
  catalog: { kind: 'monetary' | 'experience'; treatment_names?: string[] | null } | undefined
  payment: { tilopay_tpt: string | null; tilopay_method: string | null }
  nowIso: string
}): Record<string, unknown>
```

Rules for `buildGiftCardLine`: unknown or inactive item → `{ok:false,error:'Gift card no disponible'}`; `recipientName` trimmed 1–120 required → `'Indica el nombre de quien recibe'`; delegate email/phone/method to `resolveDelivery` (its error passes through); `whatsapp` when `!whatsappEnabled` → `'La entrega por WhatsApp no está disponible todavía.'`; `message` trimmed ≤300 else null; `deliveryDate` must match `/^\d{4}-\d{2}-\d{2}$/`, be ≥ `todayIso`, and is dropped (null) when `!allowSchedule`; `unitPriceCents = amount_cents + itbms_cents`, `taxCents = itbms_cents`, `taxRateCode = kind === 'experience' ? '01' : '00'`; `designSlug = input.designSlug || item.default_design_slug || 'general'`.

Rules for `giftCardChildRow`: `order_number: `${orderNumber}-G${index + 1}``, `status:'paid'`, `paid_at: nowIso`, `catalog_item_id`, `item_kind: catalog?.kind ?? 'monetary'`, `item_name: name_es`, `base_amount_cents: total - tax`, `itbms_cents: tax`, `total_cents`, `currency:'USD'`, buyer fields, `recipient_name: gc_recipient_name ?? buyer_name ?? buyer_email`, `recipient_email`, `recipient_phone`, `gift_message`, `delivery_email: method === 'email'`, `delivery_whatsapp: method === 'whatsapp'` (method defaults to `email` when `gc_recipient_email` is set, else `self`), `scheduled_send_at: gc_delivery_date ? `${date}T14:00:00.000Z` : null`, `design_slug`, `locale: locale ?? 'es'`, `mindbody_location_id: hasServices ? location_id : null`, `tilopay_tpt`, `tilopay_method`, `gift_treatment_names: catalog?.treatment_names ?? null`.

- [ ] **Step 1: Failing tests**

```ts
// src/lib/orders/giftCardItems.test.ts
import { describe, it, expect } from 'vitest'
import { buildGiftCardLine, giftCardChildRow } from './giftCardItems'

const item = { id: 'i1', kind: 'monetary' as const, name_es: 'Gift Card $50', name_en: 'Gift Card $50', amount_cents: 5000, itbms_cents: 0, is_active: true, default_design_slug: 'general' }
const exp = { ...item, id: 'i2', kind: 'experience' as const, amount_cents: 10000, itbms_cents: 700, treatment_names: ['Mimosa Relax'] }
const opts = { whatsappEnabled: false, todayIso: '2026-11-02' }

describe('buildGiftCardLine', () => {
  it('builds an email-delivery monetary line', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i1', recipientName: ' María ', recipientEmail: 'maria@example.com', deliveryMethod: 'email', message: 'Feliz cumple' }, item, opts)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.line).toMatchObject({ kind: 'monetary', unitPriceCents: 5000, taxCents: 0, taxRateCode: '00', recipientName: 'María', recipientEmail: 'maria@example.com', deliveryMethod: 'email', deliveryEmail: true, deliveryWhatsapp: false, designSlug: 'general', deliveryDate: null })
    }
  })
  it('experience cards carry 7% and treatment names', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i2', recipientName: 'Ana', deliveryMethod: 'self' }, exp, opts)
    expect(r.ok && r.line.taxRateCode).toBe('01')
    expect(r.ok && r.line.unitPriceCents).toBe(10700)
    expect(r.ok && r.line.treatmentNames).toEqual(['Mimosa Relax'])
  })
  it('rejects unknown/inactive items and missing recipient name', () => {
    expect(buildGiftCardLine({ catalogItemId: 'x' }, undefined, opts)).toEqual({ ok: false, error: 'Gift card no disponible' })
    expect(buildGiftCardLine({ catalogItemId: 'i1' }, { ...item, is_active: false }, opts)).toEqual({ ok: false, error: 'Gift card no disponible' })
    expect(buildGiftCardLine({ catalogItemId: 'i1', recipientEmail: 'a@b.co', deliveryMethod: 'email' }, item, opts)).toEqual({ ok: false, error: 'Indica el nombre de quien recibe' })
  })
  it('passes resolveDelivery errors through and blocks whatsapp while disabled', () => {
    expect(buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'email' }, item, opts)).toEqual({ ok: false, error: 'Indica el correo de quien recibe' })
    expect(buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'whatsapp', recipientPhone: '+507 6000-0000' }, item, opts)).toEqual({ ok: false, error: 'La entrega por WhatsApp no está disponible todavía.' })
    const ok = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'whatsapp', recipientPhone: '+507 6000-0000' }, item, { ...opts, whatsappEnabled: true })
    expect(ok.ok && ok.line.deliveryWhatsapp).toBe(true)
    expect(ok.ok && ok.line.recipientPhone).toBe('50760000000')
  })
  it('drops past and self-delivery dates, keeps future email dates', () => {
    const past = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate: '2026-11-01' }, item, opts)
    expect(past).toEqual({ ok: false, error: 'La fecha de envío debe ser hoy o después' })
    const self = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'self', deliveryDate: '2026-12-01' }, item, opts)
    expect(self.ok && self.line.deliveryDate).toBeNull()
    const fut = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate: '2026-12-01' }, item, opts)
    expect(fut.ok && fut.line.deliveryDate).toBe('2026-12-01')
  })
})

describe('giftCardChildRow', () => {
  const base = {
    orderNumber: 'MO-001234', index: 0,
    order: { buyer_name: 'Juan', buyer_email: 'juan@x.co', buyer_phone: '50761111111', locale: 'es', location_id: 2, hasServices: false },
    item: { gc_catalog_item_id: 'i1', name_es: 'Gift Card $50', total_cents: 5000, tax_cents: 0, gc_recipient_name: 'María', gc_recipient_email: null, gc_recipient_phone: '50760000000', gc_delivery_method: 'whatsapp', gc_message: 'Hola', gc_delivery_date: '2026-12-01', gc_design_slug: 'navidad' },
    catalog: { kind: 'monetary' as const }, payment: { tilopay_tpt: 'TPT1', tilopay_method: 'card|crd|visa' }, nowIso: '2026-11-02T15:00:00.000Z',
  }
  it('maps a whatsapp card', () => {
    expect(giftCardChildRow(base)).toMatchObject({ order_number: 'MO-001234-G1', status: 'paid', item_kind: 'monetary', base_amount_cents: 5000, itbms_cents: 0, recipient_phone: '50760000000', delivery_email: false, delivery_whatsapp: true, scheduled_send_at: '2026-12-01T14:00:00.000Z', design_slug: 'navidad', mindbody_location_id: null, tilopay_tpt: 'TPT1' })
  })
  it('defaults: email when an email exists, self otherwise; experience kind + names; location with services', () => {
    const e = giftCardChildRow({ ...base, item: { ...base.item, gc_recipient_email: 'm@x.co', gc_recipient_phone: null, gc_delivery_method: null }, catalog: { kind: 'experience', treatment_names: ['Relax'] }, order: { ...base.order, hasServices: true } })
    expect(e).toMatchObject({ delivery_email: true, delivery_whatsapp: false, item_kind: 'experience', gift_treatment_names: ['Relax'], mindbody_location_id: 2 })
    const s = giftCardChildRow({ ...base, item: { ...base.item, gc_recipient_email: null, gc_recipient_phone: null, gc_delivery_method: null } })
    expect(s).toMatchObject({ delivery_email: false, delivery_whatsapp: false, recipient_name: 'María' })
  })
})
```

- [ ] **Step 2: Run** `npx vitest run src/lib/orders/giftCardItems.test.ts` → FAIL (module missing).
- [ ] **Step 3: Implement** `giftCardItems.ts` per the rules (import `resolveDelivery`; it already normalises phones to digits and enforces the 8-digit floor).
- [ ] **Step 4: Run** → PASS; `npx vitest run src/lib/giftshop/delivery.test.ts` still PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/orders/giftCardItems.ts src/lib/orders/giftCardItems.test.ts
git commit -m "feat(orders): pure gift-card line + child-row builders for the bag path"
```

---

### Task 3: Bag store carries the delivery choice

**Files:**
- Modify: `src/lib/bag/store.ts` (`BagGiftCard`, persist `version`, `migrate`)

**Interfaces:**
- Produces: `BagGiftCard` gains `deliveryMethod: 'email' | 'whatsapp' | 'self'`, `recipientPhone?: string`, `designSlug?: string`. Persist `version: 2`; migrate v1 items: `deliveryMethod = recipientEmail ? 'email' : 'self'`.

- [ ] **Step 1: Implement** the type, `addGiftCard` (unchanged signature: it receives the full item minus `key`), bump `version` to 2 and add

```ts
migrate: (persisted: unknown, version: number) => {
  const p = (persisted ?? {}) as { giftCards?: Array<Record<string, unknown>> }
  if (version < 2 && Array.isArray(p.giftCards)) {
    p.giftCards = p.giftCards.map(g => ({ ...g, deliveryMethod: g.deliveryMethod ?? (g.recipientEmail ? 'email' : 'self') }))
  }
  return p as never
},
```

- [ ] **Step 2: Verify** `npx tsc --noEmit` (the shop's `addToBag` and the checkout submit still compile because the new field is required only on the type — fix Task 4/5 call sites in their tasks; if tsc fails here on `GiftShopClient.addToBag`, add `deliveryMethod: form.deliveryMethod` there now and note it in the report).
- [ ] **Step 3: Commit**

```bash
git add src/lib/bag/store.ts src/components/giftshop/GiftShopClient.tsx
git commit -m "feat(bag): gift cards keep their delivery choice and phone"
```

---

### Task 4: Shop in bag mode — validate, back button, two-step header, drawer hand-off

**Files:**
- Modify: `src/components/giftshop/GiftShopClient.tsx` (`addToBag` 129-145, details step 272-384, bag branch 373, bottom bar 451), `src/components/giftshop/ShopStepHeader.tsx` (15), `src/messages/es.json` + `en.json` (`giftShop.stepOf`, new keys)

**Interfaces:**
- Consumes: `validateDetails()` (exists, returns boolean and sets `fieldErrors`), `addGiftCard`, `openBag`, `track`.
- Produces: in bag mode the flow is `pick → details → (Agregar a la bolsa) → drawer`; header reads "Paso {step} de {total}" with `total = FEATURES.bag ? 2 : 3`.

- [ ] **Step 1: `ShopStepHeader`** gets a `total: number` prop (default 3); use `t('stepOf', { step, total })`. Change `giftShop.stepOf` to `"Paso {step} de {total}"` / `"Step {step} of {total}"`.
- [ ] **Step 2: Details step in bag mode**
  1. `addToBag` runs `if (!validateDetails()) return` first, and saves `deliveryMethod: form.deliveryMethod, recipientPhone: form.recipientPhone || undefined, designSlug: item.default_design_slug ?? undefined` along with the existing fields. For `self` delivery, save `recipientEmail: undefined`.
  2. Replace the inline bag button at line 373 with the bottom bar for both modes: `{step === 'details' && item && (<ShopBottomBar onBack={() => setStep('pick')} onNext={FEATURES.bag ? addToBag : goToPay} nextLabel={FEATURES.bag ? t('addToBag') : t('continue')} />)}` — add an optional `nextLabel` prop to `ShopBottomBar` (default `t('continue')`). Remove the old inline button.
  3. After a successful `addToBag`: `setStep('pick')`, `setItem(null)`, `openBag()`, `track('giftshop_add_to_bag', { meta: { item: item.name_es, delivery: form.deliveryMethod } })` (keep the existing event name).
  4. New i18n keys: `giftShop.addToBag` = "Agregar a la bolsa" / "Add to bag"; `giftShop.addedToBag` = "Agregada a tu bolsa" / "Added to your bag" (shown as a 2-second toast line above the pick grid after adding).
- [ ] **Step 3: Verify** at 375px with `FEATURES.bag`/`giftShop` flipped **locally only** (`git stash` before committing): pick → details shows "Paso 2 de 2", Back works, "Agregar a la bolsa" with an empty recipient shows the inline errors, with valid data opens the drawer with the card listed as "Para María · por correo"; WhatsApp option hidden while the setting is off. Reset the flags.
- [ ] **Step 4: Commit**

```bash
git diff --quiet src/lib/nav.ts && git add src/components/giftshop/GiftShopClient.tsx src/components/giftshop/ShopStepHeader.tsx src/components/giftshop/ShopBottomBar.tsx src/messages/es.json src/messages/en.json
git commit -m "feat(giftshop): bag mode validates, keeps the back button and hands off to the drawer"
```

---

### Task 5: `/api/checkout` gift card parity and immediate capture

**Files:**
- Modify: `src/app/api/checkout/route.ts` (gift-card block 141-172, `createTilopayPayment` 325-334, order insert 226-283)

**Interfaces:**
- Consumes: `buildGiftCardLine` (Task 2), `gc_shop_settings` (`shop_enabled`, `whatsapp_delivery_enabled`), `isTilopayConfigured`.
- Produces: body `giftCards[]` items may carry `recipientPhone`, `deliveryMethod`, `designSlug`; `order_items` rows store `gc_delivery_method`, `gc_recipient_phone`, `gc_design_slug`; gift-card-only orders call Tilopay with `capture: 1`.

- [ ] **Step 1: Gates for gift card items** (before pricing them): load `gc_shop_settings` (`shop_enabled, whatsapp_delivery_enabled`); if any gift card item and `!shop_enabled` → `503 { error: 'La tienda de gift cards no está disponible todavía.' }`. Abuse guard: count `orders` with `buyer_email = body.buyerEmail` and `status in ('draft','totals_verified')` created in the last 10 minutes; `>= 5` → `429 { error: 'Demasiados intentos. Espera unos minutos.' }`.
- [ ] **Step 2: Replace the gift-card pricing block** with a loop over `body.giftCards` calling `buildGiftCardLine(gc, catalogById.get(gc.catalogItemId), { whatsappEnabled: settings.whatsapp_delivery_enabled === true, todayIso })` where `todayIso = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Panama' })`; on `!ok` return `400 { error }` (keep 409 for `'Gift card no disponible'`). Map `line` into the existing item structure (`unit_price_cents = line.unitPriceCents`, `tax_rate_code`, `tax_cents`, `name_es/en`, `gc_*` incl. the three new columns).
- [ ] **Step 3: Capture mode**: `createTilopayPayment({ capture: hasServices ? 0 : 1, ... })`. Store nothing extra; the callback reads the payment row.
- [ ] **Step 4: Verify** with curl on the dev server (shop enabled locally): a gift card with `deliveryMethod:'email'` and no email → 400 "Indica el correo de quien recibe"; whatsapp while disabled → 400 with the WhatsApp message; valid → `{ url }` (Tilopay hosted page) and an `order_items` row with `gc_delivery_method='email'`.
- [ ] **Step 5: Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "feat(checkout): gift cards in the bag follow the shop's delivery, shop and abuse rules; immediate capture"
```

---

### Task 6: Callback, pipeline hand-off, cron resume

**Files:**
- Modify: `src/app/api/checkout/callback/route.ts` (claim 91-96 and payment update), `src/lib/orders/pipeline.ts` (`handoffGiftCardItems` 502-578, capture step 173-190), `src/app/api/cron/orders/route.ts` (resume filter)

**Interfaces:**
- Consumes: `giftCardChildRow` (Task 2).
- Produces: when the Tilopay payment was created with `capture:1` (gift-card-only), the callback marks the `order_payments` row `captured` with `tilopay_tpt/auth/method` and the order `captured` (+`captured_at`, `authorized_at`); the pipeline's capture step is a no-op when the payment is already `captured`. `handoffGiftCardItems` builds each child from `giftCardChildRow` with the catalog kind. The orders cron also resumes `posted` orders with `fulfilled_at IS NULL` and `failure_code = 'posting_failed'` whose failure detail starts with `gift card` (gift-card-only orders).

- [ ] **Step 1: Callback** — after the idempotent claim, decide `const immediate = !orderHasServices` (query `order_items` for `item_type='service'`): if immediate, set the tilopay payment `status:'captured'` and the order `status:'captured', authorized_at, captured_at`; else the existing `authorized` path. Then `runPaidOrderPipeline` as today.
- [ ] **Step 2: Pipeline capture step** — guard: `if (tilopayPayment.status === 'captured') { /* captured at authorization (gift-card-only) */ } else if (tilopayPayment.status === 'authorized') { ...capture... }`; still set `status:'captured'`/`captured_at` when unset.
- [ ] **Step 3: `handoffGiftCardItems`** — load the catalog rows for the items' `gc_catalog_item_id`s once (`kind, treatment_names`), and insert `giftCardChildRow({...})` per item (keep the existing idempotent lookup by `order_number`). Delete the hand-written insert object.
- [ ] **Step 4: Cron** — extend the resume query with `.or('status.in.(authorized,booked,captured),and(status.eq.posted,fulfilled_at.is.null,failure_code.eq.posting_failed)')` (or two queries merged), same 3-minute and `posting_attempts < 5` rules.
- [ ] **Step 5: Verify** `npx vitest run` (helpers), `npx tsc --noEmit`, `npm run lint`. Dev server with a replayed callback (use the `giftshop-e2e` style local server once Tilopay is unblocked; until then, unit-level verification plus a code read of the three paths by the reviewer).
- [ ] **Step 6: Commit**

```bash
git add src/app/api/checkout/callback/route.ts src/lib/orders/pipeline.ts src/app/api/cron/orders/route.ts
git commit -m "feat(orders): immediate capture for gift-card-only orders; child rows from one builder; cron resumes stuck hand-offs"
```

---

### Task 7: Drawer and checkout for a gift-card-only bag

**Files:**
- Modify: `src/components/bag/BagDrawer.tsx` (94-108, 195, 203, footer labels), `src/app/[locale]/checkout/CheckoutClient.tsx` (369-377 empty state, 398-438 buyer fields, 578-610 summary + footer note)

**Interfaces:**
- Consumes: `GET /api/checkout/config` (`servicesEnabled`), `PhoneInput` (`src/components/shared/PhoneInput.tsx`, props `value,onChange,id,aria-*`), `GIFT_CARDS_PATH`.

- [ ] **Step 1: Drawer** — fetch config once (`useEffect` → `/api/checkout/config`, default `servicesEnabled:false`); show "Reservar un servicio" / "Agregar un servicio" only when `servicesEnabled`; empty state CTA order: gift card first; footer label `en ? 'Gift cards' : 'Gift cards'` stays but the row label for ITBMS reads `ITBMS (7%)` only when a service or an experience line exists; gift card rows show `Para {recipientName} · {en ? 'by email' : 'por correo'} | por WhatsApp | te la entregamos a ti` from `deliveryMethod` (reuse the wording of `recapLine` in `src/lib/giftshop/recap.ts` if it fits, otherwise a 3-way inline map).
- [ ] **Step 2: Checkout** —
  1. Empty state: two CTAs, gift cards (to `GIFT_CARDS_PATH`) first, services only when `servicesEnabled`.
  2. Buyer phone uses `PhoneInput` with `id="buyer-phone"`; keep optional. Email hint `en ? 'Your receipt and the gift cards go here' : 'Aquí llegan tu comprobante y las gift cards'` when the bag has gift cards.
  3. Footer note: `en ? 'Secure payment with Tilopay.' : 'Pago seguro con Tilopay.'` plus, only when `hasServices`, the existing "Tu tarjeta solo se cobra cuando la reserva queda confirmada." Remove the hardcoded methods list.
  4. Summary heading for gift-card-only: `en ? 'Your gift cards' : 'Tus gift cards'`; button label `Pagar $X`.
- [ ] **Step 3: Verify** 375px, flags flipped locally only: drawer with one gift card shows the delivery line, no service CTAs, "Pagar" → checkout shows name/email/phone, summary, `Pagar $50`; console clean; `checkout_start` tracked. Reset flags.
- [ ] **Step 4: Commit**

```bash
git diff --quiet src/lib/nav.ts && git add src/components/bag/BagDrawer.tsx 'src/app/[locale]/checkout/CheckoutClient.tsx'
git commit -m "feat(bag): gift-card-only drawer and checkout states; service CTAs behind the switch"
```

---

### Task 8: Gracias and error pages for gift card orders

**Files:**
- Modify: `src/app/[locale]/checkout/gracias/page.tsx`, `src/app/[locale]/checkout/error/page.tsx`

**Interfaces:**
- Consumes: `thankYouSentence`, `isSelfDelivery`, `longDateLabel` from `src/lib/giftshop/thankYou.ts` (`thankYouSentence(order: ThankYouOrder, locale)`; `ThankYouOrder = { recipient_name, recipient_email, recipient_phone, delivery_email, delivery_whatsapp, scheduled_send_at, buyer_email }`), `gc_orders` children (`order_number LIKE '<MO>-G%'`) and their `gift_cards.view_token`.

- [ ] **Step 1: Gracias** —
  1. Paid check: only when `order.status in ('captured','posted','invoiced','fulfilled','booked')` render "¡Pago recibido!"; otherwise render `en ? 'We are confirming your payment…' : 'Estamos confirmando tu pago…'` with the order number and the WhatsApp help link (no bag clear in this branch).
  2. Load children: `gc_orders` where `order_number like `${o}-G%`` with `gift_card_id`, then `gift_cards(view_token, serial)`; for each child render a card: `thankYouSentence(child, locale)`; if `view_token` → link "Ver gift card" to `/gift/<token>`; if self delivery → also "Enviar por WhatsApp" (`https://wa.me/?text=` with the forward text as in `fulfillment.ts`). Replace the generic "Las gift cards se entregan por correo…" paragraph with these cards; keep the one-line receipt note: `en ? 'A receipt for the gift card goes to your email; the invoice is issued when it is redeemed.' : 'Por la gift card recibes un recibo por correo; la factura se emite al canjearla.'`
- [ ] **Step 2: Error page** — `reason=slot` link to `/reservar` stays; all other reasons: "Intentar de nuevo" → `/checkout`, plus a secondary "Volver a las gift cards" → `GIFT_CARDS_PATH` when the bag still has gift cards (client check via `useBagStore`).
- [ ] **Step 3: Verify** with a fulfilled local order (after Task 9's run) or, until Tilopay is unblocked, by rendering gracias for an existing paid `orders` row in the local DB if one exists; otherwise reviewer code read + `tsc`.
- [ ] **Step 4: Commit**

```bash
git add 'src/app/[locale]/checkout/gracias/page.tsx' 'src/app/[locale]/checkout/error/page.tsx'
git commit -m "feat(checkout): gracias shows each gift card with its link; paid-state check; gift-card error paths"
```

---

### Task 9: Admin visibility

**Files:**
- Modify: `src/components/admin/adminNav.ts` (55-57, 82-84, 101-106), `src/app/admin/pedidos/page.tsx` (sucursal cell 307, items column)

- [ ] **Step 1:** `pedidos` and `promocodes` stay behind `FEATURES.bag`; `facturas` and `impresion` move behind `FEATURES.prepay`.
- [ ] **Step 2:** `/admin/pedidos`: sucursal cell `location_id === 1 ? 'CDE' : location_id === 2 ? 'SFC' : 'Online'`; for orders with gift card items, the items cell links each `MO-…-G<n>` to `/admin/giftcards/orders/<gc_order_id>` (fetch children ids in `GET /api/admin/orders` as `gift_card_children: [{ id, order_number, status }]`).
- [ ] **Step 3:** Verify in the admin (local session), `tsc`, lint; commit `feat(admin): orders console shows online gift-card children; invoice consoles behind FEATURES.prepay`.

---

### Task 10: End-to-end run in test mode (bag), then flip

**Prerequisites (owner):** Tilopay block lifted and test cards available; Mindbody GC product IDs + three `… Web` tenders; migrations `20261102` and `20261104` applied (done 2026-11-04); `gc_shop_settings.shop_enabled=true`.

**Isolation of the test run (the database is shared with production):** `checkout_settings.checkout_enabled` is one row, so turning it on for the local run also opens production `POST /api/checkout` (unreachable from the production UI while `FEATURES.bag` is off, but callable). Production crons (`/api/cron/orders`, `/api/cron/giftcard-orders`) will also pick up any local test order left in flight for more than 3 minutes. Therefore: (1) keep `GIFTCARD_TEST_MODE` set in Vercel until the run is over and every test order is terminal (so a cron-resumed test order still registers `Test:true` in Mindbody); (2) set `checkout_enabled=true` right before the run and back to `false` right after; (3) before the flip, confirm in `/admin/pedidos` that no test order remains `authorized`/`captured`/`posted` without `fulfilled_at`; (4) refund the test charges in the Tilopay portal and set `voided_at` on the test cards; (5) after launch, reconcile the Tilopay portal against `/admin/pedidos` daily for the first week — a buyer who pays and never returns from Tilopay is charged (immediate capture) and the order expires after 24h with an ALARM log line.

- [ ] **Step 1: Local run** on `giftshop-e2e` (port 3100, `GIFTCARD_TEST_MODE=1`), with `bag: true, giftShop: true` flipped locally only. Owner types the cards. Cases: (1) one $50 card by email; (2) self delivery; (3) scheduled email; (4) two cards in one bag (email + self); (5) validation at details and at checkout; (6) callback replay → gracias again, tampered amount → `reason=invalid`; (7) Visa/MC, AMEX, Yappy if enabled; (8) order appears in `/admin/pedidos` with its `-G1` child and in `/admin/giftcards/orders`; (9) emails `[TEST]` received, card pages open, gift code chip appears on `/es/reservar?gc=`; (10) front-desk scan. Evidence per case in the ledger.
- [ ] **Step 2: Flip commit** — `src/lib/nav.ts`: `giftShop: true`, `bag: true`, `GIFT_CARDS_PATH = '/giftcards'`, `PUBLIC_ROUTES` + `{ path: '/giftcards', sitemap: true, priority: 0.8 }`; `prepay` stays false. Production SQL (owner, SQL editor): `update checkout_settings set checkout_enabled = true, services_enabled = false where id = 1;`. Remove `GIFTCARD_TEST_MODE` from Vercel. Build, commit `feat(giftshop): publish gift cards through the unified bag`, cherry-pick to `.worktrees/main`, push, verify `/es/giftcards`, header bag icon, `/es/checkout` config `enabled:true, servicesEnabled:false`, `/es/reservar` confirm step shows **no** "Pagar ahora".
- [ ] **Step 3: Soft launch** — one real $50 purchase by the owner, verify email, card page, Mindbody record, admin; refund via Tilopay portal + `voided_at`.
- [ ] **Step 4: Rollback** — `checkout_enabled=false` (checkout shows "no disponible", drawer still works) or `bag:false` (standalone pay step returns) or `gc_shop_settings.shop_enabled=false`.

---

---

## Discounted gift cards (added 2026-11-04)

**Requirement (owner):** sell a gift card below its face value for seasonal campaigns, e.g. a $100 card for $80 (20% off) on Mother's Day and Christmas. The card is worth $100 at the spa; the buyer pays $80.

**Design:** a per-item **sale price** on the catalogue, the way the spa already runs these campaigns in-store (a seasonal product that the admin activates and deactivates). `gc_catalog_items.sale_amount_cents` (nullable, must be below `amount_cents`). `amount_cents` stays the face value (monetary) or the base price (experience). When a sale price is set: the buyer pays `sale_amount_cents` (+ ITBMS on the sale price for experiences), the card is issued for `amount_cents`, the receipt shows both, and the Mindbody registration is paid with the amount actually charged. The admin maps the discounted item to whichever Mindbody gift card product the spa uses for that promotion (the `Test:true` preflight in the E2E run confirms the product accepts the paid amount). Invoicing is unchanged (ruling R1: receipt at sale).

**Execution order:** Task 11 runs right after Task 4 (before Task 5), so Tasks 5 and 6 consume the new line shape once; Task 12 runs after Task 6 and before Task 7.

### Task 11: Sale price on the catalogue, in the builders, and in the admin

**Files:**
- Create: `supabase/migrations/20261104_gc_sale_price.sql`
- Modify: `src/lib/giftshop/data.ts` (`GcCatalogItem` type, `itbmsCentsFor` caller sites unchanged), `src/app/api/giftcards/catalog/route.ts` (item mapping ~line 19), `src/app/api/admin/giftcards/shop/route.ts` (catalogue item upsert allow-list) and the admin shop page that edits catalogue items (find it: it calls that route), `src/lib/orders/giftCardItems.ts` + `giftCardItems.test.ts`

**Interfaces:**
- Produces: `GcCatalogItem.sale_amount_cents: number | null`; public catalogue items gain `sale_amount_cents: number | null`, `discount_percent: number | null` (rounded `100 × (1 − sale/amount)`), and `itbms_cents` is computed on the **sale** price when set; `CatalogItemLite.sale_amount_cents?: number | null`; `GiftCardLine` gains `faceValueCents: number` and `discountPercent: number | null`, and `unitPriceCents = (sale ?? amount) + itbms(sale ?? amount)`; `giftCardChildRow` reads `item.gc_face_value_cents` (nullable) and writes `face_value_cents` on the child row.

- [ ] **Step 1: Migration**

```sql
-- supabase/migrations/20261104_gc_sale_price.sql
-- Seasonal gift-card promotions: the buyer pays the sale price, the card is worth the face value.
ALTER TABLE public.gc_catalog_items
  ADD COLUMN IF NOT EXISTS sale_amount_cents INTEGER
  CHECK (sale_amount_cents IS NULL OR (sale_amount_cents > 0 AND sale_amount_cents < amount_cents));
COMMENT ON COLUMN public.gc_catalog_items.sale_amount_cents IS 'Price charged when set (pre-ITBMS for experiences); amount_cents stays the face value.';

ALTER TABLE public.gc_orders      ADD COLUMN IF NOT EXISTS face_value_cents INTEGER;
ALTER TABLE public.order_items    ADD COLUMN IF NOT EXISTS gc_face_value_cents INTEGER;
COMMENT ON COLUMN public.gc_orders.face_value_cents IS 'Card value when it differs from total_cents (discounted sale). NULL = total_cents.';
```

- [ ] **Step 2: Failing tests** (append to `giftCardItems.test.ts`)

```ts
describe('discounted gift cards', () => {
  const sale = { ...item, id: 'i3', amount_cents: 10000, sale_amount_cents: 8000 }
  const saleExp = { ...exp, id: 'i4', amount_cents: 10000, sale_amount_cents: 8000 }
  it('charges the sale price and keeps the face value', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i3', recipientName: 'A', deliveryMethod: 'self' }, sale, opts)
    expect(r.ok && r.line).toMatchObject({ unitPriceCents: 8000, taxCents: 0, faceValueCents: 10000, discountPercent: 20 })
  })
  it('taxes an experience on the sale price', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i4', recipientName: 'A', deliveryMethod: 'self' }, saleExp, opts)
    expect(r.ok && r.line).toMatchObject({ unitPriceCents: 8560, taxCents: 560, faceValueCents: 10000, taxRateCode: '01' })
  })
  it('no sale price → no discount, face value equals the price', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'self' }, item, opts)
    expect(r.ok && r.line).toMatchObject({ unitPriceCents: 5000, faceValueCents: 5000, discountPercent: null })
  })
  it('child row carries the face value', () => {
    const row = giftCardChildRow({ ...base, item: { ...base.item, total_cents: 8000, gc_face_value_cents: 10000 } })
    expect(row).toMatchObject({ total_cents: 8000, base_amount_cents: 8000, face_value_cents: 10000 })
    const plain = giftCardChildRow({ ...base, item: { ...base.item, gc_face_value_cents: null } })
    expect(plain).toMatchObject({ face_value_cents: null })
  })
})
```
(`item`, `exp`, `opts`, `base` are the fixtures already in the file; add `gc_face_value_cents: null` to `base.item` and `sale_amount_cents: null` to `item`/`exp` if the types require it.)

- [ ] **Step 3: Run red**, then implement: `CatalogItemLite.sale_amount_cents?: number | null`; in `buildGiftCardLine` compute `const priceCents = item.sale_amount_cents ?? item.amount_cents`, `const itbms = itbmsCentsFor({ kind: item.kind, amount_cents: priceCents })`, `unitPriceCents = priceCents + itbms`, `taxCents = itbms`, `faceValueCents = item.amount_cents`, `discountPercent = item.sale_amount_cents ? Math.round(100 * (1 - item.sale_amount_cents / item.amount_cents)) : null`. In `giftCardChildRow` add `face_value_cents: item.gc_face_value_cents ?? null`. Run green.
- [ ] **Step 4: Catalogue plumbing.** `GcCatalogItem` type gains `sale_amount_cents: number | null`; `getActiveCatalog()` selects it; the public route returns `sale_amount_cents`, `discount_percent` and `itbms_cents: itbmsCentsFor({ kind, amount_cents: sale ?? amount })`. Admin: the catalogue item editor gets a field **"Precio de oferta (opcional)"** (dollars input, stored as cents, must be below the value; inline error "Debe ser menor que el valor"), and the admin route's allow-list accepts `sale_amount_cents` (null clears it). Tolerate the missing column on read (treat as null) until the migration is run.
- [ ] **Step 5: Verify** `npx vitest run src/lib/orders/giftCardItems.test.ts` → PASS; full suite, `tsc`, lint; `curl -s localhost:3000/api/giftcards/catalog` shows `sale_amount_cents` and `discount_percent` per item (null when unset).
- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20261104_gc_sale_price.sql src/lib/giftshop/data.ts src/app/api/giftcards/catalog/route.ts src/app/api/admin/giftcards/shop/route.ts <admin shop page> src/lib/orders/giftCardItems.ts src/lib/orders/giftCardItems.test.ts
git commit -m "feat(giftshop): seasonal sale price on catalogue items (buyer pays less, card keeps its value)"
```

### Task 12: Discount through the shop, the bag, the standalone route, fulfilment and the receipt

**Files:**
- Modify: `src/components/giftshop/GiftShopClient.tsx` (tile price ~281, details header ~299, pay totals ~444, `addToBag` amount ~147), `src/lib/bag/store.ts` (`BagGiftCard.faceValueCents?`, `discountPercent?`), `src/components/bag/BagDrawer.tsx` (gift card row ~178), `src/app/api/giftcards/checkout/route.ts` (standalone totals + `face_value_cents`), `src/lib/giftshop/fulfillment.ts` (card value 156-158, receipt 377), `src/lib/email/templates/giftcard.ts` (`BuyerEmailData` + a paid line), `src/app/[locale]/giftcards/gracias/page.tsx` if it prints the amount

**Interfaces:**
- Consumes: catalogue `sale_amount_cents` / `discount_percent` (Task 11); `order_items.gc_face_value_cents` written by Task 5's route from `line.faceValueCents`; `gc_orders.face_value_cents` written by Task 6's hand-off.
- Produces: shop tile shows `$100` struck through, `$80` in gold, a `−20%` chip (plus the admin badge if set); bag item `amountCents` = price paid (tax-inclusive) with `faceValueCents` and `discountPercent` for display; drawer row "Gift Card $100 · −20%" with `$80`; standalone route charges `sale ?? amount` (+ITBMS on it) and stores `face_value_cents`; fulfilment issues the card for `face_value_cents ?? total_cents` (monetary) and keeps the experience base/tax logic on the paid amounts; Mindbody `PaymentInfo` stays the paid total; buyer receipt shows "Valor $100" and "Pagaste $80 (20% de descuento)"; recipient email shows the face value only.

- [ ] **Step 1: Shop + bag.** Tile: when `i.sale_amount_cents` is set, render `<span className="line-through text-warm-gray">{money(i.amount_cents)}</span> <span className="text-gold-600 font-bold text-lg">{money(i.sale_amount_cents)}</span> <span className="ml-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-semibold px-2 py-0.5">−{i.discount_percent}%</span>`; details header and pay totals use the sale price; `addToBag` passes `amountCents: (sale ?? amount) + itbms_cents`, `faceValueCents: amount_cents`, `discountPercent`. Drawer row: name + (`faceValueCents` differs → `· −{discountPercent}%`) and the paid amount. Bag store: two optional fields, no migration bump needed (optional).
- [ ] **Step 2: Standalone route** (`/api/giftcards/checkout`): `const price = item.sale_amount_cents ?? item.amount_cents`; `itbms = itbmsCentsFor({ kind, amount_cents: price })`; `total = price + itbms`; insert `face_value_cents: item.sale_amount_cents ? item.amount_cents : null`, `base_amount_cents: price`.
- [ ] **Step 3: Fulfilment.** `gift_cards.amount_cents = order.face_value_cents ?? order.total_cents` for monetary; for experience keep `base_amount_cents`/`tax_cents` from the order (paid) and set `amount_cents = order.face_value_cents ?? order.total_cents`. Receipt: `amountLabel` = face value; new `paidLabel` = `$${total/100}` and `discountLabel` = `20% de descuento` passed to `buyerReceiptEmail` as `paidLine?: string | null` rendered as a table row `Pagaste | $80 (20% de descuento)` under "Valor"; recipient email unchanged. Tolerate `face_value_cents` missing (null → today's behaviour).
- [ ] **Step 4: Verify** at 375px with local flag flips: a sale item shows the struck-through value and chip; the drawer shows the paid amount; `curl` the standalone route body for a sale item → `total_cents` = sale (+ITBMS for experiences). Unit: extend `src/lib/giftshop/thankYou.test.ts` only if it prints amounts (it does not). Reset flags.
- [ ] **Step 5: Commit** `feat(giftshop): discounted cards show value, price and discount; card issued at face value; receipt shows what was paid`.

**Ops note for Task 10:** create the seasonal item in the admin (name "Gift Card $100 · Día de las Madres", valor $100, precio de oferta $80, Mindbody product = the promo product used in-store), activate it for the campaign window, deactivate after. Discount is per item, not shop-wide, so regular denominations can stay on sale or not independently.

## Later (not in this plan)

- Prepaid treatments: `services_enabled=true` + `FEATURES.prepay=true` after the accountant and efacturapty answers, with the "Pagar ahora" UX pass and a live booking+invoice+credit-note test.
- Invoice at gift card sale (Part B of the go-live plan) only under ruling R2.
- Retire `/api/giftcards/checkout` and `giftcards/gracias|error` one release after the bag is stable.

## Self-review

- **Spec coverage (shop rules into the bag path):** one delivery channel per order → Tasks 2, 3, 4, 5, 6; WhatsApp hidden until enabled → 2, 4, 5; thank-you sentence + card link → 8; gift code chip unchanged; receipt at sale → 8 copy; abuse guard → 5; rollback → 10. Services switch → 1, 7; admin → 9.
- **Placeholders:** none; each step names the code or the exact edit and anchors.
- **Type consistency:** `BagGiftCard.deliveryMethod` (Task 3) → body `giftCards[].deliveryMethod` (Task 5) → `order_items.gc_delivery_method` (Tasks 1, 5) → `giftCardChildRow` (Tasks 2, 6) → `gc_orders.delivery_email/delivery_whatsapp/recipient_phone`; `servicesEnabled` spelled the same in Tasks 1, 7; `FEATURES.prepay` in Tasks 1, 9, 10.
