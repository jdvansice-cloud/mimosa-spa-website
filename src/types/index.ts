// ===========================================
// DATABASE TYPES
// ===========================================

// Re-export booking types
export * from './booking'

export interface Promotion {
  id: string
  title_es: string
  title_en: string | null
  description_es: string | null
  description_en: string | null
  services: string[]
  price: number
  original_price: number | null
  duration_minutes: number | null
  image_url: string | null
  valid_from: string
  valid_until: string
  is_active: boolean
  sort_order: number
  mindbody_service_id: string | null
  mindbody_service_ids: number[]
  promo_code: string | null
  discount_type: 'Percent' | 'Amount' | null
  discount_amount: number | null
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title_es: string | null
  title_en: string | null
  description_es: string | null
  description_en: string | null
  image_url: string
  thumbnail_url: string | null
  category: GalleryCategory | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type GalleryCategory = 'spa' | 'treatments' | 'facilities' | 'team' | 'ambiance'

export interface SiteImage {
  id: string
  key: string
  name: string
  description: string | null
  image_url: string
  recommended_width: number | null
  recommended_height: number | null
  aspect_ratio: string | null
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface BookingServiceItem {
  sessionTypeId: number
  name: string
  duration: number
}

export interface Booking {
  id: string
  confirmation_number: string
  status: 'confirmed' | 'partial' | 'failed'
  mindbody_client_id: number
  client_name: string | null
  client_phone: string | null
  client_email: string | null
  location_id: number
  location_name: string | null
  staff_id: number | null
  therapist_name: string | null
  appointment_start: string
  services: BookingServiceItem[]
  total_duration: number | null
  mindbody_appointment_ids: number[]
  promotion_name: string | null
  total_requested: number
  total_booked: number
  subtotal_before_tax: number | null
  tax_amount: number | null
  total_with_tax: number | null
  whatsapp_sent: boolean
  created_at: string
  updated_at: string
}

// ===========================================
// MINDBODY API TYPES
// ===========================================

export interface MindbodyLocation {
  Id: number
  Name: string
  Address: string
  City: string
  Phone: string
}

export interface MindbodyService {
  Id: number
  Name: string
  Description: string | null
  Duration: number
  Price: number
  OnlineBooking: boolean
  Category: string
  ProgramId: number
}

export interface MindbodyStaff {
  Id: number
  FirstName: string
  LastName: string
  DisplayName: string
  Bio: string | null
  ImageUrl: string | null
  AppointmentTrn: boolean
}

export interface MindbodyAvailability {
  StartDateTime: string
  EndDateTime: string
  StaffId: number
  LocationId: number
}

export interface MindbodyClient {
  Id: number
  FirstName: string
  LastName: string
  Email: string
  MobilePhone: string
}

// ===========================================
// COMPONENT PROPS
// ===========================================

export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface ServiceCardProps {
  id: number
  name: string
  description: string | null
  duration: number
  price: number
  onBook?: () => void
}

export interface PromotionCardProps {
  promotion: Promotion
  locale: string
  onBook?: () => void
}

export interface CategoryCardProps {
  title: string
  image: string
  href: string
  description?: string
}

export interface GalleryImageProps {
  image: GalleryImage
  locale: string
  onClick?: () => void
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ===========================================
// FORM TYPES
// ===========================================

export interface PromotionFormData {
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  services: string[]
  price: number
  original_price: number | null
  duration_minutes: number
  valid_from: string
  valid_until: string
  is_active: boolean
  sort_order: number
  mindbody_service_ids: number[]
}

export interface GalleryFormData {
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  category: GalleryCategory
  is_featured: boolean
  is_active: boolean
  sort_order: number
}

// ===========================================
// CONTEXT TYPES
// ===========================================

export interface BookingContext {
  isOpen: boolean
  serviceId: number | null
  openBooking: (serviceId?: number) => void
  closeBooking: () => void
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

// ===========================================
// UTILITY TYPES
// ===========================================

export type Locale = 'es' | 'en'

export interface LocalizedContent {
  es: string
  en: string
}

export type WithLocale<T> = T & { locale: Locale }

// Profile type (extends auth.users)
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: 'user' | 'admin'
  mindbody_client_id: number | null
  created_at: string
  updated_at: string
}

// Profile update type
export interface ProfileUpdate {
  email?: string | null
  full_name?: string | null
  role?: 'user' | 'admin'
  mindbody_client_id?: number | null
}

// Supabase Database types (generated from schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: ProfileUpdate
      }
      promotions: {
        Row: Promotion
        Insert: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Promotion, 'id' | 'created_at' | 'updated_at'>>
      }
      gallery_images: {
        Row: GalleryImage
        Insert: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>>
      }
      site_settings: {
        Row: SiteSetting
        Insert: Omit<SiteSetting, 'id' | 'updated_at'>
        Update: Partial<Omit<SiteSetting, 'id' | 'updated_at'>>
      }
    }
  }
}
