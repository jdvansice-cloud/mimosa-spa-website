# Mindbody Resources (Rooms / Beds) — Mimosa

**Status:** Post-reconfiguration snapshot, transcribed from Mindbody admin UI
**Date captured:** 2026-05-25
**Source:** Mindbody site admin — Settings → Resources
**Naming format:** `<LOCATION_CODE> | <Room/Area Name> -<BedNumber>`

This document is the human-readable companion to PRD v1.1
([PRD_ROOM_RESOURCE_BOOKING.md](./PRD_ROOM_RESOURCE_BOOKING.md)). It captures
the resource list Mimosa has set up in Mindbody after the renaming pass. The
authoritative source remains Mindbody itself (via `GET /site/resources`); this
file is for quick reference, planning, and onboarding.

---

## Location codes

| Code | Mindbody Location | Mindbody Location Id |
|------|-------------------|----------------------|
| CE   | Costa del Este    | 1                    |
| SF   | San Francisco     | 2                    |

---

## Costa del Este (CE) — 15 resources

Grouped by base name. The number after the dash is the bed index within that room/area.

| Base name             | Beds  | Resource names                                                  | Notes |
|-----------------------|-------|-----------------------------------------------------------------|-------|
| VIP Sencilla          | 1     | `CE \| VIP Sencilla -1`                                          | Single-bed VIP room |
| VIP Doble             | 3     | `CE \| VIP Doble -1`, `CE \| VIP Doble -2`, `CE \| VIP Doble -3` | **Three beds** — see open question Q-1 below |
| Sombreros Chinos      | 2     | `CE \| Sombreros Chinos -1`, `CE \| Sombreros Chinos -2`         | Couples-capable |
| Abanicos              | 2     | `CE \| Abanicos -1`, `CE \| Abanicos -2`                         | Couples-capable |
| Paraguas Naranja      | 1     | `CE \| Paraguas Naranja -1`                                      | Single |
| Paraguas Azul         | 1     | `CE \| Paraguas Azul -1`                                         | Single |
| Plumas                | 1     | `CE \| Plumas -1`                                                | Single |
| Tai                   | 1     | `CE \| Tai -1`                                                   | Tai/foot-massage adjacent? clarify |
| Foot Massage          | 3     | `CE \| Foot Massage -1`, `CE \| Foot Massage -2`, `CE \| Foot Massage -3` | Multi-station area — see Q-2 |

**CE flat list (alphabetical):**
1. `CE | Abanicos -1`
2. `CE | Abanicos -2`
3. `CE | Foot Massage -1`
4. `CE | Foot Massage -2`
5. `CE | Foot Massage -3`
6. `CE | Paraguas Azul -1`
7. `CE | Paraguas Naranja -1`
8. `CE | Plumas -1`
9. `CE | Sombreros Chinos -1`
10. `CE | Sombreros Chinos -2`
11. `CE | Tai -1`
12. `CE | VIP Doble -1`
13. `CE | VIP Doble -2`
14. `CE | VIP Doble -3`
15. `CE | VIP Sencilla -1`

---

## San Francisco (SF) — 18 resources

| Base name        | Beds  | Resource names                                                                 | Notes |
|------------------|-------|--------------------------------------------------------------------------------|-------|
| VIP Sillon       | 1     | `SF \| VIP Sillon -1`                                                          | Single |
| VIP Ducha        | 1     | `SF \| VIP Ducha -1`                                                           | Single, with shower |
| Chino Faros      | 1     | `SF \| Chino Faros -1`                                                         | Single |
| Pilares Rojos    | 1     | `SF \| Pilares Rojos -1`                                                       | Single |
| Chinos Rosado    | 1     | `SF \| Chinos Rosado -1`                                                       | Single |
| Chinos Amarilla  | 1     | `SF \| Chinos Amarilla -1`                                                     | Single |
| Azul Estatua     | 2     | `SF \| Azul Estatua -1`, `SF \| Azul Estatua -2`                               | Couples-capable |
| Azul Velas       | 2     | `SF \| Azul Velas -1`, `SF \| Azul Velas -2`                                   | Couples-capable |
| Abanico Dorada   | 2     | `SF \| Abanico Dorada -1`, `SF \| Abanico Dorada -2`                           | Couples-capable |
| Mariposas        | 2     | `SF \| Mariposas -1`, `SF \| Mariposas -2`                                     | Couples-capable |
| Foot Massage     | 4     | `SF \| Foot Massage -1`, `SF \| Foot Massage -2`, `SF \| Foot Massage -3`, `SF \| Foot Massage -4` | Multi-station — see Q-2 |

**SF flat list (alphabetical):**
1. `SF | Abanico Dorada -1`
2. `SF | Abanico Dorada -2`
3. `SF | Azul Estatua -1`
4. `SF | Azul Estatua -2`
5. `SF | Azul Velas -1`
6. `SF | Azul Velas -2`
7. `SF | Chino Faros -1`
8. `SF | Chinos Amarilla -1`
9. `SF | Chinos Rosado -1`
10. `SF | Foot Massage -1`
11. `SF | Foot Massage -2`
12. `SF | Foot Massage -3`
13. `SF | Foot Massage -4`
14. `SF | Mariposas -1`
15. `SF | Mariposas -2`
16. `SF | Pilares Rojos -1`
17. `SF | VIP Ducha -1`
18. `SF | VIP Sillon -1`

---

## Totals

| | CE | SF | Total |
|---|---|---|---|
| Resources | 15 | 18 | **33** |
| Couples-capable base rooms (≥2 beds, non-multi-station) | 2 (Sombreros Chinos, Abanicos) | 4 (Azul Estatua, Azul Velas, Abanico Dorada, Mariposas) | 6 |
| Multi-station areas | 1 (Foot Massage ×3) | 1 (Foot Massage ×4) | 2 |
| Edge cases | VIP Doble ×3 | — | 1 |

(For comparison: pre-reconfig the site had 27 resources, all flat with no
location prefix, no consistent suffix, and no Programs[] assignments.)

---

## Booking semantics (v1 contract)

Confirmed with Mimosa 2026-05-25:

| Resource category | v1 booking flow |
|---|---|
| **Standard rooms** (every base name except `Foot Massage`) | Single-person booking reserves the room's **`-1`** bed only. `-2`, `-3` are reserved for **couples / multi-person bookings** (deferred). |
| **Foot Massage** (CE ×3, SF ×4) | Shared multi-station area — every chair is independently bookable. Single-person booking reserves **any one free `-N`** chair (1, 2, 3, or 4). |

For v1 the booking flow, given a chosen service:
1. Asks Mindbody which resources are eligible for that SessionType at the chosen location.
2. Filters that list to "v1-bookable" resources:
   - If the room base name is `Foot Massage` → keep all `-N`.
   - Else → keep only resources where `bedNumber === 1`.
3. Picks one free resource from the filtered list (per the heuristic in PRD §8) and includes it as `ResourceIds` on the appointment.
4. If the filtered list is empty for the requested time, the slot is hidden / the booking is refused (hard invariant — no roomless appointments).

`CE | VIP Doble` (3 beds: `-1`/`-2`/`-3`) follows the standard pattern: only
`-1` is usable in v1; `-2` and `-3` come into play when couples / multi-person
bookings are built.

## Future phases

- **Couples bookings** (Spanish UI: *"masaje de pareja"* — includes payment
  for two people): pick one `-1` AND one `-2` (or higher) of the same base
  room. Both legs of the appointment chain reference the same physical room.

Inherits the same hard invariant from PRD v1.x: **every leg of every
appointment lands in Mindbody with a non-empty `ResourceIds`** — no roomless
appointments, ever.

## Open items (not blocking v1)

- **Resource count sanity check:** I transcribed 33 resources from the
  screenshots (15 CE + 18 SF). The pre-reconfig site had 27. The audit
  re-run will produce the authoritative count.
- **Session-type↔resource linking in Mindbody:** Mimosa still needs to (or
  may have already) linked each online-bookable session type to its
  eligible resources in Mindbody's admin. The audit's `launchBlockers`
  list is the gate — empty means we proceed to Phase 1; non-empty lists
  the session types still needing linking.
