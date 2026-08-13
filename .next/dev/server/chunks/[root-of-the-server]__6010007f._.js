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
"[project]/src/app/api/portal/auth/lookup/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
function getServiceClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY);
}
// Basic email format check — must contain "@" and a "." in the domain part
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function POST(request) {
    try {
        const { credential } = await request.json();
        if (!credential || typeof credential !== 'string' || !credential.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Ingresa tu correo o número de teléfono'
            }, {
                status: 400
            });
        }
        const trimmed = credential.trim();
        const isEmail = trimmed.includes('@');
        const serviceClient = getServiceClient();
        if (isEmail) {
            const normalizedEmail = trimmed.toLowerCase();
            if (!EMAIL_REGEX.test(normalizedEmail)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Correo electrónico inválido'
                }, {
                    status: 400
                });
            }
            const { data: emailLinks } = await serviceClient.from('linked_accounts').select('mindbody_client_id, client_name').eq('credential', normalizedEmail).eq('credential_type', 'email');
            if (!emailLinks || emailLinks.length === 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    clients: [],
                    notFound: true,
                    credentialType: 'email'
                });
            }
            // For each matched client, also look up their phone in linked_accounts
            const clientIds = emailLinks.map((l)=>l.mindbody_client_id);
            const { data: phoneLinks } = await serviceClient.from('linked_accounts').select('mindbody_client_id, credential').in('mindbody_client_id', clientIds).eq('credential_type', 'phone');
            const phoneByClientId = new Map();
            if (phoneLinks) {
                for (const p of phoneLinks){
                    phoneByClientId.set(p.mindbody_client_id, p.credential);
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                credentialType: 'email',
                clients: emailLinks.map((l)=>({
                        Id: l.mindbody_client_id,
                        FirstName: l.client_name.split(' ')[0] || l.client_name,
                        LastName: l.client_name.split(' ').slice(1).join(' ') || '',
                        displayName: l.client_name,
                        Email: normalizedEmail,
                        MobilePhone: phoneByClientId.get(l.mindbody_client_id) ?? null
                    }))
            });
        }
        // Phone branch — keep only digits
        const normalizedPhone = trimmed.replace(/\D/g, '');
        if (normalizedPhone.length < 10) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Escribe el número completo con código de país sin el + (ej: Panamá 50766124546 · EE.UU. 12125551234)'
            }, {
                status: 400
            });
        }
        const { data: links } = await serviceClient.from('linked_accounts').select('mindbody_client_id, client_name, credential_type').eq('credential', normalizedPhone).eq('credential_type', 'phone');
        if (!links || links.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                clients: [],
                notFound: true,
                credentialType: 'phone'
            });
        }
        // For each matched client, also look up their email in linked_accounts
        const clientIds = links.map((l)=>l.mindbody_client_id);
        const { data: emailLinks } = await serviceClient.from('linked_accounts').select('mindbody_client_id, credential').in('mindbody_client_id', clientIds).eq('credential_type', 'email');
        const emailByClientId = new Map();
        if (emailLinks) {
            for (const e of emailLinks){
                emailByClientId.set(e.mindbody_client_id, e.credential);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            credentialType: 'phone',
            clients: links.map((l)=>({
                    Id: l.mindbody_client_id,
                    FirstName: l.client_name.split(' ')[0] || l.client_name,
                    LastName: l.client_name.split(' ').slice(1).join(' ') || '',
                    displayName: l.client_name,
                    Email: emailByClientId.get(l.mindbody_client_id) ?? null,
                    MobilePhone: normalizedPhone
                }))
        });
    } catch (error) {
        console.error('Lookup error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error al buscar cuenta'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6010007f._.js.map