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
"[project]/src/lib/kpis/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOCATION_IDS",
    ()=>LOCATION_IDS,
    "LOCATION_MANAGERS",
    ()=>LOCATION_MANAGERS,
    "LOCATION_NAMES",
    ()=>LOCATION_NAMES,
    "MONTHLY_BUDGETS",
    ()=>MONTHLY_BUDGETS,
    "PANAMA_TZ",
    ()=>PANAMA_TZ
]);
const PANAMA_TZ = 'America/Panama';
const LOCATION_IDS = [
    1,
    2
];
const LOCATION_NAMES = {
    1: 'Costa del Este',
    2: 'San Francisco'
};
const LOCATION_MANAGERS = {
    1: 'Nilka',
    2: 'Maricarmen'
};
const MONTHLY_BUDGETS = {
    2026: {
        1: [
            75_000,
            95_000,
            95_000,
            90_000,
            95_000,
            105_000,
            85_000,
            100_000,
            100_000,
            100_000,
            100_000,
            160_000
        ],
        2: [
            30_000,
            35_000,
            40_000,
            40_000,
            40_000,
            45_000,
            35_000,
            40_000,
            45_000,
            45_000,
            50_000,
            70_000
        ]
    }
};
}),
"[project]/src/app/api/track/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$kpis$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/kpis/constants.ts [app-route] (ecmascript)");
;
;
;
const dynamic = 'force-dynamic';
const ALLOWED_EVENTS = new Set([
    'page_view',
    'booking_start',
    'booking_step_auth',
    'booking_step_location',
    'booking_step_services',
    'booking_step_addons',
    'booking_step_staff',
    'booking_step_datetime',
    'booking_step_confirm',
    'booking_completed',
    'whatsapp_click',
    'lead_submit',
    'giftshop_view',
    'giftshop_checkout',
    'giftshop_paid'
]);
const str = (v, max)=>typeof v === 'string' && v.length > 0 ? v.slice(0, max) : null;
async function POST(request) {
    try {
        const body = await request.json();
        const event = str(body?.event, 40);
        const sessionId = str(body?.session_id, 64);
        if (!event || !sessionId || !ALLOWED_EVENTS.has(event)) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 204
            });
        }
        const eventDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$kpis$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PANAMA_TZ"]
        }).format(new Date());
        const locationId = Number(body?.location_id);
        const meta = body?.meta && typeof body.meta === 'object' ? body.meta : null;
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                persistSession: false
            }
        });
        await supabase.from('web_events').insert({
            event_date: eventDate,
            event,
            session_id: sessionId,
            path: str(body?.path, 200),
            locale: str(body?.locale, 8),
            device: body?.device === 'mobile' || body?.device === 'desktop' ? body.device : null,
            utm_source: str(body?.utm_source, 80),
            utm_medium: str(body?.utm_medium, 80),
            utm_campaign: str(body?.utm_campaign, 120),
            referrer: str(body?.referrer, 200),
            location_id: Number.isFinite(locationId) ? locationId : null,
            meta: meta && JSON.stringify(meta).length <= 2000 ? meta : null
        });
    } catch  {
    // swallow — analytics must never surface errors to visitors
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 204
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7cdb5392._.js.map