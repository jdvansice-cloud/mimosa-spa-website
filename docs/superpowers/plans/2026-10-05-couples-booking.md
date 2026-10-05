# Couples Booking Online Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A couple books two simultaneous treatments (one each, same duration) in the existing widget under one account, pays at the spa, and the front desk sees two paired Mindbody appointments with both names.

**Architecture:** Couples mode is a store `mode` that narrows the services step to "60 or 90 min → one treatment per person (admin-flagged)", asks the availability route for slots with two distinct free therapists, and makes the book route create two appointment chains with the same start and different staff, with rollback and pairing retries. Treatments stay the regular catalogue; a new `treatment_settings.couples_enabled` flag chosen in the admin drives the list. Everything ships behind `FEATURES.parejas = false`; couples mode stays reachable through `?couples=1` for testing.

**Tech Stack:** Next.js 16.3 App Router, React 19, zustand (persisted booking store), Tailwind, Supabase (service role), Mindbody v6 (`addMultipleAppointments`, `removeAppointment`), vitest (node environment, `src/**/*.test.ts`).

**Spec:** `docs/superpowers/specs/2026-09-19-couples-booking-design.md` (status line notes the 2026-10-05 decisions: regular treatments + admin flag, duration first, one treatment each).

## Global Constraints

- Copy in the booking widget is **hardcoded Spanish** (no next-intl keys in the step components); follow that. Marketing-page copy is bilingual through `src/content/pages.ts` style `{ es, en }` objects.
- Every new customer-facing control is at least **44px tall**, has a visible label, and errors render inline under the field with `aria-describedby`.
- Couples UI is **inert while `FEATURES.parejas` is false** except through the `?couples=1` query (testing path). No flag flip inside this plan's tasks 1–12.
- Prices are **per person** in Mindbody. Couples totals are the sum of the two chosen treatments' prices ("para dos"), never a multiplier applied twice.
- `calculateTotalDuration` and anything feeding the availability `duration` param must **not double-count** in couples mode: both appointments run in parallel, so duration = the chosen 60 or 90.
- Both appointments are booked under the **booker's Mindbody client id**; the companion is a first name only (1–60 chars), never persisted to storage.
- Never `git add` files whose name contains a space (Finder duplicates), nor `.next/`, nor `node_modules/`. Never push. Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Migrations are reference SQL run by hand in the Supabase SQL editor; the code must tolerate the column being absent until then (defaults to `false`).
- Tests: `npx vitest run <path>` for the task's files, then `npx tsc --noEmit` and `npm run lint` (0 errors) before each commit.

---

## File structure

| File | Responsibility |
|---|---|
| `supabase/migrations/20261005_treatment_couples.sql` | `couples_enabled` column |
| `src/app/api/admin/treatments/route.ts` | expose/persist `couples_enabled` |
| `src/app/admin/tratamientos/page.tsx` | "Disponible en pareja" toggle |
| `src/app/api/treatments/settings/route.ts` | public settings now include `couples_enabled` |
| `src/lib/booking/couples.ts` (+ `.test.ts`) | pure pairing helpers shared by the widget route and the WhatsApp agent |
| `src/lib/booking/pricing.ts` (+ `pricing.test.ts`) | companion line, parallel duration |
| `src/lib/booking/notes.ts` (+ test) | couples note endings |
| `src/lib/booking/store.ts` (+ `store.couples.test.ts`) | `mode`, `couplesDuration`, `companionService`, `companionName` |
| `src/app/api/mindbody/availability/route.ts` | `people=2` filter |
| `src/app/api/mindbody/book/route.ts` | two chains, rollback, retry, couples notes/messages |
| `src/components/booking/shared/ModePills.tsx` | "Para mí / Para dos 💕" |
| `src/components/booking/shared/CouplesPicker.tsx` | duration tiles + two pickers |
| `src/components/booking/steps/ServiceStep.tsx`, `DateTimeStep.tsx`, `ConfirmStep.tsx`, `SuccessStep.tsx` | couples branches |
| `src/components/booking/shared/BookingNav.tsx`, `FloatingCart.tsx`, `StepProgress.tsx` | proceed rule, counts |
| `src/components/booking/BookingPageContent.tsx`, `BookingWidget.tsx` | deep link, analytics meta |
| `src/lib/couples/offers.ts` (+ test), `src/components/marketing/OfferCard.tsx`, `src/app/[locale]/parejas/page.tsx`, `src/components/marketing/CouplesTreatmentsList.tsx` | couples page price + booking link + menu by duration |
| `src/lib/wati-agent/tools/validate.ts` | `pairSlotsForCouple` re-pointed |

---

### Task 1: `couples_enabled` flag end to end (migration, admin API, admin toggle, public settings)

**Files:**
- Create: `supabase/migrations/20261005_treatment_couples.sql`
- Modify: `src/app/api/admin/treatments/route.ts` (interface lines 21-36, GET merge defaults, POST `upsertData` 184-197, PATCH insert defaults 228-298)
- Modify: `src/app/admin/tratamientos/page.tsx` (toggles 148-186, buttons 267-295)
- Modify: `src/app/api/treatments/settings/route.ts` (select at line 30, `PublicTreatmentSetting`)

**Interfaces:**
- Produces: `GET /api/treatments/settings` items gain `couples_enabled: boolean` (default `false`). Admin `TreatmentSetting` gains `couples_enabled: boolean`.

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/20261005_treatment_couples.sql
-- Treatments that two therapists can run side by side for a couples booking.
-- Run by hand in the Supabase SQL editor.
ALTER TABLE public.treatment_settings
  ADD COLUMN IF NOT EXISTS couples_enabled BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS treatment_settings_couples_idx
  ON public.treatment_settings (couples_enabled)
  WHERE couples_enabled = true;
```

- [ ] **Step 2: Admin API**

In `src/app/api/admin/treatments/route.ts`:
1. Add `couples_enabled: boolean` to the `TreatmentSetting` interface (after `is_top_pick`).
2. In the GET merge where defaults are applied (`show_in_booking ?? service.OnlineBooking`), add `couples_enabled: setting?.couples_enabled ?? false`.
3. In the POST `upsertData` object list add `couples_enabled: t.couples_enabled ?? false`.
4. In the PATCH insert defaults add `couples_enabled: false` and allow `couples_enabled` through the updates (it already spreads `...updates`; just make sure the type includes it).

Guard for the column not existing yet: wrap nothing — Supabase returns an error only on write of an unknown column. Keep writes tolerant: in POST, if the upsert error message matches `/couples_enabled/`, retry the upsert once with the field stripped and log `console.warn('treatment_settings.couples_enabled missing; run 20261005 migration')`.

- [ ] **Step 3: Admin toggle**

In `src/app/admin/tratamientos/page.tsx`, next to `toggleTopPick` add:

```ts
const toggleCouples = (id: number) =>
  setTreatments(prev => prev.map(t =>
    t.mindbody_service_id === id ? { ...t, couples_enabled: !t.couples_enabled } : t
  ))
```

and next to `widgetBtn` add a button rendered only when `t.duration === 60 || t.duration === 90`:

```tsx
const couplesBtn = (t: TreatmentSetting) => (
  <button
    type="button"
    onClick={() => toggleCouples(t.mindbody_service_id)}
    title={t.couples_enabled ? 'Quitar de reservas en pareja' : 'Disponible en pareja'}
    aria-pressed={t.couples_enabled}
    className={`p-2 rounded-lg min-h-[44px] min-w-[44px] ${t.couples_enabled ? 'bg-rose-100 text-rose-700' : 'bg-beige-100 text-warm-gray hover:bg-beige-200'}`}
  >
    <Heart className="w-4 h-4" />
  </button>
)
```

Import `Heart` from `lucide-react`. Render `couplesBtn(t)` beside `widgetBtn(t)` in the row actions. Add a legend line under the page title: `❤ Disponible en pareja: aparece cuando el cliente elige "Para dos" (solo tratamientos de 60 o 90 min).`

- [ ] **Step 4: Public settings API**

In `src/app/api/treatments/settings/route.ts` add `couples_enabled` to the select string and to `PublicTreatmentSetting` (`couples_enabled: boolean`). If the select fails with a message matching `/couples_enabled/`, retry the query without it and map `couples_enabled: false` (same tolerance rule as Step 2).

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint` → 0 errors. Start the dev server, open `/admin/tratamientos` (admin session), confirm the heart toggle appears only on 60/90 min rows and saving persists after reload (if the column is missing locally the warn appears and the save still succeeds without the field). `curl -s localhost:3000/api/treatments/settings | head -c 300` shows `couples_enabled`.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20261005_treatment_couples.sql src/app/api/admin/treatments/route.ts src/app/admin/tratamientos/page.tsx src/app/api/treatments/settings/route.ts
git commit -m "feat(admin): 'Disponible en pareja' flag on treatments (couples_enabled)"
```

---

### Task 2: Store — couples mode, duration, companion

**Files:**
- Modify: `src/lib/booking/store.ts` (state 25-96, actions 102-175, initialState 177-246, `calculateTotalDuration` 272-276, `setLocation` 409-422, persist `partialize` 694-725, selectors 737-763)
- Create: `src/lib/booking/store.couples.test.ts`

**Interfaces:**
- Produces (state): `mode: 'single' | 'couples'`, `couplesDuration: 60 | 90 | null`, `companionService: MindbodyService | null`, `companionName: string`.
- Produces (actions): `setMode(mode)`, `setCouplesDuration(d: 60 | 90 | null)`, `setCompanionService(s: MindbodyService | null)`, `setCompanionName(name: string)`.
- Produces (selectors): `selectIsCouples(state)`, `selectCouplesReady(state)` (location set, exactly one booker service, companion service set, both `Duration === couplesDuration`), `selectCanProceed` honours couples on the services step.

- [ ] **Step 1: Failing tests**

```ts
// src/lib/booking/store.couples.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useBookingStore, selectCanProceed, selectTotalDuration, selectCouplesReady } from './store'
import type { MindbodyService, MindbodyLocation } from '@/types/booking'

const svc = (Id: number, Duration: number, Price = 79): MindbodyService => ({
  Id, Name: `S${Id}`, Description: null, Duration, Price, OnlineBooking: true, Category: 'Masajes', ProgramId: 4,
})
const loc = { Id: 1, Name: 'Costa del Este' } as MindbodyLocation

describe('couples mode in the booking store', () => {
  beforeEach(() => useBookingStore.getState().reset())

  it('defaults to single mode with no companion', () => {
    const s = useBookingStore.getState()
    expect(s.mode).toBe('single')
    expect(s.couplesDuration).toBeNull()
    expect(s.companionService).toBeNull()
    expect(s.companionName).toBe('')
  })

  it('setMode clears services, addons, staff, date, time and companion', () => {
    const s = useBookingStore.getState()
    s.setLocation(loc); s.addService(svc(10, 60)); s.setDate('2026-10-10'); s.setTime('10:00')
    s.setMode('couples')
    const t = useBookingStore.getState()
    expect(t.selectedServices).toEqual([]); expect(t.selectedDate).toBeNull(); expect(t.selectedTime).toBeNull()
    expect(t.mode).toBe('couples'); expect(t.selectedLocation?.Id).toBe(1)
    t.setCouplesDuration(60); t.addService(svc(10, 60)); t.setCompanionService(svc(11, 60)); t.setCompanionName('María')
    useBookingStore.getState().setMode('single')
    const u = useBookingStore.getState()
    expect(u.companionService).toBeNull(); expect(u.couplesDuration).toBeNull(); expect(u.companionName).toBe('')
    expect(u.selectedServices).toEqual([])
  })

  it('setCouplesDuration clears both picks', () => {
    const s = useBookingStore.getState()
    s.setLocation(loc); s.setMode('couples'); s.setCouplesDuration(60)
    s.addService(svc(10, 60)); s.setCompanionService(svc(11, 60))
    useBookingStore.getState().setCouplesDuration(90)
    const t = useBookingStore.getState()
    expect(t.selectedServices).toEqual([]); expect(t.companionService).toBeNull(); expect(t.couplesDuration).toBe(90)
  })

  it('total duration is not doubled in couples mode', () => {
    const s = useBookingStore.getState()
    s.setLocation(loc); s.setMode('couples'); s.setCouplesDuration(90)
    s.addService(svc(10, 90)); s.setCompanionService(svc(11, 90))
    expect(selectTotalDuration(useBookingStore.getState())).toBe(90)
  })

  it('services step proceeds only with both picks of the chosen duration', () => {
    const s = useBookingStore.getState()
    s.setLocation(loc); s.setMode('couples'); s.setCouplesDuration(60)
    expect(selectCanProceed(useBookingStore.getState())).toBe(false)
    s.addService(svc(10, 60))
    expect(selectCanProceed(useBookingStore.getState())).toBe(false)
    s.setCompanionService(svc(11, 60))
    expect(selectCouplesReady(useBookingStore.getState())).toBe(true)
    expect(selectCanProceed(useBookingStore.getState())).toBe(true)
  })

  it('addService in couples mode replaces instead of appending', () => {
    const s = useBookingStore.getState()
    s.setLocation(loc); s.setMode('couples'); s.setCouplesDuration(60)
    s.addService(svc(10, 60)); s.addService(svc(12, 60))
    expect(useBookingStore.getState().selectedServices.map(x => x.Id)).toEqual([12])
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/booking/store.couples.test.ts` → FAIL (`mode` undefined / `setMode` is not a function).

- [ ] **Step 3: Implement**

In `store.ts`:
1. State: add after `selectedAddons`:
   ```ts
   // Couples booking ("Para dos"): one treatment each, same duration, parallel
   mode: 'single' | 'couples'
   couplesDuration: 60 | 90 | null
   companionService: MindbodyService | null
   companionName: string // never persisted (personal data)
   ```
2. Actions: `setMode: (mode: 'single' | 'couples') => void`, `setCouplesDuration: (d: 60 | 90 | null) => void`, `setCompanionService: (s: MindbodyService | null) => void`, `setCompanionName: (name: string) => void`.
3. `initialState`: `mode: 'single', couplesDuration: null, companionService: null, companionName: ''`.
4. Implementations:
   ```ts
   setMode: (mode) => set(state => mode === state.mode ? {} : ({
     mode, couplesDuration: null, companionService: null, companionName: '',
     selectedServices: [], selectedAddons: [], selectedStaff: null,
     selectedDate: null, selectedTime: null, availableDates: [], availableSlots: [], pricing: null,
   })),
   setCouplesDuration: (d) => set({ couplesDuration: d, selectedServices: [], companionService: null, selectedStaff: null, selectedDate: null, selectedTime: null, availableSlots: [], pricing: null }),
   setCompanionService: (s) => set({ companionService: s, selectedDate: null, selectedTime: null, selectedStaff: null, availableSlots: [], pricing: null }),
   setCompanionName: (name) => set({ companionName: name.slice(0, 60) }),
   ```
5. `addService`: at the top, `if (get().mode === 'couples') { set({ selectedServices: [service], selectedStaff: null, selectedDate: null, selectedTime: null, availableSlots: [], pricing: null }); return }` (replace semantics; keep the existing dedupe for single mode).
6. `setLocation`: also reset `companionService: null` (keep `mode` and `couplesDuration`).
7. `calculateTotalDuration(services, addons)` unchanged (couples uses `selectedServices` = one item, so it already equals the chosen duration; add a comment saying so).
8. `reset`/`resetForNewBooking`: inherit from `initialState` (mode goes back to single).
9. Persist: add `mode`, `couplesDuration`, `companionService` to `partialize` (NOT `companionName`); bump `version` to 3 and extend `migrate` to default the three fields when absent.
10. Selectors:
   ```ts
   export const selectIsCouples = (state: BookingState) => state.mode === 'couples'
   export const selectCouplesReady = (state: BookingState) =>
     state.mode === 'couples' && state.selectedLocation !== null && state.couplesDuration !== null &&
     state.selectedServices.length === 1 && state.companionService !== null &&
     state.selectedServices[0].Duration === state.couplesDuration && state.companionService.Duration === state.couplesDuration
   ```
   and in `selectCanProceed` case `'services'`: `return state.mode === 'couples' ? selectCouplesReady(state) : (state.selectedLocation !== null && state.selectedServices.length > 0)`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/booking/store.couples.test.ts` → PASS. Then `npx vitest run` (all) → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/store.ts src/lib/booking/store.couples.test.ts
git commit -m "feat(booking): couples mode, duration and companion in the store"
```

---

### Task 3: Pricing — companion line, parallel duration

**Files:**
- Modify: `src/lib/booking/pricing.ts` (`CartPricingInput` 50-56, totalDuration 102-104)
- Create: `src/lib/booking/pricing.test.ts`

**Interfaces:**
- Produces: `CartPricingInput` gains `companionService?: MindbodyService | null` and `parallel?: boolean`. When `companionService` is set it is priced as one more regular line (full price, promotions do not apply to it, the global discount does). When `parallel` is true `totalDuration = max(duration of services ∪ companion)` instead of the sum. `CartPricing` gains `companionLine: { name: string; price: number } | null`.

- [ ] **Step 1: Failing tests**

```ts
// src/lib/booking/pricing.test.ts
import { describe, it, expect } from 'vitest'
import { calculateCartPricing } from './pricing'
import type { MindbodyService } from '@/types/booking'

const svc = (Id: number, Price: number, Duration = 60): MindbodyService => ({
  Id, Name: `S${Id}`, Description: null, Duration, Price, OnlineBooking: true, Category: 'Masajes', ProgramId: 4,
})
const base = { addons: [], promotion: null, globalDiscountActive: false, globalDiscountPercent: 0 }

describe('calculateCartPricing couples', () => {
  it('adds the companion treatment as a second per-person line', () => {
    const p = calculateCartPricing({ ...base, services: [svc(1, 79)], companionService: svc(2, 89), parallel: true })
    expect(p.companionLine).toEqual({ name: 'S2', price: 89 })
    expect(p.subtotalBeforeTax).toBeCloseTo(168, 2)
    expect(p.totalWithTax).toBeCloseTo(168 * (1 + p.itbmRate), 2)
  })
  it('same treatment for both prices it twice', () => {
    const p = calculateCartPricing({ ...base, services: [svc(1, 79)], companionService: svc(1, 79), parallel: true })
    expect(p.subtotalBeforeTax).toBeCloseTo(158, 2)
  })
  it('parallel duration is the max, not the sum', () => {
    const p = calculateCartPricing({ ...base, services: [svc(1, 79, 90)], companionService: svc(2, 89, 90), parallel: true })
    expect(p.totalDuration).toBe(90)
  })
  it('without companion nothing changes', () => {
    const a = calculateCartPricing({ ...base, services: [svc(1, 79)] })
    const b = calculateCartPricing({ ...base, services: [svc(1, 79)], companionService: null })
    expect(a.subtotalBeforeTax).toBe(b.subtotalBeforeTax)
    expect(b.companionLine).toBeNull()
  })
  it('global discount applies to the companion line too', () => {
    const p = calculateCartPricing({ ...base, services: [svc(1, 100)], companionService: svc(2, 100), parallel: true, globalDiscountActive: true, globalDiscountPercent: 10 })
    expect(p.globalDiscountAmount).toBeCloseTo(20, 2)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/booking/pricing.test.ts` → FAIL (`companionLine` undefined).

- [ ] **Step 3: Implement**

In `pricing.ts`: add the two optional inputs; compute `companionLine = companionService ? { name: companionService.Name, price: companionService.Price } : null`; add `companionService.Price` to `regularServicesSubtotal`/`regularItemsTotal` (the same bucket as a non-promo extra service so the global discount math covers it); when `parallel`, `totalDuration = Math.max(0, ...services.map(s => s.Duration), companionService?.Duration ?? 0)`; add `companionLine` to the returned object and the `CartPricing` interface. Keep every existing field's value identical when `companionService` is null.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/booking/pricing.test.ts` → PASS; `npx tsc --noEmit` → clean (ConfirmStep/SuccessStep/FloatingCart still compile because the new fields are optional).

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/pricing.ts src/lib/booking/pricing.test.ts
git commit -m "feat(booking): price the companion treatment; parallel duration for couples"
```

---

### Task 4: Pairing helpers shared with the WhatsApp agent

**Files:**
- Create: `src/lib/booking/couples.ts`, `src/lib/booking/couples.test.ts`
- Modify: `src/lib/wati-agent/tools/validate.ts:17-19` (`pairSlotsForCouple` delegates)

**Interfaces:**
- Produces:
  ```ts
  export interface PairableSlot { time: string; staffIds: number[] }
  /** Slots where at least two distinct therapists are free. */
  export function keepPairSlots<T extends PairableSlot>(slots: T[]): T[]
  /** Ordered candidate (a, b) pairings, a !== b, first pairing uses the first two ids; at most `limit` (default 3). */
  export function staffPairings(staffIds: number[], limit?: number): Array<[number, number]>
  ```
- Consumed by Task 5 (availability), Task 6 (book), and the agent.

- [ ] **Step 1: Failing tests**

```ts
// src/lib/booking/couples.test.ts
import { describe, it, expect } from 'vitest'
import { keepPairSlots, staffPairings } from './couples'

describe('keepPairSlots', () => {
  it('drops slots with fewer than two distinct therapists', () => {
    const out = keepPairSlots([
      { time: '09:00', staffIds: [] },
      { time: '10:00', staffIds: [1] },
      { time: '11:00', staffIds: [1, 1] },
      { time: '12:00', staffIds: [1, 2] },
      { time: '13:00', staffIds: [3, 1, 2] },
    ])
    expect(out.map(s => s.time)).toEqual(['12:00', '13:00'])
  })
  it('preserves extra fields on the slot', () => {
    const out = keepPairSlots([{ time: '12:00', staffIds: [1, 2], displayTime: '12:00 PM', available: true }])
    expect(out[0].displayTime).toBe('12:00 PM')
  })
})

describe('staffPairings', () => {
  it('returns distinct ordered pairs, first pair = first two ids', () => {
    expect(staffPairings([5, 7, 9])).toEqual([[5, 7], [5, 9], [7, 9]])
  })
  it('dedupes ids and caps at the limit', () => {
    expect(staffPairings([1, 1, 2, 3, 4], 2)).toEqual([[1, 2], [1, 3]])
  })
  it('returns nothing with fewer than two ids', () => {
    expect(staffPairings([1])).toEqual([])
    expect(staffPairings([])).toEqual([])
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/booking/couples.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/couples.ts
// One pairing rule for every channel (web widget route + Camila, the
// WhatsApp agent): a couple needs two DISTINCT therapists free at the same
// start for the whole duration. Mindbody availability does not expose
// per-service qualification, so qualification is still discovered at book
// time (the route retries the next pairing on a staff error).
export interface PairableSlot {
  time: string
  staffIds: number[]
}

export function keepPairSlots<T extends PairableSlot>(slots: T[]): T[] {
  return slots.filter(s => new Set(s.staffIds).size >= 2)
}

export function staffPairings(staffIds: number[], limit = 3): Array<[number, number]> {
  const ids = [...new Set(staffIds)]
  const out: Array<[number, number]> = []
  for (let i = 0; i < ids.length && out.length < limit; i++) {
    for (let j = i + 1; j < ids.length && out.length < limit; j++) out.push([ids[i], ids[j]])
  }
  return out
}
```

In `validate.ts` replace the body of `pairSlotsForCouple` with:
```ts
import { keepPairSlots } from '@/lib/booking/couples'
export function pairSlotsForCouple(slots: Array<{ time: string; staffIds: number[] }>): string[] {
  return keepPairSlots(slots).map(s => s.time)
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/booking/couples.test.ts src/lib/wati-agent/tools/validate.test.ts src/lib/wati-agent/tools/mindbody-adapter.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/couples.ts src/lib/booking/couples.test.ts src/lib/wati-agent/tools/validate.ts
git commit -m "feat(booking): shared couples pairing helpers (web + WhatsApp agent)"
```

---

### Task 5: Availability route — `people=2`

**Files:**
- Modify: `src/app/api/mindbody/availability/route.ts` (params 20-25, slot push 535-542, response 563-578)

**Interfaces:**
- Consumes: `keepPairSlots` (Task 4).
- Produces: query param `people` (`1` default, `2`); with `people=2` every returned slot has ≥2 distinct `availableStaffIds`, `slotsCount` reflects the filtered list, dates with zero kept slots are dropped, and the response gains `people: 1 | 2`.

- [ ] **Step 1: Implement**

1. Parse: `const people = searchParams.get('people') === '2' ? 2 : 1` next to `duration`.
2. After each date's `slots` array is complete and before it is pushed into `availableDates`, apply:
   ```ts
   const keptSlots = people === 2
     ? keepPairSlots(slots.map(s => ({ ...s, staffIds: s.availableStaffIds }))).map(({ staffIds: _staffIds, ...rest }) => rest)
     : slots
   if (keptSlots.length === 0) continue // or skip push, matching the existing "only dates with ≥1 slot" rule
   availableDates.push({ date, displayDate, hasAvailability: true, slotsCount: keptSlots.length, slots: keptSlots })
   ```
   (adapt to the exact variable names at 535-560; the point is: filter before counting).
3. Add `people` to the JSON response next to `requestedDuration`.

- [ ] **Step 2: Verify manually**

Run on the dev server (pick a real location id and two real 60-min service ids):
```bash
curl -s "localhost:3000/api/mindbody/availability?locationId=1&serviceIds=123,456&startDate=$(date -v+1d +%F)&endDate=$(date -v+3d +%F)&duration=60" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("single", j.availableDates.map(d=>d.slotsCount))})'
curl -s "localhost:3000/api/mindbody/availability?locationId=1&serviceIds=123,456&startDate=$(date -v+1d +%F)&endDate=$(date -v+3d +%F)&duration=60&people=2" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("couples", j.people, j.availableDates.map(d=>d.slotsCount), "min staff/slot", Math.min(...j.availableDates.flatMap(d=>d.slots.map(x=>new Set(x.availableStaffIds).size))))})'
```
Expected: couples counts ≤ single counts, `people` = 2, min staff per slot ≥ 2.

- [ ] **Step 3: tsc + lint, commit**

```bash
npx tsc --noEmit && npm run lint
git add src/app/api/mindbody/availability/route.ts
git commit -m "feat(availability): people=2 keeps only slots with two free therapists"
```

---

### Task 6: Book route — two chains, rollback, pairing retries, couples wording

**Files:**
- Modify: `src/lib/booking/notes.ts` + `src/lib/booking/notes.test.ts`
- Modify: `src/app/api/mindbody/book/route.ts` (body 59-84, validation 89-120, staff resolution 211-265, chains 267-311, submission 314-356, couples detection 427-438, WhatsApp 440-489, email 493-511, Supabase insert 513-565, response 626-635)

**Interfaces:**
- Consumes: `staffPairings` (Task 4); `buildAppointmentNotes` new field.
- Produces: body accepts `couples?: { companionName: string; companionServiceId: number; companionServiceName?: string; companionDuration: number }`; response unchanged in shape (`appointments` contains both chains' appointments, `totalRequested = 2`), plus `couples: true` when applicable; `timeUnavailable` 409 keeps its shape with couples wording `'Ese horario ya no está disponible para dos. Elige otro horario.'`.
- `buildAppointmentNotes` gains `couples?: { role: 'booker' | 'companion'; companionName: string; bookerFirstName: string }` and appends `Cita en pareja con <companionName>` (booker) or `Acompañante: <companionName> · cita en pareja de <bookerFirstName>` (companion) as the LAST part before `Gift card:` is **not** moved: order is `Reservado en línea | Promo… | customNotes | <couples part> | Gift card: CODE`.

- [ ] **Step 1: Failing notes tests** (append to `notes.test.ts`)

```ts
it('adds the couples endings', () => {
  expect(buildAppointmentNotes({ isPromoService: false, couples: { role: 'booker', companionName: 'María', bookerFirstName: 'Juan' } }))
    .toBe('Reservado en línea | Cita en pareja con María')
  expect(buildAppointmentNotes({ isPromoService: false, couples: { role: 'companion', companionName: 'María', bookerFirstName: 'Juan' }, giftCode: 'ABCD1234' }))
    .toBe('Reservado en línea | Acompañante: María · cita en pareja de Juan | Gift card: ABCD1234')
})
```

Run: `npx vitest run src/lib/booking/notes.test.ts` → FAIL. Implement in `notes.ts` (push the couples part after `customNotes`, before `giftCode`). Run → PASS.

- [ ] **Step 2: Book route — validation**

After the existing body destructuring add `couples` and validate:
```ts
type CouplesBody = { companionName: string; companionServiceId: number; companionServiceName?: string; companionDuration: number }
let couplesReq: CouplesBody | null = null
if (couples !== undefined && couples !== null) {
  const name = typeof couples.companionName === 'string' ? couples.companionName.trim() : ''
  const sid = Number(couples.companionServiceId)
  const dur = Number(couples.companionDuration)
  if (name.length < 1 || name.length > 60) return NextResponse.json({ error: 'Escribe el nombre de tu acompañante' }, { status: 400 })
  if (!Number.isInteger(sid) || sid <= 0 || !(dur > 0)) return NextResponse.json({ error: 'Tratamiento del acompañante inválido' }, { status: 400 })
  if (!Array.isArray(services) || services.length !== 1) return NextResponse.json({ error: 'La cita en pareja lleva un tratamiento por persona' }, { status: 400 })
  if (Number(services[0].duration) !== dur) return NextResponse.json({ error: 'Los dos tratamientos deben durar lo mismo' }, { status: 400 })
  couplesReq = { companionName: name, companionServiceId: sid, companionServiceName: typeof couples.companionServiceName === 'string' ? couples.companionServiceName : undefined, companionDuration: dur }
}
```
In `fetchSlotStaffCandidates()` add `people: '2'` to the params when `couplesReq` and include the companion service id in `serviceIds`.

- [ ] **Step 3: Book route — two chains**

Right after the single-flow chain is built (`appointments` array), branch:

```ts
const bookerFirstName = (clientName || mindbodyClient?.FirstName || '').toString().trim().split(/\s+/)[0] || 'cliente'
let result: Awaited<ReturnType<typeof addMultipleAppointments>>
let companionResolvedStaffId: number | undefined

if (couplesReq) {
  if (staffCandidates.length === 0) staffCandidates = await fetchSlotStaffCandidates()
  const pairings = staffPairings(staffCandidates, 3)
  if (pairings.length === 0) {
    return NextResponse.json({ error: 'Ese horario ya no está disponible para dos. Elige otro horario.', timeUnavailable: true }, { status: 409 })
  }
  const start = new Date(startDateTime).toISOString().replace(/\.\d{3}Z$/, '')
  const bookerSvc = services[0] as BookingService
  const bookerNotes = buildAppointmentNotes({ isPromoService: false, globalDiscountPercent, customNotes: notes, giftCode: giftCodeNote,
    couples: { role: 'booker', companionName: couplesReq.companionName, bookerFirstName } })
  const companionNotes = buildAppointmentNotes({ isPromoService: false, globalDiscountPercent, customNotes: notes,
    couples: { role: 'companion', companionName: couplesReq.companionName, bookerFirstName } })
  const chainFor = (staffId: number, sessionTypeId: number, apptNotes: string) => [{
    ClientId: mindbodyClientId, LocationId: locationId, StaffId: staffId, SessionTypeId: sessionTypeId,
    StartDateTime: start, Notes: apptNotes, StaffRequested: false,
  }]
  result = { success: false as const, error: 'no pairing tried' } as Awaited<ReturnType<typeof addMultipleAppointments>>
  for (const [a, b] of pairings) {
    const first = await addMultipleAppointments(chainFor(a, bookerSvc.sessionTypeId, bookerNotes))
    if (!first.success) { if (!isRetryableStaffError(first.error)) { result = first; break } ; continue }
    let second: Awaited<ReturnType<typeof addMultipleAppointments>> | undefined
    try { second = await addMultipleAppointments(chainFor(b, couplesReq.companionServiceId, companionNotes)) } catch { second = undefined }
    if (second?.success) {
      resolvedStaffId = a; companionResolvedStaffId = b
      result = { success: true as const, appointments: [...first.appointments, ...second.appointments] }
      break
    }
    const removals = await Promise.allSettled(first.appointments.map(ap => removeAppointment(ap.Id)))
    const stuck = first.appointments.filter((_, n) => removals[n].status === 'rejected' || (removals[n] as PromiseFulfilledResult<boolean>).value === false)
    if (stuck.length) console.error('couples rollback left appointments', stuck.map(ap => ap.Id))
    result = second ?? ({ success: false as const, error: 'second chain threw' } as Awaited<ReturnType<typeof addMultipleAppointments>>)
    if (second && !isRetryableStaffError(second.error)) break
  }
} else {
  // existing single-flow submission + alt-staff retry, unchanged
}
```
Keep the existing failure branch (failed `bookings` row + 409) but use the couples wording when `couplesReq`.

- [ ] **Step 4: Book route — downstream**

1. `isCouples`: `let isCouples = !!couplesReq` then keep the program-based detection as `isCouples = isCouples || <existing>`.
2. WhatsApp `serviceNames`: when `couplesReq`, `[`💑 Cita en pareja con ${couplesReq.companionName}: ${plainNames[0]} + ${couplesReq.companionServiceName || 'tratamiento'}`]`; `totalDuration` stays the single duration.
3. Email: pass `isCouples` as today; add `companionName: couplesReq?.companionName` to `bookingConfirmationEmail` data and, in `src/lib/email/templates/booking.ts`, when `companionName` is present render the row `['Acompañante', companionName]` after `COUPLES_ROW`.
4. Supabase insert: `services` JSON becomes both entries (`[{sessionTypeId, name, duration}, {sessionTypeId: companionServiceId, name: companionServiceName, duration: companionDuration, companion: true}]`), `is_couples: true`, `total_requested: 2`, `therapist_name` as today, and add `notes`-style metadata only if a `metadata` jsonb column already exists (do not add columns).
5. Response: `totalRequested: couplesReq ? 2 : services.length`, add `couples: !!couplesReq`.

- [ ] **Step 5: Verify**

`npx vitest run` (notes) → PASS; `npx tsc --noEmit && npm run lint` → clean. Dev-server smoke (no real booking yet):
```bash
curl -s -X POST localhost:3000/api/mindbody/book -H 'content-type: application/json' -d '{"clientId":1,"locationId":1,"services":[{"sessionTypeId":123,"duration":60,"name":"X"}],"startDateTime":"2030-01-01T10:00:00","couples":{"companionName":"","companionServiceId":456,"companionDuration":60}}'
```
Expected: `400 {"error":"Escribe el nombre de tu acompañante"}` (validation runs before any Mindbody call for the name rule; if the client lookup runs first and 404s, use a real test client id).

- [ ] **Step 6: Commit**

```bash
git add src/lib/booking/notes.ts src/lib/booking/notes.test.ts src/app/api/mindbody/book/route.ts src/lib/email/templates/booking.ts
git commit -m "feat(book): couples bookings as two paired chains with rollback and pairing retries"
```

---

### Task 7: Services step — mode pills, duration tiles, two pickers

**Files:**
- Create: `src/components/booking/shared/ModePills.tsx`, `src/components/booking/shared/CouplesPicker.tsx`
- Modify: `src/components/booking/steps/ServiceStep.tsx` (hooks 397-409, render around 625 and the section gates 654/763/826/922), `src/components/booking/shared/BookingNav.tsx` (43-64), `src/components/booking/shared/FloatingCart.tsx` (29, 126), `src/components/booking/shared/StepProgress.tsx` (21, 73, 118)

**Interfaces:**
- Consumes: store fields/actions from Task 2; `couples_enabled` from `/api/treatments/settings` (Task 1); `ServiceTile` props as they exist (`service, isSelected, onToggle, onShowDescription, showKind`).
- Produces: `ModePills` (no props; reads/writes store); `CouplesPicker({ services, settings, onShowDescription })` where `services: MindbodyService[]` is the location's main list already fetched by ServiceStep and `settings: TreatmentSetting[]` is the local settings array (extend the local `TreatmentSetting` type at ServiceStep 98-105 with `couples_enabled?: boolean`).

- [ ] **Step 1: ModePills**

```tsx
// src/components/booking/shared/ModePills.tsx
'use client'
import { Users } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'

export function ModePills() {
  const mode = useBookingStore(s => s.mode)
  const setMode = useBookingStore(s => s.setMode)
  const pill = (value: 'single' | 'couples', label: string) => {
    const active = mode === value
    return (
      <button
        type="button"
        role="radio"
        aria-checked={active}
        onClick={() => setMode(value)}
        className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium border-2 transition-all ${
          active ? 'bg-gold text-dark border-gold shadow-sm' : 'bg-white text-warm-gray border-beige-200 hover:border-gold/50 hover:text-dark'
        }`}
      >
        {label}
      </button>
    )
  }
  return (
    <div className="mb-4">
      <div className="flex items-center justify-center gap-2 flex-wrap" role="radiogroup" aria-label="Para quién es la cita">
        <span className="flex items-center gap-1 text-xs text-warm-gray mr-1">
          <Users className="w-3.5 h-3.5 text-gold" />
          Cita:
        </span>
        {pill('single', 'Para mí')}
        {pill('couples', 'Para dos 💕')}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: CouplesPicker**

```tsx
// src/components/booking/shared/CouplesPicker.tsx
'use client'
import { Clock, Check } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

interface Setting { mindbody_service_id: number; show_in_booking?: boolean; couples_enabled?: boolean }

export function CouplesPicker({ services, settings, onShowDescription }: {
  services: MindbodyService[]
  settings: Setting[]
  onShowDescription: (s: MindbodyService) => void
}) {
  const duration = useBookingStore(s => s.couplesDuration)
  const setDuration = useBookingStore(s => s.setCouplesDuration)
  const mine = useBookingStore(s => s.selectedServices[0] ?? null)
  const addService = useBookingStore(s => s.addService)
  const companion = useBookingStore(s => s.companionService)
  const setCompanion = useBookingStore(s => s.setCompanionService)

  const byId = new Map(settings.map(st => [st.mindbody_service_id, st]))
  const eligible = (d: 60 | 90) =>
    services
      .filter(s => s.Duration === d && byId.get(s.Id)?.couples_enabled === true && byId.get(s.Id)?.show_in_booking !== false)
      .sort((a, b) => a.Price - b.Price)
  const list = duration ? eligible(duration) : []

  const tile = (s: MindbodyService, selected: boolean, onPick: () => void) => (
    <div key={s.Id} className={`relative rounded-xl border-2 transition-all ${selected ? 'border-gold bg-gold/5 ring-2 ring-gold/20' : 'border-beige-200 bg-white hover:border-gold/50'}`}>
      <button type="button" role="radio" aria-checked={selected} onClick={onPick} className="w-full text-left p-3 min-h-[64px] flex flex-col gap-1">
        {selected && <span className="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-dark" /></span>}
        <span className="font-semibold text-dark text-sm leading-snug pr-6">{s.Name}</span>
        <span className="flex items-center gap-2 text-xs text-warm-gray">
          <span className="font-semibold text-dark">${s.Price.toFixed(0)}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.Duration} min</span>
        </span>
      </button>
      <button type="button" onClick={() => onShowDescription(s)} className="absolute bottom-2 right-2 text-[11px] underline text-warm-gray">Ver</button>
    </div>
  )

  return (
    <div className="space-y-5">
      <section>
        <h3 className="font-semibold text-dark mb-1">¿Cuánto quieren que dure su sesión?</h3>
        <p className="text-xs text-warm-gray mb-3">Los dos tratamientos se hacen al mismo tiempo, en cabina doble.</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Duración">
          {([60, 90] as const).map(d => {
            const n = eligible(d).length
            const active = duration === d
            return (
              <button key={d} type="button" role="radio" aria-checked={active} disabled={n === 0}
                onClick={() => setDuration(d)}
                className={`min-h-[64px] rounded-xl border-2 text-center transition-all disabled:opacity-50 ${active ? 'border-gold bg-gold/10' : 'border-beige-200 bg-white hover:border-gold/50'}`}>
                <span className="block text-xl font-display text-dark">{d} min</span>
                <span className="block text-[11px] text-warm-gray">{n === 0 ? `No hay tratamientos de ${d} min para dos` : `${n} ${n === 1 ? 'opción' : 'opciones'}`}</span>
              </button>
            )
          })}
        </div>
      </section>

      {duration && (
        <>
          <section>
            <h3 className="font-semibold text-dark mb-2">Para ti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label="Tratamiento para ti">
              {list.map(s => tile(s, mine?.Id === s.Id, () => addService(s)))}
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-dark">Para tu acompañante</h3>
              {mine && companion?.Id !== mine.Id && (
                <button type="button" onClick={() => setCompanion(mine)} className="text-xs font-medium text-gold-700 underline min-h-[44px] px-2">El mismo que yo</button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label="Tratamiento para tu acompañante">
              {list.map(s => tile(s, companion?.Id === s.Id, () => setCompanion(s)))}
            </div>
          </section>
          {mine && companion && (
            <p className="text-sm text-dark text-center bg-cream rounded-xl py-2">
              Total <span className="font-semibold">${(mine.Price + companion.Price).toFixed(0)}</span> para dos · {duration} min
            </p>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Wire into ServiceStep**

1. Import `FEATURES` from `@/lib/nav`, `ModePills`, `CouplesPicker`; read `mode` from the store.
2. Render `<ModePills />` right after `<LocationPills />` **only when** `selectedLocation && (FEATURES.parejas || mode === 'couples')` (the deep link sets the mode, so the pills appear for testers even with the flag off).
3. Gate the promotions, recommendations, categories and empty-state blocks with `mode === 'single' &&`.
4. When `mode === 'couples' && selectedLocation && !isLoadingServices`, render `<CouplesPicker services={allMainServices} settings={treatmentSettings} onShowDescription={setDescriptionService} />` where `allMainServices` is the un-grouped `type=main` list already fetched (keep a `useState<MindbodyService[]>` for it next to `groupedServices` if one does not exist) and the description handler is the one the tiles already use.
5. Title/subtitle: in couples mode the heading reads `Tratamientos para dos` and the subtitle `Elige uno para cada quien`.

- [ ] **Step 4: Proceed rule and counts**

- `BookingNav.tsx` `handleNextClick`: in the `'services'` branch, `if (s.mode === 'couples') { nextStep(); return }` before the add-ons prompt check. `canProceed` already uses `selectCanProceed` through `hasServices`? It uses `hasServices` directly — change the services case to `useBookingStore(selectCanProceed)` semantics: `const canProceedStore = useBookingStore(selectCanProceed)` and use it for the services step.
- `FloatingCart.tsx` and `StepProgress.tsx`: `const itemCount = selectedServices.length + selectedAddons.length + (companionService ? 1 : 0)`; in couples mode append ` · para dos` to the header text (`Tu Carrito (2 tratamientos · para dos)`). Cart line for the companion: render `companionService` as a row labelled `Para tu acompañante · {name}` with its price; pass `companionService` and `parallel: true` to `calculateCartPricing` when `mode === 'couples'`.
- `AddonsPrompt` is skipped in couples mode by the BookingNav change; nothing else.

- [ ] **Step 5: Verify in the browser (375px)**

Dev server: `/es/reservar?couples=1` → pick a spa → "Cita: Para mí / Para dos 💕" pills visible, couples active → duration tiles → pick 60 → two pickers → pick one each → total line → "Continuar" enabled only after both; "El mismo que yo" copies; switching to "Para mí" restores the normal list and clears picks. Console: no errors. Toggle `FEATURES.parejas` is NOT changed.

- [ ] **Step 6: Commit**

```bash
npx tsc --noEmit && npm run lint && npx vitest run
git add src/components/booking/shared/ModePills.tsx src/components/booking/shared/CouplesPicker.tsx src/components/booking/steps/ServiceStep.tsx src/components/booking/shared/BookingNav.tsx src/components/booking/shared/FloatingCart.tsx src/components/booking/shared/StepProgress.tsx
git commit -m "feat(booking): 'Para dos' mode — duration first, one treatment each"
```

---

### Task 8: Date step in couples mode

**Files:**
- Modify: `src/components/booking/steps/DateTimeStep.tsx` (fetch 252-318, therapist card 417-473, picker 646-649, subtitle 387-389, summary 632-637)

**Interfaces:**
- Consumes: `people=2` (Task 5); store `mode`, `companionService`.

- [ ] **Step 1: Implement**

1. Read `mode` and `companionService` from the store; `const isCouples = mode === 'couples'`.
2. Availability params: `serviceIds` = `[...selectedServices.map(s => s.Id), ...(isCouples && companionService ? [companionService.Id] : []), ...selectedAddons.map(a => a.Id)]`; add `people: isCouples ? '2' : '1'`. Add `companionService` and `mode` to the effect deps.
3. Subtitle: `isCouples ? `Selecciona cuándo desean su cita (${totalDuration} min · para dos)` : existing`.
4. Therapist card (417-473) and `TherapistPicker` (646-649): render only when `!isCouples`; in couples mode render instead:
   ```tsx
   <div className="bg-white border border-beige-200 rounded-xl p-4 flex items-center gap-2 text-sm text-dark">
     <Users className="w-4 h-4 text-gold" /> Dos terapeutas del equipo
     <span className="text-xs text-warm-gray">· las asignamos al confirmar</span>
   </div>
   ```
   and force `filterStaff` to `null` when entering couples mode (effect on `isCouples`).
5. Selected-slot summary line `{n} terapeuta(s) disponible(s)`: in couples mode show `Cabina doble disponible`.

- [ ] **Step 2: Verify**

375px, `/es/reservar?couples=1`, after Task 7 picks: date strip counts are ≤ the single-mode counts for the same treatment on a busy day (compare by toggling the mode), no therapist chip row, "Dos terapeutas del equipo" shown, choosing a slot works, network tab shows `people=2` and both service ids.

- [ ] **Step 3: Commit**

```bash
npx tsc --noEmit && npm run lint
git add src/components/booking/steps/DateTimeStep.tsx
git commit -m "feat(booking): couples date step — paired availability, no therapist choice"
```

---

### Task 9: Confirm and success screens

**Files:**
- Modify: `src/components/booking/steps/ConfirmStep.tsx` (pricing 153-163, request 272-303, summary 393-532, error 307-322)
- Modify: `src/components/booking/steps/SuccessStep.tsx` (pricing 34-40, heading, services list, therapist line ~168-170)

**Interfaces:**
- Consumes: book route body `couples` (Task 6), pricing `companionService`/`parallel` (Task 3), store `companionName`/`setCompanionName`.

- [ ] **Step 1: ConfirmStep**

1. `calculateCartPricing({..., companionService: isCouples ? companionService : null, parallel: isCouples })`.
2. Above the services summary when `isCouples`: badge `<span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1">💑 Cita en pareja</span>`.
3. Services summary in couples mode: two rows — `Para ti · {selectedServices[0].Name}` with price, `Para {companionName || 'tu acompañante'} · {companionService.Name}` with price — then the usual Subtotal/ITBM/Total; the "Terapeuta" cell reads `Dos terapeutas del equipo`; the duration reads `{totalDuration} min · para dos`.
4. Companion field (couples only), placed above the payment note:
   ```tsx
   <div className="mt-3">
     <label htmlFor="companion-name" className="block text-sm font-medium text-dark mb-1">Nombre de tu acompañante</label>
     <input id="companion-name" value={companionName} onChange={e => { setCompanionName(e.target.value); if (companionError) setCompanionError(null) }}
       placeholder="Ej. María" autoComplete="off" maxLength={60}
       aria-invalid={!!companionError} aria-describedby={companionError ? 'companion-name-error' : undefined}
       className={`w-full min-h-[44px] rounded-lg border px-3 text-sm ${companionError ? 'border-red-400' : 'border-beige-200'}`} />
     {companionError && <p id="companion-name-error" className="mt-1 text-xs text-red-600">{companionError}</p>}
   </div>
   ```
   with `const [companionError, setCompanionError] = useState<string | null>(null)`.
5. In `handleConfirmBooking`, before any fetch: `if (isCouples) { if (!companionName.trim()) { setCompanionError('Escribe el nombre de tu acompañante'); document.getElementById('companion-name')?.focus(); return } if (!companionService) { setError('Falta el tratamiento de tu acompañante'); return } }`.
6. Request body: add
   ```ts
   couples: isCouples && companionService ? { companionName: companionName.trim(), companionServiceId: companionService.Id, companionServiceName: companionService.Name, companionDuration: companionService.Duration } : undefined,
   staffId: isCouples ? undefined : staffIdToUse,
   staffRequested: isCouples ? false : selectedStaff !== null,
   therapistName: isCouples ? undefined : <existing>,
   ```
7. `timeUnavailable` handling: notice text `isCouples ? 'Ese horario ya no está disponible para dos. Elige otro horario.' : <existing>`.

- [ ] **Step 2: SuccessStep**

Read `mode`, `companionService`, `companionName`. Heading `isCouples ? '¡Cita en pareja confirmada!' : <existing>`; under it `{displayClientName} y {companionName}`; the list shows `Para ti · {service}` and `Para {companionName} · {companionService.Name}`; therapist line `Dos terapeutas del equipo`; pricing call gets `companionService`/`parallel` like ConfirmStep. Keep the gtag conversion.

- [ ] **Step 3: Verify (real Mindbody, then cancel)**

On the dev server with a test client account, `/es/reservar?couples=1`: confirm without a name → inline error and focus; with a name → success screen with both names; in Mindbody, two appointments at the same start under the booker with the two note endings and different staff; WhatsApp/email text contains "Cita en pareja con <name>"; cancel both from Mindbody (or the portal) immediately. Record the appointment ids in the task report.

- [ ] **Step 4: Commit**

```bash
npx tsc --noEmit && npm run lint
git add src/components/booking/steps/ConfirmStep.tsx src/components/booking/steps/SuccessStep.tsx
git commit -m "feat(booking): couples confirm step with companion name; paired success screen"
```

---

### Task 10: Deep link, analytics meta, event allowlist

**Files:**
- Modify: `src/components/booking/BookingPageContent.tsx` (73-98), `src/components/booking/BookingWidget.tsx` (50-70), `src/app/api/track/route.ts` (ALLOWED_EVENTS 10-30 — no new event name; only verify meta passes through)

- [ ] **Step 1: Deep link**

In the init effect, before the `promotionId`/`serviceId` branches:
```ts
const couplesParam = searchParams.get('couples')
if (couplesParam === '1') useBookingStore.getState().setMode('couples')
```
and in the `serviceId` branch, after finding `service`:
```ts
const st = useBookingStore.getState()
if (st.mode === 'couples') {
  if (service.Duration === 60 || service.Duration === 90) {
    st.setCouplesDuration(service.Duration)
    useBookingStore.getState().addService(service)
    useBookingStore.getState().setCompanionService(service)
  } // otherwise leave the duration tiles for the customer
} else {
  addService(service)
}
```
Note `setCouplesDuration` clears picks, so call it first (as above).

- [ ] **Step 2: Analytics meta**

In `BookingWidget.tsx` step tracking, add `people: mode === 'couples' ? 2 : 1` to the `meta` object (read `mode` from the store alongside `selectedServices`). No new event names.

- [ ] **Step 3: Verify**

`/es/reservar?couples=1&serviceId=<60-min flagged id>` → spa pills first; after choosing the spa the couples mode is on with 60 min and both pickers preselected. `/es/reservar?couples=1&serviceId=<30-min id>` → couples mode, duration tiles, nothing preselected. `/es/reservar` plain → single mode, no pills while the flag is off.

- [ ] **Step 4: Commit**

```bash
npx tsc --noEmit && npm run lint
git add src/components/booking/BookingPageContent.tsx src/components/booking/BookingWidget.tsx
git commit -m "feat(booking): couples deep link and funnel meta"
```

---

### Task 11: Couples page — price for two, "Reservar en línea", menu by duration

**Files:**
- Create: `src/lib/couples/offers.ts`, `src/lib/couples/offers.test.ts`, `src/components/marketing/CouplesTreatmentsList.tsx`
- Modify: `src/components/marketing/OfferCard.tsx` (props, price, CTA 95-100), `src/app/[locale]/parejas/page.tsx` (40-41, 62-82, 84-97)

**Interfaces:**
- Produces:
  ```ts
  export interface CouplesOfferView { offer: MarketingOffer; displayPrice: number | null; priceLabel: 'para dos' | null; bookingHref: string | null }
  export function decorateCouplesOffers(offers: MarketingOffer[], services: Array<{ Id: number; Price: number; Duration: number }>, locale: string): CouplesOfferView[]
  ```
  Rule: when `offer.mindbody_service_id` matches a service with `Duration` 60 or 90 → `displayPrice = 2 × Price`, `priceLabel = 'para dos'`, `bookingHref = /${locale}/reservar?couples=1&serviceId=<id>`; otherwise `displayPrice = offer.price`, label and href `null`.
- `OfferCard` gains optional props `priceOverride?: number | null`, `priceLabel?: string | null`, `bookingHref?: string | null`; when `bookingHref` is set it renders a primary `<Link>` "Reservar en línea" / "Book online" above the WhatsApp link (which becomes secondary styling).

- [ ] **Step 1: Failing tests**

```ts
// src/lib/couples/offers.test.ts
import { describe, it, expect } from 'vitest'
import { decorateCouplesOffers } from './offers'
import type { MarketingOffer } from '@/lib/offers'

const offer = (over: Partial<MarketingOffer>): MarketingOffer => ({
  id: 'x', key: 'pareja_ritual', page: 'parejas', name_es: 'Ritual', name_en: 'Ritual', description_es: null, description_en: null,
  price: 189, price_note_es: null, price_note_en: null, includes_es: [], includes_en: [], whatsapp_text_es: null, whatsapp_text_en: null,
  image_key: null, mindbody_service_id: null, badge_es: null, badge_en: null, is_active: true, sort_order: 0, ...over,
} as MarketingOffer)

describe('decorateCouplesOffers', () => {
  const services = [{ Id: 10, Price: 79, Duration: 60 }, { Id: 11, Price: 120, Duration: 120 }]
  it('doubles the linked treatment price and builds the deep link', () => {
    const [v] = decorateCouplesOffers([offer({ mindbody_service_id: 10 })], services, 'es')
    expect(v.displayPrice).toBe(158); expect(v.priceLabel).toBe('para dos'); expect(v.bookingHref).toBe('/es/reservar?couples=1&serviceId=10')
  })
  it('keeps the bundle price when nothing is linked', () => {
    const [v] = decorateCouplesOffers([offer({})], services, 'es')
    expect(v.displayPrice).toBe(189); expect(v.bookingHref).toBeNull(); expect(v.priceLabel).toBeNull()
  })
  it('ignores links to treatments that are not 60 or 90 min', () => {
    const [v] = decorateCouplesOffers([offer({ mindbody_service_id: 11 })], services, 'en')
    expect(v.displayPrice).toBe(189); expect(v.bookingHref).toBeNull()
  })
})
```

Run: `npx vitest run src/lib/couples/offers.test.ts` → FAIL. Implement `offers.ts` exactly per the rule. Run → PASS.

- [ ] **Step 2: OfferCard + page**

`OfferCard`: price shown = `priceOverride ?? offer.price`; when `priceLabel` render `<span className="text-xs text-warm-gray ml-1">{priceLabel}</span>`; when `bookingHref`:
```tsx
<Link href={bookingHref} className="w-full inline-flex items-center justify-center min-h-[44px] rounded-full bg-gold text-dark font-semibold px-6 py-3 hover:bg-gold/90 transition-colors">
  {locale === 'en' ? 'Book online' : 'Reservar en línea'}
</Link>
<WhatsAppBookingLink cta={`offer_${offer.key}`} message={offerWhatsappText(offer, locale)} className="w-full" variant="link" />
```
(else the existing single WhatsApp button).

`parejas/page.tsx`: fetch services via the existing cached catalogue (`getAllServices()` from `@/lib/treatments`, the same source the admin GET uses) and `const views = decorateCouplesOffers(offers, services, locale)`; map `views` into `OfferCard` with the three new props. Replace the "Menú de Parejas" `ServicesListServer` call with `<CouplesTreatmentsList locale={locale} />`.

`CouplesTreatmentsList` (server component): reads `treatment_settings` rows with `couples_enabled = true` and `show_in_booking <> false` through the admin client (or `getAllServices()` joined with the public settings), groups by duration 60 then 90, renders each as `name · $price por persona · 60 min` rows each wrapping a `<Link href={/${locale}/reservar?couples=1&serviceId=…}>`; header per group `60 minutos` / `90 minutos`; empty → `Pronto · Coming soon`.

- [ ] **Step 3: Verify**

With `FEATURES.parejas` still false the page redirects, so verify by temporarily hitting the page with the flag flipped **locally only** (`git stash` the nav change before committing) or by rendering `/en/parejas` after flipping in a scratch branch: cards show "$158 para dos" + "Reservar en línea" when linked, bundle price + WhatsApp otherwise; the menu lists flagged treatments by duration. Revert the local flag flip. `npx vitest run` → PASS.

- [ ] **Step 4: Commit**

```bash
npx tsc --noEmit && npm run lint && git diff --quiet src/lib/nav.ts
git add src/lib/couples/offers.ts src/lib/couples/offers.test.ts src/components/marketing/CouplesTreatmentsList.tsx src/components/marketing/OfferCard.tsx 'src/app/[locale]/parejas/page.tsx'
git commit -m "feat(parejas): ritual cards price for two with online booking; menu by duration"
```

---

### Task 12: Regression pass and ops notes

**Files:**
- Create: `docs/superpowers/plans/2026-10-05-couples-booking-ops.md` (owner checklist)

- [ ] **Step 1: Single-mode regression (375px and desktop)**

`/es/reservar` with the flag off: no pills, categories/promotions/recommendations as before, therapist chip row present, add-ons prompt still opens, a normal booking reaches the confirm step with the same body as before (compare the network payload: no `couples` key). `/en/reservar` same. `npx vitest run` all green, `npm run lint` 0 errors, `npm run build` passes.

- [ ] **Step 2: Couples path end to end (test client, cancel at once)**

Document in the task report: deep link → spa → duration → one each → date (counts) → account → confirm with name → success; Mindbody shows two appointments, same start, different staff, both under the booker, notes `Cita en pareja con …` and `Acompañante: …`; WhatsApp confirmation text; portal cancellation removes both (if the portal cancels by booking row, confirm both ids are cancelled; if not, note it as a follow-up).

- [ ] **Step 3: Ops checklist file**

```markdown
# Couples booking — owner checklist before the flag flip

1. /admin/tratamientos: turn on ❤ "Disponible en pareja" for every 60 or 90 min treatment that two therapists can run side by side (prices stay per person).
2. /admin/ofertas: on each ritual card set "Tratamiento Mindbody" to the regular treatment it is built on; the card price becomes 2× automatically. Leave it empty to keep a bundle price (WhatsApp only).
3. Confirm the couples-room count in the page copy (six per the resources audit; copy says seven).
4. Confirm cancellation-window wording for the legal pages (the confirm step does not show one in v1).
5. Run the Supabase migration `supabase/migrations/20261005_treatment_couples.sql` in the SQL editor (the site works without it, the toggle just will not persist).
6. Test-book and cancel a real pair on production via `/es/reservar?couples=1`.
7. Flip `FEATURES.parejas = true` in `src/lib/nav.ts` (Task 13), deploy, re-check /es/parejas, the header link and the sitemap.
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-10-05-couples-booking-ops.md
git commit -m "docs(couples): owner checklist before the flag flip"
```

---

### Task 13 (held until the owner's go): flag flip

**Files:** `src/lib/nav.ts:5-11`

- [ ] Change `parejas: false` → `parejas: true`. `npm run build`. Verify `/es/parejas` renders, header/footer links appear, `/sitemap.xml` lists `/es/parejas` and `/en/parejas`, `/es/reservar` shows the "Cita:" pills after choosing a spa. Commit `feat(parejas): publish couples booking` and deploy via the release workflow.

---

## Self-review

- **Spec coverage:** §2 decisions → Tasks 1, 2, 7, 9, 11; §4.1 → 7 + 10; §4.2 → 8; §4.4/4.5 → 9; §4.6 → 10, 11; §5 → 1, 2, 3, 10; §6.1 → 4, 5; §6.2 → 6; §6.3 → 11; §7 → 12 (ops file); §8 errors → 6 (409 wording, validation), 7 (empty duration), 9 (name error), 10 (bad deep link); §9 tests → unit in 2, 3, 4, 6, 11, E2E in 9 and 12; §10 → 13. The spec's "one qualified for each treatment" cannot be enforced from availability data (Mindbody exposes no per-service staff qualification); Task 4's comment and Task 6's pairing retries carry that limitation — the plan records it as a ruling.
- **Placeholders:** none; every step has code or an exact edit instruction with anchors.
- **Type consistency:** `couplesDuration: 60 | 90 | null`, `companionService: MindbodyService | null`, `companionName: string`; body `couples: { companionName, companionServiceId, companionServiceName?, companionDuration }` used identically in Tasks 6 and 9; `keepPairSlots`/`staffPairings` names match in Tasks 4, 5, 6; pricing inputs `companionService`/`parallel` match in Tasks 3, 7, 9.
