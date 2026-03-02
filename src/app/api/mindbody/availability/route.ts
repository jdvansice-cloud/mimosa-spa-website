import { NextRequest, NextResponse } from 'next/server'
import { getBookableItems, getStaffAppointmentAvailability, getScheduleItems, getStaff } from '@/lib/booking/mindbody'
import { sanitizeError, ERROR_MESSAGES } from '@/lib/booking/constants'

// GET /api/mindbody/availability?locationId=1&serviceIds=1,2,3&startDate=2026-01-15&endDate=2026-01-29&duration=90
// Returns available time slots in 15-min increments where at least one therapist
// has continuous availability for the total treatment duration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const serviceIds = searchParams.get('serviceIds')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const totalDuration = searchParams.get('duration') // Total duration needed in minutes

    // Validate required parameters
    if (!locationId || !serviceIds || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: locationId, serviceIds, startDate, endDate' },
        { status: 400 }
      )
    }

    // Validate locationId is a number
    const parsedLocationId = parseInt(locationId)
    if (isNaN(parsedLocationId)) {
      return NextResponse.json(
        { error: 'locationId debe ser un número válido' },
        { status: 400 }
      )
    }

    // Validate date formats (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Las fechas deben estar en formato YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Parse service IDs and validate
    const serviceIdArray = serviceIds.split(',').map(id => parseInt(id.trim()))
    if (serviceIdArray.some(isNaN)) {
      return NextResponse.json(
        { error: 'serviceIds deben ser números válidos separados por comas' },
        { status: 400 }
      )
    }

    const duration = totalDuration ? parseInt(totalDuration) : 60

    console.log('=== AVAILABILITY REQUEST ===')
    console.log('Location ID:', parsedLocationId)
    console.log('Session Type IDs:', serviceIdArray)
    console.log('Date range:', startDate, 'to', endDate)
    console.log('Required duration:', duration, 'minutes')

    // Get available items from Mindbody
    // Note: /appointment/bookableitems REQUIRES sessionTypeIds parameter
    let availableItems: Array<{
      Id: number
      StartDateTime: string
      EndDateTime: string
      Staff: { Id: number; FirstName: string; LastName: string }
      Location: { Id: number; Name: string }
      SessionType: { Id: number; Name: string }
    }> = []

    // First, get all staff for this location - we need this to fetch unavailability data
    const allStaff = await getStaff(parsedLocationId)
    const validStaffIds = allStaff
      .filter(s => s.Id > 0 && s.AppointmentTrn !== false)
      .map(s => s.Id)

    console.log('Found', validStaffIds.length, 'valid staff members at location')

    // Fetch schedule items to get unavailability and appointment data
    // We need this regardless of which availability source we use
    let staffBlockedPeriods = new Map<number, { start: Date; end: Date }[]>()

    if (validStaffIds.length > 0) {
      try {
        const scheduleItems = await getScheduleItems({
          locationIds: [parsedLocationId],
          staffIds: validStaffIds,
          startDate,
          endDate,
        })

        console.log('Schedule items returned:', scheduleItems.length, 'staff members')

        // Build blocked periods map for each staff member
        for (const staff of scheduleItems) {
          const blockedPeriods: { start: Date; end: Date }[] = []

          // Get unavailable periods (like "Reparaciones")
          if (staff.UnavailableItems && staff.UnavailableItems.length > 0) {
            console.log(`Staff ${staff.FirstName} ${staff.LastName} has ${staff.UnavailableItems.length} unavailable periods`)
            for (const unavail of staff.UnavailableItems) {
              if (unavail.StartDateTime && unavail.EndDateTime) {
                blockedPeriods.push({
                  start: new Date(unavail.StartDateTime),
                  end: new Date(unavail.EndDateTime)
                })
              }
            }
          }

          // Get existing appointments
          if (staff.Appointments && staff.Appointments.length > 0) {
            console.log(`Staff ${staff.FirstName} ${staff.LastName} has ${staff.Appointments.length} existing appointments`)
            for (const appt of staff.Appointments) {
              if (appt.StartDateTime && appt.EndDateTime && appt.Status !== 'Cancelled') {
                blockedPeriods.push({
                  start: new Date(appt.StartDateTime),
                  end: new Date(appt.EndDateTime)
                })
              }
            }
          }

          if (blockedPeriods.length > 0) {
            staffBlockedPeriods.set(staff.Id, blockedPeriods)
          }
        }

        console.log('Built blocked periods for', staffBlockedPeriods.size, 'staff members')
      } catch (err) {
        console.error('Error fetching schedule items for blocked periods:', err)
      }
    }

    // Only try bookableitems if we have session type IDs
    if (serviceIdArray.length > 0) {
      try {
        console.log('Fetching bookable items with session types:', serviceIdArray)
        const rawBookableItems = await getBookableItems({
          locationIds: parsedLocationId,
          sessionTypeIds: serviceIdArray,
          startDate,
          endDate,
        })
        console.log('Bookable items returned:', rawBookableItems.length)

        // Filter bookable items against blocked periods
        for (const item of rawBookableItems) {
          if (!item.Staff?.Id || !item.StartDateTime || !item.EndDateTime) {
            continue
          }

          const itemStart = new Date(item.StartDateTime)
          const itemEnd = new Date(item.EndDateTime)
          const staffId = item.Staff.Id
          const blockedPeriods = staffBlockedPeriods.get(staffId) || []

          // Check if this time slot overlaps with any blocked period
          let isBlocked = false
          for (const blocked of blockedPeriods) {
            // Overlap check: NOT (itemEnd <= blocked.start OR itemStart >= blocked.end)
            if (!(itemEnd <= blocked.start || itemStart >= blocked.end)) {
              isBlocked = true
              console.log(`Filtering out slot for staff ${staffId} at ${item.StartDateTime} - overlaps with blocked period`)
              break
            }
          }

          if (!isBlocked) {
            availableItems.push(item)
          }
        }

        console.log('After filtering blocked periods:', availableItems.length, 'items remain')
      } catch (error) {
        console.error('Error fetching bookable items:', error)
      }
    } else {
      console.log('No session type IDs provided - skipping bookableitems endpoint')
    }

    // If bookable items returns empty, try building availability from schedule items
    // We already have the schedule data from above, so we can reuse it
    if (availableItems.length === 0 && validStaffIds.length > 0) {
      console.log('=== BOOKABLE ITEMS EMPTY - BUILDING FROM SCHEDULE ITEMS ===')

      try {
        // Fetch schedule items again to get the availability blocks
        // (we only stored blocked periods above, not the full availability)
        const scheduleItems = await getScheduleItems({
          locationIds: [parsedLocationId],
          staffIds: validStaffIds,
          startDate,
          endDate,
        })

        console.log('Schedule items returned:', scheduleItems.length, 'staff members')

        // Convert schedule availabilities to the same format as bookable items
        for (const staff of scheduleItems) {
          if (staff.Availabilities && staff.Availabilities.length > 0) {
            console.log(`Staff ${staff.FirstName} ${staff.LastName} has ${staff.Availabilities.length} availability blocks`)

            // Get blocked periods from our pre-built map
            const blockedPeriods = staffBlockedPeriods.get(staff.Id) || []

            for (const avail of staff.Availabilities) {
              const endDateTime = avail.EndDateTime

              if (!avail.StartDateTime || !endDateTime) continue

              const availStart = new Date(avail.StartDateTime)
              const availEnd = new Date(endDateTime)

              // Subtract blocked periods from this availability block
              const effectiveBlocks = subtractBlockedPeriods(
                { start: availStart, end: availEnd },
                blockedPeriods
              )

              // Add each effective block as an available item
              for (const block of effectiveBlocks) {
                availableItems.push({
                  Id: avail.Id || 0,
                  StartDateTime: block.start.toISOString(),
                  EndDateTime: block.end.toISOString(),
                  Staff: {
                    Id: staff.Id,
                    FirstName: staff.FirstName,
                    LastName: staff.LastName,
                  },
                  Location: {
                    Id: parsedLocationId,
                    Name: 'Location',
                  },
                  SessionType: {
                    Id: serviceIdArray[0] || 0,
                    Name: 'Service',
                  },
                })
              }
            }
          }
        }

        console.log('Converted schedule items to', availableItems.length, 'availability items')
      } catch (err) {
        console.error('Error fetching schedule items:', err)
      }
    }

    // If still empty, try staff appointment availability as second fallback
    if (availableItems.length === 0) {
      console.log('=== SCHEDULE ITEMS EMPTY - TRYING STAFF APPOINTMENT AVAILABILITY ===')

      try {
        const staffAvailability = await getStaffAppointmentAvailability({
          locationId: parsedLocationId,
          staffIds: validStaffIds.length > 0 ? validStaffIds : undefined,
          startDateTime: `${startDate}T00:00:00`,
          endDateTime: `${endDate}T23:59:59`,
        })

        console.log('Staff availability returned:', staffAvailability.length, 'staff members')

        // Convert staff availability to the same format as bookable items
        // Also filter against blocked periods
        for (const staff of staffAvailability) {
          if (staff.Availabilities && staff.Availabilities.length > 0) {
            const blockedPeriods = staffBlockedPeriods.get(staff.Id) || []

            for (const avail of staff.Availabilities) {
              const availStart = new Date(avail.StartDateTime)
              const availEnd = new Date(avail.BookableEndDateTime || avail.EndDateTime)

              // Subtract blocked periods
              const effectiveBlocks = subtractBlockedPeriods(
                { start: availStart, end: availEnd },
                blockedPeriods
              )

              for (const block of effectiveBlocks) {
                availableItems.push({
                  Id: 0,
                  StartDateTime: block.start.toISOString(),
                  EndDateTime: block.end.toISOString(),
                  Staff: {
                    Id: staff.Id,
                    FirstName: staff.FirstName,
                    LastName: staff.LastName,
                  },
                  Location: {
                    Id: parsedLocationId,
                    Name: 'Location',
                  },
                  SessionType: {
                    Id: serviceIdArray[0] || 0,
                    Name: 'Service',
                  },
                })
              }
            }
          }
        }

        console.log('Converted staff availability to', availableItems.length, 'items')
      } catch (err) {
        console.error('Error fetching staff availability:', err)
      }
    }

    // If still no items found, log helpful debug info
    if (availableItems.length === 0) {
      console.log('=== NO AVAILABILITY FOUND ===')
      console.log('This could mean:')
      console.log('1. No staff scheduled for these session types')
      console.log('2. Session type IDs do not exist or are not bookable online')
      console.log('3. Location ID is incorrect')
      console.log('4. Staff schedules not configured in Mindbody')
      console.log('Requested session type IDs:', serviceIdArray)
    } else {
      // Log sample of what was found
      console.log('=== AVAILABILITY FOUND ===')
      console.log('Total items:', availableItems.length)
      if (availableItems[0]) {
        console.log('Sample item:', JSON.stringify(availableItems[0], null, 2))
      }
    }

    // Validate API response
    if (!Array.isArray(availableItems)) {
      console.error('Invalid Mindbody response: availableItems is not an array')
      return NextResponse.json(
        { error: ERROR_MESSAGES.NO_AVAILABILITY },
        { status: 500 }
      )
    }

    console.log('Total bookable items from Mindbody:', availableItems.length)

    // Group availability by date -> staff -> time blocks
    // We need to find continuous time blocks for each staff member
    const staffAvailabilityByDate = new Map<string, Map<number, {
      staffId: number
      staffName: string
      blocks: { start: Date; end: Date }[]
    }>>()

    for (const item of availableItems) {
      if (!item.StartDateTime || !item.EndDateTime || !item.Staff) {
        continue
      }

      const startDT = new Date(item.StartDateTime)
      const endDT = new Date(item.EndDateTime)

      if (isNaN(startDT.getTime()) || isNaN(endDT.getTime())) {
        continue
      }

      const dateKey = startDT.toISOString().split('T')[0]

      if (!staffAvailabilityByDate.has(dateKey)) {
        staffAvailabilityByDate.set(dateKey, new Map())
      }

      const staffMap = staffAvailabilityByDate.get(dateKey)!

      if (!staffMap.has(item.Staff.Id)) {
        staffMap.set(item.Staff.Id, {
          staffId: item.Staff.Id,
          staffName: `${item.Staff.FirstName} ${item.Staff.LastName}`,
          blocks: []
        })
      }

      staffMap.get(item.Staff.Id)!.blocks.push({
        start: startDT,
        end: endDT
      })
    }

    // Process each date to generate 15-minute time slots
    const availableDates: Array<{
      date: string
      displayDate: string
      hasAvailability: boolean
      slotsCount: number
      slots: Array<{
        time: string
        displayTime: string
        available: boolean
        availableStaffIds: number[]
      }>
    }> = []

    for (const [dateKey, staffMap] of staffAvailabilityByDate.entries()) {
      // Merge overlapping/adjacent blocks for each staff
      const staffWithMergedBlocks = new Map<number, {
        staffId: number
        staffName: string
        blocks: { start: Date; end: Date }[]
      }>()

      for (const [staffId, staffData] of staffMap.entries()) {
        const mergedBlocks = mergeTimeBlocks(staffData.blocks)
        staffWithMergedBlocks.set(staffId, {
          ...staffData,
          blocks: mergedBlocks
        })
      }

      // Find the earliest and latest times across all staff
      let dayStart: Date | null = null
      let dayEnd: Date | null = null

      for (const staffData of staffWithMergedBlocks.values()) {
        for (const block of staffData.blocks) {
          if (!dayStart || block.start < dayStart) dayStart = block.start
          if (!dayEnd || block.end > dayEnd) dayEnd = block.end
        }
      }

      if (!dayStart || !dayEnd) continue

      // Generate 15-minute slots
      const slots: Array<{
        time: string
        displayTime: string
        available: boolean
        availableStaffIds: number[]
      }> = []

      // Get current time in Panama timezone (UTC-5)
      // Add 30-minute buffer so users don't book slots that are about to start (keep 30 min buffer)
      const now = new Date()
      const panamaOffset = -5 * 60 // Panama is UTC-5
      const localOffset = now.getTimezoneOffset()
      const panamaTime = new Date(now.getTime() + (localOffset + panamaOffset) * 60 * 1000)
      const minimumBookingTime = new Date(panamaTime.getTime() + 30 * 60 * 1000) // 30 min buffer

      console.log(`Current Panama time: ${panamaTime.toISOString()}, minimum booking time: ${minimumBookingTime.toISOString()}`)

      // Round dayStart down to nearest 15 minutes
      const slotStart = new Date(dayStart)
      slotStart.setMinutes(Math.floor(slotStart.getMinutes() / 15) * 15, 0, 0)

      const currentSlot = new Date(slotStart)

      while (currentSlot < dayEnd) {
        const slotTime = currentSlot.toTimeString().slice(0, 5) // "09:00"
        const slotEnd = new Date(currentSlot.getTime() + duration * 60 * 1000)

        // Skip slots that are in the past or too soon to book
        // Compare just the datetime portion for same-day bookings
        const slotDateStr = currentSlot.toISOString().split('T')[0]
        const todayStr = panamaTime.toISOString().split('T')[0]

        if (slotDateStr === todayStr && currentSlot < minimumBookingTime) {
          // This slot is today and has already passed (or too soon)
          currentSlot.setMinutes(currentSlot.getMinutes() + 15)
          continue
        }

        // Check which staff can accommodate this slot with the full duration
        const availableStaffIds: number[] = []

        for (const [staffId, staffData] of staffWithMergedBlocks.entries()) {
          // Check if any block can fit the entire duration starting at this time
          for (const block of staffData.blocks) {
            if (currentSlot >= block.start && slotEnd <= block.end) {
              availableStaffIds.push(staffId)
              break
            }
          }
        }

        // Only add slot if at least one staff member is available
        if (availableStaffIds.length > 0) {
          slots.push({
            time: slotTime,
            displayTime: formatTime(slotTime),
            available: true,
            availableStaffIds
          })
        }

        // Move to next 15-minute slot
        currentSlot.setMinutes(currentSlot.getMinutes() + 15)
      }

      if (slots.length > 0) {
        availableDates.push({
          date: dateKey,
          displayDate: formatDate(dateKey),
          hasAvailability: true,
          slotsCount: slots.length,
          slots: slots.sort((a, b) => a.time.localeCompare(b.time))
        })
      }
    }

    // Sort dates
    availableDates.sort((a, b) => a.date.localeCompare(b.date))

    console.log('Available dates found:', availableDates.length)

    return NextResponse.json({
      availableDates,
      totalDates: availableDates.length,
      requestedDuration: duration,
      // Debug info
      debug: {
        requestedSessionTypeIds: serviceIdArray,
        locationId: parsedLocationId,
        rawItemsCount: availableItems.length,
      }
    })

  } catch (error) {
    console.error('Get availability error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}

// Merge overlapping or adjacent time blocks
function mergeTimeBlocks(blocks: { start: Date; end: Date }[]): { start: Date; end: Date }[] {
  if (blocks.length === 0) return []

  // Sort by start time
  const sorted = [...blocks].sort((a, b) => a.start.getTime() - b.start.getTime())

  const merged: { start: Date; end: Date }[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    const last = merged[merged.length - 1]

    // If current block overlaps or is adjacent to last block, merge them
    if (current.start.getTime() <= last.end.getTime()) {
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()))
    } else {
      merged.push(current)
    }
  }

  return merged
}

// Subtract blocked periods (unavailability, appointments) from an availability block
// Returns an array of remaining available time blocks
function subtractBlockedPeriods(
  availability: { start: Date; end: Date },
  blockedPeriods: { start: Date; end: Date }[]
): { start: Date; end: Date }[] {
  if (blockedPeriods.length === 0) {
    return [availability]
  }

  // Sort blocked periods by start time
  const sortedBlocked = [...blockedPeriods].sort((a, b) => a.start.getTime() - b.start.getTime())

  let remainingBlocks: { start: Date; end: Date }[] = [{ ...availability }]

  for (const blocked of sortedBlocked) {
    const newBlocks: { start: Date; end: Date }[] = []

    for (const block of remainingBlocks) {
      // Check if blocked period overlaps with this block
      if (blocked.end <= block.start || blocked.start >= block.end) {
        // No overlap - keep block as is
        newBlocks.push(block)
      } else {
        // There is overlap - split the block

        // Part before blocked period
        if (blocked.start > block.start) {
          newBlocks.push({
            start: block.start,
            end: new Date(Math.min(blocked.start.getTime(), block.end.getTime()))
          })
        }

        // Part after blocked period
        if (blocked.end < block.end) {
          newBlocks.push({
            start: new Date(Math.max(blocked.end.getTime(), block.start.getTime())),
            end: block.end
          })
        }
      }
    }

    remainingBlocks = newBlocks
  }

  // Filter out any blocks that are too small (less than 15 minutes)
  return remainingBlocks.filter(block =>
    (block.end.getTime() - block.start.getTime()) >= 15 * 60 * 1000
  )
}

// Helper: Format time to display format
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Helper: Format date to Spanish display format
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`
}
