'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useBagStore } from '@/lib/bag/store'
import { GIFT_CARDS_PATH } from '@/lib/nav'

// Secondary escape from the error page when the bag still holds gift cards.
export function BackToGiftCardsLink({ locale }: { locale: string }) {
  const count = useBagStore(s => s.giftCards.length)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || count === 0) return null
  return (
    <Link
      href={`/${locale}${GIFT_CARDS_PATH}`}
      className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center min-h-[44px]"
    >
      {locale === 'en' ? 'Back to gift cards' : 'Volver a las gift cards'}
    </Link>
  )
}
