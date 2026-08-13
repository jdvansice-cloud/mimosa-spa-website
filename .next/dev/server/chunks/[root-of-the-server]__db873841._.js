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
"[project]/src/app/sitemap.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>sitemap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-route] (ecmascript)");
;
function sitemap() {
    const entries = [];
    for (const route of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PUBLIC_ROUTES"]){
        if (!route.sitemap) continue;
        for (const locale of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LOCALES"]){
            const languages = {};
            for (const l of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LOCALES"]){
                languages[l] = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/${l}${route.path}`;
            }
            entries.push({
                url: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SITE_URL"]}/${locale}${route.path}`,
                priority: route.priority,
                changeFrequency: 'weekly',
                alternates: {
                    languages
                }
            });
        }
    }
    return entries;
}
}),
"[project]/src/app/sitemap--route-entry.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/sitemap.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$metadata$2f$resolve$2d$route$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js [app-route] (ecmascript)");
;
;
;
const contentType = "application/xml";
const cacheControl = "public, max-age=0, must-revalidate";
const fileType = "sitemap";
if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"] !== 'function') {
    throw new Error('Default export is missing in "./sitemap.ts"');
}
async function GET() {
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$metadata$2f$resolve$2d$route$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveRouteData"])(data, fileType);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](content, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': cacheControl
        }
    });
}
;
}),
"[project]/src/app/sitemap--route-entry.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$sitemap$2d2d$route$2d$entry$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["GET"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$sitemap$2d2d$route$2d$entry$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/app/sitemap--route-entry.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/sitemap.ts [app-route] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__db873841._.js.map