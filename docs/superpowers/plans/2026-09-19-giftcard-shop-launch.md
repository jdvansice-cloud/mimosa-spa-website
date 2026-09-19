# Gift Card Online Shop Launch — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch online gift-card sales with an explicit delivery choice (email, WhatsApp, or hand it over yourself), redemption at the spa, and the tested fulfillment code deployed to production.

**Architecture:** The tested purchase pipeline (standalone 3-step shop → Tilopay hosted payment → signed callback → checkpointed fulfillment → Resend/WATI delivery → reconciliation cron) already exists on the branch `feat/unified-checkout-efactura` and in this checkout. We land those commits on `main` with every new switch off, then change only the customer-facing layer: the delivery choice in the shop, the thank-you sentence, the recipient copy, a gift code that rides into the Mindbody appointment notes, and one cron pass. Pure logic goes in small `src/lib` modules with vitest tests; React components and routes stay thin.

**Tech Stack:** Next.js 16 App Router (Node runtime) on Vercel, Supabase (service role from `giftshopAdminClient()`), Tilopay hosted checkout, Resend, WATI templates, next-intl messages in `src/messages/{es,en}.json`, vitest (`npx vitest run <file>`).

**Spec:** `docs/superpowers/specs/2026-09-18-giftcard-shop-launch-design.md`

## Global Constraints

- Work in the root checkout `/Users/juanvansice/Documents/GitHub/mimosa-spa-website` on its current branch (`feat/wati-ai-receptionist`, which already contains the branch files). Run `git branch --show-current` before every commit. Deploy by cherry-picking each task's commit onto `main` in the worktree: `git -C .worktrees/main cherry-pick <sha> && git -C .worktrees/main push origin main`. Never `git checkout main` in the root checkout.
- Task 1 is the exception: its cherry-picks happen directly in `.worktrees/main`.
- Never `git add` Finder-duplicate files (names containing ` 2.`, ` 10.`, …) or anything under `.next/`. Always `git add` explicit paths.
- Every switch stays off until Task 9: `FEATURES.bag = false`, `FEATURES.giftShop = false`, `checkout_settings.checkout_enabled = false`, all `efactura_config.enabled = false`.
- No new database migrations. Existing columns only: `gc_orders.delivery_email`, `delivery_whatsapp`, `recipient_email`, `recipient_phone`, `scheduled_send_at`, `whatsapp_sent_at`, `whatsapp_error`, `email_sent_at`.
- Copy: Spanish first, English mirrors it. Both go in `src/messages/es.json` and `en.json` under `giftShop` when rendered through `useTranslations('giftShop')`; server pages and emails use inline `en ? … : …` pairs like the existing code.
- Phone numbers are digits only, country code first, no `+` (WATI format). `PhoneInput` already produces this.
- Tests: `npx vitest run <path>`; vitest picks up `src/**/*.test.ts` (node environment, `@` alias configured).
- `npm run lint` is broken in this repo (pre-existing); do not rely on it. `npm run build` is the gate.

---

## File map

| Path | Responsibility |
|---|---|
| `.worktrees/main` (Task 1) | Receives the 8 branch commits; conflict resolution; build; push |
| `src/components/admin/adminNav.ts` | Gate the four inert admin consoles behind `FEATURES.bag` |
| `src/lib/giftshop/delivery.ts` (+ `.test.ts`) | `resolveDelivery()` — delivery method → recipient fields + flags, with validation |
| `src/app/api/giftcards/checkout/route.ts` | Uses `resolveDelivery()`; unchanged otherwise |
| `src/app/api/giftcards/catalog/route.ts` | Exposes `whatsappDeliveryEnabled` |
| `src/components/giftshop/GiftShopClient.tsx` | Delivery choice UI in step 2; sends `deliveryMethod` |
| `src/messages/es.json`, `en.json` | New `giftShop.*` strings |
| `src/lib/giftshop/thankYou.ts` (+ `.test.ts`) | `thankYouSentence()` |
| `src/app/[locale]/giftcards/gracias/page.tsx` | Renders the sentence; self-delivery buttons |
| `src/app/gift/[token]/page.tsx` | CTA and note copy: redemption at the spa |
| `src/lib/email/templates/giftcard.ts` | Recipient email footnote copy |
| `src/lib/giftshop/giftCode.ts` (+ `.test.ts`) | `sanitizeGiftCode()`, `readStoredGiftCode()`, `clearStoredGiftCode()`, storage key |
| `src/lib/booking/notes.ts` (+ `.test.ts`) | `buildAppointmentNotes()` |
| `src/app/api/mindbody/book/route.ts` | Accepts `giftCode`; uses `buildAppointmentNotes()` |
| `src/components/booking/steps/ConfirmStep.tsx` | Sends `giftCode`; clears storage on success |
| `src/components/booking/GiftCodeChip.tsx` | Chip shown while a gift code is stored |
| `src/components/booking/BookingPageContent.tsx` | Mounts the chip above the widget |
| `src/app/api/cron/giftcard-orders/route.ts` | Pass (f): WhatsApp deliveries pending template approval |
| `src/lib/nav.ts` | Task 9 launch flips |
| `src/components/giftshop/ShopStepHeader.tsx`, `ShopBottomBar.tsx` | Task 10: same step header and action bar as the booking widget |
| `src/lib/giftshop/recap.ts` (+ `.test.ts`) | Task 10: `recapLine()` for the pay step |
| `src/components/layout/MobileBottomNav.tsx` | Task 10: hide the site bottom nav on the shop page |
| `src/components/shared/LeadForm.tsx` | Task 3: same phone-field class fix |
| `AuthStep.tsx`, `DateTimeStep.tsx`, `FloatingCart.tsx`, `StepProgress.tsx` | Task 11: widget copy congruence; Task 12: visible therapist choice |

---

### Task 1: Land the checkout branch on `main` with every switch off

**Files:**
- Worktree: `.worktrees/main` (branch `main`, currently at `d8fe7e02`)
- Modify (during conflict resolution): `package.json`, `package-lock.json`, `tsconfig.json`, `scripts/spikes/ts-resolve.mjs`, `src/components/admin/adminNav.ts`

**Interfaces:**
- Consumes: commits `aff00f5a d377e77d 4163d7ff be9c170a 5d40e1f3 9357696b 198361c0 04ab69cf` from `feat/unified-checkout-efactura`. Commit `1a6331a5` is **skipped**: `main` already has it as `fc538228`.
- Produces: `main` containing `src/lib/giftshop/fulfillment.ts` (MO serials, serial as Mindbody barcode, `gift_card_serial_config_id`, `allFulfilled` gating), `src/lib/nav.ts` with `FEATURES.bag = false`, the orders/efactura crons in `vercel.json`, and the admin consoles hidden.

- [ ] **Step 1: Confirm the worktree is on `main` and up to date**

Run:
```bash
git -C .worktrees/main branch --show-current
git -C .worktrees/main fetch origin && git -C .worktrees/main status -sb | head -1
git -C .worktrees/main status --porcelain | grep -v '\.next/' | grep -v node_modules
```
Expected: `main`, `## main...origin/main` with no ahead/behind, and only `next-env.d.ts` listed (ignore it). If `next-env.d.ts` shows as modified, run `git -C .worktrees/main checkout -- next-env.d.ts` first so it cannot block a cherry-pick. Some `node_modules/` files are tracked in this repo and show as modified in the worktree; if any cherry-pick below refuses to start with "your local changes would be overwritten", run `git -C .worktrees/main checkout -- node_modules` and retry (it only restores tracked files to their committed content).

- [ ] **Step 2: Cherry-pick the two clean commits**

Run:
```bash
git -C .worktrees/main cherry-pick aff00f5a d377e77d
```
Expected: both apply cleanly (verified by simulation). If either stops, run `git -C .worktrees/main status` and resolve as in Step 3, then `git -C .worktrees/main cherry-pick --continue`.

- [ ] **Step 3: Cherry-pick `4163d7ff` and resolve its three conflicts**

Run:
```bash
git -C .worktrees/main cherry-pick 4163d7ff
```
Expected: CONFLICT in `package.json`, `tsconfig.json`, `scripts/spikes/ts-resolve.mjs`.

Resolve each file:

`scripts/spikes/ts-resolve.mjs` — keep main's version (it is newer, with the JSON import fix the WATI scripts need):
```bash
git -C .worktrees/main checkout --ours -- scripts/spikes/ts-resolve.mjs
```

`tsconfig.json` — the branch adds `"scripts/spikes"` to `exclude`. Edit the file so the block reads exactly:
```json
  "exclude": [
    "node_modules",
    "**/* *.ts",
    "**/* *.tsx",
    "scripts/spikes"
  ]
```
and remove every `<<<<<<<`, `=======`, `>>>>>>>` marker.

`package.json` — union. In `"scripts"`, keep main's `test`, `test:watch`, `wati:mine`, `wati:redact`, `wati:evals` AND add the branch's entries:
```json
    "efactura:dryrun": "node --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/efactura-dryrun.ts",
    "analytics:booking-trend": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/booking-trend.ts",
    "analytics:conversion": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/conversion-by-source.ts"
```
In `"dependencies"` keep `@anthropic-ai/sdk` and `@vercel/functions`; in `"devDependencies"` keep `vitest`. Remove all conflict markers. Validate:
```bash
node -e "JSON.parse(require('fs').readFileSync('.worktrees/main/package.json','utf8')); console.log('package.json ok')"
```
Then:
```bash
git -C .worktrees/main add package.json tsconfig.json scripts/spikes/ts-resolve.mjs
git -C .worktrees/main cherry-pick --continue
```
Expected: commit created with the original message.

- [ ] **Step 4: Cherry-pick `be9c170a` (conflicts: `package.json`, `tsconfig.json`)**

Run `git -C .worktrees/main cherry-pick be9c170a`. Resolve the same way: `tsconfig.json` exclude block as in Step 3; `package.json` keeps everything from Step 3 and adds:
```json
    "efactura:pos-dryrun": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/pos-invoice-dryrun.ts",
    "efactura:pos-compare": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/pos-compare-june.ts",
    "efactura:pos-match": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/pos-match-june.ts",
    "efactura:verify-schema": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/spikes/verify-schema.ts"
```
(Any script the conflict hunk shows that is not listed here also gets kept; the rule is union.) Validate the JSON, `git add`, `cherry-pick --continue`.

- [ ] **Step 5: Cherry-pick `5d40e1f3` (conflicts: `package.json`, `package-lock.json`, `adminNav.ts`)**

Run `git -C .worktrees/main cherry-pick 5d40e1f3`.

`package.json` — union again; this commit adds to `"dependencies"`:
```json
    "qrcode": "^1.5.4",
```
and to `"devDependencies"`:
```json
    "@types/qrcode": "^1.5.6",
```
plus script `efactura:cafe-dryrun`. Keep main's entries.

`package-lock.json` — do not hand-merge. Take main's and regenerate:
```bash
git -C .worktrees/main checkout --ours -- package-lock.json
(cd .worktrees/main && npm install --no-audit --no-fund)
```
Expected: `package-lock.json` now contains `qrcode`. Verify: `grep -c '"node_modules/qrcode"' .worktrees/main/package-lock.json` prints `1`.

`src/components/admin/adminNav.ts` — keep both sides in the `sistema` section. The resolved block must read:
```ts
  {
    id: 'sistema',
    label: 'Sistema',
    items: [
      { href: '/admin/wati-agent', label: 'Camila (WhatsApp)', icon: MessageCircle },
      { href: '/admin/facturas', label: 'Facturación electrónica', icon: Receipt },
      { href: '/admin/impresion', label: 'Impresión de facturas', icon: Printer },
      { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
    ],
  },
```
Make sure the `lucide-react` import line includes `MessageCircle`, `Receipt`, `Printer` and `Settings`. Then:
```bash
git -C .worktrees/main add package.json package-lock.json src/components/admin/adminNav.ts
git -C .worktrees/main cherry-pick --continue
```

- [ ] **Step 6: Cherry-pick the last three commits**

Run one at a time:
```bash
git -C .worktrees/main cherry-pick 9357696b
```
Conflict only in `package.json` (script `efactura:pos-daily`). Union, validate JSON, add, continue.
```bash
git -C .worktrees/main cherry-pick 198361c0
```
Conflict only in `package.json` (script `efactura:pos-returns`). Union, validate JSON, add, continue.
```bash
git -C .worktrees/main cherry-pick 04ab69cf
```
Conflicts in `package.json` (union) and `scripts/spikes/ts-resolve.mjs` (`git checkout --ours`). Add, continue.

Expected after all six: `git -C .worktrees/main log --oneline -8` shows the eight cherry-picked subjects on top of `d8fe7e02`.

- [ ] **Step 7: Gate the inert admin consoles behind `FEATURES.bag`**

Edit `.worktrees/main/src/components/admin/adminNav.ts`. Add the import at the top:
```ts
import { FEATURES } from '@/lib/nav'
```
Find the two entries `{ href: '/admin/pedidos', … }` and `{ href: '/admin/promocodes', … }` (wherever the cherry-pick placed them) and wrap them:
```ts
      ...(FEATURES.bag
        ? [
            { href: '/admin/pedidos', label: 'Pedidos en línea', icon: ShoppingBag },
            { href: '/admin/promocodes', label: 'Códigos de descuento', icon: Ticket },
          ]
        : []),
```
Do the same in the `sistema` section for `facturas` and `impresion`:
```ts
      ...(FEATURES.bag
        ? [
            { href: '/admin/facturas', label: 'Facturación electrónica', icon: Receipt },
            { href: '/admin/impresion', label: 'Impresión de facturas', icon: Printer },
          ]
        : []),
```
Confirm `.worktrees/main/src/lib/nav.ts` still has `parejas: false`, `giftShop: false`, `bag: false`.

- [ ] **Step 8: Build**

Run:
```bash
(cd .worktrees/main && npm run build 2>&1 | tail -25)
```
Expected: `✓ Compiled successfully` and the route table; no type errors. If a type error names one of the cherry-picked files, fix it in place (do not revert the file) and re-run.

- [ ] **Step 9: Commit the gating and push `main`**

```bash
git -C .worktrees/main add src/components/admin/adminNav.ts
git -C .worktrees/main commit -m "chore(admin): hide checkout and invoicing consoles until the bag launches

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git -C .worktrees/main push origin main
```
Expected: Vercel starts a production deploy (about 1–3 minutes).

- [ ] **Step 10: Smoke-test production**

Open in the built-in browser: `https://www.mimosaretreat.com/es/menu/giftcards` (renders), `https://www.mimosaretreat.com/es/giftcards` (redirects to the menu page because the flag is off), `https://www.mimosaretreat.com/admin` (sidebar has no "Pedidos en línea", "Códigos de descuento", "Facturación electrónica" or "Impresión de facturas"). Run the new crons once by hand to prove they are wired and idle:
```bash
CRON=$(grep '^CRON_SECRET' .env.local | cut -d'"' -f2); for p in orders efactura giftcard-orders; do echo "== $p"; curl -s -H "Authorization: Bearer $CRON" "https://www.mimosaretreat.com/api/cron/$p"; echo; done
```
Expected: three JSON bodies with zero counts (e.g. `{"resumed":0,"ok":0,…}`), no 401 and no 500.

---

### Task 2: `resolveDelivery()` and the checkout route

**Files:**
- Create: `src/lib/giftshop/delivery.ts`
- Test: `src/lib/giftshop/delivery.test.ts`
- Modify: `src/app/api/giftcards/checkout/route.ts:54-59` and `:100-105`
- Modify: `src/app/api/giftcards/catalog/route.ts:8-10`

**Interfaces:**
- Produces:
  ```ts
  export type DeliveryMethod = 'email' | 'whatsapp' | 'self'
  export function resolveDelivery(input: { deliveryMethod?: unknown; recipientEmail?: unknown; recipientPhone?: unknown }):
    | { ok: true; method: DeliveryMethod; recipientEmail: string | null; recipientPhone: string | null; deliveryEmail: boolean; deliveryWhatsapp: boolean }
    | { ok: false; error: string }
  ```
- `GET /api/giftcards/catalog` response gains `whatsappDeliveryEnabled: boolean` (used by Task 3).
- `POST /api/giftcards/checkout` accepts optional `deliveryMethod` (used by Task 3).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/giftshop/delivery.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { resolveDelivery } from './delivery'

describe('resolveDelivery', () => {
  it('email: requires a valid address and sends by email only', () => {
    const r = resolveDelivery({ deliveryMethod: 'email', recipientEmail: ' Maria@Example.com ', recipientPhone: '50761234567' })
    expect(r).toEqual({
      ok: true, method: 'email', recipientEmail: 'maria@example.com', recipientPhone: null,
      deliveryEmail: true, deliveryWhatsapp: false,
    })
  })

  it('email: rejects a missing or malformed address', () => {
    expect(resolveDelivery({ deliveryMethod: 'email', recipientEmail: '' })).toEqual({ ok: false, error: 'Indica el correo de quien recibe' })
    expect(resolveDelivery({ deliveryMethod: 'email', recipientEmail: 'nope' })).toEqual({ ok: false, error: 'Correo del destinatario inválido' })
  })

  it('whatsapp: keeps digits only and sends by WhatsApp only', () => {
    const r = resolveDelivery({ deliveryMethod: 'whatsapp', recipientPhone: '+507 6123-4567', recipientEmail: 'x@y.com' })
    expect(r).toEqual({
      ok: true, method: 'whatsapp', recipientEmail: null, recipientPhone: '50761234567',
      deliveryEmail: false, deliveryWhatsapp: true,
    })
  })

  it('whatsapp: rejects a number shorter than 8 digits', () => {
    expect(resolveDelivery({ deliveryMethod: 'whatsapp', recipientPhone: '1234' })).toEqual({ ok: false, error: 'Indica el WhatsApp de quien recibe' })
  })

  it('self: stores no recipient contact and sends nothing', () => {
    const r = resolveDelivery({ deliveryMethod: 'self', recipientEmail: 'x@y.com', recipientPhone: '50761234567' })
    expect(r).toEqual({
      ok: true, method: 'self', recipientEmail: null, recipientPhone: null,
      deliveryEmail: false, deliveryWhatsapp: false,
    })
  })

  it('rejects an unknown method', () => {
    expect(resolveDelivery({ deliveryMethod: 'pigeon' })).toEqual({ ok: false, error: 'Método de entrega inválido' })
  })

  it('legacy body without deliveryMethod keeps the old derivation (both flags from the fields)', () => {
    const r = resolveDelivery({ recipientEmail: 'a@b.co', recipientPhone: '50761234567' })
    expect(r).toEqual({
      ok: true, method: 'email', recipientEmail: 'a@b.co', recipientPhone: '50761234567',
      deliveryEmail: true, deliveryWhatsapp: true,
    })
    const none = resolveDelivery({})
    expect(none).toEqual({
      ok: true, method: 'self', recipientEmail: null, recipientPhone: null,
      deliveryEmail: false, deliveryWhatsapp: false,
    })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/giftshop/delivery.test.ts`
Expected: FAIL — `Cannot find module './delivery'`.

- [ ] **Step 3: Implement `resolveDelivery`**

Create `src/lib/giftshop/delivery.ts`:
```ts
// How a gift card reaches the recipient. The buyer picks exactly one channel
// in the shop; the server stores only the contact field for that channel so
// the fulfillment's "email whenever an address exists, WhatsApp additive"
// rule yields exactly one delivery.
export type DeliveryMethod = 'email' | 'whatsapp' | 'self'

export interface DeliveryInput {
  deliveryMethod?: unknown
  recipientEmail?: unknown
  recipientPhone?: unknown
}

export interface DeliveryResolved {
  ok: true
  method: DeliveryMethod
  recipientEmail: string | null
  recipientPhone: string | null
  deliveryEmail: boolean
  deliveryWhatsapp: boolean
}

export interface DeliveryRejected {
  ok: false
  error: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanEmail(v: unknown): string {
  return typeof v === 'string' ? v.trim().toLowerCase().slice(0, 160) : ''
}

/** WATI format: digits only, country code first, no plus sign. */
function cleanPhone(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\D/g, '').slice(0, 24) : ''
}

export function resolveDelivery(input: DeliveryInput): DeliveryResolved | DeliveryRejected {
  const email = cleanEmail(input.recipientEmail)
  const phone = cleanPhone(input.recipientPhone)

  // Legacy clients (no deliveryMethod) keep the pre-launch derivation.
  if (input.deliveryMethod === undefined) {
    if (email && !EMAIL_RE.test(email)) return { ok: false, error: 'Correo del destinatario inválido' }
    return {
      ok: true,
      method: email ? 'email' : phone ? 'whatsapp' : 'self',
      recipientEmail: email || null,
      recipientPhone: phone || null,
      deliveryEmail: !!email,
      deliveryWhatsapp: !!phone,
    }
  }

  switch (input.deliveryMethod) {
    case 'email':
      if (!email) return { ok: false, error: 'Indica el correo de quien recibe' }
      if (!EMAIL_RE.test(email)) return { ok: false, error: 'Correo del destinatario inválido' }
      return { ok: true, method: 'email', recipientEmail: email, recipientPhone: null, deliveryEmail: true, deliveryWhatsapp: false }
    case 'whatsapp':
      if (phone.length < 8) return { ok: false, error: 'Indica el WhatsApp de quien recibe' }
      return { ok: true, method: 'whatsapp', recipientEmail: null, recipientPhone: phone, deliveryEmail: false, deliveryWhatsapp: true }
    case 'self':
      return { ok: true, method: 'self', recipientEmail: null, recipientPhone: null, deliveryEmail: false, deliveryWhatsapp: false }
    default:
      return { ok: false, error: 'Método de entrega inválido' }
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/giftshop/delivery.test.ts`
Expected: 7 passed.

- [ ] **Step 5: Use it in the checkout route**

In `src/app/api/giftcards/checkout/route.ts` add the import:
```ts
import { resolveDelivery } from '@/lib/giftshop/delivery'
```
Replace lines 54–59 (from `const recipientEmail = body.recipientEmail` through the closing `}` of the invalid-email check) with:
```ts
  const delivery = resolveDelivery({
    deliveryMethod: body.deliveryMethod,
    recipientEmail: body.recipientEmail,
    recipientPhone: body.recipientPhone,
  })
  if (!delivery.ok) return NextResponse.json({ error: delivery.error }, { status: 400 })
```
In the `.insert({ … })` block replace the four lines
```ts
      recipient_email: recipientEmail,
      recipient_phone: body.recipientPhone ? String(body.recipientPhone).slice(0, 24) : null,
      gift_message: body.message ? String(body.message).slice(0, 300) : null,
      delivery_email: recipientEmail != null,
      delivery_whatsapp: !!body.recipientPhone,
```
with
```ts
      recipient_email: delivery.recipientEmail,
      recipient_phone: delivery.recipientPhone,
      gift_message: body.message ? String(body.message).slice(0, 300) : null,
      delivery_email: delivery.deliveryEmail,
      delivery_whatsapp: delivery.deliveryWhatsapp,
```
Also, for `self` a scheduled date makes no sense: right after the `scheduled` computation add
```ts
  if (delivery.method === 'self') scheduled = null
```

- [ ] **Step 6: Expose the WhatsApp setting in the catalog**

In `src/app/api/giftcards/catalog/route.ts` add one field to the JSON right after `shopEnabled`:
```ts
    whatsappDeliveryEnabled: settings.whatsapp_delivery_enabled,
```

- [ ] **Step 7: Typecheck and commit**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E 'giftcards/(checkout|catalog)|lib/giftshop/delivery' ; echo "tsc done"`
Expected: no lines before `tsc done`.
```bash
git branch --show-current
git add src/lib/giftshop/delivery.ts src/lib/giftshop/delivery.test.ts src/app/api/giftcards/checkout/route.ts src/app/api/giftcards/catalog/route.ts
git commit -m "feat(giftshop): explicit delivery method on checkout, WhatsApp setting in catalog

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 8: Cherry-pick to main and push**

```bash
SHA=$(git rev-parse --short HEAD); git -C .worktrees/main cherry-pick $SHA && git -C .worktrees/main push origin main
```
Expected: clean cherry-pick, Vercel deploys. The public page is still behind the flag, so nothing changes for customers.

---

### Task 3: Delivery choice, visible labels, inline errors and the phone-field fix (shop steps 2 and 3)

**Files:**
- Modify: `src/components/giftshop/GiftShopClient.tsx` (imports :1-10, `CatalogResponse` :26-29, state :40-50, `pay()` :91-117, `inputCls` :146-147, step 2 block :221-260, step 3 block :262-299)
- Modify: `src/components/shared/LeadForm.tsx:131` (same phone-field class bug)
- Modify: `src/messages/es.json`, `src/messages/en.json` (`giftShop` object)

**Interfaces:**
- Consumes: `whatsappDeliveryEnabled` from `GET /api/giftcards/catalog` (Task 2); `deliveryMethod` accepted by `POST /api/giftcards/checkout` (Task 2).
- Produces: `form.deliveryMethod: 'email' | 'whatsapp' | 'self'`, `goToPay()` and `validateBuyer()` used by Task 10's bottom bar; the `Field` helper and `selectCls` constant reused by Task 10.

Why this shape (from the 2026-09-19 screen review): every field in steps 2 and 3 was placeholder-only, errors appeared as one generic red line, the country selector inherited `w-full` from `inputCls` and squeezed the phone field to a sliver at 375px, and buttons were under 44px tall.

- [ ] **Step 1: Add the strings**

In `src/messages/es.json`, inside `"giftShop"`, add the keys below (keep every existing key):
```json
    "labelRecipientName": "Nombre de quien recibe",
    "phRecipientName": "Ej. María Pérez",
    "labelRecipientEmail": "Correo de quien recibe",
    "phEmail": "nombre@correo.com",
    "labelRecipientPhone": "WhatsApp de quien recibe",
    "labelMessage": "Mensaje para la tarjeta",
    "labelSendDate": "Enviar en una fecha específica",
    "sendDateHint": "Si no eliges fecha, se envía al completar el pago.",
    "optional": "(opcional)",
    "labelBuyerName": "Tu nombre",
    "labelBuyerEmail": "Tu correo",
    "labelBuyerPhone": "Tu teléfono",
    "deliveryTitle": "¿Cómo se lo entregamos?",
    "deliveryEmail": "Por correo",
    "deliveryEmailHint": "Le llega un correo con el enlace a su gift card.",
    "deliveryWhatsapp": "Por WhatsApp",
    "deliveryWhatsappHint": "Le llega un mensaje de WhatsApp con el enlace a su gift card.",
    "deliverySelf": "Yo se lo entrego",
    "deliverySelfHint": "Recibirás el enlace de la gift card en tu comprobante, para enviárselo cuando quieras.",
    "errRecipientName": "Escribe el nombre de quien recibe",
    "errRecipientEmail": "Escribe un correo válido para quien recibe",
    "errRecipientPhone": "Escribe el WhatsApp de quien recibe",
    "errBuyerName": "Escribe tu nombre",
    "errBuyerEmail": "Escribe un correo válido",
```
In `src/messages/en.json`:
```json
    "labelRecipientName": "Recipient's name",
    "phRecipientName": "e.g. María Pérez",
    "labelRecipientEmail": "Recipient's email",
    "phEmail": "name@email.com",
    "labelRecipientPhone": "Recipient's WhatsApp",
    "labelMessage": "Card message",
    "labelSendDate": "Send on a specific date",
    "sendDateHint": "If you don't pick a date, it is sent as soon as you pay.",
    "optional": "(optional)",
    "labelBuyerName": "Your name",
    "labelBuyerEmail": "Your email",
    "labelBuyerPhone": "Your phone",
    "deliveryTitle": "How should we deliver it?",
    "deliveryEmail": "By email",
    "deliveryEmailHint": "They get an email with the link to their gift card.",
    "deliveryWhatsapp": "By WhatsApp",
    "deliveryWhatsappHint": "They get a WhatsApp message with the link to their gift card.",
    "deliverySelf": "I'll give it myself",
    "deliverySelfHint": "You'll get the gift card link in your receipt, to share whenever you like.",
    "errRecipientName": "Enter the recipient's name",
    "errRecipientEmail": "Enter a valid email for the recipient",
    "errRecipientPhone": "Enter the recipient's WhatsApp",
    "errBuyerName": "Enter your name",
    "errBuyerEmail": "Enter a valid email",
```
Validate both files:
```bash
node -e "for (const l of ['es','en']) { const d=require('./src/messages/'+l+'.json').giftShop; for (const k of ['labelRecipientName','labelBuyerEmail','deliveryTitle','deliverySelfHint','errRecipientName','errBuyerEmail','sendDateHint','optional']) if(!d[k]) throw new Error(l+' missing '+k) } console.log('i18n ok')"
```
Expected: `i18n ok`.

- [ ] **Step 2: State, catalog type, class constants and the `Field` helper**

In `GiftShopClient.tsx`:

`CatalogResponse` becomes:
```ts
interface CatalogResponse {
  shopEnabled: boolean
  whatsappDeliveryEnabled?: boolean
  items: CatalogItem[]
}
```
After the `Step` type add:
```ts
type DeliveryMethod = 'email' | 'whatsapp' | 'self'
type FieldErrors = Partial<Record<'recipientName' | 'recipientEmail' | 'recipientPhone' | 'buyerName' | 'buyerEmail', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Label above, control, then hint or error below. Errors are linked to the
// control through aria-describedby so screen readers read them in place.
function Field({
  id,
  label,
  required,
  hint,
  error,
  labelFor = true,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  labelFor?: boolean
  children: React.ReactNode
}) {
  const LabelTag = labelFor ? 'label' : 'span'
  return (
    <div>
      <LabelTag {...(labelFor ? { htmlFor: id } : {})} className="block text-sm font-medium text-dark mb-1.5">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </LabelTag>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-warm-gray">{hint}</p>
      ) : null}
    </div>
  )
}
```
Add `import type React from 'react'` if the file does not already import React types (it imports `useEffect, useState` from 'react'; extend that import to `import { useEffect, useState, type ReactNode } from 'react'` and use `ReactNode` instead of `React.ReactNode`).

In the `useState` form object add a first field:
```ts
    deliveryMethod: 'email' as DeliveryMethod,
```
After `const [error, setError] = useState<string | null>(null)` add:
```ts
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
```
After `const money = …` add:
```ts
  const whatsappAvailable = !!catalog?.whatsappDeliveryEnabled
  const todayIso = new Date().toISOString().slice(0, 10)
```
Replace the `inputCls` constant with two constants (44px tall controls; the select no longer inherits `w-full`):
```ts
  const inputCls =
    'w-full border border-beige rounded-lg px-3 py-3 min-h-[44px] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold aria-[invalid=true]:border-red-400'
  const selectCls =
    'w-24 shrink-0 border border-beige rounded-lg px-2 py-3 min-h-[44px] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold'
```

- [ ] **Step 3: Validation per step**

Replace `pay()` with these three functions:
```ts
  const validateDetails = (): boolean => {
    const errs: FieldErrors = {}
    if (!form.recipientName.trim()) errs.recipientName = t('errRecipientName')
    if (form.deliveryMethod === 'email' && !EMAIL_RE.test(form.recipientEmail.trim())) errs.recipientEmail = t('errRecipientEmail')
    if (form.deliveryMethod === 'whatsapp' && form.recipientPhone.replace(/\D/g, '').length < 8) errs.recipientPhone = t('errRecipientPhone')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goToPay = () => {
    if (!validateDetails()) return
    setError(null)
    setStep('pay')
  }

  const validateBuyer = (): boolean => {
    const errs: FieldErrors = {}
    if (!form.buyerName.trim()) errs.buyerName = t('errBuyerName')
    if (!EMAIL_RE.test(form.buyerEmail.trim())) errs.buyerEmail = t('errBuyerEmail')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const pay = async () => {
    if (!item || submitting) return
    setError(null)
    if (!validateBuyer()) return
    setSubmitting(true)
    track('giftshop_checkout', { locale, meta: { item: item.id } })
    try {
      const res = await fetch('/api/giftcards/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, locale, ...form }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) {
        setError(data?.error || t('errCheckout'))
        setSubmitting(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError(t('errCheckout'))
      setSubmitting(false)
    }
  }
```
Also make the back arrow clear errors: in the `onClick={() => setStep(step === 'pay' ? 'details' : 'pick')}` handler add `setFieldErrors({})` before `setStep`.

- [ ] **Step 4: Step 2 markup — labels, delivery choice, phone fix**

Replace the whole `{step === 'details' && item && ( … )}` block with:
```tsx
      {/* Step 2: details */}
      {step === 'details' && item && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <p className="font-display font-semibold text-dark">
            {name(item)}
            {item.kind === 'experience' && <span className="text-gold-600"> · {money(item.amount_cents)}</span>}
          </p>
          <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

          <Field id="recipientName" label={t('labelRecipientName')} required error={fieldErrors.recipientName}>
            <input
              id="recipientName"
              className={inputCls}
              placeholder={t('phRecipientName')}
              value={form.recipientName}
              autoComplete="off"
              aria-invalid={!!fieldErrors.recipientName}
              aria-describedby={fieldErrors.recipientName ? 'recipientName-error' : undefined}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium text-dark mb-2">{t('deliveryTitle')}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={t('deliveryTitle')}>
              {(
                [
                  { key: 'email', label: t('deliveryEmail'), show: true },
                  { key: 'whatsapp', label: t('deliveryWhatsapp'), show: whatsappAvailable },
                  { key: 'self', label: t('deliverySelf'), show: true },
                ] as Array<{ key: DeliveryMethod; label: string; show: boolean }>
              )
                .filter((o) => o.show)
                .map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={form.deliveryMethod === o.key}
                    onClick={() => {
                      setFieldErrors({})
                      setForm({ ...form, deliveryMethod: o.key })
                    }}
                    className={`rounded-lg border px-3 py-3 min-h-[44px] text-sm transition-colors ${
                      form.deliveryMethod === o.key
                        ? 'border-gold bg-gold/15 text-dark font-semibold'
                        : 'border-beige bg-white text-warm-gray hover:border-gold/60'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
            </div>
            <p className="text-xs text-warm-gray mt-2">
              {form.deliveryMethod === 'email' && t('deliveryEmailHint')}
              {form.deliveryMethod === 'whatsapp' && t('deliveryWhatsappHint')}
              {form.deliveryMethod === 'self' && t('deliverySelfHint')}
            </p>
          </fieldset>

          {form.deliveryMethod === 'email' && (
            <Field id="recipientEmail" label={t('labelRecipientEmail')} required error={fieldErrors.recipientEmail}>
              <input
                id="recipientEmail"
                type="email"
                inputMode="email"
                className={inputCls}
                placeholder={t('phEmail')}
                value={form.recipientEmail}
                autoComplete="off"
                aria-invalid={!!fieldErrors.recipientEmail}
                aria-describedby={fieldErrors.recipientEmail ? 'recipientEmail-error' : undefined}
                onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
              />
            </Field>
          )}
          {form.deliveryMethod === 'whatsapp' && (
            <Field id="recipientPhone" label={t('labelRecipientPhone')} required error={fieldErrors.recipientPhone} labelFor={false}>
              <PhoneInput
                value={form.recipientPhone}
                onChange={(recipientPhone) => setForm({ ...form, recipientPhone })}
                placeholder="6612 3456"
                showIcon={false}
                inputClassName={inputCls}
                selectClassName={selectCls}
              />
            </Field>
          )}

          <Field id="message" label={`${t('labelMessage')} ${t('optional')}`}>
            <textarea id="message" className={inputCls} rows={2} maxLength={300} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>

          {form.deliveryMethod !== 'self' && (
            <Field id="scheduledDate" label={`${t('labelSendDate')} ${t('optional')}`} hint={t('sendDateHint')}>
              <input id="scheduledDate" className={inputCls} type="date" min={todayIso} value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
            </Field>
          )}

          {FEATURES.bag ? (
            <button
              onClick={addToBag}
              className="btn-primary w-full min-h-[44px] inline-flex items-center justify-center gap-2"
              disabled={!form.recipientName}
            >
              <ShoppingBag className="h-4 w-4" />
              {en ? 'Add to bag' : 'Agregar a la bolsa'}
            </button>
          ) : (
            <button onClick={goToPay} className="btn-primary w-full min-h-[44px]">
              {t('continue')}
            </button>
          )}
        </div>
      )}
```
(Task 10 later moves the `Continuar` button into a sticky bottom bar; keep it inline here so this task is verifiable on its own.)

- [ ] **Step 5: Step 3 markup — labelled buyer fields**

Replace the `<div className="grid grid-cols-1 md:grid-cols-2 gap-3">…</div>` with the buyer name/email inputs and the `<PhoneInput … buyerPhone … />` that follows it with:
```tsx
          <Field id="buyerName" label={t('labelBuyerName')} required error={fieldErrors.buyerName}>
            <input
              id="buyerName"
              className={inputCls}
              autoComplete="name"
              value={form.buyerName}
              aria-invalid={!!fieldErrors.buyerName}
              aria-describedby={fieldErrors.buyerName ? 'buyerName-error' : undefined}
              onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
            />
          </Field>
          <Field id="buyerEmail" label={t('labelBuyerEmail')} required error={fieldErrors.buyerEmail} hint={en ? 'Your receipt goes here.' : 'Aquí llega tu comprobante.'}>
            <input
              id="buyerEmail"
              type="email"
              inputMode="email"
              className={inputCls}
              autoComplete="email"
              placeholder={t('phEmail')}
              value={form.buyerEmail}
              aria-invalid={!!fieldErrors.buyerEmail}
              aria-describedby={fieldErrors.buyerEmail ? 'buyerEmail-error' : undefined}
              onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
            />
          </Field>
          <Field id="buyerPhone" label={`${t('labelBuyerPhone')} ${t('optional')}`} labelFor={false}>
            <PhoneInput
              value={form.buyerPhone}
              onChange={(buyerPhone) => setForm({ ...form, buyerPhone })}
              placeholder="6612 3456"
              showIcon={false}
              inputClassName={inputCls}
              selectClassName={selectCls}
            />
          </Field>
```
Change the outer step-3 card's `space-y-4` to `space-y-5`, and give the pay button `min-h-[44px]`:
```tsx
          <button onClick={pay} disabled={submitting} className="btn-primary w-full min-h-[44px] disabled:opacity-60">
```

- [ ] **Step 6: Same phone-field fix in the lead form**

In `src/components/shared/LeadForm.tsx` line 131 replace
```tsx
          selectClassName={`${inputCls} w-20 px-2`}
```
with
```tsx
          selectClassName="w-24 shrink-0 border border-beige rounded-lg px-2 py-3 min-h-[44px] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
```
(Check the file's own `inputCls` first: if it already lacks `w-full`, leave this line alone and note it in the report.)

- [ ] **Step 7: Verify in the dev server**

The public page redirects while `FEATURES.giftShop` is false, so set `giftShop: true` in `src/lib/nav.ts` **locally only** (never commit), open `http://localhost:3000/es/giftcards` at a 375px viewport, pick a card, and check:
- every input has a visible label above it, the required ones marked with a gold asterisk;
- the country selector is narrow and the phone field fills the rest of the row (previously a sliver);
- three delivery pills when the WhatsApp setting is on, two otherwise; choosing one shows only its own field; "Yo se lo entrego" hides the send-date field;
- pressing "Continuar" with an empty name shows "Escribe el nombre de quien recibe" under the name field, and the field's border turns red; the page does not advance;
- on step 3, pressing pay with an empty email shows "Escribe un correo válido" under the email field.
Then `git checkout -- src/lib/nav.ts` and confirm `git status --porcelain src/lib/nav.ts` prints nothing.

- [ ] **Step 8: Build, commit**

Run: `npm run build 2>&1 | tail -5` → `✓ Compiled successfully`.
```bash
git branch --show-current
git add src/components/giftshop/GiftShopClient.tsx src/components/shared/LeadForm.tsx src/messages/es.json src/messages/en.json
git commit -m "feat(giftshop): buyer picks how the card is delivered; labelled fields, inline errors, phone field fix

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```
The controller cherry-picks onto main and pushes after review.

---

### Task 4: Thank-you sentence

**Files:**
- Create: `src/lib/giftshop/thankYou.ts`
- Test: `src/lib/giftshop/thankYou.test.ts`
- Modify: `src/app/[locale]/giftcards/gracias/page.tsx` (type at :22-31, select at :38, copy at :63-92)

**Interfaces:**
- Produces:
  ```ts
  export interface ThankYouOrder {
    recipient_name: string; recipient_email: string | null; recipient_phone: string | null
    delivery_email: boolean; delivery_whatsapp: boolean; scheduled_send_at: string | null
  }
  export function thankYouSentence(order: ThankYouOrder, locale: 'es' | 'en'): string
  export function isSelfDelivery(order: ThankYouOrder): boolean
  ```

- [ ] **Step 1: Write the failing tests**

Create `src/lib/giftshop/thankYou.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { thankYouSentence, isSelfDelivery, type ThankYouOrder } from './thankYou'

const base: ThankYouOrder = {
  recipient_name: 'María',
  recipient_email: null,
  recipient_phone: null,
  delivery_email: false,
  delivery_whatsapp: false,
  scheduled_send_at: null,
}

describe('thankYouSentence', () => {
  it('email, immediate', () => {
    const o = { ...base, delivery_email: true, recipient_email: 'maria@example.com' }
    expect(thankYouSentence(o, 'es')).toBe('María recibirá su gift card por correo (maria@example.com) en los próximos minutos.')
    expect(thankYouSentence(o, 'en')).toBe('María will receive her gift card by email (maria@example.com) in the next few minutes.')
  })

  it('email, scheduled', () => {
    const o = { ...base, delivery_email: true, recipient_email: 'maria@example.com', scheduled_send_at: '2026-09-20T14:00:00.000Z' }
    expect(thankYouSentence(o, 'es')).toBe('María recibirá su gift card por correo (maria@example.com) el 20 de septiembre.')
    expect(thankYouSentence(o, 'en')).toBe('María will receive her gift card by email (maria@example.com) on September 20.')
  })

  it('whatsapp', () => {
    const o = { ...base, delivery_whatsapp: true, recipient_phone: '50761234567' }
    expect(thankYouSentence(o, 'es')).toBe('María recibirá su gift card por WhatsApp (+50761234567) en los próximos minutos.')
  })

  it('self', () => {
    expect(thankYouSentence(base, 'es')).toBe('Aquí tienes la gift card para María. Envíasela cuando quieras.')
    expect(thankYouSentence(base, 'en')).toBe("Here is María's gift card. Share it whenever you like.")
    expect(isSelfDelivery(base)).toBe(true)
    expect(isSelfDelivery({ ...base, delivery_email: true })).toBe(false)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/giftshop/thankYou.test.ts`
Expected: FAIL — `Cannot find module './thankYou'`.

- [ ] **Step 3: Implement**

Create `src/lib/giftshop/thankYou.ts`:
```ts
// One sentence for the post-payment page: who receives the card, through
// which channel, and when. Built from the order row, no other input.
export interface ThankYouOrder {
  recipient_name: string
  recipient_email: string | null
  recipient_phone: string | null
  delivery_email: boolean
  delivery_whatsapp: boolean
  scheduled_send_at: string | null
}

export function isSelfDelivery(o: ThankYouOrder): boolean {
  return !o.delivery_email && !o.delivery_whatsapp
}

function dateLabel(iso: string, locale: 'es' | 'en'): string {
  const d = new Date(iso)
  return locale === 'en'
    ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'America/Panama' })
    : d.toLocaleDateString('es-PA', { day: 'numeric', month: 'long', timeZone: 'America/Panama' })
}

export function thankYouSentence(o: ThankYouOrder, locale: 'es' | 'en'): string {
  const en = locale === 'en'
  if (isSelfDelivery(o)) {
    return en
      ? `Here is ${o.recipient_name}'s gift card. Share it whenever you like.`
      : `Aquí tienes la gift card para ${o.recipient_name}. Envíasela cuando quieras.`
  }
  const channel = o.delivery_email
    ? { es: 'por correo', en: 'by email', contact: o.recipient_email ?? '' }
    : { es: 'por WhatsApp', en: 'by WhatsApp', contact: o.recipient_phone ? `+${o.recipient_phone}` : '' }
  const when = o.scheduled_send_at
    ? en ? `on ${dateLabel(o.scheduled_send_at, 'en')}` : `el ${dateLabel(o.scheduled_send_at, 'es')}`
    : en ? 'in the next few minutes' : 'en los próximos minutos'
  return en
    ? `${o.recipient_name} will receive her gift card ${channel.en} (${channel.contact}) ${when}.`
    : `${o.recipient_name} recibirá su gift card ${channel.es} (${channel.contact}) ${when}.`
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/giftshop/thankYou.test.ts`
Expected: 4 passed. (If the `es-PA` date renders as `20 de septiembre` with a different article on your Node ICU, keep the test and adjust `dateLabel` to build the string from `getDate()` and a fixed month array instead of `toLocaleDateString`.)

- [ ] **Step 5: Use it in the thank-you page**

In `src/app/[locale]/giftcards/gracias/page.tsx`:

Add imports:
```ts
import { thankYouSentence, isSelfDelivery } from '@/lib/giftshop/thankYou'
```
Extend the `order` type with:
```ts
    recipient_email: string | null
    recipient_phone: string | null
    delivery_email: boolean
    delivery_whatsapp: boolean
```
Extend the `.select(...)` string to:
```ts
      .select('order_number, status, item_name, total_cents, recipient_name, recipient_email, recipient_phone, delivery_email, delivery_whatsapp, buyer_email, scheduled_send_at, gift_card_id')
```
Replace the first `<p className="text-sm text-warm-gray mb-5">…</p>` inside `order ? (` with:
```tsx
            <p className="text-sm text-dark mb-2">{thankYouSentence(order, en ? 'en' : 'es')}</p>
            <p className="text-sm text-warm-gray mb-5">
              {en ? `We sent your receipt to ${order.buyer_email}.` : `Enviamos tu comprobante a ${order.buyer_email}.`}
            </p>
```
Replace the `{giftUrl && !order.scheduled_send_at && ( … )}` block with:
```tsx
            {giftUrl && (isSelfDelivery(order) || !order.scheduled_send_at) && (
              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
                <a href={giftUrl} className="btn-primary inline-flex justify-center">
                  {en ? 'View the gift card' : 'Ver la gift card'}
                </a>
                {isSelfDelivery(order) && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      en ? `A Mimosa Spa gift for you 🎁 ${giftUrl}` : `Un regalo de Mimosa Spa para ti 🎁 ${giftUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center rounded-full border border-dark/20 px-6 py-3 text-sm font-medium text-dark hover:bg-dark/5"
                  >
                    {en ? 'Send by WhatsApp' : 'Enviar por WhatsApp'}
                  </a>
                )}
              </div>
            )}
```

- [ ] **Step 6: Build, commit, deploy**

Run: `npm run build 2>&1 | tail -5` → `✓ Compiled successfully`.
```bash
git branch --show-current
git add src/lib/giftshop/thankYou.ts src/lib/giftshop/thankYou.test.ts "src/app/[locale]/giftcards/gracias/page.tsx"
git commit -m "feat(giftshop): thank-you page says who gets the card, how and when

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
SHA=$(git rev-parse --short HEAD); git -C .worktrees/main cherry-pick $SHA && git -C .worktrees/main push origin main
```

---

### Task 5: Recipient copy — redemption at the spa

**Files:**
- Modify: `src/app/gift/[token]/page.tsx:117-120` and `:134-144`
- Modify: `src/lib/email/templates/giftcard.ts:61-67`

**Interfaces:** none (copy only).

- [ ] **Step 1: Card page note above the barcode**

Replace
```tsx
                      <p className="text-xs text-warm-gray mb-3">
                        Págalo en línea con este código o muéstralo en el spa · Pay
                        online with this code, or show it at the spa
                      </p>
```
with
```tsx
                      <p className="text-xs text-warm-gray mb-3">
                        Muestra este código al pagar en el spa · Show this code when
                        paying at the spa
                      </p>
```

- [ ] **Step 2: Card page CTA and note**

Replace the `<Link href={`/es/reservar?gc=…`}>…</Link>` and the `<p className="text-[11px] …">…</p>` after it with:
```tsx
                  <Link
                    href={`/es/reservar?gc=${encodeURIComponent(code)}`}
                    className="inline-flex items-center justify-center px-8 py-3 bg-gold text-dark font-semibold rounded-full hover:bg-gold/90 transition-colors"
                  >
                    Reservar mi cita · Book my appointment
                  </Link>
                  <p className="text-[11px] text-warm-gray mt-3 max-w-xs mx-auto">
                    Elige tu tratamiento y horario; presenta este código al pagar en el
                    spa. · Choose your treatment and time; show this code when paying at
                    the spa.
                  </p>
                  <ol className="text-left text-xs text-warm-gray mt-5 max-w-xs mx-auto space-y-1.5">
                    <li>1. Reserva tu cita en línea o por WhatsApp · Book online or via WhatsApp</li>
                    <li>2. Ven al spa el día de tu cita · Come to the spa on the day</li>
                    <li>3. Presenta este código al pagar · Show this code when paying</li>
                  </ol>
```

- [ ] **Step 3: Recipient email footnote**

In `recipientGiftEmail`, replace the two strings inside the last `<p>`:
```ts
          en
            ? 'Open your card to book online or via WhatsApp +507 6404-9464, and show this code when paying at the spa.'
            : 'Abre tu gift card, reserva en línea o por WhatsApp +507 6404-9464, y presenta este código al pagar en el spa.'
```

- [ ] **Step 4: Build, commit, deploy**

The rendered card page and the email footnote are verified with a fresh test purchase in Task 8 Step 1; no dev-server check here.

Run: `npm run build 2>&1 | tail -5`.
```bash
git branch --show-current
git add "src/app/gift/[token]/page.tsx" src/lib/email/templates/giftcard.ts
git commit -m "copy(giftshop): gift card is redeemed at the spa, not applied online

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
SHA=$(git rev-parse --short HEAD); git -C .worktrees/main cherry-pick $SHA && git -C .worktrees/main push origin main
```

---

### Task 6: Gift code rides into the booking

**Files:**
- Create: `src/lib/giftshop/giftCode.ts`, test `src/lib/giftshop/giftCode.test.ts`
- Create: `src/lib/booking/notes.ts`, test `src/lib/booking/notes.test.ts`
- Create: `src/components/booking/GiftCodeChip.tsx`
- Modify: `src/app/api/mindbody/book/route.ts` (destructure at :61-80, notes loop at :283-305)
- Modify: `src/components/booking/steps/ConfirmStep.tsx` (request body at :274-300, success at :323-332)
- Modify: `src/components/booking/BookingPageContent.tsx:215-216`

**Interfaces:**
- Produces:
  ```ts
  // src/lib/giftshop/giftCode.ts
  export const GIFT_CODE_STORAGE_KEY = 'mimosa-gc'
  export function sanitizeGiftCode(input: unknown): string | null
  export function readStoredGiftCode(): string | null      // browser only, never throws
  export function clearStoredGiftCode(): void              // browser only, never throws
  // src/lib/booking/notes.ts
  export function buildAppointmentNotes(o: { isPromoService: boolean; promotionName?: string | null; globalDiscountPercent?: number | null; customNotes?: string | null; giftCode?: string | null }): string
  ```
- `POST /api/mindbody/book` accepts optional `giftCode: string`.

- [ ] **Step 1: Write the failing tests**

`src/lib/giftshop/giftCode.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { sanitizeGiftCode } from './giftCode'

describe('sanitizeGiftCode', () => {
  it('uppercases and accepts serials and barcodes', () => {
    expect(sanitizeGiftCode(' mo000123 ')).toBe('MO000123')
    expect(sanitizeGiftCode('MW-000001')).toBe('MW-000001')
  })
  it('rejects junk', () => {
    expect(sanitizeGiftCode('abc')).toBeNull()
    expect(sanitizeGiftCode('has space')).toBeNull()
    expect(sanitizeGiftCode('x'.repeat(21))).toBeNull()
    expect(sanitizeGiftCode(42)).toBeNull()
    expect(sanitizeGiftCode(null)).toBeNull()
  })
})
```
`src/lib/booking/notes.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { buildAppointmentNotes } from './notes'

describe('buildAppointmentNotes', () => {
  it('base note only', () => {
    expect(buildAppointmentNotes({ isPromoService: false })).toBe('Reservado en línea')
  })
  it('promo service carries the promotion name, not the global discount', () => {
    expect(buildAppointmentNotes({ isPromoService: true, promotionName: 'Día Spa', globalDiscountPercent: 10 })).toBe('Reservado en línea | Promo: Día Spa')
  })
  it('non-promo service with a global discount', () => {
    expect(buildAppointmentNotes({ isPromoService: false, globalDiscountPercent: 10 })).toBe('Reservado en línea | Promo Online 10%')
  })
  it('custom notes then gift code, in that order', () => {
    expect(buildAppointmentNotes({ isPromoService: false, customNotes: 'Alergia a nueces', giftCode: 'MO000123' })).toBe('Reservado en línea | Alergia a nueces | Gift card: MO000123')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/giftshop/giftCode.test.ts src/lib/booking/notes.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the two modules**

`src/lib/giftshop/giftCode.ts`:
```ts
// A gift code arrives on /reservar?gc=CODE from the recipient's card page and
// rides into the Mindbody appointment note so the front desk sees it. It is
// informational only: the POS validates the card when the client pays.
export const GIFT_CODE_STORAGE_KEY = 'mimosa-gc'

const CODE_RE = /^[A-Z0-9-]{4,20}$/

export function sanitizeGiftCode(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const code = input.trim().toUpperCase()
  return CODE_RE.test(code) ? code : null
}

export function readStoredGiftCode(): string | null {
  try {
    return sanitizeGiftCode(window.sessionStorage.getItem(GIFT_CODE_STORAGE_KEY))
  } catch {
    return null
  }
}

export function clearStoredGiftCode(): void {
  try {
    window.sessionStorage.removeItem(GIFT_CODE_STORAGE_KEY)
  } catch {
    // private mode / storage disabled
  }
}
```
`src/lib/booking/notes.ts`:
```ts
// Mindbody appointment note for online bookings. Parts joined by ' | '.
// Camila (the WhatsApp agent) mirrors this format; keep the order stable.
export function buildAppointmentNotes(o: {
  isPromoService: boolean
  promotionName?: string | null
  globalDiscountPercent?: number | null
  customNotes?: string | null
  giftCode?: string | null
}): string {
  const parts: string[] = ['Reservado en línea']
  if (o.isPromoService && o.promotionName) {
    parts.push(`Promo: ${o.promotionName}`)
  } else if (o.globalDiscountPercent && o.globalDiscountPercent > 0) {
    parts.push(`Promo Online ${o.globalDiscountPercent}%`)
  }
  if (o.customNotes) parts.push(o.customNotes)
  if (o.giftCode) parts.push(`Gift card: ${o.giftCode}`)
  return parts.join(' | ')
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/giftshop/giftCode.test.ts src/lib/booking/notes.test.ts`
Expected: 6 passed.

- [ ] **Step 5: Book route uses both**

In `src/app/api/mindbody/book/route.ts` add imports:
```ts
import { buildAppointmentNotes } from '@/lib/booking/notes'
import { sanitizeGiftCode } from '@/lib/giftshop/giftCode'
```
In the destructuring of `body` add `giftCode,` right after `notes,`. After the destructuring add:
```ts
    const giftCodeNote = sanitizeGiftCode(giftCode)
```
Replace the note-building block inside the `for (const service of services as BookingService[])` loop — from `const noteParts: string[] = ['Reservado en línea']` through the `if (notes) { noteParts.push(notes) }` — with:
```ts
      const isPromoService = promoServiceIdSet.has(service.sessionTypeId)
      const appointmentNotes = buildAppointmentNotes({
        isPromoService,
        promotionName,
        globalDiscountPercent,
        customNotes: notes,
        giftCode: giftCodeNote,
      })
```
and change `Notes: noteParts.join(' | '),` to `Notes: appointmentNotes,`. Keep the two explanatory comments above the block.

- [ ] **Step 6: Confirm step sends the code and clears it on success**

In `src/components/booking/steps/ConfirmStep.tsx` add the import:
```ts
import { readStoredGiftCode, clearStoredGiftCode } from '@/lib/giftshop/giftCode'
```
In the `body: JSON.stringify({ … })` of the `/api/mindbody/book` request add, after `replaceAppointmentId: replaceAppointmentId || undefined,`:
```ts
          giftCode: readStoredGiftCode() ?? undefined,
```
Right after `setBookingConfirmation({ … })` add:
```ts
      clearStoredGiftCode()
```

- [ ] **Step 7: The chip**

Create `src/components/booking/GiftCodeChip.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Gift, X } from 'lucide-react'
import { clearStoredGiftCode, readStoredGiftCode, sanitizeGiftCode } from '@/lib/giftshop/giftCode'

// Shown above the booking widget while a gift code is stored. The code stays
// on screen after booking (state), even though the storage key is cleared, so
// the success screen still reminds the client to present the card at the spa.
export function GiftCodeChip() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    // Child effects run before the parent's, so read the URL too: the page
    // may not have written sessionStorage yet on the very first render.
    setCode(readStoredGiftCode() ?? sanitizeGiftCode(searchParams.get('gc')))
  }, [searchParams])

  if (!code) return null
  const last4 = code.slice(-4)

  return (
    <div className="container-spa max-w-4xl mb-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 px-3 py-1.5 text-xs text-dark">
        <Gift className="h-3.5 w-3.5 text-gold-600" />
        <span>
          Gift card ····{last4} lista para usar al pagar en el spa
        </span>
        <button
          type="button"
          aria-label="Quitar gift card"
          onClick={() => {
            clearStoredGiftCode()
            setCode(null)
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-gold/30"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
```
In `src/components/booking/BookingPageContent.tsx` import it:
```ts
import { GiftCodeChip } from '@/components/booking/GiftCodeChip'
```
and render it immediately before `<BookingWidget />` (line 216), inside the same container:
```tsx
        <GiftCodeChip />
        <div className="container-spa max-w-4xl">
          <BookingWidget />
```
(If `<BookingWidget />` is already wrapped by `<div className="container-spa max-w-4xl">`, place `<GiftCodeChip />` as the first child of that div instead and drop the chip's own `container-spa` wrapper class.)

- [ ] **Step 8: Verify in the dev server**

Open `http://localhost:3000/es/reservar?gc=MO000123`: the chip reads "Gift card ····0123 lista para usar al pagar en el spa". Reload without the query string: the chip persists (sessionStorage). Click ✕: it disappears and `sessionStorage.getItem('mimosa-gc')` is `null` in the console. Do **not** complete a real booking on the dev server (it writes to production Mindbody); the note is verified in Task 8 step 8.

- [ ] **Step 9: Typecheck, build, commit, deploy**

Run: `npm run build 2>&1 | tail -5`.
```bash
git branch --show-current
git add src/lib/giftshop/giftCode.ts src/lib/giftshop/giftCode.test.ts src/lib/booking/notes.ts src/lib/booking/notes.test.ts src/components/booking/GiftCodeChip.tsx src/components/booking/BookingPageContent.tsx src/components/booking/steps/ConfirmStep.tsx src/app/api/mindbody/book/route.ts
git commit -m "feat(booking): gift code from the card page rides into the Mindbody note

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
SHA=$(git rev-parse --short HEAD); git -C .worktrees/main cherry-pick $SHA && git -C .worktrees/main push origin main
```

---

### Task 7: Cron pass for WhatsApp deliveries waiting on the template

**Files:**
- Modify: `src/app/api/cron/giftcard-orders/route.ts` (imports :1-3, summary :16, insert new pass after :50)

**Interfaces:**
- Consumes: `getShopSettings()` from `@/lib/giftshop/data`; `deliverOrder()` from `@/lib/giftshop/fulfillment` (idempotent: email block skipped by `email_sent_at`, WhatsApp block sends when `delivery_whatsapp && recipient_phone && !whatsapp_sent_at && setting on`).
- Produces: cron response gains `whatsappSent: number`.

- [ ] **Step 1: Add the pass**

Change the import line to:
```ts
import { giftshopAdminClient, getShopSettings } from '@/lib/giftshop/data'
```
Change the summary initialiser to:
```ts
  const summary = { refulfilled: 0, scheduledSent: 0, whatsappSent: 0, mindbodyRetried: 0, abandoned: 0, flagged: 0 }
```
Insert after pass (b), before the `// (c) retry failed Mindbody registrations` comment:
```ts
  // (f) WhatsApp deliveries that were waiting for the template approval:
  // exactly one automatic attempt per order once the setting is on. A failed
  // attempt writes whatsapp_error and is left for manual follow-up in
  // /admin/giftcards/orders (the buyer's receipt carries the forward link).
  const settings = await getShopSettings()
  if (settings.whatsapp_delivery_enabled) {
    const nowIso = new Date(now).toISOString()
    const { data: waPending } = await supabase
      .from('gc_orders')
      .select('id')
      .eq('status', 'fulfilled')
      .eq('delivery_whatsapp', true)
      .not('recipient_phone', 'is', null)
      .is('whatsapp_sent_at', null)
      .is('whatsapp_error', null)
      .or(`scheduled_send_at.is.null,scheduled_send_at.lte.${nowIso}`)
      .limit(20)
    for (const o of waPending || []) {
      try {
        await deliverOrder(o.id)
        summary.whatsappSent++
      } catch (e) {
        console.error('cron whatsapp delivery failed', o.id, e)
      }
    }
  }
```

- [ ] **Step 2: Verify locally against the dev server**

With the dev server running:
```bash
CRON=$(grep '^CRON_SECRET' .env.local | cut -d'"' -f2); curl -s -H "Authorization: Bearer $CRON" http://localhost:3000/api/cron/giftcard-orders
```
Expected: JSON including `"whatsappSent":0` (the setting is off, so the pass is skipped; the point is that the route still returns 200 with the new key).

- [ ] **Step 3: Build, commit, deploy**

Run: `npm run build 2>&1 | tail -5`.
```bash
git branch --show-current
git add src/app/api/cron/giftcard-orders/route.ts
git commit -m "feat(giftshop): cron sends WhatsApp deliveries that waited for the template

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
SHA=$(git rev-parse --short HEAD); git -C .worktrees/main cherry-pick $SHA && git -C .worktrees/main push origin main
```

---

### Task 8: End-to-end run in test mode on the production URL

**Files:**
- Modify: `.claude/launch.json` (add one configuration; do not commit it)

Preconditions: Tasks 1–7 and 10–12 deployed; Tilopay account still in **test** mode; the owner has activated at least one catalog item with a Mindbody product ID in `/admin/giftcards/shop`.

The public page is behind `FEATURES.giftShop`, so the run happens **locally in test mode**, the same way the Aug 18 run proved the flow: the dev server reads `.env.local` (production Supabase, Tilopay test credentials, real Resend), `GIFTCARD_TEST_MODE=1` prefixes emails with "[TEST]" and makes the Mindbody registration a `Test:true` preflight, and Tilopay's hosted page redirects the browser back to localhost. Set up once:

1. In the root checkout set `giftShop: true` in `src/lib/nav.ts` **locally only** (never commit; `git checkout -- src/lib/nav.ts` when done).
2. Add this configuration to `.claude/launch.json` (local only; do not commit):
```json
    {
      "name": "giftshop-e2e",
      "runtimeExecutable": "env",
      "runtimeArgs": [
        "NEXT_PUBLIC_SITE_URL=http://localhost:3100",
        "GIFTCARD_TEST_MODE=1",
        "npx",
        "next",
        "dev",
        "-p",
        "3100"
      ],
      "port": 3100
    }
```
3. Start it with `preview_start` name `giftshop-e2e`. Every check below uses `http://localhost:3100`. Orders land in the production database, so `https://www.mimosaretreat.com/admin/giftcards/orders` shows them.

- [ ] **Step 1: Email delivery, immediate** — buy a $50 card, "Por correo", recipient = your own address. Pay with Tilopay test Visa. Expected: thank-you sentence "… por correo (…) en los próximos minutos."; recipient email from `regalos@` with "[TEST]" prefix and the "presenta este código al pagar en el spa" footnote; buyer receipt from `compras@`; order `fulfilled`, `mindbody_status` `registered` or `skipped`; card page shows "Reservar mi cita".
- [ ] **Step 2: Self delivery** — "Yo se lo entrego". Expected: no send-date field; thank-you page shows "Ver la gift card" + "Enviar por WhatsApp"; no recipient email is sent; buyer receipt has the forward link.
- [ ] **Step 3: Scheduled email** — date = tomorrow. Expected: thank-you says "el <date>"; no recipient email today; `scheduled_send_at` set. (Optionally set it to a past date in Supabase and run the cron by hand to see it deliver.)
- [ ] **Step 4: WhatsApp** — only once the template is approved and the setting is on: "Por WhatsApp" to your own number. Expected: the template message arrives with the card button; `whatsapp_sent_at` set.
- [ ] **Step 5: Validation** — pick "Por correo", leave the email empty and press "Continuar": expected the inline error "Escribe un correo válido para quien recibe" under the field, red border, no step change. On step 3 the recap line reads "Para <name> · por correo a <email> · se envía al pagar" and the header reads "Paso 3 de 3 · Paga".
- [ ] **Step 6: Callback safety** — take the exact callback URL from the browser history of Step 1 and `curl` it twice: expected second call is a no-op (order unchanged). Change one digit of `amount`: expected redirect to the error page with `reason=invalid`, order unchanged.
- [ ] **Step 7: Payment methods** — one purchase each with the Tilopay test Mastercard and AMEX numbers (and Yappy sandbox if enabled). Expected: "Método" column in the orders admin shows Visa/MC Web or AMEX Web; the Mindbody sale (Test mode: preflight only) accepted the tender.
- [ ] **Step 8: Gift code in the booking note** — from the Step 1 card page click "Reservar mi cita" (it opens `/es/reservar?gc=<code>` on the same local server, which books in the **real** Mindbody), complete a booking for a slot you will cancel right away. Expected: the chip is visible through the flow; the Mindbody appointment note ends with `| Gift card: <code>`. Cancel the appointment in Mindbody.
- [ ] **Step 9: Deliverability** — forward Step 1's recipient email to a Gmail, an Outlook and an iCloud address you control (or buy three cards). Expected: inbox, not spam; DKIM pass in the headers.
- [ ] **Step 10: Front desk scan** — open the card page on a phone at either desk and scan the barcode at the POS. Expected: the serial resolves to the card.

Record the outcome of each step in the PR description or the session notes. Any failure goes back to the task that owns the code before Task 9.

---

### Task 9: Launch flip

**Files:**
- Modify: `src/lib/nav.ts:6-7` and `:14`
- Modify (conditional): `src/messages/es.json`, `src/messages/en.json` (`giftShop.subtitle`, `giftShop.payCta`)

Preconditions (owner checklist from the spec §8, all confirmed in writing): Tilopay switched to production; Yappy decision made; `GIFTCARD_TEST_MODE` removed from Vercel Production; Mindbody product IDs set and the three "… Web" tenders exist; catalog items active; `*/10` cron confirmed running.

- [ ] **Step 1: Flags**

In `src/lib/nav.ts` set:
```ts
  giftShop: true,
```
and
```ts
export const GIFT_CARDS_PATH = '/giftcards'
```
In the `ROUTES` manifest add the shop page right after the `/menu/giftcards` entry so the sitemap lists it:
```ts
  { path: '/giftcards', sitemap: true, priority: 0.8 },
```
Leave `parejas` and `bag` as they are.

- [ ] **Step 2: Yappy copy (only if Yappy is NOT enabled in Tilopay)**

`src/messages/es.json`:
```json
    "subtitle": "Regala una experiencia Mimosa en 3 pasos: elige, personaliza y paga con tarjeta. Entrega por correo o WhatsApp.",
    "payCta": "Pagar con tarjeta",
```
`src/messages/en.json`:
```json
    "subtitle": "Gift a Mimosa experience in 3 steps: choose, personalize and pay by card. Delivered by email or WhatsApp.",
    "payCta": "Pay by card",
```
Skip this step if Yappy is enabled.

- [ ] **Step 3: Build, commit, deploy**

Run: `npm run build 2>&1 | tail -5`.
```bash
git branch --show-current
git add src/lib/nav.ts src/messages/es.json src/messages/en.json
git commit -m "feat(giftshop): open the online gift card shop

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
SHA=$(git rev-parse --short HEAD); git -C .worktrees/main cherry-pick $SHA && git -C .worktrees/main push origin main
```
If the Vercel env change did not trigger a redeploy on its own, this push is the redeploy.

- [ ] **Step 4: Verify production**

Open `https://www.mimosaretreat.com/es/giftcards`: the shop renders (no "muy pronto"). The header "Gift Cards" link and the homepage tile point to `/es/giftcards`. `https://www.mimosaretreat.com/sitemap.xml` lists `/es/giftcards` and `/en/giftcards`. Emails no longer carry the "[TEST]" prefix (check with the soft launch).

- [ ] **Step 5: Soft launch**

One real purchase with a real card by the owner (email delivery to themselves). Expected: real charge in Tilopay, order `fulfilled`, Mindbody gift card registered with the serial as barcode and tender "Visa/MC Web", emails without "[TEST]". Then one refund through the Tilopay portal and set `voided_at` on the card in Supabase. If Yappy is enabled, one real Yappy purchase too.

- [ ] **Step 6: Rollback note (only if needed)**

Fastest: in Supabase set `gc_shop_settings.shop_enabled = false` (checkout returns 503; the page shows "muy pronto" with the WhatsApp link). Code-level: revert the Task 9 commit on `main`.

---

### Task 10: Shop step header, sticky bottom bar and the pay-step recap (congruence with the booking widget)

**Files:**
- Create: `src/components/giftshop/ShopStepHeader.tsx`
- Create: `src/components/giftshop/ShopBottomBar.tsx`
- Create: `src/lib/giftshop/recap.ts`, test `src/lib/giftshop/recap.test.ts`
- Modify: `src/lib/giftshop/thankYou.ts` (export the date formatter)
- Modify: `src/components/giftshop/GiftShopClient.tsx` (step header, remove inline back link and inline primary buttons on steps 2–3, render the bar, recap on step 3)
- Modify: `src/components/layout/MobileBottomNav.tsx:22-26` (hide on the shop page as it already does on the booking page)
- Modify: `src/messages/es.json`, `src/messages/en.json` (`giftShop.stepOf`)

**Interfaces:**
- Consumes from Task 3: `goToPay()`, `pay()`, `submitting`, `form.deliveryMethod`, `setFieldErrors`.
- Produces:
  ```ts
  export function ShopStepHeader({ step }: { step: 1 | 2 | 3 }): JSX.Element
  export function ShopBottomBar(props: { onBack?: () => void; backLabel: string; onNext: () => void; nextLabel: string; disabled?: boolean; loading?: boolean }): JSX.Element
  export function recapLine(i: { recipientName: string; deliveryMethod: 'email' | 'whatsapp' | 'self'; recipientEmail: string; recipientPhone: string; scheduledDate: string }, locale: 'es' | 'en'): string
  export function longDateLabel(iso: string, locale: 'es' | 'en'): string   // moved out of thankYou.ts
  ```

Why (screen review): the widget says "Paso 1 de 4" with a progress bar and a sticky "Continuar" bar; the shop used three text pills and inline buttons. The pay step showed the card and total but nothing about who receives it and how.

- [ ] **Step 1: Write the failing recap tests**

Create `src/lib/giftshop/recap.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { recapLine } from './recap'

const base = { recipientName: 'María', deliveryMethod: 'email' as const, recipientEmail: 'maria@example.com', recipientPhone: '', scheduledDate: '' }

describe('recapLine', () => {
  it('email, sent on payment', () => {
    expect(recapLine(base, 'es')).toBe('Para María · por correo a maria@example.com · se envía al pagar')
    expect(recapLine(base, 'en')).toBe('For María · by email to maria@example.com · sent when you pay')
  })
  it('email, scheduled', () => {
    expect(recapLine({ ...base, scheduledDate: '2026-09-20' }, 'es')).toBe('Para María · por correo a maria@example.com · se envía el 20 de septiembre')
    expect(recapLine({ ...base, scheduledDate: '2026-09-20' }, 'en')).toBe('For María · by email to maria@example.com · sent on September 20')
  })
  it('whatsapp', () => {
    expect(recapLine({ ...base, deliveryMethod: 'whatsapp', recipientEmail: '', recipientPhone: '50761234567' }, 'es')).toBe('Para María · por WhatsApp al +50761234567 · se envía al pagar')
  })
  it('self', () => {
    expect(recapLine({ ...base, deliveryMethod: 'self', recipientEmail: '' }, 'es')).toBe('Para María · te la entregamos a ti en el comprobante')
    expect(recapLine({ ...base, deliveryMethod: 'self', recipientEmail: '' }, 'en')).toBe('For María · we hand it to you in your receipt')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/giftshop/recap.test.ts` → FAIL, `Cannot find module './recap'`.

- [ ] **Step 3: Export the date formatter and implement `recapLine`**

In `src/lib/giftshop/thankYou.ts` rename the private `dateLabel` to an exported `longDateLabel` (same body) and update its two call sites in `thankYouSentence`. Also make the English sentence gender-neutral (review finding on Task 4): in `thankYouSentence` change `will receive her gift card` to `will receive the gift card`, and in `thankYou.test.ts` change both English expectations to `María will receive the gift card by email (maria@example.com) in the next few minutes.` and `María will receive the gift card by email (maria@example.com) on September 20.`. Run `npx vitest run src/lib/giftshop/thankYou.test.ts` → 4 passed.

Create `src/lib/giftshop/recap.ts`:
```ts
import { longDateLabel } from './thankYou'

// One line on the pay step so the buyer confirms the decision that matters
// most before paying: who receives the card, how, and when.
export interface RecapInput {
  recipientName: string
  deliveryMethod: 'email' | 'whatsapp' | 'self'
  recipientEmail: string
  recipientPhone: string
  /** YYYY-MM-DD from the date input, or '' */
  scheduledDate: string
}

export function recapLine(i: RecapInput, locale: 'es' | 'en'): string {
  const en = locale === 'en'
  const who = en ? `For ${i.recipientName.trim()}` : `Para ${i.recipientName.trim()}`
  if (i.deliveryMethod === 'self') {
    return en ? `${who} · we hand it to you in your receipt` : `${who} · te la entregamos a ti en el comprobante`
  }
  const how =
    i.deliveryMethod === 'email'
      ? en ? `by email to ${i.recipientEmail.trim()}` : `por correo a ${i.recipientEmail.trim()}`
      : en ? `by WhatsApp to +${i.recipientPhone.replace(/\D/g, '')}` : `por WhatsApp al +${i.recipientPhone.replace(/\D/g, '')}`
  const when = i.scheduledDate
    ? en ? `sent on ${longDateLabel(`${i.scheduledDate}T14:00:00.000Z`, 'en')}` : `se envía el ${longDateLabel(`${i.scheduledDate}T14:00:00.000Z`, 'es')}`
    : en ? 'sent when you pay' : 'se envía al pagar'
  return `${who} · ${how} · ${when}`
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/giftshop/recap.test.ts src/lib/giftshop/thankYou.test.ts` → 8 passed.

- [ ] **Step 5: Header and bottom bar components**

Add to `src/messages/es.json` `giftShop`: `"stepOf": "Paso {step} de 3"`; to `en.json`: `"stepOf": "Step {step} of 3"`.

Create `src/components/giftshop/ShopStepHeader.tsx` (mirrors the mobile header of `src/components/booking/shared/StepProgress.tsx`):
```tsx
'use client'

import { useTranslations } from 'next-intl'

export function ShopStepHeader({ step }: { step: 1 | 2 | 3 }) {
  const t = useTranslations('giftShop')
  const labels: Record<1 | 2 | 3, string> = { 1: t('step1'), 2: t('step2'), 3: t('step3') }
  return (
    <div className="mb-6" role="group" aria-label={t('stepOf', { step })}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-dark">{t('stepOf', { step })}</span>
        <span className="text-sm text-warm-gray">{labels[step]}</span>
      </div>
      <div className="h-2 bg-beige rounded-full overflow-hidden">
        <div className="h-full bg-gold transition-all duration-500 rounded-full" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
    </div>
  )
}
```
Create `src/components/giftshop/ShopBottomBar.tsx` (mirrors `src/components/booking/shared/BookingNav.tsx`):
```tsx
'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export function ShopBottomBar({
  onBack,
  backLabel,
  onNext,
  nextLabel,
  disabled,
  loading,
}: {
  onBack?: () => void
  backLabel: string
  onNext: () => void
  nextLabel: string
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] text-sm text-warm-gray hover:text-dark rounded-lg hover:bg-beige/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled || loading}
          className="flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {nextLabel}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Wire them into the shop client**

In `GiftShopClient.tsx`:
- Import `ShopStepHeader`, `ShopBottomBar`, `recapLine`.
- Replace the pills header (`<div className="flex items-center justify-center gap-2 mb-8 text-sm">…</div>`) with `<ShopStepHeader step={step === 'pick' ? 1 : step === 'details' ? 2 : 3} />`.
- Remove the `{step !== 'pick' && (<button … ChevronLeft … {t('back')}</button>)}` back link; remove the inline `goToPay` button (non-bag branch) at the end of step 2 and the inline `pay` button at the end of step 3 (keep the `payNote` paragraph and the `error` paragraph).
- Give the root `<div>` the class `pb-28` so the fixed bar never covers content, and render the bar after the step blocks:
```tsx
      {step === 'details' && item && !FEATURES.bag && (
        <ShopBottomBar
          onBack={() => { setFieldErrors({}); setStep('pick') }}
          backLabel={t('back')}
          onNext={goToPay}
          nextLabel={t('continue')}
        />
      )}
      {step === 'pay' && item && (
        <ShopBottomBar
          onBack={() => { setFieldErrors({}); setStep('details') }}
          backLabel={t('back')}
          onNext={pay}
          nextLabel={t('payCta')}
          loading={submitting}
        />
      )}
```
- On step 3, insert the recap as the first child of the card, before the buyer fields:
```tsx
          <p className="text-sm text-dark bg-beige/60 rounded-xl px-4 py-3">
            {recapLine(form, en ? 'en' : 'es')}
          </p>
```
(`form` already has exactly the `RecapInput` fields plus extras; TypeScript accepts the wider object.)
- Remove the now-unused `ChevronLeft` import if nothing else uses it.
- Clear a field's error as soon as its value changes (screen review 2026-09-19: after correcting the email, the old error stayed until the next submit). Add one helper and use it in every `onChange` that has a matching `FieldErrors` key:
```ts
  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm({ ...form, [key]: value })
    if (key in fieldErrors) setFieldErrors(({ [key as keyof FieldErrors]: _omit, ...rest }) => rest)
  }
```
Then `onChange={(e) => setField('recipientName', e.target.value)}`, `setField('recipientEmail', …)`, `onChange={(recipientPhone) => setField('recipientPhone', recipientPhone)}`, `setField('buyerName', …)`, `setField('buyerEmail', …)`. Fields without an error key keep their existing `setForm` handlers.

In `src/components/layout/MobileBottomNav.tsx` change line 22 from
```ts
  const isOnBookingPage = pathname.includes('/reservar')
```
to
```ts
  const isOnBookingPage = pathname.includes('/reservar') || /\/giftcards$/.test(pathname)
```
so the site's bottom nav yields to the shop's action bar on the shop page only (the menu page `/menu/giftcards` and the thank-you page keep the nav).

- [ ] **Step 7: Verify in the dev server**

With `giftShop: true` set locally (revert afterwards), at 375px: the header reads "Paso 1 de 3 · Elige" with a one-third gold bar; step 2 shows "Paso 2 de 3 · Personaliza" and a sticky bar with "Volver" and "Continuar"; step 3 shows the recap line "Para María · por correo a … · se envía al pagar" above the buyer fields and a sticky "Pagar con tarjeta o Yappy"; the site's bottom nav is hidden on the shop page and visible on `/es/menu/giftcards`. Revert `src/lib/nav.ts`.

- [ ] **Step 8: Build, commit**

Run: `npm run build 2>&1 | tail -5`.
```bash
git branch --show-current
git add src/components/giftshop/ShopStepHeader.tsx src/components/giftshop/ShopBottomBar.tsx src/lib/giftshop/recap.ts src/lib/giftshop/recap.test.ts src/lib/giftshop/thankYou.ts src/components/giftshop/GiftShopClient.tsx src/components/layout/MobileBottomNav.tsx src/messages/es.json src/messages/en.json
git commit -m "feat(giftshop): same step header and action bar as the booking widget; recap before paying

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Booking widget copy congruence

**Files:**
- Modify: `src/components/booking/steps/AuthStep.tsx:862-876`
- Modify: `src/components/booking/steps/DateTimeStep.tsx:510`
- Modify: `src/components/booking/shared/FloatingCart.tsx:126`
- Modify: `src/components/booking/shared/StepProgress.tsx:73` and `:118`

**Interfaces:** none (copy only).

Why (screen review): the account step is "Paso 3 de 4" in the header but "Último paso" in the heading; the date strip says "10 slots" in a Spanish screen; the cart says "1 items".

- [ ] **Step 1: Account step heading and benefits**

In `AuthStep.tsx` replace
```tsx
            <h2 className="text-lg font-bold text-dark mb-0.5">Último paso</h2>
            <p className="text-xs text-warm-gray">
              Confirma tu número de teléfono para completar tu reserva
            </p>
```
with
```tsx
            <h2 className="text-lg font-bold text-dark mb-0.5">Tu cuenta</h2>
            <p className="text-xs text-warm-gray">
              Un paso más y tu cita queda lista: confirma tu número de teléfono.
            </p>
```
and replace the benefits box
```tsx
          <div className="mb-4 p-3 bg-beige-50 rounded-xl">
            <p className="text-xs font-medium text-dark mb-1.5">Al iniciar sesión podrás:</p>
            <ul className="text-xs text-warm-gray space-y-0.5">
              <li>• Ver tu historial de citas y compras</li>
              <li>• Gestionar tus próximas reservaciones</li>
              <li>• Recibir ofertas exclusivas</li>
              <li>• Agilizar futuras reservas</li>
            </ul>
          </div>
```
with
```tsx
          <p className="mb-4 text-xs text-warm-gray text-center">
            Con tu cuenta ves tus citas, las cambias cuando quieras y recibes ofertas exclusivas.
          </p>
```

- [ ] **Step 2: Date strip**

In `DateTimeStep.tsx` replace `{dateItem.slotsCount} slots` with
```tsx
                          {dateItem.slotsCount} {dateItem.slotsCount === 1 ? 'horario' : 'horarios'}
```

- [ ] **Step 3: Cart wording**

In `FloatingCart.tsx` replace `({itemCount} {itemCount === 1 ? 'item' : 'items'})` with
```tsx
                      ({itemCount} {itemCount === 1 ? 'tratamiento' : 'tratamientos'})
```
In `StepProgress.tsx` replace both occurrences of
```tsx
aria-label={`Carrito: ${itemCount} items`}
```
with
```tsx
aria-label={`Carrito: ${itemCount} ${itemCount === 1 ? 'tratamiento' : 'tratamientos'}`}
```

- [ ] **Step 4: Verify**

```bash
grep -n "Último paso\|} slots\|'items'\|items\`" src/components/booking/steps/AuthStep.tsx src/components/booking/steps/DateTimeStep.tsx src/components/booking/shared/FloatingCart.tsx src/components/booking/shared/StepProgress.tsx | grep -v ' [0-9]\{1,2\}\.tsx'; echo "(expect no lines above)"
npm run build 2>&1 | tail -5
```
Open `http://localhost:3000/es/reservar` at 375px, pick a spa, a treatment, continue to the date step: the strip reads "10 horarios"; continue to the account step: heading "Tu cuenta", one-line note, no bullet list.

- [ ] **Step 5: Commit**

```bash
git branch --show-current
git add src/components/booking/steps/AuthStep.tsx src/components/booking/steps/DateTimeStep.tsx src/components/booking/shared/FloatingCart.tsx src/components/booking/shared/StepProgress.tsx
git commit -m "copy(booking): step heading matches the progress header; Spanish-only wording

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Visible therapist choice on the date step (owner request, 2026-09-19)

**Files:**
- Modify: `src/components/booking/steps/DateTimeStep.tsx:4` (lucide import) and `:417-449` (the quiet therapist filter line)

**Interfaces:** none. Uses the existing `bookableStaff`, `filterStaff`, `handleFilterChange(staffId: string)` and `staffName(st)` already defined in `DateTimeStep` (lines ~237-247). The inline `TherapistPicker` that appears after a slot is chosen (rendered at line ~624) stays as it is.

Why: customers who book with "their" therapist could not see the option. It was a `text-xs` line, "¿Buscas a alguien en especial?", with a native select, placed above the date card. It becomes a card in the same style as "Selecciona Fecha" with the therapists as tappable chips, "Cualquiera" selected by default, so the majority still pass through with zero extra taps.

- [ ] **Step 1: Import the icon**

Change line 4 to:
```ts
import { Calendar, Loader2, Clock, ChevronLeft, ChevronRight, User, Users, Check } from 'lucide-react'
```

- [ ] **Step 2: Replace the quiet filter line with the therapist card**

Replace the whole block that starts with the comment `{/* Optional therapist filter — one quiet line for the majority,` and ends with the `)}` closing `{bookableStaff.length > 0 && (` (currently lines 417–449) with:
```tsx
            {/* Therapist choice — visible, optional. "Cualquiera" is preselected so
                the majority passes through with no extra tap; regulars tap a name
                and the dates and slots below filter to that therapist. */}
            {bookableStaff.length > 0 && (
              <div className="bg-white border border-beige-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold" />
                    Elige tu terapeuta
                    <span className="text-xs font-normal text-warm-gray">(opcional)</span>
                  </h3>
                </div>
                <div
                  className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x"
                  role="radiogroup"
                  aria-label="Terapeuta"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!filterStaff}
                    onClick={() => handleFilterChange('')}
                    className={`shrink-0 snap-start px-4 py-2.5 min-h-[44px] rounded-full border text-sm font-medium transition-colors ${
                      !filterStaff
                        ? 'border-gold bg-gold text-dark'
                        : 'border-beige-200 bg-white text-warm-gray hover:border-gold/60'
                    }`}
                  >
                    Cualquiera
                  </button>
                  {bookableStaff.map((st) => {
                    const selected = filterStaff?.Id === st.Id
                    return (
                      <button
                        key={st.Id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => handleFilterChange(String(st.Id))}
                        className={`shrink-0 snap-start px-4 py-2.5 min-h-[44px] rounded-full border text-sm font-medium transition-colors ${
                          selected
                            ? 'border-gold bg-gold text-dark'
                            : 'border-beige-200 bg-white text-warm-gray hover:border-gold/60'
                        }`}
                      >
                        {staffName(st)}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-xs text-warm-gray">
                  {filterStaff
                    ? `Mostrando horarios de ${staffName(filterStaff)}.`
                    : 'Si no eliges, te asignamos a una terapeuta del equipo.'}
                </p>
              </div>
            )}
```
The old `-mb-2` negative margin goes away with the old markup; the card sits inside the existing `space-y-6` container above the date card.

- [ ] **Step 3: Build**

Run: `npm run build 2>&1 | tail -5` → `✓ Compiled successfully`. Also `grep -n "Buscas a alguien" src/components/booking/steps/DateTimeStep.tsx` → no output.

- [ ] **Step 4: Commit**

```bash
git branch --show-current
git add src/components/booking/steps/DateTimeStep.tsx
git commit -m "feat(booking): therapist choice as a visible chip row on the date step

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```
The controller verifies in the browser (375px: card appears above the dates, chips scroll horizontally, tapping a name filters the date counts and slots, "Cualquiera" resets) and cherry-picks onto main after review.
