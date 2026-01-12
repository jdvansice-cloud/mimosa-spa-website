import { NextRequest, NextResponse } from 'next/server'
import { getServices } from '@/lib/booking/mindbody'

// Category to exclude from main services (shown in addons step)
const ADICIONALES_CATEGORY = 'ADICIONALES'

// GET /api/mindbody/services?locationId=1&type=main|addons|all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const type = searchParams.get('type') || 'main' // main, addons, or all
    
    // Get services from Mindbody
    const allServices = await getServices(
      locationId ? parseInt(locationId) : undefined
    )
    
    // Filter based on type
    let filteredServices = allServices
    
    if (type === 'main') {
      // Exclude ADICIONALES category
      filteredServices = allServices.filter(
        s => s.Category?.toUpperCase() !== ADICIONALES_CATEGORY
      )
    } else if (type === 'addons') {
      // Only ADICIONALES category
      filteredServices = allServices.filter(
        s => s.Category?.toUpperCase() === ADICIONALES_CATEGORY
      )
    }
    
    // Group services by category
    const grouped = filteredServices.reduce((acc, service) => {
      const category = service.Category || 'General'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(service)
      return acc
    }, {} as Record<string, typeof filteredServices>)
    
    return NextResponse.json({
      services: filteredServices,
      grouped,
      categories: Object.keys(grouped),
      total: filteredServices.length
    })
    
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Failed to get services' },
      { status: 500 }
    )
  }
}
