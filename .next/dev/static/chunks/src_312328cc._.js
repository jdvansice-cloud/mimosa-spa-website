(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Combines class names with Tailwind CSS conflict resolution
 */ __turbopack_context__.s([
    "cn",
    ()=>cn,
    "debounce",
    ()=>debounce,
    "formatDate",
    ()=>formatDate,
    "formatDuration",
    ()=>formatDuration,
    "formatPrice",
    ()=>formatPrice,
    "generateId",
    ()=>generateId,
    "getInitials",
    ()=>getInitials,
    "getLocalizedContent",
    ()=>getLocalizedContent,
    "getWhatsAppUrl",
    ()=>getWhatsAppUrl,
    "isPromotionValid",
    ()=>isPromotionValid,
    "truncateText",
    ()=>truncateText
]);
function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}
function formatDuration(minutes, locale = 'es') {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (locale === 'es') {
        if (remainingMinutes === 0) {
            return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        }
        return `${hours}h ${remainingMinutes}min`;
    }
    if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    return `${hours}h ${remainingMinutes}min`;
}
function formatDate(date, locale = 'es') {
    // Parse date strings as local dates (not UTC) to avoid timezone shift
    // e.g. "2026-04-01" should display as April 1, not March 31
    let d;
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-').map(Number);
        d = new Date(year, month - 1, day);
    } else {
        d = typeof date === 'string' ? new Date(date) : date;
    }
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-PA' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(d);
}
function getLocalizedContent(obj, field, locale) {
    const localizedField = `${field}_${locale}`;
    const fallbackField = `${field}_es`;
    const record = obj;
    return record[localizedField] || record[fallbackField] || '';
}
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}
function getWhatsAppUrl(phoneNumber, message) {
    const baseUrl = 'https://wa.me/';
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (message) {
        return `${baseUrl}${cleanNumber}?text=${encodeURIComponent(message)}`;
    }
    return `${baseUrl}${cleanNumber}`;
}
function isPromotionValid(validFrom, validUntil) {
    const now = new Date();
    const from = new Date(validFrom);
    const until = new Date(validUntil);
    return now >= from && now <= until;
}
function getInitials(name) {
    return name.split(' ').map((word)=>word[0]).join('').toUpperCase().slice(0, 2);
}
function debounce(func, wait) {
    let timeout = null;
    return (...args)=>{
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(()=>func(...args), wait);
    };
}
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/nav.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
'use client';
;
;
;
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref)=>{
    const baseStyles = `
      inline-flex items-center justify-center font-semibold
      rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;
    const variants = {
        primary: `
        bg-gold text-dark
        hover:bg-gold-600 active:bg-gold-700
        focus:ring-gold-500
        shadow-sm hover:shadow-md
      `,
        secondary: `
        bg-transparent text-dark
        border-2 border-dark
        hover:bg-dark hover:text-cream
        focus:ring-dark
      `,
        ghost: `
        bg-transparent text-dark
        hover:bg-beige
        focus:ring-beige-400
      `,
        outline: `
        bg-transparent text-gold-600
        border-2 border-gold
        hover:bg-gold hover:text-dark
        focus:ring-gold-500
      `
    };
    const sizes = {
        sm: 'px-4 py-2 text-sm gap-1.5',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-2.5'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], sizes[size], className),
        disabled: disabled || isLoading,
        ...props,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin h-5 w-5",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Button.tsx",
                            lineNumber: 88,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Button.tsx",
                            lineNumber: 96,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 82,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Cargando..."
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 102,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex-shrink-0",
                    children: leftIcon
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 106,
                    columnNumber: 26
                }, ("TURBOPACK compile-time value", void 0)),
                children,
                rightIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex-shrink-0",
                    children: rightIcon
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 108,
                    columnNumber: 27
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Button.tsx",
        lineNumber: 69,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardImage",
    ()=>CardImage,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Card({ className, variant = 'default', padding = 'md', hover = false, children, ...props }) {
    const variants = {
        default: 'bg-white shadow-card',
        elevated: 'bg-white shadow-elevated',
        outline: 'bg-white border border-beige-300'
    };
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-2xl overflow-hidden transition-all duration-300', variants[variant], paddings[padding], hover && 'hover:shadow-elevated hover:-translate-y-1', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mb-4', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, as: Component = 'h3', children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-xl font-display font-semibold text-dark', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-warm-gray text-sm mt-1', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardContent({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_c4 = CardContent;
function CardFooter({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-4 pt-4 border-t border-beige-200 flex items-center', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c5 = CardFooter;
function CardImage({ src, alt, className, aspectRatio = 'video', overlay = false }) {
    const aspects = {
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[21/9]'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative overflow-hidden', aspects[aspectRatio]),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: src,
                alt: alt,
                fill: true,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('object-cover transition-transform duration-500', 'group-hover:scale-105', className),
                sizes: "(max-width: 768px) 100vw, 50vw"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Card.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            overlay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Card.tsx",
                lineNumber: 151,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_c6 = CardImage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardContent");
__turbopack_context__.k.register(_c5, "CardFooter");
__turbopack_context__.k.register(_c6, "CardImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Spinner",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
'use client';
;
;
function Spinner({ size = 'md', className }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center justify-center', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('animate-spin text-gold', sizes[size]),
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Spinner.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Spinner.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/Spinner.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Spinner.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Modal",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, closeOnOverlayClick = true, className }) {
    _s();
    const handleEscape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Modal.useCallback[handleEscape]": (event)=>{
            if (event.key === 'Escape') {
                onClose();
            }
        }
    }["Modal.useCallback[handleEscape]"], [
        onClose
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                document.addEventListener('keydown', handleEscape);
                document.body.style.overflow = 'hidden';
            }
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleEscape);
                    document.body.style.overflow = 'unset';
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        handleEscape
    ]);
    if (!isOpen) return null;
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl'
    };
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": title ? 'modal-title' : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in",
                onClick: closeOnOverlayClick ? onClose : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Modal.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative w-full bg-white rounded-2xl shadow-elevated', 'animate-scale-in flex flex-col', 'max-h-[90vh] my-auto', sizes[size], className),
                children: [
                    (title || showCloseButton) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-6 border-b border-beige-200 flex-shrink-0",
                        children: [
                            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                id: "modal-title",
                                className: "text-2xl font-display font-semibold text-dark",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Modal.tsx",
                                lineNumber: 87,
                                columnNumber: 15
                            }, this),
                            showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-2 rounded-full hover:bg-beige-200 transition-colors ml-auto",
                                "aria-label": "Cerrar",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-5 w-5 text-warm-gray"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Modal.tsx",
                                    lineNumber: 100,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Modal.tsx",
                                lineNumber: 95,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/Modal.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-6 overflow-y-auto flex-1', !title && !showCloseButton && 'pt-6'),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Modal.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Modal.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Modal.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
    // Use portal to render modal at document body level
    if ("TURBOPACK compile-time truthy", 1) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body);
    }
    //TURBOPACK unreachable
    ;
}
_s(Modal, "siZ+Xj7QrGNuK36tf4rJ1SXDsPQ=");
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/LanguageSwitcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageSwitcher",
    ()=>LanguageSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const languages = [
    {
        code: 'es',
        label: 'Español',
        flag: '🇵🇦'
    },
    {
        code: 'en',
        label: 'English',
        flag: '🇺🇸'
    }
];
function LanguageSwitcher({ className, variant = 'default' }) {
    _s();
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const handleLanguageChange = (newLocale)=>{
        // Replace the current locale in the pathname with the new one
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
    };
    if (variant === 'compact') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-1', className),
            children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handleLanguageChange(lang.code),
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-2 py-1 text-sm rounded transition-colors', locale === lang.code ? 'bg-gold text-dark font-semibold' : 'text-warm-gray hover:text-dark hover:bg-beige'),
                    "aria-label": `Switch to ${lang.label}`,
                    "aria-current": locale === lang.code ? 'true' : undefined,
                    children: lang.code.toUpperCase()
                }, lang.code, false, {
                    fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                    lineNumber: 36,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this);
    }
    if (variant === 'dark') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative group', className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream/10 transition-colors",
                    "aria-label": "Select language",
                    "aria-haspopup": "listbox",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "h-4 w-4 text-cream/70"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-cream/90",
                            children: [
                                languages.find((l)=>l.code === locale)?.flag,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-1",
                                    children: languages.find((l)=>l.code === locale)?.code.toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute right-0 top-full mt-1 py-1 w-32', 'bg-dark rounded-lg shadow-elevated border border-cream/20', 'opacity-0 invisible group-hover:opacity-100 group-hover:visible', 'transition-all duration-200'),
                    role: "listbox",
                    children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleLanguageChange(lang.code),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full px-3 py-2 text-left text-sm flex items-center gap-2', 'transition-colors hover:bg-cream/10 text-cream/90', locale === lang.code && 'bg-gold/20 text-gold font-medium'),
                            role: "option",
                            "aria-selected": locale === lang.code,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: lang.flag
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: lang.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, lang.code, true, {
                            fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative group', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-beige transition-colors",
                "aria-label": "Select language",
                "aria-haspopup": "listbox",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                        className: "h-4 w-4 text-warm-gray"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: [
                            languages.find((l)=>l.code === locale)?.flag,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1",
                                children: languages.find((l)=>l.code === locale)?.code.toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute right-0 top-full mt-1 py-1 w-32', 'bg-white rounded-lg shadow-elevated border border-beige-200', 'opacity-0 invisible group-hover:opacity-100 group-hover:visible', 'transition-all duration-200'),
                role: "listbox",
                children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleLanguageChange(lang.code),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full px-3 py-2 text-left text-sm flex items-center gap-2', 'transition-colors hover:bg-beige', locale === lang.code && 'bg-gold/10 text-dark font-medium'),
                        role: "option",
                        "aria-selected": locale === lang.code,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: lang.flag
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: lang.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        ]
                    }, lang.code, true, {
                        fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/LanguageSwitcher.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "E8jaVxu5mdwpzK8S3eb/MqBQLUE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = LanguageSwitcher;
var _c;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/OtpInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OtpInput",
    ()=>OtpInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function OtpInput({ length = 6, onComplete, disabled = false, error = false }) {
    _s();
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Array(length).fill(''));
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OtpInput.useEffect": ()=>{
            inputRefs.current[0]?.focus();
        }
    }["OtpInput.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OtpInput.useEffect": ()=>{
            if (error) {
                setValues(Array(length).fill(''));
                inputRefs.current[0]?.focus();
            }
        }
    }["OtpInput.useEffect"], [
        error,
        length
    ]);
    const handleChange = (index, value)=>{
        const digit = value.replace(/\D/g, '').slice(-1);
        const newValues = [
            ...values
        ];
        newValues[index] = digit;
        setValues(newValues);
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        const code = newValues.join('');
        if (code.length === length && newValues.every((v)=>v !== '')) {
            onComplete(code);
        }
    };
    const handleKeyDown = (index, e)=>{
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handlePaste = (e)=>{
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (pasted) {
            const newValues = Array(length).fill('');
            pasted.split('').forEach((char, i)=>{
                newValues[i] = char;
            });
            setValues(newValues);
            const nextIndex = Math.min(pasted.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
            if (pasted.length === length) {
                onComplete(pasted);
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2 justify-center",
        children: values.map((val, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: (el)=>{
                    inputRefs.current[i] = el;
                },
                type: "text",
                inputMode: "numeric",
                maxLength: 1,
                value: val,
                onChange: (e)=>handleChange(i, e.target.value),
                onKeyDown: (e)=>handleKeyDown(i, e),
                onPaste: handlePaste,
                disabled: disabled,
                className: `w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                     transition-all disabled:opacity-50
                     ${error ? 'border-red-300 bg-red-50' : 'border-beige-200 bg-white'}`
            }, i, false, {
                fileName: "[project]/src/components/ui/OtpInput.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/OtpInput.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(OtpInput, "/Qgi+KGDDGefSL42HtVJaVIe0Bc=");
_c = OtpInput;
var _c;
__turbopack_context__.k.register(_c, "OtpInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LanguageSwitcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OtpInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OtpInput.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/portal/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectClient",
    ()=>selectClient,
    "selectIsAuthenticated",
    ()=>selectIsAuthenticated,
    "selectMindbodyClientId",
    ()=>selectMindbodyClientId,
    "selectPurchases",
    ()=>selectPurchases,
    "selectSession",
    ()=>selectSession,
    "selectUpcomingAppointments",
    ()=>selectUpcomingAppointments,
    "selectUser",
    ()=>selectUser,
    "selectVisits",
    ()=>selectVisits,
    "usePortalData",
    ()=>usePortalData,
    "usePortalStore",
    ()=>usePortalStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const usePortalStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        // Initial state
        user: null,
        session: null,
        client: null,
        mindbodyClientId: null,
        visits: [],
        purchases: [],
        upcomingAppointments: [],
        isLoading: false,
        isInitialized: false,
        error: null,
        activeTab: 'dashboard',
        // Actions
        setAuth: (user, session)=>set({
                user,
                session,
                error: null
            }),
        setMindbodyClient: (client, clientId)=>set({
                client,
                mindbodyClientId: clientId
            }),
        logout: ()=>set({
                user: null,
                session: null,
                client: null,
                mindbodyClientId: null,
                visits: [],
                purchases: [],
                upcomingAppointments: [],
                error: null,
                activeTab: 'dashboard'
            }),
        setVisits: (visits)=>set({
                visits
            }),
        setPurchases: (purchases)=>set({
                purchases
            }),
        setUpcomingAppointments: (appointments)=>set({
                upcomingAppointments: appointments
            }),
        setLoading: (loading)=>set({
                isLoading: loading
            }),
        setInitialized: (initialized)=>set({
                isInitialized: initialized
            }),
        setError: (error)=>set({
                error
            }),
        setActiveTab: (tab)=>set({
                activeTab: tab
            }),
        clearData: ()=>set({
                visits: [],
                purchases: [],
                upcomingAppointments: []
            })
    }), {
    name: 'mimosa-portal-storage',
    partialize: (state)=>({
            mindbodyClientId: state.mindbodyClientId,
            client: state.client
        })
}));
const selectUser = (state)=>state.user;
const selectSession = (state)=>state.session;
const selectClient = (state)=>state.client;
const selectMindbodyClientId = (state)=>state.mindbodyClientId;
const selectVisits = (state)=>state.visits;
const selectPurchases = (state)=>state.purchases;
const selectUpcomingAppointments = (state)=>state.upcomingAppointments;
const selectIsAuthenticated = (state)=>!!state.session;
function usePortalData() {
    _s();
    const { mindbodyClientId, setVisits, setPurchases, setUpcomingAppointments, setLoading, setError } = usePortalStore();
    const fetchAllData = async ()=>{
        if (!mindbodyClientId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=all`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al cargar datos');
            }
            if (data.visits) setVisits(data.visits.visits || []);
            if (data.purchases) setPurchases(data.purchases.purchases || []);
            if (data.upcoming) setUpcomingAppointments(data.upcoming.visits || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally{
            setLoading(false);
        }
    };
    const fetchVisits = async ()=>{
        if (!mindbodyClientId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=visits`);
            const data = await response.json();
            if (data.visits) setVisits(data.visits.visits || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
        } finally{
            setLoading(false);
        }
    };
    const fetchPurchases = async ()=>{
        if (!mindbodyClientId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=purchases`);
            const data = await response.json();
            if (data.purchases) setPurchases(data.purchases.purchases || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
        } finally{
            setLoading(false);
        }
    };
    const fetchUpcoming = async ()=>{
        if (!mindbodyClientId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/portal/history?clientId=${mindbodyClientId}&type=upcoming`);
            const data = await response.json();
            if (data.upcoming) setUpcomingAppointments(data.upcoming.visits || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
        } finally{
            setLoading(false);
        }
    };
    return {
        fetchAllData,
        fetchVisits,
        fetchPurchases,
        fetchUpcoming
    };
}
_s(usePortalData, "9fDYChUpYhODrgner0b8iMEZ2Lg=", false, function() {
    return [
        usePortalStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/booking/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/booking/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CART_TTL_HOURS",
    ()=>CART_TTL_HOURS,
    "normalizeStep",
    ()=>normalizeStep,
    "selectCanProceed",
    ()=>selectCanProceed,
    "selectCurrentStepNumber",
    ()=>selectCurrentStepNumber,
    "selectHasServices",
    ()=>selectHasServices,
    "selectTotalDuration",
    ()=>selectTotalDuration,
    "useBookingStore",
    ()=>useBookingStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-client] (ecmascript)");
;
;
;
// Use the shared tax rate constant
const ITBM_RATE = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ITBM_TAX_RATE"];
// ===========================================
// INITIAL STATE
// ===========================================
const initialState = {
    // Progress
    currentStep: 'services',
    isLoading: false,
    error: null,
    slotConflictNotice: null,
    // Client
    clientIdentifier: '',
    identifierType: null,
    clientId: null,
    clientInfo: null,
    // Multiple Clients
    availableClients: [],
    showClientSelector: false,
    // Location
    selectedLocation: null,
    // Services
    selectedServices: [],
    selectedAddons: [],
    // Staff
    selectedStaff: null,
    // Schedule
    selectedDate: null,
    selectedTime: null,
    // Promotion
    activePromotion: null,
    // Available Data
    locations: [],
    services: [],
    addons: [],
    staff: [],
    availableDates: [],
    availableSlots: [],
    // Result
    bookingConfirmation: null,
    replaceAppointmentId: null,
    replaceBookingDetails: null,
    globalDiscountPercent: 0,
    globalDiscountActive: false,
    // Pricing
    pricing: null,
    // Cart UI
    isCartOpen: false,
    // Add-ons prompt
    addonsPromptOpen: false,
    addonsPromptDismissed: false
};
// ===========================================
// HELPER FUNCTIONS
// ===========================================
// P2 collapse: 4 visible screens. Location is a pill inside services,
// add-ons are an inline section there too, and the therapist picker lives on
// the date/time screen. Auth stays LAST (identity only needed at POST /book).
// The removed step names ('location'/'addons'/'staff') remain in the
// BookingStep type for persisted-cart migration only.
const STEP_ORDER = [
    'services',
    'datetime',
    'auth',
    'confirm',
    'success'
];
function normalizeStep(step) {
    if (step === 'location' || step === 'addons') return 'services';
    if (step === 'staff') return 'datetime';
    return step;
}
function getNextStep(currentStep) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    return currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : currentStep;
}
function getPrevStep(currentStep) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : currentStep;
}
function getStepByNumber(stepNumber) {
    return STEP_ORDER[stepNumber - 1] || 'services';
}
function calculateTotalDuration(services, addons) {
    const serviceDuration = services.reduce((sum, s)=>sum + s.Duration, 0);
    const addonDuration = addons.reduce((sum, a)=>sum + a.Duration, 0);
    return serviceDuration + addonDuration;
}
const CART_TTL_HOURS = 3;
const expiringSessionStorage = {
    getItem: (name)=>{
        try {
            const raw = sessionStorage.getItem(name);
            if (!raw) return null;
            const savedAt = JSON.parse(raw)?.state?.cartSavedAt;
            if (typeof savedAt === 'number' && Date.now() - savedAt > CART_TTL_HOURS * 3600 * 1000) {
                sessionStorage.removeItem(name);
                return null;
            }
            return raw;
        } catch  {
            return null;
        }
    },
    setItem: (name, value)=>{
        try {
            sessionStorage.setItem(name, value);
        } catch  {}
    },
    removeItem: (name)=>{
        try {
            sessionStorage.removeItem(name);
        } catch  {}
    }
};
const useBookingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...initialState,
        // ===========================================
        // NAVIGATION ACTIONS
        // ===========================================
        setStep: (step)=>set({
                currentStep: normalizeStep(step)
            }, false, 'setStep'),
        nextStep: ()=>set((state)=>({
                    currentStep: getNextStep(state.currentStep),
                    error: null
                }), false, 'nextStep'),
        prevStep: ()=>set((state)=>({
                    currentStep: getPrevStep(state.currentStep),
                    error: null
                }), false, 'prevStep'),
        goToStep: (stepNumber)=>set({
                currentStep: getStepByNumber(stepNumber),
                error: null
            }, false, 'goToStep'),
        // ===========================================
        // LOADING & ERROR ACTIONS
        // ===========================================
        setLoading: (loading)=>set({
                isLoading: loading
            }, false, 'setLoading'),
        setError: (error)=>set({
                error,
                isLoading: false
            }, false, 'setError'),
        clearError: ()=>set({
                error: null
            }, false, 'clearError'),
        setSlotConflictNotice: (notice)=>set({
                slotConflictNotice: notice
            }, false, 'setSlotConflictNotice'),
        // ===========================================
        // AUTH ACTIONS
        // ===========================================
        setClientIdentifier: (identifier)=>{
            const isEmail = identifier.includes('@');
            const isPhone = /^[\d\s\-\+\(\)]+$/.test(identifier.replace(/\s/g, ''));
            set({
                clientIdentifier: identifier,
                identifierType: isEmail ? 'email' : isPhone ? 'phone' : null
            }, false, 'setClientIdentifier');
        },
        setClientInfo: (client)=>set({
                clientId: client.Id,
                clientInfo: client,
                showClientSelector: false,
                availableClients: []
            }, false, 'setClientInfo'),
        setAvailableClients: (clients)=>set({
                availableClients: clients,
                showClientSelector: clients.length > 1
            }, false, 'setAvailableClients'),
        selectClient: (client)=>{
            set({
                clientId: client.Id,
                clientInfo: client,
                showClientSelector: false,
                availableClients: []
            }, false, 'selectClient');
            // Auto-advance to next step
            get().nextStep();
        },
        showClientSelectorModal: (show)=>set({
                showClientSelector: show
            }, false, 'showClientSelectorModal'),
        clearClientSelection: ()=>set({
                clientId: null,
                clientInfo: null,
                clientIdentifier: '',
                identifierType: null,
                availableClients: [],
                showClientSelector: false
            }, false, 'clearClientSelection'),
        // ===========================================
        // LOCATION ACTIONS
        // ===========================================
        setLocation: (location)=>{
            // Clear staff, dates, and slots when location changes (they're location-specific)
            set({
                selectedLocation: location,
                services: [],
                addons: [],
                staff: [],
                selectedStaff: null,
                availableDates: [],
                availableSlots: [],
                selectedDate: null,
                selectedTime: null
            }, false, 'setLocation');
        },
        setLocations: (locations)=>set({
                locations
            }, false, 'setLocations'),
        // ===========================================
        // SERVICES ACTIONS
        // ===========================================
        addService: (service)=>set((state)=>{
                // Check if already added
                if (state.selectedServices.some((s)=>s.Id === service.Id)) {
                    return state;
                }
                const newServices = [
                    ...state.selectedServices,
                    service
                ];
                return {
                    selectedServices: newServices,
                    pricing: null
                };
            }, false, 'addService'),
        removeService: (serviceId)=>set((state)=>({
                    selectedServices: state.selectedServices.filter((s)=>s.Id !== serviceId),
                    pricing: null
                }), false, 'removeService'),
        clearServices: ()=>set({
                selectedServices: [],
                pricing: null
            }, false, 'clearServices'),
        setServices: (services)=>set({
                services
            }, false, 'setServices'),
        // ===========================================
        // ADDONS ACTIONS
        // ===========================================
        addAddon: (addon)=>set((state)=>{
                if (state.selectedAddons.some((a)=>a.Id === addon.Id)) {
                    return state;
                }
                return {
                    selectedAddons: [
                        ...state.selectedAddons,
                        addon
                    ],
                    pricing: null
                };
            }, false, 'addAddon'),
        removeAddon: (addonId)=>set((state)=>({
                    selectedAddons: state.selectedAddons.filter((a)=>a.Id !== addonId),
                    pricing: null
                }), false, 'removeAddon'),
        clearAddons: ()=>set({
                selectedAddons: [],
                pricing: null
            }, false, 'clearAddons'),
        setAddons: (addons)=>set({
                addons
            }, false, 'setAddons'),
        // ===========================================
        // STAFF ACTIONS
        // ===========================================
        setStaff: (staff)=>set({
                selectedStaff: staff
            }, false, 'setStaff'),
        setStaffList: (staff)=>set({
                staff
            }, false, 'setStaffList'),
        // ===========================================
        // SCHEDULE ACTIONS
        // ===========================================
        setDate: (date)=>set({
                selectedDate: date,
                selectedTime: null,
                availableSlots: [],
                // Clear staff selection when date changes (staff availability depends on date/time)
                selectedStaff: null,
                staff: []
            }, false, 'setDate'),
        setTime: (time)=>set({
                selectedTime: time,
                // Clear staff selection when time changes (staff availability depends on date/time)
                selectedStaff: null,
                staff: []
            }, false, 'setTime'),
        setAvailableDates: (dates)=>set({
                availableDates: dates
            }, false, 'setAvailableDates'),
        setAvailableSlots: (slots)=>set({
                availableSlots: slots
            }, false, 'setAvailableSlots'),
        // ===========================================
        // PROMOTION ACTIONS
        // ===========================================
        loadPromotion: (promotion)=>{
            const state = get();
            const promotionServices = promotion.services || [];
            // Check if user has manually selected services that will be replaced
            const hadPreviousServices = state.selectedServices.length > 0;
            const isReplacingServices = hadPreviousServices && !state.activePromotion && // Only warn if not already using a promotion
            promotionServices.length > 0;
            // Log warning for debugging (in production, this could trigger a toast notification)
            if (isReplacingServices) {
                console.warn('Promotion is replacing manually selected services:', {
                    previousServices: state.selectedServices.map((s)=>s.Name),
                    promotionServices: promotionServices.map((s)=>s.Name)
                });
            }
            set({
                activePromotion: promotion,
                selectedServices: promotionServices,
                selectedAddons: [],
                pricing: null,
                // Stay on services — add-ons are an inline section there now
                currentStep: 'services'
            }, false, 'loadPromotion');
        },
        clearPromotion: ()=>{
            const state = get();
            // Log when clearing promotion
            if (state.activePromotion) {
                console.log('Clearing promotion:', state.activePromotion.title_es);
            }
            set({
                activePromotion: null,
                selectedServices: [],
                selectedAddons: [],
                pricing: null
            }, false, 'clearPromotion');
        },
        // ===========================================
        // BOOKING ACTIONS
        // ===========================================
        setBookingConfirmation: (confirmation)=>set({
                bookingConfirmation: confirmation,
                currentStep: 'success'
            }, false, 'setBookingConfirmation'),
        setReplaceAppointmentId: (id)=>set({
                replaceAppointmentId: id
            }, false, 'setReplaceAppointmentId'),
        setReplaceBookingDetails: (details)=>set({
                replaceBookingDetails: details
            }, false, 'setReplaceBookingDetails'),
        setGlobalDiscount: (percent, active)=>set({
                globalDiscountPercent: percent,
                globalDiscountActive: active
            }, false, 'setGlobalDiscount'),
        // ===========================================
        // PRICING CALCULATION
        // ===========================================
        calculatePricing: ()=>{
            const state = get();
            // Calculate service prices
            const servicesSubtotal = state.selectedServices.reduce((sum, s)=>sum + s.Price, 0);
            // Calculate addon prices
            const addonsSubtotal = state.selectedAddons.reduce((sum, a)=>sum + a.Price, 0);
            // Check for promotion
            const hasPromotion = state.activePromotion !== null;
            let promotionDiscount = 0;
            let finalServicesPrice = servicesSubtotal;
            if (hasPromotion && state.activePromotion) {
                finalServicesPrice = state.activePromotion.price;
                promotionDiscount = servicesSubtotal - finalServicesPrice;
            }
            // Apply global online discount when no promotion is active
            const hasGlobalDiscount = !hasPromotion && state.globalDiscountActive && state.globalDiscountPercent > 0;
            let globalDiscountAmount = 0;
            if (hasGlobalDiscount) {
                globalDiscountAmount = Math.round(finalServicesPrice * (state.globalDiscountPercent / 100) * 100) / 100;
                finalServicesPrice = Math.round((finalServicesPrice - globalDiscountAmount) * 100) / 100;
            }
            // Calculate subtotal before tax
            const subtotalBeforeTax = finalServicesPrice + addonsSubtotal;
            // Calculate ITBM (7%)
            const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100;
            // Calculate total with tax
            const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100;
            const pricing = {
                services: state.selectedServices,
                addons: state.selectedAddons,
                servicesSubtotal,
                addonsSubtotal,
                hasPromotion,
                promotionName: state.activePromotion?.title_es || null,
                promotionPrice: hasPromotion ? state.activePromotion.price : null,
                promotionDiscount,
                hasGlobalDiscount,
                globalDiscountPercent: state.globalDiscountPercent,
                globalDiscountAmount,
                subtotalBeforeTax,
                itbmRate: ITBM_RATE,
                itbmAmount,
                totalWithTax,
                totalDuration: calculateTotalDuration(state.selectedServices, state.selectedAddons)
            };
            // Return computed pricing (don't set state to avoid re-render loops)
            return pricing;
        },
        // ===========================================
        // CART UI ACTIONS
        // ===========================================
        openCart: ()=>set({
                isCartOpen: true
            }, false, 'openCart'),
        closeCart: ()=>set({
                isCartOpen: false
            }, false, 'closeCart'),
        toggleCart: ()=>set((state)=>({
                    isCartOpen: !state.isCartOpen
                }), false, 'toggleCart'),
        openAddonsPrompt: ()=>set({
                addonsPromptOpen: true
            }, false, 'openAddonsPrompt'),
        // Closing counts as "asked and answered" — don't re-prompt when the
        // customer navigates back through the services step later.
        closeAddonsPrompt: ()=>set({
                addonsPromptOpen: false,
                addonsPromptDismissed: true
            }, false, 'closeAddonsPrompt'),
        // ===========================================
        // RESET ACTIONS
        // ===========================================
        reset: ()=>set({
                ...initialState,
                isCartOpen: false
            }, false, 'reset'),
        resetToStep: (step)=>set({
                ...initialState,
                currentStep: step,
                isCartOpen: false
            }, false, 'resetToStep'),
        // Like reset but preserves auth and global discount so the user doesn't
        // have to re-authenticate and the discount banner stays active.
        resetForNewBooking: ()=>set((state)=>({
                    ...initialState,
                    // Preserve auth
                    clientIdentifier: state.clientIdentifier,
                    identifierType: state.identifierType,
                    clientId: state.clientId,
                    clientInfo: state.clientInfo,
                    // Preserve global settings
                    globalDiscountPercent: state.globalDiscountPercent,
                    globalDiscountActive: state.globalDiscountActive,
                    // Start at location step (auth already done)
                    currentStep: 'services',
                    isCartOpen: false
                }), false, 'resetForNewBooking')
    }), {
    name: 'mimosa-booking-cart',
    // Session-scoped: survives reloads and the OTP flow, but never
    // resurrects a days-old cart pointing at stale availability.
    // On top of that, carts expire after CART_TTL_HOURS even in a
    // long-lived tab (getItem returns null → rehydration is skipped).
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>expiringSessionStorage),
    version: 2,
    // v1 carts stored the old 7-step names; collapse them.
    migrate: (persisted)=>{
        const p = persisted;
        if (p?.currentStep) p.currentStep = normalizeStep(p.currentStep);
        return p;
    },
    // Persist SELECTIONS only — never identity/PII (clientInfo), never
    // transient flags. Auth state is restored from the Supabase session.
    partialize: (state)=>({
            cartSavedAt: Date.now(),
            currentStep: state.currentStep === 'success' || state.currentStep === 'confirm' ? 'services' : state.currentStep,
            selectedLocation: state.selectedLocation,
            selectedServices: state.selectedServices,
            selectedAddons: state.selectedAddons,
            selectedStaff: state.selectedStaff,
            selectedDate: state.selectedDate,
            selectedTime: state.selectedTime,
            activePromotion: state.activePromotion
        })
}), {
    name: 'booking-store'
}));
const selectCurrentStepNumber = (state)=>{
    const steps = [
        'services',
        'datetime',
        'auth',
        'confirm',
        'success'
    ];
    return steps.indexOf(state.currentStep) + 1;
};
const selectTotalDuration = (state)=>{
    return calculateTotalDuration(state.selectedServices, state.selectedAddons);
};
const selectHasServices = (state)=>{
    return state.selectedServices.length > 0;
};
const selectCanProceed = (state)=>{
    switch(state.currentStep){
        case 'auth':
            return state.clientId !== null;
        case 'services':
            return state.selectedLocation !== null && state.selectedServices.length > 0;
        case 'datetime':
            return state.selectedDate !== null && state.selectedTime !== null;
        case 'confirm':
            return true;
        default:
            return false;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/HomeBookingButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomeBookingButton",
    ()=>HomeBookingButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/portal/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function HomeBookingButton({ locale, children, className, onClick }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortalStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsAuthenticated"]);
    const mindbodyClientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortalStore"])({
        "HomeBookingButton.usePortalStore[mindbodyClientId]": (state)=>state.mindbodyClientId
    }["HomeBookingButton.usePortalStore[mindbodyClientId]"]);
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HomeBookingButton.useCallback[handleClick]": ()=>{
            // Call optional onClick handler (e.g., close mobile menu)
            onClick?.();
            // If a finished booking is still on screen, start a fresh one — otherwise
            // clicking Reservar while on /reservar would just stay on the success page.
            const { currentStep, resetForNewBooking } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"].getState();
            if (currentStep === 'success' || currentStep === 'confirm') {
                resetForNewBooking();
            }
            // Auth happens at the end of the flow now — everyone goes straight to
            // the widget and browses availability first.
            router.push(`/${locale}/reservar`);
        }
    }["HomeBookingButton.useCallback[handleClick]"], [
        isAuthenticated,
        mindbodyClientId,
        locale,
        router,
        onClick
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleClick,
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/shared/HomeBookingButton.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(HomeBookingButton, "/gLS02hgOKwvkzLwRjqS8SimhpA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortalStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$portal$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortalStore"]
    ];
});
_c = HomeBookingButton;
var _c;
__turbopack_context__.k.register(_c, "HomeBookingButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LanguageSwitcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$HomeBookingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/HomeBookingButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
// Button styles for sm and md sizes (matches Button component)
const smButtonStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gold text-dark hover:bg-gold-600 active:bg-gold-700 focus:ring-gold-500 shadow-sm hover:shadow-md px-4 py-2 text-sm gap-1.5";
const mdButtonStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gold text-dark hover:bg-gold-600 active:bg-gold-700 focus:ring-gold-500 shadow-sm hover:shadow-md px-6 py-3 text-base gap-2";
function Header() {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('navigation');
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params.locale;
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const handleScroll = {
                "Header.useEffect.handleScroll": ()=>{
                    setIsScrolled(window.scrollY > 20);
                }
            }["Header.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "Header.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    // Close mobile menu on route change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            setIsMobileMenuOpen(false);
        }
    }["Header.useEffect"], [
        locale
    ]);
    const navItems = [
        {
            href: `/${locale}`,
            label: t('home')
        },
        {
            href: `/${locale}/menu`,
            label: t('menu')
        },
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURES"].parejas ? [
            {
                href: `/${locale}/parejas`,
                label: t('couples')
            }
        ] : [],
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURES"].giftShop ? [
            {
                href: `/${locale}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GIFT_CARDS_PATH"]}`,
                label: t('giftcards')
            }
        ] : [],
        {
            href: `/${locale}/promociones`,
            label: t('promotions')
        },
        {
            href: `/${locale}/nosotros`,
            label: t('about')
        },
        {
            href: `/${locale}/galeria`,
            label: t('gallery')
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('fixed top-0 left-0 right-0 z-40 transition-all duration-300', isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg' : 'bg-dark'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container-spa",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex items-center justify-between h-20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}`,
                            className: "flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-12 w-40",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/Logo_mimosa.png",
                                    alt: "Mimosa Spa Retreat",
                                    fill: true,
                                    className: "object-contain object-left",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex items-center gap-8",
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "text-cream/90 hover:text-gold font-medium transition-colors",
                                    children: item.label
                                }, item.href, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageSwitcher"], {
                                    variant: "dark"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/${locale}/portal`,
                                    className: "p-2 rounded-lg text-cream/80 hover:text-gold hover:bg-cream/10 transition-colors",
                                    title: t('portal'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$HomeBookingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomeBookingButton"], {
                                    locale: locale,
                                    className: smButtonStyles,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            className: "h-4 w-4 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 100,
                                            columnNumber: 15
                                        }, this),
                                        t('book')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "lg:hidden p-2 rounded-lg hover:bg-cream/10 transition-colors",
                            onClick: ()=>setIsMobileMenuOpen(!isMobileMenuOpen),
                            "aria-label": isMobileMenuOpen ? 'Close menu' : 'Open menu',
                            "aria-expanded": isMobileMenuOpen,
                            children: isMobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-6 w-6 text-cream"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                className: "h-6 w-6 text-cream"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('lg:hidden fixed inset-x-0 top-20 z-[60] bg-dark/98 backdrop-blur-md', 'border-b border-cream/10 shadow-lg', 'transition-all duration-300 ease-in-out', isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa py-6 space-y-4",
                    children: [
                        navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: "block py-3 text-lg font-medium text-cream/90 hover:text-gold transition-colors border-b border-cream/10",
                                onClick: ()=>setIsMobileMenuOpen(false),
                                children: item.label
                            }, item.href, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/portal`,
                            className: "block py-3 text-lg font-medium text-cream/90 hover:text-gold transition-colors border-b border-cream/10",
                            onClick: ()=>setIsMobileMenuOpen(false),
                            children: t('portal')
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-4 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageSwitcher"], {
                                    variant: "dark"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$HomeBookingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomeBookingButton"], {
                                    locale: locale,
                                    className: mdButtonStyles,
                                    onClick: ()=>setIsMobileMenuOpen(false),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            className: "h-4 w-4 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        t('book')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Header.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(Header, "iOiBPxSpk2jy+EJ1p3dLwgANCgA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Logo",
    ()=>Logo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Logo({ className, variant = 'full', theme = 'light', size = 'md' }) {
    // Size configurations
    const fullSizes = {
        sm: {
            width: 120,
            height: 40
        },
        md: {
            width: 160,
            height: 53
        },
        lg: {
            width: 200,
            height: 67
        },
        xl: {
            width: 280,
            height: 93
        }
    };
    const iconSizes = {
        sm: 32,
        md: 48,
        lg: 64,
        xl: 80
    };
    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl'
    };
    const textColor = theme === 'dark' ? 'text-cream' : 'text-dark';
    const subtextColor = theme === 'dark' ? 'text-cream/70' : 'text-warm-gray';
    // Icon only variant - Mimosa flower
    if (variant === 'icon') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative rounded-full overflow-hidden bg-cream', className),
            style: {
                width: iconSizes[size],
                height: iconSizes[size]
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "/logo-icon.png",
                alt: "Mimosa Spa",
                fill: true,
                className: "object-contain p-1",
                priority: true
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Logo.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Logo.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this);
    }
    // Text only variant
    if (variant === 'text') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col', className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-display font-semibold tracking-wide', textSizes[size], textColor),
                    children: "Mimosa"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Logo.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-xs tracking-[0.15em] uppercase -mt-0.5', subtextColor),
                    children: "Spa Retreat"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Logo.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/Logo.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    // Full variant - for dark theme, use icon + text; for light, use full logo image
    if (theme === 'dark') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-3', className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex-shrink-0",
                    style: {
                        width: iconSizes[size],
                        height: iconSizes[size]
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/logo-icon.png",
                        alt: "Mimosa Spa",
                        fill: true,
                        className: "object-contain",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Logo.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Logo.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-display font-semibold tracking-wide', textSizes[size], textColor),
                            children: "Mimosa"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Logo.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-xs tracking-[0.15em] uppercase -mt-0.5', subtextColor),
                            children: "Spa Retreat"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Logo.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Logo.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/Logo.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, this);
    }
    // Light theme - use full logo image
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', className),
        style: {
            width: fullSizes[size].width,
            height: fullSizes[size].height
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "/logo.png",
            alt: "Mimosa Spa Retreat",
            fill: true,
            className: "object-contain object-left",
            priority: true
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Logo.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/Logo.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c = Logo;
var _c;
__turbopack_context__.k.register(_c, "Logo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/analytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Analytics utility functions for Google Tag Manager
 *
 * Usage:
 *   import { trackEvent, trackPageView, trackEcommerce } from '@/lib/analytics'
 *
 *   // Track a custom event
 *   trackEvent('button_click', { button_name: 'Book Now', page: 'home' })
 *
 *   // Track booking events
 *   trackBookingStep('service_selected', { service_name: 'Masaje Relajante', price: 85 })
 */ // Type definitions for dataLayer
__turbopack_context__.s([
    "pushToDataLayer",
    ()=>pushToDataLayer,
    "setUserProperties",
    ()=>setUserProperties,
    "trackBookingStep",
    ()=>trackBookingStep,
    "trackContactClick",
    ()=>trackContactClick,
    "trackEvent",
    ()=>trackEvent,
    "trackFormSubmission",
    ()=>trackFormSubmission,
    "trackLocaleChange",
    ()=>trackLocaleChange,
    "trackOutboundLink",
    ()=>trackOutboundLink,
    "trackPageView",
    ()=>trackPageView,
    "trackPromotion",
    ()=>trackPromotion,
    "trackServiceView",
    ()=>trackServiceView
]);
function pushToDataLayer(data) {
    if ("TURBOPACK compile-time truthy", 1) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(data);
    }
}
function trackEvent(eventName, eventParams) {
    pushToDataLayer({
        event: eventName,
        ...eventParams
    });
}
function trackPageView(url, title) {
    pushToDataLayer({
        event: 'page_view',
        page_path: url,
        page_title: title
    });
}
function trackBookingStep(step, params) {
    pushToDataLayer({
        event: `booking_${step}`,
        booking_step: step,
        ...params
    });
}
function trackPromotion(action, promotion) {
    pushToDataLayer({
        event: `promotion_${action}`,
        promotion_id: promotion.id,
        promotion_name: promotion.name,
        promotion_price: promotion.price
    });
}
function trackServiceView(service) {
    pushToDataLayer({
        event: 'view_item',
        ecommerce: {
            items: [
                {
                    item_id: service.id,
                    item_name: service.name,
                    item_category: service.category,
                    price: service.price,
                    quantity: 1
                }
            ]
        }
    });
}
function trackFormSubmission(formName, success, additionalData) {
    pushToDataLayer({
        event: 'form_submission',
        form_name: formName,
        form_success: success,
        ...additionalData
    });
}
function trackOutboundLink(url, linkText) {
    pushToDataLayer({
        event: 'outbound_click',
        outbound_url: url,
        link_text: linkText
    });
}
function trackContactClick(type, value) {
    pushToDataLayer({
        event: 'contact_click',
        contact_type: type,
        contact_value: value
    });
}
function trackLocaleChange(fromLocale, toLocale) {
    pushToDataLayer({
        event: 'locale_change',
        from_locale: fromLocale,
        to_locale: toLocale
    });
}
function setUserProperties(properties) {
    pushToDataLayer({
        event: 'set_user_properties',
        user_properties: properties
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/track.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "captureAttribution",
    ()=>captureAttribution,
    "getSessionId",
    ()=>getSessionId,
    "track",
    ()=>track
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-client] (ecmascript)");
'use client';
;
// ===========================================
// First-party event tracking. Every event goes BOTH to the GTM dataLayer
// (for GA4/ads) and to our own /api/track endpoint (Supabase web_events),
// which feeds the Mobile Manager marketing page. Fire-and-forget.
// ===========================================
const SESSION_KEY = 'mm_sid';
const UTM_KEY = 'mm_utm';
function getSessionId() {
    try {
        let sid = sessionStorage.getItem(SESSION_KEY);
        if (!sid) {
            sid = crypto.randomUUID();
            sessionStorage.setItem(SESSION_KEY, sid);
        }
        return sid;
    } catch  {
        return 'no-storage';
    }
}
function captureAttribution() {
    try {
        const saved = sessionStorage.getItem(UTM_KEY);
        if (saved) return JSON.parse(saved);
        const params = new URLSearchParams(window.location.search);
        const attr = {};
        const source = params.get('utm_source');
        const medium = params.get('utm_medium');
        const campaign = params.get('utm_campaign');
        if (source) attr.utm_source = source.slice(0, 80);
        if (medium) attr.utm_medium = medium.slice(0, 80);
        if (campaign) attr.utm_campaign = campaign.slice(0, 120);
        const ref = document.referrer;
        if (ref && !ref.includes(window.location.hostname)) attr.referrer = ref.slice(0, 200);
        sessionStorage.setItem(UTM_KEY, JSON.stringify(attr));
        return attr;
    } catch  {
        return {};
    }
}
function device() {
    try {
        return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
    } catch  {
        return 'desktop';
    }
}
function track(event, data) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushToDataLayer"])({
            event,
            ...data?.meta
        });
        const attr = captureAttribution();
        const body = JSON.stringify({
            event,
            session_id: getSessionId(),
            path: data?.path ?? window.location.pathname,
            locale: data?.locale,
            device: device(),
            location_id: data?.locationId,
            meta: data?.meta,
            ...attr
        });
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/track', new Blob([
                body
            ], {
                type: 'application/json'
            }));
        } else {
            fetch('/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body,
                keepalive: true
            }).catch(()=>{});
        }
    } catch  {
    // analytics must never break the site
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/WhatsAppWidget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppWidget",
    ()=>WhatsAppWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/track.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function WhatsAppWidget({ phoneNumber = ("TURBOPACK compile-time value", "50764049464") || '50764049464', message = 'Hola, me gustaría obtener información sobre sus servicios.' }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('whatsapp');
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showTooltip, setShowTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WhatsAppWidget.useEffect": ()=>{
            // Show widget after a short delay
            const timer = setTimeout({
                "WhatsAppWidget.useEffect.timer": ()=>setIsVisible(true)
            }["WhatsAppWidget.useEffect.timer"], 1000);
            // Show the tooltip once per session — repeating it on every page covers
            // content and reads as nagging.
            let tooltipTimer;
            try {
                if (!sessionStorage.getItem('mm_wa_tip')) {
                    tooltipTimer = setTimeout({
                        "WhatsAppWidget.useEffect": ()=>{
                            setShowTooltip(true);
                            try {
                                sessionStorage.setItem('mm_wa_tip', '1');
                            } catch  {}
                        }
                    }["WhatsAppWidget.useEffect"], 3000);
                }
            } catch  {
            // sessionStorage unavailable → skip the tooltip rather than nag
            }
            return ({
                "WhatsAppWidget.useEffect": ()=>{
                    clearTimeout(timer);
                    if (tooltipTimer) clearTimeout(tooltipTimer);
                }
            })["WhatsAppWidget.useEffect"];
        }
    }["WhatsAppWidget.useEffect"], []);
    const handleClick = ()=>{
        setShowTooltip(false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["track"])('whatsapp_click', {
            meta: {
                cta: 'floating_widget'
            }
        });
        window.open((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppUrl"])(phoneNumber, message), '_blank', 'noopener,noreferrer');
    };
    const dismissTooltip = (e)=>{
        e.stopPropagation();
        setShowTooltip(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('fixed bottom-24 lg:bottom-6 right-6 z-50 flex items-end gap-3', 'transition-all duration-500', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'),
        children: [
            showTooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative bg-white rounded-lg shadow-elevated p-4 max-w-[240px]', 'animate-slide-up'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: dismissTooltip,
                        className: "absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-beige transition-colors",
                        "aria-label": "Dismiss",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3 w-3 text-warm-gray"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-dark",
                        children: [
                            t('tooltipQuestion'),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                                lineNumber: 84,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: t('tooltipCta')
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-4 -bottom-2 w-4 h-4 bg-white rotate-45 shadow-md"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleClick,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative p-4 rounded-full shadow-lg', 'bg-[#25D366] hover:bg-[#128C7E]', 'text-white transition-all duration-300', 'hover:scale-110 active:scale-95', 'focus:outline-none focus:ring-4 focus:ring-[#25D366]/30'),
                "aria-label": "Contact via WhatsApp",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        className: "h-7 w-7 relative z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/WhatsAppWidget.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(WhatsAppWidget, "Qo1dXnnVU9C9kmUQ67LhEu5qZxQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c = WhatsAppWidget;
var _c;
__turbopack_context__.k.register(_c, "WhatsAppWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/MobileBottomNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileBottomNav",
    ()=>MobileBottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.js [app-client] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$HomeBookingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/HomeBookingButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function MobileBottomNav() {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('navigation');
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params.locale;
    // Check if we're on the booking page - hide bottom nav to give more screen space
    const isOnBookingPage = pathname.includes('/reservar');
    // Hide bottom nav on booking page to maximize screen space for booking widget
    if (isOnBookingPage) {
        return null;
    }
    const navItems = [
        {
            href: `/${locale}`,
            label: t('home'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
        },
        {
            href: `/${locale}/menu`,
            label: t('menu'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
        },
        {
            href: `/${locale}/reservar`,
            label: t('book'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
            primary: true
        },
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURES"].giftShop ? {
            href: `/${locale}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GIFT_CARDS_PATH"]}`,
            label: t('giftcards'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"]
        } : {
            href: `/${locale}/promociones`,
            label: t('promotions'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"]
        },
        {
            href: `/portal`,
            label: t('portal'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
            isPortal: true
        }
    ];
    const isActive = (href)=>{
        if (href === `/${locale}`) {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(href);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('lg:hidden fixed left-0 right-0 z-40', 'bg-cream/95 backdrop-blur-md border-t border-beige-300'),
        style: {
            bottom: 0,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-5 items-end px-2 py-2",
            children: navItems.map((item)=>{
                const active = isActive(item.href);
                const Icon = item.icon;
                if (item.primary) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$HomeBookingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HomeBookingButton"], {
                        locale: locale,
                        className: "flex flex-col items-center justify-center -mt-6 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center justify-center w-14 h-14 rounded-full', 'bg-gold shadow-lg', 'transition-transform hover:scale-105 active:scale-95'),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-6 w-6 text-dark"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 70,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                lineNumber: 63,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs mt-1 font-medium text-dark",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                lineNumber: 72,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                        lineNumber: 58,
                        columnNumber: 15
                    }, this);
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: item.href,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col items-center justify-center py-2 rounded-lg', 'transition-colors', active ? 'text-gold' : 'text-warm-gray hover:text-dark'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-5 w-5', active && 'stroke-[2.5]')
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 91,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-xs mt-1', active && 'font-medium'),
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 92,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.href, true, {
                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                    lineNumber: 80,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(MobileBottomNav, "3j5ztiZwk4JntxVkzEWcnFu/4Wk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = MobileBottomNav;
var _c;
__turbopack_context__.k.register(_c, "MobileBottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analytics/PageViewTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageViewTracker",
    ()=>PageViewTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/track.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Module-level so strict-mode remounts don't double-fire the same path.
let lastTracked = null;
function PageViewTracker({ locale }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PageViewTracker.useEffect": ()=>{
            if (!pathname || pathname === lastTracked) return;
            lastTracked = pathname;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["track"])('page_view', {
                path: pathname,
                locale
            });
        }
    }["PageViewTracker.useEffect"], [
        pathname,
        locale
    ]);
    return null;
}
_s(PageViewTracker, "V/ldUoOTYUs0Cb2F6bbxKSn7KxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = PageViewTracker;
var _c;
__turbopack_context__.k.register(_c, "PageViewTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_312328cc._.js.map