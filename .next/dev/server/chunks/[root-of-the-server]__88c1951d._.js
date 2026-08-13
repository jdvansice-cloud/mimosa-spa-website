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
"[project]/src/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
// Cookie max age: 24 hours in seconds
const COOKIE_MAX_AGE = 60 * 60 * 24;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcWJheGZ5bm1sY3h3cm5hZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDQ2OTMsImV4cCI6MjA4MzQ4MDY5M30.bfWfBQZ8bZgcjQcXlZXBhjbLyx-VN168xjnvgn-enYQ"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    // Extend cookie lifetime to 24 hours
                    cookieStore.set({
                        name,
                        value,
                        ...options,
                        maxAge: options.maxAge ?? COOKIE_MAX_AGE,
                        // Ensure cookies persist across browser sessions
                        sameSite: 'lax',
                        secure: ("TURBOPACK compile-time value", "development") === 'production'
                    });
                } catch  {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: '',
                        ...options
                    });
                } catch  {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/src/lib/auth/require-admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requireAdmin",
    ()=>requireAdmin,
    "requireKpisAccess",
    ()=>requireKpisAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
async function requireAdmin() {
    return requireRole([
        'admin'
    ]);
}
async function requireKpisAccess() {
    return requireRole([
        'admin',
        'mobile_manager'
    ]);
}
async function requireRole(roles) {
    let supabase;
    try {
        supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'No autorizado'
        }, {
            status: 401
        });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'No autorizado'
        }, {
            status: 401
        });
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !roles.includes(profile.role)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Acceso denegado'
        }, {
            status: 403
        });
    }
    return null;
}
}),
"[project]/src/lib/settings.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SETTINGS",
    ()=>DEFAULT_SETTINGS,
    "SETTINGS_TAG",
    ()=>SETTINGS_TAG,
    "aggregateRating",
    ()=>aggregateRating,
    "getServerSettings",
    ()=>getServerSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SETTINGS_TAG = 'settings';
function aggregateRating(s) {
    const cde = s.google_rating_cde && s.google_review_count_cde ? {
        rating: Number(s.google_rating_cde),
        count: Number(s.google_review_count_cde),
        url: s.google_reviews_url_cde || ''
    } : null;
    const sfc = s.google_rating_sfc && s.google_review_count_sfc ? {
        rating: Number(s.google_rating_sfc),
        count: Number(s.google_review_count_sfc),
        url: s.google_reviews_url_sfc || ''
    } : null;
    const parts = [
        cde,
        sfc
    ].filter(Boolean);
    if (parts.length === 0) {
        return {
            rating: Number(s.google_rating) || 0,
            count: Number(s.google_review_count) || 0,
            url: s.google_reviews_url || '',
            cde: null,
            sfc: null
        };
    }
    const count = parts.reduce((sum, p)=>sum + p.count, 0);
    const weighted = parts.reduce((sum, p)=>sum + p.rating * p.count, 0) / (count || 1);
    // One decimal, never overstating (4.85 → 4.8)
    const rating = Math.floor(weighted * 10) / 10;
    return {
        rating,
        count,
        url: cde?.url || sfc?.url || s.google_reviews_url || '',
        cde,
        sfc
    };
}
const DEFAULT_SETTINGS = {
    phone_costa_del_este: '398-5295',
    phone_san_francisco: '398-5295',
    email: 'info@mimosaretreat.com',
    whatsapp_number: '50764049464',
    whatsapp_message: 'Hola, me gustaría obtener información sobre sus servicios.',
    weekday_open: '09:00',
    weekday_close: '20:00',
    weekend_open: '09:00',
    weekend_close: '18:00',
    instagram_url: 'https://instagram.com/mimosaretreat',
    facebook_url: 'https://facebook.com/mimosaretreat',
    google_rating: 4.8,
    google_review_count: 96,
    google_reviews_url: '',
    google_rating_cde: null,
    google_review_count_cde: null,
    google_reviews_url_cde: null,
    google_rating_sfc: null,
    google_review_count_sfc: null,
    google_reviews_url_sfc: null
};
const getServerSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('site_settings').select('*').limit(1);
        if (error || !data || data.length === 0) return DEFAULT_SETTINGS;
        return {
            ...DEFAULT_SETTINGS,
            ...data[0]
        };
    } catch  {
        return DEFAULT_SETTINGS;
    }
}, [
    'site-settings'
], {
    tags: [
        SETTINGS_TAG
    ],
    revalidate: 3600
});
}),
"[project]/src/app/api/admin/settings/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$require$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/require-admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/settings.ts [app-route] (ecmascript)");
;
;
;
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
async function GET() {
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        // Get the first row (we only need one row for settings)
        const { data, error } = await supabase.from('site_settings').select('*').limit(1);
        if (error) {
            console.error('Error fetching site settings:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        // If no settings exist yet, return defaults
        if (!data || data.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                data: {
                    phone_costa_del_este: '+507 6000-0001',
                    phone_san_francisco: '+507 6000-0002',
                    email: 'info@mimosaretreat.com',
                    whatsapp_number: '50764049464',
                    whatsapp_message: 'Hola, me gustaría obtener información sobre sus servicios.',
                    weekday_open: '09:00',
                    weekday_close: '20:00',
                    weekend_open: '09:00',
                    weekend_close: '18:00',
                    instagram_url: 'https://instagram.com/mimosaretreat',
                    facebook_url: 'https://facebook.com/mimosaretreat',
                    whatsapp_dual_channel: true,
                    online_discount_active: false,
                    online_discount_percent: 0
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: data[0]
        });
    } catch (error) {
        console.error('Error in site settings API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const denied = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$require$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAdmin"])();
        if (denied) return denied;
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const body = await request.json();
        console.log('PUT /api/admin/settings - body:', body);
        // Get the first row to update
        const { data: existing, error: fetchError } = await supabase.from('site_settings').select('id').limit(1);
        if (fetchError) {
            console.error('Error fetching existing settings:', fetchError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: fetchError.message
            }, {
                status: 500
            });
        }
        console.log('Existing settings row:', existing);
        const updateData = {
            phone_costa_del_este: body.phone_costa_del_este,
            phone_san_francisco: body.phone_san_francisco,
            email: body.email,
            whatsapp_number: body.whatsapp_number,
            whatsapp_message: body.whatsapp_message,
            weekday_open: body.weekday_open,
            weekday_close: body.weekday_close,
            weekend_open: body.weekend_open,
            weekend_close: body.weekend_close,
            instagram_url: body.instagram_url,
            facebook_url: body.facebook_url,
            whatsapp_dual_channel: body.whatsapp_dual_channel ?? true,
            online_discount_active: body.online_discount_active ?? false,
            online_discount_percent: body.online_discount_percent ?? 0,
            google_rating: body.google_rating ?? 4.8,
            google_review_count: body.google_review_count ?? 96,
            google_reviews_url: body.google_reviews_url ?? '',
            google_rating_cde: body.google_rating_cde ?? null,
            google_review_count_cde: body.google_review_count_cde ?? null,
            google_reviews_url_cde: body.google_reviews_url_cde ?? null,
            google_rating_sfc: body.google_rating_sfc ?? null,
            google_review_count_sfc: body.google_review_count_sfc ?? null,
            google_reviews_url_sfc: body.google_reviews_url_sfc ?? null,
            updated_at: new Date().toISOString()
        };
        let result;
        if (existing && existing.length > 0) {
            console.log('Updating row with id:', existing[0].id);
            // Update the first row
            result = await supabase.from('site_settings').update(updateData).eq('id', existing[0].id).select().single();
        } else {
            console.log('Inserting new row');
            // Insert new settings
            result = await supabase.from('site_settings').insert(updateData).select().single();
        }
        console.log('Supabase result:', result);
        if (result.error) {
            console.error('Error saving site settings:', result.error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: result.error.message
            }, {
                status: 500
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SETTINGS_TAG"], 'max');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: result.data
        });
    } catch (error) {
        console.error('Error in site settings API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__88c1951d._.js.map