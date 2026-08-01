'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/track'

// Module-level so strict-mode remounts don't double-fire the same path.
let lastTracked: string | null = null

/** Fires a first-party page_view on every route change (public site only). */
export function PageViewTracker({ locale }: { locale: string }) {
  const pathname = usePathname()
  useEffect(() => {
    if (!pathname || pathname === lastTracked) return
    lastTracked = pathname
    track('page_view', { path: pathname, locale })
  }, [pathname, locale])
  return null
}
