'use client'

import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  clearError: () => void
}

// Lazy load Supabase client to avoid build errors
type SupabaseClient = ReturnType<typeof import('@/lib/supabase/client').getClient>
let supabaseInstance: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const { getClient } = require('@/lib/supabase/client')
    supabaseInstance = getClient()
  }
  return supabaseInstance as SupabaseClient
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (get().isInitialized) return

    set({ isLoading: true })

    try {
      const supabase = getSupabase()
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) throw error

      set({
        user: session?.user ?? null,
        session,
        isInitialized: true,
        isLoading: false,
      })

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          session,
        })
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({
        user: null,
        session: null,
        isInitialized: true,
        isLoading: false,
      })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({
          error: error.message === 'Invalid login credentials'
            ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
            : error.message,
          isLoading: false
        })
        return { success: false, error: error.message }
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      })

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  signOut: async () => {
    set({ isLoading: true })

    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      set({
        user: null,
        session: null,
        isLoading: false,
      })
    } catch (error) {
      console.error('Sign out error:', error)
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
