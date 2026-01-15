'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ClientVisit, ClientPurchase, ClientScheduledVisit } from '@/lib/booking/mindbody'

// Client info stored in portal
export interface PortalClient {
  Id: number
  FirstName: string
  LastName: string
  Email: string | null
  MobilePhone: string | null
}

// Portal state interface
interface PortalState {
  // Auth state
  isAuthenticated: boolean
  client: PortalClient | null

  // Data state
  visits: ClientVisit[]
  purchases: ClientPurchase[]
  upcomingAppointments: ClientScheduledVisit[]

  // UI state
  isLoading: boolean
  error: string | null
  activeTab: 'dashboard' | 'history' | 'purchases' | 'upcoming' | 'profile'

  // Actions
  login: (client: PortalClient) => void
  logout: () => void
  setVisits: (visits: ClientVisit[]) => void
  setPurchases: (purchases: ClientPurchase[]) => void
  setUpcomingAppointments: (appointments: ClientScheduledVisit[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setActiveTab: (tab: PortalState['activeTab']) => void
  clearData: () => void
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      client: null,
      visits: [],
      purchases: [],
      upcomingAppointments: [],
      isLoading: false,
      error: null,
      activeTab: 'dashboard',

      // Actions
      login: (client) => set({
        isAuthenticated: true,
        client,
        error: null
      }),

      logout: () => set({
        isAuthenticated: false,
        client: null,
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
        isAuthenticated: state.isAuthenticated,
        client: state.client
      })
    }
  )
)

// Selectors
export const selectIsAuthenticated = (state: PortalState) => state.isAuthenticated
export const selectClient = (state: PortalState) => state.client
export const selectVisits = (state: PortalState) => state.visits
export const selectPurchases = (state: PortalState) => state.purchases
export const selectUpcomingAppointments = (state: PortalState) => state.upcomingAppointments

// Helper hooks for data fetching
export function usePortalData() {
  const {
    client,
    setVisits,
    setPurchases,
    setUpcomingAppointments,
    setLoading,
    setError
  } = usePortalStore()

  const fetchAllData = async () => {
    if (!client) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/portal/history?clientId=${client.Id}&type=all`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar datos')
      }

      if (data.visits) setVisits(data.visits.visits)
      if (data.purchases) setPurchases(data.purchases.purchases)
      if (data.upcoming) setUpcomingAppointments(data.upcoming.visits)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const fetchVisits = async () => {
    if (!client) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portal/history?clientId=${client.Id}&type=visits`)
      const data = await response.json()
      if (data.visits) setVisits(data.visits.visits)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchases = async () => {
    if (!client) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portal/history?clientId=${client.Id}&type=purchases`)
      const data = await response.json()
      if (data.purchases) setPurchases(data.purchases.purchases)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcoming = async () => {
    if (!client) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portal/history?clientId=${client.Id}&type=upcoming`)
      const data = await response.json()
      if (data.upcoming) setUpcomingAppointments(data.upcoming.visits)
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
