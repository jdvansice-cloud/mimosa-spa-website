module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/[locale]/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/[locale]/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/[locale]/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/[locale]/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/booking/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/content/landings.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LANDINGS",
    ()=>LANDINGS
]);
// Local-SEO landing page copy. Spanish slugs in both locales (site convention);
// hreflang handles the EN alternate.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-rsc] (ecmascript)");
;
const LANDINGS = [
    {
        slug: 'masajes-costa-del-este',
        location: 'cde',
        title: {
            es: 'Masajes en Costa del Este | Mimosa Spa Retreat',
            en: 'Massages in Costa del Este | Mimosa Spa Retreat'
        },
        metaDescription: {
            es: 'Spa de masajes en Costa del Este, Ciudad de Panamá: masajes relajantes, descontracturantes y rituales signature en Star Plaza, frente al Riba Smith.',
            en: 'Massage spa in Costa del Este, Panama City: relaxing and deep-tissue massages and signature rituals at Star Plaza, across from Riba Smith.'
        },
        h1: {
            es: 'Masajes en Costa del Este',
            en: 'Massages in Costa del Este'
        },
        intro: [
            {
                es: 'A pasos de las torres de Costa del Este, Mimosa Spa Retreat es el refugio donde el barrio corporativo baja las revoluciones. Nuestro spa en Star Plaza, frente al Riba Smith, ofrece masajes relajantes y terapéuticos con terapeutas certificados en un ambiente zen de aromas y música suave.',
                en: 'Steps from the Costa del Este towers, Mimosa Spa Retreat is where the corporate district slows down. Our spa at Star Plaza, across from Riba Smith, offers relaxing and therapeutic massages with certified therapists in a calm, aromatic setting.'
            },
            {
                es: 'Elige entre el clásico Mimosa Relax, el masaje profundo descontracturante, piedras calientes o nuestros rituales signature — de lunes a domingo, con estacionamiento en la plaza.',
                en: 'Choose the classic Mimosa Relax, a deep-tissue massage, hot stones or our signature rituals — open every day, with plaza parking.'
            }
        ],
        highlights: [
            {
                es: 'Terapeutas certificados y cabinas privadas',
                en: 'Certified therapists and private cabins'
            },
            {
                es: 'Frente al Riba Smith de Costa del Este',
                en: 'Across from Riba Smith in Costa del Este'
            },
            {
                es: 'Reserva en línea o por WhatsApp en minutos',
                en: 'Book online or via WhatsApp in minutes'
            }
        ],
        programIds: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].PAQUETES_DELUXE,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].TRATAMIENTOS_CORPORALES
        ],
        servicesTitle: {
            es: 'Nuestros masajes',
            en: 'Our massages'
        },
        faqs: [
            {
                q: {
                    es: '¿Dónde están ubicados en Costa del Este?',
                    en: 'Where are you located in Costa del Este?'
                },
                a: {
                    es: 'En Star Plaza, frente al Riba Smith. También tenemos sede en San Francisco, Calle 74E.',
                    en: 'At Star Plaza, across from Riba Smith. We also have a location in San Francisco, Calle 74E.'
                }
            },
            {
                q: {
                    es: '¿Necesito reservar con anticipación?',
                    en: 'Do I need to book in advance?'
                },
                a: {
                    es: 'Recomendamos reservar por WhatsApp o en línea, especialmente para fines de semana. Entre semana solemos tener disponibilidad el mismo día.',
                    en: 'We recommend booking via WhatsApp or online, especially for weekends. On weekdays we usually have same-day availability.'
                }
            }
        ],
        mapUrl: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A'
    },
    {
        slug: 'spa-san-francisco',
        location: 'sfc',
        title: {
            es: 'Spa en San Francisco, Panamá | Mimosa Spa Retreat',
            en: 'Spa in San Francisco, Panama | Mimosa Spa Retreat'
        },
        metaDescription: {
            es: 'Spa en San Francisco, Ciudad de Panamá: masajes, faciales y rituales en Calle 74E, al lado de la Delta de Calle 50. Reserva en línea o por WhatsApp.',
            en: 'Spa in San Francisco, Panama City: massages, facials and rituals on Calle 74E, next to the Delta on Calle 50. Book online or via WhatsApp.'
        },
        h1: {
            es: 'Tu spa en San Francisco',
            en: 'Your spa in San Francisco'
        },
        intro: [
            {
                es: 'Nuestra sede de San Francisco trae la experiencia Mimosa al corazón residencial de la ciudad: cabinas amplias, cabinas dobles para parejas y el mismo estándar de servicio que nos hizo el spa mejor calificado de Costa del Este.',
                en: 'Our San Francisco location brings the Mimosa experience to the heart of the city: spacious cabins, double cabins for couples and the same standard that made us the top-rated spa in Costa del Este.'
            },
            {
                es: 'Estamos en Calle 74E, al lado de la Delta de Calle 50 — a minutos de Punta Pacífica, Coco del Mar y Obarrio.',
                en: 'Find us on Calle 74E, next to the Delta on Calle 50 — minutes from Punta Pacífica, Coco del Mar and Obarrio.'
            }
        ],
        highlights: [
            {
                es: 'Cabinas dobles para parejas',
                en: 'Double cabins for couples'
            },
            {
                es: 'Masajes, faciales y rituales signature',
                en: 'Massages, facials and signature rituals'
            },
            {
                es: 'Abierto todos los días',
                en: 'Open every day'
            }
        ],
        programIds: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].PAQUETES_DELUXE,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].TRATAMIENTOS_CORPORALES
        ],
        servicesTitle: {
            es: 'Tratamientos disponibles',
            en: 'Available treatments'
        },
        faqs: [
            {
                q: {
                    es: '¿Tienen estacionamiento?',
                    en: 'Is parking available?'
                },
                a: {
                    es: 'Sí, contamos con opciones de estacionamiento cercanas sobre Calle 74E.',
                    en: 'Yes, there are parking options nearby on Calle 74E.'
                }
            },
            {
                q: {
                    es: '¿Atienden parejas?',
                    en: 'Do you host couples?'
                },
                a: {
                    es: 'Sí — San Francisco cuenta con cabinas dobles. Mira nuestra página de Parejas y Ocasiones.',
                    en: 'Yes — San Francisco has double cabins. See our Couples & Occasions page.'
                }
            }
        ],
        mapUrl: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6'
    },
    {
        slug: 'masaje-de-parejas-panama',
        location: 'both',
        title: {
            es: 'Masaje de Parejas en Panamá | Mimosa Spa Retreat',
            en: 'Couples Massage in Panama | Mimosa Spa Retreat'
        },
        metaDescription: {
            es: 'Masajes de parejas en Ciudad de Panamá en cabina doble: rituales románticos, aniversarios y ocasiones especiales en Costa del Este y San Francisco.',
            en: 'Couples massages in Panama City in double cabins: romantic rituals, anniversaries and special occasions in Costa del Este and San Francisco.'
        },
        h1: {
            es: 'Masaje de parejas en Panamá',
            en: 'Couples massage in Panama'
        },
        intro: [
            {
                es: 'Con siete cabinas dobles entre Costa del Este y San Francisco, Mimosa es el lugar para desconectarse en pareja: masajes lado a lado, aromaterapia y rituales que terminan con una ceremonia de té.',
                en: 'With seven double cabins across Costa del Este and San Francisco, Mimosa is the place to disconnect together: side-by-side massages, aromatherapy and rituals that end with a tea ceremony.'
            },
            {
                es: 'Perfecto para aniversarios, San Valentín, cumpleaños o simplemente una cita diferente. Reserva tu cabina doble por WhatsApp.',
                en: 'Perfect for anniversaries, Valentine’s, birthdays or simply a different kind of date. Book your double cabin via WhatsApp.'
            }
        ],
        highlights: [
            {
                es: '7 cabinas dobles en 2 ubicaciones',
                en: '7 double cabins across 2 locations'
            },
            {
                es: 'Rituales románticos con cava y chocolates',
                en: 'Romantic rituals with cava and chocolates'
            },
            {
                es: 'Gift cards para regalar la experiencia',
                en: 'Gift cards to gift the experience'
            }
        ],
        programIds: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].TRATAMIENTOS_PAREJAS,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].PAREJAS
        ],
        servicesTitle: {
            es: 'Masajes para dos',
            en: 'Massages for two'
        },
        faqs: [
            {
                q: {
                    es: '¿Puedo regalar un masaje de parejas?',
                    en: 'Can I gift a couples massage?'
                },
                a: {
                    es: 'Sí — nuestras gift cards pueden emitirse por el valor de cualquier ritual en pareja.',
                    en: 'Yes — our gift cards can be issued for the value of any couples ritual.'
                }
            },
            {
                q: {
                    es: '¿Cómo reservo una cabina doble?',
                    en: 'How do I book a double cabin?'
                },
                a: {
                    es: 'Escríbenos por WhatsApp con la fecha y hora deseada y confirmamos tu cabina doble.',
                    en: 'Message us on WhatsApp with your preferred date and time and we will confirm your double cabin.'
                }
            }
        ]
    },
    {
        slug: 'drenaje-linfatico-panama',
        location: 'both',
        title: {
            es: 'Drenaje Linfático en Panamá | Mimosa Spa Retreat',
            en: 'Lymphatic Drainage in Panama | Mimosa Spa Retreat'
        },
        metaDescription: {
            es: 'Drenaje linfático manual en Ciudad de Panamá: reduce retención de líquidos, apoya el post-operatorio y mejora la circulación. Costa del Este y San Francisco.',
            en: 'Manual lymphatic drainage in Panama City: reduce fluid retention, support post-op recovery and improve circulation. Costa del Este and San Francisco.'
        },
        h1: {
            es: 'Drenaje linfático en Panamá',
            en: 'Lymphatic drainage in Panama'
        },
        intro: [
            {
                es: 'El drenaje linfático manual es una técnica suave y rítmica que estimula el sistema linfático para reducir la retención de líquidos, desinflamar y apoyar la recuperación post-operatoria.',
                en: 'Manual lymphatic drainage is a gentle, rhythmic technique that stimulates the lymphatic system to reduce fluid retention, de-bloat and support post-operative recovery.'
            },
            {
                es: 'En Mimosa lo realizan terapeutas con formación específica, en sesiones individuales o en planes de varias sesiones para resultados sostenidos.',
                en: 'At Mimosa it is performed by specifically trained therapists, in single sessions or multi-session plans for lasting results.'
            }
        ],
        highlights: [
            {
                es: 'Técnica manual, suave y segura',
                en: 'Gentle, safe manual technique'
            },
            {
                es: 'Ideal post-operatorio y retención de líquidos',
                en: 'Ideal for post-op recovery and fluid retention'
            },
            {
                es: 'Planes de varias sesiones disponibles',
                en: 'Multi-session plans available'
            }
        ],
        programIds: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].TRATAMIENTOS_CORPORALES
        ],
        servicesTitle: {
            es: 'Tratamientos corporales relacionados',
            en: 'Related body treatments'
        },
        faqs: [
            {
                q: {
                    es: '¿Cuántas sesiones necesito?',
                    en: 'How many sessions do I need?'
                },
                a: {
                    es: 'Depende del objetivo: para bienestar general 1–2 sesiones al mes; para post-operatorio se suelen recomendar planes de 5 a 10 sesiones.',
                    en: 'It depends on your goal: for general wellness 1–2 sessions per month; for post-op recovery, 5 to 10 session plans are typical.'
                }
            },
            {
                q: {
                    es: '¿Es doloroso?',
                    en: 'Is it painful?'
                },
                a: {
                    es: 'No — es una técnica de presión suave, muy diferente a un masaje descontracturante.',
                    en: 'No — it is a light-pressure technique, very different from a deep-tissue massage.'
                }
            }
        ]
    }
];
}),
"[project]/src/lib/treatments.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TREATMENTS_TAG",
    ()=>TREATMENTS_TAG,
    "getVisibleTreatments",
    ()=>getVisibleTreatments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TREATMENTS_TAG = 'treatments';
// Cached read of all publicly visible treatments. Source: treatment_settings,
// which the admin flow keeps in sync with Mindbody (names/prices/durations
// stored tax-stripped, exactly what the old client-side menu displayed).
const getAllVisibleTreatments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('treatment_settings').select('mindbody_service_id, service_name, program_id, category, price, duration, description, show_booking_button, is_top_pick, sort_order').eq('is_visible', true).order('sort_order', {
            ascending: true
        }).order('service_name', {
            ascending: true
        });
        if (error || !data) return [];
        return data;
    } catch  {
        return [];
    }
}, [
    'treatments-visible'
], {
    tags: [
        TREATMENTS_TAG
    ],
    revalidate: 3600
});
async function getVisibleTreatments(programIds) {
    const all = await getAllVisibleTreatments();
    const seen = new Set();
    const out = [];
    for (const row of all){
        if (!programIds.includes(row.program_id)) continue;
        if (seen.has(row.service_name)) continue;
        seen.add(row.service_name);
        out.push(row);
    }
    return out;
}
}),
"[project]/src/lib/sanitize.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Conservative HTML cleaner for treatment descriptions (admin/Mindbody-managed
// rich text: <p>, <br>, <b>, <i>, <ul>, <li>...). Strips active content so a
// compromised description can never execute in visitors' browsers.
__turbopack_context__.s([
    "sanitizeDescriptionHtml",
    ()=>sanitizeDescriptionHtml
]);
function sanitizeDescriptionHtml(html) {
    return html// drop script/style/iframe/object/embed blocks entirely
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '').replace(/<(script|style|iframe|object|embed)[^>]*\/?>/gi, '')// drop inline event handlers (onclick=, onerror=, ...)
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '').replace(/\son\w+\s*=\s*'[^']*'/gi, '').replace(/\son\w+\s*=\s*[^\s>]+/gi, '')// neutralize javascript: URLs
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, '$1="#"');
}
}),
"[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingButton",
    ()=>BookingButton
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BookingButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BookingButton() from the server but BookingButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/BookingButton.tsx <module evaluation>", "BookingButton");
}),
"[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingButton",
    ()=>BookingButton
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BookingButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BookingButton() from the server but BookingButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/BookingButton.tsx", "BookingButton");
}),
"[project]/src/components/menu/BookingButton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpandableDescription",
    ()=>ExpandableDescription
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ExpandableDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ExpandableDescription() from the server but ExpandableDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/ExpandableDescription.tsx <module evaluation>", "ExpandableDescription");
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpandableDescription",
    ()=>ExpandableDescription
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ExpandableDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ExpandableDescription() from the server but ExpandableDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/ExpandableDescription.tsx", "ExpandableDescription");
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppBookingLink",
    ()=>WhatsAppBookingLink
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const WhatsAppBookingLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call WhatsAppBookingLink() from the server but WhatsAppBookingLink is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shared/WhatsAppBookingLink.tsx <module evaluation>", "WhatsAppBookingLink");
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppBookingLink",
    ()=>WhatsAppBookingLink
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const WhatsAppBookingLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call WhatsAppBookingLink() from the server but WhatsAppBookingLink is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shared/WhatsAppBookingLink.tsx", "WhatsAppBookingLink");
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/menu/ServicesListServer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServicesListServer",
    ()=>ServicesListServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-rsc] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-rsc] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getTranslations.js [app-rsc] (ecmascript) <export default as getTranslations>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$treatments$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/treatments.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanitize.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/menu/BookingButton.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
// Synthesized shape for the client BookingButton island. The booking page
// re-fetches the service by id, so this only seeds the pre-selection path.
function toMindbodyService(row) {
    return {
        Id: row.mindbody_service_id,
        Name: row.service_name,
        Description: row.description,
        Duration: row.duration ?? 0,
        Price: row.price ?? 0,
        OnlineBooking: row.show_booking_button,
        Category: row.category ?? '',
        ProgramId: row.program_id
    };
}
async function ServicesListServer({ programIds, locale, showTopPicks = true, hideTopPicksFromList = false, onlyTopPicks = false, hideEmptyFallback = false }) {
    const [services, t, tWa] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$treatments$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVisibleTreatments"])(programIds),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__["getTranslations"])({
            locale,
            namespace: 'menu'
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__["getTranslations"])({
            locale,
            namespace: 'whatsapp'
        })
    ]);
    if (services.length === 0) {
        if (onlyTopPicks || hideEmptyFallback) return null;
        // Never a spinner, never blank: a WhatsApp card until the catalog is seeded.
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12 bg-beige-50 rounded-xl space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-warm-gray",
                    children: t('noServices')
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-warm-gray",
                    children: tWa('bookPrompt')
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                    cta: "menu_empty_program"
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    const topPicks = services.filter((s)=>s.is_top_pick);
    const regularServices = hideTopPicksFromList ? services.filter((s)=>!s.is_top_pick) : services;
    const renderServiceCard = (row, isTopPick = false)=>{
        const price = row.price ?? 0;
        const priceLabel = price > 0 ? `$${price.toFixed(0)}` : t('priceOnRequest');
        const service = toMindbodyService(row);
        const safeDescription = row.description ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sanitizeDescriptionHtml"])(row.description) : null;
        const waMessage = locale === 'en' ? `Hi, I would like to book ${row.service_name}${row.duration ? ` (${row.duration} min)` : ''}.` : `Hola, quiero reservar ${row.service_name}${row.duration ? ` (${row.duration} min)` : ''}.`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-white rounded-lg md:rounded-xl border p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in ${isTopPick ? 'border-gold-300 ring-1 ring-gold-200' : 'border-beige-200'}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-2 mb-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 flex-1 min-w-0",
                                children: [
                                    isTopPick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "w-4 h-4 text-gold-500 fill-gold-500 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-dark truncate",
                                        children: row.service_name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    (row.duration ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-warm-gray flex-shrink-0",
                                        children: [
                                            "- ",
                                            row.duration,
                                            " ",
                                            t('duration')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        safeDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ExpandableDescription"], {
                            html: safeDescription,
                            maxLines: 2,
                            seeMoreText: t('seeMore'),
                            seeLessText: t('seeLess'),
                            className: "mb-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg font-bold text-gold-600",
                                    children: priceLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                                            cta: "menu_card",
                                            message: waMessage,
                                            variant: "link",
                                            className: "text-xs"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this),
                                        row.show_booking_button && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BookingButton"], {
                                            service: service,
                                            locale: locale,
                                            label: t('bookNow'),
                                            className: "inline-flex items-center px-3 py-1.5 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden md:flex md:flex-row md:items-center md:justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        isTopPick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "w-5 h-5 text-gold-500 fill-gold-500 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 141,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-dark",
                                            children: row.service_name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 143,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, this),
                                safeDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-warm-gray-600 leading-relaxed [&_p]:mb-2 [&_br]:hidden",
                                    dangerouslySetInnerHTML: {
                                        __html: safeDescription
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                                        cta: "menu_card",
                                        message: waMessage,
                                        variant: "link",
                                        className: "text-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 flex-shrink-0",
                            children: [
                                (row.duration ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1 text-sm text-warm-gray bg-beige-100 px-3 py-1 rounded-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this),
                                        row.duration,
                                        " ",
                                        t('duration')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold text-gold-600 w-16 text-right",
                                    children: priceLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-24",
                                    children: row.show_booking_button && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BookingButton"], {
                                        service: service,
                                        locale: locale,
                                        label: t('bookNow'),
                                        className: "inline-flex items-center justify-center w-full px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            ]
        }, row.mindbody_service_id, true, {
            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this);
    };
    if (onlyTopPicks) {
        if (topPicks.length === 0) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mb-3 md:mb-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                            className: "w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500"
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg md:text-xl font-semibold text-dark",
                            children: t('topPicks')
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 md:space-y-4",
                    children: topPicks.map((s)=>renderServiceCard(s, true))
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 193,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
            lineNumber: 188,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 md:space-y-8",
        children: [
            showTopPicks && topPicks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-3 md:mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                className: "w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500"
                            }, void 0, false, {
                                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg md:text-xl font-semibold text-dark",
                                children: t('topPicks')
                            }, void 0, false, {
                                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 md:space-y-4",
                        children: topPicks.map((s)=>renderServiceCard(s, true))
                    }, void 0, false, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                lineNumber: 203,
                columnNumber: 9
            }, this),
            regularServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    showTopPicks && topPicks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg md:text-xl font-semibold text-dark mb-2 md:mb-4",
                        children: t('allServices')
                    }, void 0, false, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 md:space-y-4",
                        children: regularServices.map((s)=>renderServiceCard(s))
                    }, void 0, false, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/proof/RatingBadge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RatingBadge",
    ()=>RatingBadge,
    "Stars",
    ()=>Stars
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-rsc] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getLocale$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getLocale$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getLocale.js [app-rsc] (ecmascript) <export default as getLocale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/settings.ts [app-rsc] (ecmascript)");
;
;
;
;
function Stars({ rating, size = 'h-4 w-4' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex",
        "aria-hidden": true,
        children: [
            1,
            2,
            3,
            4,
            5
        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                className: `${size} ${i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-gold/40'}`
            }, i, false, {
                fileName: "[project]/src/components/proof/RatingBadge.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/proof/RatingBadge.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
async function RatingBadge({ className = '', tone = 'dark' }) {
    const [settings, locale] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSettings"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getLocale$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getLocale$3e$__["getLocale"])()
    ]);
    const agg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["aggregateRating"])(settings);
    if (!agg.rating || !agg.count) return null;
    const label = locale === 'en' ? `${agg.count} reviews on Google` : `${agg.count} reseñas en Google`;
    const text = tone === 'light' ? 'text-cream/90' : 'text-dark/80';
    const inner = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-2 ${text} ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Stars, {
                rating: agg.rating
            }, void 0, false, {
                fileName: "[project]/src/components/proof/RatingBadge.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-medium",
                children: [
                    agg.rating.toFixed(1),
                    " · ",
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/proof/RatingBadge.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/proof/RatingBadge.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
    if (agg.url) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: agg.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:opacity-80 transition-opacity",
            "aria-label": `Google: ${agg.rating.toFixed(1)} — ${label}`,
            children: inner
        }, void 0, false, {
            fileName: "[project]/src/components/proof/RatingBadge.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    return inner;
}
}),
"[project]/src/lib/reviews.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REVIEWS_TAG",
    ()=>REVIEWS_TAG,
    "getActiveReviews",
    ()=>getActiveReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REVIEWS_TAG = 'reviews';
const getActiveReviews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('site_reviews').select('*').eq('is_active', true).order('sort_order', {
            ascending: true
        });
        if (error || !data) return [];
        return data;
    } catch  {
        return [];
    }
}, [
    'site-reviews-active'
], {
    tags: [
        REVIEWS_TAG
    ],
    revalidate: 3600
});
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsCarousel",
    ()=>ReviewsCarousel
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ReviewsCarousel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ReviewsCarousel() from the server but ReviewsCarousel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/proof/ReviewsCarousel.tsx <module evaluation>", "ReviewsCarousel");
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsCarousel",
    ()=>ReviewsCarousel
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ReviewsCarousel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ReviewsCarousel() from the server but ReviewsCarousel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/proof/ReviewsCarousel.tsx", "ReviewsCarousel");
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/proof/ReviewsStrip.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsStrip",
    ()=>ReviewsStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getLocale$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getLocale$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getLocale.js [app-rsc] (ecmascript) <export default as getLocale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reviews.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/RatingBadge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function ReviewsStrip({ limit = 3, className = '' }) {
    const [reviews, locale] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveReviews"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getLocale$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getLocale$3e$__["getLocale"])()
    ]);
    const quotes = reviews.filter((r)=>r.kind === 'review');
    if (quotes.length === 0) return null;
    // Deterministic per-day offset (ISR republishes hourly, shifts daily).
    const startOffset = Math.floor(Date.now() / 86_400_000) % quotes.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `py-12 ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container-spa",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RatingBadge"], {}, void 0, false, {
                        fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReviewsCarousel"], {
                    reviews: quotes,
                    locale: locale,
                    visible: limit,
                    startOffset: startOffset
                }, void 0, false, {
                    fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/default-images.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Client-safe fallback image map shared by server lib and client components.
// Single source of truth for per-key fallbacks.
__turbopack_context__.s([
    "DEFAULT_IMAGES",
    ()=>DEFAULT_IMAGES
]);
const DEFAULT_IMAGES = {
    // Menu banners
    menu_corporales_banner: '/placeholders/banner.jpg',
    menu_corporales_deluxe_banner: '/placeholders/banner.jpg',
    menu_faciales_banner: '/placeholders/banner.jpg',
    menu_paquetes_banner: '/placeholders/banner.jpg',
    logo: '/logo.png',
    // Hero section
    hero_banner: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070',
    booking_cta_background: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070',
    // Featured categories
    category_body_treatments: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    category_facial_treatments: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800',
    category_packages: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
    category_giftcards: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
    category_membership: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800',
    category_promotions: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?q=80&w=800',
    category_parejas: 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?q=80&w=800',
    // Location cards
    location_costa_del_este: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
    location_san_francisco: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
    // About page
    about_image_1: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600',
    about_image_2: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600',
    // Promotions fallback
    promotion_default: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
    // FY27 marketing pages (replaced by real photography via /admin/imagenes)
    parejas_banner: 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?q=80&w=1900',
    parejas_ritual: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
    parejas_escape: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800',
    parejas_aniversario: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
    empresas_banner: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1900',
    club_banner: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1900',
    primera_visita_banner: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1900',
    giftcards_banner: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1900'
};
}),
"[project]/src/lib/site-images.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SITE_IMAGES_TAG",
    ()=>SITE_IMAGES_TAG,
    "getSiteImage",
    ()=>getSiteImage,
    "getSiteImages",
    ()=>getSiteImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/default-images.ts [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
;
;
const SITE_IMAGES_TAG = 'site-images';
// Cached fetch of ALL active site images + their variants. One tagged cache
// entry keeps revalidation simple: any admin image change revalidates it.
const getAllSiteImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
    const [{ data: base }, variantsRes] = await Promise.all([
        supabase.from('site_images').select('key, image_url').eq('is_active', true),
        supabase.from('site_image_variants').select('image_key, image_url').eq('is_active', true).order('sort_order', {
            ascending: true
        })
    ]);
    const result = {};
    for (const img of base ?? []){
        result[img.key] = [
            img.image_url
        ];
    }
    // Variants table may not exist yet (pre-migration) → error is ignored.
    for (const v of variantsRes.data ?? []){
        ;
        (result[v.image_key] ??= []).push(v.image_url);
    }
    return result;
}, [
    'site-images-all-v2'
], {
    tags: [
        SITE_IMAGES_TAG
    ],
    revalidate: 3600
});
// Deterministic daily rotation: each key advances through its pool on its own
// day offset, so the whole site doesn't swap at once. ISR (1h) republishes
// pages, so the change appears without extra client work.
function pickDaily(key, pool) {
    if (pool.length <= 1) return pool[0] ?? '';
    const day = Math.floor(Date.now() / 86_400_000);
    let hash = 0;
    for(let i = 0; i < key.length; i++)hash = hash * 31 + key.charCodeAt(i) >>> 0;
    return pool[(day + hash) % pool.length];
}
async function getSiteImage(key) {
    try {
        const all = await getAllSiteImages();
        const pool = all[key];
        if (pool && pool.length > 0) return pickDaily(key, pool);
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"][key] || '';
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"][key] || '';
    }
}
async function getSiteImages(keys) {
    let all = {};
    try {
        all = await getAllSiteImages();
    } catch  {
    // fall through to defaults
    }
    const result = {};
    for (const key of keys){
        const pool = all[key];
        result[key] = pool && pool.length > 0 ? pickDaily(key, pool) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"][key] || '';
    }
    return result;
}
}),
"[project]/src/components/marketing/SectionHeader.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Editorial section header: small-caps gold eyebrow → serif title → gold
// hairline → optional lede. Replaces ad-hoc .section-title usage (whose
// absolute ::after underline collides with following content).
__turbopack_context__.s([
    "SectionHeader",
    ()=>SectionHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function SectionHeader({ eyebrow, title, lede, tone = 'dark', align = 'center', className = '' }) {
    const centered = align === 'center';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `${centered ? 'text-center' : 'text-left'} mb-10 md:mb-14 ${className}`,
        children: [
            eyebrow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-[11px] font-semibold uppercase tracking-[0.28em] mb-3 ${tone === 'light' ? 'text-gold' : 'text-gold-600'}`,
                children: eyebrow
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/SectionHeader.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: `font-display text-3xl md:text-4xl font-semibold text-balance ${tone === 'light' ? 'text-cream' : 'text-dark'}`,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/SectionHeader.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `block h-[2px] w-12 bg-gold mt-5 ${centered ? 'mx-auto' : ''}`,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/SectionHeader.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            lede && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `mt-5 leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${tone === 'light' ? 'text-cream/75' : 'text-warm-gray'}`,
                children: lede
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/SectionHeader.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/marketing/SectionHeader.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/landing/LocalLandingPage.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocalLandingPage",
    ()=>LocalLandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-rsc] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-rsc] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getTranslations.js [app-rsc] (ecmascript) <export default as getTranslations>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/settings.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ServicesListServer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/menu/ServicesListServer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/RatingBadge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsStrip$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsStrip.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/site-images.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/marketing/SectionHeader.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
const L = (locale)=>locale === 'en' ? 'en' : 'es';
async function LocalLandingPage({ content, locale }) {
    const l = L(locale);
    const heroKey = content.location === 'cde' ? 'location_costa_del_este' : content.location === 'sfc' ? 'location_san_francisco' : content.slug.includes('parejas') ? 'parejas_banner' : 'category_body_treatments';
    const [settings, tHome, tNav, heroImage] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSettings"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__["getTranslations"])({
            locale,
            namespace: 'home.locations'
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__["getTranslations"])({
            locale,
            namespace: 'navigation'
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getSiteImage"])(heroKey)
    ]);
    const agg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["aggregateRating"])(settings);
    const locations = [
        content.location !== 'sfc' && {
            name: tHome('costaDelEste.name'),
            address: tHome('costaDelEste.address'),
            phone: settings.phone_costa_del_este,
            mapUrl: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A',
            rating: agg.cde
        },
        content.location !== 'cde' && {
            name: tHome('sanFrancisco.name'),
            address: tHome('sanFrancisco.address'),
            phone: settings.phone_san_francisco,
            mapUrl: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6',
            rating: agg.sfc
        }
    ].filter(Boolean);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-cream",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative min-h-[300px] md:min-h-[380px] flex items-center overflow-hidden",
                children: [
                    heroImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: heroImage,
                        alt: "",
                        fill: true,
                        priority: true,
                        className: "object-cover",
                        sizes: "100vw"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/70"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative container-spa w-full py-14 text-center text-cream",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-gold mb-4",
                                children: "Mimosa Spa Retreat"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-display text-4xl md:text-5xl font-semibold text-balance max-w-3xl mx-auto",
                                children: content.h1[l]
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 flex justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RatingBadge"], {
                                    tone: "light"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-7 flex flex-wrap justify-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/${locale}/reservar`,
                                        className: "btn-primary",
                                        children: tNav('book')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                                        cta: `landing_${content.slug}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-3xl",
                    children: [
                        content.intro.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-dark/80 leading-relaxed mb-4",
                                children: p[l]
                            }, i, false, {
                                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "mt-6 space-y-2",
                            children: content.highlights.map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2 text-dark/80",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "h-5 w-5 text-gold-600 flex-shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                            lineNumber: 103,
                                            columnNumber: 17
                                        }, this),
                                        h[l]
                                    ]
                                }, i, true, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section bg-beige",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                            title: content.servicesTitle[l]
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ServicesListServer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ServicesListServer"], {
                            programIds: content.programIds,
                            locale: locale,
                            showTopPicks: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-3xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: locations.map((loc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl shadow-card p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "h-5 w-5 text-gold-600 flex-shrink-0 mt-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                            lineNumber: 130,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-display font-semibold text-dark",
                                                    children: [
                                                        "Mimosa Spa Retreat — ",
                                                        loc.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 21
                                                }, this),
                                                loc.rating && loc.rating.count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: loc.rating.url || loc.mapUrl,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "mt-1 inline-flex items-center gap-1.5 text-sm text-dark/70 hover:text-gold-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Stars"], {
                                                            rating: loc.rating.rating,
                                                            size: "h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                            lineNumber: 142,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: [
                                                                loc.rating.rating.toFixed(1),
                                                                " (",
                                                                loc.rating.count,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-dark/70 mt-1",
                                                    children: loc.address
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-dark/70",
                                                    children: [
                                                        "+507 ",
                                                        loc.phone.replace(/^\+?507\s?/, '')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: loc.mapUrl,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "text-sm text-gold-600 hover:text-gold-700 font-medium mt-2 inline-block",
                                                    children: "Google Maps →"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                            lineNumber: 131,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 129,
                                    columnNumber: 17
                                }, this)
                            }, loc.name, false, {
                                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section bg-beige",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-3xl",
                    children: content.faqs.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-display font-semibold text-dark text-lg mb-2",
                                    children: f.q[l]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-dark/70 leading-relaxed",
                                    children: f.a[l]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-3xl flex flex-wrap gap-3 justify-center text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/menu`,
                            className: "text-gold-600 hover:text-gold-700 font-medium",
                            children: tNav('menu')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].parejas && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-warm-gray",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/${locale}/parejas`,
                                    className: "text-gold-600 hover:text-gold-700 font-medium",
                                    children: tNav('couples')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-warm-gray",
                            children: "·"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/promociones`,
                            className: "text-gold-600 hover:text-gold-700 font-medium",
                            children: tNav('promotions')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-warm-gray",
                            children: "·"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 196,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/reservar`,
                            className: "text-gold-600 hover:text-gold-700 font-medium",
                            children: tNav('book')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsStrip$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReviewsStrip"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/LocalLandingPage.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/seo.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPageMetadata",
    ()=>buildPageMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-rsc] (ecmascript)");
;
function buildPageMetadata({ locale, path, title, description, ogImage = '/og-default.jpg', index = true }) {
    const canonical = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/${locale}${path}`;
    const languages = {};
    for (const l of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOCALES"]){
        languages[l] = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/${l}${path}`;
    }
    languages['x-default'] = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/es${path}`;
    return {
        title,
        description,
        alternates: {
            canonical,
            languages
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'Mimosa Spa Retreat',
            locale: locale === 'es' ? 'es_PA' : 'en_US',
            type: 'website',
            images: [
                ogImage
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [
                ogImage
            ]
        },
        robots: index ? {
            index: true,
            follow: true
        } : {
            index: false,
            follow: false
        }
    };
}
}),
"[project]/src/app/[locale]/masaje-de-parejas-panama/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page,
    "generateMetadata",
    ()=>generateMetadata,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$landings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/content/landings.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$LocalLandingPage$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/LocalLandingPage.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seo.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const revalidate = 3600;
const SLUG = 'masaje-de-parejas-panama';
const content = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$landings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LANDINGS"].find((c)=>c.slug === SLUG);
async function generateMetadata({ params }) {
    const { locale } = await params;
    if (!content) return {};
    const l = locale === 'en' ? 'en' : 'es';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildPageMetadata"])({
        locale,
        path: '/masaje-de-parejas-panama',
        title: content.title[l],
        description: content.metaDescription[l]
    });
}
async function Page({ params }) {
    const { locale } = await params;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].parejas) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/${locale}/menu`);
    if (!content) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$LocalLandingPage$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LocalLandingPage"], {
        content: content,
        locale: locale
    }, void 0, false, {
        fileName: "[project]/src/app/[locale]/masaje-de-parejas-panama/page.tsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/[locale]/masaje-de-parejas-panama/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/[locale]/masaje-de-parejas-panama/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c8163e7d._.js.map