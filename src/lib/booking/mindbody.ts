// ===========================================
// MINDBODY API UTILITY
// Server-side only - handles token management
// ===========================================

import type { MindbodyTokenResponse } from '@/types/booking'
import { ITBM_TAX_RATE, PROGRAM_NAMES as SHARED_PROGRAM_NAMES } from './constants'

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

type ParamValue = string | number | boolean | undefined | number[] | string[]

interface MindbodyRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  params?: Record<string, ParamValue>
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
        // Handle arrays - Mindbody API expects repeated params for arrays
        if (Array.isArray(value)) {
          value.forEach(v => {
            searchParams.append(key, String(v))
          })
        } else {
          searchParams.append(key, String(value))
        }
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  console.log('Mindbody API request:', method, url)

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
    throw new Error(`Mindbody API error: ${response.status} - ${errorText}`)
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

// Get Spanish category name from ProgramId
function getSpanishCategory(programId: number | undefined): string {
  if (programId && SHARED_PROGRAM_NAMES[programId]) {
    return SHARED_PROGRAM_NAMES[programId]
  }
  return 'General'
}

// ===========================================
// ITBM TAX REMOVAL HELPER
// Mindbody prices include 7% ITBM tax
// We remove it for display, calculate in cart
// Uses ITBM_TAX_RATE from constants.ts
// ===========================================

function removeTaxFromPrice(priceWithTax: number): number {
  // Formula: priceWithoutTax = priceWithTax / (1 + taxRate)
  if (!priceWithTax || priceWithTax <= 0) return 0
  return Math.round(priceWithTax / (1 + ITBM_TAX_RATE))
}

// ===========================================
// DURATION PARSING HELPER
// Extract duration from service name (e.g., "Baño de Luna - 120 min")
// ===========================================
function parseDurationFromName(name: string): number {
  // Match patterns like "120 min", "60min", "90 mins", "45 minutos"
  const patterns = [
    /(\d+)\s*min(?:utos?|s)?/i,  // "120 min", "60 minutos", "45 mins"
    /(\d+)\s*(?:hr|hora)s?/i,    // "1 hr", "2 horas" (convert to minutes)
  ]
  
  for (const pattern of patterns) {
    const match = name.match(pattern)
    if (match) {
      const value = parseInt(match[1], 10)
      // If it's hours, convert to minutes
      if (pattern.source.includes('hr|hora')) {
        return value * 60
      }
      return value
    }
  }
  
  return 0 // Default if no duration found
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

// Session types response (for appointments)
interface SessionTypesResponse {
  SessionTypes: Array<{
    Id: number // This is the SessionTypeId used for appointments
    Name: string
    Description: string | null
    DefaultTimeLength: number // Duration in minutes
    ProgramId: number
    Category: string
    OnlineDescription: string | null
    NumDeducted: number // Number of visits deducted
    SiteId: number
  }>
}

// Get session types from /site/sessiontypes - these are used for appointments
// The Id returned here is the SessionTypeId required by appointment APIs
export async function getSessionTypes(onlineOnly: boolean = true) {
  const response = await mindbodyRequest<SessionTypesResponse>('/site/sessiontypes', {
    params: {
      limit: 200,
      onlineOnly: onlineOnly,
    }
  })

  const sessionTypes = response.SessionTypes || []
  console.log(`Session types from Mindbody (onlineOnly=${onlineOnly}):`, sessionTypes.length)

  return sessionTypes
}

// Normalize name for flexible matching between sale/services and sessiontypes
function normalizeServiceName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Remove common variations
    .replace(/\s+/g, ' ')  // Multiple spaces to single
    .replace(/[–—]/g, '-') // Different dash types
}

// Find matching session type with flexible matching
function findSessionTypeMatch(
  name: string,
  sessionTypeMap: Map<string, { Id: number; Duration: number; ProgramId: number }>
): { Id: number; Duration: number; ProgramId: number } | undefined {
  const normalizedName = normalizeServiceName(name)

  // Try exact match first
  if (sessionTypeMap.has(normalizedName)) {
    return sessionTypeMap.get(normalizedName)
  }

  // Try partial match - service name contains session type name or vice versa
  for (const [stName, stData] of sessionTypeMap.entries()) {
    if (normalizedName.includes(stName) || stName.includes(normalizedName)) {
      return stData
    }
  }

  return undefined
}

// Shared function to fetch all online bookable services from Mindbody
// Returns all services with session type matching applied
async function fetchAllOnlineBookableServices(locationId?: number) {
  // Fetch both session types and sale services in parallel
  const [sessionTypes, saleServicesResponse] = await Promise.all([
    getSessionTypes(true), // Only online bookable session types
    mindbodyRequest<SaleServicesResponse>('/sale/services', {
      params: {
        limit: 200,
        sellOnline: true,
        ...(locationId ? { locationId: locationId } : {})
      }
    })
  ])

  const allSaleServices = saleServicesResponse.Services || []
  console.log('Total sale/services from Mindbody:', allSaleServices.length)
  console.log('Total online session types:', sessionTypes.length)

  // Create a map of session types by normalized name for matching
  const sessionTypeMap = new Map<string, { Id: number; Duration: number; ProgramId: number }>()
  for (const st of sessionTypes) {
    const normalizedName = normalizeServiceName(st.Name)
    sessionTypeMap.set(normalizedName, {
      Id: st.Id,
      Duration: st.DefaultTimeLength || 0,
      ProgramId: st.ProgramId,
    })
  }

  // Filter all sale services (online bookable, single session, has price)
  const filteredServices = allSaleServices.filter(s =>
    s.SellOnline === true &&
    s.Count === 1 &&
    s.Price > 0
  )
  console.log('Filtered sale services (SellOnline, single session, has price):', filteredServices.length)

  // Transform and match with session types for correct Id
  const services = filteredServices.map(s => {
    const sessionType = findSessionTypeMatch(s.Name, sessionTypeMap)

    // Use SessionTypeId from session types if found, otherwise use ProductId
    const serviceId = sessionType?.Id || s.ProductId
    const duration = sessionType?.Duration || parseDurationFromName(s.Name)

    if (!sessionType) {
      console.log(`Warning: No session type match for service: ${s.Name} (ProgramId=${s.ProgramId})`)
    }

    return {
      Id: serviceId, // SessionTypeId for appointments
      ProductId: s.ProductId,
      Name: s.Name,
      Description: '',
      Duration: duration,
      Price: removeTaxFromPrice(s.Price || s.OnlinePrice || 0),
      OnlinePrice: removeTaxFromPrice(s.OnlinePrice),
      TaxIncluded: s.TaxIncluded,
      OnlineBooking: s.SellOnline,
      Category: getSpanishCategory(s.ProgramId),
      ProgramId: s.ProgramId,
      IsAddOn: false,
      HasSessionTypeMatch: sessionType !== undefined,
    }
  })

  return { services, sessionTypeMap }
}

// Get services (treatments) - excludes Adicionales (ProgramId 8)
// Filter: Online bookable, single session, has price, NOT Adicionales
export async function getServices(locationId?: number) {
  const { services, sessionTypeMap } = await fetchAllOnlineBookableServices(locationId)

  // Filter out Adicionales (ProgramId 8) and only include services with session type match
  const onlineBookableServices = services.filter(s =>
    s.ProgramId !== 8 && // Exclude Adicionales
    findSessionTypeMatch(s.Name, sessionTypeMap) !== undefined
  )

  console.log('Online bookable services (excluding Adicionales):', onlineBookableServices.length)
  console.log('Services with prices (tax removed):', onlineBookableServices.filter(s => s.Price > 0).length)

  return onlineBookableServices
}

// Get add-ons (Adicionales) - only ProgramId 8
// Filter: Online bookable, single session, has price, ONLY Adicionales, with session type match
export async function getAddons(locationId?: number) {
  const { services, sessionTypeMap } = await fetchAllOnlineBookableServices(locationId)

  // Filter for Adicionales only (ProgramId 8) and require session type match for booking
  const onlineBookableAddons = services.filter(s =>
    s.ProgramId === 8 && // Only Adicionales
    findSessionTypeMatch(s.Name, sessionTypeMap) !== undefined
  )

  console.log('Online bookable addons (Adicionales only):', onlineBookableAddons.length)
  console.log('Addons with prices (tax removed):', onlineBookableAddons.filter(s => s.Price > 0).length)

  return onlineBookableAddons
}

// Get staff - basic endpoint without service filtering
export async function getStaff(locationId?: number) {
  interface StaffResponse {
    StaffMembers: Array<{
      Id: number
      FirstName: string
      LastName: string
      DisplayName: string
      Bio: string | null
      ImageUrl: string | null
      AppointmentTrn?: boolean
      Email?: string
      MobilePhone?: string
      isMale?: boolean
    }>
  }

  console.log('getStaff called with locationId:', locationId)

  const response = await mindbodyRequest<StaffResponse>('/staff/staff', {
    params: locationId ? { locationIds: locationId } : undefined
  })

  const allStaff = response.StaffMembers || []
  console.log('Total staff from Mindbody:', allStaff.length)

  // Filter for appointment providers - AppointmentTrn may be undefined, so default to true
  // Include staff if AppointmentTrn is true OR undefined (not explicitly false)
  const filteredStaff = allStaff
    .filter(s => s.AppointmentTrn !== false)
    .map(s => ({
      Id: s.Id,
      FirstName: s.FirstName,
      LastName: s.LastName,
      DisplayName: s.DisplayName || `${s.FirstName} ${s.LastName}`,
      Bio: s.Bio,
      ImageUrl: s.ImageUrl,
      AppointmentTrn: s.AppointmentTrn ?? true,
    }))

  console.log('Filtered staff (appointment providers):', filteredStaff.length)

  return filteredStaff
}

// Get available staff for specific services by checking bookable items
// This returns staff who have availability for the given services in the next 14 days
export async function getAvailableStaffForServices(params: {
  locationId: number
  sessionTypeIds: number[]
}): Promise<Array<{
  Id: number
  FirstName: string
  LastName: string
  DisplayName: string
  Bio: string | null
  ImageUrl: string | null
  AppointmentTrn: boolean
}>> {
  // Get availability for the next 14 days to find staff who can perform these services
  const today = new Date()
  const twoWeeksLater = new Date(today)
  twoWeeksLater.setDate(today.getDate() + 14)

  const startDate = today.toISOString().split('T')[0]
  const endDate = twoWeeksLater.toISOString().split('T')[0]

  try {
    const bookableItems = await getBookableItems({
      locationIds: params.locationId,
      sessionTypeIds: params.sessionTypeIds,
      startDate,
      endDate,
    })

    // Extract unique staff from bookable items
    const staffMap = new Map<number, {
      Id: number
      FirstName: string
      LastName: string
      DisplayName: string
      Bio: string | null
      ImageUrl: string | null
      AppointmentTrn: boolean
    }>()

    for (const item of bookableItems) {
      if (item.Staff && !staffMap.has(item.Staff.Id)) {
        staffMap.set(item.Staff.Id, {
          Id: item.Staff.Id,
          FirstName: item.Staff.FirstName,
          LastName: item.Staff.LastName,
          DisplayName: `${item.Staff.FirstName} ${item.Staff.LastName}`,
          Bio: null,
          ImageUrl: null,
          AppointmentTrn: true,
        })
      }
    }

    return Array.from(staffMap.values())
  } catch (error) {
    console.error('Error getting available staff for services:', error)
    // Fall back to regular staff list
    return getStaff(params.locationId)
  }
}

// Get available dates - returns dates when staff are scheduled to work
// Use this first to narrow down which dates to check for bookable items
// Note: Mindbody API v6 expects sessionTypeIds as an array (repeated params)
export async function getAvailableDates(params: {
  locationId: number
  sessionTypeIds: number[]
  staffId?: number
  startDate: string
  endDate: string
}) {
  interface AvailableDatesResponse {
    AvailableDates: string[] // Array of date strings like "2026-01-15"
  }

  console.log('getAvailableDates called with:', params)

  const queryParams: Record<string, ParamValue> = {
    locationId: params.locationId,
    sessionTypeIds: params.sessionTypeIds, // Pass as array (repeated params)
    startDate: params.startDate,
    endDate: params.endDate,
  }

  if (params.staffId) {
    queryParams.staffId = params.staffId
  }

  const response = await mindbodyRequest<AvailableDatesResponse>('/appointment/availabledates', {
    params: queryParams
  })

  console.log('Available dates response:', response.AvailableDates?.length || 0, 'dates')

  return response.AvailableDates || []
}

// Get staff with availability - uses availabledates endpoint to find staff who have dates
export async function getStaffWithAvailability(params: {
  locationId: number
  sessionTypeIds: number[]
  startDate: string
  endDate: string
}): Promise<Array<{
  Id: number
  FirstName: string
  LastName: string
  DisplayName: string
  Bio: string | null
  ImageUrl: string | null
  AppointmentTrn: boolean
}>> {
  console.log('getStaffWithAvailability called with:', params)

  // First get all staff for this location
  const allStaff = await getStaff(params.locationId)
  console.log('All staff for location:', allStaff.length)

  if (allStaff.length === 0) {
    return []
  }

  // Check each staff member for available dates
  const staffWithAvailability: typeof allStaff = []

  for (const staff of allStaff) {
    try {
      const availableDates = await getAvailableDates({
        locationId: params.locationId,
        sessionTypeIds: params.sessionTypeIds,
        staffId: staff.Id,
        startDate: params.startDate,
        endDate: params.endDate,
      })

      if (availableDates.length > 0) {
        staffWithAvailability.push(staff)
        console.log(`Staff ${staff.DisplayName} has ${availableDates.length} available dates`)
      }
    } catch (error) {
      console.error(`Error checking availability for staff ${staff.Id}:`, error)
      // Include staff anyway if we can't check - better to show than hide
      staffWithAvailability.push(staff)
    }
  }

  console.log('Staff with availability:', staffWithAvailability.length)

  return staffWithAvailability
}

// Get bookable items (availability) - returns specific time slots
// Note: Mindbody API v6 /appointment/bookableitems requires:
// - locationIds (array) - required
// - sessionTypeIds (array) - optional, filters by session type
// - staffIds (array) - optional, filters by staff
// - startDate, endDate - date range
// - limit - max results (default 100)
export async function getBookableItems(params: {
  locationIds: number
  sessionTypeIds?: number[]
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
    PaginationResponse?: {
      TotalResults: number
      RequestedLimit: number
      RequestedOffset: number
    }
  }

  console.log('getBookableItems called with:', params)

  // Build params - Mindbody API expects arrays for locationIds and sessionTypeIds
  const queryParams: Record<string, ParamValue> = {
    // Pass locationIds as array (repeated params)
    locationIds: [params.locationIds],
    startDate: params.startDate,
    endDate: params.endDate,
    limit: 200, // Increase limit to get more results
  }

  // Only add sessionTypeIds if provided and not empty
  if (params.sessionTypeIds && params.sessionTypeIds.length > 0) {
    queryParams.sessionTypeIds = params.sessionTypeIds
  }

  if (params.staffIds) {
    queryParams.staffIds = [params.staffIds]
  }

  console.log('getBookableItems query params:', queryParams)

  // Mindbody GET /appointment/bookableitems uses query params
  const response = await mindbodyRequest<BookableItemsResponse>('/appointment/bookableitems', {
    params: queryParams
  })

  console.log('Bookable items response:', response.AvailableItems?.length || 0, 'items')
  if (response.PaginationResponse) {
    console.log('Pagination:', response.PaginationResponse)
  }

  return response.AvailableItems || []
}

// Get staff appointment availability - returns available time blocks for staff
// This endpoint shows when staff are available for appointments
export async function getStaffAppointmentAvailability(params: {
  locationId: number
  staffIds?: number[]
  startDateTime: string  // ISO datetime
  endDateTime: string    // ISO datetime
}) {
  interface StaffAvailabilityResponse {
    StaffMembers: Array<{
      Id: number
      FirstName: string
      LastName: string
      Availabilities: Array<{
        StartDateTime: string
        EndDateTime: string
        BookableEndDateTime: string
      }>
    }>
  }

  console.log('getStaffAppointmentAvailability called with:', params)

  const queryParams: Record<string, ParamValue> = {
    locationId: params.locationId,
    startDateTime: params.startDateTime,
    endDateTime: params.endDateTime,
  }

  if (params.staffIds && params.staffIds.length > 0) {
    queryParams.staffIds = params.staffIds
  }

  const response = await mindbodyRequest<StaffAvailabilityResponse>('/staff/staffappointmentavailability', {
    params: queryParams
  })

  console.log('Staff availability response:', response.StaffMembers?.length || 0, 'staff members')

  return response.StaffMembers || []
}

// Get appointments for staff - shows existing bookings to determine availability
export async function getStaffAppointments(params: {
  locationId: number
  staffIds?: number[]
  startDate: string
  endDate: string
}) {
  interface StaffAppointmentsResponse {
    Appointments: Array<{
      Id: number
      StartDateTime: string
      EndDateTime: string
      Status: string
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
      Client?: {
        Id: number
        FirstName: string
        LastName: string
      }
    }>
  }

  console.log('getStaffAppointments called with:', params)

  const queryParams: Record<string, ParamValue> = {
    locationIds: [params.locationId],
    startDate: params.startDate,
    endDate: params.endDate,
  }

  if (params.staffIds && params.staffIds.length > 0) {
    queryParams.staffIds = params.staffIds
  }

  const response = await mindbodyRequest<StaffAppointmentsResponse>('/appointment/staffappointments', {
    params: queryParams
  })

  console.log('Staff appointments response:', response.Appointments?.length || 0, 'appointments')

  return response.Appointments || []
}

// Get active session types that have availability
// This endpoint returns session types with staff assignments
export async function getActiveSessionTypes(params: {
  locationId: number
  startDate: string
  endDate: string
}) {
  interface ActiveSessionTypesResponse {
    SessionTypes: Array<{
      Id: number
      Name: string
      ProgramId: number
      DefaultTimeLength: number
      OnlineDescription: string | null
    }>
  }

  console.log('getActiveSessionTypes called with:', params)

  const response = await mindbodyRequest<ActiveSessionTypesResponse>('/appointment/activesessiontypes', {
    params: {
      scheduleType: 'Appointment',
      locationId: params.locationId,
      startDate: params.startDate,
      endDate: params.endDate,
    }
  })

  console.log('Active session types response:', response.SessionTypes?.length || 0, 'session types')

  return response.SessionTypes || []
}

// Get schedule items - returns raw schedule blocks for staff
export async function getScheduleItems(params: {
  locationIds: number[]
  staffIds?: number[]
  startDate: string
  endDate: string
}) {
  interface ScheduleItemsResponse {
    StaffMembers: Array<{
      Id: number
      FirstName: string
      LastName: string
      Appointments: Array<{
        Id: number
        StartDateTime: string
        EndDateTime: string
        Status: string
        SessionType?: {
          Id: number
          Name: string
        }
      }>
      Availabilities: Array<{
        Id: number
        StartDateTime: string
        EndDateTime: string
        BookableEndDateTime?: string
      }>
      UnavailableItems: Array<{
        Id: number
        StartDateTime: string
        EndDateTime: string
      }>
    }>
  }

  console.log('getScheduleItems called with:', params)

  const queryParams: Record<string, ParamValue> = {
    locationIds: params.locationIds,
    startDate: params.startDate,
    endDate: params.endDate,
  }

  if (params.staffIds && params.staffIds.length > 0) {
    queryParams.staffIds = params.staffIds
  }

  const response = await mindbodyRequest<ScheduleItemsResponse>('/appointment/scheduleitems', {
    params: queryParams
  })

  console.log('Schedule items response:', response.StaffMembers?.length || 0, 'staff members')

  return response.StaffMembers || []
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
      ClientId: number | string
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
      Client?: {
        Id: string | number
        FirstName: string
        LastName: string
        Email?: string
        MobilePhone?: string
      }
    }
    Error?: {
      Message: string
      Code: string
    }
  }

  console.log('=== addAppointment called ===')
  console.log('Request data:', JSON.stringify(appointmentData, null, 2))

  // Mindbody API expects specific field names - ensure proper casing
  // The API is case-sensitive and expects these exact field names
  const requestBody = {
    ClientId: String(appointmentData.ClientId), // Mindbody expects string for ClientId
    LocationId: appointmentData.LocationId,
    StaffId: appointmentData.StaffId,
    SessionTypeId: appointmentData.SessionTypeId,
    StartDateTime: appointmentData.StartDateTime,
    EndDateTime: appointmentData.EndDateTime,
    Notes: appointmentData.Notes,
  }

  console.log('Final request body:', JSON.stringify(requestBody, null, 2))

  const response = await mindbodyRequest<AppointmentResponse>('/appointment/addappointment', {
    method: 'POST',
    body: requestBody
  })

  console.log('Mindbody addAppointment response:', JSON.stringify(response, null, 2))

  // Log client info from response
  if (response.Appointment?.Client) {
    console.log('Client info from Mindbody response:', JSON.stringify(response.Appointment.Client, null, 2))
  } else {
    console.warn('No Client object in Mindbody appointment response - client name may be missing in Mindbody')
  }

  // Check for error in response
  if (response.Error) {
    console.error('Mindbody API returned error:', response.Error)
    throw new Error(`Mindbody API error: ${response.Error.Message || response.Error.Code || 'Unknown error'}`)
  }

  // Validate that we got an appointment back
  if (!response.Appointment || !response.Appointment.Id) {
    console.error('Mindbody API did not return a valid appointment:', response)
    throw new Error('Mindbody API did not return a valid appointment')
  }

  console.log('Successfully created appointment:', response.Appointment.Id)

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

  for (let i = 0; i < appointments.length; i++) {
    const appointment = appointments[i]
    try {
      console.log(`=== Creating appointment ${i + 1}/${appointments.length} ===`)
      console.log('SessionTypeId:', appointment.SessionTypeId)
      console.log('StartDateTime:', appointment.StartDateTime)
      const result = await addAppointment(appointment)
      results.push({ success: true, appointment: result })
    } catch (error) {
      console.error(`=== Appointment ${i + 1} FAILED ===`)
      console.error('SessionTypeId:', appointment.SessionTypeId)
      console.error('Error:', error)
      results.push({
        success: false,
        error: String(error),
        sessionTypeId: appointment.SessionTypeId,
        startDateTime: appointment.StartDateTime
      })
    }
  }

  return results
}

// CLIENT HISTORY & PORTAL FUNCTIONS
// ============================================

// Types for client history responses
export interface ClientVisit {
  AppointmentId: number
  AppointmentStatus: string
  ClassId: number | null
  ClientId: string
  StartDateTime: string
  EndDateTime: string
  LastModifiedDateTime: string
  LateCancelled: boolean
  LocationId: number
  MakeUp: boolean
  Name: string
  ServiceId: number
  SignedIn: boolean
  StaffId: number
  StaffName?: string
  WebSignup: boolean
  Action?: string
  Site?: {
    Id: number
    Name: string
  }
  Location?: {
    Id: number
    Name: string
  }
  Staff?: {
    Id: number
    FirstName: string
    LastName: string
    DisplayName?: string
  }
}

export interface ClientPurchase {
  Sale: {
    Id: number
    SaleDate: string
    SaleTime: string
    SaleDateTime: string
    OriginalSaleDateTime: string
    ClientId: string
    PurchasedItems: Array<{
      Id: number
      IsService: boolean
      BarcodeId: string | null
    }>
    LocationId: number
    Payments: Array<{
      Id: number
      Amount: number
      Method: number
      Type: string
      Notes: string | null
    }>
  }
  Description: string
  Quantity: number
  Price: number
  Discount: number
  Tax: number
  Returned: boolean
  PaymentRefId: number
  Id: number
  Status: string
  IsService: boolean
}

export interface ClientScheduledVisit {
  AppointmentId: number
  AppointmentStatus: string
  ClassId: number | null
  ClientId: string
  StartDateTime: string
  EndDateTime: string
  Id: number
  LastModifiedDateTime: string
  LateCancelled: boolean
  LocationId: number
  MakeUp: boolean
  Name: string
  ServiceId: number
  SignedIn: boolean
  StaffId: number
  WebSignup: boolean
  Staff?: {
    Id: number
    FirstName: string
    LastName: string
    DisplayName?: string
  }
  Location?: {
    Id: number
    Name: string
  }
}

// Get client visit history (past appointments)
export async function getClientVisits(params: {
  clientId: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}) {
  interface ClientVisitsResponse {
    PaginationResponse: {
      RequestedLimit: number
      RequestedOffset: number
      PageSize: number
      TotalResults: number
    }
    Visits: ClientVisit[]
  }

  const queryParams = new URLSearchParams()
  queryParams.set('request.clientId', params.clientId)

  if (params.startDate) {
    queryParams.set('request.startDate', params.startDate)
  }
  if (params.endDate) {
    queryParams.set('request.endDate', params.endDate)
  }
  if (params.limit) {
    queryParams.set('request.limit', params.limit.toString())
  }
  if (params.offset) {
    queryParams.set('request.offset', params.offset.toString())
  }

  const response = await mindbodyRequest<ClientVisitsResponse>(
    `/client/clientvisits?${queryParams.toString()}`
  )

  return {
    visits: response.Visits || [],
    pagination: response.PaginationResponse
  }
}

// Get client purchase history
export async function getClientPurchases(params: {
  clientId: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}) {
  interface ClientPurchasesResponse {
    PaginationResponse: {
      RequestedLimit: number
      RequestedOffset: number
      PageSize: number
      TotalResults: number
    }
    Purchases: ClientPurchase[]
  }

  const queryParams = new URLSearchParams()
  queryParams.set('request.clientId', params.clientId)

  if (params.startDate) {
    queryParams.set('request.startDate', params.startDate)
  }
  if (params.endDate) {
    queryParams.set('request.endDate', params.endDate)
  }
  if (params.limit) {
    queryParams.set('request.limit', params.limit.toString())
  }
  if (params.offset) {
    queryParams.set('request.offset', params.offset.toString())
  }

  const response = await mindbodyRequest<ClientPurchasesResponse>(
    `/client/clientpurchases?${queryParams.toString()}`
  )

  return {
    purchases: response.Purchases || [],
    pagination: response.PaginationResponse
  }
}

// Get client scheduled visits (upcoming appointments)
export async function getClientSchedule(params: {
  clientId: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}) {
  interface ClientScheduleResponse {
    PaginationResponse: {
      RequestedLimit: number
      RequestedOffset: number
      PageSize: number
      TotalResults: number
    }
    Visits: ClientScheduledVisit[]
  }

  const queryParams = new URLSearchParams()
  queryParams.set('request.clientId', params.clientId)

  if (params.startDate) {
    queryParams.set('request.startDate', params.startDate)
  }
  if (params.endDate) {
    queryParams.set('request.endDate', params.endDate)
  }
  if (params.limit) {
    queryParams.set('request.limit', params.limit.toString())
  }
  if (params.offset) {
    queryParams.set('request.offset', params.offset.toString())
  }

  const response = await mindbodyRequest<ClientScheduleResponse>(
    `/client/clientschedule?${queryParams.toString()}`
  )

  return {
    visits: response.Visits || [],
    pagination: response.PaginationResponse
  }
}

// Get full client info with all details
export async function getClientCompleteInfo(clientId: string) {
  interface ClientInfoResponse {
    Client: {
      Id: string
      UniqueId: number
      FirstName: string
      LastName: string
      Email: string
      MobilePhone: string
      HomePhone: string
      BirthDate: string | null
      CreationDate: string
      Status: string
      Action: string
      PhotoUrl: string | null
      AddressLine1: string | null
      AddressLine2: string | null
      City: string | null
      State: string | null
      PostalCode: string | null
      Country: string | null
      IsProspect: boolean
      FirstAppointmentDate: string | null
      ReferredBy: string | null
      EmergencyContactInfoName: string | null
      EmergencyContactInfoPhone: string | null
      EmergencyContactInfoEmail: string | null
    }
  }

  // Use the mindbodyRequest helper with ClientIds parameter (Mindbody API v6 format)
  const response = await mindbodyRequest<ClientInfoResponse>('/client/clients', {
    params: {
      ClientIds: clientId
    }
  })

  // The API returns a Clients array, get the first one
  const clients = (response as unknown as { Clients: ClientInfoResponse['Client'][] }).Clients
  return clients?.[0] || null
}

// Custom client field interface
export interface CustomClientField {
  Id: number
  DataType: string
  Name: string
  Value?: string
}

// Get custom client fields configured for the site
export async function getCustomClientFields() {
  interface CustomFieldsResponse {
    CustomClientFields: Array<{
      Id: number
      DataType: string
      Name: string
    }>
  }

  const response = await mindbodyRequest<CustomFieldsResponse>(
    '/client/customclientfields'
  )

  return response.CustomClientFields || []
}

// Update client profile interface
export interface UpdateClientData {
  Id: string
  FirstName?: string
  LastName?: string
  Email?: string
  MobilePhone?: string
  HomePhone?: string
  AddressLine1?: string
  AddressLine2?: string
  City?: string
  State?: string
  PostalCode?: string
  Country?: string
  BirthDate?: string
  EmergencyContactInfoName?: string
  EmergencyContactInfoPhone?: string
  EmergencyContactInfoEmail?: string
  CustomClientFields?: Array<{
    Id: number
    Value: string
  }>
}

// Update client profile in Mindbody
export async function updateClient(clientData: UpdateClientData) {
  interface UpdateClientResponse {
    Client: {
      Id: string
      UniqueId: number
      FirstName: string
      LastName: string
      Email: string
      MobilePhone: string
      HomePhone: string
      BirthDate: string | null
      AddressLine1: string | null
      AddressLine2: string | null
      City: string | null
      State: string | null
      PostalCode: string | null
      Country: string | null
      CustomClientFields: Array<{
        Id: number
        DataType: string
        Name: string
        Value: string
      }>
    }
  }

  const response = await mindbodyRequest<UpdateClientResponse>('/client/updateclient', {
    method: 'POST',
    body: {
      Client: clientData,
      CrossRegionalUpdate: false  // Required for single-site updates
    }
  })

  return response.Client
}

// Get client with custom fields
export async function getClientWithCustomFields(clientId: string) {
  interface ClientWithFieldsResponse {
    Clients: Array<{
      Id: string
      UniqueId: number
      FirstName: string
      LastName: string
      Email: string
      MobilePhone: string
      HomePhone: string
      BirthDate: string | null
      AddressLine1: string | null
      AddressLine2: string | null
      City: string | null
      State: string | null
      PostalCode: string | null
      Country: string | null
      EmergencyContactInfoName: string | null
      EmergencyContactInfoPhone: string | null
      EmergencyContactInfoEmail: string | null
      CustomClientFields: Array<{
        Id: number
        DataType: string
        Name: string
        Value: string
      }>
    }>
  }

  console.log('getClientWithCustomFields - Fetching client ID:', clientId)

  // Use the mindbodyRequest helper with ClientIds parameter (Mindbody API v6 format)
  const response = await mindbodyRequest<ClientWithFieldsResponse>('/client/clients', {
    params: {
      ClientIds: clientId
    }
  })

  const client = response.Clients?.[0] || null

  if (client) {
    console.log('getClientWithCustomFields - Found client:', {
      Id: client.Id,
      UniqueId: client.UniqueId,
      FirstName: client.FirstName,
      LastName: client.LastName,
      Email: client.Email
    })
  } else {
    console.warn('getClientWithCustomFields - No client found for ID:', clientId)
  }

  return client
}
