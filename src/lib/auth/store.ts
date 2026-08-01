'use client'

import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  otpEmail: string | null // email waiting for OTP verification

  // Actions
  initialize: () => Promise<void>
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>
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
  otpEmail: null,

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

  sendOtp: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }, // only allow existing users
      })
      if (error) {
        set({ error: 'No se pudo enviar el código. Verifica que el correo esté registrado.', isLoading: false })
        return { success: false, error: error.message }
      }
      set({ otpEmail: email, isLoading: false })
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  verifyOtp: async (email: string, token: string) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })

      if (error) {
        set({ error: 'Código incorrecto o expirado.', isLoading: false })
        return { success: false, error: error.message }
      }

      // Check admin role in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user!.id)
        .single() as { data: { role: string } | null; error: unknown }

      if (!profile || (profile.role !== 'admin' && profile.role !== 'mobile_manager')) {
        await supabase.auth.signOut()
        set({ error: 'No tienes permisos de administrador.', isLoading: false, user: null, session: null })
        return { success: false, error: 'Not admin' }
      }

      set({ user: data.user, session: data.session, isLoading: false, otpEmail: null })
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
