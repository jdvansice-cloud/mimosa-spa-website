import { NextRequest, NextResponse } from 'next/server'
import { getPromoCodes, getPromoCodeByCode } from '@/lib/booking/mindbody'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const search = searchParams.get('search')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    // If a specific code is requested, return just that one
    if (code) {
      const promoCode = await getPromoCodeByCode(code)

      if (!promoCode) {
        return NextResponse.json(
          { error: 'Promo code not found', code },
          { status: 404 }
        )
      }

      return NextResponse.json({ promoCode })
    }

    // Otherwise return all promo codes (optionally filtered)
    const promoCodes = await getPromoCodes({
      searchText: search || undefined,
      activeOnly: activeOnly || undefined
    })

    return NextResponse.json({ promoCodes })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch promo codes' },
      { status: 500 }
    )
  }
}
