import { NextRequest, NextResponse } from 'next/server'
import { getServices, getAddons } from '@/lib/booking/mindbody'

// Program ID for Adicionales (add-ons)
const ADICIONALES_PROGRAM_ID = 8

// GET /api/mindbody/services?locationId=1&type=main|addons|all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const type = searchParams.get('type') || 'main' // main, addons, or all
    
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
      filteredServices = await getAddons(
        locationId ? parseInt(locationId) : undefined
      )
    } else {
      // For main services, use sessiontypes with onlineOnly=true
      const allServices = await getServices(
        locationId ? parseInt(locationId) : undefined
      )
      
      console.log('Total services from Mindbody:', allServices.length)
      if (allServices.length > 0) {
        console.log('Sample service:', JSON.stringify(allServices[0]))
        console.log('Categories found:', [...new Set(allServices.map(s => s.Category))])
        console.log('ProgramIds found:', [...new Set(allServices.map(s => s.ProgramId))])
      }
      
      if (type === 'main') {
        // Exclude Adicionales category (ProgramId 8)
        filteredServices = allServices.filter(
          s => s.ProgramId !== ADICIONALES_PROGRAM_ID
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
      total: filteredServices.length,
      debug: {
        locationId,
        type,
        filteredCount: filteredServices.length,
        categoriesCount: Object.keys(grouped).length
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
