// Mindbody Service Types
export interface MindbodyService {
  Id: string
  ProductId: number
  Name: string
  Price: number  // This is the price WITHOUT ITBM (after we remove it)
  OnlinePrice: number
  Duration?: number
  Description?: string
  ProgramId: number
  SellOnline: boolean
  Count?: number
}

export interface MindbodyProgram {
  Id: number
  Name: string
  ScheduleType: string
  CancelOffset?: number
}

export interface MindbodyStaff {
  Id: number
  FirstName: string
  LastName: string
  DisplayName?: string
  ImageUrl?: string
  Bio?: string
  AppointmentInstructor?: boolean
}

export interface MindbodyLocation {
  Id: number
  Name: string
  Address?: string
  Address2?: string
  City?: string
  Phone?: string
}

export interface MindbodyClient {
  Id: string
  UniqueId?: number
  FirstName: string
  LastName: string
  Email?: string
  MobilePhone?: string
}

export interface MindbodyAvailability {
  Id: number
  Staff?: MindbodyStaff
  StartDateTime: string
  EndDateTime: string
  Location?: MindbodyLocation
  SessionType?: {
    Id: number
    Name: string
  }
}

// Cart and Booking Types
export interface CartService extends MindbodyService {
  isAddon?: boolean
}

export interface CartPricing {
  services: CartService[]
  addons: CartService[]
  servicesSubtotal: number
  addonsSubtotal: number
  hasPromotion: boolean
  promotionName: string | null
  promotionPrice: number | null
  promotionDiscount: number
  subtotalBeforeTax: number
  itbmRate: number
  itbmAmount: number
  totalWithTax: number
  totalDuration: number
}

// Promotion Types
export interface Promotion {
  id: string
  title_es: string
  title_en: string
  description_es?: string
  description_en?: string
  price: number
  original_price?: number
  duration_minutes: number
  image_url?: string
  valid_until: string
  is_active: boolean
  service_ids: string[]
  created_at: string
  updated_at: string
}

export interface PromotionWithServices extends Promotion {
  services?: CartService[]
}

// Booking Flow Types
export type BookingStep = 
  | 'login'
  | 'location'
  | 'services'
  | 'addons'
  | 'staff'
  | 'datetime'
  | 'confirm'
  | 'success'

export interface BookingConfirmation {
  clientId: string
  clientName: string
  location: MindbodyLocation
  services: CartService[]
  addons: CartService[]
  staff?: MindbodyStaff
  dateTime: string
  pricing: CartPricing
  bookingId?: string
}

// API Response Types
export interface SaleServicesResponse {
  Services: MindbodyService[]
  PaginationResponse?: {
    RequestedLimit: number
    RequestedOffset: number
    PageSize: number
    TotalResults: number
  }
}

export interface ProgramsResponse {
  Programs: MindbodyProgram[]
}

export interface StaffResponse {
  StaffMembers: MindbodyStaff[]
}

export interface LocationsResponse {
  Locations: MindbodyLocation[]
}

export interface ClientsResponse {
  Clients: MindbodyClient[]
}

export interface BookableItemsResponse {
  Availabilities: MindbodyAvailability[]
}

// Category for grouping services
export interface ServiceCategory {
  id: number
  name: string
  services: MindbodyService[]
}
