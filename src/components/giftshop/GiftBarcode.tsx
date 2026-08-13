'use client'

import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

// Code128 render of the redemption code, scannable from the phone screen at
// the front desk (same symbology as the printed labels).
export function GiftBarcode({ code }: { code: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      JsBarcode(ref.current, code, {
        format: 'CODE128',
        displayValue: false,
        margin: 0,
        height: 56,
        background: 'transparent',
      })
    } catch {
      // invalid code → leave empty; the human-readable serial is still shown
    }
  }, [code])

  return <svg ref={ref} className="w-full max-w-[260px] mx-auto" aria-hidden />
}
