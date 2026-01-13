import { NextRequest, NextResponse } from 'next/server'
import { getServicesByCategory, getServices } from '@/lib/booking/mindbody'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locationId = searchParams.get('locationId')
    const grouped = searchParams.get('grouped') !== 'false' // Default to grouped
    
    if (grouped) {
      const categories = await getServicesByCategory(
        locationId ? parseInt(locationId) : undefined
      )
      return NextResponse.json({ categories })
    } else {
      const services = await getServices(
        locationId ? parseInt(locationId) : undefined
      )
      return NextResponse.json({ services })
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
