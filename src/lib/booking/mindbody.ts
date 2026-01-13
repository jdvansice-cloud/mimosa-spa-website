import type {
  SaleServicesResponse,
  ProgramsResponse,
  StaffResponse,
  LocationsResponse,
  ClientsResponse,
  BookableItemsResponse,
  MindbodyService,
  MindbodyProgram,
  MindbodyStaff,
  MindbodyLocation,
  MindbodyClient,
  MindbodyAvailability,
  ServiceCategory,
} from '@/types/booking'

const MINDBODY_BASE_URL = 'https://api.mindbodyonline.com/public/v6'
const MINDBODY_API_KEY = process.env.MINDBODY_API_KEY || ''
const MINDBODY_SITE_ID = process.env.MINDBODY_SITE_ID || '-41931'

// ITBM tax rate (7%) - Mindbody prices INCLUDE tax, we need to show WITHOUT tax
const ITBM_RATE = 0.07

// Remove ITBM from price (Mindbody prices include tax)
function removeTaxFromPrice(priceWithTax: number): number {
  // Price without tax = Price with tax / (1 + tax rate)
  // Round to nearest dollar for cleaner display
  return Math.round(priceWithTax / (1 + ITBM_RATE))
}

// Staff user token - you'll need to implement token management
let staffToken: string | null = null
let tokenExpiry: Date | null = null

async function getStaffToken(): Promise<string> {
  // Check if we have a valid token
  if (staffToken && tokenExpiry && new Date() < tokenExpiry) {
    return staffToken
  }

  // For now, we'll use the API without a staff token for public endpoints
  // In production, you'll need to implement token management
  return ''
}

interface MindbodyRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, string | number | boolean | undefined>
  body?: object
}

async function mindbodyRequest<T>(
  endpoint: string,
  options: MindbodyRequestOptions = {}
): Promise<T> {
  const { method = 'GET', params, body } = options
  
  const token = await getStaffToken()
  
  // Build URL with query params
  const url = new URL(`${MINDBODY_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Api-Key': MINDBODY_API_KEY,
    'SiteId': MINDBODY_SITE_ID,
  }

  if (token) {
    headers['Authorization'] = token
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Mindbody API error: ${response.status} - ${errorText}`)
    throw new Error(`Mindbody API error: ${response.status}`)
  }

  return response.json()
}

// ============================================
// Get locations
// ============================================
export async function getLocations(): Promise<MindbodyLocation[]> {
  const response = await mindbodyRequest<LocationsResponse>('/site/locations')
  return response.Locations || []
}

// ============================================
// Get programs (categories)
// ============================================
export async function getPrograms(): Promise<MindbodyProgram[]> {
  const response = await mindbodyRequest<ProgramsResponse>('/site/programs', {
    params: {
      onlineOnly: true,
    }
  })
  return response.Programs || []
}

// ============================================
// Get services with online booking filter and ITBM removed from prices
// ============================================
export async function getServices(locationId?: number): Promise<MindbodyService[]> {
  const response = await mindbodyRequest<SaleServicesResponse>('/sale/services', {
    params: {
      limit: 200,
      sellOnline: true, // Only get services enabled for online booking
      ...(locationId ? { locationId: locationId } : {})
    }
  })
  
  const allServices = response.Services || []
  console.log('Total services from Mindbody:', allServices.length)
  
  // Filter for:
  // 1. SellOnline === true (MUST be enabled for online booking)
  // 2. Single session only (Count = 1)
  // 3. Has a valid price
  const filteredServices = allServices.filter(service => {
    const isOnlineBookable = service.SellOnline === true
    const isSingleSession = !service.Count || service.Count === 1
    const hasValidPrice = service.Price > 0
    
    return isOnlineBookable && isSingleSession && hasValidPrice
  })

  console.log('Filtered services (online bookable):', filteredServices.length)

  // CRITICAL: Remove ITBM from prices
  // Mindbody prices INCLUDE the 7% tax, we show prices WITHOUT tax
  const servicesWithoutTax = filteredServices.map(service => ({
    ...service,
    Price: removeTaxFromPrice(service.Price),
    OnlinePrice: service.OnlinePrice ? removeTaxFromPrice(service.OnlinePrice) : 0,
  }))

  return servicesWithoutTax
}

// ============================================
// Get services grouped by category (program)
// Only includes categories that have at least one online-bookable service
// ============================================
export async function getServicesByCategory(locationId?: number): Promise<ServiceCategory[]> {
  const [services, programs] = await Promise.all([
    getServices(locationId),
    getPrograms()
  ])

  // Create a map of program ID to program
  const programMap = new Map(programs.map(p => [p.Id, p]))

  // Group services by program
  const categoryMap = new Map<number, ServiceCategory>()

  for (const service of services) {
    const program = programMap.get(service.ProgramId)
    if (!program) continue

    // Skip "ADICIONALES" category - these are add-ons shown separately
    if (program.Name.toUpperCase() === 'ADICIONALES') continue

    if (!categoryMap.has(service.ProgramId)) {
      categoryMap.set(service.ProgramId, {
        id: program.Id,
        name: program.Name,
        services: []
      })
    }

    categoryMap.get(service.ProgramId)!.services.push(service)
  }

  // Convert to array and filter out empty categories
  const categories = Array.from(categoryMap.values())
    .filter(cat => cat.services.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  console.log('Categories with online services:', categories.map(c => `${c.name} (${c.services.length})`))

  return categories
}

// ============================================
// Get add-on services (ADICIONALES category)
// ============================================
export async function getAddonServices(locationId?: number): Promise<MindbodyService[]> {
  const [services, programs] = await Promise.all([
    getServices(locationId),
    getPrograms()
  ])

  // Find the ADICIONALES program
  const adicionalesProgram = programs.find(p => 
    p.Name.toUpperCase() === 'ADICIONALES'
  )

  if (!adicionalesProgram) {
    console.log('ADICIONALES category not found')
    return []
  }

  // Filter services that belong to ADICIONALES
  const addons = services.filter(s => s.ProgramId === adicionalesProgram.Id)
  console.log('Add-on services:', addons.length)

  return addons
}

// ============================================
// Get staff members
// ============================================
export async function getStaff(locationId?: number): Promise<MindbodyStaff[]> {
  const response = await mindbodyRequest<StaffResponse>('/staff/staff', {
    params: {
      limit: 100,
      ...(locationId ? { locationIds: locationId } : {}),
      filters: 'AppointmentInstructor',
    }
  })
  
  return (response.StaffMembers || []).filter(staff => 
    staff.AppointmentInstructor === true
  )
}

// ============================================
// Get availability for booking
// ============================================
export async function getBookableItems(
  sessionTypeIds: number[],
  locationId: number,
  staffId?: number,
  startDate?: string,
  endDate?: string
): Promise<MindbodyAvailability[]> {
  const today = new Date()
  const twoWeeksLater = new Date(today)
  twoWeeksLater.setDate(today.getDate() + 14)

  const response = await mindbodyRequest<BookableItemsResponse>('/appointment/bookableitems', {
    params: {
      sessionTypeIds: sessionTypeIds.join(','),
      locationIds: locationId,
      ...(staffId ? { staffIds: staffId } : {}),
      startDate: startDate || today.toISOString().split('T')[0],
      endDate: endDate || twoWeeksLater.toISOString().split('T')[0],
      limit: 200,
    }
  })

  return response.Availabilities || []
}

// ============================================
// Search clients by email or phone
// ============================================
export async function searchClients(searchText: string): Promise<MindbodyClient[]> {
  const response = await mindbodyRequest<ClientsResponse>('/client/clients', {
    params: {
      searchText,
      limit: 10,
    }
  })

  return response.Clients || []
}

// ============================================
// Add a new client
// ============================================
export async function addClient(client: {
  FirstName: string
  LastName: string
  Email: string
  MobilePhone?: string
}): Promise<MindbodyClient | null> {
  try {
    const response = await mindbodyRequest<{ Client: MindbodyClient }>('/client/addclient', {
      method: 'POST',
      body: client,
    })
    return response.Client
  } catch (error) {
    console.error('Error adding client:', error)
    return null
  }
}

// ============================================
// Book an appointment
// ============================================
export async function bookAppointment(booking: {
  ClientId: string
  LocationId: number
  SessionTypeId: number
  StaffId?: number
  StartDateTime: string
  Notes?: string
}): Promise<{ success: boolean; appointmentId?: number; error?: string }> {
  try {
    const response = await mindbodyRequest<{ Appointment: { Id: number } }>('/appointment/addappointment', {
      method: 'POST',
      body: booking,
    })
    return { success: true, appointmentId: response.Appointment?.Id }
  } catch (error) {
    console.error('Error booking appointment:', error)
    return { success: false, error: String(error) }
  }
}
