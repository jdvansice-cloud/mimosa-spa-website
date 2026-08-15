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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[project]/src/lib/booking/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ===========================================
// SIMPLE IN-MEMORY RATE LIMITER
// For production, consider using Redis or Upstash
// ===========================================
__turbopack_context__.s([
    "RATE_LIMIT_AUTH",
    ()=>RATE_LIMIT_AUTH,
    "RATE_LIMIT_BOOKING",
    ()=>RATE_LIMIT_BOOKING,
    "RATE_LIMIT_STANDARD",
    ()=>RATE_LIMIT_STANDARD,
    "checkRateLimit",
    ()=>checkRateLimit,
    "createRateLimitHeaders",
    ()=>createRateLimitHeaders,
    "getClientIdentifier",
    ()=>getClientIdentifier
]);
// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production, use Redis-based rate limiting
const rateLimitStore = new Map();
// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
;
let lastCleanup = Date.now();
function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    for (const [key, entry] of rateLimitStore.entries()){
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
    lastCleanup = now;
}
function checkRateLimit(identifier, config) {
    cleanup();
    const now = Date.now();
    const windowMs = config.windowSec * 1000;
    const key = identifier;
    const entry = rateLimitStore.get(key);
    // No existing entry - create one
    if (!entry || entry.resetTime < now) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        });
        return {
            success: true,
            remaining: config.limit - 1,
            resetIn: config.windowSec
        };
    }
    // Existing entry - check if limit exceeded
    if (entry.count >= config.limit) {
        const resetIn = Math.ceil((entry.resetTime - now) / 1000);
        return {
            success: false,
            remaining: 0,
            resetIn
        };
    }
    // Increment count
    entry.count++;
    return {
        success: true,
        remaining: config.limit - entry.count,
        resetIn: Math.ceil((entry.resetTime - now) / 1000)
    };
}
function getClientIdentifier(request) {
    // Try to get real IP from headers (for proxied requests)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwarded.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    // Fallback to a generic identifier
    // In production behind a proxy, this should rarely be reached
    return 'unknown';
}
const RATE_LIMIT_STANDARD = {
    limit: 60,
    windowSec: 60
};
const RATE_LIMIT_AUTH = {
    limit: 10,
    windowSec: 60
};
const RATE_LIMIT_BOOKING = {
    limit: 5,
    windowSec: 60
};
function createRateLimitHeaders(result) {
    return {
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetIn),
        ...result.success ? {} : {
            'Retry-After': String(result.resetIn)
        }
    };
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
"[project]/src/app/api/giftcards/checkout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/giftshop/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payments/tilopay.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-route] (ecmascript)");
;
;
;
;
;
;
function orderNumber() {
    const d = new Date();
    const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(3).toString('hex').toUpperCase();
    return `GC${ymd}-${rand}`;
}
async function POST(request) {
    const rl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(`gcshop:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIdentifier"])(request)}`, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RATE_LIMIT_AUTH"]);
    if (!rl.success) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Too many requests'
    }, {
        status: 429
    });
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShopSettings"])();
    if (!settings.shop_enabled || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTilopayConfigured"])()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'La tienda no está disponible todavía.'
        }, {
            status: 503
        });
    }
    let body;
    try {
        body = await request.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid body'
        }, {
            status: 400
        });
    }
    // Honeypot
    if (typeof body.website === 'string' && body.website.trim() !== '') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    }
    const catalog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getActiveCatalog"])();
    const item = catalog.find((i)=>i.id === body.itemId);
    if (!item) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Artículo no disponible'
    }, {
        status: 400
    });
    const buyerEmail = String(body.buyerEmail || '').trim().toLowerCase();
    const buyerName = String(body.buyerName || '').trim().slice(0, 120);
    const recipientName = String(body.recipientName || '').trim().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Correo del comprador inválido'
        }, {
            status: 400
        });
    }
    if (!buyerName || !recipientName) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Nombre del comprador y destinatario son requeridos'
        }, {
            status: 400
        });
    }
    const recipientEmail = body.recipientEmail ? String(body.recipientEmail).trim().toLowerCase().slice(0, 160) : null;
    if (recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Correo del destinatario inválido'
        }, {
            status: 400
        });
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["giftshopAdminClient"])();
    // Abuse guard: ≤5 pending orders per buyer in 10 minutes.
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase.from('gc_orders').select('id', {
        count: 'exact',
        head: true
    }).eq('buyer_email', buyerEmail).eq('status', 'pending').gte('created_at', tenMinAgo);
    if ((count ?? 0) >= 5) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Demasiados intentos. Intenta más tarde.'
        }, {
            status: 429
        });
    }
    const itbms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["itbmsCentsFor"])(item);
    const total = item.amount_cents + itbms;
    const locale = body.locale === 'en' ? 'en' : 'es';
    let scheduled = null;
    if (typeof body.scheduledDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.scheduledDate)) {
        // 09:00 America/Panama (UTC-5, no DST) = 14:00 UTC
        const dt = new Date(`${body.scheduledDate}T14:00:00.000Z`);
        if (dt > new Date()) scheduled = dt.toISOString();
    }
    const { data: order, error } = await supabase.from('gc_orders').insert({
        order_number: orderNumber(),
        status: 'pending',
        catalog_item_id: item.id,
        item_kind: item.kind,
        item_name: locale === 'en' ? item.name_en : item.name_es,
        base_amount_cents: item.amount_cents,
        itbms_cents: itbms,
        total_cents: total,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: body.buyerPhone ? String(body.buyerPhone).slice(0, 24) : null,
        buyer_country: body.buyerCountry ? String(body.buyerCountry).slice(0, 2).toUpperCase() : 'PA',
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        recipient_phone: body.recipientPhone ? String(body.recipientPhone).slice(0, 24) : null,
        gift_message: body.message ? String(body.message).slice(0, 300) : null,
        delivery_email: recipientEmail != null,
        delivery_whatsapp: !!body.recipientPhone,
        scheduled_send_at: scheduled,
        design_slug: typeof body.design === 'string' ? body.design.slice(0, 40) : 'general',
        locale
    }).select('id, order_number').single();
    if (error || !order) {
        console.error('gc_orders insert failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error al crear el pedido'
        }, {
            status: 500
        });
    }
    try {
        const url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTilopayPayment"])({
            orderNumber: order.order_number,
            amountCents: total,
            redirectUrl: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/api/giftcards/checkout/callback`,
            buyerName,
            buyerEmail,
            buyerPhone: body.buyerPhone ? String(body.buyerPhone) : undefined,
            buyerCountry: body.buyerCountry ? String(body.buyerCountry) : 'PA',
            returnData: Buffer.from(order.id).toString('base64url')
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url
        });
    } catch (e) {
        console.error('Tilopay payment creation failed:', e);
        await supabase.from('gc_orders').update({
            status: 'payment_failed',
            tilopay_description: 'processPayment failed'
        }).eq('id', order.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'No pudimos iniciar el pago. Intenta de nuevo.'
        }, {
            status: 502
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7118a20a._.js.map