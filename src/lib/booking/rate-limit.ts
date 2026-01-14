// ===========================================
// SIMPLE IN-MEMORY RATE LIMITER
// For production, consider using Redis or Upstash
// ===========================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production, use Redis-based rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
  lastCleanup = now
}

export interface RateLimitConfig {
  // Maximum number of requests allowed in the window
  limit: number
  // Time window in seconds
  windowSec: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number // seconds until reset
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP or user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup()

  const now = Date.now()
  const windowMs = config.windowSec * 1000
  const key = identifier

  const entry = rateLimitStore.get(key)

  // No existing entry - create one
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      success: true,
      remaining: config.limit - 1,
      resetIn: config.windowSec
    }
  }

  // Existing entry - check if limit exceeded
  if (entry.count >= config.limit) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetIn
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000)
  }
}

/**
 * Get client identifier from request
 * Uses IP address or forwarded-for header
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxied requests)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  // In production behind a proxy, this should rarely be reached
  return 'unknown'
}

// ===========================================
// PRESET CONFIGURATIONS
// ===========================================

// Standard API endpoint - 60 requests per minute
export const RATE_LIMIT_STANDARD: RateLimitConfig = {
  limit: 60,
  windowSec: 60
}

// Auth endpoints - 10 requests per minute (stricter)
export const RATE_LIMIT_AUTH: RateLimitConfig = {
  limit: 10,
  windowSec: 60
}

// Booking endpoint - 5 requests per minute (very strict to prevent abuse)
export const RATE_LIMIT_BOOKING: RateLimitConfig = {
  limit: 5,
  windowSec: 60
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetIn),
    ...(result.success ? {} : { 'Retry-After': String(result.resetIn) })
  }
}
