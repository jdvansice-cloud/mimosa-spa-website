'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ClientVisit, ClientPurchase, ClientScheduledVisit } from '@/lib/booking/mindbody'
import type { User, Session } from '@supabase/supabase-js'

// Client info stored in portal (from Mindbody)
export interface PortalClient {
  Id: number
  FirstName: string
  LastName: string
  Email: string | null
  MobilePhone: string | null
}

// Portal state interface
interface PortalState {
  // Supabase Auth state
  user: User | null
  session: Session | null

  // Mindbody client state
  client: PortalClient | null
  mindbodyClientId: number | null

  // Data state
  visits: ClientVisit[]
  purchases: ClientPurchase[]
  upcomingAppointments: ClientScheduledVisit[]

  // UI state
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  activeTab: 'dashboard' | 'history' | 'purchases' | 'upcoming' | 'profile'

  // Actions
  setAuth: (user: User | null, session: Session | null) => void
  setMindbodyClient: (client: PortalClient | null, clientId: number | null) => void
  logout: () => void
  setVisits: (visits: ClientVisit[]) => void
  setPurchases: (purchases: ClientPurchase[]) => void
  setUpcomingAppointments: (appointments: ClientScheduledVisit[]) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void
  setActiveTab: (tab: PortalState['activeTab']) => void
  clearData: () => void
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      session: null,
      client: null,
      mindbodyClientId: null,
      visits: [],
      purchases: [],
      upcomingAppointments: [],
      isLoading: false,
      isInitialized: false,
      error: null,
      activeTab: 'dashboard',

      // Actions
      setAuth: (user, session) => set({
        user,
        session,
        error: null
      }),

      setMindbodyClient: (client, clientId) => set({
        client,
        mindbodyClientId: clientId
      }),

      logout: () => set({
        user: null,
        session: null,
        client: null,
        mindbodyClientId: null,
        visits: [],
        purchases: [],
        upcomingAppointments: [],
        error: null,
        activeTab: 'dashboard'
      }),

      setVisits: (visits) => set({ visits }),
      setPurchases: (purchases) => set({ purchases }),
      setUpcomingAppointments: (appointments) => set({ upcomingAppointments: appointments }),
      setLoading: (loading) => set({ isLoading: loading }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setError: (error) => set({ error }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      clearData: () => set({
        visits: [],
        purchases: [],
        upcomingAppointments: []
      })
    }),
    {
      name: 'mimosa-portal-storage',
      partialize: (state) => ({
        mindbodyClientId: state.mindbodyClientId,
        client: state.client
      })
    }
  )
)

// Selectors
export const selectUser = (state: PortalState) => state.user
export const selectSession = (state: PortalState) => state.session
export const selectClient = (state: PortalState) => state.client
export const selectMindbodyClientId = (state: PortalState) => state.mindbodyClientId
export const selectVisits = (state: PortalState) => state.visits
export const selectPurchases = (state: PortalState) => state.purchases
export const selectUpcomingAppointments = (state: PortalState) => state.upcomingAppointments
export const selectIsAuthenticated = (state: PortalState) => !!state.session

// Helper hooks for data fetching
export function usePortalData() {
  const {
    mindbodyClientId,
    setVisits,
    setPurchases,
    setUpcomingAppointments,
    setLoading,
    setError
  } = usePortalStore()

  const fetchAllData = async () => {
    if (!mindbodyClientId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=all`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar datos')
      }

      if (data.visits) setVisits(data.visits.visits || [])
      if (data.purchases) setPurchases(data.purchases.purchases || [])
      if (data.upcoming) setUpcomingAppointments(data.upcoming.visits || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const fetchVisits = async () => {
    if (!mindbodyClientId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=visits`)
      const data = await response.json()
      if (data.visits) setVisits(data.visits.visits || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchases = async () => {
    if (!mindbodyClientId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=purchases`)
      const data = await response.json()
      if (data.purchases) setPurchases(data.purchases.purchases || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcoming = async () => {
    if (!mindbodyClientId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=upcoming`)
      const data = await response.json()
      if (data.upcoming) setUpcomingAppointments(data.upcoming.visits || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchAllData,
    fetchVisits,
    fetchPurchases,
    fetchUpcoming
  }
}
