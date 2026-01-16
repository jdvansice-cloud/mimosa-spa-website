import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types'

// Check if Supabase env vars are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Keep session alive for 24 hours (in seconds)
      // The session will auto-refresh before expiring
      persistSession: true,
      autoRefreshToken: true,
      // Storage key for session persistence
      storageKey: 'mimosa-spa-auth',
      // Use localStorage for persistence across browser sessions
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  })
}

// Singleton instance for client-side usage
let clientInstance: ReturnType<typeof createClient> | null = null

export function getClient() {
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}

// Check if Supabase is configured without throwing
export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseAnonKey
}
