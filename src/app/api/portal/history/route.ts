import { NextRequest, NextResponse } from 'next/server'
import { getClientVisits, getClientPurchases, getClientSchedule } from '@/lib/booking/mindbody'
import { sanitizeError } from '@/lib/booking/constants'

// GET /api/portal/history - Get client history (visits, purchases, upcoming)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')
    const type = searchParams.get('type') || 'all' // visits, purchases, upcoming, all
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del cliente' },
        { status: 400 }
      )
    }

    const params = {
      clientId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    }

    const result: {
      visits?: Awaited<ReturnType<typeof getClientVisits>>
      purchases?: Awaited<ReturnType<typeof getClientPurchases>>
      upcoming?: Awaited<ReturnType<typeof getClientSchedule>>
    } = {}

    // Fetch data based on type
    if (type === 'all' || type === 'visits') {
      // Get past visits (default: last 6 months)
      const visitsParams = {
        ...params,
        startDate: params.startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: params.endDate || new Date().toISOString()
      }
      result.visits = await getClientVisits(visitsParams)
    }

    if (type === 'all' || type === 'purchases') {
      // Get purchases (default: last 6 months)
      const purchasesParams = {
        ...params,
        startDate: params.startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: params.endDate || new Date().toISOString()
      }
      result.purchases = await getClientPurchases(purchasesParams)
    }

    if (type === 'all' || type === 'upcoming') {
      // Get upcoming appointments (default: next 3 months)
      const upcomingParams = {
        ...params,
        startDate: new Date().toISOString(),
        endDate: params.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      }
      result.upcoming = await getClientSchedule(upcomingParams)
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Portal history error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
