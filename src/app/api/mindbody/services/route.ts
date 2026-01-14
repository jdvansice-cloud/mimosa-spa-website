import { NextRequest, NextResponse } from 'next/server'
import { getServices, getAddons } from '@/lib/booking/mindbody'
import { sanitizeError, ERROR_MESSAGES, PROGRAM_IDS } from '@/lib/booking/constants'

// GET /api/mindbody/services?locationId=1&type=main|addons|all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const type = searchParams.get('type') || 'main' // main, addons, or all

    // Validate locationId if provided
    let parsedLocationId: number | undefined
    if (locationId) {
      parsedLocationId = parseInt(locationId)
      if (isNaN(parsedLocationId)) {
        return NextResponse.json(
          { error: 'locationId debe ser un número válido' },
          { status: 400 }
        )
      }
    }

    // Validate type parameter
    const validTypes = ['main', 'addons', 'all']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type debe ser uno de: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('Fetching services for locationId:', locationId, 'type:', type)

    let filteredServices: Array<{
      Id: number
      Name: string
      Description: string
      Duration: number
      Price: number
      OnlineBooking: boolean
      Category: string
      CategoryId?: number
      ProgramId: number
      IsAddOn: boolean
      ProductId?: number
      OnlinePrice?: number
      TaxIncluded?: number
    }> = []

    if (type === 'addons') {
      // For add-ons, use the sale/services endpoint which has actual prices
      filteredServices = await getAddons(parsedLocationId)
    } else {
      // For main services
      const allServices = await getServices(parsedLocationId)

      // Validate API response
      if (!Array.isArray(allServices)) {
        console.error('Invalid Mindbody response: services is not an array')
        return NextResponse.json(
          { error: ERROR_MESSAGES.SERVICES_LOAD_FAILED },
          { status: 500 }
        )
      }

      console.log('Total services from Mindbody:', allServices.length)
      if (allServices.length > 0) {
        console.log('Sample service:', JSON.stringify(allServices[0]))
        console.log('Categories found:', [...new Set(allServices.map(s => s.Category))])
        console.log('ProgramIds found:', [...new Set(allServices.map(s => s.ProgramId))])
      }

      if (type === 'main') {
        // Exclude Adicionales category
        filteredServices = allServices.filter(
          s => s.ProgramId !== PROGRAM_IDS.ADICIONALES
        )
      } else {
        // type === 'all'
        filteredServices = allServices
      }
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
      total: filteredServices.length
    })

  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
