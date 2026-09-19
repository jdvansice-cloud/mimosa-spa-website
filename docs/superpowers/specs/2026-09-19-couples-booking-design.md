# Couples Booking Online — Design

- **Date:** 2026-09-19
- **Status:** approved in brainstorming (option A, UX set approved, price rule 2× Pareja treatment), pending implementation plan
- **Depends on:** the booking widget as deployed on 2026-09-19 and the widget copy fixes in the gift-card plan (Task 11)

## 1. Goal

A couple books two simultaneous treatments on www.mimosaretreat.com in the same widget, in one obvious path, and pays at the spa. The front desk sees a paired booking in Mindbody with both names. The couples landing page sells the same thing online that it sells over WhatsApp today.

## 2. Decisions taken

| Decision | Choice | Why |
|---|---|---|
| Rooms | **Not reserved by the website** (option A). Two therapists free at the same time is the only check. | Mirrors what the WhatsApp agent already does; the front desk pairs the couples room as it does for every online booking today. Accepted risk: on a full weekend day two free therapists do not guarantee a free couples room. |
| Account | One account (the booker's). The companion is a first name typed on the confirm step. | No second registration; Mindbody accepts two overlapping appointments under one client (proven by the WhatsApp agent). |
| Treatment | Same treatment for both, chosen with one tap. Only the Pareja treatments (Mindbody programs 11 and 21) are offered in couples mode. | Simplest to understand; matches how the Pareja SKUs are sold. |
| Add-ons and therapist choice | Not offered in couples mode. | One path, no branching. Add-ons return in a later version if asked for. |
| Payment | At the spa. | Owner decision: no online payment for services for now. |
| Price display | Everywhere as the total for two, labelled "para dos": `2 × SKU price`. | Pareja SKUs are priced per person in Mindbody. |
| Couples page ritual cards | Price shown = **2 × the linked Pareja treatment's price**; primary button "Reservar en línea", WhatsApp secondary. Cards without a linked treatment keep their bundle price and stay WhatsApp-only. | Owner decision 2026-09-19. Uses the existing `marketing_offers.mindbody_service_id` column; no migration. |
| Entry points | A "Para mí / Para dos 💕" pill pair beside the spa pills on the services step; deep links `/reservar?couples=1&serviceId=<id>` from the ritual cards; the couples pages go public (`FEATURES.parejas = true`). | Reads as one more choice in the widget the customer already knows, not a new mode. |
| WhatsApp agent (Camila) | Unchanged. | Already books couples. |

## 3. Current state (verified 2026-09-19)

- `bookings.is_couples` exists and is set when a booked service belongs to a Parejas program or when staff book two simultaneous appointments (migration `20260907_couples_flag.sql`, `book/route.ts` "Couples detection").
- The widget is strictly single-person: one client, one staff, one start time; multiple services chain sequentially.
- The Pareja treatments are hidden from the widget (`show_in_booking = false`) and the couples page's "Menú de Parejas" section is empty because they are not visible either. Programs: 11 "Tratamientos Parejas" (has a 💕 category config in `ServiceStep.tsx`), 21 "Parejas" (no config).
- `/api/mindbody/availability` returns per-slot `availableStaffIds`; the WhatsApp agent's `pairSlotsForCouple` keeps slots with two or more distinct staff ids.
- `/api/mindbody/book` builds a chain per service via `addMultipleAppointments`, retries with up to two alternative therapists on slot-race errors, and rolls back with `removeAppointment`. The WhatsApp agent books a couple as two chains, same start, different staff, removing the first on failure of the second.
- `FEATURES.parejas = false`; `/parejas` and `/masaje-de-parejas-panama` redirect. The couples page renders ritual cards from `marketing_offers` (page `parejas`), which already carries `price` and `mindbody_service_id`.
- Booking store (`src/lib/booking/store.ts`, zustand, persisted selections only) has no notion of mode or companion.

## 4. Customer flow

Step names and numbering stay exactly as today ("Paso 1 de 4 · Servicios", …). Copy below is Spanish; English mirrors it.

### 4.1 Step 1 — Servicios

- Beside the existing "Spa: Costa del Este / San Francisco" pills, a second pill pair with the same style: **"Para mí"** (default) and **"Para dos 💕"**. It appears only after a spa is chosen, like the treatment list itself.
- Switching to "Para dos" clears any selected services, add-ons, therapist, date and time, and shows one section, **"Rituales en Pareja"**, with the Pareja treatments of the chosen spa (programs 11 and 21, `show_in_booking = true`). Promotions, recommendations and the other categories are hidden. The subtitle reads "Elige el tratamiento para los dos".
- Tiles read: name · **"$158 para dos"** · "60 min". Tapping a tile selects it; tapping another replaces it (single choice). The cart header reads "1 tratamiento · para dos".
- "Continuar" goes straight to Step 2; the add-ons prompt does not open in couples mode.
- Switching back to "Para mí" clears the selection and restores the normal list.

### 4.2 Step 2 — Fecha y Hora

- Subtitle: "Selecciona cuándo desean su cita (60 min · para dos)".
- The therapist card added on 2026-09-19 ("Elige tu terapeuta" chip row) and the per-slot therapist picker are both hidden in couples mode; one static line takes their place: **"Dos terapeutas del equipo"**.
- Dates and slots come from the availability call with `people=2`: a slot is offered only when two distinct qualified therapists are free for the whole duration at that time. Slot counts in the date strip reflect this.

### 4.3 Step 3 — Tu Cuenta

Unchanged: phone verification of the booker only.

### 4.4 Step 4 — Confirmar

- A **"Cita en pareja"** badge at the top of the summary.
- Summary lines: "Mimosa Relax 60 min × 2", "$158 para dos", spa, date, time, "Dos terapeutas del equipo".
- One required field with a visible label: **"Nombre de tu acompañante"** (placeholder "Ej. María"), inline error "Escribe el nombre de tu acompañante" under the field, error shown on Confirmar, not while typing.
- The existing "El pago se realiza en el spa al momento de tu visita" note stays.
- "Confirmar" creates both appointments.

### 4.5 Éxito

- Heading "¡Cita en pareja confirmada!", then "{booker} y {companion}", spa, date, time, treatment × 2. The gift-code chip behaves as in single mode.

### 4.6 Couples page (`/parejas`) and deep links

- Each ritual card whose offer has `mindbody_service_id` set shows the price as `2 × <that treatment's price>` with the label "para dos", the includes list unchanged, a primary button **"Reservar en línea"** linking to `/{locale}/reservar?couples=1&serviceId=<id>`, and the existing WhatsApp button as secondary. Cards without a linked treatment render exactly as today.
- The "Menú de Parejas" section lists the Pareja treatments once ops makes them visible; each row links to the same deep link.
- Landing on `/reservar?couples=1&serviceId=<id>` sets couples mode and preselects that treatment; the spa still has to be chosen explicitly (as today for every deep link).
- `FEATURES.parejas = true` publishes both couples pages and adds them to the sitemap; the header and footer links already exist.

## 5. State and data

- Store gains `mode: 'single' | 'couples'` (persisted with the selections so a reload keeps it) and `companionName: string` (not persisted; personal data stays out of storage like `clientInfo`). Actions: `setMode(mode)` (clears services, add-ons, staff, date, time when the mode changes) and `setCompanionName(name)`.
- `CartPricing` for couples multiplies every service line by two before tax (`calculateCartPricing` receives `quantity: 2`); ITBMS as today.
- No database migration. The companion's name travels in the Mindbody appointment notes and in the confirmation message; `bookings.is_couples` is already set by the existing detection because the service belongs to a Parejas program.
- Analytics: existing funnel events carry `meta.mode: 'couples'` so the KPI dashboard can split the funnel later. No new event names.

## 6. Server changes

### 6.1 Availability

`GET /api/mindbody/availability` accepts `people=2`. When present, a slot is kept only if `availableStaffIds.length >= 2` after all existing filters; the per-date `slotsCount` is computed from the filtered slots. The filter lives in `src/lib/booking/couples.ts` as a pure function `keepPairSlots(slots)` with tests, and the WhatsApp agent's `pairSlotsForCouple` is re-pointed to it so both channels share one rule.

### 6.2 Booking

`POST /api/mindbody/book` accepts optional `couples: { companionName: string }` (name trimmed, 1–60 characters, otherwise 400 "Escribe el nombre de tu acompañante").

- The route resolves the slot's staff candidates as today, then builds **two chains** with the same `StartDateTime`: chain A with the first candidate, chain B with a different candidate.
- Notes (built with `buildAppointmentNotes`, new optional field `couples`): chain A ends with `Cita en pareja con <companion>`; chain B ends with `Acompañante: <companion> · cita en pareja de <booker first name>`. Both chains are booked under the booker's Mindbody client id.
- Chain A is booked first. If chain B fails, chain A's appointments are removed and the pair is retried with the next two candidate pairings (same pattern as the existing slot-race retry). If no pairing succeeds, the response is the existing `timeUnavailable` shape and the widget shows the existing slot-conflict banner with couples wording: "Ese horario ya no está disponible para dos. Elige otro horario."
- One booking record per appointment chain is written as today (`is_couples = true` by detection); the confirmation WhatsApp and email go once, to the booker, using the existing "💑 Cita en pareja" naming and adding "con <companion>".
- The reminder and cancellation flows are unchanged; cancelling from the portal cancels both appointments because both belong to the booker.

### 6.3 Couples page price

`getOffersForPage('parejas')` is joined server-side with the treatment catalogue (`treatment_settings` / Mindbody session types already cached for the menu) to produce `displayPrice = 2 × price` and `bookingUrl` for offers with `mindbody_service_id`. Offers with no match fall back to `price` and no booking button.

## 7. Ops prerequisites (owner, before the flag flips)

1. In `/admin/tratamientos`: set `is_visible` and `show_in_booking` on for every Pareja treatment that should sell online; confirm each is priced per person in Mindbody.
2. In `/admin/ofertas`: set the Pareja treatment on each of the three ritual cards (Ritual en Pareja, Escape Romántico, Aniversario Mimosa); the displayed price then becomes 2× that treatment automatically. Cards that should stay bundle-priced keep the field empty.
3. Confirm the couples-room count in the page copy ("Siete cabinas dobles" today; the resources audit counts six couples-capable rooms).
4. Confirm the cancellation-window copy that the legal pages show (24h/48h draft) before it appears on the couples confirm step.

## 8. Error handling

- Mode switch always clears the cart, so a couples cart can never contain a single-person selection or add-ons.
- Deep link with a `serviceId` that is not a Pareja treatment: couples mode is set, nothing is preselected, the list shows the Pareja treatments.
- Pair lost between Step 2 and Confirmar: rollback plus retry as in §6.2, then the slot-conflict banner and a return to Step 2.
- Companion name missing: inline error on Confirmar, request not sent.
- Mindbody refuses the second overlapping appointment for the same client (not observed so far): treated as a chain-B failure, rollback, retry, then the banner. Logged with the Mindbody error text for diagnosis.

## 9. Testing

**Unit (vitest):** `keepPairSlots` (0, 1, 2, 3 staff; duplicates), couples pricing (`quantity: 2` on every line, tax unchanged in method), `buildAppointmentNotes` with the two couples endings, the chain-pairing helper (first pairing, next pairings, exhaustion), `couples` body validation.

**End to end on the dev server against the real Mindbody (book and cancel at once):** deep link from a ritual card lands in couples mode with the treatment preselected; "Para dos" hides promotions and categories; date strip counts drop versus single mode on a busy day; confirm without companion name shows the inline error; a successful booking creates two appointments with the same start, different staff, both under the booker, with the two note endings; the WhatsApp confirmation reads "Cita en pareja con <companion>"; cancelling from the portal removes both.

**Screens on a 375px phone:** every step of the couples path, the couples page, and the single-person path unchanged (regression).

## 10. Rollout and rollback

1. Ship behind `FEATURES.parejas = false`; the pill pair and deep links are inert while the flag is off (couples mode still reachable for testing via `?couples=1`).
2. Owner completes §7. Test-book and cancel on production.
3. Flip `FEATURES.parejas = true` (one commit). Rollback is the same flag; the ritual cards fall back to WhatsApp-only automatically.

## 11. Out of scope

Room reservation (rooms Phase 2), prepayment, different treatments per person, add-ons in couples mode, choosing the therapists, a Mindbody client for the companion, group bookings for more than two, changes to the WhatsApp agent.
