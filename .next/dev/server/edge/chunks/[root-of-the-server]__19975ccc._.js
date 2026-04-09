(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__19975ccc._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/src/i18n/routing.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routing",
    ()=>routing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [middleware-edge] (ecmascript) <export default as defineRouting>");
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    locales: [
        'es',
        'en'
    ],
    defaultLocale: 'es',
    localeDetection: false // Don't auto-detect browser language, always use Spanish
});
}),
"[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
async function updateSession(request) {
    let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        // Supabase not configured, just pass through
        return supabaseResponse;
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                cookiesToSet.forEach(({ name, value, options })=>supabaseResponse.cookies.set(name, value, options));
            }
        }
    });
    // IMPORTANT: Do NOT run any code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could lead to users
    // being logged out unexpectedly.
    // This refreshes the session if expired - required for Server Components
    await supabase.auth.getUser();
    return supabaseResponse;
}
}),
"[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/src/i18n/routing.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude-worktrees/mimosa-spa-website/relaxed-black/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)");
;
;
;
;
// Create the intl middleware
const intlMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"]);
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Skip middleware for API routes, static files, and admin routes
    if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/_vercel') || pathname.startsWith('/admin') || pathname.includes('.')) {
        // Still refresh Supabase session for API routes that need auth
        if (pathname.startsWith('/api/portal')) {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // First, refresh Supabase session (this is critical for keeping users logged in)
    const supabaseResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2d$worktrees$2f$mimosa$2d$spa$2d$website$2f$relaxed$2d$black$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
    // Then apply intl middleware
    const intlResponse = intlMiddleware(request);
    // Merge the cookies from supabase response into intl response
    if (supabaseResponse.cookies) {
        supabaseResponse.cookies.getAll().forEach((cookie)=>{
            intlResponse.cookies.set(cookie.name, cookie.value, {
                ...cookie
            });
        });
    }
    return intlResponse;
}
const config = {
    // Match all pathnames
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */ '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__19975ccc._.js.map