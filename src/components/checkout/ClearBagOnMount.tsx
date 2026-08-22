'use client'

import { useEffect } from 'react'
import { useBagStore } from '@/lib/bag/store'
import { track } from '@/lib/track'

/**
 * Mounted on the gracias page: the order is paid, so the bag empties — and
 * this is the conversion event that closes the checkout funnel.
 */
export function ClearBagOnMount({
  orderNumber,
  valueCents,
  locale,
}: {
  orderNumber?: string
  valueCents?: number
  locale?: string
}) {
  const clearBag = useBagStore(s => s.clearBag)
  useEffect(() => {
    track('checkout_paid', { locale, meta: { orderNumber, valueCents } })
    clearBag()
  }, [clearBag, orderNumber, valueCents, locale])
  return null
}
