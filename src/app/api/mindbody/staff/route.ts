import { NextRequest, NextResponse } from 'next/server'
import { getStaff } from '@/lib/booking/mindbody'
import { sanitizeError, ERROR_MESSAGES } from '@/lib/booking/constants'

// GET /api/mindbody/staff?locationId=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')

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

    // Get staff from Mindbody
    const staffMembers = await getStaff(parsedLocationId)

    // Validate API response
    if (!Array.isArray(staffMembers)) {
      console.error('Invalid Mindbody response: staffMembers is not an array')
      return NextResponse.json(
        { error: ERROR_MESSAGES.STAFF_LOAD_FAILED },
        { status: 500 }
      )
    }

    return NextResponse.json({
      staff: staffMembers,
      total: staffMembers.length
    })

  } catch (error) {
    console.error('Get staff error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
