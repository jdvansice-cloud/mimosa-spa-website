import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
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
import { ITBM_TAX_RATE } from './constants'

// Use the shared tax rate constant
const ITBM_RATE = ITBM_TAX_RATE

// ===========================================
// STORE STATE INTERFACE
// ===========================================

interface BookingState {
  // Progress
  currentStep: BookingStep
  isLoading: boolean
  error: string | null
  // Set when Mindbody rejects a booking because the slot was just taken;
  // displayed as a banner on the datetime step.
  slotConflictNotice: string | null
  
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

  // Appointment replacement (from ?replace=APPOINTMENT_ID)
  replaceAppointmentId: string | null
  replaceBookingDetails: {
    date: string
    time: string
    locationName: string
    services: string[]
    therapistName: string
  } | null

  // Global online discount (loaded from site settings)
  globalDiscountPercent: number
  globalDiscountActive: boolean
  
  // Computed pricing (cached)
  pricing: CartPricing | null
  
  // Cart UI State
  isCartOpen: boolean

  // Add-ons prompt (carousel popup shown when leaving the services step)
  addonsPromptOpen: boolean
  addonsPromptDismissed: boolean
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
  setSlotConflictNotice: (notice: string | null) => void
  
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
  setReplaceAppointmentId: (id: string | null) => void
  setReplaceBookingDetails: (details: { date: string; time: string; locationName: string; services: string[]; therapistName: string } | null) => void
  setGlobalDiscount: (percent: number, active: boolean) => void
  
  // Pricing
  calculatePricing: () => CartPricing
  
  // Reset
  reset: () => void
  resetToStep: (step: BookingStep) => void
  resetForNewBooking: () => void
  
  // Cart UI
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Add-ons prompt
  openAddonsPrompt: () => void
  closeAddonsPrompt: () => void
}

// ===========================================
// INITIAL STATE
// ===========================================

const initialState: BookingState = {
  // Progress
  currentStep: 'services',
  isLoading: false,
  error: null,
  slotConflictNotice: null,
  
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
  replaceAppointmentId: null,
  replaceBookingDetails: null,
  globalDiscountPercent: 0,
  globalDiscountActive: false,
  
  // Pricing
  pricing: null,
  
  // Cart UI
  isCartOpen: false,

  // Add-ons prompt
  addonsPromptOpen: false,
  addonsPromptDismissed: false,
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// P2 collapse: 4 visible screens. Location is a pill inside services,
// add-ons are an inline section there too, and the therapist picker lives on
// the date/time screen. Auth stays LAST (identity only needed at POST /book).
// The removed step names ('location'/'addons'/'staff') remain in the
// BookingStep type for persisted-cart migration only.
const STEP_ORDER: BookingStep[] = ['services', 'datetime', 'auth', 'confirm', 'success']

// Old persisted carts (and deep links) may still reference collapsed steps.
export function normalizeStep(step: BookingStep): BookingStep {
  if (step === 'location' || step === 'addons') return 'services'
  if (step === 'staff') return 'datetime'
  return step
}

function getNextStep(currentStep: BookingStep): BookingStep {
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  return currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : currentStep
}

function getPrevStep(currentStep: BookingStep): BookingStep {
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : currentStep
}

function getStepByNumber(stepNumber: number): BookingStep {
  return STEP_ORDER[stepNumber - 1] || 'services'
}

function calculateTotalDuration(services: MindbodyService[], addons: MindbodyService[]): number {
  const serviceDuration = services.reduce((sum, s) => sum + s.Duration, 0)
  const addonDuration = addons.reduce((sum, a) => sum + a.Duration, 0)
  return serviceDuration + addonDuration
}

// ===========================================
// STORE CREATION
// ===========================================

// How long a saved cart stays valid. Slots go stale quickly, so keep this
// short; bump or lower as needed.
export const CART_TTL_HOURS = 3

const expiringSessionStorage = {
  getItem: (name: string): string | null => {
    try {
      const raw = sessionStorage.getItem(name)
      if (!raw) return null
      const savedAt = JSON.parse(raw)?.state?.cartSavedAt
      if (
        typeof savedAt === 'number' &&
        Date.now() - savedAt > CART_TTL_HOURS * 3600 * 1000
      ) {
        sessionStorage.removeItem(name)
        return null
      }
      return raw
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      sessionStorage.setItem(name, value)
    } catch {}
  },
  removeItem: (name: string) => {
    try {
      sessionStorage.removeItem(name)
    } catch {}
  },
}

export const useBookingStore = create<BookingState & BookingActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
      
      // ===========================================
      // NAVIGATION ACTIONS
      // ===========================================
      
      setStep: (step) => set({ currentStep: normalizeStep(step) }, false, 'setStep'),
      
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
      
      setSlotConflictNotice: (notice) => set({ slotConflictNotice: notice }, false, 'setSlotConflictNotice'),
      
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
        // Clear staff, dates, and slots when location changes (they're location-specific)
        set({
          selectedLocation: location,
          services: [],
          addons: [],
          staff: [],
          selectedStaff: null,
          availableDates: [],
          availableSlots: [],
          selectedDate: null,
          selectedTime: null
        }, false, 'setLocation')
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
        availableSlots: [],
        // Clear staff selection when date changes (staff availability depends on date/time)
        selectedStaff: null,
        staff: []
      }, false, 'setDate'),

      setTime: (time) => set({
        selectedTime: time,
        // Clear staff selection when time changes (staff availability depends on date/time)
        selectedStaff: null,
        staff: []
      }, false, 'setTime'),
      
      setAvailableDates: (dates) => set({ availableDates: dates }, false, 'setAvailableDates'),
      
      setAvailableSlots: (slots) => set({ availableSlots: slots }, false, 'setAvailableSlots'),
      
      // ===========================================
      // PROMOTION ACTIONS
      // ===========================================

      loadPromotion: (promotion) => {
        const state = get()
        const promotionServices = promotion.services || []

        // Check if user has manually selected services that will be replaced
        const hadPreviousServices = state.selectedServices.length > 0
        const isReplacingServices = hadPreviousServices &&
          !state.activePromotion && // Only warn if not already using a promotion
          promotionServices.length > 0

        // Log warning for debugging (in production, this could trigger a toast notification)
        if (isReplacingServices) {
          console.warn('Promotion is replacing manually selected services:', {
            previousServices: state.selectedServices.map(s => s.Name),
            promotionServices: promotionServices.map((s: { Name: string }) => s.Name)
          })
        }

        set({
          activePromotion: promotion,
          selectedServices: promotionServices,
          selectedAddons: [], // Clear addons when loading a promotion
          pricing: null,
          // Stay on services — add-ons are an inline section there now
          currentStep: 'services'
        }, false, 'loadPromotion')
      },

      clearPromotion: () => {
        const state = get()
        // Log when clearing promotion
        if (state.activePromotion) {
          console.log('Clearing promotion:', state.activePromotion.title_es)
        }

        set({
          activePromotion: null,
          selectedServices: [],
          selectedAddons: [],
          pricing: null
        }, false, 'clearPromotion')
      },
      
      // ===========================================
      // BOOKING ACTIONS
      // ===========================================
      
      setBookingConfirmation: (confirmation) => set({
        bookingConfirmation: confirmation,
        currentStep: 'success'
      }, false, 'setBookingConfirmation'),

      setReplaceAppointmentId: (id) => set({ replaceAppointmentId: id }, false, 'setReplaceAppointmentId'),
      setReplaceBookingDetails: (details) => set({ replaceBookingDetails: details }, false, 'setReplaceBookingDetails'),

      setGlobalDiscount: (percent, active) => set({ globalDiscountPercent: percent, globalDiscountActive: active }, false, 'setGlobalDiscount'),
      
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

        // Apply global online discount when no promotion is active
        const hasGlobalDiscount = !hasPromotion && state.globalDiscountActive && state.globalDiscountPercent > 0
        let globalDiscountAmount = 0

        if (hasGlobalDiscount) {
          globalDiscountAmount = Math.round(finalServicesPrice * (state.globalDiscountPercent / 100) * 100) / 100
          finalServicesPrice = Math.round((finalServicesPrice - globalDiscountAmount) * 100) / 100
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
          hasGlobalDiscount,
          globalDiscountPercent: state.globalDiscountPercent,
          globalDiscountAmount,
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

      openAddonsPrompt: () => set({ addonsPromptOpen: true }, false, 'openAddonsPrompt'),

      // Closing counts as "asked and answered" — don't re-prompt when the
      // customer navigates back through the services step later.
      closeAddonsPrompt: () => set({
        addonsPromptOpen: false,
        addonsPromptDismissed: true,
      }, false, 'closeAddonsPrompt'),
      
      // ===========================================
      // RESET ACTIONS
      // ===========================================
      
      reset: () => set({ ...initialState, isCartOpen: false }, false, 'reset'),

      resetToStep: (step) => set({
        ...initialState,
        currentStep: step,
        isCartOpen: false
      }, false, 'resetToStep'),

      // Like reset but preserves auth and global discount so the user doesn't
      // have to re-authenticate and the discount banner stays active.
      resetForNewBooking: () => set((state) => ({
        ...initialState,
        // Preserve auth
        clientIdentifier: state.clientIdentifier,
        identifierType: state.identifierType,
        clientId: state.clientId,
        clientInfo: state.clientInfo,
        // Preserve global settings
        globalDiscountPercent: state.globalDiscountPercent,
        globalDiscountActive: state.globalDiscountActive,
        // Start at location step (auth already done)
        currentStep: 'services',
        isCartOpen: false,
      }), false, 'resetForNewBooking'),
      }),
      {
        name: 'mimosa-booking-cart',
        // Session-scoped: survives reloads and the OTP flow, but never
        // resurrects a days-old cart pointing at stale availability.
        // On top of that, carts expire after CART_TTL_HOURS even in a
        // long-lived tab (getItem returns null → rehydration is skipped).
        storage: createJSONStorage(() => expiringSessionStorage),
        version: 2,
        // v1 carts stored the old 7-step names; collapse them.
        migrate: (persisted: unknown) => {
          const p = persisted as { currentStep?: BookingStep } | undefined
          if (p?.currentStep) p.currentStep = normalizeStep(p.currentStep)
          return p as (BookingState & BookingActions)
        },
        // Persist SELECTIONS only — never identity/PII (clientInfo), never
        // transient flags. Auth state is restored from the Supabase session.
        partialize: (state) => ({
          cartSavedAt: Date.now(),
          currentStep:
            state.currentStep === 'success' || state.currentStep === 'confirm'
              ? 'services'
              : state.currentStep,
          selectedLocation: state.selectedLocation,
          selectedServices: state.selectedServices,
          selectedAddons: state.selectedAddons,
          selectedStaff: state.selectedStaff,
          selectedDate: state.selectedDate,
          selectedTime: state.selectedTime,
          activePromotion: state.activePromotion,
        }),
      }
    ),
    { name: 'booking-store' }
  )
)

// ===========================================
// SELECTORS
// ===========================================

export const selectCurrentStepNumber = (state: BookingState) => {
  const steps: BookingStep[] = ['services', 'datetime', 'auth', 'confirm', 'success']
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
    case 'services':
      return state.selectedLocation !== null && state.selectedServices.length > 0
    case 'datetime':
      return state.selectedDate !== null && state.selectedTime !== null
    case 'confirm':
      return true
    default:
      return false
  }
}
