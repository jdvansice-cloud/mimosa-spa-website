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
"[project]/src/lib/offers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OFFERS_TAG",
    ()=>OFFERS_TAG,
    "getOfferByKey",
    ()=>getOfferByKey,
    "getOffersForPage",
    ()=>getOffersForPage,
    "offerBadge",
    ()=>offerBadge,
    "offerDescription",
    ()=>offerDescription,
    "offerIncludes",
    ()=>offerIncludes,
    "offerName",
    ()=>offerName,
    "offerWhatsappText",
    ()=>offerWhatsappText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OFFERS_TAG = 'offers';
const getAllActiveOffers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('marketing_offers').select('*').eq('is_active', true).order('sort_order', {
            ascending: true
        });
        if (error || !data) return [];
        return data;
    } catch  {
        return [];
    }
}, [
    'marketing-offers-active'
], {
    tags: [
        OFFERS_TAG
    ],
    revalidate: 3600
});
async function getOffersForPage(page) {
    const all = await getAllActiveOffers();
    return all.filter((o)=>o.page === page);
}
async function getOfferByKey(key) {
    const all = await getAllActiveOffers();
    return all.find((o)=>o.key === key) ?? null;
}
function offerName(o, locale) {
    return locale === 'en' ? o.name_en : o.name_es;
}
function offerDescription(o, locale) {
    return locale === 'en' ? o.description_en : o.description_es;
}
function offerIncludes(o, locale) {
    return locale === 'en' ? o.includes_en : o.includes_es;
}
function offerWhatsappText(o, locale) {
    return (locale === 'en' ? o.whatsapp_text_en : o.whatsapp_text_es) ?? undefined;
}
function offerBadge(o, locale) {
    return locale === 'en' ? o.badge_en : o.badge_es;
}
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
"[project]/src/lib/booking/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
    [PROGRAM_IDS.TRATAMIENTOS_CORPORALES]: 'Tratamientos Corporales',
    [PROGRAM_IDS.PAQUETES_DELUXE]: 'Paquetes Deluxe',
    [PROGRAM_IDS.TRATAMIENTOS_FACIALES]: 'Tratamientos Faciales',
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
"[project]/src/lib/treatments.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TREATMENTS_TAG",
    ()=>TREATMENTS_TAG,
    "getVisibleTreatments",
    ()=>getVisibleTreatments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TREATMENTS_TAG = 'treatments';
// Cached read of all publicly visible treatments. Source: treatment_settings,
// which the admin flow keeps in sync with Mindbody (names/prices/durations
// stored tax-stripped, exactly what the old client-side menu displayed).
const getAllVisibleTreatments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('treatment_settings').select('mindbody_service_id, service_name, program_id, category, price, duration, description, show_booking_button, is_top_pick, sort_order').eq('is_visible', true).order('sort_order', {
            ascending: true
        }).order('service_name', {
            ascending: true
        });
        if (error || !data) return [];
        return data;
    } catch  {
        return [];
    }
}, [
    'treatments-visible'
], {
    tags: [
        TREATMENTS_TAG
    ],
    revalidate: 3600
});
async function getVisibleTreatments(programIds) {
    const all = await getAllVisibleTreatments();
    const seen = new Set();
    const out = [];
    for (const row of all){
        if (!programIds.includes(row.program_id)) continue;
        if (seen.has(row.service_name)) continue;
        seen.add(row.service_name);
        out.push(row);
    }
    return out;
}
}),
"[project]/src/lib/sanitize.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Conservative HTML cleaner for treatment descriptions (admin/Mindbody-managed
// rich text: <p>, <br>, <b>, <i>, <ul>, <li>...). Strips active content so a
// compromised description can never execute in visitors' browsers.
__turbopack_context__.s([
    "sanitizeDescriptionHtml",
    ()=>sanitizeDescriptionHtml
]);
function sanitizeDescriptionHtml(html) {
    return html// drop script/style/iframe/object/embed blocks entirely
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '').replace(/<(script|style|iframe|object|embed)[^>]*\/?>/gi, '')// drop inline event handlers (onclick=, onerror=, ...)
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '').replace(/\son\w+\s*=\s*'[^']*'/gi, '').replace(/\son\w+\s*=\s*[^\s>]+/gi, '')// neutralize javascript: URLs
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, '$1="#"');
}
}),
"[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingButton",
    ()=>BookingButton
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BookingButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BookingButton() from the server but BookingButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/BookingButton.tsx <module evaluation>", "BookingButton");
}),
"[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingButton",
    ()=>BookingButton
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BookingButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BookingButton() from the server but BookingButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/BookingButton.tsx", "BookingButton");
}),
"[project]/src/components/menu/BookingButton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/menu/BookingButton.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpandableDescription",
    ()=>ExpandableDescription
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ExpandableDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ExpandableDescription() from the server but ExpandableDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/ExpandableDescription.tsx <module evaluation>", "ExpandableDescription");
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpandableDescription",
    ()=>ExpandableDescription
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ExpandableDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ExpandableDescription() from the server but ExpandableDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/menu/ExpandableDescription.tsx", "ExpandableDescription");
}),
"[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppBookingLink",
    ()=>WhatsAppBookingLink
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const WhatsAppBookingLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call WhatsAppBookingLink() from the server but WhatsAppBookingLink is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shared/WhatsAppBookingLink.tsx <module evaluation>", "WhatsAppBookingLink");
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppBookingLink",
    ()=>WhatsAppBookingLink
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const WhatsAppBookingLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call WhatsAppBookingLink() from the server but WhatsAppBookingLink is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shared/WhatsAppBookingLink.tsx", "WhatsAppBookingLink");
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/menu/ServicesListServer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServicesListServer",
    ()=>ServicesListServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-rsc] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-rsc] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getTranslations.js [app-rsc] (ecmascript) <export default as getTranslations>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$treatments$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/treatments.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanitize.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/menu/BookingButton.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/menu/ExpandableDescription.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
// Synthesized shape for the client BookingButton island. The booking page
// re-fetches the service by id, so this only seeds the pre-selection path.
function toMindbodyService(row) {
    return {
        Id: row.mindbody_service_id,
        Name: row.service_name,
        Description: row.description,
        Duration: row.duration ?? 0,
        Price: row.price ?? 0,
        OnlineBooking: row.show_booking_button,
        Category: row.category ?? '',
        ProgramId: row.program_id
    };
}
async function ServicesListServer({ programIds, locale, showTopPicks = true, hideTopPicksFromList = false, onlyTopPicks = false, hideEmptyFallback = false }) {
    const [services, t, tWa] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$treatments$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVisibleTreatments"])(programIds),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__["getTranslations"])({
            locale,
            namespace: 'menu'
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getTranslations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getTranslations$3e$__["getTranslations"])({
            locale,
            namespace: 'whatsapp'
        })
    ]);
    if (services.length === 0) {
        if (onlyTopPicks || hideEmptyFallback) return null;
        // Never a spinner, never blank: a WhatsApp card until the catalog is seeded.
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12 bg-beige-50 rounded-xl space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-warm-gray",
                    children: t('noServices')
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-warm-gray",
                    children: tWa('bookPrompt')
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                    cta: "menu_empty_program"
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    const topPicks = services.filter((s)=>s.is_top_pick);
    const regularServices = hideTopPicksFromList ? services.filter((s)=>!s.is_top_pick) : services;
    const renderServiceCard = (row, isTopPick = false)=>{
        const price = row.price ?? 0;
        const priceLabel = price > 0 ? `$${price.toFixed(0)}` : t('priceOnRequest');
        const service = toMindbodyService(row);
        const safeDescription = row.description ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sanitizeDescriptionHtml"])(row.description) : null;
        const waMessage = locale === 'en' ? `Hi, I would like to book ${row.service_name}${row.duration ? ` (${row.duration} min)` : ''}.` : `Hola, quiero reservar ${row.service_name}${row.duration ? ` (${row.duration} min)` : ''}.`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-white rounded-lg md:rounded-xl border p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in ${isTopPick ? 'border-gold-300 ring-1 ring-gold-200' : 'border-beige-200'}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-2 mb-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 flex-1 min-w-0",
                                children: [
                                    isTopPick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "w-4 h-4 text-gold-500 fill-gold-500 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-dark truncate",
                                        children: row.service_name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    (row.duration ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-warm-gray flex-shrink-0",
                                        children: [
                                            "- ",
                                            row.duration,
                                            " ",
                                            t('duration')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        safeDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ExpandableDescription$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ExpandableDescription"], {
                            html: safeDescription,
                            maxLines: 2,
                            seeMoreText: t('seeMore'),
                            seeLessText: t('seeLess'),
                            className: "mb-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg font-bold text-gold-600",
                                    children: priceLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                                            cta: "menu_card",
                                            message: waMessage,
                                            variant: "link",
                                            className: "text-xs"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this),
                                        row.show_booking_button && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BookingButton"], {
                                            service: service,
                                            locale: locale,
                                            label: t('bookNow'),
                                            className: "inline-flex items-center px-3 py-1.5 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden md:flex md:flex-row md:items-center md:justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        isTopPick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "w-5 h-5 text-gold-500 fill-gold-500 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 141,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-dark",
                                            children: row.service_name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 143,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, this),
                                safeDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-warm-gray-600 leading-relaxed [&_p]:mb-2 [&_br]:hidden",
                                    dangerouslySetInnerHTML: {
                                        __html: safeDescription
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                                        cta: "menu_card",
                                        message: waMessage,
                                        variant: "link",
                                        className: "text-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 flex-shrink-0",
                            children: [
                                (row.duration ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1 text-sm text-warm-gray bg-beige-100 px-3 py-1 rounded-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this),
                                        row.duration,
                                        " ",
                                        t('duration')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold text-gold-600 w-16 text-right",
                                    children: priceLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-24",
                                    children: row.show_booking_button && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$BookingButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BookingButton"], {
                                        service: service,
                                        locale: locale,
                                        label: t('bookNow'),
                                        className: "inline-flex items-center justify-center w-full px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            ]
        }, row.mindbody_service_id, true, {
            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this);
    };
    if (onlyTopPicks) {
        if (topPicks.length === 0) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mb-3 md:mb-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                            className: "w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500"
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg md:text-xl font-semibold text-dark",
                            children: t('topPicks')
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 md:space-y-4",
                    children: topPicks.map((s)=>renderServiceCard(s, true))
                }, void 0, false, {
                    fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                    lineNumber: 193,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/menu/ServicesListServer.tsx",
            lineNumber: 188,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 md:space-y-8",
        children: [
            showTopPicks && topPicks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-3 md:mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                className: "w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500"
                            }, void 0, false, {
                                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg md:text-xl font-semibold text-dark",
                                children: t('topPicks')
                            }, void 0, false, {
                                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 md:space-y-4",
                        children: topPicks.map((s)=>renderServiceCard(s, true))
                    }, void 0, false, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                lineNumber: 203,
                columnNumber: 9
            }, this),
            regularServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    showTopPicks && topPicks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg md:text-xl font-semibold text-dark mb-2 md:mb-4",
                        children: t('allServices')
                    }, void 0, false, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 md:space-y-4",
                        children: regularServices.map((s)=>renderServiceCard(s))
                    }, void 0, false, {
                        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/menu/ServicesListServer.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/menu/ServicesListServer.tsx",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/marketing/OfferCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfferCard",
    ()=>OfferCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-rsc] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/offers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
function OfferCard({ offer, locale, imageUrl, priceSuffix = '', featured = false }) {
    const badge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerBadge"])(offer, locale);
    const includes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerIncludes"])(offer, locale);
    const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerDescription"])(offer, locale);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: `group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${featured ? 'shadow-elevated ring-2 ring-gold' : 'shadow-card hover:shadow-elevated'}`,
        children: [
            imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-[4/3] overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: imageUrl,
                        alt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerName"])(offer, locale),
                        fill: true,
                        className: "object-cover transition-transform duration-700 group-hover:scale-105",
                        sizes: "(max-width: 768px) 100vw, 33vw"
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-3 right-3 text-[11px] font-semibold uppercase tracking-wider bg-gold text-dark rounded-full px-3 py-1 shadow-sm",
                        children: badge
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/marketing/OfferCard.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 md:p-7 flex flex-col flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-baseline justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-display text-xl md:text-2xl font-semibold text-dark text-balance",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerName"])(offer, locale)
                            }, void 0, false, {
                                fileName: "[project]/src/components/marketing/OfferCard.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            !imageUrl && badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold uppercase tracking-wider bg-gold/15 text-gold-700 rounded-full px-3 py-1 whitespace-nowrap",
                                children: badge
                            }, void 0, false, {
                                fileName: "[project]/src/components/marketing/OfferCard.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    offer.price != null && offer.price > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 font-display text-3xl text-gold-600",
                        children: [
                            "$",
                            Number(offer.price).toFixed(0),
                            priceSuffix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-body text-sm font-medium text-warm-gray",
                                children: [
                                    ' ',
                                    priceSuffix
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/marketing/OfferCard.tsx",
                                lineNumber: 75,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-dark/70 leading-relaxed",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    includes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-4 space-y-2 border-t border-beige pt-4",
                        children: includes.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-start gap-2.5 text-sm text-dark/75",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "h-4 w-4 text-gold-600 flex-shrink-0 mt-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                                        lineNumber: 89,
                                        columnNumber: 17
                                    }, this),
                                    item
                                ]
                            }, item, true, {
                                fileName: "[project]/src/components/marketing/OfferCard.tsx",
                                lineNumber: 88,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto pt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                            cta: `offer_${offer.key}`,
                            message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerWhatsappText"])(offer, locale),
                            className: "w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/components/marketing/OfferCard.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/OfferCard.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/marketing/OfferCard.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/marketing/OfferCard.tsx",
        lineNumber: 37,
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
"[project]/src/lib/reviews.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REVIEWS_TAG",
    ()=>REVIEWS_TAG,
    "getActiveReviews",
    ()=>getActiveReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REVIEWS_TAG = 'reviews';
const getActiveReviews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cache"])(async ()=>{
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('site_reviews').select('*').eq('is_active', true).order('sort_order', {
            ascending: true
        });
        if (error || !data) return [];
        return data;
    } catch  {
        return [];
    }
}, [
    'site-reviews-active'
], {
    tags: [
        REVIEWS_TAG
    ],
    revalidate: 3600
});
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsCarousel",
    ()=>ReviewsCarousel
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ReviewsCarousel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ReviewsCarousel() from the server but ReviewsCarousel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/proof/ReviewsCarousel.tsx <module evaluation>", "ReviewsCarousel");
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsCarousel",
    ()=>ReviewsCarousel
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ReviewsCarousel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ReviewsCarousel() from the server but ReviewsCarousel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/proof/ReviewsCarousel.tsx", "ReviewsCarousel");
}),
"[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/proof/ReviewsStrip.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewsStrip",
    ()=>ReviewsStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getLocale$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getLocale$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getLocale.js [app-rsc] (ecmascript) <export default as getLocale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reviews.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/RatingBadge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsCarousel.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function ReviewsStrip({ limit = 3, className = '' }) {
    const [reviews, locale] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveReviews"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getLocale$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getLocale$3e$__["getLocale"])()
    ]);
    const quotes = reviews.filter((r)=>r.kind === 'review');
    if (quotes.length === 0) return null;
    // Deterministic per-day offset (ISR republishes hourly, shifts daily).
    const startOffset = Math.floor(Date.now() / 86_400_000) % quotes.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `py-12 ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container-spa",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$RatingBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RatingBadge"], {}, void 0, false, {
                        fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsCarousel$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReviewsCarousel"], {
                    reviews: quotes,
                    locale: locale,
                    visible: limit,
                    startOffset: startOffset
                }, void 0, false, {
                    fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/proof/ReviewsStrip.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/seo/JsonLd.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Server component: renders a JSON-LD <script> tag.
// Safety: the payload is produced exclusively by JSON.stringify (never raw
// user HTML) and all '<' characters are unicode-escaped, so the content can
// never close the script tag or introduce markup — the standard Next.js
// JSON-LD pattern (https://nextjs.org/docs/app/guides/json-ld).
__turbopack_context__.s([
    "JsonLd",
    ()=>JsonLd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function JsonLd({ data }) {
    const safeJson = JSON.stringify(data).replace(/</g, '\\u003c');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
            __html: safeJson
        }
    }, void 0, false, {
        fileName: "[project]/src/components/seo/JsonLd.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "daySpaNodes",
    ()=>daySpaNodes,
    "serviceListSchema",
    ()=>serviceListSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-rsc] (ecmascript)");
;
// JSON-LD builders. Policy note: LocalBusiness nodes stay strictly factual —
// NO aggregateRating / review sourced from Google (self-serving review markup
// is unsupported by Google and risks a manual action). Proof renders on-page.
function formatTel(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.startsWith('507') ? `+${digits}` : `+507${digits}`;
}
function daySpaNode(loc, settings) {
    return {
        '@type': [
            'DaySpa',
            'LocalBusiness'
        ],
        '@id': `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/#${loc.idSlug}`,
        name: `Mimosa Spa Retreat — ${loc.name}`,
        url: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"],
        telephone: formatTel(loc.phone),
        email: settings.email,
        priceRange: '$$',
        currenciesAccepted: 'USD',
        image: loc.image || `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/og-default.jpg`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: loc.streetAddress,
            addressLocality: 'Ciudad de Panamá',
            addressCountry: 'PA'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: loc.latitude,
            longitude: loc.longitude
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday'
                ],
                opens: settings.weekday_open?.slice(0, 5) || '09:00',
                closes: settings.weekday_close?.slice(0, 5) || '20:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Saturday',
                    'Sunday'
                ],
                opens: settings.weekend_open?.slice(0, 5) || '09:00',
                closes: settings.weekend_close?.slice(0, 5) || '18:00'
            }
        ],
        sameAs: [
            settings.instagram_url,
            settings.facebook_url
        ].filter(Boolean)
    };
}
function daySpaNodes(settings, addresses) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            daySpaNode({
                idSlug: 'costa-del-este',
                name: 'Costa del Este',
                streetAddress: addresses.costaDelEste,
                phone: settings.phone_costa_del_este,
                latitude: 9.022731,
                longitude: -79.46174
            }, settings),
            daySpaNode({
                idSlug: 'san-francisco',
                name: 'San Francisco',
                streetAddress: addresses.sanFrancisco,
                phone: settings.phone_san_francisco,
                latitude: 8.9932791,
                longitude: -79.5054466
            }, settings)
        ]
    };
}
function serviceListSchema(services, pageUrl) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        url: pageUrl,
        itemListElement: services.map((s, i)=>({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'Service',
                    name: s.name,
                    ...s.description ? {
                        description: s.description.replace(/<[^>]*>/g, '').slice(0, 300)
                    } : {},
                    provider: [
                        {
                            '@id': `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/#costa-del-este`
                        },
                        {
                            '@id': `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/#san-francisco`
                        }
                    ],
                    ...s.price && s.price > 0 ? {
                        offers: {
                            '@type': 'Offer',
                            price: s.price.toFixed(2),
                            priceCurrency: 'USD'
                        }
                    } : {}
                }
            }))
    };
}
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
"[project]/src/app/[locale]/parejas/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ParejasPage,
    "generateMetadata",
    ()=>generateMetadata,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.js [app-rsc] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/content/pages.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/offers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/site-images.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ServicesListServer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/menu/ServicesListServer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$OfferCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/marketing/OfferCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/marketing/SectionHeader.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$MarketingHero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/marketing/MarketingHero.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/LeadForm.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsStrip$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/proof/ReviewsStrip.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$seo$2f$JsonLd$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/seo/JsonLd.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seo.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
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
        path: '/parejas',
        title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].heroTitle[l],
        description: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].heroSubtitle[l]
    });
}
async function ParejasPage({ params }) {
    const { locale } = await params;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].parejas) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/${locale}/menu`);
    const l = L(locale);
    const offers = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOffersForPage"])('parejas');
    const images = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getSiteImages"])(offers.map((o)=>o.image_key || '').filter(Boolean));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-cream",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$seo$2f$JsonLd$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["JsonLd"], {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serviceListSchema"])(offers.map((o)=>({
                        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["offerName"])(o, locale),
                        description: o.description_es,
                        price: o.price
                    })), `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/${locale}/parejas`)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$MarketingHero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MarketingHero"], {
                imageKey: "parejas_banner",
                title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].heroTitle[l],
                subtitle: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].heroSubtitle[l]
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                            eyebrow: l === 'en' ? 'For two' : 'Para dos',
                            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].ritualsTitle[l],
                            lede: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].ritualsIntro[l]
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto",
                            children: offers.map((offer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$OfferCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OfferCard"], {
                                    offer: offer,
                                    locale: locale,
                                    imageUrl: offer.image_key ? images[offer.image_key] : undefined,
                                    featured: !!offer.badge_es
                                }, offer.id, false, {
                                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section bg-beige",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-5xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                            eyebrow: l === 'en' ? 'Classics' : 'Clásicos',
                            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].menuTitle[l]
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$menu$2f$ServicesListServer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ServicesListServer"], {
                            programIds: [
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].TRATAMIENTOS_PAREJAS,
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROGRAM_IDS"].PAREJAS
                            ],
                            locale: locale,
                            showTopPicks: false
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                            eyebrow: l === 'en' ? 'Celebrate' : 'Celebra',
                            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].occasionsTitle[l],
                            lede: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].occasionsIntro[l]
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OCCASIONS"].map((occ)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300 p-6 md:p-7 flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-display text-xl font-semibold text-dark mb-2",
                                            children: occ.name[l]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-dark/70 leading-relaxed mb-5 flex-1",
                                            children: occ.description[l]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                            lineNumber: 116,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                                            cta: `occasion_${occ.key}`,
                                            message: occ.whatsapp[l]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, occ.key, true, {
                                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-2xl mx-auto mt-14 bg-white rounded-2xl shadow-card p-6 md:p-9",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                    align: "left",
                                    title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].groupFormTitle[l],
                                    lede: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].groupFormIntro[l],
                                    className: "mb-6 md:mb-7"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$LeadForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LeadForm"], {
                                    source: "parejas-grupo",
                                    withMessage: true,
                                    whatsappFollowUp: l === 'en' ? 'Hi, I just sent my details about a group occasion.' : 'Hola, acabo de enviar mis datos sobre una ocasión en grupo.'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section bg-dark",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-2xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"], {
                                className: "h-6 w-6 text-gold"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$marketing$2f$SectionHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeader"], {
                            tone: "light",
                            title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].giftTitle[l],
                            lede: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$content$2f$pages$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PAREJAS_COPY"].giftBody[l],
                            className: "mb-7"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GIFT_CARDS_PATH"]}`,
                            className: "btn-primary inline-flex",
                            children: "Gift Cards"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$proof$2f$ReviewsStrip$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReviewsStrip"], {}, void 0, false, {
                fileName: "[project]/src/app/[locale]/parejas/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[locale]/parejas/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/[locale]/parejas/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/[locale]/parejas/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5443cec6._.js.map