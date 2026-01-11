import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'https://backend-proxy-server-production.up.railway.app'

interface MindbodyService {
  Id: string
  Name: string
  Description: string
  Duration: number
  Price: number
  ProgramName?: string
  OnlineBooking: boolean
}

interface TransformedService {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  onlineBooking: boolean
}

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
    const services: TransformedService[] = data.Services?.filter((service: MindbodyService) => 
      service.OnlineBooking === true
    ).map((service: MindbodyService) => ({
      id: service.Id,
      name: service.Name,
      description: service.Description,
      duration: service.Duration,
      price: service.Price,
      category: service.ProgramName || 'General',
      onlineBooking: service.OnlineBooking,
    })) || []

    // Group by category
    const groupedServices = services.reduce<Record<string, TransformedService[]>>((acc, service) => {
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
