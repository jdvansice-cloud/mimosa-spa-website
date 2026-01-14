import { NextRequest, NextResponse } from 'next/server'
import { getStaff, getStaffWithAvailability } from '@/lib/booking/mindbody'
import { sanitizeError, ERROR_MESSAGES } from '@/lib/booking/constants'

// GET /api/mindbody/staff?locationId=1&sessionTypeIds=1,2,3
// Returns staff with availability for the given session types
// Uses GET /appointment/availabledates to check which staff have dates available
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
    let sessionTypeIds: number[] = []
    if (sessionTypeIdsParam) {
      sessionTypeIds = sessionTypeIdsParam
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))
    }

    console.log('Fetching staff for locationId:', parsedLocationId, 'sessionTypeIds:', sessionTypeIds)

    let staffMembers

    if (sessionTypeIds.length > 0) {
      // Get staff with availability for the next 30 days
      const today = new Date()
      const thirtyDaysLater = new Date(today)
      thirtyDaysLater.setDate(today.getDate() + 30)

      const startDate = today.toISOString().split('T')[0]
      const endDate = thirtyDaysLater.toISOString().split('T')[0]

      staffMembers = await getStaffWithAvailability({
        locationId: parsedLocationId,
        sessionTypeIds,
        startDate,
        endDate,
      })
    } else {
      // Fall back to all staff if no session types provided
      staffMembers = await getStaff(parsedLocationId)
    }

    console.log('Staff members found:', staffMembers.length)

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
