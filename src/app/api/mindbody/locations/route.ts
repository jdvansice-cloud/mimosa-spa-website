import { NextResponse } from 'next/server'
import { getLocations } from '@/lib/booking/mindbody'

// Custom location names (Mindbody might return different names)
const LOCATION_NAME_OVERRIDES: Record<number, string> = {
  1: 'Costa del Este',
  2: 'San Francisco',
}

// GET /api/mindbody/locations
export async function GET() {
  try {
    const locations = await getLocations()
    
    // Transform to our format with addresses and custom names
    const formattedLocations = locations.map(loc => ({
      Id: loc.Id,
      Name: LOCATION_NAME_OVERRIDES[loc.Id] || loc.Name,
      Address: loc.Address,
      Address2: loc.Address2 || null,
      City: loc.City,
      StateProvCode: loc.StateProvCode,
      PostalCode: loc.PostalCode,
      Phone: loc.Phone,
      // Full address string
      FullAddress: [loc.Address, loc.Address2, loc.City].filter(Boolean).join(', ')
    }))
    
    return NextResponse.json({ locations: formattedLocations })
    
  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json(
      { error: 'Failed to get locations' },
      { status: 500 }
    )
  }
}
