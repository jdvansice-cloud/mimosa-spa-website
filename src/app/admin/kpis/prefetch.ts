'use client'

// ===========================================
// Session-scoped prefetch for the Staff page (the slowest first load:
// year-range queries + a live Mindbody schedules call). Every Mobile
// Manager page triggers it in the background, so by the time the user
// opens Staff the default view is already cached in sessionStorage.
// ===========================================

const TTL_MS = 10 * 60 * 1000
const key = (period: string, location: string) => `mm_staff:${period}:${location}`

export function readStaffCache<T>(period: string, location: string): T | null {
  try {
    const raw = sessionStorage.getItem(key(period, location))
    if (!raw) return null
    const { at, data } = JSON.parse(raw) as { at: number; data: T }
    return Date.now() - at <= TTL_MS ? data : null
  } catch {
    return null
  }
}

export function writeStaffCache(period: string, location: string, data: unknown) {
  try {
    sessionStorage.setItem(key(period, location), JSON.stringify({ at: Date.now(), data }))
  } catch { /* storage full/unavailable — cache is best-effort */ }
}

let firedThisPageLoad = false

/** Fire-and-forget: warm the default Staff view (mtd · all locations). */
export function prefetchStaffKpis() {
  if (typeof window === 'undefined' || firedThisPageLoad) return
  firedThisPageLoad = true
  try {
    if (readStaffCache('mtd', 'all')) return
    fetch('/api/admin/kpis/staff?period=mtd&location=all', { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (data) writeStaffCache('mtd', 'all', data) })
      .catch(() => { /* background warm-up only */ })
  } catch { /* never break the page over a prefetch */ }
}
