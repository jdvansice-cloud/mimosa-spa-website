import { NextRequest, NextResponse } from 'next/server'
import { getBookableItems } from '@/lib/booking/mindbody'

// GET /api/mindbody/availability?locationId=1&serviceIds=1,2,3&staffId=1&startDate=2026-01-15&endDate=2026-01-29&duration=90
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const serviceIds = searchParams.get('serviceIds')
    const staffId = searchParams.get('staffId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const totalDuration = searchParams.get('duration') // Total duration needed in minutes
    
    if (!locationId || !serviceIds || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'locationId, serviceIds, startDate, and endDate are required' },
        { status: 400 }
      )
    }
    
    // Parse service IDs
    const serviceIdArray = serviceIds.split(',').map(id => parseInt(id))
    const duration = totalDuration ? parseInt(totalDuration) : 60
    
    // Get available items from Mindbody
    const availableItems = await getBookableItems({
      locationIds: parseInt(locationId),
      sessionTypeIds: serviceIdArray,
      staffIds: staffId ? parseInt(staffId) : undefined,
      startDate,
      endDate,
    })
    
    // Process available items into dates and time slots
    const dateMap = new Map<string, {
      date: string
      slots: Array<{
        time: string
        displayTime: string
        staffId: number
        staffName: string
        available: boolean
      }>
    }>()
    
    for (const item of availableItems) {
      const dateTime = new Date(item.StartDateTime)
      const dateKey = dateTime.toISOString().split('T')[0]
      const timeKey = dateTime.toTimeString().slice(0, 5) // "09:00"
      
      // Calculate end time to ensure slot fits duration
      const endTime = new Date(item.EndDateTime)
      const slotDuration = (endTime.getTime() - dateTime.getTime()) / (1000 * 60)
      
      // Only include slots that can fit the total duration
      if (slotDuration < duration) continue
      
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          slots: []
        })
      }
      
      const dateEntry = dateMap.get(dateKey)!
      
      // Check if time slot already exists
      const existingSlot = dateEntry.slots.find(s => s.time === timeKey)
      if (!existingSlot) {
        dateEntry.slots.push({
          time: timeKey,
          displayTime: formatTime(timeKey),
          staffId: item.Staff.Id,
          staffName: `${item.Staff.FirstName} ${item.Staff.LastName}`,
          available: true
        })
      }
    }
    
    // Convert to array and sort
    const availableDates = Array.from(dateMap.values())
      .map(d => ({
        date: d.date,
        displayDate: formatDate(d.date),
        hasAvailability: d.slots.length > 0,
        slotsCount: d.slots.length,
        slots: d.slots.sort((a, b) => a.time.localeCompare(b.time))
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return NextResponse.json({
      availableDates,
      totalDates: availableDates.length,
      requestedDuration: duration
    })
    
  } catch (error) {
    console.error('Get availability error:', error)
    return NextResponse.json(
      { error: 'Failed to get availability' },
      { status: 500 }
    )
  }
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
