import { NextRequest, NextResponse } from 'next/server'
import { getSessionTypes, getStaff, getBookableItems, getAvailableDates, getStaffAppointmentAvailability } from '@/lib/booking/mindbody'

// GET /api/mindbody/debug?locationId=1
// Debug endpoint to test Mindbody API responses directly
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId') || '1'
    const parsedLocationId = parseInt(locationId)

    // Get date range (next 14 days)
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    console.log('=== DEBUG API ===')
    console.log('Location ID:', parsedLocationId)
    console.log('Date range:', startDateStr, 'to', endDateStr)

    // Test 1: Get session types
    console.log('\n=== TEST 1: Session Types ===')
    const sessionTypes = await getSessionTypes(true)
    console.log('Online session types:', sessionTypes.length)
    const sessionTypeSummary = sessionTypes.slice(0, 10).map(st => ({
      Id: st.Id,
      Name: st.Name,
      Duration: st.DefaultTimeLength,
      ProgramId: st.ProgramId
    }))

    // Test 2: Get staff
    console.log('\n=== TEST 2: Staff ===')
    const staff = await getStaff(parsedLocationId)
    console.log('Staff at location:', staff.length)
    const staffSummary = staff.map(s => ({
      Id: s.Id,
      Name: s.DisplayName
    }))

    // Test 3: Get bookable items using the helper function (which now uses array format)
    console.log('\n=== TEST 3: Bookable Items (no session filter) ===')
    const allBookable = await getBookableItems({
      locationIds: parsedLocationId,
      startDate: startDateStr,
      endDate: endDateStr,
    })
    console.log('All bookable items:', allBookable.length)

    // Extract unique session types from bookable items
    const bookableSessionTypes = new Set<string>()
    const bookableStaffIds = new Set<number>()
    for (const item of allBookable) {
      if (item.SessionType) {
        bookableSessionTypes.add(`${item.SessionType.Id}: ${item.SessionType.Name}`)
      }
      if (item.Staff) {
        bookableStaffIds.add(item.Staff.Id)
      }
    }

    // Test 4: Try with a specific session type if we found any
    let filteredBookable: typeof allBookable = []
    let testedSessionTypeId: number | null = null

    if (sessionTypes.length > 0) {
      testedSessionTypeId = sessionTypes[0].Id
      console.log('\n=== TEST 4: Bookable Items (with session type', testedSessionTypeId, ') ===')

      filteredBookable = await getBookableItems({
        locationIds: parsedLocationId,
        sessionTypeIds: [testedSessionTypeId],
        startDate: startDateStr,
        endDate: endDateStr,
      })
      console.log('Filtered bookable items:', filteredBookable.length)
    }

    // Test 5: Try available dates endpoint
    console.log('\n=== TEST 5: Available Dates ===')
    let availableDates: string[] = []
    if (sessionTypes.length > 0) {
      try {
        availableDates = await getAvailableDates({
          locationId: parsedLocationId,
          sessionTypeIds: sessionTypes.slice(0, 3).map(st => st.Id),
          startDate: startDateStr,
          endDate: endDateStr,
        })
        console.log('Available dates:', availableDates.length)
      } catch (e) {
        console.log('Available dates error:', e)
      }
    }

    // Test 6: Try staff appointment availability endpoint
    console.log('\n=== TEST 6: Staff Appointment Availability ===')
    let staffAvailability: Array<{
      Id: number
      FirstName: string
      LastName: string
      Availabilities: Array<{
        StartDateTime: string
        EndDateTime: string
        BookableEndDateTime: string
      }>
    }> = []
    try {
      staffAvailability = await getStaffAppointmentAvailability({
        locationId: parsedLocationId,
        startDateTime: `${startDateStr}T00:00:00`,
        endDateTime: `${endDateStr}T23:59:59`,
      })
      console.log('Staff with availability:', staffAvailability.length)
      if (staffAvailability.length > 0) {
        console.log('Sample staff availability:', JSON.stringify(staffAvailability[0], null, 2))
      }
    } catch (e) {
      console.log('Staff availability error:', e)
    }

    return NextResponse.json({
      locationId: parsedLocationId,
      dateRange: { start: startDateStr, end: endDateStr },
      sessionTypes: {
        total: sessionTypes.length,
        sample: sessionTypeSummary,
      },
      staff: {
        total: staff.length,
        list: staffSummary,
      },
      bookableItems: {
        totalWithoutFilter: allBookable.length,
        uniqueSessionTypes: Array.from(bookableSessionTypes),
        uniqueStaffIds: Array.from(bookableStaffIds),
        filteredCount: filteredBookable.length,
        testedSessionTypeId,
      },
      availableDates: {
        total: availableDates.length,
        dates: availableDates.slice(0, 10),
      },
      staffAvailability: {
        total: staffAvailability.length,
        staff: staffAvailability.map(s => ({
          Id: s.Id,
          Name: `${s.FirstName} ${s.LastName}`,
          availabilityCount: s.Availabilities?.length || 0,
          sampleAvailability: s.Availabilities?.[0] || null,
        })),
      },
      sampleBookableItem: allBookable[0] || null,
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
