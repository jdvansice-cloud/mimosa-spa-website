import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'https://backend-proxy-server-production.up.railway.app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId') || '1'

    // Fetch services from Railway backend proxy
    const response = await fetch(`${RAILWAY_API_URL}/api/services?locationId=${locationId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (!response.ok) {
      throw new Error(`Railway API error: ${response.status}`)
    }

    const data = await response.json()

    // Filter and transform services for display
    const services = data.Services?.filter((service: any) => 
      service.OnlineBooking === true
    ).map((service: any) => ({
      id: service.Id,
      name: service.Name,
      description: service.Description,
      duration: service.Duration,
      price: service.Price,
      category: service.ProgramName || 'General',
      onlineBooking: service.OnlineBooking,
    })) || []

    // Group by category
    const groupedServices = services.reduce((acc: any, service: any) => {
      const category = service.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(service)
      return acc
    }, {})

    return NextResponse.json({ 
      data: services,
      grouped: groupedServices,
    })
  } catch (error) {
    console.error('Mindbody API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
