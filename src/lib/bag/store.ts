'use client'

import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { track } from '@/lib/track'

/**
 * Site-wide bag ("Bolsa"): one booking session (the widget's configured
 * services + slot) plus any number of gift cards. Services are slot-held —
 * they enter the bag WITH their time; availability is revalidated at
 * checkout and again at booking (proposal §4: the Equinox pattern).
 *
 * localStorage with a 24h TTL. Never stores PII — only selections.
 */

export interface BagService {
  sessionTypeId: number
  name: string
  /** Display price in cents, tax-EXCLUSIVE (matches the widget's menu prices). */
  priceCents: number
  durationMinutes?: number
  isAddon?: boolean
}

export interface BagSession {
  locationId: number
  locationName: string
  services: BagService[]
  staffId?: number
  staffRequested?: boolean
  staffName?: string
  /** Panama local, no offset — widget convention. */
  startDateTime: string
}

export interface BagGiftCard {
  key: string
  catalogItemId: string
  name: string
  /** Face value in cents (monetary cards — untaxed). */
  amountCents: number
  recipientName?: string
  recipientEmail?: string
  message?: string
  deliveryDate?: string
}

interface BagState {
  session: BagSession | null
  giftCards: BagGiftCard[]
  isOpen: boolean
  savedAt: number | null
  setSession: (session: BagSession) => void
  clearSession: () => void
  addGiftCard: (gc: Omit<BagGiftCard, 'key'>) => void
  removeGiftCard: (key: string) => void
  clearBag: () => void
  openBag: () => void
  closeBag: () => void
}

const BAG_TTL_HOURS = 24

const expiringLocalStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(name)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      const savedAt = parsed?.state?.savedAt
      if (typeof savedAt === 'number' && Date.now() - savedAt > BAG_TTL_HOURS * 3600_000) {
        window.localStorage.removeItem(name)
        return null
      }
    } catch {
      return null
    }
    return raw
  },
  setItem: (name, value) => window.localStorage.setItem(name, value),
  removeItem: (name) => window.localStorage.removeItem(name),
}

export const useBagStore = create<BagState>()(
  persist(
    (set) => ({
      session: null,
      giftCards: [],
      isOpen: false,
      savedAt: null,

      setSession: (session) => set({ session, savedAt: Date.now() }),
      clearSession: () => set({ session: null, savedAt: Date.now() }),
      addGiftCard: (gc) =>
        set((s) => ({
          giftCards: [...s.giftCards, { ...gc, key: crypto.randomUUID() }],
          savedAt: Date.now(),
        })),
      removeGiftCard: (key) =>
        set((s) => ({
          giftCards: s.giftCards.filter((g) => g.key !== key),
          savedAt: Date.now(),
        })),
      clearBag: () => set({ session: null, giftCards: [], savedAt: Date.now() }),
      openBag: () => {
        const { session, giftCards } = useBagStore.getState()
        track('bag_open', {
          meta: {
            services: session?.services.length ?? 0,
            giftCards: giftCards.length,
            valueCents: bagDisplayTotals({ session, giftCards }).totalCents,
          },
        })
        set({ isOpen: true })
      },
      closeBag: () => set({ isOpen: false }),
    }),
    {
      name: 'mimosa-bag',
      version: 1,
      storage: createJSONStorage(() => expiringLocalStorage),
      partialize: (s) => ({
        session: s.session,
        giftCards: s.giftCards,
        savedAt: s.savedAt,
      }),
    }
  )
)

export const selectBagCount = (s: Pick<BagState, 'session' | 'giftCards'>): number =>
  (s.session?.services.length ?? 0) + s.giftCards.length

/** Client-side display totals (cents). Server totals are authoritative at checkout. */
export function bagDisplayTotals(s: Pick<BagState, 'session' | 'giftCards'>) {
  const servicesNet = s.session?.services.reduce((sum, x) => sum + x.priceCents, 0) ?? 0
  const itbms = Math.round(servicesNet * 0.07)
  const giftCards = s.giftCards.reduce((sum, g) => sum + g.amountCents, 0)
  return {
    servicesNetCents: servicesNet,
    itbmsCents: itbms,
    giftCardsCents: giftCards,
    totalCents: servicesNet + itbms + giftCards,
  }
}
