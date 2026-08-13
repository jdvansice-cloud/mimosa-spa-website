# Booking Widget: Couples Flow + UX Simplification — Proposal

Status: PROPOSAL (Aug 2026). Grounded in a full code analysis of
`src/components/booking/**`, `src/lib/booking/**`, `/api/mindbody/**`,
`docs/PRD_ROOM_RESOURCE_BOOKING.md` and `docs/MINDBODY_RESOURCES.md`.

---

## Part 1 — Couples booking flow

### What exists today (facts)

- **Mindbody already models couples rooms.** 33 resources follow the
  `<CE|SF> | <Room> -<bed>` naming contract; **6 couples-capable rooms** have
  paired beds (-1/-2): CE Sombreros Chinos + Abanicos (VIP Doble has 3 beds),
  SF Azul Estatua, Azul Velas, Abanico Dorada, Mariposas. The resources-audit
  endpoint already computes the pairs.
- **Couples SKUs exist** (programs 11 + 21, seven "Pareja" services at
  $79/$99 per person) but none are online-bookable, and program 21 doesn't
  even have a 💕 category config in the widget.
- **The widget is strictly single-person.** One clientId, one staff, one
  date/time; multiple services are chained *sequentially* (each leg starts
  when the previous ends — enforced twice). Two simultaneous appointments are
  impossible through the current code path.
- **The room PRD pre-specified couples semantics** (§6.5): two appointments,
  SAME StartDateTime, one per therapist, `ResourceIds: [Room-1]` and
  `[Room-2]` of the same physical room. But Phase 2 (writing ResourceIds on
  bookings) is **not implemented** — `addAppointment` sends no ResourceIds,
  and the v1 eligibility rule ("-1 beds only") actively flags couples-mapped
  -2 beds as launch blockers.

### Proposed solution (phased)

**C0 — Now (already live, ops only).** Couples sell via WhatsApp from
/parejas. Keep programs 11/21 with `is_visible=true` (menu pages show them)
but `show_in_booking=false` (widget hides them) so nobody books a per-person
Pareja SKU as a solo appointment by accident. One admin visit to
/admin/tratamientos sets this.

**C1 — Rooms Phase 2 first (prerequisite, ~1 week).** Implement
`ResourceIds` on `addAppointment` + room selection at booking time behind
`ROOMS_AWARE_BOOKING`, per the existing PRD. This is required regardless of
couples (the PRD's "never roomless" invariant) and it fixes the known Phase-1A
gap where our own bookings don't occupy rooms, making couples-room
availability unreliable.

**C2 — Couples mode in the widget (~1.5–2 weeks after C1).**

- **Entry points:** a "Para dos 💕" toggle at the top of ServiceStep's couples
  category, and deep links from the /parejas ritual cards
  (`/reservar?couples=1&serviceId=…`). Unify programs 11/21 under one 💕
  config.
- **One account, not two.** The booker authenticates as today; the companion
  is just a name field. Booking creates the second leg with a Mindbody guest
  client via the existing `addClient` (no OTP — same as front desk does), or
  under the booker's own client if Mindbody accepts the overlap (decided by a
  1-day spike). Never force the companion through registration.
- **Store:** add `mode: 'single' | 'couples'` + `companionName`. In couples
  mode the chosen service applies ×2 automatically (price shown as total for
  two), the staff step is skipped ("dos terapeutas del equipo" — assigning two
  named staff doubles the failure surface for v1), and the flow becomes:
  Servicio → Fecha/Hora → Confirmar.
- **Availability:** `?couples=1` on /api/mindbody/availability → a slot is
  offered only when ≥2 qualified staff are simultaneously free AND (with
  rooms flags on) a couples room has both beds free.
- **Booking:** `couples: true` on /api/mindbody/book → two appointments, same
  StartDateTime, staff A + staff B, `ResourceIds` `[Room-1]`/`[Room-2]`;
  existing rollback cancels both on partial failure. Update the audit's v1
  rule so -2 beds mapped to couples services are valid rather than blockers.
- **Payments (WS-B synergy):** one Tilopay payment covers both legs — couples
  prepay is the same `booking_payments` row with total ×2. Couples + booking
  prepay naturally ship in the same October window.

**Ops prerequisites for C2:** map couples services → couples rooms (both
beds) in `service_resource_eligibility`; confirm the seven Pareja SKUs are
per-person priced; verify none are `Count=2` packages (the catalog filter
silently drops those).

---

## Part 2 — Widget UX: make booking simple

Today a returning client needs **~8–9 taps across 6 screens** (7-step
progress bar); a new client adds 4 form fields + OTP before seeing any
availability. The biggest lever is not polish — it's *order*.

### P0 — Measure correctly (half a day, do first)
The funnel data is currently misleading: authenticated users skip
`booking_step_auth` but count in completions (inflating conversion); the
funnel chart's step order swaps datetime/staff vs the real flow; and
`whatsapp_click` is dropped by /api/track's allowlist. Fix all three so
every later change is measurable.

### P1 — Browse first, authenticate last (the big one)
Code analysis confirms **identity is only needed at the final POST /book** —
availability, services, staff need no client. Reorder to:

> Servicio → Fecha/Hora → (Terapeuta opcional) → **Cuenta** → Confirmar

New visitors see real availability in 2 taps instead of hitting an OTP wall —
this is the single highest-impact change for the 17%-retention/new-client
funnel. Touches: STEP_ORDER + step-number selector + nav guards + the three
duplicated auth bootstraps + CTAs routing direct to /reservar instead of
/portal/login.

### P2 — Collapse 7 steps to 4 screens
- **Location:** a compact CDE/SFC pill on the service screen (remembered per
  device), not a full screen.
- **Add-ons:** an inline "Mejora tu ritual" section under the chosen service
  (or a bottom sheet), not a screen most users skip.
- **Staff:** default "Cualquier terapeuta" (already the null default) with a
  "elegir terapeuta" link on the date screen — no mandatory tap.
- **Categories expanded** by default (or search) — today every non-top-pick
  service costs 2 extra taps.

### P3 — Login friction fixes (independent of P1)
- Accept 8-digit Panamanian numbers (auto-prepend 507) — today `66124546` is
  rejected with a scolding error. Country selector defaults to 🇵🇦.
- Registration: 2 fields (nombre + WhatsApp), not 4 — email can come later.

### P4 — Correctness cleanups found during analysis
- Pricing is implemented 3× with divergent rules (store version has zero
  callers; SuccessStep's total **never renders** because `pricing` is always
  null). Consolidate into one `lib/booking/pricing.ts`.
- Selecting a promotion silently wipes manually chosen services — warn.
- ~650 lines of dead code (ServiceTile, CartSummary, ClientSelector wiring,
  goToStep/resetToStep/etc.).
- Remove production console.logs of availability/booking payloads; rate-limit
  /api/mindbody/availability; resolve the 30-min-vs-15-min slot cadence
  contradiction (code does 30, comments say 15 — pick one deliberately).
- ConfirmStep's hidden-button-clicked-via-getElementById pattern → lift the
  submit into the nav properly.

### Suggested sequencing

| When | What |
|---|---|
| Week 1 | P0 funnel fixes + P3 phone UX + P4 pricing consolidation |
| Week 2–3 | P1 auth-last reorder (own PR, behind quick rollback) |
| Week 3–4 | P2 step collapse |
| After Tilopay + Rooms Phase 2 | WS-B prepay step + C2 couples mode |

Every phase is measurable against the corrected funnel: watch
`startToComplete`, step drop-offs, and `whatsapp_click` (escape-hatch usage
should *fall* as the widget gets easier).
