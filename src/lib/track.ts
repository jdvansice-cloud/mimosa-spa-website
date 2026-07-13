'use client'

import { pushToDataLayer } from '@/lib/analytics'

// ===========================================
// First-party event tracking. Every event goes BOTH to the GTM dataLayer
// (for GA4/ads) and to our own /api/track endpoint (Supabase web_events),
// which feeds the Mobile Manager marketing page. Fire-and-forget.
// ===========================================

const SESSION_KEY = 'mm_sid'
const UTM_KEY = 'mm_utm'

interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referrer?: string
}

/** Stable per-browser-session id (survives navigation, not tab close). */
export function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return 'no-storage'
  }
}

/** Capture UTM params + external referrer once per session (first touch wins). */
export function captureAttribution(): Attribution {
  try {
    const saved = sessionStorage.getItem(UTM_KEY)
    if (saved) return JSON.parse(saved) as Attribution
    const params = new URLSearchParams(window.location.search)
    const attr: Attribution = {}
    const source = params.get('utm_source')
    const medium = params.get('utm_medium')
    const campaign = params.get('utm_campaign')
    if (source) attr.utm_source = source.slice(0, 80)
    if (medium) attr.utm_medium = medium.slice(0, 80)
    if (campaign) attr.utm_campaign = campaign.slice(0, 120)
    const ref = document.referrer
    if (ref && !ref.includes(window.location.hostname)) attr.referrer = ref.slice(0, 200)
    sessionStorage.setItem(UTM_KEY, JSON.stringify(attr))
    return attr
  } catch {
    return {}
  }
}

function device(): string {
  try {
    return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'
  } catch {
    return 'desktop'
  }
}

/** Send an event to GTM + our own web_events store. Never throws. */
export function track(
  event: string,
  data?: { path?: string; locale?: string; locationId?: number; meta?: Record<string, unknown> }
) {
  if (typeof window === 'undefined') return
  try {
    pushToDataLayer({ event, ...data?.meta })
    const attr = captureAttribution()
    const body = JSON.stringify({
      event,
      session_id: getSessionId(),
      path: data?.path ?? window.location.pathname,
      locale: data?.locale,
      device: device(),
      location_id: data?.locationId,
      meta: data?.meta,
      ...attr,
    })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
    }
  } catch {
    // analytics must never break the site
  }
}
