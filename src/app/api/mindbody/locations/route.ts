import { NextResponse } from 'next/server'
import { getLocations } from '@/lib/booking/mindbody'
import { sanitizeError, ERROR_MESSAGES } from '@/lib/booking/constants'

// Custom location names (Mindbody might return different names)
const LOCATION_NAME_OVERRIDES: Record<number, string> = {
  1: 'Costa del Este',
  2: 'San Francisco',
}

// GET /api/mindbody/locations
export async function GET() {
  try {
    const locations = await getLocations()

    // Validate API response
    if (!Array.isArray(locations)) {
      console.error('Invalid Mindbody response: locations is not an array')
      return NextResponse.json(
        { error: ERROR_MESSAGES.LOCATIONS_LOAD_FAILED },
        { status: 500 }
      )
    }

    // Transform to our format with addresses and custom names
    const formattedLocations = locations.map(loc => {
      // Validate required fields
      if (!loc.Id || !loc.Name) {
        console.warn('Location missing required fields:', loc)
      }

      return {
        Id: loc.Id,
        Name: LOCATION_NAME_OVERRIDES[loc.Id] || loc.Name,
        Address: loc.Address || '',
        Address2: loc.Address2 || null,
        City: loc.City || '',
        StateProvCode: loc.StateProvCode || '',
        PostalCode: loc.PostalCode || '',
        Phone: loc.Phone || '',
        // Full address string
        FullAddress: [loc.Address, loc.Address2, loc.City].filter(Boolean).join(', ')
      }
    })

    return NextResponse.json({ locations: formattedLocations })

  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
