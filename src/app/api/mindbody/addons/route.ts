import { NextRequest, NextResponse } from 'next/server'
import { getAddonServices } from '@/lib/booking/mindbody'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locationId = searchParams.get('locationId')
    
    const addons = await getAddonServices(
      locationId ? parseInt(locationId) : undefined
    )
    
    return NextResponse.json({ addons })
  } catch (error) {
    console.error('Error fetching addons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addons' },
      { status: 500 }
    )
  }
}
