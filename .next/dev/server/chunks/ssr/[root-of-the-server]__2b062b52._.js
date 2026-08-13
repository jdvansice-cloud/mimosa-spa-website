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
"[project]/src/content/pages.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Structural bilingual copy for the FY2027 marketing pages.
// Prices/SKUs live in the marketing_offers table (admin-editable); this file
// holds the copy that only changes with a deploy.
__turbopack_context__.s([
    "CLUB_COPY",
    ()=>CLUB_COPY,
    "EMPRESAS_COPY",
    ()=>EMPRESAS_COPY,
    "OCCASIONS",
    ()=>OCCASIONS,
    "PAREJAS_COPY",
    ()=>PAREJAS_COPY,
    "PRIMERA_VISITA_COPY",
    ()=>PRIMERA_VISITA_COPY,
    "REFERIDOS_COPY",
    ()=>REFERIDOS_COPY
]);
const PAREJAS_COPY = {
    heroTitle: {
        es: 'Parejas y Ocasiones',
        en: 'Couples & Occasions'
    },
    heroSubtitle: {
        es: 'Cabinas dobles, rituales para dos y celebraciones que se recuerdan.',
        en: 'Double cabins, rituals for two and celebrations to remember.'
    },
    ritualsTitle: {
        es: 'Rituales en Pareja',
        en: 'Couples Rituals'
    },
    ritualsIntro: {
        es: 'Siete cabinas dobles entre nuestras dos ubicaciones, diseñadas para desconectarse juntos. Reserva por WhatsApp o en línea.',
        en: 'Seven double cabins across our two locations, designed to disconnect together. Book via WhatsApp or online.'
    },
    menuTitle: {
        es: 'Menú de Parejas',
        en: 'Couples Menu'
    },
    occasionsTitle: {
        es: 'Ocasiones Especiales',
        en: 'Special Occasions'
    },
    occasionsIntro: {
        es: 'Cumpleaños, despedidas, celebraciones entre amigas o con mamá: armamos la experiencia completa para tu grupo, con opción de uso privado del spa.',
        en: 'Birthdays, bridal parties, friends day or mom-and-me: we build the full experience for your group, with a private-hire option.'
    },
    groupFormTitle: {
        es: 'Cuéntanos sobre tu ocasión',
        en: 'Tell us about your occasion'
    },
    groupFormIntro: {
        es: 'Déjanos tus datos y coordinamos fecha, cabinas y detalles por WhatsApp.',
        en: 'Leave your details and we will coordinate date, cabins and details via WhatsApp.'
    },
    giftTitle: {
        es: 'Regala una experiencia',
        en: 'Gift an experience'
    },
    giftBody: {
        es: 'Los rituales en pareja son el regalo favorito para aniversarios y fechas especiales. Pregunta por nuestras gift cards.',
        en: 'Couples rituals are the favorite gift for anniversaries and special dates. Ask about our gift cards.'
    }
};
const OCCASIONS = [
    {
        key: 'cumpleanos',
        name: {
            es: 'Cumpleaños Mimosa',
            en: 'Mimosa Birthday'
        },
        description: {
            es: 'Celebra tu día con masaje, ritual de pies y un brindis — solo o con tus invitados.',
            en: 'Celebrate your day with a massage, foot ritual and a toast — solo or with guests.'
        },
        whatsapp: {
            es: 'Hola, quiero organizar un Cumpleaños Mimosa.',
            en: 'Hi, I would like to organize a Mimosa Birthday.'
        }
    },
    {
        key: 'despedida',
        name: {
            es: 'Despedida de Soltera',
            en: 'Bridal Party'
        },
        description: {
            es: 'De 3 a 8 amigas, cabinas reservadas en bloque y espacio para brindis y fotos.',
            en: '3 to 8 friends, cabins reserved in a block, and space for a toast and photos.'
        },
        whatsapp: {
            es: 'Hola, quiero cotizar una Despedida de Soltera en el spa.',
            en: 'Hi, I would like a quote for a bridal party at the spa.'
        }
    },
    {
        key: 'mama',
        name: {
            es: 'Mamá y Yo',
            en: 'Mom & Me'
        },
        description: {
            es: 'Una tarde para dos generaciones: masajes en cabina doble y té de cortesía.',
            en: 'An afternoon for two generations: massages in a double cabin and complimentary tea.'
        },
        whatsapp: {
            es: 'Hola, quiero reservar una experiencia Mamá y Yo.',
            en: 'Hi, I would like to book a Mom & Me experience.'
        }
    },
    {
        key: 'amigas',
        name: {
            es: 'Amigas Day',
            en: 'Friends Day'
        },
        description: {
            es: 'Plan de spa para tu grupo: masajes, pies y snacks — ideal entre semana.',
            en: 'A spa plan for your group: massages, foot rituals and snacks — perfect on weekdays.'
        },
        whatsapp: {
            es: 'Hola, quiero organizar un Amigas Day.',
            en: 'Hi, I would like to organize a Friends Day.'
        }
    }
];
const EMPRESAS_COPY = {
    heroTitle: {
        es: 'Mimosa para Empresas',
        en: 'Mimosa for Business'
    },
    heroSubtitle: {
        es: 'Bienestar corporativo, regalos ejecutivos y eventos en el spa.',
        en: 'Corporate wellness, executive gifting and in-spa events.'
    },
    giftingTitle: {
        es: 'Regalos corporativos',
        en: 'Corporate gifting'
    },
    giftingBody: {
        es: 'Gift cards y cajas de regalo para clientes y colaboradores — ideales para la temporada de aguinaldo. Pedidos por volumen con facturación.',
        en: 'Gift cards and gift boxes for clients and teams — ideal for the holiday season. Volume orders with invoicing.'
    },
    wellnessTitle: {
        es: 'Bienestar en tu oficina',
        en: 'Wellness at your office'
    },
    wellnessBody: {
        es: 'Jornadas de masaje en silla en tu empresa y códigos de beneficio para tu equipo, con planes mensuales.',
        en: 'Chair-massage days at your company and employee benefit codes, with monthly plans.'
    },
    eventsTitle: {
        es: 'Eventos en el spa',
        en: 'Events at the spa'
    },
    eventsBody: {
        es: 'Reserva el spa para tu equipo o tus clientes: experiencias privadas entre semana en Costa del Este o San Francisco.',
        en: 'Book the spa for your team or clients: private weekday experiences in Costa del Este or San Francisco.'
    },
    formTitle: {
        es: 'Hablemos',
        en: 'Let’s talk'
    },
    formIntro: {
        es: 'Cuéntanos qué necesitas y te enviamos una propuesta en 24–48 horas.',
        en: 'Tell us what you need and we will send a proposal within 24–48 hours.'
    }
};
const CLUB_COPY = {
    heroTitle: {
        es: 'Club Mimosa',
        en: 'Club Mimosa'
    },
    heroSubtitle: {
        es: 'Tu ritual mensual, a precio de miembro. Dos planes, cero complicaciones.',
        en: 'Your monthly ritual at member pricing. Two plans, zero hassle.'
    },
    foundingTitle: {
        es: 'Miembros Fundadores',
        en: 'Founding Members'
    },
    howTitle: {
        es: 'Cómo funciona',
        en: 'How it works'
    },
    how: [
        {
            es: 'Elige tu plan y asegura tu tarifa mensual.',
            en: 'Choose your plan and lock in your monthly rate.'
        },
        {
            es: 'Usa tu crédito cada mes en tu masaje favorito (acumulable 60 días).',
            en: 'Use your monthly credit on your favorite massage (rolls over 60 days).'
        },
        {
            es: 'Disfruta descuentos de miembro en todo lo demás, incluidas gift cards.',
            en: 'Enjoy member discounts on everything else, including gift cards.'
        }
    ],
    vipTitle: {
        es: 'Mimosa Privilege (VIP prepagado)',
        en: 'Mimosa Privilege (prepaid VIP)'
    },
    vipBody: {
        es: 'Nuestra membresía prepagada de siempre sigue disponible como opción VIP y de regalo.',
        en: 'Our classic prepaid membership remains available as the VIP and gifting option.'
    },
    vipCta: {
        es: 'Ver Mimosa Privilege',
        en: 'See Mimosa Privilege'
    },
    waitlistTitle: {
        es: 'Únete a la lista fundadora',
        en: 'Join the founding list'
    },
    waitlistIntro: {
        es: 'Déjanos tus datos y te avisamos apenas abra la venta de los primeros 100 cupos.',
        en: 'Leave your details and we will let you know as soon as the first 100 spots open.'
    }
};
const PRIMERA_VISITA_COPY = {
    heroTitle: {
        es: 'Tu Primera Visita',
        en: 'Your First Visit'
    },
    heroSubtitle: {
        es: 'Empieza tu ritual Mimosa con una experiencia diseñada para conocerte.',
        en: 'Start your Mimosa ritual with an experience designed to welcome you.'
    },
    stepsTitle: {
        es: 'Así de fácil',
        en: 'It’s this easy'
    },
    steps: [
        {
            es: 'Déjanos tu nombre y WhatsApp.',
            en: 'Leave your name and WhatsApp.'
        },
        {
            es: 'Te escribimos para agendar tu primera visita.',
            en: 'We message you to schedule your first visit.'
        },
        {
            es: 'Llega 10 minutos antes y disfruta tu ritual.',
            en: 'Arrive 10 minutes early and enjoy your ritual.'
        }
    ],
    formTitle: {
        es: 'Reclama tu primera visita',
        en: 'Claim your first visit'
    }
};
const REFERIDOS_COPY = {
    heroTitle: {
        es: 'Regala $20, Recibe $20',
        en: 'Give $20, Get $20'
    },
    heroSubtitle: {
        es: 'Muy pronto: comparte Mimosa con alguien que amas y ambos reciben $20 en crédito de spa.',
        en: 'Coming soon: share Mimosa with someone you love and you both receive $20 in spa credit.'
    },
    notifyTitle: {
        es: 'Avísame cuando esté listo',
        en: 'Let me know when it launches'
    },
    notifyIntro: {
        es: 'Déjanos tus datos y serás de los primeros en tener tu enlace de referido.',
        en: 'Leave your details and you will be among the first to get your referral link.'
    }
};
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
"[project]/src/components/marketing/MarketingHero.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketingHero",
    ()=>MarketingHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/site-images.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/RatingBadge.tsx [app-rsc] (ecmascript)");
;
;
;
;
async function MarketingHero({ imageKey, title, subtitle, showRating = true, size = 'default', children }) {
    const image = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getSiteImage"])(imageKey);
    const height = size === 'compact' ? 'min-h-[240px] md:min-h-[300px]' : 'min-h-[320px] md:min-h-[420px]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `relative ${height} flex items-center overflow-hidden`,
        children: [
            image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                src: image,
                alt: "",
                fill: true,
                priority: true,
                className: "object-cover",
                sizes: "100vw"
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/70"
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative container-spa w-full py-16 md:py-20 text-center text-cream",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-gold mb-4",
                        children: "Mimosa Spa Retreat"
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-balance max-w-3xl mx-auto",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 md:mt-5 text-base md:text-lg text-cream/85 max-w-2xl mx-auto leading-relaxed",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    showRating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RatingBadge"], {
                            tone: "light"
                        }, void 0, false, {
                            fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this),
                    children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-7",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                        lineNumber: 62,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/marketing/MarketingHero.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/marketing/MarketingHero.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
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
"[project]/src/components/shared/LeadForm.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadForm",
    ()=>LeadForm
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LeadForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LeadForm() from the server but LeadForm is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shared/LeadForm.tsx <module evaluation>", "LeadForm");
}),
"[project]/src/components/shared/LeadForm.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadForm",
    ()=>LeadForm
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LeadForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LeadForm() from the server but LeadForm is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shared/LeadForm.tsx", "LeadForm");
}),
"[project]/src/components/shared/LeadForm.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/shared/LeadForm.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/shared/LeadForm.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
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
"[project]/src/app/[locale]/empresas/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmpresasPage,
    "generateMetadata",
    ()=>generateMetadata,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.js [app-rsc] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/armchair.js [app-rsc] (ecmascript) <export default as Armchair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$party$2d$popper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PartyPopper$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/party-popper.js [app-rsc] (ecmascript) <export default as PartyPopper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/content/pages.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$MarketingHero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/marketing/MarketingHero.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/marketing/SectionHeader.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/LeadForm.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seo.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const revalidate = 3600;
const L = (locale)=>locale === 'en' ? 'en' : 'es';
async function generateMetadata({ params }) {
    const { locale } = await params;
    const l = L(locale);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildPageMetadata"])({
        locale,
        path: '/empresas',
        title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].heroTitle[l],
        description: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].heroSubtitle[l]
    });
}
async function EmpresasPage({ params }) {
    const { locale } = await params;
    const l = L(locale);
    const blocks = [
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"],
            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].giftingTitle[l],
            body: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].giftingBody[l]
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__["Armchair"],
            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].wellnessTitle[l],
            body: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].wellnessBody[l]
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$party$2d$popper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PartyPopper$3e$__["PartyPopper"],
            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].eventsTitle[l],
            body: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].eventsBody[l]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-cream",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$MarketingHero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MarketingHero"], {
                imageKey: "empresas_banner",
                title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].heroTitle[l],
                subtitle: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].heroSubtitle[l]
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto",
                        children: blocks.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300 p-7",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mb-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(b.icon, {
                                            className: "h-5 w-5 text-gold-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                            lineNumber: 51,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-display text-xl font-semibold text-dark mb-2.5",
                                        children: b.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                        lineNumber: 53,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-dark/70 leading-relaxed",
                                        children: b.body
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, b.title, true, {
                                fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                lineNumber: 46,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section bg-beige",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-2xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl shadow-card p-6 md:p-9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                align: "left",
                                title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].formTitle[l],
                                lede: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPRESAS_COPY"].formIntro[l],
                                className: "mb-6 md:mb-7"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LeadForm"], {
                                source: "empresas",
                                corporate: true,
                                withMessage: true,
                                whatsappFollowUp: l === 'en' ? 'Hi, I just sent a corporate inquiry through the website.' : 'Hola, acabo de enviar una consulta corporativa desde el sitio web.'
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/empresas/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[locale]/empresas/page.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/[locale]/empresas/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/[locale]/empresas/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b062b52._.js.map