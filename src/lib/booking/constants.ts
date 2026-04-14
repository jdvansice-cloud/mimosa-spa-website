// ===========================================
// BOOKING CONSTANTS
// Shared constants for the booking system
// ===========================================

// ITBM Tax Rate (Panama)
// Single source of truth for tax calculations
export const ITBM_TAX_RATE = 0.07

// Timezone for Panama
export const PANAMA_TIMEZONE = 'America/Panama'

// Program IDs from Mindbody
export const PROGRAM_IDS = {
  TRATAMIENTOS_CORPORALES: 4,
  PAQUETES_DELUXE: 5,
  TRATAMIENTOS_FACIALES: 6,
  ADICIONALES: 8,
  TRATAMIENTOS_PAREJAS: 11,
  ADICIONALES_EN_CABINA: 12,
  EVENTOS: 13,
  PAQUETES_MASAJES: 19,
  TAI: 20,
  PAREJAS: 21,
} as const

// Spanish program names from Mindbody
export const PROGRAM_NAMES: Record<number, string> = {
  [PROGRAM_IDS.TRATAMIENTOS_CORPORALES]: 'Tratamientos Corporales',
  [PROGRAM_IDS.PAQUETES_DELUXE]: 'Paquetes Deluxe',
  [PROGRAM_IDS.TRATAMIENTOS_FACIALES]: 'Tratamientos Faciales',
  [PROGRAM_IDS.ADICIONALES]: 'Adicionales',
  [PROGRAM_IDS.TRATAMIENTOS_PAREJAS]: 'Tratamientos Parejas',
  [PROGRAM_IDS.ADICIONALES_EN_CABINA]: 'Adicionales en Cabina',
  [PROGRAM_IDS.EVENTOS]: 'Eventos',
  [PROGRAM_IDS.PAQUETES_MASAJES]: 'Paquetes de Masajes',
  [PROGRAM_IDS.TAI]: 'TAI',
  [PROGRAM_IDS.PAREJAS]: 'Parejas',
}

// Error messages in Spanish
export const ERROR_MESSAGES = {
  // Generic errors
  GENERIC_ERROR: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
  CONNECTION_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',

  // Auth errors
  CLIENT_NOT_FOUND: 'No encontramos un perfil con esta información. ¿Deseas registrarte?',
  INVALID_EMAIL: 'Por favor, ingresa un correo electrónico válido.',
  INVALID_PHONE: 'Por favor, ingresa un número de teléfono válido.',
  REGISTRATION_FAILED: 'No pudimos completar el registro. Por favor, intenta nuevamente.',

  // Booking errors
  NO_AVAILABILITY: 'No hay disponibilidad para la fecha seleccionada.',
  BOOKING_FAILED: 'No pudimos completar tu reserva. Por favor, intenta nuevamente.',
  PARTIAL_BOOKING: 'Algunos servicios no pudieron ser reservados. Te contactaremos para confirmar.',

  // Service errors
  SERVICES_LOAD_FAILED: 'Error al cargar los servicios. Por favor, intenta nuevamente.',
  STAFF_LOAD_FAILED: 'Error al cargar los terapeutas. Por favor, intenta nuevamente.',
  LOCATIONS_LOAD_FAILED: 'Error al cargar las ubicaciones. Por favor, intenta nuevamente.',

  // Validation errors
  REQUIRED_FIELD: 'Este campo es requerido.',
  INVALID_DATE: 'Por favor, selecciona una fecha válida.',
  INVALID_TIME: 'Por favor, selecciona una hora válida.',
} as const

// Phone number normalization
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Handle Panama phone numbers
  // If 8 digits, it's a local Panama number
  if (digits.length === 8) {
    return digits
  }

  // If starts with 507 (Panama country code), remove it
  if (digits.startsWith('507') && digits.length === 11) {
    return digits.slice(3)
  }

  // If starts with +507, handle similarly
  if (digits.length > 8) {
    // Return last 8 digits for Panama
    return digits.slice(-8)
  }

  return digits
}

// Compare phone numbers accounting for different formats
export function phoneNumbersMatch(phone1: string, phone2: string): boolean {
  const normalized1 = normalizePhoneNumber(phone1)
  const normalized2 = normalizePhoneNumber(phone2)

  // Exact match after normalization
  if (normalized1 === normalized2) {
    return true
  }

  // Check if one ends with the other (for partial matches)
  if (normalized1.length >= 8 && normalized2.length >= 8) {
    return normalized1.endsWith(normalized2.slice(-8)) ||
           normalized2.endsWith(normalized1.slice(-8))
  }

  return false
}

// Date/time formatting for Panama timezone
export function formatDateForPanama(date: Date): string {
  return date.toLocaleDateString('es-PA', {
    timeZone: PANAMA_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTimeForPanama(date: Date): string {
  return date.toLocaleTimeString('es-PA', {
    timeZone: PANAMA_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Convert a local Panama time string to UTC for API calls
export function panamaTimeToUTC(dateStr: string, timeStr: string): Date {
  // Create date in Panama timezone
  const dateTimeStr = `${dateStr}T${timeStr}:00`

  // Parse as Panama time and convert to UTC
  const panamaDate = new Date(dateTimeStr)

  // Get the timezone offset for Panama (UTC-5)
  // Note: This is a simplified approach. For production, consider using a library like date-fns-tz
  const panamaOffset = -5 * 60 // minutes
  const localOffset = panamaDate.getTimezoneOffset()
  const offsetDiff = panamaOffset - localOffset

  return new Date(panamaDate.getTime() - offsetDiff * 60 * 1000)
}

// Get current time in Panama timezone for comparisons
// This is critical for Vercel deployments where server runs in UTC
export function getCurrentPanamaTime(): Date {
  // Get current UTC time
  const now = new Date()

  // Format current time in Panama timezone and parse it back
  // This gives us the "wall clock" time in Panama
  const panamaTimeStr = now.toLocaleString('en-US', {
    timeZone: PANAMA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  // Parse back: "01/15/2025, 14:30:00" -> Date object
  // The parsed date will be in local server time, but represents Panama wall clock time
  return new Date(panamaTimeStr)
}

// Check if a datetime string (YYYY-MM-DDTHH:MM:SS) is in the past for Panama timezone
export function isDateTimeInPastForPanama(dateTimeStr: string): boolean {
  // The dateTimeStr is in format "2025-01-15T14:30:00" representing Panama local time
  const bookingTime = new Date(dateTimeStr)
  const panamaTime = getCurrentPanamaTime()

  return bookingTime < panamaTime
}

// Validate required fields for API requests
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const field of requiredFields) {
    const value = data[field]
    if (value === undefined || value === null || value === '') {
      missing.push(String(field))
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

// Sanitize error for client response (remove sensitive info)
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose stack traces or internal details
    const message = error.message

    // Check for common error patterns and return user-friendly messages
    if (message.includes('MINDBODY_API_KEY')) {
      return ERROR_MESSAGES.GENERIC_ERROR
    }
    if (message.includes('fetch') || message.includes('network')) {
      return ERROR_MESSAGES.CONNECTION_ERROR
    }
    if (message.includes('token')) {
      return ERROR_MESSAGES.GENERIC_ERROR
    }
    // Mindbody 5xx / gateway errors — never expose raw server messages
    if (message.match(/Mindbody API error: 5\d\d/) || message.includes('Bad Gateway') || message.includes('Service Unavailable')) {
      return ERROR_MESSAGES.CONNECTION_ERROR
    }
    // Last-resort: strip any stray HTML tags before returning
    if (message.includes('<') && message.includes('>')) {
      return ERROR_MESSAGES.GENERIC_ERROR
    }

    // Return the message if it doesn't contain sensitive info
    return message
  }

  return ERROR_MESSAGES.GENERIC_ERROR
}
