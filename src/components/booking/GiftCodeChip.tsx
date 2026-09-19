'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Gift, X } from 'lucide-react'
import { clearStoredGiftCode, readStoredGiftCode, sanitizeGiftCode } from '@/lib/giftshop/giftCode'

// Shown above the booking widget while a gift code is stored. The code stays
// on screen after booking (state), even though the storage key is cleared, so
// the success screen still reminds the client to present the card at the spa.
export function GiftCodeChip() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    // Child effects run before the parent's, so read the URL too: the page
    // may not have written sessionStorage yet on the very first render.
    setCode(readStoredGiftCode() ?? sanitizeGiftCode(searchParams.get('gc')))
  }, [searchParams])

  if (!code) return null
  const last4 = code.slice(-4)

  return (
    <div className="mb-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 px-3 py-1.5 text-xs text-dark">
        <Gift className="h-3.5 w-3.5 text-gold-600" />
        <span>
          Gift card ····{last4} lista para usar al pagar en el spa
        </span>
        <button
          type="button"
          aria-label="Quitar gift card"
          onClick={() => {
            clearStoredGiftCode()
            setCode(null)
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-gold/30"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
