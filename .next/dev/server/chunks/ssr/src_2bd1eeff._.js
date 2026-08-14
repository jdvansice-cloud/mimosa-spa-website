module.exports = [
"[project]/src/lib/default-images.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/menu/MenuCategories.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuCategories",
    ()=>MenuCategories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/default-images.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
// Short-key view over the shared fallback map
const DEFAULT_IMAGES = {
    body: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_body_treatments,
    facial: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_facial_treatments,
    packages: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_packages,
    membership: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_membership,
    giftcards: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_giftcards,
    promotions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_promotions
};
function MenuCategories({ locale, categoryImages }) {
    // Build categories with images from database (falling back to defaults)
    const categories = [
        {
            id: 'body',
            titleKey: 'body',
            image: categoryImages.category_body_treatments || DEFAULT_IMAGES.body,
            href: '/menu/corporales'
        },
        {
            id: 'facial',
            titleKey: 'facial',
            image: categoryImages.category_facial_treatments || DEFAULT_IMAGES.facial,
            href: '/menu/faciales'
        },
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FEATURES"].parejas ? [
            {
                id: 'couples',
                titleKey: 'couples',
                image: categoryImages.category_parejas || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$default$2d$images$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_IMAGES"].category_parejas,
                href: '/parejas'
            }
        ] : [],
        {
            id: 'packages',
            titleKey: 'packages',
            image: categoryImages.category_packages || DEFAULT_IMAGES.packages,
            href: '/menu/paquetes'
        },
        {
            id: 'membership',
            titleKey: 'membership',
            image: categoryImages.category_membership || DEFAULT_IMAGES.membership,
            href: '/menu/membresia'
        },
        {
            id: 'giftcards',
            titleKey: 'giftcards',
            image: categoryImages.category_giftcards || DEFAULT_IMAGES.giftcards,
            href: '/menu/giftcards'
        },
        {
            id: 'promotions',
            titleKey: 'promotions',
            image: categoryImages.category_promotions || DEFAULT_IMAGES.promotions,
            href: '/promociones',
            special: true
        }
    ];
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('menu.categories');
    const tNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('navigation');
    const tExtra = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('menu.categoriesExtra');
    const tCommon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])('common');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        children: categories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.5,
                    delay: index * 0.1
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: `/${locale}${category.href}`,
                    className: "group block relative aspect-[4/3] rounded-lg overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: category.image,
                            alt: category.special ? tNav('promotions') : t(category.titleKey),
                            fill: true,
                            className: "object-cover transition-transform duration-700 group-hover:scale-110",
                            sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/MenuCategories.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-dark/40 group-hover:bg-dark/50 transition-colors"
                        }, void 0, false, {
                            fileName: "[project]/src/components/menu/MenuCategories.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex flex-col items-center justify-center text-white p-6",
                            children: [
                                category.special && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-light italic mb-2 text-gold-100",
                                    children: tExtra('promotionsTagline')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/MenuCategories.tsx",
                                    lineNumber: 110,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl md:text-2xl font-display font-semibold text-center mb-4 tracking-wide",
                                    children: category.special ? tExtra('promotionsTitle') : t(category.titleKey).toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/MenuCategories.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center px-6 py-2 bg-warm-gray-500/80 hover:bg-gold hover:text-dark rounded text-sm font-medium transition-all",
                                    children: tCommon('view').toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/menu/MenuCategories.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/menu/MenuCategories.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/menu/MenuCategories.tsx",
                    lineNumber: 91,
                    columnNumber: 11
                }, this)
            }, category.id, false, {
                fileName: "[project]/src/components/menu/MenuCategories.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/menu/MenuCategories.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_2bd1eeff._.js.map