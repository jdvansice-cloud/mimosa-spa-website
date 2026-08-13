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
"[project]/src/lib/default-images.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/site-images.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SITE_IMAGES_TAG",
    ()=>SITE_IMAGES_TAG,
    "getSiteImage",
    ()=>getSiteImage,
    "getSiteImages",
    ()=>getSiteImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/default-images.ts [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
;
;
const SITE_IMAGES_TAG = 'site-images';
// Cached fetch of ALL active site images + their variants. One tagged cache
// entry keeps revalidation simple: any admin image change revalidates it.
const getAllSiteImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"][key] || '';
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"][key] || '';
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
        result[key] = pool && pool.length > 0 ? pickDaily(key, pool) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"][key] || '';
    }
    return result;
}
}),
"[project]/src/app/api/admin/site-images/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/site-images.ts [app-route] (ecmascript) <locals>");
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
        const { data, error } = await supabase.from('site_images').select('*').order('category', {
            ascending: true
        }).order('name', {
            ascending: true
        });
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data
        });
    } catch  {
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
        const { id, image_url } = body;
        if (!id || !image_url) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing id or image_url'
            }, {
                status: 400
            });
        }
        const { data, error } = await supabase.from('site_images').update({
            image_url
        }).eq('id', id).select().single();
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SITE_IMAGES_TAG"], 'max');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__001ea0da._.js.map