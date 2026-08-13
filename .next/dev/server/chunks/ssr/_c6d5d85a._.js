module.exports = [
"[project]/src/lib/booking/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ===========================================
// BOOKING CONSTANTS
// Shared constants for the booking system
// ===========================================
// ITBM Tax Rate (Panama)
// Single source of truth for tax calculations
__turbopack_context__.s([
    "ERROR_MESSAGES",
    ()=>ERROR_MESSAGES,
    "ITBM_TAX_RATE",
    ()=>ITBM_TAX_RATE,
    "PANAMA_TIMEZONE",
    ()=>PANAMA_TIMEZONE,
    "PROGRAM_IDS",
    ()=>PROGRAM_IDS,
    "PROGRAM_NAMES",
    ()=>PROGRAM_NAMES,
    "formatDateForPanama",
    ()=>formatDateForPanama,
    "formatTimeForPanama",
    ()=>formatTimeForPanama,
    "getCurrentPanamaTime",
    ()=>getCurrentPanamaTime,
    "isDateTimeInPastForPanama",
    ()=>isDateTimeInPastForPanama,
    "normalizePhoneNumber",
    ()=>normalizePhoneNumber,
    "panamaTimeToUTC",
    ()=>panamaTimeToUTC,
    "phoneNumbersMatch",
    ()=>phoneNumbersMatch,
    "sanitizeError",
    ()=>sanitizeError,
    "validateRequired",
    ()=>validateRequired
]);
const ITBM_TAX_RATE = 0.07;
const PANAMA_TIMEZONE = 'America/Panama';
const PROGRAM_IDS = {
    TRATAMIENTOS_CORPORALES: 4,
    PAQUETES_DELUXE: 5,
    TRATAMIENTOS_FACIALES: 6,
    ADICIONALES: 8,
    TRATAMIENTOS_PAREJAS: 11,
    ADICIONALES_EN_CABINA: 12,
    EVENTOS: 13,
    PAQUETES_MASAJES: 19,
    TAI: 20,
    PAREJAS: 21
};
const PROGRAM_NAMES = {
    [PROGRAM_IDS.TRATAMIENTOS_CORPORALES]: 'Tratamientos Corporales',
    [PROGRAM_IDS.PAQUETES_DELUXE]: 'Paquetes Deluxe',
    [PROGRAM_IDS.TRATAMIENTOS_FACIALES]: 'Tratamientos Faciales',
    [PROGRAM_IDS.ADICIONALES]: 'Adicionales',
    [PROGRAM_IDS.TRATAMIENTOS_PAREJAS]: 'Tratamientos Parejas',
    [PROGRAM_IDS.ADICIONALES_EN_CABINA]: 'Adicionales en Cabina',
    [PROGRAM_IDS.EVENTOS]: 'Eventos',
    [PROGRAM_IDS.PAQUETES_MASAJES]: 'Paquetes de Masajes',
    [PROGRAM_IDS.TAI]: 'TAI',
    [PROGRAM_IDS.PAREJAS]: 'Parejas'
};
const ERROR_MESSAGES = {
    // Generic errors
    GENERIC_ERROR: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
    CONNECTION_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    // Auth errors
    CLIENT_NOT_FOUND: 'No encontramos un perfil con esta información. ¿Deseas registrarte?',
    INVALID_EMAIL: 'Por favor, ingresa un correo electrónico válido.',
    INVALID_PHONE: 'Por favor, ingresa un número de teléfono válido.',
    REGISTRATION_FAILED: 'No pudimos completar el registro. Por favor, intenta nuevamente.',
    // Booking errors
    NO_AVAILABILITY: 'No hay disponibilidad para la fecha seleccionada.',
    BOOKING_FAILED: 'No pudimos completar tu reserva. Por favor, intenta nuevamente.',
    PARTIAL_BOOKING: 'Algunos servicios no pudieron ser reservados. Te contactaremos para confirmar.',
    // Service errors
    SERVICES_LOAD_FAILED: 'Error al cargar los servicios. Por favor, intenta nuevamente.',
    STAFF_LOAD_FAILED: 'Error al cargar los terapeutas. Por favor, intenta nuevamente.',
    LOCATIONS_LOAD_FAILED: 'Error al cargar las ubicaciones. Por favor, intenta nuevamente.',
    // Validation errors
    REQUIRED_FIELD: 'Este campo es requerido.',
    INVALID_DATE: 'Por favor, selecciona una fecha válida.',
    INVALID_TIME: 'Por favor, selecciona una hora válida.'
};
function normalizePhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Handle Panama phone numbers
    // If 8 digits, it's a local Panama number
    if (digits.length === 8) {
        return digits;
    }
    // If starts with 507 (Panama country code), remove it
    if (digits.startsWith('507') && digits.length === 11) {
        return digits.slice(3);
    }
    // If starts with +507, handle similarly
    if (digits.length > 8) {
        // Return last 8 digits for Panama
        return digits.slice(-8);
    }
    return digits;
}
function phoneNumbersMatch(phone1, phone2) {
    const normalized1 = normalizePhoneNumber(phone1);
    const normalized2 = normalizePhoneNumber(phone2);
    // Exact match after normalization
    if (normalized1 === normalized2) {
        return true;
    }
    // Check if one ends with the other (for partial matches)
    if (normalized1.length >= 8 && normalized2.length >= 8) {
        return normalized1.endsWith(normalized2.slice(-8)) || normalized2.endsWith(normalized1.slice(-8));
    }
    return false;
}
function formatDateForPanama(date) {
    return date.toLocaleDateString('es-PA', {
        timeZone: PANAMA_TIMEZONE,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
function formatTimeForPanama(date) {
    return date.toLocaleTimeString('es-PA', {
        timeZone: PANAMA_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
function panamaTimeToUTC(dateStr, timeStr) {
    // Create date in Panama timezone
    const dateTimeStr = `${dateStr}T${timeStr}:00`;
    // Parse as Panama time and convert to UTC
    const panamaDate = new Date(dateTimeStr);
    // Get the timezone offset for Panama (UTC-5)
    // Note: This is a simplified approach. For production, consider using a library like date-fns-tz
    const panamaOffset = -5 * 60 // minutes
    ;
    const localOffset = panamaDate.getTimezoneOffset();
    const offsetDiff = panamaOffset - localOffset;
    return new Date(panamaDate.getTime() - offsetDiff * 60 * 1000);
}
function getCurrentPanamaTime() {
    // Get current UTC time
    const now = new Date();
    // Format current time in Panama timezone and parse it back
    // This gives us the "wall clock" time in Panama
    const panamaTimeStr = now.toLocaleString('en-US', {
        timeZone: PANAMA_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    // Parse back: "01/15/2025, 14:30:00" -> Date object
    // The parsed date will be in local server time, but represents Panama wall clock time
    return new Date(panamaTimeStr);
}
function isDateTimeInPastForPanama(dateTimeStr) {
    // The dateTimeStr is in format "2025-01-15T14:30:00" representing Panama local time
    const bookingTime = new Date(dateTimeStr);
    const panamaTime = getCurrentPanamaTime();
    return bookingTime < panamaTime;
}
function validateRequired(data, requiredFields) {
    const missing = [];
    for (const field of requiredFields){
        const value = data[field];
        if (value === undefined || value === null || value === '') {
            missing.push(String(field));
        }
    }
    return {
        valid: missing.length === 0,
        missing
    };
}
function sanitizeError(error) {
    if (error instanceof Error) {
        // Don't expose stack traces or internal details
        const message = error.message;
        // Check for common error patterns and return user-friendly messages
        if (message.includes('MINDBODY_API_KEY')) {
            return ERROR_MESSAGES.GENERIC_ERROR;
        }
        if (message.includes('fetch') || message.includes('network')) {
            return ERROR_MESSAGES.CONNECTION_ERROR;
        }
        if (message.includes('token')) {
            return ERROR_MESSAGES.GENERIC_ERROR;
        }
        // Mindbody 5xx / gateway errors — never expose raw server messages
        if (message.match(/Mindbody API error: 5\d\d/) || message.includes('Bad Gateway') || message.includes('Service Unavailable')) {
            return ERROR_MESSAGES.CONNECTION_ERROR;
        }
        // Last-resort: strip any stray HTML tags before returning
        if (message.includes('<') && message.includes('>')) {
            return ERROR_MESSAGES.GENERIC_ERROR;
        }
        // Return the message if it doesn't contain sensitive info
        return message;
    }
    return ERROR_MESSAGES.GENERIC_ERROR;
}
}),
"[project]/src/lib/booking/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectCanProceed",
    ()=>selectCanProceed,
    "selectCurrentStepNumber",
    ()=>selectCurrentStepNumber,
    "selectHasServices",
    ()=>selectHasServices,
    "selectTotalDuration",
    ()=>selectTotalDuration,
    "useBookingStore",
    ()=>useBookingStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-ssr] (ecmascript)");
;
;
;
// Use the shared tax rate constant
const ITBM_RATE = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ITBM_TAX_RATE"];
// ===========================================
// INITIAL STATE
// ===========================================
const initialState = {
    // Progress
    currentStep: 'auth',
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
    isCartOpen: false
};
// ===========================================
// HELPER FUNCTIONS
// ===========================================
// Step order: auth -> location -> services -> addons -> datetime -> staff -> confirm -> success
const STEP_ORDER = [
    'auth',
    'location',
    'services',
    'addons',
    'datetime',
    'staff',
    'confirm',
    'success'
];
function getNextStep(currentStep) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    return currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : currentStep;
}
function getPrevStep(currentStep) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : currentStep;
}
function getStepByNumber(stepNumber) {
    return STEP_ORDER[stepNumber - 1] || 'auth';
}
function calculateTotalDuration(services, addons) {
    const serviceDuration = services.reduce((sum, s)=>sum + s.Duration, 0);
    const addonDuration = addons.reduce((sum, a)=>sum + a.Duration, 0);
    return serviceDuration + addonDuration;
}
const useBookingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((set, get)=>({
        ...initialState,
        // ===========================================
        // NAVIGATION ACTIONS
        // ===========================================
        setStep: (step)=>set({
                currentStep: step
            }, false, 'setStep'),
        nextStep: ()=>set((state)=>({
                    currentStep: getNextStep(state.currentStep),
                    error: null
                }), false, 'nextStep'),
        prevStep: ()=>set((state)=>({
                    currentStep: getPrevStep(state.currentStep),
                    error: null
                }), false, 'prevStep'),
        goToStep: (stepNumber)=>set({
                currentStep: getStepByNumber(stepNumber),
                error: null
            }, false, 'goToStep'),
        // ===========================================
        // LOADING & ERROR ACTIONS
        // ===========================================
        setLoading: (loading)=>set({
                isLoading: loading
            }, false, 'setLoading'),
        setError: (error)=>set({
                error,
                isLoading: false
            }, false, 'setError'),
        clearError: ()=>set({
                error: null
            }, false, 'clearError'),
        setSlotConflictNotice: (notice)=>set({
                slotConflictNotice: notice
            }, false, 'setSlotConflictNotice'),
        // ===========================================
        // AUTH ACTIONS
        // ===========================================
        setClientIdentifier: (identifier)=>{
            const isEmail = identifier.includes('@');
            const isPhone = /^[\d\s\-\+\(\)]+$/.test(identifier.replace(/\s/g, ''));
            set({
                clientIdentifier: identifier,
                identifierType: isEmail ? 'email' : isPhone ? 'phone' : null
            }, false, 'setClientIdentifier');
        },
        setClientInfo: (client)=>set({
                clientId: client.Id,
                clientInfo: client,
                showClientSelector: false,
                availableClients: []
            }, false, 'setClientInfo'),
        setAvailableClients: (clients)=>set({
                availableClients: clients,
                showClientSelector: clients.length > 1
            }, false, 'setAvailableClients'),
        selectClient: (client)=>{
            set({
                clientId: client.Id,
                clientInfo: client,
                showClientSelector: false,
                availableClients: []
            }, false, 'selectClient');
            // Auto-advance to next step
            get().nextStep();
        },
        showClientSelectorModal: (show)=>set({
                showClientSelector: show
            }, false, 'showClientSelectorModal'),
        clearClientSelection: ()=>set({
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
        setLocation: (location)=>{
            // Clear staff, dates, and slots when location changes (they're location-specific)
            set({
                selectedLocation: location,
                staff: [],
                selectedStaff: null,
                availableDates: [],
                availableSlots: [],
                selectedDate: null,
                selectedTime: null
            }, false, 'setLocation');
        },
        setLocations: (locations)=>set({
                locations
            }, false, 'setLocations'),
        // ===========================================
        // SERVICES ACTIONS
        // ===========================================
        addService: (service)=>set((state)=>{
                // Check if already added
                if (state.selectedServices.some((s)=>s.Id === service.Id)) {
                    return state;
                }
                const newServices = [
                    ...state.selectedServices,
                    service
                ];
                return {
                    selectedServices: newServices,
                    pricing: null
                };
            }, false, 'addService'),
        removeService: (serviceId)=>set((state)=>({
                    selectedServices: state.selectedServices.filter((s)=>s.Id !== serviceId),
                    pricing: null
                }), false, 'removeService'),
        clearServices: ()=>set({
                selectedServices: [],
                pricing: null
            }, false, 'clearServices'),
        setServices: (services)=>set({
                services
            }, false, 'setServices'),
        // ===========================================
        // ADDONS ACTIONS
        // ===========================================
        addAddon: (addon)=>set((state)=>{
                if (state.selectedAddons.some((a)=>a.Id === addon.Id)) {
                    return state;
                }
                return {
                    selectedAddons: [
                        ...state.selectedAddons,
                        addon
                    ],
                    pricing: null
                };
            }, false, 'addAddon'),
        removeAddon: (addonId)=>set((state)=>({
                    selectedAddons: state.selectedAddons.filter((a)=>a.Id !== addonId),
                    pricing: null
                }), false, 'removeAddon'),
        clearAddons: ()=>set({
                selectedAddons: [],
                pricing: null
            }, false, 'clearAddons'),
        setAddons: (addons)=>set({
                addons
            }, false, 'setAddons'),
        // ===========================================
        // STAFF ACTIONS
        // ===========================================
        setStaff: (staff)=>set({
                selectedStaff: staff
            }, false, 'setStaff'),
        setStaffList: (staff)=>set({
                staff
            }, false, 'setStaffList'),
        // ===========================================
        // SCHEDULE ACTIONS
        // ===========================================
        setDate: (date)=>set({
                selectedDate: date,
                selectedTime: null,
                availableSlots: [],
                // Clear staff selection when date changes (staff availability depends on date/time)
                selectedStaff: null,
                staff: []
            }, false, 'setDate'),
        setTime: (time)=>set({
                selectedTime: time,
                // Clear staff selection when time changes (staff availability depends on date/time)
                selectedStaff: null,
                staff: []
            }, false, 'setTime'),
        setAvailableDates: (dates)=>set({
                availableDates: dates
            }, false, 'setAvailableDates'),
        setAvailableSlots: (slots)=>set({
                availableSlots: slots
            }, false, 'setAvailableSlots'),
        // ===========================================
        // PROMOTION ACTIONS
        // ===========================================
        loadPromotion: (promotion)=>{
            const state = get();
            const promotionServices = promotion.services || [];
            // Check if user has manually selected services that will be replaced
            const hadPreviousServices = state.selectedServices.length > 0;
            const isReplacingServices = hadPreviousServices && !state.activePromotion && // Only warn if not already using a promotion
            promotionServices.length > 0;
            // Log warning for debugging (in production, this could trigger a toast notification)
            if (isReplacingServices) {
                console.warn('Promotion is replacing manually selected services:', {
                    previousServices: state.selectedServices.map((s)=>s.Name),
                    promotionServices: promotionServices.map((s)=>s.Name)
                });
            }
            set({
                activePromotion: promotion,
                selectedServices: promotionServices,
                selectedAddons: [],
                pricing: null,
                // Skip to addons step if promotion is loaded
                currentStep: 'addons'
            }, false, 'loadPromotion');
        },
        clearPromotion: ()=>{
            const state = get();
            // Log when clearing promotion
            if (state.activePromotion) {
                console.log('Clearing promotion:', state.activePromotion.title_es);
            }
            set({
                activePromotion: null,
                selectedServices: [],
                selectedAddons: [],
                pricing: null
            }, false, 'clearPromotion');
        },
        // ===========================================
        // BOOKING ACTIONS
        // ===========================================
        setBookingConfirmation: (confirmation)=>set({
                bookingConfirmation: confirmation,
                currentStep: 'success'
            }, false, 'setBookingConfirmation'),
        setReplaceAppointmentId: (id)=>set({
                replaceAppointmentId: id
            }, false, 'setReplaceAppointmentId'),
        setReplaceBookingDetails: (details)=>set({
                replaceBookingDetails: details
            }, false, 'setReplaceBookingDetails'),
        setGlobalDiscount: (percent, active)=>set({
                globalDiscountPercent: percent,
                globalDiscountActive: active
            }, false, 'setGlobalDiscount'),
        // ===========================================
        // PRICING CALCULATION
        // ===========================================
        calculatePricing: ()=>{
            const state = get();
            // Calculate service prices
            const servicesSubtotal = state.selectedServices.reduce((sum, s)=>sum + s.Price, 0);
            // Calculate addon prices
            const addonsSubtotal = state.selectedAddons.reduce((sum, a)=>sum + a.Price, 0);
            // Check for promotion
            const hasPromotion = state.activePromotion !== null;
            let promotionDiscount = 0;
            let finalServicesPrice = servicesSubtotal;
            if (hasPromotion && state.activePromotion) {
                finalServicesPrice = state.activePromotion.price;
                promotionDiscount = servicesSubtotal - finalServicesPrice;
            }
            // Apply global online discount when no promotion is active
            const hasGlobalDiscount = !hasPromotion && state.globalDiscountActive && state.globalDiscountPercent > 0;
            let globalDiscountAmount = 0;
            if (hasGlobalDiscount) {
                globalDiscountAmount = Math.round(finalServicesPrice * (state.globalDiscountPercent / 100) * 100) / 100;
                finalServicesPrice = Math.round((finalServicesPrice - globalDiscountAmount) * 100) / 100;
            }
            // Calculate subtotal before tax
            const subtotalBeforeTax = finalServicesPrice + addonsSubtotal;
            // Calculate ITBM (7%)
            const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100;
            // Calculate total with tax
            const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100;
            const pricing = {
                services: state.selectedServices,
                addons: state.selectedAddons,
                servicesSubtotal,
                addonsSubtotal,
                hasPromotion,
                promotionName: state.activePromotion?.title_es || null,
                promotionPrice: hasPromotion ? state.activePromotion.price : null,
                promotionDiscount,
                hasGlobalDiscount,
                globalDiscountPercent: state.globalDiscountPercent,
                globalDiscountAmount,
                subtotalBeforeTax,
                itbmRate: ITBM_RATE,
                itbmAmount,
                totalWithTax,
                totalDuration: calculateTotalDuration(state.selectedServices, state.selectedAddons)
            };
            // Return computed pricing (don't set state to avoid re-render loops)
            return pricing;
        },
        // ===========================================
        // CART UI ACTIONS
        // ===========================================
        openCart: ()=>set({
                isCartOpen: true
            }, false, 'openCart'),
        closeCart: ()=>set({
                isCartOpen: false
            }, false, 'closeCart'),
        toggleCart: ()=>set((state)=>({
                    isCartOpen: !state.isCartOpen
                }), false, 'toggleCart'),
        // ===========================================
        // RESET ACTIONS
        // ===========================================
        reset: ()=>set({
                ...initialState,
                isCartOpen: false
            }, false, 'reset'),
        resetToStep: (step)=>set({
                ...initialState,
                currentStep: step,
                isCartOpen: false
            }, false, 'resetToStep'),
        // Like reset but preserves auth and global discount so the user doesn't
        // have to re-authenticate and the discount banner stays active.
        resetForNewBooking: ()=>set((state)=>({
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
                    currentStep: 'location',
                    isCartOpen: false
                }), false, 'resetForNewBooking')
    }), {
    name: 'booking-store'
}));
const selectCurrentStepNumber = (state)=>{
    const steps = [
        'auth',
        'location',
        'services',
        'addons',
        'datetime',
        'staff',
        'confirm',
        'success'
    ];
    return steps.indexOf(state.currentStep) + 1;
};
const selectTotalDuration = (state)=>{
    return calculateTotalDuration(state.selectedServices, state.selectedAddons);
};
const selectHasServices = (state)=>{
    return state.selectedServices.length > 0;
};
const selectCanProceed = (state)=>{
    switch(state.currentStep){
        case 'auth':
            return state.clientId !== null;
        case 'location':
            return state.selectedLocation !== null;
        case 'services':
            return state.selectedServices.length > 0;
        case 'addons':
            return true // Addons are optional
            ;
        case 'datetime':
            return state.selectedDate !== null && state.selectedTime !== null;
        case 'staff':
            return true // "Any therapist" is valid
            ;
        case 'confirm':
            return true;
        default:
            return false;
    }
};
}),
"[project]/src/components/menu/BookingButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingButton",
    ()=>BookingButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/portal/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function BookingButton({ service, locale, label, className }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePortalStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["selectIsAuthenticated"]);
    const mindbodyClientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePortalStore"])((state)=>state.mindbodyClientId);
    const { addService, setStep, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isAuthenticated && mindbodyClientId) {
            // User is logged in - reset booking state, pre-select service, and go to location step
            reset();
            addService(service);
            setStep('location');
            // Navigate to booking page (AuthStep will auto-skip since user is already authenticated)
            router.push(`/${locale}/reservar?serviceId=${service.Id}`);
        } else {
            // User is not logged in - redirect to login with redirect back to booking with service
            const redirectUrl = encodeURIComponent(`/${locale}/reservar?serviceId=${service.Id}`);
            router.push(`/${locale}/portal/login?redirect=${redirectUrl}`);
        }
    }, [
        isAuthenticated,
        mindbodyClientId,
        service,
        locale,
        router,
        addService,
        setStep,
        reset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleClick,
        className: className,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/menu/BookingButton.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpandableDescription",
    ()=>ExpandableDescription
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function ExpandableDescription({ html, maxLines = 2, className, seeMoreText = 'ver más', seeLessText = 'ver menos' }) {
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [needsExpansion, setNeedsExpansion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const measureRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if content overflows the max lines
        if (measureRef.current && contentRef.current) {
            const lineHeight = parseInt(getComputedStyle(measureRef.current).lineHeight) || 20;
            const maxHeight = lineHeight * maxLines;
            const actualHeight = measureRef.current.scrollHeight;
            setNeedsExpansion(actualHeight > maxHeight + 4); // 4px tolerance
        }
    }, [
        html,
        maxLines
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: measureRef,
                className: "absolute opacity-0 pointer-events-none text-xs text-warm-gray-600 leading-relaxed [&_p]:mb-0 [&_br]:hidden",
                style: {
                    width: '100%'
                },
                dangerouslySetInnerHTML: {
                    __html: html
                }
            }, void 0, false, {
                fileName: "[project]/src/components/menu/ExpandableDescription.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: contentRef,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-xs text-warm-gray-600 leading-relaxed [&_p]:mb-0 [&_br]:hidden overflow-hidden transition-all duration-200', !isExpanded && needsExpansion && 'line-clamp-2'),
                style: !isExpanded && needsExpansion ? {
                    display: '-webkit-box',
                    WebkitLineClamp: maxLines,
                    WebkitBoxOrient: 'vertical'
                } : undefined,
                dangerouslySetInnerHTML: {
                    __html: html
                }
            }, void 0, false, {
                fileName: "[project]/src/components/menu/ExpandableDescription.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            needsExpansion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsExpanded(!isExpanded),
                className: "text-xs text-gold-600 hover:text-gold-700 font-medium mt-1 inline-block",
                children: isExpanded ? seeLessText : seeMoreText
            }, void 0, false, {
                fileName: "[project]/src/components/menu/ExpandableDescription.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/menu/ExpandableDescription.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppBookingLink",
    ()=>WhatsAppBookingLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/track.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const PHONE = ("TURBOPACK compile-time value", "50764049464") || '50764049464';
function WhatsAppBookingLink({ message, cta, className, variant = 'button' }) {
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('whatsapp');
    const text = message || 'Hola, quiero reservar una cita.';
    const handleClick = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["track"])('whatsapp_click', {
            meta: {
                cta
            }
        });
    };
    if (variant === 'link') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWhatsAppUrl"])(PHONE, text),
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: handleClick,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2 text-sm font-medium text-dark/70 hover:text-dark underline underline-offset-4 transition-colors', className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                    className: "h-4 w-4 text-[#25D366]"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                t('bookAction')
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWhatsAppUrl"])(PHONE, text),
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: handleClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full', 'border-2 border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white', 'text-sm font-medium transition-colors', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            t('bookAction')
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/shared/LeadForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadForm",
    ()=>LeadForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-intl/dist/esm/development/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/track.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const PHONE = ("TURBOPACK compile-time value", "50764049464") || '50764049464';
function LeadForm({ source, corporate = false, withMessage = false, whatsappFollowUp, submitLabel, className = '' }) {
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocale"])();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('leadForm');
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        phone: '',
        email: '',
        company: '',
        message: '',
        website: ''
    });
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (status === 'sending') return;
        setStatus('sending');
        setError(null);
        try {
            const attr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureAttribution"])();
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source,
                    ...form,
                    locale,
                    path: window.location.pathname,
                    session_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSessionId"])(),
                    ...attr
                })
            });
            if (!res.ok) {
                const data = await res.json().catch(()=>null);
                setError(data?.error || t('error'));
                setStatus('error');
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["track"])('lead_submit', {
                meta: {
                    source
                }
            });
            setStatus('done');
        } catch  {
            setError(t('error'));
            setStatus('error');
        }
    };
    if (status === 'done') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-white rounded-xl shadow-card p-6 text-center ${className}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-6 w-6 text-gold-600"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/LeadForm.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/LeadForm.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-semibold text-dark mb-1",
                    children: t('successTitle')
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/LeadForm.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-warm-gray mb-4",
                    children: t('successBody')
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/LeadForm.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this),
                whatsappFollowUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWhatsAppUrl"])(PHONE, whatsappFollowUp),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "btn-primary inline-flex",
                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["track"])('whatsapp_click', {
                            meta: {
                                cta: `lead_${source}`
                            }
                        }),
                    children: t('whatsappNow')
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/LeadForm.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/LeadForm.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this);
    }
    const inputCls = 'w-full border border-beige rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: `space-y-3 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                name: "website",
                value: form.website,
                onChange: (e)=>setForm({
                        ...form,
                        website: e.target.value
                    }),
                className: "hidden",
                tabIndex: -1,
                autoComplete: "off",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/shared/LeadForm.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputCls,
                        placeholder: t('name'),
                        value: form.name,
                        onChange: (e)=>setForm({
                                ...form,
                                name: e.target.value
                            }),
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/LeadForm.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputCls,
                        type: "tel",
                        placeholder: t('phone'),
                        value: form.phone,
                        onChange: (e)=>setForm({
                                ...form,
                                phone: e.target.value
                            }),
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/LeadForm.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/LeadForm.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            corporate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputCls,
                        placeholder: t('company'),
                        value: form.company,
                        onChange: (e)=>setForm({
                                ...form,
                                company: e.target.value
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/LeadForm.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputCls,
                        type: "email",
                        placeholder: t('email'),
                        value: form.email,
                        onChange: (e)=>setForm({
                                ...form,
                                email: e.target.value
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/LeadForm.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/LeadForm.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            withMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: inputCls,
                rows: 3,
                placeholder: t('message'),
                value: form.message,
                onChange: (e)=>setForm({
                        ...form,
                        message: e.target.value
                    })
            }, void 0, false, {
                fileName: "[project]/src/components/shared/LeadForm.tsx",
                lineNumber: 151,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-600 text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/shared/LeadForm.tsx",
                lineNumber: 159,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: status === 'sending',
                className: "btn-primary w-full md:w-auto disabled:opacity-60",
                children: status === 'sending' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-4 w-4 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/LeadForm.tsx",
                    lineNumber: 166,
                    columnNumber: 11
                }, this) : submitLabel || t('submit')
            }, void 0, false, {
                fileName: "[project]/src/components/shared/LeadForm.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/LeadForm.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsCarousel",
    ()=>ReviewsCarousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
'use client';
;
;
;
const ROTATE_MS = 7000;
function ReviewsCarousel({ reviews, locale, visible = 3, startOffset = 0 }) {
    const [offset, setOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(startOffset % Math.max(reviews.length, 1));
    const [fading, setFading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pausedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const reduceMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (reviews.length <= visible || reduceMotion) return;
        const id = setInterval(()=>{
            if (pausedRef.current) return;
            setFading(true);
            setTimeout(()=>{
                setOffset((o)=>(o + 1) % reviews.length);
                setFading(false);
            }, 350);
        }, ROTATE_MS);
        return ()=>clearInterval(id);
    }, [
        reviews.length,
        visible,
        reduceMotion
    ]);
    if (reviews.length === 0) return null;
    const window_ = Array.from({
        length: Math.min(visible, reviews.length)
    }, (_, i)=>reviews[(offset + i) % reviews.length]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`,
        onMouseEnter: ()=>pausedRef.current = true,
        onMouseLeave: ()=>pausedRef.current = false,
        "aria-live": "polite",
        children: window_.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                className: `bg-white rounded-xl shadow-card p-6 flex flex-col ${i > 0 ? 'hidden md:flex' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex mb-3",
                        "aria-label": `${r.rating}/5`,
                        children: [
                            1,
                            2,
                            3,
                            4,
                            5
                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                className: `h-4 w-4 ${n <= r.rating ? 'fill-gold text-gold' : 'text-gold/30'}`
                            }, n, false, {
                                fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
                                lineNumber: 75,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                        className: "text-dark/80 text-sm leading-relaxed flex-1",
                        children: [
                            "“",
                            locale === 'en' ? r.quote_en : r.quote_es,
                            "”"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                        className: "mt-4 text-sm font-medium text-dark",
                        children: [
                            r.author_name,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-warm-gray font-normal",
                                children: [
                                    ' ',
                                    "· Google",
                                    r.location === 'cde' && ' · Costa del Este',
                                    r.location === 'sfc' && ' · San Francisco'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                ]
            }, r.id, true, {
                fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/proof/ReviewsCarousel.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessageCircle
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const MessageCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("MessageCircle", [
    [
        "path",
        {
            d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
            key: "vv11sd"
        }
    ]
]);
;
 //# sourceMappingURL=message-circle.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoaderCircle
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const LoaderCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("LoaderCircle", [
    [
        "path",
        {
            d: "M21 12a9 9 0 1 1-6.219-8.56",
            key: "13zald"
        }
    ]
]);
;
 //# sourceMappingURL=loader-circle.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Check
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Check", [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
]);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Star
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Star = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Star", [
    [
        "path",
        {
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
            key: "r04s7s"
        }
    ]
]);
;
 //# sourceMappingURL=star.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Star",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_c6d5d85a._.js.map