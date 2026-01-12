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
    
    console.log('Fetching services for locationId:', locationId, 'type:', type)
    
    // Get services from Mindbody
    const allServices = await getServices(
      locationId ? parseInt(locationId) : undefined
    )
    
    console.log('Total services from Mindbody:', allServices.length)
    if (allServices.length > 0) {
      console.log('Sample service:', JSON.stringify(allServices[0]))
      console.log('Categories found:', [...new Set(allServices.map(s => s.Category))])
    }
    
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
    
    console.log('Filtered services count:', filteredServices.length)
    
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
      total: filteredServices.length,
      debug: {
        locationId,
        type,
        totalFromMindbody: allServices.length,
        filteredCount: filteredServices.length
      }
    })
    
  } catch (error) {
    console.error('Get services error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to get services', details: errorMessage },
      { status: 500 }
    )
  }
}
