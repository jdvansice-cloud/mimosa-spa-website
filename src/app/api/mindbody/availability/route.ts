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

    // Debug info collected during processing
    let staffDebugInfo: Array<{
      name: string
      id: number
      workingHours: string[]
      appointments: string[]
      freeBlocks: string[]
    }> = []

    // First, get all staff for this location - we need this to fetch unavailability data
    const allStaff = await getStaff(parsedLocationId)
    const validStaffIds = allStaff
      .filter(s => s.Id > 0 && s.AppointmentTrn !== false)
      .map(s => s.Id)

    console.log('Found', validStaffIds.length, 'valid staff members at location')

    // Primary approach: Build availability from schedule items
    // This gives us full availability windows (staff working hours minus appointments/blocks)
    // which is more comprehensive than getBookableItems (which returns limited pre-computed slots)
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

        // Debug: collect per-staff info for response
        const staffDebugInfoLocal: Array<{
          name: string
          id: number
          workingHours: string[]
          appointments: string[]
          freeBlocks: string[]
        }> = []

        // Build blocked periods AND availability from schedule items in one pass
        for (const staff of scheduleItems) {
          const blockedPeriods: { start: Date; end: Date }[] = []
          const debugAppts: string[] = []

          // Get unavailable periods (like "Reparaciones")
          if (staff.UnavailableItems && staff.UnavailableItems.length > 0) {
            for (const unavail of staff.UnavailableItems) {
              if (unavail.StartDateTime && unavail.EndDateTime) {
                blockedPeriods.push({
                  start: new Date(unavail.StartDateTime),
                  end: new Date(unavail.EndDateTime)
                })
                debugAppts.push(`[BLOCKED] ${unavail.StartDateTime} - ${unavail.EndDateTime}`)
              }
            }
          }

          // Get existing appointments
          if (staff.Appointments && staff.Appointments.length > 0) {
            for (const appt of staff.Appointments) {
              if (appt.StartDateTime && appt.EndDateTime && appt.Status !== 'Cancelled') {
                blockedPeriods.push({
                  start: new Date(appt.StartDateTime),
                  end: new Date(appt.EndDateTime)
                })
                debugAppts.push(`[APPT] ${appt.StartDateTime} - ${appt.EndDateTime}`)
              }
            }
          }

          if (blockedPeriods.length > 0) {
            staffBlockedPeriods.set(staff.Id, blockedPeriods)
          }

          const debugWorkingHours: string[] = []
          const debugFreeBlocks: string[] = []

          // Build availability: take working hours and subtract blocked periods
          if (staff.Availabilities && staff.Availabilities.length > 0) {
            console.log(`Staff ${staff.FirstName} ${staff.LastName}: ${staff.Availabilities.length} availability blocks, ${blockedPeriods.length} blocked periods`)

            for (const avail of staff.Availabilities) {
              if (!avail.StartDateTime || !avail.EndDateTime) continue

              const availStart = new Date(avail.StartDateTime)
              // Prefer BookableEndDateTime if it is valid and after StartDateTime.
              // Mindbody sometimes returns a sentinel value (e.g. "0001-01-01T00:00:00")
              // for BookableEndDateTime when the field isn't applicable; using that
              // as the end would produce a negative-duration block that wipes out all
              // effective slots via subtractBlockedPeriods.
              const bookableEndCandidate = avail.BookableEndDateTime ? new Date(avail.BookableEndDateTime) : null
              const availEnd = (bookableEndCandidate && !isNaN(bookableEndCandidate.getTime()) && bookableEndCandidate > availStart)
                ? bookableEndCandidate
                : new Date(avail.EndDateTime)
              const effectiveEndLabel = (bookableEndCandidate && !isNaN(bookableEndCandidate.getTime()) && bookableEndCandidate > availStart)
                ? avail.BookableEndDateTime!
                : avail.EndDateTime
              debugWorkingHours.push(`${avail.StartDateTime} - ${effectiveEndLabel}`)

              // Subtract blocked periods from this availability block
              const effectiveBlocks = subtractBlockedPeriods(
                { start: availStart, end: availEnd },
                blockedPeriods
              )

              for (const block of effectiveBlocks) {
                const blockMinutes = Math.round((block.end.getTime() - block.start.getTime()) / 60000)
                debugFreeBlocks.push(`${block.start.toISOString()} - ${block.end.toISOString()} (${blockMinutes} min)`)

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

          staffDebugInfoLocal.push({
            name: `${staff.FirstName} ${staff.LastName}`,
            id: staff.Id,
            workingHours: debugWorkingHours,
            appointments: debugAppts,
            freeBlocks: debugFreeBlocks,
          })
        }

        console.log('Schedule-based availability:', availableItems.length, 'effective blocks')
        // Store for response
        staffDebugInfo = staffDebugInfo.concat(staffDebugInfoLocal)
      } catch (err) {
        console.error('Error fetching schedule items:', err)
      }
    }

    // Fallback: try getBookableItems if schedule items gave no results
    if (availableItems.length === 0 && serviceIdArray.length > 0) {
      console.log('=== SCHEDULE ITEMS EMPTY - TRYING BOOKABLE ITEMS ===')
      try {
        // Pass only the first session type ID. Mindbody's bookableitems endpoint
        // interprets multiple sessionTypeIds as "must satisfy ALL simultaneously",
        // which returns 0 results for multi-service bookings. We only need it to
        // identify available staff windows; duration filtering happens in slot generation.
        const rawBookableItems = await getBookableItems({
          locationIds: parsedLocationId,
          sessionTypeIds: [serviceIdArray[0]],
          startDate,
          endDate,
        })
        console.log('Bookable items returned:', rawBookableItems.length)

        for (const item of rawBookableItems) {
          if (!item.Staff?.Id || !item.StartDateTime || !item.EndDateTime) continue

          const itemStart = new Date(item.StartDateTime)
          const itemEnd = new Date(item.EndDateTime)
          const blockedPeriods = staffBlockedPeriods.get(item.Staff.Id) || []

          let isBlocked = false
          for (const blocked of blockedPeriods) {
            if (!(itemEnd <= blocked.start || itemStart >= blocked.end)) {
              isBlocked = true
              break
            }
          }

          if (!isBlocked) {
            availableItems.push(item)
          }
        }

        console.log('After filtering:', availableItems.length, 'bookable items')
      } catch (error) {
        console.error('Error fetching bookable items:', error)
      }
    }

    // Last fallback: try staff appointment availability
    if (availableItems.length === 0) {
      console.log('=== TRYING STAFF APPOINTMENT AVAILABILITY ===')
      try {
        const staffAvailability = await getStaffAppointmentAvailability({
          locationId: parsedLocationId,
          staffIds: validStaffIds.length > 0 ? validStaffIds : undefined,
          startDateTime: `${startDate}T00:00:00`,
          endDateTime: `${endDate}T23:59:59`,
        })

        for (const staff of staffAvailability) {
          if (staff.Availabilities && staff.Availabilities.length > 0) {
            const blockedPeriods = staffBlockedPeriods.get(staff.Id) || []

            for (const avail of staff.Availabilities) {
              const availStart = new Date(avail.StartDateTime)
              const availEnd = new Date(avail.BookableEndDateTime || avail.EndDateTime)

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

        console.log('Staff appointment availability:', availableItems.length, 'items')
      } catch (err) {
        console.error('Error fetching staff availability:', err)
      }
    }

    if (availableItems.length === 0) {
      console.log('=== NO AVAILABILITY FOUND ===')
    } else {
      console.log('=== AVAILABILITY FOUND:', availableItems.length, 'effective blocks ===')
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
      const now = new Date()
      const panamaOffset = -5 * 60 // Panama is UTC-5
      const localOffset = now.getTimezoneOffset()
      const panamaTime = new Date(now.getTime() + (localOffset + panamaOffset) * 60 * 1000)
      const minimumBookingTime = panamaTime // No buffer - show all future slots

      console.log(`Current Panama time: ${panamaTime.toISOString()}, minimum booking time: ${minimumBookingTime.toISOString()}`)

      // Round dayStart down to nearest 30 minutes
      const slotStart = new Date(dayStart)
      slotStart.setMinutes(Math.floor(slotStart.getMinutes() / 30) * 30, 0, 0)

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
          currentSlot.setMinutes(currentSlot.getMinutes() + 30)
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

        // Move to next 30-minute slot
        currentSlot.setMinutes(currentSlot.getMinutes() + 30)
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
        staffAvailability: staffDebugInfo,
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
