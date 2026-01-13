import { create } from 'zustand'
import type {
  BookingStep,
  CartService,
  MindbodyLocation,
  MindbodyStaff,
  MindbodyClient,
  PromotionWithServices,
  CartPricing,
} from '@/types/booking'

// ITBM Tax Rate (7%)
export const ITBM_RATE = 0.07

interface BookingState {
  // Current step
  currentStep: BookingStep
  
  // Client info
  clientEmail: string
  clientPhone: string
  client: MindbodyClient | null
  availableClients: MindbodyClient[]
  
  // Location
  selectedLocation: MindbodyLocation | null
  
  // Services and addons
  selectedServices: CartService[]
  selectedAddons: CartService[]
  
  // Promotion
  activePromotion: PromotionWithServices | null
  
  // Staff selection
  selectedStaff: MindbodyStaff | null
  
  // Date/time selection
  selectedDate: string | null
  selectedTime: string | null
  
  // Booking result
  bookingConfirmation: CartPricing | null
  
  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  setStep: (step: BookingStep) => void
  setClientEmail: (email: string) => void
  setClientPhone: (phone: string) => void
  setClient: (client: MindbodyClient | null) => void
  setAvailableClients: (clients: MindbodyClient[]) => void
  setLocation: (location: MindbodyLocation | null) => void
  addService: (service: CartService) => void
  removeService: (serviceId: string) => void
  addAddon: (addon: CartService) => void
  removeAddon: (addonId: string) => void
  setPromotion: (promotion: PromotionWithServices | null) => void
  setStaff: (staff: MindbodyStaff | null) => void
  setDate: (date: string | null) => void
  setTime: (time: string | null) => void
  setBookingConfirmation: (confirmation: CartPricing | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearCart: () => void
  reset: () => void
}

const initialState = {
  currentStep: 'login' as BookingStep,
  clientEmail: '',
  clientPhone: '',
  client: null,
  availableClients: [],
  selectedLocation: null,
  selectedServices: [],
  selectedAddons: [],
  activePromotion: null,
  selectedStaff: null,
  selectedDate: null,
  selectedTime: null,
  bookingConfirmation: null,
  isLoading: false,
  error: null,
}

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  
  setClientEmail: (email) => set({ clientEmail: email }),
  
  setClientPhone: (phone) => set({ clientPhone: phone }),
  
  setClient: (client) => set({ client }),
  
  setAvailableClients: (clients) => set({ availableClients: clients }),
  
  setLocation: (location) => set({ selectedLocation: location }),
  
  addService: (service) => set((state) => {
    // Check if service already exists
    if (state.selectedServices.some(s => s.Id === service.Id)) {
      return state
    }
    return { selectedServices: [...state.selectedServices, service] }
  }),
  
  removeService: (serviceId) => set((state) => ({
    selectedServices: state.selectedServices.filter(s => s.Id !== serviceId)
  })),
  
  addAddon: (addon) => set((state) => {
    // Check if addon already exists
    if (state.selectedAddons.some(a => a.Id === addon.Id)) {
      return state
    }
    return { selectedAddons: [...state.selectedAddons, { ...addon, isAddon: true }] }
  }),
  
  removeAddon: (addonId) => set((state) => ({
    selectedAddons: state.selectedAddons.filter(a => a.Id !== addonId)
  })),
  
  setPromotion: (promotion) => set({ activePromotion: promotion }),
  
  setStaff: (staff) => set({ selectedStaff: staff }),
  
  setDate: (date) => set({ selectedDate: date }),
  
  setTime: (time) => set({ selectedTime: time }),
  
  setBookingConfirmation: (confirmation) => set({ bookingConfirmation: confirmation }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearCart: () => set({
    selectedServices: [],
    selectedAddons: [],
    activePromotion: null,
  }),
  
  reset: () => set(initialState),
}))

// Helper function to calculate pricing (pure function, no state updates)
export function calculatePricing(
  services: CartService[],
  addons: CartService[],
  activePromotion: PromotionWithServices | null
): CartPricing {
  const servicesSubtotal = services.reduce((sum, s) => sum + s.Price, 0)
  const addonsSubtotal = addons.reduce((sum, a) => sum + a.Price, 0)
  
  const hasPromotion = activePromotion !== null
  let promotionDiscount = 0
  let finalServicesPrice = servicesSubtotal
  
  if (hasPromotion && activePromotion) {
    finalServicesPrice = activePromotion.price
    promotionDiscount = servicesSubtotal - finalServicesPrice
  }
  
  const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
  const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
  const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100
  
  const totalDuration = services.reduce((sum, s) => sum + (s.Duration || 0), 0) +
                        addons.reduce((sum, a) => sum + (a.Duration || 0), 0)
  
  return {
    services,
    addons,
    servicesSubtotal,
    addonsSubtotal,
    hasPromotion,
    promotionName: activePromotion?.title_es || null,
    promotionPrice: hasPromotion ? activePromotion!.price : null,
    promotionDiscount,
    subtotalBeforeTax,
    itbmRate: ITBM_RATE,
    itbmAmount,
    totalWithTax,
    totalDuration,
  }
}
