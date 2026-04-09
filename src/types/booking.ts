// ===========================================
// BOOKING SYSTEM TYPES
// ===========================================

// ===========================================
// MINDBODY API TYPES
// ===========================================

export interface MindbodyLocation {
  Id: number
  Name: string
  Address: string
  Address2?: string
  City: string
  StateProvCode: string
  PostalCode: string
  Phone: string
  Latitude?: number
  Longitude?: number
}

export interface MindbodyService {
  Id: number
  ProductId?: number // Original Mindbody product ID (different from SessionTypeId)
  Name: string
  Description: string | null
  Duration: number // in minutes
  Price: number
  OnlinePrice?: number
  OnlineBooking: boolean
  Category: string
  CategoryId?: number
  ProgramId: number
  Count?: number
}

export interface MindbodyStaff {
  Id: number
  FirstName: string
  LastName: string
  DisplayName: string
  Bio: string | null
  ImageUrl: string | null
  AppointmentTrn: boolean
  Email?: string
  MobilePhone?: string
}

export interface MindbodyClient {
  Id: number
  FirstName: string
  LastName: string
  Email: string
  MobilePhone: string
  HomePhone?: string
  BirthDate?: string
  Gender?: string
  CreationDate?: string
}

export interface MindbodyAvailability {
  Id: number
  StartDateTime: string
  EndDateTime: string
  StaffId: number
  LocationId: number
  SessionTypeId: number
}

export interface MindbodyAppointment {
  Id: number
  ClientId: number
  LocationId: number
  StaffId: number
  StartDateTime: string
  EndDateTime: string
  Status: string
  Notes?: string
}

// ===========================================
// BOOKING FLOW TYPES
// ===========================================

export type BookingStep =
  | 'auth'
  | 'location'
  | 'services'
  | 'addons'
  | 'datetime'  // Now step 5 - select date and time first
  | 'staff'     // Now step 6 - select therapist based on date/time
  | 'confirm'
  | 'success'

export const BOOKING_STEPS: BookingStep[] = [
  'auth',
  'location',
  'services',
  'addons',
  'datetime',  // Date/time before staff
  'staff',     // Staff after date/time
  'confirm',
  'success'
]

export const STEP_NUMBERS: Record<BookingStep, number> = {
  auth: 1,
  location: 2,
  services: 3,
  addons: 4,
  datetime: 5,  // Now step 5
  staff: 6,     // Now step 6
  confirm: 7,
  success: 8
}

// ===========================================
// CLIENT LOOKUP TYPES
// ===========================================

export interface ClientLookupResult {
  found: boolean
  clients: MindbodyClient[]
  count: number
}

export type IdentifierType = 'email' | 'phone' | null

// ===========================================
// CART & PRICING TYPES
// ===========================================

export interface CartItem {
  service: MindbodyService
  isAddon: boolean
  isPromotion: boolean
}

export interface CartPricing {
  // Individual items
  services: MindbodyService[]
  addons: MindbodyService[]
  
  // Subtotals
  servicesSubtotal: number
  addonsSubtotal: number
  
  // Promotion
  hasPromotion: boolean
  promotionName: string | null
  promotionPrice: number | null
  promotionDiscount: number

  // Global online discount (applies when no promotion is active)
  hasGlobalDiscount: boolean
  globalDiscountPercent: number
  globalDiscountAmount: number

  // Tax calculation
  subtotalBeforeTax: number
  itbmRate: number
  itbmAmount: number
  
  // Final
  totalWithTax: number
  
  // Duration
  totalDuration: number
}

// ===========================================
// TIME SLOT TYPES
// ===========================================

export interface TimeSlot {
  time: string // "09:00"
  displayTime: string // "9:00 AM"
  available: boolean
  // Staff IDs that have availability for this slot (can accommodate total duration)
  availableStaffIds: number[]
}

export interface AvailableDate {
  date: string // "2026-01-15"
  displayDate: string // "Miércoles, 15 de Enero"
  hasAvailability: boolean
  slotsCount: number
  slots?: TimeSlot[] // Time slots for this date
}

// ===========================================
// BOOKING REQUEST/RESPONSE TYPES
// ===========================================

export interface BookingRequest {
  clientId: number
  locationId: number
  services: {
    sessionTypeId: number
    staffId: number | null
    startDateTime: string
  }[]
  notes?: string
  promotionId?: string
}

export interface BookingResponse {
  success: boolean
  appointments: MindbodyAppointment[]
  confirmationNumber?: string
  error?: string
}

export interface BookingConfirmation {
  success: boolean
  confirmationNumber: string
  appointments: {
    service: MindbodyService
    staff: MindbodyStaff | null
    dateTime: string
  }[]
  location: MindbodyLocation
  client: MindbodyClient
  pricing: CartPricing
  // Partial booking info
  totalBooked?: number
  totalRequested?: number
  partialBookingWarning?: string | null
}

// ===========================================
// PROMOTION TYPES (Extended)
// ===========================================

export interface PromotionWithServices {
  id: string
  title_es: string
  title_en: string | null
  description_es: string | null
  description_en: string | null
  price: number
  originalPrice?: number
  duration_minutes: number | null
  image_url: string | null
  valid_from: string
  valid_until: string
  is_active: boolean
  
  // Mindbody integration
  mindbody_promotion_id: string | null
  mindbody_service_ids: string[]
  services?: MindbodyService[] // Populated services
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface MindbodyApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface MindbodyTokenResponse {
  AccessToken: string
  TokenType: string
}

// ===========================================
// FORM TYPES
// ===========================================

export interface ClientRegistrationForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate?: string
  gender?: 'Male' | 'Female' | 'Other'
}

// ===========================================
// ERROR TYPES
// ===========================================

export interface BookingError {
  code: string
  message: string
  field?: string
}

export const BOOKING_ERROR_CODES = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
  MULTIPLE_CLIENTS: 'MULTIPLE_CLIENTS',
  NO_AVAILABILITY: 'NO_AVAILABILITY',
  SLOT_TAKEN: 'SLOT_TAKEN',
  BOOKING_FAILED: 'BOOKING_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
} as const
