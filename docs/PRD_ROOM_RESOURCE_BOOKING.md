# PRD: Room/Resource Assignment in Booking Flow

**Document Version:** 1.4
**Date:** 2026-06-02
**Project:** Mindbody Resource (Room) Integration
**Status:** Draft — Phase 0 diagnostic complete; Supabase eligibility table needed before Phase 1
**Owner:** TBD

### Changelog
- **1.4 (2026-06-02):** Phase 0 diagnostic complete. Mimosa linked the 33 new resources to services in Mindbody admin (Service ↔ Resource), but **this link is not exposed via any read API** at Mimosa's site:
  - `/site/resources.Programs[]` is empty for every resource.
  - `/appointment/bookableitems?includeResourceAvailability=true` returns 0 items (separate Mindbody-side issue at this site).
  - `/site/resourceavailabilities?programIds=X` returns only legacy resources, because it reads from old staff-availability blocks whose Resource fields are no longer in active use. The Staff Availability admin UI doesn't even expose a Resource field, so we can't fix this from there.
  - `/site/resourceavailabilities?resourceIds=X` works and returns physical availability windows for the new resources, but with no program/service tagging.
  Net: Mindbody's read APIs cannot tell us "given Service Y, which resources are eligible." We pivot D-1 — see new **D-10** below. Service ↔ Resource eligibility lives in a **Supabase table** (`service_resource_eligibility`) maintained by Mimosa ops. Mindbody remains source of truth for resource *availability* (when is the room free), just not *eligibility* (which service can use which room).
- **1.3 (2026-05-25):** Added Program → Resource probe via `/site/resourceavailabilities`. Surfaced the legacy-vs-new disconnect that motivated v1.4.
- **1.2 (2026-05-25):** Phase 0 resource-rename pass landed (33 resources captured in [MINDBODY_RESOURCES.md](./MINDBODY_RESOURCES.md)). The naming convention is richer than v1.1 assumed: prefix is `<CE\|SF> | <Base Name> -<n>`, and `<n>` is a **bed index (1..N)**, not a single/couples discriminator. Mimosa confirmed the v1 booking semantics:
  - **Standard rooms (base name ≠ "Foot Massage"):** single bookings reserve `-1` only. `-2/-3` reserved for couples (deferred).
  - **Foot Massage areas (CE ×3, SF ×4):** every chair is independent — single bookings reserve **any free `-N`**.
  D-6, D-7, D-8 revised below. New D-9 captures the Foot Massage exception.
- **1.1 (2026-05-25):** Phase 0 audit v1 ran. Surfaced that Mindbody's `Programs[]` on `/site/resources` was empty and `/appointment/bookableitems` returned 0 items. Mimosa committed to reconfiguring resources (rename + session-type linking). Production code uses `/appointment/scheduleitems` (not `bookableitems`) for availability — §5.1 updated accordingly.
- **1.0 (2026-05-23):** Initial PRD.

---

## 1. Background & Motivation

Today the website's booking widget creates appointments in Mindbody using only `StaffId`, `SessionTypeId`, `StartDateTime`, `ClientId`, and `LocationId`. Mindbody is then left to assign a room (resource) on its own — or, depending on the location's Mindbody configuration, may flag the appointment as unassigned and require manual intervention from front-desk staff.

Mimosa needs the website to **explicitly reserve a specific compatible room** at booking time, in the same way the in-store Mindbody scheduler does. This prevents:

- Double-booked rooms (two therapists assigned to the same physical cabin).
- Bookings that succeed in Mindbody but cannot be physically delivered because no compatible room is free.
- Front-desk having to manually patch room assignments after every online booking.

Mindbody's V6 Public API supports this natively (`ResourceIds` in `AddAppointment` / `AddMultipleAppointments`, and `includeResourceAvailability` in `BookableItems`). The work is to wire those primitives into our availability and booking endpoints, and to keep the customer-facing UX unchanged.

---

## 2. Goals & Non-Goals

### Goals

1. **Correctness (hard invariant):** **Every service in every online booking creates a Mindbody appointment with a non-empty `ResourceIds` value.** No appointment is ever sent to `AddAppointment` without an explicit room id. If a chosen service cannot be matched to a compatible, available room, the booking is refused — never created without a room. This applies equally to single-service bookings, every leg of a multi-service chain, and every in-cabin add-on.
2. **No-impossible-slots:** The time-slot grid only shows slots where both a therapist *and* a compatible room are free for **every** selected service in the chain. A slot where 3 of 4 services can find a room is not bookable.
3. **Service-aware room compatibility:** Facials are placed in facial cabins, massages in massage cabins, etc. — driven by Mindbody's own configuration of which resources each `SessionTypeId` permits.
4. **No new clicks for the customer:** Room assignment is fully transparent. The customer continues to choose service → date/time → therapist; the room is selected behind the scenes.
5. **Multi-service & add-on coherence:** When a customer books multiple treatments back-to-back, every appointment in the chain gets its own room. See §6.4 for the per-leg rules and §8 for the continuity heuristic.

### Non-Goals (v1)

- A customer-facing "choose your room" picker.
- Showing the assigned room name on the confirmation screen or in WhatsApp messages (could be a v2 enhancement).
- Couples-treatment room handling — explicitly deferred (semantics specified in §6.5; implementation not in v1 scope).
- Changing how walk-ins / front-desk bookings work. Front desk continues to use Mindbody directly.
- Resource availability for unavailabilities, blocks, or staff-availability writes.

---

## 3. User Stories

**U-1 — Customer (transparent room booking)**
*As a customer booking a facial online, I want to pick my therapist and time without thinking about rooms, and trust that when I show up there will be a room ready for me.*

**U-2 — Front-desk staff**
*As a front-desk receptionist, I want every online booking to arrive in Mindbody already assigned to a specific cabin, so I don't have to manually fix room assignments before the appointment.*

**U-3 — Mimosa management**
*As the spa manager, I want to be confident that the website cannot oversubscribe a room, even when multiple customers book at the same time on different therapists.*

**U-4 — Developer / operator**
*As an operator debugging a failed booking, I want the resource id, resource name, and the eligible-resource list at booking time logged alongside the existing booking log, so I can diagnose why a slot was offered or rejected.*

---

## 4. Product Decisions (Confirmed)

| # | Decision | Rationale |
|---|----------|-----------|
| D-1 | ~~Room ↔ service mapping is sourced from Mindbody's own configuration.~~ **Revised in v1.4** — see D-10. Mindbody's read APIs don't expose this mapping at Mimosa's site, so we maintain it ourselves. Mindbody is still the source of truth for resource *availability* (room is free at time T), just not eligibility (room can host service Y). |
| D-2 | Customer UX is **fully transparent** — no new step, no room visible in the UI. | Goal is to remove front-desk friction without adding customer friction. |
| D-3 | When the therapist is free but no compatible room is free, **the slot is hidden**. Customers never see impossible slots. | `BookableItems` with `includeResourceAvailability` already returns the staff×resource intersection — this is the natural and safest behavior. |
| D-4 | Send an explicit `ResourceIds` value in `AddAppointment` rather than letting Mindbody auto-pick. | The whole point is to give us control. If we let Mindbody pick, we cannot reliably surface or prevent conflicts. |
| D-5 | **A booking with any service that cannot be assigned a room is rejected outright.** Never send `AddAppointment` with empty or missing `ResourceIds`, and never send a partial multi-service booking. | Aligns with Goal 1 as a hard invariant. Prevents the failure mode where one leg of a multi-service chain silently lands without a room. |
| D-6 | **Resource naming convention is the contract:** every resource name matches `<CE\|SF> \| <Base Name> -<n>` where `<n>` is a positive integer bed index. The booking flow parses the name at runtime. | Mimosa controls the resource names in Mindbody admin. Encoding location + bed-index in the name avoids a parallel local config and lets ops add/rename rooms without code changes. Validated by the audit ([resources-audit route](../src/app/api/mindbody/admin/resources-audit/route.ts)). |
| D-7 | **Resources are scoped per-location.** Costa del Este (CE, Id 1) and San Francisco (SF, Id 2) have independent resource lists, identified by the name prefix. The booking flow only considers resources belonging to the customer's chosen location. | Mimosa's two locations are physically separate. |
| D-8 | **v1 single-person bookings reserve `-1` only** for standard rooms (base name ≠ "Foot Massage"). `-2`+ are reserved for the deferred couples-booking phase. | Mimosa's confirmed model: a couples-capable room has two beds (`-1` and `-2`) and we don't want a single booking to consume the `-2` and lock out a couples booking later. |
| D-9 | **Foot Massage is the exception to D-8.** Foot Massage areas (CE has 3 chairs, SF has 4) are shared rooms where every `-N` chair is independently bookable. Single bookings for Foot Massage services reserve **any free `-N`**, not just `-1`. | Each chair is a physical station, not a bed in a paired room. The PRD invariant (every booking has a non-empty `ResourceIds`) still holds; we just expand the eligible pool from `{-1}` to `{any -N}` for this base name. |
| D-10 | **Service ↔ Resource eligibility lives in a Supabase table** (`service_resource_eligibility`), maintained by Mimosa ops. Mindbody is no longer the source of truth for this mapping at our site. | Phase 0 diagnostic (2026-06-02) proved Mindbody's read APIs do not expose the Service ↔ Resource link Mimosa configured in admin. The mapping must live somewhere queryable; Supabase is the natural choice since we already use it for the booking audit log. Mimosa ops mirrors what they set in Mindbody admin into this table. Audit re-runs (§11) verify the table is complete before Phase 1 ships. |

---

## 5. Mindbody API — Reference

(Drawn from `Swagger MINDBODY Public API V6.md` in this repo.)

### 5.1 Availability primitive (revised in v1.2)

Phase 0 v1 audit (2026-05-25) showed `/appointment/bookableitems` returned 0 items at Mimosa's site, while `/appointment/scheduleitems` (already used in production via [src/app/api/mindbody/availability/route.ts](src/app/api/mindbody/availability/route.ts)) returns full data. The implementation must continue to use `getScheduleItems` as the primary availability source.

**Mindbody V6 schedule-item appointment objects include a `Resource`/`Resources` field** on the `Appointments[]` and `Availabilities[]` they return. Phase 1 will extend `getScheduleItems`' typed response (currently in [src/lib/booking/mindbody.ts](src/lib/booking/mindbody.ts) around line 1130) to read it. The availability computation then intersects three layers per candidate slot, in this order:

1. Staff is free for the full duration (already done today).
2. At least one resource compatible with the requested service is free for the full duration. Compatibility is determined by Mindbody's session-type↔resource configuration in admin.
3. The compatible resource must be **v1-eligible** per the parsed name:
   - If base name is `Foot Massage` → any `-N` qualifies (D-9).
   - Else → only `-1` qualifies (D-8).

`/appointment/bookableitems` is retained for the audit / debugging endpoint but is not on the critical booking path. Once Mimosa completes session-type↔resource linking, the audit's `bookableitems` calls should start returning data — that is the signal Phase 0 is complete.

### 5.2 `POST /public/v6/appointment/addappointment`

Request body fields used today: `ClientId`, `LocationId`, `StaffId`, `SessionTypeId`, `StartDateTime`, `EndDateTime?`, `Notes`, `StaffRequested`.

**New field:** `ResourceIds: integer[]` — array of resource IDs to reserve. For a standard single-room treatment, this will be a one-element array.

### 5.3 `POST /public/v6/appointment/addmultipleappointments`

Wraps multiple `AddAppointmentRequest` objects. Each one independently accepts `ResourceIds`. This is what the multi-service flow uses today via `addMultipleAppointments()` in `src/lib/booking/mindbody.ts:1258`.

### 5.4 `POST /public/v6/appointment/updateappointment`

Also accepts `ResourceIds`. Not in v1 scope but worth noting for a potential v2 "change my room" admin tool.

### 5.5 `GET /public/v6/site/resources`

Lists all resources at a site. Used at backend boot / cron to maintain a `name → id → eligible programs` lookup for debugging and admin tooling. **Not** the primary source for booking — `bookableitems` is.

### 5.6 `GET /public/v6/site/resourceavailabilities`

Resource schedules across the site. Useful for staff/admin tools (e.g., "is Cabin 3 in maintenance Friday?") but not on the customer booking critical path.

---

## 6. Functional Requirements

### 6.1 Availability endpoint changes

**File:** [src/app/api/mindbody/availability/route.ts](src/app/api/mindbody/availability/route.ts)

- Pass `includeResourceAvailability=true` on the underlying `/bookableitems` call.
- For each candidate time slot, compute the set of `(staffId, eligibleResourceIds)` pairs **for every service in the requested chain**.
- A slot is "bookable" only if, for the chosen staff, there exists a per-service assignment such that **every** service in the chain has at least one free, eligible room for its own time window. If even one leg has no eligible+free room, the slot is hidden. Partial-room slots are not bookable.
- The response shape must extend `availableStaffIds` for each slot to also expose, per staff member, the eligible resource ids for the requested service combination. Suggested shape:

```ts
type Slot = {
  startTime: string;
  endTime: string;
  availableStaff: Array<{
    staffId: number;
    eligibleResourceIds: number[]; // ordered; preferred first
  }>;
};
```

- The "duration" math (combined duration for multi-service bookings) must continue to work; resource eligibility is checked against the **first** appointment's window if all services are single-room, or per-appointment for chained bookings (see §6.4).

### 6.2 Booking endpoint changes

**File:** [src/app/api/mindbody/book/route.ts](src/app/api/mindbody/book/route.ts) and [src/lib/booking/mindbody.ts](src/lib/booking/mindbody.ts)

- The request from the widget must include the chosen `staffId` (already does) and the **server** must pick the `ResourceIds` from the eligible list returned by availability. The widget does not need to send a room id.
- Server-side, before constructing each `AddAppointmentRequest`, re-query `bookableitems` for the exact `(StaffId, StartDateTime, SessionTypeId, duration)` and read the currently-eligible resources. **Do not trust** any resource id the client might have echoed back.
- For **every** service in the chain, pick an eligible resource id (see §8 heuristic) and include it as `ResourceIds: [chosen]` on that service's `AddAppointmentRequest`.
- **Invariant — enforced server-side:** before any call to Mindbody, assert that every `AddAppointmentRequest` in the payload has a `ResourceIds` array of length ≥ 1 with all-integer entries. If the assertion fails for any leg, abort the entire booking and return `ROOM_ASSIGNMENT_FAILED` to the client. Never send a partial booking — multi-service chains are atomic from the customer's perspective.
- If between availability check and booking *any* leg's room is no longer free, return a clear error code (`ROOM_UNAVAILABLE`) and the widget shows "That time was just taken — please pick another." This is the same UX we have today for staff conflicts. No appointments are created in this case (see §6.3 for retry behavior).

### 6.3 Failure modes & retries

- If `AddAppointment` returns a resource-conflict error from Mindbody (race condition with an in-person booking), retry **once** with the next eligible resource id from the original list **for that specific leg**. If the retry also fails — or no further eligible rooms remain — abort the entire booking and surface `ROOM_UNAVAILABLE` to the user. **Do not** fall back to omitting `ResourceIds`; doing so would violate the hard invariant.
- For multi-service bookings using `addmultipleappointments`: if Mindbody reports a resource conflict on any single leg in the response, treat the whole batch as failed. If Mindbody has already persisted some legs (depends on its transactional behavior), the server must explicitly cancel those persisted legs before returning the error to the user, so we never leave behind orphaned appointments without rooms or partial chains.
- Log each booking attempt's `attemptedResourceIds`, `chosenResourceId`, and `mindbodyError?` into the existing `bookings` audit table in Supabase.

### 6.4 Multi-service / add-on flow

- Each service in a multi-service booking is its own `AddAppointmentRequest` and **must** carry its own non-empty `ResourceIds`. There is no "shared room across the chain" optimization that omits the field on subsequent legs.
- Default v1 behavior: **prefer the same room across all of a customer's back-to-back appointments**, when that room is eligible for every service in the chain and free for the whole combined window. Otherwise fall back to per-appointment room picks — but every leg still gets its own explicit `ResourceIds` value.
- Add-ons booked in-cabin (program `ADICIONALES_EN_CABINA`, id 12 — see [src/lib/booking/constants.ts](src/lib/booking/constants.ts)) **must** inherit the same room as the main treatment. If Mindbody's resource eligibility for that add-on does not include the chosen room, the booking is rejected with `ROOM_ASSIGNMENT_FAILED` and the misconfiguration is logged loudly (Sentry/console) for the operator. The system does not silently re-room the add-on and does not silently drop the room requirement.

### 6.5 Couples treatments (deferred from v1)

Couples treatments (programs `TRATAMIENTOS_PAREJAS` id 11 and `PAREJAS` id 21; UI: *"masaje de pareja"*) reserve **two beds from the same standard room**: one `-1` and one `-2` of the matching base name. Each of the two appointments in the chain (one per therapist) gets its own `ResourceIds` pointing to the corresponding bed.

Concretely: if `CE | Abanicos -1` and `CE | Abanicos -2` are the two beds of room Abanicos at Costa del Este, a couples booking creates two appointments with `ResourceIds: [<Abanicos-1>]` and `ResourceIds: [<Abanicos-2>]` at the same StartDateTime.

**v1 ships single-person bookings only.** Couples logic is documented here so the data model and naming convention support it cleanly when we add it. v1 hides `-2` (and higher) beds of standard rooms from the single-booking room-pick pool per **D-8**. Foot Massage (D-9) is unrelated to couples and ships in v1.

### 6.6 Logging & observability

- Extend the existing booking log row written in [src/app/api/mindbody/book/route.ts](src/app/api/mindbody/book/route.ts) (line ~283–435) with:
  - `resource_id` — the chosen ResourceId (nullable for legacy rows).
  - `resource_eligibility_snapshot` — the eligible-id list as it was at booking time (JSON).
  - `resource_retry_count` — 0, 1, or 2.
- Add a Sentry breadcrumb (if Sentry is wired) for the resource pick — service id, eligible list, chosen id.

### 6.7 Backwards compatibility

- Bookings made before this feature ships have no `resource_id` in their log row. No migration of historical Mindbody appointments is required — Mindbody already auto-assigned (or didn't) for those.
- The widget API contract gains an optional response field on availability slots. Older widget builds that ignore the field continue to work for the staff-selection step (but won't get the room-aware slot filtering — see §11 for rollout).

---

## 7. Data Model

### 7.1 New table: `service_resource_eligibility`

```sql
CREATE TABLE service_resource_eligibility (
  id            BIGSERIAL PRIMARY KEY,
  session_type_id INTEGER NOT NULL,           -- Mindbody SessionType.Id
  location_id   INTEGER NOT NULL,             -- Mindbody Location.Id (1=CE, 2=SF)
  resource_id   INTEGER NOT NULL,             -- Mindbody Resource.Id
  -- Denormalized for human-readable querying / audit (not authoritative):
  session_type_name TEXT,
  resource_name TEXT,
  -- Bookkeeping:
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_type_id, location_id, resource_id)
);
CREATE INDEX idx_sre_session_location
  ON service_resource_eligibility (session_type_id, location_id) WHERE is_active;
```

Each row = "session type X at location Y can use resource Z". One row per (service, location, eligible room) tuple. Mimosa populates this from what they've configured in Mindbody admin. Updates as services/rooms change.

### 7.2 Audit log extension

The existing `bookings` log table gains three nullable columns (§6.6 — `resource_id`, `resource_eligibility_snapshot`, `resource_retry_count`).

### 7.3 No hardcoded map in code

The mapping must not live in `constants.ts` — too painful to ship a code deploy every time Mimosa adds a service or moves a room. The Supabase table is the source of truth at our application layer, mirroring Mindbody admin.

Optional: a cron-refreshed cache (every 6h) of `/site/resources` to give us human-readable resource names in the booking log without an API call per booking.

---

## 8. Room-pick Heuristic (v1)

Given an eligible resource list for a `(staff, time, service)`:

1. If the customer has previous appointments at this location with a known preferred room, prefer that room. *(Optional — only if low effort.)*
2. Else, prefer a room used earlier in the same multi-service chain (§6.4).
3. Else, pick the lowest `ResourceId` in the eligible list (deterministic, easy to test).

The heuristic is intentionally simple; it can be tuned post-launch if Mimosa notices uneven room utilization.

---

## 9. UX

**No changes** to the customer-facing flow. The Staff step continues to show available therapists for the chosen time; the room is reserved on the server when the customer confirms.

**Edge case copy:** if `ROOM_UNAVAILABLE` fires at booking time (race condition), the existing "time no longer available" error copy is sufficient. No new strings needed for v1.

---

## 10. Open Questions

| ID | Question | Status | Resolution |
|----|----------|--------|------------|
| O-1 | For couples treatments, single suite or two adjacent rooms? | **Resolved 2026-05-25** | Two beds (one `-1` + one `-2`) of the same standard room. See §6.5 and D-8. |
| O-2 | Are there resources in Mindbody that are *not* rooms? | **Resolved 2026-05-25** | Pre-rename audit included specialized zones (Foot Massage, Facial IR, Oxigenoterapia, etc.). Post-rename all 33 resources follow the `<CE\|SF> \| <Base> -<n>` convention. Foot Massage is the only base name needing special v1 handling (D-9). |
| O-3 | v2 admin view for front-desk room overrides before customer arrives? | Open | Out of v1 scope. |
| O-4 | Should the assigned room name appear on the WhatsApp confirmation? | Open | Out of v1 scope. |
| O-5 | Why does `/appointment/bookableitems` return 0 items at Mimosa's site? | Open | Not blocking — we use `getScheduleItems` for the booking path. Worth filing with Mindbody support, not required for v1. |
| O-6 | After session-type↔resource linking, will every online-bookable SessionType be linked to at least one v1-eligible resource? | **Open — gate, answered by re-running the audit (§11 Phase 0)** | Any session type without an eligible resource (per D-8 / D-9) is unbookable online by design. Audit's `launchBlockers` list is the gate. |

---

## 11. Rollout Plan

1. **Phase 0 — Discovery (✅ rename complete; ✅ diagnostic complete; ⏳ Supabase eligibility table needs to be populated):**
   - **Initial audit (done 2026-05-25):** Built [resources-audit route](../src/app/api/mindbody/admin/resources-audit/route.ts) + `getResources()` / `getResourceAvailabilities()` / `includeResourceAvailability` helpers in [src/lib/booking/mindbody.ts](src/lib/booking/mindbody.ts).
   - **Rename pass (done 2026-05-25):** Mimosa renamed 33 resources to the `<CE\|SF> | <Base> -<n>` convention. Snapshot in [MINDBODY_RESOURCES.md](./MINDBODY_RESOURCES.md).
   - **Service ↔ Resource link (done 2026-06-02):** Mimosa linked services to the new resources in Mindbody admin (visible in the Service's Resource dropdown).
   - **Diagnostic (done 2026-06-02):** Confirmed Mindbody's read APIs don't surface the Service ↔ Resource link at this site. Drove **D-10**: Supabase-backed eligibility map.
   - **Supabase migration (done 2026-06-02):** [20260602_service_resource_eligibility.sql](../supabase/migrations/20260602_service_resource_eligibility.sql) creates the `service_resource_eligibility` table.
   - **Mimosa populates the eligibility table (external, blocks Phase 1):** mirroring what they configured in Mindbody admin into Supabase. Can be done via SQL editor, CSV import, or (later) a small admin UI we build.
   - **Audit re-run (us, when Mimosa says the table is populated):** Re-run `/api/mindbody/admin/resources-audit`. The endpoint validates:
     1. Every resource name matches `<CE\|SF> | <Base> -<n>` (D-6).
     2. Bed numbers within each room are contiguous starting at 1.
     3. `service_resource_eligibility` is populated (`eligibilityTable.populated === true`).
     4. Every active online-bookable SessionType has at least one v1-eligible resource in the eligibility table per D-8 (`-1` for standard rooms) or D-9 (any `-N` for Foot Massage).
   - **Exit criterion:** `summary.gateReady === true`. Any item in `launchBlockers` lists a specific session type Mimosa needs to add eligibility rows for.
2. **Phase 1 — Availability changes (1–2 days):** Implement §6.1. Behind a server-side feature flag `ROOMS_AWARE_AVAILABILITY=false` by default. Verify the slot grid still renders correctly with flag off, and that with the flag on the only delta is fewer impossible slots.
3. **Phase 2 — Booking changes (1–2 days):** Implement §6.2 and §6.3. Behind a separate flag `ROOMS_AWARE_BOOKING=false`. With the flag off, bookings continue to go out without `ResourceIds` (today's behavior). With it on, every booking includes a chosen `ResourceIds`.
4. **Phase 3 — Multi-service & logging (1 day):** §6.4 and §6.6.
5. **Phase 4 — Soft launch:** Enable both flags for one location first (Mimosa Panama Pacífico if applicable, or whichever is lower volume). Watch the booking log for `ROOM_UNAVAILABLE` rates and Mindbody booking failures for 1 week.
6. **Phase 5 — Full launch:** Enable flags everywhere. Remove the flags after 2 weeks of clean behavior.

Total rough estimate: **5–7 dev days** plus discovery and soft-launch monitoring.

---

## 12. Success Metrics

- **Primary (invariant):** **100% of online appointments created post-launch have a non-null `resource_id` in the booking log AND a resolved resource on the Mindbody side.** A single counter-example is a P1 bug, not a metric variance.
- **Primary:** Front-desk reports of "I had to fix a room assignment for an online booking" drop to near zero.
- **Secondary:** `ROOM_UNAVAILABLE` errors at the booking step stay under 1% of attempts. A higher rate suggests our availability query is out of sync with the booking-time check.
- **Secondary:** No regression in completed-online-booking rate over the 4 weeks following full launch. (Expect a small dip — slots where Mimosa lacks compatible-room configuration become unbookable; that's correct behavior, not a regression.)

---

## 13. Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `bookableitems` with `includeResourceAvailability` is meaningfully slower and degrades availability-query latency. | Medium | Measure in Phase 1. If material, cache per (location, sessionTypeIds, date) for short TTL (60–120s). |
| Mindbody's resource configuration at Mimosa is inconsistent (e.g., some session types have no resources configured), so our query returns empty eligible lists and we hide otherwise-valid slots. | Medium | Phase 0 discovery flushes this out. If found, the fix is to **correct Mindbody's resource configuration** before launch — not to relax the invariant. Any session type that ships without configured resources will be unbookable online, by design. List such session types and resolve them as a launch blocker. |
| Race between availability check and booking (customer holds slot, in-person booking takes the room) causes `ROOM_UNAVAILABLE` errors that frustrate customers. | Low–Medium | §6.3 retry-once-with-next-eligible-room mitigates the common case; the rest surface as today's "time no longer available" error. |
| Multi-service room continuity (§6.4) becomes hard to satisfy and pushes more chains into per-appointment room picks, confusing front-desk who expects the customer to stay in one room. | Low | Document the actual frequency after launch; revisit heuristic if needed. |
| Couples bookings ship without explicit room logic (§6.5) and Mimosa expects them to use the couples suite. | Medium | Call this out in launch comms; resolve O-1 before any couples-specific promotion ships. |

---

## 14. Implementation Pointers (for the engineer picking this up)

- Current booking call site: [src/lib/booking/mindbody.ts:1138](src/lib/booking/mindbody.ts) (`addAppointment`) and same file `addMultipleAppointments` around line 1258.
- Current availability endpoint: [src/app/api/mindbody/availability/route.ts](src/app/api/mindbody/availability/route.ts) — `availableStaffIds` is built around line 387; this is where the room intersection should land.
- Booking route entrypoint: [src/app/api/mindbody/book/route.ts](src/app/api/mindbody/book/route.ts).
- Constants / program ids: [src/lib/booking/constants.ts](src/lib/booking/constants.ts).
- The widget: [src/components/booking/BookingWidget.tsx](src/components/booking/BookingWidget.tsx). No v1 changes required here.
- Swagger reference (local): [Swagger MINDBODY Public API V6.md](Swagger%20MINDBODY%20Public%20API%20V6.md) — see `addappointment`, `addmultipleappointments`, `bookableitems`, and `/site/resources` sections.
