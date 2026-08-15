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
"[project]/src/lib/giftshop/data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GIFTSHOP_TAG",
    ()=>GIFTSHOP_TAG,
    "getActiveCatalog",
    ()=>getActiveCatalog,
    "getShopSettings",
    ()=>getShopSettings,
    "giftshopAdminClient",
    ()=>giftshopAdminClient,
    "itbmsCentsFor",
    ()=>itbmsCentsFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GIFTSHOP_TAG = 'giftshop';
function giftshopAdminClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
}
const DEFAULT_SHOP_SETTINGS = {
    shop_enabled: false,
    hero_banner_es: null,
    hero_banner_en: null,
    occasion_slug: null,
    default_mindbody_location_id: 1,
    whatsapp_delivery_enabled: false,
    notify_email: null
};
const getShopSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = giftshopAdminClient();
        const { data } = await supabase.from('gc_shop_settings').select('*').eq('id', 1).single();
        return data ? {
            ...DEFAULT_SHOP_SETTINGS,
            ...data
        } : DEFAULT_SHOP_SETTINGS;
    } catch  {
        return DEFAULT_SHOP_SETTINGS;
    }
}, [
    'gc-shop-settings'
], {
    tags: [
        GIFTSHOP_TAG
    ],
    revalidate: 600
});
const getActiveCatalog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = giftshopAdminClient();
        const { data } = await supabase.from('gc_catalog_items').select('*').eq('is_active', true).order('sort_order', {
            ascending: true
        });
        return data ?? [];
    } catch  {
        return [];
    }
}, [
    'gc-catalog-active'
], {
    tags: [
        GIFTSHOP_TAG
    ],
    revalidate: 600
});
function itbmsCentsFor(item) {
    if (item.kind !== 'experience') return 0;
    const rate = Number(("TURBOPACK compile-time value", "0.07") || '0.07');
    return Math.round(item.amount_cents * rate);
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/payments/tilopay.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTilopayPayment",
    ()=>createTilopayPayment,
    "isTilopayConfigured",
    ()=>isTilopayConfigured,
    "refundTilopayPayment",
    ()=>refundTilopayPayment,
    "verifyTilopayHash",
    ()=>verifyTilopayHash
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
// Tilopay hosted-checkout client (https://app.tilopay.com/api/v1/).
// Inert until TILOPAY_API_KEY / TILOPAY_API_USER / TILOPAY_PASSWORD are set.
const TILOPAY_BASE = process.env.TILOPAY_API_URL || 'https://app.tilopay.com/api/v1/';
function creds() {
    const key = process.env.TILOPAY_API_KEY;
    const user = process.env.TILOPAY_API_USER;
    const password = process.env.TILOPAY_PASSWORD;
    if (!key || !user || !password) return null;
    return {
        key,
        user,
        password
    };
}
function isTilopayConfigured() {
    return creds() !== null;
}
async function tilopayLogin() {
    const c = creds();
    if (!c) throw new Error('Tilopay not configured');
    const res = await fetch(`${TILOPAY_BASE}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiuser: c.user,
            password: c.password
        })
    });
    if (!res.ok) throw new Error(`Tilopay login failed: ${res.status}`);
    const data = await res.json();
    if (!data?.access_token) throw new Error('Tilopay login: no access_token');
    return data.access_token;
}
async function createTilopayPayment(input) {
    const c = creds();
    if (!c) throw new Error('Tilopay not configured');
    const token = await tilopayLogin();
    const [firstName, ...rest] = input.buyerName.trim().split(/\s+/);
    const lastName = rest.join(' ') || firstName;
    const res = await fetch(`${TILOPAY_BASE}processPayment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            key: c.key,
            amount: (input.amountCents / 100).toFixed(2),
            currency: 'USD',
            orderNumber: input.orderNumber,
            capture: 1,
            redirect: input.redirectUrl,
            billToFirstName: firstName,
            billToLastName: lastName,
            billToEmail: input.buyerEmail,
            billToTelephone: input.buyerPhone || '00000000',
            billToCountry: input.buyerCountry || 'PA',
            billToAddress: 'Panamá',
            billToCity: 'Panamá',
            billToState: 'PA',
            billToZipPostCode: '0000',
            hashVersion: 'V2',
            ...input.returnData ? {
                returnData: input.returnData
            } : {}
        })
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Tilopay processPayment failed: ${res.status} ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    if (!data?.url) throw new Error('Tilopay processPayment: no url in response');
    return data.url;
}
// PHP http_build_query-compatible serialization (Tilopay computes the hash
// server-side with PHP): urlencoded k=v joined by &, spaces as +.
function phpHttpBuildQuery(params) {
    return Object.entries(params).map(([k, v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&');
}
function verifyTilopayHash(p) {
    const c = creds();
    if (!c || !p.OrderHash || !p.tpt) return false;
    const hashKey = `${p.tpt}|${c.key}|${c.password}`;
    const payload = phpHttpBuildQuery({
        api_Key: c.key,
        api_user: c.user,
        orderId: p.tpt,
        external_orden_id: p.orderNumber,
        amount: (p.amountCents / 100).toFixed(2),
        currency: 'USD',
        responseCode: p.code ?? '',
        auth: p.auth ?? '',
        email: p.buyerEmail
    });
    const computed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', hashKey).update(payload).digest('hex');
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(Buffer.from(computed, 'utf8'), Buffer.from(String(p.OrderHash), 'utf8'));
    } catch  {
        return false;
    }
}
async function refundTilopayPayment(orderNumber, amountCents, type = 2) {
    const c = creds();
    if (!c) throw new Error('Tilopay not configured');
    const token = await tilopayLogin();
    const res = await fetch(`${TILOPAY_BASE}processModification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            orderNumber,
            key: c.key,
            amount: (amountCents / 100).toFixed(2),
            type,
            hashVersion: 'V2'
        })
    });
    const raw = await res.json().catch(()=>null);
    return {
        ok: res.ok,
        raw
    };
}
}),
"[project]/src/lib/email/resend.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Minimal Resend client via fetch — no SDK dependency.
// Inert until RESEND_API_KEY is set.
__turbopack_context__.s([
    "isEmailConfigured",
    ()=>isEmailConfigured,
    "sendEmail",
    ()=>sendEmail
]);
function isEmailConfigured() {
    return !!process.env.RESEND_API_KEY;
}
const FROM = process.env.GIFTCARD_EMAIL_FROM || 'Mimosa Spa Retreat <regalos@mimosaretreat.com>';
async function sendEmail(input) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return {
        ok: false,
        error: 'RESEND_API_KEY not set'
    };
    const testPrefix = process.env.GIFTCARD_TEST_MODE === '1' ? '[TEST] ' : '';
    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM,
                to: [
                    input.to
                ],
                subject: testPrefix + input.subject,
                html: input.html,
                ...input.replyTo ? {
                    reply_to: input.replyTo
                } : {}
            })
        });
        const data = await res.json().catch(()=>null);
        if (!res.ok) {
            return {
                ok: false,
                error: data?.message || `HTTP ${res.status}`
            };
        }
        return {
            ok: true,
            id: data?.id
        };
    } catch (e) {
        return {
            ok: false,
            error: e instanceof Error ? e.message : 'send failed'
        };
    }
}
}),
"[project]/src/lib/email/templates/giftcard.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buyerReceiptEmail",
    ()=>buyerReceiptEmail,
    "recipientGiftEmail",
    ()=>recipientGiftEmail
]);
// Inline-styled HTML emails for gift-card delivery (brand: gold/cream, serif display).
const GOLD = '#FCCF08';
const CREAM = '#FDFAF5';
const DARK = '#333333';
function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function shell(inner) {
    return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Lato,Helvetica,Arial,sans-serif;color:${DARK}">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee5d8">
      <div style="background:${DARK};padding:20px;text-align:center">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${CREAM};letter-spacing:1px">Mimosa</span>
        <div style="font-size:10px;letter-spacing:3px;color:#cfc9bd;text-transform:uppercase">Spa Retreat</div>
      </div>
      ${inner}
      <div style="padding:18px;text-align:center;border-top:1px solid #f1ebe0;font-size:12px;color:#8B8680">
        Mimosa Spa Retreat · Costa del Este &amp; San Francisco · Ciudad de Panamá<br/>
        <a href="https://www.mimosaretreat.com" style="color:#a3701c">mimosaretreat.com</a>
      </div>
    </div>
  </div>`;
}
function recipientGiftEmail(d) {
    const en = d.locale === 'en';
    const subject = en ? `${d.buyerName} sent you a Mimosa Spa gift 🎁` : `${d.buyerName} te envió un regalo de Mimosa Spa 🎁`;
    const html = shell(`
    <div style="padding:32px 28px;text-align:center">
      <p style="font-size:14px;color:#8B8680;margin:0 0 6px">${en ? 'A gift for' : 'Un regalo para'}</p>
      <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 18px">${esc(d.recipientName)}</h1>
      <div style="background:${CREAM};border:2px solid ${GOLD};border-radius:14px;padding:24px;margin-bottom:20px">
        <div style="font-size:13px;color:#8B8680;margin-bottom:4px">${esc(d.itemName)}</div>
        <div style="font-family:Georgia,serif;font-size:34px;color:#a3701c">${esc(d.amountLabel)}</div>
      </div>
      ${d.message ? `<p style="font-style:italic;color:#5c6157;margin:0 0 22px">“${esc(d.message)}”<br/><span style="font-style:normal;font-size:13px">— ${esc(d.buyerName)}</span></p>` : `<p style="color:#5c6157;margin:0 0 22px">— ${esc(d.buyerName)}</p>`}
      <a href="${d.giftUrl}" style="display:inline-block;background:${GOLD};color:${DARK};font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px">
        ${en ? 'View my gift card' : 'Ver mi gift card'}
      </a>
      <p style="font-size:12px;color:#8B8680;margin:20px 0 0">
        ${en ? 'Show the code on that page when you visit the spa. Book via WhatsApp +507 6404-9464.' : 'Muestra el código de esa página el día de tu visita. Reserva por WhatsApp +507 6404-9464.'}
      </p>
    </div>`);
    return {
        subject,
        html
    };
}
function buyerReceiptEmail(d) {
    const en = d.locale === 'en';
    const subject = en ? `Your Mimosa gift card is ready (${d.orderNumber})` : `Tu gift card Mimosa está lista (${d.orderNumber})`;
    const html = shell(`
    <div style="padding:32px 28px">
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 14px">
        ${en ? `Thank you, ${esc(d.buyerName)}!` : `¡Gracias, ${esc(d.buyerName)}!`}
      </h1>
      <p style="font-size:14px;color:#5c6157;margin:0 0 18px">
        ${en ? `Your gift for <b>${esc(d.recipientName)}</b> is confirmed:` : `Tu regalo para <b>${esc(d.recipientName)}</b> está confirmado:`}
      </p>
      <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:18px">
        <tr><td style="padding:6px 0;color:#8B8680">${en ? 'Item' : 'Artículo'}</td><td style="text-align:right">${esc(d.itemName)}</td></tr>
        <tr><td style="padding:6px 0;color:#8B8680">${en ? 'Value' : 'Valor'}</td><td style="text-align:right;font-weight:bold">${esc(d.amountLabel)}</td></tr>
        <tr><td style="padding:6px 0;color:#8B8680">${en ? 'Order' : 'Pedido'}</td><td style="text-align:right">${esc(d.orderNumber)}</td></tr>
        ${d.scheduledLabel ? `<tr><td style="padding:6px 0;color:#8B8680">${en ? 'Delivery' : 'Entrega'}</td><td style="text-align:right">${esc(d.scheduledLabel)}</td></tr>` : ''}
      </table>
      ${d.bonusLabel ? `<div style="background:${CREAM};border:1px dashed ${GOLD};border-radius:10px;padding:14px;margin-bottom:18px;font-size:14px">🎉 ${esc(d.bonusLabel)}</div>` : ''}
      <a href="${d.giftUrl}" style="display:inline-block;background:${GOLD};color:${DARK};font-weight:bold;text-decoration:none;padding:12px 26px;border-radius:999px;font-size:14px;margin-right:8px">
        ${en ? 'View gift card' : 'Ver gift card'}
      </a>
      <a href="${d.whatsappForwardUrl}" style="display:inline-block;border:2px solid #25D366;color:#128C7E;font-weight:bold;text-decoration:none;padding:10px 22px;border-radius:999px;font-size:14px">
        ${en ? 'Forward via WhatsApp' : 'Enviar por WhatsApp'}
      </a>
    </div>`);
    return {
        subject,
        html
    };
}
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
    [PROGRAM_IDS.TRATAMIENTOS_CORPORALES]: 'Masajes',
    [PROGRAM_IDS.PAQUETES_DELUXE]: 'Rituales Mimosa',
    [PROGRAM_IDS.TRATAMIENTOS_FACIALES]: 'Faciales',
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
    // "Eliminado -" is the house convention for retired pricing options that
    // Mindbody won't let us delete — keep them out of the admin entirely.
    const filteredServices = allSaleServices.filter((s)=>s.Count === 1 && // Single session only
        s.Price > 0 && // Has price
        !/^eliminado\b/i.test(s.Name.trim()));
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
    // Dedupe: when several retail products share one session type (e.g. an old
    // pricing option left behind after a treatment moved category), keep the one
    // whose program matches the session type's CURRENT program — that's the
    // category source of truth for appointments.
    const byId = new Map();
    for (const svc of services){
        const existing = byId.get(svc.Id);
        if (!existing) {
            byId.set(svc.Id, svc);
            continue;
        }
        const sessionType = findSessionTypeMatch(svc.Name, sessionTypeMap);
        const trueProgramId = sessionType?.ProgramId;
        if (trueProgramId && svc.ProgramId === trueProgramId && existing.ProgramId !== trueProgramId) {
            byId.set(svc.Id, svc);
        }
    }
    const dedupedServices = Array.from(byId.values());
    if (dedupedServices.length !== services.length) {
        console.log(`Deduped ${services.length - dedupedServices.length} stale retail duplicates`);
    }
    console.log('All services for admin:', dedupedServices.length);
    console.log('Online bookable services:', dedupedServices.filter((s)=>s.OnlineBooking).length);
    console.log('Offline only services:', dedupedServices.filter((s)=>!s.OnlineBooking).length);
    return dedupedServices;
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
"[project]/src/lib/booking/wati.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isWatiConfigured",
    ()=>isWatiConfigured,
    "sendBookingChange",
    ()=>sendBookingChange,
    "sendBookingConfirmation",
    ()=>sendBookingConfirmation,
    "sendBookingReminder",
    ()=>sendBookingReminder,
    "sendOtpCode",
    ()=>sendOtpCode,
    "sendPhoneVerification",
    ()=>sendPhoneVerification,
    "sendTemplateMessage",
    ()=>sendTemplateMessage
]);
// ===========================================
// WATI API UTILITY
// Server-side only - handles WhatsApp notifications
// ===========================================
// v1 API uses the full URL including account ID (e.g. https://live-mt-server.wati.io/1036696)
const WATI_API_URL = process.env.WATI_API_URL || 'https://live-mt-server.wati.io';
const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN || process.env.WATI_API_KEY;
// ===========================================
// HELPER FUNCTIONS
// ===========================================
function formatPhoneForWati(phone) {
    let cleaned = phone.replace(/\D/g, '');
    // Add Panama country code if missing
    if (!cleaned.startsWith('507') && cleaned.length === 8) {
        cleaned = '507' + cleaned;
    }
    return cleaned;
}
// ===========================================
// API REQUEST HELPER
// POST /api/v1/sendTemplateMessage?whatsappNumber=PHONE
// ===========================================
async function sendTemplate(phone, templateName, parameters) {
    if (!WATI_ACCESS_TOKEN) {
        console.warn('WATI_ACCESS_TOKEN not configured');
        return {
            result: false,
            error: 'WATI not configured'
        };
    }
    const formattedPhone = formatPhoneForWati(phone);
    const url = `${WATI_API_URL}/api/v1/sendTemplateMessage?whatsappNumber=${formattedPhone}`;
    const body = {
        template_name: templateName,
        broadcast_name: templateName,
        parameters
    };
    try {
        console.log('WATI request:', url, JSON.stringify(body));
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WATI_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`WATI API error: ${response.status}`, errorText);
            return {
                result: false,
                error: `HTTP ${response.status}: ${errorText}`
            };
        }
        const responseData = await response.json();
        console.log('WATI response:', JSON.stringify(responseData));
        return responseData;
    } catch (error) {
        console.error('WATI API request failed:', error);
        return {
            result: false,
            error: String(error)
        };
    }
}
async function sendTemplateMessage(phone, templateName, parameters) {
    return sendTemplate(phone, templateName, parameters);
}
// Template: "Mimosa {{2}}" — strip the "Mimosa " prefix from location names
function stripMimosaPrefix(locationName) {
    return locationName.replace(/^Mimosa\s+/i, '').trim() || locationName;
}
async function sendBookingConfirmation(data) {
    return sendTemplate(data.clientPhone, 'confirmacion_cita2', [
        {
            name: '1',
            value: data.clientName
        },
        {
            name: '2',
            value: stripMimosaPrefix(data.locationName)
        },
        {
            name: '3',
            value: data.date
        },
        {
            name: '4',
            value: data.time
        },
        {
            name: '5',
            value: `${data.totalDuration} min`
        },
        {
            name: '6',
            value: data.therapistName
        },
        {
            name: '7',
            value: data.services.join(', ')
        }
    ]);
}
async function sendBookingChange(data) {
    return sendTemplate(data.clientPhone, 'cambio_cita', [
        {
            name: '1',
            value: data.clientName
        },
        {
            name: '2',
            value: stripMimosaPrefix(data.locationName)
        },
        {
            name: '3',
            value: data.date
        },
        {
            name: '4',
            value: data.time
        },
        {
            name: '5',
            value: `${data.totalDuration} min`
        },
        {
            name: '6',
            value: data.therapistName
        },
        {
            name: '7',
            value: data.services.join(', ')
        }
    ]);
}
async function sendBookingReminder(data) {
    return sendTemplate(data.clientPhone, 'recordatorio_cita4', [
        {
            name: '1',
            value: data.clientName
        },
        {
            name: '2',
            value: stripMimosaPrefix(data.locationName)
        },
        {
            name: '3',
            value: data.date
        },
        {
            name: '4',
            value: data.time
        },
        {
            name: '5',
            value: data.appointmentId
        }
    ]);
}
async function sendOtpCode(phone, otpCode) {
    return sendTemplate(phone, 'codigo_verificacion', [
        {
            name: '1',
            value: otpCode
        }
    ]);
}
async function sendPhoneVerification(data) {
    return sendTemplate(data.clientPhone, 'verificacion_telefono', [
        {
            name: '1',
            value: data.clientName
        }
    ]);
}
function isWatiConfigured() {
    return Boolean(WATI_ACCESS_TOKEN);
}
}),
"[project]/src/lib/nav.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Single source of truth for public routes: feeds the sitemap and nav surfaces.
// Launch switches: flip to true when each area is ready to go public.
// Hiding removes nav entries + sitemap entries and redirects the pages.
__turbopack_context__.s([
    "DEFAULT_LOCALE",
    ()=>DEFAULT_LOCALE,
    "FEATURES",
    ()=>FEATURES,
    "GIFT_CARDS_PATH",
    ()=>GIFT_CARDS_PATH,
    "LOCALES",
    ()=>LOCALES,
    "PUBLIC_ROUTES",
    ()=>PUBLIC_ROUTES,
    "SITE_URL",
    ()=>SITE_URL
]);
const FEATURES = {
    parejas: false,
    giftShop: false
};
const GIFT_CARDS_PATH = '/menu/giftcards';
const PUBLIC_ROUTES = [
    {
        path: '',
        sitemap: true,
        priority: 1.0
    },
    {
        path: '/menu',
        sitemap: true,
        priority: 0.9
    },
    {
        path: '/menu/corporales',
        sitemap: true,
        priority: 0.9
    },
    {
        path: '/menu/faciales',
        sitemap: true,
        priority: 0.9
    },
    {
        path: '/menu/paquetes',
        sitemap: true,
        priority: 0.8
    },
    {
        path: '/menu/membresia',
        sitemap: true,
        priority: 0.7
    },
    {
        path: '/menu/giftcards',
        sitemap: true,
        priority: 0.8
    },
    {
        path: '/promociones',
        sitemap: true,
        priority: 0.8
    },
    {
        path: '/nosotros',
        sitemap: true,
        priority: 0.6
    },
    {
        path: '/ubicaciones',
        sitemap: true,
        priority: 0.7
    },
    {
        path: '/galeria',
        sitemap: true,
        priority: 0.5
    },
    {
        path: '/reservar',
        sitemap: true,
        priority: 0.9
    },
    {
        path: '/parejas',
        sitemap: FEATURES.parejas,
        priority: 0.9
    },
    {
        path: '/empresas',
        sitemap: true,
        priority: 0.7
    },
    {
        path: '/club-mimosa',
        sitemap: true,
        priority: 0.8
    },
    {
        path: '/primera-visita',
        sitemap: true,
        priority: 0.8
    },
    {
        path: '/referidos',
        sitemap: true,
        priority: 0.4
    },
    {
        path: '/masajes-costa-del-este',
        sitemap: true,
        priority: 0.7
    },
    {
        path: '/spa-san-francisco',
        sitemap: true,
        priority: 0.7
    },
    {
        path: '/masaje-de-parejas-panama',
        sitemap: FEATURES.parejas,
        priority: 0.7
    },
    {
        path: '/drenaje-linfatico-panama',
        sitemap: true,
        priority: 0.7
    },
    {
        path: '/privacidad',
        sitemap: true,
        priority: 0.2
    },
    {
        path: '/terminos',
        sitemap: true,
        priority: 0.2
    },
    {
        path: '/politica-de-cancelacion',
        sitemap: true,
        priority: 0.2
    }
];
const LOCALES = [
    'es',
    'en'
];
const DEFAULT_LOCALE = 'es';
const SITE_URL = ("TURBOPACK compile-time value", "https://mimosaretreat.com")?.replace(/\/$/, '') || 'https://www.mimosaretreat.com';
}),
"[project]/src/lib/giftshop/fulfillment.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deliverOrder",
    ()=>deliverOrder,
    "fulfillOrder",
    ()=>fulfillOrder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/giftshop/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email/resend.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$templates$2f$giftcard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email/templates/giftcard.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/mindbody.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$wati$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/wati.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
// Idempotent fulfillment pipeline for a PAID gc_orders row. Each step
// checkpoints on columns so a crash mid-way is completed by the cron with no
// duplicate cards, bonus credits or emails.
const BONUS_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no 0/O/1/I/L
;
function randomSerial(prefix, len = 6) {
    let out = '';
    const bytes = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(len);
    for(let i = 0; i < len; i++)out += BONUS_ALPHABET[bytes[i] % BONUS_ALPHABET.length];
    return `${prefix}-${out}`;
}
function viewToken() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(16).toString('base64url');
}
// Mindbody custom tender names per Tilopay payment method, so the accountant
// can reconcile Mindbody sales ↔ Tilopay transactions ↔ bank deposits by
// method. These must exist as custom payment methods in Mindbody.
const WEB_TENDERS = {
    yappy: 'Yappy Web',
    visaMc: 'Visa/MC Web',
    amex: 'AMEX Web'
};
/**
 * Map the Tilopay authorization to a tender name. Input is the structured
 * "<selected_method>|<crd>|<brand>" stored by the callback (older rows may be
 * unstructured — handled below).
 *
 * Signals, strongest first:
 *  - selected_method: 'yappy' text or Tilopay's Yappy method id (18)
 *  - brand text anywhere: amex/american, visa, master
 *  - masked PAN in crd: 3xxx… = Amex, 4xxx…/5xxx…/2xxx… = Visa/MC
 * Unknown → Visa/MC Web (the most common case; verify per-method during
 * test-mode purchases and adjust if Tilopay's field names differ).
 */ function tenderNameFor(tilopayMethod) {
    const raw = (tilopayMethod || '').toLowerCase();
    const [method = '', crd = '', brand = ''] = raw.split('|');
    // Yappy: explicit text, or the bare method id 18 (exact token — never a
    // substring match, which would collide with masked card digits).
    if (raw.includes('yappy')) return WEB_TENDERS.yappy;
    if (/^0*18$/.test(method.trim())) return WEB_TENDERS.yappy;
    // Brand text (from brand field, method text or crd label)
    if (raw.includes('amex') || raw.includes('american')) return WEB_TENDERS.amex;
    if (brand.includes('visa') || brand.includes('master')) return WEB_TENDERS.visaMc;
    if (method.includes('visa') || method.includes('master')) return WEB_TENDERS.visaMc;
    // Masked PAN heuristic: first digit of the card number in crd
    const firstDigit = crd.replace(/\D/g, '').charAt(0);
    if (firstDigit === '3') return WEB_TENDERS.amex;
    if (firstDigit === '4' || firstDigit === '5' || firstDigit === '2') {
        return WEB_TENDERS.visaMc;
    }
    return WEB_TENDERS.visaMc;
}
/**
 * Resolve the tender for the Mindbody registration. The business uses exactly
 * three Tilopay-linked tenders in Mindbody: "Yappy Web", "Visa/MC Web",
 * "AMEX Web". If the matching one can't be found, we THROW — the order lands
 * in mindbody_status=failed with a clear error and the cron retries, instead
 * of silently posting under a tender the accountant can't reconcile.
 */ async function resolvePaymentInfo(tilopayMethod, amountCents) {
    const wanted = tenderNameFor(tilopayMethod);
    const methods = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCustomPaymentMethods"])();
    const norm = (s)=>s.toLowerCase().replace(/\s+/g, ' ').trim();
    const match = methods.find((m)=>norm(m.Name) === norm(wanted));
    if (!match) {
        throw new Error(`Custom payment method "${wanted}" not found in Mindbody (have: ${methods.map((m)=>m.Name).join(', ')})`);
    }
    return {
        paymentInfo: {
            Type: 'Custom',
            Metadata: {
                Id: match.Id,
                Amount: amountCents / 100
            }
        },
        tender: match.Name
    };
}
async function fulfillOrder(orderId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["giftshopAdminClient"])();
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShopSettings"])();
    const { data: order, error } = await supabase.from('gc_orders').select('*').eq('id', orderId).single();
    if (error || !order) throw new Error(`Order not found: ${orderId}`);
    if (order.status !== 'paid' && order.status !== 'fulfilled') return;
    let giftCardId = order.gift_card_id;
    // --- Step 1: mint serial + gift_cards row (skip if already done) ---------
    if (!giftCardId) {
        const { data: serialData, error: serialError } = await supabase.rpc('next_online_giftcard_serial');
        if (serialError || !serialData) {
            throw new Error(`Serial mint failed: ${serialError?.message}`);
        }
        const isExperience = order.item_kind === 'experience';
        const { data: card, error: cardError } = await supabase.from('gift_cards').insert({
            serial: serialData,
            format: 'gift_card',
            channel: 'online',
            buyer_name: order.buyer_name || order.buyer_email,
            buyer_email: order.buyer_email,
            buyer_phone: order.buyer_phone,
            recipient_name: order.recipient_name,
            recipient_email: order.recipient_email,
            amount_cents: order.total_cents,
            base_amount_cents: isExperience ? order.base_amount_cents : null,
            tax_cents: isExperience ? order.itbms_cents : null,
            gift_treatment_names: isExperience && order.item_name ? [
                order.item_name
            ] : null,
            message: order.gift_message,
            view_token: viewToken(),
            expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
            print_amount: true,
            print_message: !!order.gift_message,
            print_recipient: true,
            print_treatments: isExperience,
            mindbody_location_id: settings.default_mindbody_location_id
        }).select('id').single();
        if (cardError || !card) throw new Error(`Card insert failed: ${cardError?.message}`);
        giftCardId = card.id;
        await supabase.from('gc_orders').update({
            gift_card_id: giftCardId
        }).eq('id', orderId);
    }
    // --- Step 2: Mindbody registration (async, retryable, never blocks) ------
    if (order.mindbody_status === 'pending') {
        await registerInMindbody(orderId, giftCardId);
    }
    // --- Step 3: bonus card (skip if already issued) --------------------------
    if (!order.bonus_card_id) {
        await maybeIssueBonusCard(orderId, order);
    }
    // --- Step 4: delivery (respects scheduled_send_at) ------------------------
    const scheduled = order.scheduled_send_at && new Date(order.scheduled_send_at) > new Date();
    if (!scheduled) {
        await deliverOrder(orderId);
    }
    await supabase.from('gc_orders').update({
        status: 'fulfilled',
        fulfilled_at: order.fulfilled_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString()
    }).eq('id', orderId);
}
async function registerInMindbody(orderId, giftCardId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["giftshopAdminClient"])();
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShopSettings"])();
    const { data: order } = await supabase.from('gc_orders').select('*').eq('id', orderId).single();
    if (!order) return;
    // Catalog item must be mapped to a Mindbody GC product; otherwise the card
    // stays app-native and front desk sells our serial at first redemption.
    const { data: item } = order.catalog_item_id ? await supabase.from('gc_catalog_items').select('mindbody_giftcard_id, mindbody_layout_id').eq('id', order.catalog_item_id).single() : {
        data: null
    };
    if (!item?.mindbody_giftcard_id) {
        await supabase.from('gc_orders').update({
            mindbody_status: 'skipped',
            mindbody_error: 'No Mindbody GC product mapped'
        }).eq('id', orderId);
        return;
    }
    try {
        // Find-or-create the buyer as a Mindbody client.
        let clientId;
        const found = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchClients"])(order.buyer_email);
        if (Array.isArray(found) && found.length > 0) {
            clientId = found[0].Id;
        } else {
            const [first, ...rest] = String(order.buyer_name || 'Cliente Web').split(/\s+/);
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addClient"])({
                FirstName: first,
                LastName: rest.join(' ') || 'Web',
                Email: order.buyer_email,
                MobilePhone: String(order.buyer_phone || '60000000').replace(/\D/g, '') || '60000000'
            });
            clientId = created?.Id;
        }
        if (!clientId) throw new Error('Could not resolve Mindbody client');
        // Tender mirrors how the buyer paid at Tilopay (Yappy Web / Visa/MC Web /
        // AMEX Web) so Mindbody reports reconcile per method against Tilopay.
        const { paymentInfo, tender } = await resolvePaymentInfo(order.tilopay_method, order.total_cents);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$mindbody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["purchaseGiftCard"])({
            test: process.env.GIFTCARD_TEST_MODE === '1',
            locationId: settings.default_mindbody_location_id,
            giftCardId: Number(item.mindbody_giftcard_id),
            layoutId: item.mindbody_layout_id ? Number(item.mindbody_layout_id) : undefined,
            purchaserClientId: clientId,
            recipientName: order.recipient_name,
            recipientEmail: order.recipient_email || undefined,
            giftMessage: order.gift_message || undefined,
            title: order.item_name || undefined,
            paymentInfo
        });
        if (result?.BarcodeId) {
            await supabase.from('gift_cards').update({
                mindbody_barcode_id: result.BarcodeId
            }).eq('id', giftCardId);
        }
        await supabase.from('gc_orders').update({
            mindbody_status: 'registered',
            mindbody_registered_at: new Date().toISOString(),
            mindbody_tender: tender,
            mindbody_error: null
        }).eq('id', orderId);
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Mindbody registration failed';
        await supabase.from('gc_orders').update({
            mindbody_status: 'failed',
            mindbody_error: msg.slice(0, 500),
            mindbody_attempts: (order.mindbody_attempts ?? 0) + 1
        }).eq('id', orderId);
    }
}
async function maybeIssueBonusCard(orderId, order) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["giftshopAdminClient"])();
    const now = new Date().toISOString();
    const { data: rules } = await supabase.from('bonus_rules').select('*').eq('is_active', true).lte('min_total_cents', order.total_cents).order('bonus_cents', {
        ascending: false
    }).limit(5);
    const rule = (rules || []).find((r)=>(!r.starts_at || r.starts_at <= now) && (!r.ends_at || r.ends_at >= now));
    if (!rule) return;
    // Serial collision retry (random alphabet, unique constraint backs us up).
    for(let attempt = 0; attempt < 3; attempt++){
        const { data: bonus, error } = await supabase.from('bonus_cards').insert({
            serial: randomSerial('BN'),
            kind: 'promo',
            amount_cents: rule.bonus_cents,
            owner_name: order.buyer_name,
            owner_email: order.buyer_email,
            owner_phone: order.buyer_phone,
            source_order_id: orderId,
            expires_at: new Date(Date.now() + (rule.validity_days ?? 90) * 24 * 3600 * 1000).toISOString(),
            view_token: viewToken()
        }).select('id').single();
        if (!error && bonus) {
            await supabase.from('gc_orders').update({
                bonus_card_id: bonus.id
            }).eq('id', orderId);
            return;
        }
        if (error && !/duplicate|unique/i.test(error.message)) return;
    }
}
async function deliverOrder(orderId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["giftshopAdminClient"])();
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShopSettings"])();
    const { data: order } = await supabase.from('gc_orders').select('*').eq('id', orderId).single();
    if (!order || !order.gift_card_id) return;
    const { data: card } = await supabase.from('gift_cards').select('serial, view_token, mindbody_barcode_id').eq('id', order.gift_card_id).single();
    if (!card?.view_token) return;
    const giftUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/gift/${card.view_token}`;
    const amountLabel = `$${(order.total_cents / 100).toFixed(0)}`;
    const itemName = order.item_name || 'Gift Card';
    const buyerName = order.buyer_name || 'Mimosa';
    const forwardText = order.locale === 'en' ? `A Mimosa Spa gift for you 🎁 ${giftUrl}` : `Un regalo de Mimosa Spa para ti 🎁 ${giftUrl}`;
    const whatsappForwardUrl = `https://wa.me/?text=${encodeURIComponent(forwardText)}`;
    if (!order.email_sent_at && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEmailConfigured"])()) {
        // Recipient email (when we have one)
        if (order.recipient_email && order.delivery_email) {
            const mail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$templates$2f$giftcard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recipientGiftEmail"])({
                locale: order.locale || 'es',
                recipientName: order.recipient_name,
                buyerName,
                amountLabel,
                itemName,
                message: order.gift_message,
                giftUrl
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                to: order.recipient_email,
                ...mail
            });
        }
        // Buyer receipt (always)
        let bonusLabel = null;
        if (order.bonus_card_id) {
            const { data: bonus } = await supabase.from('bonus_cards').select('amount_cents, expires_at, serial').eq('id', order.bonus_card_id).single();
            if (bonus) {
                bonusLabel = order.locale === 'en' ? `Your purchase earned a $${(bonus.amount_cents / 100).toFixed(0)} bonus card (${bonus.serial}), valid until ${new Date(bonus.expires_at).toLocaleDateString('en-US')}.` : `Tu compra ganó una bonus card de $${(bonus.amount_cents / 100).toFixed(0)} (${bonus.serial}), válida hasta ${new Date(bonus.expires_at).toLocaleDateString('es-PA')}.`;
            }
        }
        const receipt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$templates$2f$giftcard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buyerReceiptEmail"])({
            locale: order.locale || 'es',
            buyerName,
            recipientName: order.recipient_name,
            amountLabel,
            itemName,
            orderNumber: order.order_number,
            giftUrl,
            whatsappForwardUrl,
            bonusLabel,
            scheduledLabel: order.scheduled_send_at ? new Date(order.scheduled_send_at).toLocaleDateString(order.locale === 'en' ? 'en-US' : 'es-PA') : null
        });
        const sent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: order.buyer_email,
            ...receipt
        });
        if (sent.ok) {
            await supabase.from('gc_orders').update({
                email_sent_at: new Date().toISOString()
            }).eq('id', orderId);
        }
        // Internal notification
        if (settings.notify_email) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                to: settings.notify_email,
                subject: `Venta online: ${itemName} ${amountLabel} (${order.order_number})`,
                html: `<p>Comprador: ${order.buyer_email}<br/>Destinatario: ${order.recipient_name}<br/>Serial: ${card.serial}<br/>Mindbody: ${order.mindbody_status}</p>`
            });
        }
    }
    // WhatsApp delivery via approved template (opt-in + flag + template approved)
    if (!order.whatsapp_sent_at && order.delivery_whatsapp && order.recipient_phone && settings.whatsapp_delivery_enabled && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$wati$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isWatiConfigured"])()) {
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$wati$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendTemplateMessage"])(order.recipient_phone, 'giftcard_entrega', [
            {
                name: '1',
                value: card.view_token
            },
            {
                name: 'nombre',
                value: order.recipient_name
            },
            {
                name: 'remitente',
                value: buyerName
            },
            {
                name: 'monto',
                value: amountLabel
            }
        ]);
        await supabase.from('gc_orders').update(res.result ? {
            whatsapp_sent_at: new Date().toISOString(),
            whatsapp_error: null
        } : {
            whatsapp_error: (res.error || 'send failed').slice(0, 300)
        }).eq('id', orderId);
    }
}
}),
"[project]/src/lib/giftshop/sign.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signOrderNumber",
    ()=>signOrderNumber
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function signOrderNumber(orderNumber) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', process.env.CRON_SECRET || 'dev').update(orderNumber).digest('hex').slice(0, 16);
}
}),
"[project]/src/app/api/giftcards/checkout/callback/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/giftshop/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payments/tilopay.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$fulfillment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/giftshop/fulfillment.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$sign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/giftshop/sign.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(request) {
    const q = request.nextUrl.searchParams;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["giftshopAdminClient"])();
    // Locate the order (returnData carries our order id; `order` carries order_number).
    let orderRow = null;
    const returnData = q.get('returnData');
    if (returnData) {
        try {
            const id = Buffer.from(returnData, 'base64url').toString('utf8');
            const { data } = await supabase.from('gc_orders').select('id, order_number, status, total_cents, buyer_email, locale').eq('id', id).single();
            orderRow = data;
        } catch  {
            orderRow = null;
        }
    }
    if (!orderRow && q.get('order')) {
        const { data } = await supabase.from('gc_orders').select('id, order_number, status, total_cents, buyer_email, locale').eq('order_number', q.get('order')).single();
        orderRow = data;
    }
    if (!orderRow) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/es/giftcards/error?reason=notfound`, 303);
    }
    const locale = orderRow.locale === 'en' ? 'en' : 'es';
    const errorUrl = (reason)=>`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/${locale}/giftcards/error?o=${orderRow.order_number}&reason=${reason}`;
    const graciasUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/${locale}/giftcards/gracias?o=${orderRow.order_number}&k=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$sign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signOrderNumber"])(orderRow.order_number)}`;
    // Already resolved (refresh / duplicate hit) → just show the outcome.
    if (orderRow.status === 'paid' || orderRow.status === 'fulfilled') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(graciasUrl, 303);
    }
    if (orderRow.status === 'refunded') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(errorUrl('refunded'), 303);
    }
    // Validate the OrderHash before trusting anything.
    const valid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTilopayHash"])({
        code: q.get('code'),
        description: q.get('description'),
        auth: q.get('auth'),
        order: q.get('order'),
        tpt: q.get('tpt'),
        crd: q.get('crd'),
        OrderHash: q.get('OrderHash'),
        orderNumber: orderRow.order_number,
        amountCents: orderRow.total_cents,
        buyerEmail: orderRow.buyer_email
    });
    if (!valid) {
        console.error('Tilopay callback hash mismatch for', orderRow.order_number);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(errorUrl('invalid'), 303);
    }
    const approved = q.get('code') === '1';
    const callbackRaw = Object.fromEntries(q.entries());
    if (approved) {
        // Idempotent claim: only one request flips pending → paid.
        const { data: claimed } = await supabase.from('gc_orders').update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            tilopay_tpt: q.get('tpt'),
            tilopay_auth: q.get('auth'),
            tilopay_response_code: q.get('code'),
            tilopay_description: q.get('description'),
            // Structured "<selected_method>|<crd>|<brand-ish>" — parsed by
            // tenderNameFor() to pick the Mindbody tender (Yappy Web / Visa/MC
            // Web / AMEX Web). Raw params are also kept in callback_raw.
            tilopay_method: [
                q.get('selected_method') ?? '',
                q.get('crd') ?? '',
                q.get('brand') ?? q.get('card_type') ?? ''
            ].join('|').slice(0, 160) || null,
            callback_raw: callbackRaw,
            updated_at: new Date().toISOString()
        }).eq('id', orderRow.id).eq('status', 'pending').select('id');
        if (claimed && claimed.length > 0) {
            // Fulfillment errors never lose the paid state — the cron completes it.
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$fulfillment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fulfillOrder"])(orderRow.id);
            } catch (e) {
                console.error('Inline fulfillment failed (cron will retry):', e);
                await supabase.from('gc_orders').update({
                    fulfillment_error: (e instanceof Error ? e.message : 'unknown').slice(0, 500)
                }).eq('id', orderRow.id);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(graciasUrl, 303);
    }
    await supabase.from('gc_orders').update({
        status: 'payment_failed',
        tilopay_response_code: q.get('code'),
        tilopay_description: q.get('description'),
        callback_raw: callbackRaw,
        updated_at: new Date().toISOString()
    }).eq('id', orderRow.id).eq('status', 'pending');
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(errorUrl('declined'), 303);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2450ef59._.js.map