'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { selectBagCount, useBagStore } from '@/lib/bag/store'

/**
 * Header bag button with item-count badge. Count renders only after mount
 * (localStorage-backed store) to avoid hydration mismatches.
 */
export function BagIcon({ locale, className }: { locale: string; className?: string }) {
  const { session, giftCards, openBag } = useBagStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = mounted ? selectBagCount({ session, giftCards }) : 0

  return (
    <button
      onClick={openBag}
      className={
        className ??
        'relative p-2 rounded-lg text-cream/80 hover:text-gold hover:bg-cream/10 transition-colors'
      }
      aria-label={locale === 'en' ? `Bag (${count})` : `Bolsa (${count})`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-dark">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
