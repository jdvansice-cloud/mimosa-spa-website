import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  BookingStep,
  MindbodyLocation,
  MindbodyService,
  MindbodyStaff,
  MindbodyClient,
  TimeSlot,
  AvailableDate,
  CartPricing,
  PromotionWithServices,
  BookingConfirmation,
  IdentifierType,
  BOOKING_STEPS,
  STEP_NUMBERS,
} from '@/types/booking'

// Tax rate constant
const ITBM_RATE = parseFloat(process.env.NEXT_PUBLIC_ITBM_RATE || '0.07')

// ===========================================
// STORE STATE INTERFACE
// ===========================================

interface BookingState {
  // Progress
  currentStep: BookingStep
  isLoading: boolean
  error: string | null
  
  // Client Authentication
  clientIdentifier: string
  identifierType: IdentifierType
  clientId: number | null
  clientInfo: MindbodyClient | null
  
  // Multiple Clients Handling
  availableClients: MindbodyClient[]
  showClientSelector: boolean
  
  // Location
  selectedLocation: MindbodyLocation | null
  
  // Services
  selectedServices: MindbodyService[]
  selectedAddons: MindbodyService[]
  
  // Staff
  selectedStaff: MindbodyStaff | null
  
  // Schedule
  selectedDate: string | null // "2026-01-15"
  selectedTime: string | null // "09:00"
  
  // Promotion Link
  activePromotion: PromotionWithServices | null
  
  // Available Data (from API)
  locations: MindbodyLocation[]
  services: MindbodyService[]
  addons: MindbodyService[]
  staff: MindbodyStaff[]
  availableDates: AvailableDate[]
  availableSlots: TimeSlot[]
  
  // Booking Result
  bookingConfirmation: BookingConfirmation | null
  
  // Computed pricing (cached)
  pricing: CartPricing | null
  
  // Cart UI State
  isCartOpen: boolean
}

// ===========================================
// STORE ACTIONS INTERFACE
// ===========================================

interface BookingActions {
  // Navigation
  setStep: (step: BookingStep) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (stepNumber: number) => void
  
  // Loading & Error
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Auth Actions
  setClientIdentifier: (identifier: string) => void
  setClientInfo: (client: MindbodyClient) => void
  setAvailableClients: (clients: MindbodyClient[]) => void
  selectClient: (client: MindbodyClient) => void
  showClientSelectorModal: (show: boolean) => void
  clearClientSelection: () => void
  
  // Location
  setLocation: (location: MindbodyLocation) => void
  setLocations: (locations: MindbodyLocation[]) => void
  
  // Services
  addService: (service: MindbodyService) => void
  removeService: (serviceId: number) => void
  clearServices: () => void
  setServices: (services: MindbodyService[]) => void
  
  // Addons
  addAddon: (addon: MindbodyService) => void
  removeAddon: (addonId: number) => void
  clearAddons: () => void
  setAddons: (addons: MindbodyService[]) => void
  
  // Staff
  setStaff: (staff: MindbodyStaff | null) => void
  setStaffList: (staff: MindbodyStaff[]) => void
  
  // Schedule
  setDate: (date: string) => void
  setTime: (time: string) => void
  setAvailableDates: (dates: AvailableDate[]) => void
  setAvailableSlots: (slots: TimeSlot[]) => void
  
  // Promotion
  loadPromotion: (promotion: PromotionWithServices) => void
  clearPromotion: () => void
  
  // Booking
  setBookingConfirmation: (confirmation: BookingConfirmation) => void
  
  // Pricing
  calculatePricing: () => CartPricing
  
  // Reset
  reset: () => void
  resetToStep: (step: BookingStep) => void
  
  // Cart UI
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

// ===========================================
// INITIAL STATE
// ===========================================

const initialState: BookingState = {
  // Progress
  currentStep: 'auth',
  isLoading: false,
  error: null,
  
  // Client
  clientIdentifier: '',
  identifierType: null,
  clientId: null,
  clientInfo: null,
  
  // Multiple Clients
  availableClients: [],
  showClientSelector: false,
  
  // Location
  selectedLocation: null,
  
  // Services
  selectedServices: [],
  selectedAddons: [],
  
  // Staff
  selectedStaff: null,
  
  // Schedule
  selectedDate: null,
  selectedTime: null,
  
  // Promotion
  activePromotion: null,
  
  // Available Data
  locations: [],
  services: [],
  addons: [],
  staff: [],
  availableDates: [],
  availableSlots: [],
  
  // Result
  bookingConfirmation: null,
  
  // Pricing
  pricing: null,
  
  // Cart UI
  isCartOpen: false,
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getNextStep(currentStep: BookingStep): BookingStep {
  const steps: BookingStep[] = ['auth', 'location', 'services', 'addons', 'staff', 'datetime', 'confirm', 'success']
  const currentIndex = steps.indexOf(currentStep)
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : currentStep
}

function getPrevStep(currentStep: BookingStep): BookingStep {
  const steps: BookingStep[] = ['auth', 'location', 'services', 'addons', 'staff', 'datetime', 'confirm', 'success']
  const currentIndex = steps.indexOf(currentStep)
  return currentIndex > 0 ? steps[currentIndex - 1] : currentStep
}

function getStepByNumber(stepNumber: number): BookingStep {
  const steps: BookingStep[] = ['auth', 'location', 'services', 'addons', 'staff', 'datetime', 'confirm', 'success']
  return steps[stepNumber - 1] || 'auth'
}

function calculateTotalDuration(services: MindbodyService[], addons: MindbodyService[]): number {
  const serviceDuration = services.reduce((sum, s) => sum + s.Duration, 0)
  const addonDuration = addons.reduce((sum, a) => sum + a.Duration, 0)
  return serviceDuration + addonDuration
}

// ===========================================
// STORE CREATION
// ===========================================

export const useBookingStore = create<BookingState & BookingActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // ===========================================
      // NAVIGATION ACTIONS
      // ===========================================
      
      setStep: (step) => set({ currentStep: step }, false, 'setStep'),
      
      nextStep: () => set((state) => ({ 
        currentStep: getNextStep(state.currentStep),
        error: null 
      }), false, 'nextStep'),
      
      prevStep: () => set((state) => ({ 
        currentStep: getPrevStep(state.currentStep),
        error: null 
      }), false, 'prevStep'),
      
      goToStep: (stepNumber) => set({ 
        currentStep: getStepByNumber(stepNumber),
        error: null 
      }, false, 'goToStep'),
      
      // ===========================================
      // LOADING & ERROR ACTIONS
      // ===========================================
      
      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
      
      setError: (error) => set({ error, isLoading: false }, false, 'setError'),
      
      clearError: () => set({ error: null }, false, 'clearError'),
      
      // ===========================================
      // AUTH ACTIONS
      // ===========================================
      
      setClientIdentifier: (identifier) => {
        const isEmail = identifier.includes('@')
        const isPhone = /^[\d\s\-\+\(\)]+$/.test(identifier.replace(/\s/g, ''))
        
        set({
          clientIdentifier: identifier,
          identifierType: isEmail ? 'email' : isPhone ? 'phone' : null
        }, false, 'setClientIdentifier')
      },
      
      setClientInfo: (client) => set({
        clientId: client.Id,
        clientInfo: client,
        showClientSelector: false,
        availableClients: []
      }, false, 'setClientInfo'),
      
      setAvailableClients: (clients) => set({
        availableClients: clients,
        showClientSelector: clients.length > 1
      }, false, 'setAvailableClients'),
      
      selectClient: (client) => {
        set({
          clientId: client.Id,
          clientInfo: client,
          showClientSelector: false,
          availableClients: []
        }, false, 'selectClient')
        // Auto-advance to next step
        get().nextStep()
      },
      
      showClientSelectorModal: (show) => set({ 
        showClientSelector: show 
      }, false, 'showClientSelectorModal'),
      
      clearClientSelection: () => set({
        clientId: null,
        clientInfo: null,
        clientIdentifier: '',
        identifierType: null,
        availableClients: [],
        showClientSelector: false
      }, false, 'clearClientSelection'),
      
      // ===========================================
      // LOCATION ACTIONS
      // ===========================================
      
      setLocation: (location) => {
        set({ selectedLocation: location }, false, 'setLocation')
      },
      
      setLocations: (locations) => set({ locations }, false, 'setLocations'),
      
      // ===========================================
      // SERVICES ACTIONS
      // ===========================================
      
      addService: (service) => set((state) => {
        // Check if already added
        if (state.selectedServices.some(s => s.Id === service.Id)) {
          return state
        }
        const newServices = [...state.selectedServices, service]
        return { 
          selectedServices: newServices,
          pricing: null, // Invalidate cache
          isCartOpen: true // Auto-open cart when adding
        }
      }, false, 'addService'),
      
      removeService: (serviceId) => set((state) => ({
        selectedServices: state.selectedServices.filter(s => s.Id !== serviceId),
        pricing: null
      }), false, 'removeService'),
      
      clearServices: () => set({ 
        selectedServices: [],
        pricing: null 
      }, false, 'clearServices'),
      
      setServices: (services) => set({ services }, false, 'setServices'),
      
      // ===========================================
      // ADDONS ACTIONS
      // ===========================================
      
      addAddon: (addon) => set((state) => {
        if (state.selectedAddons.some(a => a.Id === addon.Id)) {
          return state
        }
        return { 
          selectedAddons: [...state.selectedAddons, addon],
          pricing: null,
          isCartOpen: true // Auto-open cart when adding
        }
      }, false, 'addAddon'),
      
      removeAddon: (addonId) => set((state) => ({
        selectedAddons: state.selectedAddons.filter(a => a.Id !== addonId),
        pricing: null
      }), false, 'removeAddon'),
      
      clearAddons: () => set({ 
        selectedAddons: [],
        pricing: null 
      }, false, 'clearAddons'),
      
      setAddons: (addons) => set({ addons }, false, 'setAddons'),
      
      // ===========================================
      // STAFF ACTIONS
      // ===========================================
      
      setStaff: (staff) => set({ selectedStaff: staff }, false, 'setStaff'),
      
      setStaffList: (staff) => set({ staff }, false, 'setStaffList'),
      
      // ===========================================
      // SCHEDULE ACTIONS
      // ===========================================
      
      setDate: (date) => set({ 
        selectedDate: date,
        selectedTime: null, // Reset time when date changes
        availableSlots: []
      }, false, 'setDate'),
      
      setTime: (time) => set({ selectedTime: time }, false, 'setTime'),
      
      setAvailableDates: (dates) => set({ availableDates: dates }, false, 'setAvailableDates'),
      
      setAvailableSlots: (slots) => set({ availableSlots: slots }, false, 'setAvailableSlots'),
      
      // ===========================================
      // PROMOTION ACTIONS
      // ===========================================
      
      loadPromotion: (promotion) => {
        // Pre-load services from promotion
        const promotionServices = promotion.services || []
        
        set({
          activePromotion: promotion,
          selectedServices: promotionServices,
          pricing: null,
          // Skip to addons step if promotion is loaded
          currentStep: 'addons'
        }, false, 'loadPromotion')
      },
      
      clearPromotion: () => set({
        activePromotion: null,
        selectedServices: [],
        pricing: null
      }, false, 'clearPromotion'),
      
      // ===========================================
      // BOOKING ACTIONS
      // ===========================================
      
      setBookingConfirmation: (confirmation) => set({
        bookingConfirmation: confirmation,
        currentStep: 'success'
      }, false, 'setBookingConfirmation'),
      
      // ===========================================
      // PRICING CALCULATION
      // ===========================================
      
      calculatePricing: () => {
        const state = get()
        
        // Calculate service prices
        const servicesSubtotal = state.selectedServices.reduce(
          (sum, s) => sum + s.Price, 0
        )
        
        // Calculate addon prices
        const addonsSubtotal = state.selectedAddons.reduce(
          (sum, a) => sum + a.Price, 0
        )
        
        // Check for promotion
        const hasPromotion = state.activePromotion !== null
        let promotionDiscount = 0
        let finalServicesPrice = servicesSubtotal
        
        if (hasPromotion && state.activePromotion) {
          finalServicesPrice = state.activePromotion.price
          promotionDiscount = servicesSubtotal - finalServicesPrice
        }
        
        // Calculate subtotal before tax
        const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
        
        // Calculate ITBM (7%)
        const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
        
        // Calculate total with tax
        const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100
        
        const pricing: CartPricing = {
          services: state.selectedServices,
          addons: state.selectedAddons,
          servicesSubtotal,
          addonsSubtotal,
          hasPromotion,
          promotionName: state.activePromotion?.title_es || null,
          promotionPrice: hasPromotion ? state.activePromotion!.price : null,
          promotionDiscount,
          subtotalBeforeTax,
          itbmRate: ITBM_RATE,
          itbmAmount,
          totalWithTax,
          totalDuration: calculateTotalDuration(
            state.selectedServices,
            state.selectedAddons
          ),
        }
        
        // Return computed pricing (don't set state to avoid re-render loops)
        return pricing
      },
      
      // ===========================================
      // CART UI ACTIONS
      // ===========================================
      
      openCart: () => set({ isCartOpen: true }, false, 'openCart'),
      
      closeCart: () => set({ isCartOpen: false }, false, 'closeCart'),
      
      toggleCart: () => set((state) => ({ 
        isCartOpen: !state.isCartOpen 
      }), false, 'toggleCart'),
      
      // ===========================================
      // RESET ACTIONS
      // ===========================================
      
      reset: () => set({ ...initialState, isCartOpen: false }, false, 'reset'),
      
      resetToStep: (step) => set({
        ...initialState,
        currentStep: step,
        isCartOpen: false
      }, false, 'resetToStep'),
    }),
    { name: 'booking-store' }
  )
)

// ===========================================
// SELECTORS
// ===========================================

export const selectCurrentStepNumber = (state: BookingState) => {
  const steps: BookingStep[] = ['auth', 'location', 'services', 'addons', 'staff', 'datetime', 'confirm', 'success']
  return steps.indexOf(state.currentStep) + 1
}

export const selectTotalDuration = (state: BookingState) => {
  return calculateTotalDuration(state.selectedServices, state.selectedAddons)
}

export const selectHasServices = (state: BookingState) => {
  return state.selectedServices.length > 0
}

export const selectCanProceed = (state: BookingState) => {
  switch (state.currentStep) {
    case 'auth':
      return state.clientId !== null
    case 'location':
      return state.selectedLocation !== null
    case 'services':
      return state.selectedServices.length > 0
    case 'addons':
      return true // Addons are optional
    case 'staff':
      return true // "Any therapist" is valid
    case 'datetime':
      return state.selectedDate !== null && state.selectedTime !== null
    case 'confirm':
      return true
    default:
      return false
  }
}
