import { NextRequest, NextResponse } from 'next/server'
import { getStaff, getAvailableStaffForServices } from '@/lib/booking/mindbody'
import { sanitizeError, ERROR_MESSAGES } from '@/lib/booking/constants'

// GET /api/mindbody/staff?locationId=1&sessionTypeIds=1,2,3
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const sessionTypeIdsParam = searchParams.get('sessionTypeIds')

    // Validate locationId - required
    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId es requerido' },
        { status: 400 }
      )
    }

    const parsedLocationId = parseInt(locationId)
    if (isNaN(parsedLocationId)) {
      return NextResponse.json(
        { error: 'locationId debe ser un número válido' },
        { status: 400 }
      )
    }

    // Parse sessionTypeIds if provided
    let sessionTypeIds: number[] | undefined
    if (sessionTypeIdsParam) {
      sessionTypeIds = sessionTypeIdsParam
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))
    }

    // Get staff from Mindbody
    // If sessionTypeIds provided, use bookable items to find available staff
    // Otherwise, fall back to basic staff list
    let staffMembers
    if (sessionTypeIds && sessionTypeIds.length > 0) {
      staffMembers = await getAvailableStaffForServices({
        locationId: parsedLocationId,
        sessionTypeIds,
      })
    } else {
      staffMembers = await getStaff(parsedLocationId)
    }

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
