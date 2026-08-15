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
"[project]/src/app/api/giftcards/catalog/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/giftshop/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payments/tilopay.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    const [settings, catalog] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShopSettings"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getActiveCatalog"])()
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        shopEnabled: settings.shop_enabled && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payments$2f$tilopay$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTilopayConfigured"])(),
        occasion: settings.occasion_slug,
        items: catalog.map((i)=>({
                id: i.id,
                kind: i.kind,
                name_es: i.name_es,
                name_en: i.name_en,
                description_es: i.description_es,
                description_en: i.description_en,
                amount_cents: i.amount_cents,
                itbms_cents: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$giftshop$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["itbmsCentsFor"])(i),
                image_url: i.image_url,
                badge_es: i.badge_es,
                badge_en: i.badge_en,
                default_design_slug: i.default_design_slug
            }))
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f01539e6._.js.map