module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/booking/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/booking/mindbody.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ===========================================
// MINDBODY API UTILITY
// Server-side only - handles token management
// ===========================================
__turbopack_context__.s([
    "addAppointment",
    ()=>addAppointment,
    "addClient",
    ()=>addClient,
    "addMultipleAppointments",
    ()=>addMultipleAppointments,
    "confirmAppointment",
    ()=>confirmAppointment,
    "getActiveSessionTypes",
    ()=>getActiveSessionTypes,
    "getAddons",
    ()=>getAddons,
    "getAllServices",
    ()=>getAllServices,
    "getAllStaffAppointments",
    ()=>getAllStaffAppointments,
    "getAvailableDates",
    ()=>getAvailableDates,
    "getAvailableStaffForServices",
    ()=>getAvailableStaffForServices,
    "getBookableItems",
    ()=>getBookableItems,
    "getClientCompleteInfo",
    ()=>getClientCompleteInfo,
    "getClientPurchases",
    ()=>getClientPurchases,
    "getClientSchedule",
    ()=>getClientSchedule,
    "getClientVisits",
    ()=>getClientVisits,
    "getClientWithCustomFields",
    ()=>getClientWithCustomFields,
    "getCustomClientFields",
    ()=>getCustomClientFields,
    "getCustomPaymentMethods",
    ()=>getCustomPaymentMethods,
    "getGiftCardBalance",
    ()=>getGiftCardBalance,
    "getGiftCardProducts",
    ()=>getGiftCardProducts,
    "getLocations",
    ()=>getLocations,
    "getMindbodyToken",
    ()=>getMindbodyToken,
    "getOnlineBookableServicesForPromotions",
    ()=>getOnlineBookableServicesForPromotions,
    "getPromoCodeByCode",
    ()=>getPromoCodeByCode,
    "getPromoCodes",
    ()=>getPromoCodes,
    "getResourceAvailabilities",
    ()=>getResourceAvailabilities,
    "getResources",
    ()=>getResources,
    "getScheduleItems",
    ()=>getScheduleItems,
    "getServices",
    ()=>getServices,
    "getSessionTypes",
    ()=>getSessionTypes,
    "getStaff",
    ()=>getStaff,
    "getStaffAppointmentAvailability",
    ()=>getStaffAppointmentAvailability,
    "getStaffAppointments",
    ()=>getStaffAppointments,
    "getStaffWithAvailability",
    ()=>getStaffWithAvailability,
    "mindbodyRequest",
    ()=>mindbodyRequest,
    "purchaseGiftCard",
    ()=>purchaseGiftCard,
    "removeAppointment",
    ()=>removeAppointment,
    "searchClients",
    ()=>searchClients,
    "updateClient",
    ()=>updateClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-route] (ecmascript)");
;
// Environment variables (server-side only)
const MINDBODY_API_KEY = process.env.MINDBODY_API_KEY;
const MINDBODY_SITE_ID = process.env.MINDBODY_SITE_ID;
const MINDBODY_API_URL = process.env.MINDBODY_API_URL || 'https://api.mindbodyonline.com/public/v6';
const MINDBODY_USERNAME = process.env.MINDBODY_USERNAME || '_mindbody_api';
const MINDBODY_PASSWORD = process.env.MINDBODY_PASSWORD || '_mindbody_api';
// Validate environment variables
function validateConfig() {
    if (!MINDBODY_API_KEY) {
        throw new Error('MINDBODY_API_KEY is not configured. Please add it to Vercel Environment Variables.');
    }
    if (!MINDBODY_SITE_ID) {
        throw new Error('MINDBODY_SITE_ID is not configured. Please add it to Vercel Environment Variables.');
    }
}
// Token cache
let cachedToken = null;
let tokenExpiry = null;
// ===========================================
// TOKEN MANAGEMENT
// ===========================================
async function getAccessToken() {
    // Validate config first
    validateConfig();
    // Check if we have a valid cached token
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }
    // Request new token with up to 3 attempts for transient 5xx/timeout errors
    const maxAttempts = 3;
    let lastError = null;
    for(let attempt = 1; attempt <= maxAttempts; attempt++){
        try {
            const response = await fetch(`${MINDBODY_API_URL}/usertoken/issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': MINDBODY_API_KEY,
                    'SiteId': MINDBODY_SITE_ID
                },
                body: JSON.stringify({
                    Username: MINDBODY_USERNAME,
                    Password: MINDBODY_PASSWORD
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                // Only retry on server-side errors (5xx); fail immediately on 4xx
                if (response.status >= 500 && attempt < maxAttempts) {
                    console.warn(`Mindbody token attempt ${attempt} failed (${response.status}), retrying...`);
                    await new Promise((resolve)=>setTimeout(resolve, attempt * 1000));
                    continue;
                }
                console.error('Mindbody token error:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                    apiKeyPrefix: MINDBODY_API_KEY?.substring(0, 8),
                    siteId: MINDBODY_SITE_ID
                });
                throw new Error(`Failed to get Mindbody token: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            // Cache token (expires in 1 hour, refresh at 50 minutes)
            cachedToken = data.AccessToken;
            tokenExpiry = Date.now() + 50 * 60 * 1000;
            return cachedToken;
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt < maxAttempts) {
                console.warn(`Mindbody token attempt ${attempt} threw, retrying...`, lastError.message);
                await new Promise((resolve)=>setTimeout(resolve, attempt * 1000));
            }
        }
    }
    throw lastError ?? new Error('Failed to get Mindbody token after retries');
}
async function getMindbodyToken() {
    validateConfig();
    const response = await fetch(`${MINDBODY_API_URL}/usertoken/issue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': MINDBODY_API_KEY,
            'SiteId': MINDBODY_SITE_ID
        },
        body: JSON.stringify({
            Username: MINDBODY_USERNAME,
            Password: MINDBODY_PASSWORD
        })
    });
    if (!response.ok) {
        return null;
    }
    return response.json();
}
async function mindbodyRequest(endpoint, options = {}) {
    const { method = 'GET', body, params } = options;
    // GET requests retry on transient 5xx (safe — no side effects)
    // POST/PUT/DELETE do not retry to avoid double-booking or duplicate writes
    const maxAttempts = method === 'GET' ? 3 : 1;
    // Build URL with query params
    let url = `${MINDBODY_API_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value])=>{
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach((v)=>searchParams.append(key, String(v)));
                } else {
                    searchParams.append(key, String(value));
                }
            }
        });
        const queryString = searchParams.toString();
        if (queryString) url += `?${queryString}`;
    }
    for(let attempt = 1; attempt <= maxAttempts; attempt++){
        // Get access token (re-fetched each attempt in case the previous token was stale)
        const token = await getAccessToken();
        console.log('Mindbody API request:', method, url, attempt > 1 ? `(attempt ${attempt})` : '');
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': MINDBODY_API_KEY,
                'SiteId': MINDBODY_SITE_ID,
                'Authorization': `Bearer ${token}`
            },
            body: body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) {
            const errorText = await response.text();
            const isHtml = errorText.trim().startsWith('<');
            const errorDetail = isHtml ? response.statusText || 'Server error' : errorText;
            // Retry transient 5xx on GET requests
            if (response.status >= 500 && attempt < maxAttempts) {
                console.warn(`Mindbody API ${response.status} on ${endpoint} (attempt ${attempt}/${maxAttempts}), retrying in ${attempt}s…`);
                await new Promise((resolve)=>setTimeout(resolve, attempt * 1000));
                continue;
            }
            console.error(`Mindbody API error: ${response.status}`, {
                endpoint,
                method,
                body: body ? JSON.stringify(body) : undefined,
                errorText: isHtml ? `[HTML ${response.status} page]` : errorText
            });
            throw new Error(`Mindbody API error: ${response.status} - ${errorDetail}`);
        }
        return response.json();
    }
    // Unreachable but satisfies TypeScript
    throw new Error(`Mindbody API: all ${maxAttempts} attempts failed for ${endpoint}`);
}
async function searchClients(searchText) {
    const response = await mindbodyRequest('/client/clients', {
        params: {
            searchText
        }
    });
    return response.Clients || [];
}
async function addClient(clientData) {
    // Add required fields with defaults if not provided
    // These fields are configured as required by the business in Mindbody
    const requestData = {
        ...clientData,
        AddressLine1: clientData.AddressLine1 || 'Panamá',
        ReferredBy: clientData.ReferredBy || 'Website',
        Gender: clientData.Gender || 'Female'
    };
    // Mindbody API expects the client fields directly at the root level
    console.log('addClient - Sending to Mindbody:', JSON.stringify(requestData, null, 2));
    const response = await mindbodyRequest('/client/addclient', {
        method: 'POST',
        body: requestData
    });
    console.log('addClient - Mindbody response:', JSON.stringify(response, null, 2));
    // Check for error in response
    if (response.Error) {
        console.error('Mindbody addClient error:', response.Error);
        throw new Error(`Mindbody API error: ${response.Error.Message || response.Error.Code || 'Unknown error'}`);
    }
    if (!response.Client) {
        console.error('Mindbody addClient - No client in response:', response);
        throw new Error('Mindbody API did not return a client');
    }
    return response.Client;
}
async function getLocations() {
    const response = await mindbodyRequest('/site/locations');
    return response.Locations || [];
}
// ===========================================
// SERVICE HELPERS
// ===========================================
// Get Spanish category name from ProgramId
function getSpanishCategory(programId) {
    if (programId && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PROGRAM_NAMES"][programId]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PROGRAM_NAMES"][programId];
    }
    return 'General';
}
// ===========================================
// ITBM TAX REMOVAL HELPER
// Mindbody prices include 7% ITBM tax
// We remove it for display, calculate in cart
// Uses ITBM_TAX_RATE from constants.ts
// ===========================================
function removeTaxFromPrice(priceWithTax) {
    // Formula: priceWithoutTax = priceWithTax / (1 + taxRate)
    if (!priceWithTax || priceWithTax <= 0) return 0;
    return Math.round(priceWithTax / (1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ITBM_TAX_RATE"]));
}
// ===========================================
// DURATION PARSING HELPER
// Extract duration from service name (e.g., "Baño de Luna - 120 min")
// ===========================================
function parseDurationFromName(name) {
    // Match patterns like "120 min", "60min", "90 mins", "45 minutos"
    const patterns = [
        /(\d+)\s*min(?:utos?|s)?/i,
        /(\d+)\s*(?:hr|hora)s?/i
    ];
    for (const pattern of patterns){
        const match = name.match(pattern);
        if (match) {
            const value = parseInt(match[1], 10);
            // If it's hours, convert to minutes
            if (pattern.source.includes('hr|hora')) {
                return value * 60;
            }
            return value;
        }
    }
    return 0 // Default if no duration found
    ;
}
async function getSessionTypes(onlineOnly = true) {
    const response = await mindbodyRequest('/site/sessiontypes', {
        params: {
            limit: 200,
            onlineOnly: onlineOnly
        }
    });
    const sessionTypes = response.SessionTypes || [];
    console.log(`Session types from Mindbody (onlineOnly=${onlineOnly}):`, sessionTypes.length);
    return sessionTypes;
}
async function getResourceAvailabilities(params) {
    const queryParams = {
        startDate: params.startDate,
        limit: params.limit ?? 200,
        offset: params.offset ?? 0
    };
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.programIds && params.programIds.length > 0) queryParams.programIds = params.programIds;
    if (params.locationIds && params.locationIds.length > 0) queryParams.locationIds = params.locationIds;
    if (params.resourceIds && params.resourceIds.length > 0) queryParams.resourceIds = params.resourceIds;
    if (params.scheduleTypes && params.scheduleTypes.length > 0) queryParams.scheduleTypes = params.scheduleTypes;
    const response = await mindbodyRequest('/site/resourceavailabilities', {
        params: queryParams
    });
    const items = response.ResourceAvailabilities || [];
    console.log(`ResourceAvailabilities from Mindbody:`, items.length, 'items');
    if (response.PaginationResponse) console.log('Pagination:', response.PaginationResponse);
    return items;
}
async function getResources(params = {}) {
    const queryParams = {
        limit: 200
    };
    if (params.includeInactive) queryParams.includeInactive = true;
    if (params.resourceIds && params.resourceIds.length > 0) queryParams.resourceIds = params.resourceIds;
    const response = await mindbodyRequest('/site/resources', {
        params: queryParams
    });
    const resources = response.Resources || [];
    console.log(`Resources from Mindbody:`, resources.length);
    return resources;
}
// Normalize name for matching between sale/services and sessiontypes
function normalizeServiceName(name) {
    return name.toLowerCase().trim()// Remove common variations
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/[–—]/g, '-') // Different dash types
    ;
}
// Find matching session type - exact match only
function findSessionTypeMatch(name, sessionTypeMap) {
    const normalizedName = normalizeServiceName(name);
    // Exact match only
    if (sessionTypeMap.has(normalizedName)) {
        return sessionTypeMap.get(normalizedName);
    }
    return undefined;
}
// Shared function to fetch all online bookable services from Mindbody
// Returns all services with session type matching applied
async function fetchAllOnlineBookableServices(locationId) {
    // Fetch both session types and sale services in parallel
    const [sessionTypes, saleServicesResponse] = await Promise.all([
        getSessionTypes(true),
        mindbodyRequest('/sale/services', {
            params: {
                limit: 200,
                sellOnline: true,
                ...locationId ? {
                    locationId: locationId
                } : {}
            }
        })
    ]);
    const allSaleServices = saleServicesResponse.Services || [];
    console.log('Total sale/services from Mindbody:', allSaleServices.length);
    console.log('Total online session types:', sessionTypes.length);
    // Create a map of session types by normalized name for matching
    const sessionTypeMap = new Map();
    for (const st of sessionTypes){
        const normalizedName = normalizeServiceName(st.Name);
        sessionTypeMap.set(normalizedName, {
            Id: st.Id,
            Duration: st.DefaultTimeLength || 0,
            ProgramId: st.ProgramId,
            Description: st.OnlineDescription || st.Description || ''
        });
    }
    // Filter all sale services (online bookable, single session, has price)
    const filteredServices = allSaleServices.filter((s)=>s.SellOnline === true && s.Count === 1 && s.Price > 0);
    console.log('Filtered sale services (SellOnline, single session, has price):', filteredServices.length);
    // Transform and match with session types for correct Id
    const services = filteredServices.map((s)=>{
        const sessionType = findSessionTypeMatch(s.Name, sessionTypeMap);
        // Use SessionTypeId from session types if found, otherwise use ProductId
        const serviceId = sessionType?.Id || s.ProductId;
        const duration = sessionType?.Duration || parseDurationFromName(s.Name);
        if (!sessionType) {
            console.log(`Warning: No session type match for service: ${s.Name} (ProgramId=${s.ProgramId})`);
        }
        return {
            Id: serviceId,
            ProductId: s.ProductId,
            Name: s.Name,
            Description: sessionType?.Description || '',
            Duration: duration,
            Price: removeTaxFromPrice(s.Price || s.OnlinePrice || 0),
            OnlinePrice: removeTaxFromPrice(s.OnlinePrice),
            TaxIncluded: s.TaxIncluded,
            OnlineBooking: s.SellOnline,
            Category: getSpanishCategory(s.ProgramId),
            ProgramId: s.ProgramId,
            IsAddOn: false,
            HasSessionTypeMatch: sessionType !== undefined
        };
    });
    return {
        services,
        sessionTypeMap
    };
}
async function getServices(locationId) {
    const { services, sessionTypeMap } = await fetchAllOnlineBookableServices(locationId);
    // Filter out Adicionales (ProgramId 8) and only include services with session type match
    const onlineBookableServices = services.filter((s)=>s.ProgramId !== 8 && // Exclude Adicionales
        findSessionTypeMatch(s.Name, sessionTypeMap) !== undefined);
    console.log('Online bookable services (excluding Adicionales):', onlineBookableServices.length);
    console.log('Services with prices (tax removed):', onlineBookableServices.filter((s)=>s.Price > 0).length);
    return onlineBookableServices;
}
async function getOnlineBookableServicesForPromotions(locationId) {
    const { services } = await fetchAllOnlineBookableServices(locationId);
    // Return ALL online bookable services including add-ons (Adicionales)
    // Promotions can include any service type
    console.log('All online bookable services for promotions (no filters):', services.length);
    return services;
}
async function getAddons(locationId) {
    const { services, sessionTypeMap } = await fetchAllOnlineBookableServices(locationId);
    // Filter for Adicionales only (ProgramId 8) and require session type match for booking
    const onlineBookableAddons = services.filter((s)=>s.ProgramId === 8 && // Only Adicionales
        findSessionTypeMatch(s.Name, sessionTypeMap) !== undefined);
    console.log('Online bookable addons (Adicionales only):', onlineBookableAddons.length);
    console.log('Addons with prices (tax removed):', onlineBookableAddons.filter((s)=>s.Price > 0).length);
    return onlineBookableAddons;
}
async function getAllServices(locationId) {
    // Fetch ALL session types, ONLINE-ONLY session types, and sale services in parallel
    const [allSessionTypes, onlineSessionTypes, saleServicesResponse] = await Promise.all([
        getSessionTypes(false),
        getSessionTypes(true),
        mindbodyRequest('/sale/services', {
            params: {
                limit: 200,
                // Don't filter by sellOnline - get all services
                ...locationId ? {
                    locationId: locationId
                } : {}
            }
        })
    ]);
    const allSaleServices = saleServicesResponse.Services || [];
    console.log('Total sale/services from Mindbody (all):', allSaleServices.length);
    console.log('Total session types (all):', allSessionTypes.length);
    console.log('Total ONLINE session types:', onlineSessionTypes.length);
    // Create a set of online bookable session type IDs for quick lookup
    const onlineSessionTypeIds = new Set(onlineSessionTypes.map((st)=>st.Id));
    console.log('Online bookable session type IDs:', Array.from(onlineSessionTypeIds));
    // Create a map of session types by normalized name for matching
    const sessionTypeMap = new Map();
    for (const st of allSessionTypes){
        const normalizedName = normalizeServiceName(st.Name);
        sessionTypeMap.set(normalizedName, {
            Id: st.Id,
            Duration: st.DefaultTimeLength || 0,
            ProgramId: st.ProgramId,
            Description: st.OnlineDescription || st.Description || ''
        });
    }
    // Filter for single session services with price (but don't require SellOnline)
    const filteredServices = allSaleServices.filter((s)=>s.Count === 1 && // Single session only
        s.Price > 0 // Has price
    );
    console.log('Filtered sale services (single session, has price):', filteredServices.length);
    // Transform services - include both online and offline bookable
    const services = filteredServices.map((s)=>{
        const sessionType = findSessionTypeMatch(s.Name, sessionTypeMap);
        // Use SessionTypeId from session types if found, otherwise use ProductId
        const serviceId = sessionType?.Id || s.ProductId;
        const duration = sessionType?.Duration || parseDurationFromName(s.Name);
        // Determine online bookability from session type, NOT from sale/services SellOnline
        // A service is online bookable only if its session type ID is in the online session types list
        const isOnlineBookable = sessionType ? onlineSessionTypeIds.has(sessionType.Id) : false;
        return {
            Id: serviceId,
            ProductId: s.ProductId,
            Name: s.Name,
            Description: sessionType?.Description || '',
            Duration: duration,
            Price: removeTaxFromPrice(s.Price || s.OnlinePrice || 0),
            OnlinePrice: removeTaxFromPrice(s.OnlinePrice),
            TaxIncluded: s.TaxIncluded,
            OnlineBooking: isOnlineBookable,
            Category: getSpanishCategory(s.ProgramId),
            ProgramId: s.ProgramId,
            IsAddOn: s.ProgramId === 8,
            HasSessionTypeMatch: sessionType !== undefined
        };
    });
    console.log('All services for admin:', services.length);
    console.log('Online bookable services:', services.filter((s)=>s.OnlineBooking).length);
    console.log('Offline only services:', services.filter((s)=>!s.OnlineBooking).length);
    return services;
}
async function getStaff(locationId) {
    console.log('getStaff called with locationId:', locationId);
    const response = await mindbodyRequest('/staff/staff', {
        params: locationId ? {
            locationIds: locationId
        } : undefined
    });
    const allStaff = response.StaffMembers || [];
    console.log('Total staff from Mindbody:', allStaff.length);
    // Filter for appointment providers - AppointmentTrn may be undefined, so default to true
    // Include staff if AppointmentTrn is true OR undefined (not explicitly false)
    const filteredStaff = allStaff.filter((s)=>s.AppointmentTrn !== false).map((s)=>({
            Id: s.Id,
            FirstName: s.FirstName,
            LastName: s.LastName,
            DisplayName: s.DisplayName || `${s.FirstName} ${s.LastName}`,
            Bio: s.Bio,
            ImageUrl: s.ImageUrl,
            AppointmentTrn: s.AppointmentTrn ?? true
        }));
    console.log('Filtered staff (appointment providers):', filteredStaff.length);
    return filteredStaff;
}
async function getAvailableStaffForServices(params) {
    // Get availability for the next 14 days to find staff who can perform these services
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    const startDate = today.toISOString().split('T')[0];
    const endDate = twoWeeksLater.toISOString().split('T')[0];
    try {
        const bookableItems = await getBookableItems({
            locationIds: params.locationId,
            sessionTypeIds: params.sessionTypeIds,
            startDate,
            endDate
        });
        // Extract unique staff from bookable items
        const staffMap = new Map();
        for (const item of bookableItems){
            if (item.Staff && !staffMap.has(item.Staff.Id)) {
                staffMap.set(item.Staff.Id, {
                    Id: item.Staff.Id,
                    FirstName: item.Staff.FirstName,
                    LastName: item.Staff.LastName,
                    DisplayName: `${item.Staff.FirstName} ${item.Staff.LastName}`,
                    Bio: null,
                    ImageUrl: null,
                    AppointmentTrn: true
                });
            }
        }
        return Array.from(staffMap.values());
    } catch (error) {
        console.error('Error getting available staff for services:', error);
        // Fall back to regular staff list
        return getStaff(params.locationId);
    }
}
async function getAvailableDates(params) {
    console.log('getAvailableDates called with:', params);
    const queryParams = {
        locationId: params.locationId,
        sessionTypeIds: params.sessionTypeIds,
        startDate: params.startDate,
        endDate: params.endDate
    };
    if (params.staffId) {
        queryParams.staffId = params.staffId;
    }
    const response = await mindbodyRequest('/appointment/availabledates', {
        params: queryParams
    });
    console.log('Available dates response:', response.AvailableDates?.length || 0, 'dates');
    return response.AvailableDates || [];
}
async function getStaffWithAvailability(params) {
    console.log('getStaffWithAvailability called with:', params);
    // First get all staff for this location
    const allStaff = await getStaff(params.locationId);
    console.log('All staff for location:', allStaff.length);
    if (allStaff.length === 0) {
        return [];
    }
    // Check each staff member for available dates
    const staffWithAvailability = [];
    for (const staff of allStaff){
        try {
            const availableDates = await getAvailableDates({
                locationId: params.locationId,
                sessionTypeIds: params.sessionTypeIds,
                staffId: staff.Id,
                startDate: params.startDate,
                endDate: params.endDate
            });
            if (availableDates.length > 0) {
                staffWithAvailability.push(staff);
                console.log(`Staff ${staff.DisplayName} has ${availableDates.length} available dates`);
            }
        } catch (error) {
            console.error(`Error checking availability for staff ${staff.Id}:`, error);
            // Include staff anyway if we can't check - better to show than hide
            staffWithAvailability.push(staff);
        }
    }
    console.log('Staff with availability:', staffWithAvailability.length);
    return staffWithAvailability;
}
async function getBookableItems(params) {
    console.log('getBookableItems called with:', params);
    // Build params - Mindbody API expects arrays for locationIds and sessionTypeIds
    const queryParams = {
        // Pass locationIds as array (repeated params)
        locationIds: [
            params.locationIds
        ],
        startDate: params.startDate,
        endDate: params.endDate,
        limit: 200
    };
    // Only add sessionTypeIds if provided and not empty
    if (params.sessionTypeIds && params.sessionTypeIds.length > 0) {
        queryParams.sessionTypeIds = params.sessionTypeIds;
    }
    if (params.staffIds) {
        queryParams.staffIds = [
            params.staffIds
        ];
    }
    if (params.includeResourceAvailability) {
        queryParams.includeResourceAvailability = true;
    }
    console.log('getBookableItems query params:', queryParams);
    // Mindbody GET /appointment/bookableitems uses query params
    const response = await mindbodyRequest('/appointment/bookableitems', {
        params: queryParams
    });
    console.log('Bookable items response:', response.AvailableItems?.length || 0, 'items');
    if (response.PaginationResponse) {
        console.log('Pagination:', response.PaginationResponse);
    }
    return response.AvailableItems || [];
}
async function getStaffAppointmentAvailability(params) {
    console.log('getStaffAppointmentAvailability called with:', params);
    const queryParams = {
        locationId: params.locationId,
        startDateTime: params.startDateTime,
        endDateTime: params.endDateTime
    };
    if (params.staffIds && params.staffIds.length > 0) {
        queryParams.staffIds = params.staffIds;
    }
    const response = await mindbodyRequest('/staff/staffappointmentavailability', {
        params: queryParams
    });
    console.log('Staff availability response:', response.StaffMembers?.length || 0, 'staff members');
    return response.StaffMembers || [];
}
async function getStaffAppointments(params) {
    console.log('getStaffAppointments called with:', params);
    const queryParams = {
        locationIds: [
            params.locationId
        ],
        startDate: params.startDate,
        endDate: params.endDate,
        limit: params.limit ?? 200,
        offset: params.offset ?? 0
    };
    if (params.staffIds && params.staffIds.length > 0) {
        queryParams.staffIds = params.staffIds;
    }
    const response = await mindbodyRequest('/appointment/staffappointments', {
        params: queryParams
    });
    console.log('Staff appointments response:', response.Appointments?.length || 0, 'appointments');
    return {
        appointments: response.Appointments || [],
        pagination: response.PaginationResponse
    };
}
async function getAllStaffAppointments(params) {
    const PAGE_SIZE = 200;
    const all = [];
    let offset = 0;
    while(true){
        const { appointments, pagination } = await getStaffAppointments({
            ...params,
            limit: PAGE_SIZE,
            offset
        });
        all.push(...appointments);
        const total = pagination?.TotalResults ?? appointments.length;
        offset += PAGE_SIZE;
        if (offset >= total || appointments.length < PAGE_SIZE) break;
    }
    return all;
}
async function getActiveSessionTypes(params) {
    console.log('getActiveSessionTypes called with:', params);
    const response = await mindbodyRequest('/appointment/activesessiontypes', {
        params: {
            scheduleType: 'Appointment',
            locationId: params.locationId,
            startDate: params.startDate,
            endDate: params.endDate
        }
    });
    console.log('Active session types response:', response.SessionTypes?.length || 0, 'session types');
    return response.SessionTypes || [];
}
async function getScheduleItems(params) {
    console.log('getScheduleItems called with:', params);
    const queryParams = {
        locationIds: params.locationIds,
        startDate: params.startDate,
        endDate: params.endDate
    };
    if (params.staffIds && params.staffIds.length > 0) {
        queryParams.staffIds = params.staffIds;
    }
    const response = await mindbodyRequest('/appointment/scheduleitems', {
        params: queryParams
    });
    console.log('Schedule items response:', response.StaffMembers?.length || 0, 'staff members');
    return response.StaffMembers || [];
}
async function addAppointment(appointmentData) {
    console.log('=== addAppointment called ===');
    console.log('Request data:', JSON.stringify(appointmentData, null, 2));
    // Mindbody API expects specific field names - ensure proper casing
    // The API is case-sensitive and expects these exact field names
    const requestBody = {
        ClientId: appointmentData.ClientId,
        LocationId: appointmentData.LocationId,
        StaffId: appointmentData.StaffId,
        SessionTypeId: appointmentData.SessionTypeId,
        StartDateTime: appointmentData.StartDateTime,
        EndDateTime: appointmentData.EndDateTime,
        Notes: appointmentData.Notes,
        StaffRequested: appointmentData.StaffRequested ?? false
    };
    console.log('Final request body:', JSON.stringify(requestBody, null, 2));
    const response = await mindbodyRequest('/appointment/addappointment', {
        method: 'POST',
        body: requestBody
    });
    console.log('Mindbody addAppointment response:', JSON.stringify(response, null, 2));
    // Check for error in response
    if (response.Error) {
        console.error('Mindbody API returned error:', response.Error);
        throw new Error(`Mindbody API error: ${response.Error.Message || response.Error.Code || 'Unknown error'}`);
    }
    // Validate that we got an appointment back
    if (!response.Appointment || !response.Appointment.Id) {
        console.error('Mindbody API did not return a valid appointment:', response);
        throw new Error('Mindbody API did not return a valid appointment');
    }
    console.log('Successfully created appointment:', response.Appointment.Id);
    return response.Appointment;
}
async function confirmAppointment(appointmentId) {
    try {
        console.log(`Confirming appointment ${appointmentId}...`);
        await mindbodyRequest('/appointment/updateappointment', {
            method: 'POST',
            body: {
                AppointmentId: appointmentId,
                Execute: 'Confirm'
            }
        });
        console.log(`Successfully confirmed appointment ${appointmentId}`);
        return true;
    } catch (error) {
        console.error(`Failed to confirm appointment ${appointmentId}:`, error);
        return false;
    }
}
async function removeAppointment(appointmentId) {
    try {
        console.log(`Cancelling appointment ${appointmentId}...`);
        await mindbodyRequest('/appointment/updateappointment', {
            method: 'POST',
            body: {
                AppointmentId: appointmentId,
                Execute: 'Cancel'
            }
        });
        console.log(`Successfully cancelled appointment ${appointmentId}`);
        return true;
    } catch (error) {
        console.error(`Failed to cancel appointment ${appointmentId}:`, error);
        return false;
    }
}
async function addMultipleAppointments(appointments) {
    const createdAppointments = [];
    for(let i = 0; i < appointments.length; i++){
        const appointment = appointments[i];
        try {
            console.log(`=== Creating appointment ${i + 1}/${appointments.length} ===`);
            console.log('SessionTypeId:', appointment.SessionTypeId);
            console.log('StartDateTime:', appointment.StartDateTime);
            const result = await addAppointment(appointment);
            createdAppointments.push({
                id: result.Id,
                appointment: result
            });
            // Use Mindbody's actual EndDateTime for the next appointment's start time.
            // This prevents overlap when Mindbody's stored duration differs from the
            // frontend value (e.g. service shows 35 min but Mindbody books it as 40 min).
            // Mindbody returns EndDateTime without a timezone offset and expects StartDateTime
            // in the same local-time format — pass it through as-is, no UTC conversion.
            if (i + 1 < appointments.length && result.EndDateTime) {
                console.log(`Mindbody EndDateTime for appt ${i + 1}: ${result.EndDateTime} → using as next start`);
                appointments[i + 1] = {
                    ...appointments[i + 1],
                    StartDateTime: result.EndDateTime
                };
            }
        } catch (error) {
            console.error(`=== Appointment ${i + 1} FAILED ===`);
            console.error('SessionTypeId:', appointment.SessionTypeId);
            console.error('Error:', error);
            // Roll back all previously created appointments
            if (createdAppointments.length > 0) {
                console.log(`Rolling back ${createdAppointments.length} previously created appointment(s)...`);
                for (const created of createdAppointments){
                    await removeAppointment(created.id);
                }
            }
            // Return failure with the error from the appointment that failed
            return {
                success: false,
                error: String(error),
                failedIndex: i,
                sessionTypeId: appointment.SessionTypeId
            };
        }
    }
    return {
        success: true,
        appointments: createdAppointments.map((c)=>c.appointment)
    };
}
async function getClientVisits(params) {
    const queryParams = new URLSearchParams();
    queryParams.set('request.clientId', params.clientId);
    if (params.startDate) {
        queryParams.set('request.startDate', params.startDate);
    }
    if (params.endDate) {
        queryParams.set('request.endDate', params.endDate);
    }
    if (params.limit) {
        queryParams.set('request.limit', params.limit.toString());
    }
    if (params.offset) {
        queryParams.set('request.offset', params.offset.toString());
    }
    const response = await mindbodyRequest(`/client/clientvisits?${queryParams.toString()}`);
    return {
        visits: response.Visits || [],
        pagination: response.PaginationResponse
    };
}
async function getClientPurchases(params) {
    const queryParams = new URLSearchParams();
    queryParams.set('request.clientId', params.clientId);
    if (params.startDate) {
        queryParams.set('request.startDate', params.startDate);
    }
    if (params.endDate) {
        queryParams.set('request.endDate', params.endDate);
    }
    if (params.limit) {
        queryParams.set('request.limit', params.limit.toString());
    }
    if (params.offset) {
        queryParams.set('request.offset', params.offset.toString());
    }
    const response = await mindbodyRequest(`/client/clientpurchases?${queryParams.toString()}`);
    return {
        purchases: response.Purchases || [],
        pagination: response.PaginationResponse
    };
}
async function getClientSchedule(params) {
    const queryParams = new URLSearchParams();
    queryParams.set('request.clientId', params.clientId);
    if (params.startDate) {
        queryParams.set('request.startDate', params.startDate);
    }
    if (params.endDate) {
        queryParams.set('request.endDate', params.endDate);
    }
    if (params.limit) {
        queryParams.set('request.limit', params.limit.toString());
    }
    if (params.offset) {
        queryParams.set('request.offset', params.offset.toString());
    }
    const response = await mindbodyRequest(`/client/clientschedule?${queryParams.toString()}`);
    return {
        visits: response.Visits || [],
        pagination: response.PaginationResponse
    };
}
async function getClientCompleteInfo(clientId) {
    // Use the mindbodyRequest helper with ClientIds parameter (Mindbody API v6 format)
    const response = await mindbodyRequest('/client/clients', {
        params: {
            ClientIds: clientId
        }
    });
    // The API returns a Clients array, get the first one
    const clients = response.Clients;
    return clients?.[0] || null;
}
async function getCustomClientFields() {
    const response = await mindbodyRequest('/client/customclientfields');
    return response.CustomClientFields || [];
}
async function updateClient(clientData) {
    const response = await mindbodyRequest('/client/updateclient', {
        method: 'POST',
        body: {
            Client: clientData,
            CrossRegionalUpdate: false // Required for single-site updates
        }
    });
    return response.Client;
}
async function getClientWithCustomFields(clientId) {
    console.log('getClientWithCustomFields - Fetching client ID:', clientId);
    // Use the mindbodyRequest helper with ClientIds parameter (Mindbody API v6 format)
    const response = await mindbodyRequest('/client/clients', {
        params: {
            ClientIds: clientId
        }
    });
    const client = response.Clients?.[0] || null;
    if (client) {
        console.log('getClientWithCustomFields - Found client:', {
            Id: client.Id,
            UniqueId: client.UniqueId,
            FirstName: client.FirstName,
            LastName: client.LastName,
            Email: client.Email
        });
    } else {
        console.warn('getClientWithCustomFields - No client found for ID:', clientId);
    }
    return client;
}
async function getPromoCodes(options) {
    const params = {
        'request.limit': 100,
        'request.offset': 0
    };
    // Active only filter - defaults to true per API docs
    if (options?.activeOnly !== undefined) {
        params['request.activeOnly'] = options.activeOnly;
    }
    // Note: The API doesn't have a native search parameter,
    // so we fetch all and filter client-side for partial text matching
    console.log('Fetching promo codes from Mindbody with params:', params);
    try {
        const response = await mindbodyRequest('/site/promocodes', {
            params
        });
        let promoCodes = response.PromoCodes || [];
        console.log('Received', promoCodes.length, 'promo codes from Mindbody');
        // If searchText provided, filter client-side by name, code, or applicable item names
        if (options?.searchText) {
            const searchLower = options.searchText.toLowerCase();
            promoCodes = promoCodes.filter((pc)=>pc.Name?.toLowerCase().includes(searchLower) || pc.Code?.toLowerCase().includes(searchLower) || pc.ApplicableItems?.some((item)=>item.Name?.toLowerCase().includes(searchLower)));
            console.log('Filtered to', promoCodes.length, 'promo codes matching:', options.searchText);
        }
        return promoCodes;
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        throw error;
    }
}
async function getPromoCodeByCode(code) {
    const promoCodes = await getPromoCodes({
        searchText: code
    });
    // Find exact match
    const exactMatch = promoCodes.find((pc)=>pc.Code.toLowerCase() === code.toLowerCase());
    return exactMatch || null;
}
async function getGiftCardBalance(barcodeId) {
    try {
        const response = await mindbodyRequest('/sale/giftcardbalance', {
            params: {
                barcodeId
            }
        });
        if (!response || typeof response.RemainingBalance !== 'number') {
            return null;
        }
        return response;
    } catch (error) {
        // Mindbody returns an error (4xx) when the barcode isn't found.
        // Surface as "not sold yet" rather than a generic failure.
        const msg = error instanceof Error ? error.message : String(error);
        if (/40[04]|not found|invalid/i.test(msg)) {
            return null;
        }
        throw error;
    }
}
async function getGiftCardProducts() {
    const response = await mindbodyRequest('/sale/giftcards', {
        params: {
            soldOnline: false
        }
    });
    return response?.GiftCards ?? [];
}
async function getCustomPaymentMethods() {
    const response = await mindbodyRequest('/sale/custompaymentmethods', {});
    return response?.PaymentMethods ?? [];
}
async function purchaseGiftCard(input) {
    return mindbodyRequest('/sale/purchasegiftcard', {
        method: 'POST',
        body: {
            Test: input.test ?? false,
            LocationId: input.locationId,
            GiftCardId: input.giftCardId,
            ...input.layoutId ? {
                LayoutId: input.layoutId
            } : {},
            PurchaserClientId: input.purchaserClientId,
            SendEmailReceipt: false,
            ...input.recipientName ? {
                RecipientName: input.recipientName
            } : {},
            ...input.recipientEmail ? {
                RecipientEmail: input.recipientEmail
            } : {},
            ...input.giftMessage ? {
                GiftMessage: input.giftMessage
            } : {},
            ...input.title ? {
                Title: input.title
            } : {},
            PaymentInfo: input.paymentInfo
        }
    });
}
}),
"[project]/src/app/api/mindbody/locations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/mindbody.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-route] (ecmascript)");
;
;
;
// Custom location names (Mindbody might return different names)
const LOCATION_NAME_OVERRIDES = {
    1: 'Costa del Este',
    2: 'San Francisco'
};
async function GET() {
    try {
        const locations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLocations"])();
        // Validate API response
        if (!Array.isArray(locations)) {
            console.error('Invalid Mindbody response: locations is not an array');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].LOCATIONS_LOAD_FAILED
            }, {
                status: 500
            });
        }
        // Transform to our format with addresses and custom names
        const formattedLocations = locations.map((loc)=>{
            // Validate required fields
            if (!loc.Id || !loc.Name) {
                console.warn('Location missing required fields:', loc);
            }
            return {
                Id: loc.Id,
                Name: LOCATION_NAME_OVERRIDES[loc.Id] || loc.Name,
                Address: loc.Address || '',
                Address2: loc.Address2 || null,
                City: loc.City || '',
                StateProvCode: loc.StateProvCode || '',
                PostalCode: loc.PostalCode || '',
                Phone: loc.Phone || '',
                // Full address string
                FullAddress: [
                    loc.Address,
                    loc.Address2,
                    loc.City
                ].filter(Boolean).join(', ')
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            locations: formattedLocations
        });
    } catch (error) {
        console.error('Get locations error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeError"])(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__db57668a._.js.map