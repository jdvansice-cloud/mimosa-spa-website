// ===========================================
// MINDBODY API UTILITY
// Server-side only - handles token management
// ===========================================

import type { MindbodyTokenResponse } from '@/types/booking'

// Environment variables (server-side only)
const MINDBODY_API_KEY = process.env.MINDBODY_API_KEY
const MINDBODY_SITE_ID = process.env.MINDBODY_SITE_ID
const MINDBODY_API_URL = process.env.MINDBODY_API_URL || 'https://api.mindbodyonline.com/public/v6'
const MINDBODY_USERNAME = process.env.MINDBODY_USERNAME || '_mindbody_api'
const MINDBODY_PASSWORD = process.env.MINDBODY_PASSWORD || '_mindbody_api'

// Validate environment variables
function validateConfig() {
  if (!MINDBODY_API_KEY) {
    throw new Error('MINDBODY_API_KEY is not configured. Please add it to Vercel Environment Variables.')
  }
  if (!MINDBODY_SITE_ID) {
    throw new Error('MINDBODY_SITE_ID is not configured. Please add it to Vercel Environment Variables.')
  }
}

// Token cache
let cachedToken: string | null = null
let tokenExpiry: number | null = null

// ===========================================
// TOKEN MANAGEMENT
// ===========================================

async function getAccessToken(): Promise<string> {
  // Validate config first
  validateConfig()
  
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }
  
  // Request new token
  const response = await fetch(`${MINDBODY_API_URL}/usertoken/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': MINDBODY_API_KEY!,
      'SiteId': MINDBODY_SITE_ID!,
    },
    body: JSON.stringify({
      Username: MINDBODY_USERNAME,
      Password: MINDBODY_PASSWORD,
    }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Mindbody token error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      apiKeyPrefix: MINDBODY_API_KEY?.substring(0, 8),
      siteId: MINDBODY_SITE_ID,
    })
    throw new Error(`Failed to get Mindbody token: ${response.status} - ${errorText}`)
  }
  
  const data: MindbodyTokenResponse = await response.json()
  
  // Cache token (expires in 1 hour, refresh at 50 minutes)
  cachedToken = data.AccessToken
  tokenExpiry = Date.now() + (50 * 60 * 1000) // 50 minutes
  
  return cachedToken
}

// Export token getter for test/debug endpoints
export async function getMindbodyToken(): Promise<MindbodyTokenResponse | null> {
  validateConfig()
  
  const response = await fetch(`${MINDBODY_API_URL}/usertoken/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': MINDBODY_API_KEY!,
      'SiteId': MINDBODY_SITE_ID!,
    },
    body: JSON.stringify({
      Username: MINDBODY_USERNAME,
      Password: MINDBODY_PASSWORD,
    }),
  })
  
  if (!response.ok) {
    return null
  }
  
  return response.json()
}

// ===========================================
// API REQUEST HELPER
// ===========================================

interface MindbodyRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  params?: Record<string, string | number | boolean | undefined>
}

export async function mindbodyRequest<T>(
  endpoint: string,
  options: MindbodyRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, params } = options
  
  // Get access token
  const token = await getAccessToken()
  
  // Build URL with query params
  let url = `${MINDBODY_API_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }
  
  // Make request
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': MINDBODY_API_KEY!,
      'SiteId': MINDBODY_SITE_ID!,
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Mindbody API error: ${response.status}`, errorText)
    throw new Error(`Mindbody API error: ${response.status}`)
  }
  
  return response.json()
}

// ===========================================
// API METHODS
// ===========================================

// Client lookup by email or phone
export async function searchClients(searchText: string) {
  interface ClientsResponse {
    Clients: Array<{
      Id: number
      FirstName: string
      LastName: string
      Email: string
      MobilePhone: string
      HomePhone?: string
      BirthDate?: string
      Gender?: string
    }>
  }
  
  const response = await mindbodyRequest<ClientsResponse>('/client/clients', {
    params: { searchText }
  })
  
  return response.Clients || []
}

// Register new client
export async function addClient(clientData: {
  FirstName: string
  LastName: string
  Email: string
  MobilePhone: string
  BirthDate?: string
  Gender?: string
}) {
  interface AddClientResponse {
    Client: {
      Id: number
      FirstName: string
      LastName: string
      Email: string
      MobilePhone: string
    }
  }
  
  const response = await mindbodyRequest<AddClientResponse>('/client/addclient', {
    method: 'POST',
    body: clientData
  })
  
  return response.Client
}

// Get locations
export async function getLocations() {
  interface LocationsResponse {
    Locations: Array<{
      Id: number
      Name: string
      Address: string
      Address2?: string
      City: string
      StateProvCode: string
      PostalCode: string
      Phone: string
    }>
  }
  
  const response = await mindbodyRequest<LocationsResponse>('/site/locations')
  return response.Locations || []
}

// ===========================================
// SERVICE HELPERS
// ===========================================

// Spanish program names from Mindbody
const PROGRAM_NAMES: Record<number, string> = {
  4: 'Tratamientos Corporales',
  5: 'Paquetes Deluxe',
  6: 'Tratamientos Faciales',
  8: 'Adicionales',
  11: 'Tratamientos Parejas',
  12: 'Adicionales en Cabina',
  13: 'Eventos',
  19: 'Paquetes de Masajes',
  20: 'TAI',
  21: 'Parejas',
}

// Get Spanish category name from ProgramId
function getSpanishCategory(programId: number | undefined): string {
  if (programId && PROGRAM_NAMES[programId]) {
    return PROGRAM_NAMES[programId]
  }
  return 'General'
}

// Sale/services response type
interface SaleServicesResponse {
  Services: Array<{
    Id: string
    Name: string
    Price: number
    OnlinePrice: number
    TaxIncluded: number
    TaxRate: number
    ProductId: number
    ProgramId: number
    Program: string
    RevenueCategory: string
    SellOnline: boolean
    Count: number // Number of visits - 1 = single session
    ExpirationLength: number
    ExpirationUnit: string
  }>
}

// Get services from sale/services - SINGLE SESSION ONLY (Count = 1)
export async function getServices(locationId?: number) {
  const response = await mindbodyRequest<SaleServicesResponse>('/sale/services', {
    params: {
      limit: 200,
      sellOnline: true,
      ...(locationId ? { locationId: locationId } : {})
    }
  })
  
  const allServices = response.Services || []
  console.log('Total sale/services from Mindbody:', allServices.length)
  
  // Filter for SINGLE SESSION ONLY (Count = 1) and exclude Adicionales (ProgramId 8)
  const singleSessionServices = allServices.filter(s => s.Count === 1 && s.ProgramId !== 8)
  console.log('Single session services (excluding add-ons):', singleSessionServices.length)
  
  // Transform to service format
  const services = singleSessionServices.map(s => ({
    Id: parseInt(s.Id) || s.ProductId,
    ProductId: s.ProductId,
    Name: s.Name,
    Description: '',
    Duration: 0, // Duration not available in sale/services
    Price: s.Price || s.OnlinePrice || 0,
    OnlinePrice: s.OnlinePrice,
    TaxIncluded: s.TaxIncluded,
    OnlineBooking: s.SellOnline,
    Category: getSpanishCategory(s.ProgramId),
    ProgramId: s.ProgramId,
    IsAddOn: false,
  }))
  
  console.log('Services with prices:', services.filter(s => s.Price > 0).length)
  
  return services
}

// Get add-ons from sale/services - SINGLE SESSION ONLY (Count = 1), Adicionales only
export async function getAddons(locationId?: number) {
  const response = await mindbodyRequest<SaleServicesResponse>('/sale/services', {
    params: {
      limit: 200,
      sellOnline: true,
      ...(locationId ? { locationId: locationId } : {})
    }
  })
  
  const allServices = response.Services || []
  console.log('Total sale/services for add-ons:', allServices.length)
  
  // Filter for Adicionales (ProgramId 8) AND single session (Count = 1)
  const addons = allServices
    .filter(s => s.ProgramId === 8 && s.Count === 1)
    .map(s => ({
      Id: parseInt(s.Id) || s.ProductId,
      ProductId: s.ProductId,
      Name: s.Name,
      Description: '',
      Duration: 0,
      Price: s.Price || s.OnlinePrice || 0,
      OnlinePrice: s.OnlinePrice,
      TaxIncluded: s.TaxIncluded,
      OnlineBooking: s.SellOnline,
      Category: 'Adicionales',
      ProgramId: s.ProgramId,
      IsAddOn: true,
    }))
  
  console.log('Single session add-ons:', addons.length)
  
  return addons
}

// Get staff
export async function getStaff(locationId?: number) {
  interface StaffResponse {
    StaffMembers: Array<{
      Id: number
      FirstName: string
      LastName: string
      DisplayName: string
      Bio: string | null
      ImageUrl: string | null
      AppointmentTrn: boolean
      Email?: string
      MobilePhone?: string
    }>
  }
  
  const response = await mindbodyRequest<StaffResponse>('/staff/staff', {
    params: locationId ? { locationIds: locationId } : undefined
  })
  
  // Filter for appointment providers only
  return (response.StaffMembers || [])
    .filter(s => s.AppointmentTrn)
    .map(s => ({
      Id: s.Id,
      FirstName: s.FirstName,
      LastName: s.LastName,
      DisplayName: s.DisplayName || `${s.FirstName} ${s.LastName}`,
      Bio: s.Bio,
      ImageUrl: s.ImageUrl,
      AppointmentTrn: s.AppointmentTrn,
    }))
}

// Get bookable items (availability)
export async function getBookableItems(params: {
  locationIds: number
  sessionTypeIds: number[]
  staffIds?: number
  startDate: string
  endDate: string
}) {
  interface BookableItemsResponse {
    AvailableItems: Array<{
      Id: number
      StartDateTime: string
      EndDateTime: string
      Staff: {
        Id: number
        FirstName: string
        LastName: string
      }
      Location: {
        Id: number
        Name: string
      }
      SessionType: {
        Id: number
        Name: string
      }
    }>
  }
  
  const response = await mindbodyRequest<BookableItemsResponse>('/appointment/bookableitems', {
    params: {
      locationIds: params.locationIds,
      sessionTypeIds: params.sessionTypeIds.join(','),
      staffIds: params.staffIds,
      startDate: params.startDate,
      endDate: params.endDate,
    }
  })
  
  return response.AvailableItems || []
}

// Add appointment
export async function addAppointment(appointmentData: {
  ClientId: number
  LocationId: number
  StaffId?: number
  SessionTypeId: number
  StartDateTime: string
  EndDateTime?: string
  Notes?: string
}) {
  interface AppointmentResponse {
    Appointment: {
      Id: number
      ClientId: number
      LocationId: number
      StaffId: number
      StartDateTime: string
      EndDateTime: string
      Status: string
      Staff?: {
        Id: number
        FirstName: string
        LastName: string
        DisplayName?: string
      }
    }
  }
  
  const response = await mindbodyRequest<AppointmentResponse>('/appointment/addappointment', {
    method: 'POST',
    body: appointmentData
  })
  
  return response.Appointment
}

// Add multiple appointments (for multi-service bookings)
export async function addMultipleAppointments(appointments: Array<{
  ClientId: number
  LocationId: number
  StaffId?: number
  SessionTypeId: number
  StartDateTime: string
  Notes?: string
}>) {
  const results = []
  
  for (const appointment of appointments) {
    try {
      const result = await addAppointment(appointment)
      results.push({ success: true, appointment: result })
    } catch (error) {
      results.push({ success: false, error: String(error) })
    }
  }
  
  return results
}
