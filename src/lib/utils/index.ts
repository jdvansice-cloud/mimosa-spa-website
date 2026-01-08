import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Note: You'll need to install clsx and tailwind-merge if not already
// For now, we'll use a simple implementation

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
  const d = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-PA' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Get localized content from an object with _es and _en properties
 */
export function getLocalizedContent<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: string
): string {
  const localizedField = `${field}_${locale}` as keyof T
  const fallbackField = `${field}_es` as keyof T
  
  return (obj[localizedField] as string) || (obj[fallbackField] as string) || ''
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
