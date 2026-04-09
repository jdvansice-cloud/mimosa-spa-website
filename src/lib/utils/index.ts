/**
 * Combines class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ')
}

/**
 * Format price in USD
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number, locale: string = 'es'): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (locale === 'es') {
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
    }
    return `${hours}h ${remainingMinutes}min`
  }
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, locale: string = 'es'): string {
  // Parse date strings as local dates (not UTC) to avoid timezone shift
  // e.g. "2026-04-01" should display as April 1, not March 31
  let d: Date
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number)
    d = new Date(year, month - 1, day)
  } else {
    d = typeof date === 'string' ? new Date(date) : date
  }

  return new Intl.DateTimeFormat(locale === 'es' ? 'es-PA' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Get localized content from an object with _es and _en properties
 */
export function getLocalizedContent(
  obj: object,
  field: string,
  locale: string
): string {
  const localizedField = `${field}_${locale}`
  const fallbackField = `${field}_es`
  const record = obj as Record<string, unknown>
  
  return (record[localizedField] as string) || (record[fallbackField] as string) || ''
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generate WhatsApp URL
 */
export function getWhatsAppUrl(phoneNumber: string, message?: string): string {
  const baseUrl = 'https://wa.me/'
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  if (message) {
    return `${baseUrl}${cleanNumber}?text=${encodeURIComponent(message)}`
  }
  
  return `${baseUrl}${cleanNumber}`
}

/**
 * Check if a promotion is currently valid
 */
export function isPromotionValid(validFrom: string, validUntil: string): boolean {
  const now = new Date()
  const from = new Date(validFrom)
  const until = new Date(validUntil)
  
  return now >= from && now <= until
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
