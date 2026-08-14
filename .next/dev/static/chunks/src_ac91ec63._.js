(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/booking/shared/StepProgress.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepProgress",
    ()=>StepProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const stepLabels = {
    1: 'Servicios',
    2: 'Fecha y Hora',
    3: 'Tu Cuenta',
    4: 'Confirmar'
};
function StepProgress({ currentStep, totalSteps }) {
    _s();
    const { selectedServices, selectedAddons, toggleCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const itemCount = selectedServices.length + selectedAddons.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "step-progress",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden sm:flex items-center relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center justify-center",
                        children: Array.from({
                            length: totalSteps
                        }, (_, i)=>i + 1).map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `
                    w-8 h-8 rounded-full flex items-center justify-center
                    font-semibold text-xs transition-all duration-300
                    ${step < currentStep ? 'bg-gold text-dark' : step === currentStep ? 'bg-dark text-white ring-[3px] ring-gold/30' : 'bg-beige-200 text-warm-gray'}
                  `,
                                                children: step < currentStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 21
                                                }, this) : step
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                                lineNumber: 31,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `
                  mt-1 text-[11px] font-medium whitespace-nowrap
                  ${step === currentStep ? 'text-dark' : 'text-warm-gray'}
                `,
                                                children: stepLabels[step]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                                lineNumber: 49,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                        lineNumber: 30,
                                        columnNumber: 15
                                    }, this),
                                    step < totalSteps && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-10 h-px mx-2 mb-4 transition-all duration-500 ${step < currentStep ? 'bg-gold' : 'bg-beige-200'}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, step, true, {
                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleCart,
                        className: "absolute right-0 top-1/2 -translate-y-1/2 group",
                        "aria-label": `Carrito: ${itemCount} items`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `
            relative w-10 h-10 rounded-xl flex items-center justify-center
            transition-all duration-300 border-2
            ${itemCount > 0 ? 'bg-gold/10 border-gold text-gold hover:bg-gold/20' : 'bg-beige-100 border-beige-200 text-warm-gray hover:border-gold/50'}
          `,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                                    initial: {
                                        scale: 0
                                    },
                                    animate: {
                                        scale: 1
                                    },
                                    className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold text-dark text-xs font-bold rounded-full flex items-center justify-center shadow-md",
                                    children: itemCount
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sm:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-dark",
                                children: [
                                    "Paso ",
                                    currentStep,
                                    " de ",
                                    totalSteps
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-warm-gray",
                                        children: stepLabels[currentStep]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleCart,
                                        className: `
                relative p-2 rounded-lg transition-all
                ${itemCount > 0 ? 'bg-gold/10 text-gold' : 'bg-beige-100 text-warm-gray'}
              `,
                                        "aria-label": `Carrito: ${itemCount} items`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this),
                                            itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                                                initial: {
                                                    scale: 0
                                                },
                                                animate: {
                                                    scale: 1
                                                },
                                                className: "absolute -top-1 -right-1 w-4 h-4 bg-gold text-dark text-[10px]  font-bold rounded-full flex items-center justify-center",
                                                children: itemCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                                lineNumber: 122,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-beige-200 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-gold transition-all duration-500 rounded-full",
                            style: {
                                width: `${currentStep / totalSteps * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/shared/StepProgress.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(StepProgress, "RkzYOaRcuMkBqA9Z1TQ5IVNCDL0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = StepProgress;
var _c;
__turbopack_context__.k.register(_c, "StepProgress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/booking/pricing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateCartPricing",
    ()=>calculateCartPricing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/constants.ts [app-client] (ecmascript)");
;
// THE cart pricing implementation. ConfirmStep, FloatingCart and SuccessStep
// all call this — previously three divergent copies (and the success screen's
// total never rendered at all).
const r2 = (n)=>Math.round(n * 100) / 100;
function calculateCartPricing({ services, addons, promotion, globalDiscountActive, globalDiscountPercent }) {
    const hasPromotion = promotion !== null;
    const promoServiceIds = new Set((promotion?.services || []).map((s)=>s.Id));
    const promoServices = hasPromotion ? services.filter((s)=>promoServiceIds.has(s.Id)) : services;
    const extraServices = hasPromotion ? services.filter((s)=>!promoServiceIds.has(s.Id)) : [];
    const promoServicesSubtotal = promoServices.reduce((sum, s)=>sum + s.Price, 0);
    const extraServicesSubtotal = extraServices.reduce((sum, s)=>sum + s.Price, 0);
    const addonsSubtotal = addons.reduce((sum, a)=>sum + a.Price, 0);
    let finalServicesPrice = promoServicesSubtotal + extraServicesSubtotal;
    let promotionDiscount = 0;
    if (hasPromotion && promotion) {
        // Promotion covers its included services at a flat price; extras full price
        finalServicesPrice = promotion.price + extraServicesSubtotal;
        promotionDiscount = promoServicesSubtotal - promotion.price;
    }
    const hasGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0;
    let globalDiscountAmount = 0;
    const effectiveAddonsSubtotal = hasGlobalDiscount ? r2(addonsSubtotal * (1 - globalDiscountPercent / 100)) : addonsSubtotal;
    if (hasGlobalDiscount) {
        if (hasPromotion && promotion) {
            // Only discount extra services (never the promotion price)
            const discountedExtra = r2(extraServicesSubtotal * (1 - globalDiscountPercent / 100));
            globalDiscountAmount = extraServicesSubtotal - discountedExtra + (addonsSubtotal - effectiveAddonsSubtotal);
            finalServicesPrice = promotion.price + discountedExtra;
        } else {
            globalDiscountAmount = r2(finalServicesPrice * (globalDiscountPercent / 100));
            finalServicesPrice = r2(finalServicesPrice - globalDiscountAmount);
            globalDiscountAmount += addonsSubtotal - effectiveAddonsSubtotal;
        }
    }
    const subtotalBeforeTax = finalServicesPrice + effectiveAddonsSubtotal;
    const itbmAmount = r2(subtotalBeforeTax * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ITBM_TAX_RATE"]);
    const totalWithTax = r2(subtotalBeforeTax + itbmAmount);
    const totalDuration = services.reduce((sum, s)=>sum + (s.Duration || 0), 0) + addons.reduce((sum, a)=>sum + (a.Duration || 0), 0);
    return {
        services,
        addons,
        promoServices,
        extraServices,
        promoServicesSubtotal,
        extraServicesSubtotal,
        servicesSubtotal: promoServicesSubtotal + extraServicesSubtotal,
        addonsSubtotal,
        hasPromotion,
        promotionName: promotion?.title_es || null,
        promotionPrice: promotion?.price ?? 0,
        promotionDiscount,
        promotionServicesSubtotal: hasPromotion ? promoServicesSubtotal : 0,
        regularServicesSubtotal: hasPromotion ? extraServicesSubtotal : promoServicesSubtotal + extraServicesSubtotal,
        regularItemsTotal: r2(subtotalBeforeTax - (hasPromotion && promotion ? promotion.price : 0)),
        hasGlobalDiscount,
        globalDiscountPercent,
        globalDiscountAmount,
        subtotalBeforeTax,
        itbmRate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ITBM_TAX_RATE"],
        itbmAmount,
        totalWithTax,
        totalDuration
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/shared/FloatingCart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingCart",
    ()=>FloatingCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/pricing.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function FloatingCart() {
    _s();
    const { selectedServices, selectedAddons, removeService, removeAddon, activePromotion, isCartOpen, closeCart, globalDiscountPercent, globalDiscountActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0;
    // Collapsible section states
    const [isPromoExpanded, setIsPromoExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPricingExpanded, setIsPricingExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const itemCount = selectedServices.length + selectedAddons.length;
    // Separate promotion services from regular services
    const { promotionServices, regularServices } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FloatingCart.useMemo": ()=>{
            if (!activePromotion || !activePromotion.services) {
                return {
                    promotionServices: [],
                    regularServices: selectedServices
                };
            }
            // Get IDs of services included in the promotion
            const promotionServiceIds = new Set(activePromotion.services.map({
                "FloatingCart.useMemo": (s)=>s.Id
            }["FloatingCart.useMemo"]));
            // Separate services
            const promoServices = selectedServices.filter({
                "FloatingCart.useMemo.promoServices": (s)=>promotionServiceIds.has(s.Id)
            }["FloatingCart.useMemo.promoServices"]);
            const extraServices = selectedServices.filter({
                "FloatingCart.useMemo.extraServices": (s)=>!promotionServiceIds.has(s.Id)
            }["FloatingCart.useMemo.extraServices"]);
            return {
                promotionServices: promoServices,
                regularServices: extraServices
            };
        }
    }["FloatingCart.useMemo"], [
        selectedServices,
        activePromotion
    ]);
    // Calculate pricing with useMemo - now handling separate sections
    const pricing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FloatingCart.useMemo[pricing]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateCartPricing"])({
                services: selectedServices,
                addons: selectedAddons,
                promotion: activePromotion,
                globalDiscountActive,
                globalDiscountPercent
            })
    }["FloatingCart.useMemo[pricing]"], [
        selectedServices,
        selectedAddons,
        activePromotion,
        globalDiscountActive,
        globalDiscountPercent
    ]);
    const hasRegularItems = regularServices.length > 0 || selectedAddons.length > 0;
    // Close sidebar handler - use store action
    const closeSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCart.useCallback[closeSidebar]": ()=>{
            closeCart();
        }
    }["FloatingCart.useCallback[closeSidebar]"], [
        closeCart
    ]);
    // Handle escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingCart.useEffect": ()=>{
            const handleEscape = {
                "FloatingCart.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape' && isCartOpen) {
                        closeSidebar();
                    }
                }
            }["FloatingCart.useEffect.handleEscape"];
            document.addEventListener('keydown', handleEscape);
            return ({
                "FloatingCart.useEffect": ()=>document.removeEventListener('keydown', handleEscape)
            })["FloatingCart.useEffect"];
        }
    }["FloatingCart.useEffect"], [
        isCartOpen,
        closeSidebar
    ]);
    // Prevent body scroll when sidebar is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingCart.useEffect": ()=>{
            if (isCartOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            return ({
                "FloatingCart.useEffect": ()=>{
                    document.body.style.overflow = '';
                }
            })["FloatingCart.useEffect"];
        }
    }["FloatingCart.useEffect"], [
        isCartOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: isCartOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        exit: {
                            opacity: 0
                        },
                        transition: {
                            duration: 0.2
                        },
                        onClick: closeSidebar,
                        className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            x: '100%'
                        },
                        animate: {
                            x: 0
                        },
                        exit: {
                            x: '100%'
                        },
                        transition: {
                            type: 'spring',
                            damping: 25,
                            stiffness: 300
                        },
                        className: "fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col max-h-[100dvh]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0 flex items-center justify-between px-5 py-4 bg-gradient-to-r from-beige-50 to-white border-b border-beige-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold text-dark flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                className: "w-5 h-5 text-gold"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this),
                                            "Tu Carrito",
                                            itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-normal text-warm-gray",
                                                children: [
                                                    "(",
                                                    itemCount,
                                                    " ",
                                                    itemCount === 1 ? 'item' : 'items',
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                lineNumber: 125,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeSidebar,
                                        className: "p-2 hover:bg-beige-100 rounded-full transition-colors",
                                        "aria-label": "Cerrar carrito",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-5 h-5 text-warm-gray"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 135,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-scroll overflow-x-hidden min-h-0 overscroll-contain",
                                style: {
                                    WebkitOverflowScrolling: 'touch'
                                },
                                children: itemCount === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "py-16 px-6 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                className: "w-10 h-10 text-beige-300"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                lineNumber: 147,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 146,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lg text-dark font-medium",
                                            children: "Tu carrito está vacío"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 149,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-warm-gray mt-2",
                                            children: "Agrega tratamientos para comenzar tu reserva"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 150,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                    lineNumber: 145,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        pricing.hasPromotion && promotionServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-b-2 border-gold bg-gradient-to-b from-gold/10 to-gold/5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setIsPromoExpanded(!isPromoExpanded),
                                                    className: "w-full bg-gradient-to-r from-gold to-gold/80 text-dark px-4 py-2.5 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-2 font-semibold text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 167,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "PROMOCIÓN: ",
                                                                pricing.promotionName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-bold",
                                                                    children: [
                                                                        "$",
                                                                        pricing.promotionPrice.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isPromoExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 173,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 175,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                                    children: isPromoExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        initial: {
                                                            height: 0,
                                                            opacity: 0
                                                        },
                                                        animate: {
                                                            height: 'auto',
                                                            opacity: 1
                                                        },
                                                        exit: {
                                                            height: 0,
                                                            opacity: 0
                                                        },
                                                        transition: {
                                                            duration: 0.2
                                                        },
                                                        className: "overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-4 space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold text-gold-700 uppercase tracking-wider mb-2",
                                                                    children: "Servicios Incluidos"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 191,
                                                                    columnNumber: 33
                                                                }, this),
                                                                promotionServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-start gap-2 py-1.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-gold-600",
                                                                                children: "✓"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                lineNumber: 200,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm font-medium text-dark",
                                                                                        children: service.Name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                        lineNumber: 202,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    service.Duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-xs text-warm-gray",
                                                                                        children: [
                                                                                            service.Duration,
                                                                                            " min"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                        lineNumber: 204,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                lineNumber: 201,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, service.Id, true, {
                                                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                        lineNumber: 196,
                                                                        columnNumber: 35
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 190,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 160,
                                            columnNumber: 23
                                        }, this),
                                        hasRegularItems && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "divide-y divide-beige-100",
                                            children: [
                                                regularServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-warm-gray uppercase tracking-wider mb-3 font-medium",
                                                            children: pricing.hasPromotion ? 'Servicios Adicionales' : 'Tratamientos'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: regularServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                    initial: {
                                                                        opacity: 0,
                                                                        x: 20
                                                                    },
                                                                    animate: {
                                                                        opacity: 1,
                                                                        x: 0
                                                                    },
                                                                    exit: {
                                                                        opacity: 0,
                                                                        x: -20
                                                                    },
                                                                    className: "flex items-start justify-between gap-3 p-3 bg-beige-50 rounded-xl group",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1 min-w-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-medium text-dark leading-tight",
                                                                                    children: service.Name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 238,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                service.Duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-warm-gray flex items-center gap-1 mt-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                            className: "w-3 h-3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                            lineNumber: 243,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        service.Duration,
                                                                                        " min"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 242,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 237,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                showGlobalDiscount && service.Price > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "flex flex-col items-end",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs line-through text-warm-gray leading-tight",
                                                                                            children: [
                                                                                                "$",
                                                                                                service.Price.toFixed(0)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                            lineNumber: 251,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm font-semibold text-green-600 leading-tight",
                                                                                            children: [
                                                                                                "$",
                                                                                                (Math.round(service.Price * (1 - globalDiscountPercent / 100) * 100) / 100).toFixed(0)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                            lineNumber: 252,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 250,
                                                                                    columnNumber: 39
                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-sm font-semibold text-dark whitespace-nowrap",
                                                                                    children: [
                                                                                        "$",
                                                                                        service.Price.toFixed(0)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 255,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>removeService(service.Id),
                                                                                    className: "p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-60 group-hover:opacity-100",
                                                                                    "aria-label": "Eliminar",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                        lineNumber: 265,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 259,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 248,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, service.Id, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 229,
                                                                    columnNumber: 33
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 27
                                                }, this),
                                                selectedAddons.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-warm-gray uppercase tracking-wider mb-3 font-medium",
                                                            children: "Adicionales"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: selectedAddons.map((addon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                    initial: {
                                                                        opacity: 0,
                                                                        x: 20
                                                                    },
                                                                    animate: {
                                                                        opacity: 1,
                                                                        x: 0
                                                                    },
                                                                    exit: {
                                                                        opacity: 0,
                                                                        x: -20
                                                                    },
                                                                    className: "flex items-start justify-between gap-3 p-3 bg-gold/5 border border-gold/20 rounded-xl group",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1 min-w-0",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-medium text-dark leading-tight",
                                                                                children: addon.Name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                lineNumber: 291,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                showGlobalDiscount && addon.Price > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "flex flex-col items-end",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs line-through text-warm-gray leading-tight",
                                                                                            children: [
                                                                                                "$",
                                                                                                addon.Price.toFixed(0)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                            lineNumber: 298,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm font-semibold text-green-600 leading-tight",
                                                                                            children: [
                                                                                                "$",
                                                                                                (Math.round(addon.Price * (1 - globalDiscountPercent / 100) * 100) / 100).toFixed(0)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                            lineNumber: 299,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 297,
                                                                                    columnNumber: 39
                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-sm font-semibold text-dark whitespace-nowrap",
                                                                                    children: [
                                                                                        "$",
                                                                                        addon.Price.toFixed(0)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 302,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>removeAddon(addon.Id),
                                                                                    className: "p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-60 group-hover:opacity-100",
                                                                                    "aria-label": "Eliminar",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                        lineNumber: 312,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                                    lineNumber: 306,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 295,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, addon.Id, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 282,
                                                                    columnNumber: 33
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 280,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 220,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                    lineNumber: 155,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                lineNumber: 140,
                                columnNumber: 15
                            }, this),
                            itemCount > 0 && pricing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0 border-t-2 border-beige-200 bg-gradient-to-b from-beige-50 to-white p-4 pb-24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        pricing.totalDuration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-warm-gray flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 27
                                                        }, this),
                                                        "Duración total:"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-dark",
                                                    children: [
                                                        pricing.totalDuration,
                                                        " min"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 333,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setIsPricingExpanded(!isPricingExpanded),
                                            className: "w-full flex items-center justify-between text-sm text-warm-gray hover:text-dark transition-colors py-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        "Ver detalles de precio",
                                                        isPricingExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs",
                                                    children: [
                                                        "Subtotal: $",
                                                        pricing.subtotalBeforeTax.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 343,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                            children: isPricingExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    height: 0,
                                                    opacity: 0
                                                },
                                                animate: {
                                                    height: 'auto',
                                                    opacity: 1
                                                },
                                                exit: {
                                                    height: 0,
                                                    opacity: 0
                                                },
                                                transition: {
                                                    duration: 0.2
                                                },
                                                className: "overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-t border-beige-200 pt-2 space-y-1.5",
                                                    children: [
                                                        pricing.hasPromotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-warm-gray",
                                                                            children: "Promoción:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 375,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gold-600 font-medium",
                                                                            children: [
                                                                                "$",
                                                                                pricing.promotionPrice.toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 376,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 374,
                                                                    columnNumber: 33
                                                                }, this),
                                                                pricing.regularItemsTotal > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-warm-gray",
                                                                            children: "Adicionales:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 380,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-dark",
                                                                            children: [
                                                                                "$",
                                                                                pricing.regularItemsTotal.toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                            lineNumber: 381,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-warm-gray",
                                                                    children: "Subtotal:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 388,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-dark",
                                                                    children: [
                                                                        "$",
                                                                        pricing.subtotalBeforeTax.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 389,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 387,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-warm-gray",
                                                                    children: [
                                                                        "ITBM (",
                                                                        (pricing.itbmRate * 100).toFixed(0),
                                                                        "%):"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 392,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-dark",
                                                                    children: [
                                                                        "$",
                                                                        pricing.itbmAmount.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                                    lineNumber: 393,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                            lineNumber: 391,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 370,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                lineNumber: 363,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 361,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-lg font-bold pt-2 border-t border-beige-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-dark",
                                                    children: "TOTAL:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: pricing.hasPromotion ? 'text-gold-600' : 'text-dark',
                                                    children: [
                                                        "$",
                                                        pricing.totalWithTax.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                                    lineNumber: 403,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                            lineNumber: 401,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                    lineNumber: 330,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                                lineNumber: 329,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
                        lineNumber: 110,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/shared/FloatingCart.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(FloatingCart, "4iLhhJdAAx6EES4sBsPeV341tCc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = FloatingCart;
var _c;
__turbopack_context__.k.register(_c, "FloatingCart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/shared/ClientSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientSelector",
    ()=>ClientSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
'use client';
;
;
;
function ClientSelector({ clients, onSelect, onCancel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            className: "fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
            onClick: onCancel,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    scale: 0.9,
                    opacity: 0,
                    y: 20
                },
                animate: {
                    scale: 1,
                    opacity: 1,
                    y: 0
                },
                exit: {
                    scale: 0.9,
                    opacity: 0,
                    y: 20
                },
                transition: {
                    type: 'spring',
                    duration: 0.5
                },
                className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-gold/20 to-gold/10 px-6 py-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-dark",
                                children: "Selecciona tu perfil"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCancel,
                                className: "text-warm-gray hover:text-dark transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                    lineNumber: 40,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4 border-b border-beige-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-warm-gray",
                            children: "Encontramos varias cuentas asociadas a este contacto. Por favor selecciona para quién deseas reservar:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 max-h-80 overflow-y-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: clients.map((client)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onSelect(client),
                                    className: "w-full p-4 border border-beige-200 rounded-xl  hover:border-gold hover:bg-gold/5  transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-gold/50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 h-12 bg-gradient-to-br from-gold/30 to-gold/10  rounded-full flex items-center justify-center flex-shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-bold text-gold-600",
                                                    children: [
                                                        client.FirstName?.[0],
                                                        client.LastName?.[0]
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                lineNumber: 66,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-dark truncate",
                                                        children: [
                                                            client.FirstName,
                                                            " ",
                                                            client.LastName
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                        lineNumber: 75,
                                                        columnNumber: 23
                                                    }, this),
                                                    client.Email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-warm-gray truncate",
                                                        children: client.Email
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 25
                                                    }, this),
                                                    client.MobilePhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-warm-gray",
                                                        children: client.MobilePhone
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                lineNumber: 74,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-beige-300",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M9 5l7 7-7 7"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                                lineNumber: 91,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                        lineNumber: 64,
                                        columnNumber: 19
                                    }, this)
                                }, client.Id, false, {
                                    fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                                    lineNumber: 56,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4 bg-beige-50 border-t border-beige-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "w-full py-3 text-warm-gray hover:text-dark  transition-colors text-sm font-medium",
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/shared/ClientSelector.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = ClientSelector;
var _c;
__turbopack_context__.k.register(_c, "ClientSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/shared/BookingNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingNav",
    ()=>BookingNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function BookingNav() {
    _s();
    const { currentStep, selectedLocation, selectedDate, selectedTime, nextStep, prevStep, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const hasServices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectHasServices"]);
    // Don't show on auth step (first step) or success step (last step)
    if (currentStep === 'auth' || currentStep === 'success') {
        return null;
    }
    // Determine if next/continue is enabled based on step requirements
    const canProceed = ()=>{
        switch(currentStep){
            case 'services':
                return !!selectedLocation && hasServices;
            case 'datetime':
                return !!selectedDate && !!selectedTime;
            case 'confirm':
                return !isLoading;
            default:
                return true;
        }
    };
    const getButtonLabel = ()=>{
        return currentStep === 'confirm' ? 'Confirmar' : 'Continuar';
    };
    // Handle button click - for confirm step, trigger the hidden confirm button
    const handleNextClick = ()=>{
        // Leaving services: offer add-ons once via the carousel popup. The popup
        // itself advances the step (choose N or skip) and never re-prompts.
        if (currentStep === 'services') {
            const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"].getState();
            if (!s.addonsPromptDismissed && s.selectedAddons.length === 0) {
                s.openAddonsPrompt();
                return;
            }
            nextStep();
            return;
        }
        if (currentStep === 'confirm') {
            // Trigger the hidden confirm button in ConfirmStep
            const confirmBtn = document.getElementById('mobile-confirm-btn');
            if (confirmBtn) {
                confirmBtn.click();
            }
        } else {
            nextStep();
        }
    };
    const showNextButton = true;
    // No previous screen before services
    const showBackButton = currentStep !== 'services';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    showBackButton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: prevStep,
                        disabled: isLoading,
                        className: "flex items-center gap-1.5 px-4 py-2.5 text-sm text-warm-gray hover:text-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-beige-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                                lineNumber: 81,
                                columnNumber: 15
                            }, this),
                            "Volver"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                        lineNumber: 75,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                        lineNumber: 85,
                        columnNumber: 13
                    }, this),
                    showNextButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleNextClick,
                        disabled: !canProceed() || isLoading,
                        className: "flex items-center gap-1.5 px-5 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-4 h-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                                    lineNumber: 98,
                                    columnNumber: 19
                                }, this),
                                "Procesando..."
                            ]
                        }, void 0, true) : currentStep === 'confirm' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                                    lineNumber: 103,
                                    columnNumber: 19
                                }, this),
                                getButtonLabel()
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                getButtonLabel(),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                                    lineNumber: 109,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                        lineNumber: 89,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/shared/BookingNav.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s(BookingNav, "QsBVXEJ8n93aYMaG8L+5xiY0Nt0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = BookingNav;
var _c;
__turbopack_context__.k.register(_c, "BookingNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/shared/AddonsPrompt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddonsPrompt",
    ()=>AddonsPrompt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// "Mejora tu ritual" carousel popup: shown once when the customer leaves the
// services step. They add one or more extras — or skip — and continue to
// date/time either way.
function AddonCard({ addon, isSelected, onToggle, discountPercent = 0, showDiscount = false }) {
    const discountedPrice = showDiscount && discountPercent > 0 ? Math.round(addon.Price * (1 - discountPercent / 100) * 100) / 100 : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onToggle,
        className: `
        relative w-full rounded-2xl border-2 text-left
        transition-all duration-200 overflow-hidden
        ${isSelected ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/20' : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'}
      `,
        children: [
            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2.5 right-2.5 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "w-4 h-4 text-dark"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold text-dark text-sm leading-snug mb-3 pr-8 min-h-[2.5rem]",
                        children: addon.Name
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                            addon.Price > 0 ? discountedPrice !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm line-through text-warm-gray",
                                        children: [
                                            "+$",
                                            addon.Price.toFixed(0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-bold text-green-600",
                                        children: [
                                            "+$",
                                            discountedPrice.toFixed(0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xl font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`,
                                children: [
                                    "+$",
                                    addon.Price.toFixed(0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xl font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`,
                                children: "Consultar"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            addon.Duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 text-xs text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    "+",
                                    addon.Duration,
                                    " min"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = AddonCard;
function AddonsPrompt() {
    _s();
    const { addonsPromptOpen, closeAddonsPrompt, nextStep, selectedLocation, addons, setAddons, selectedAddons, addAddon, removeAddon, globalDiscountPercent, globalDiscountActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0;
    const [localAddons, setLocalAddons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingAddons, setIsLoadingAddons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Fetch when the popup opens; if there's nothing to offer, continue
    // silently so the customer never sees an empty modal.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddonsPrompt.useEffect": ()=>{
            if (!addonsPromptOpen) return;
            async function fetchAddons() {
                if (addons.length > 0) {
                    setLocalAddons(addons);
                    return;
                }
                if (!selectedLocation) {
                    closeAddonsPrompt();
                    nextStep();
                    return;
                }
                setIsLoadingAddons(true);
                try {
                    const response = await fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=addons`);
                    const data = await response.json();
                    if (response.ok && data.services?.length > 0) {
                        setAddons(data.services);
                        setLocalAddons(data.services);
                    } else {
                        closeAddonsPrompt();
                        nextStep();
                    }
                } catch  {
                    closeAddonsPrompt();
                    nextStep();
                } finally{
                    setIsLoadingAddons(false);
                }
            }
            fetchAddons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["AddonsPrompt.useEffect"], [
        addonsPromptOpen
    ]);
    const isAddonSelected = (addonId)=>selectedAddons.some((a)=>a.Id === addonId);
    const handleToggleAddon = (addon)=>{
        if (isAddonSelected(addon.Id)) {
            removeAddon(addon.Id);
        } else {
            addAddon(addon);
        }
    };
    const handleContinue = ()=>{
        closeAddonsPrompt();
        nextStep();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: addonsPromptOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[90] flex items-end sm:items-center justify-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: handleContinue,
                    className: "absolute inset-0 bg-dark/50 backdrop-blur-sm"
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                    lineNumber: 163,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 60
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: 60
                    },
                    transition: {
                        duration: 0.25,
                        ease: 'easeOut'
                    },
                    className: "relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleContinue,
                            className: "absolute top-4 right-4 p-2 rounded-full text-warm-gray hover:bg-beige-100 transition-colors",
                            "aria-label": "Cerrar",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 mb-4 pr-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center shadow-md flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                    lineNumber: 190,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-dark text-lg leading-tight",
                                            children: "Mejora tu ritual"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-warm-gray",
                                            children: "Agrega un extra a tu visita — o continúa sin adicionales"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this),
                        isLoadingAddons ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-2 py-12 text-warm-gray text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-5 h-5 animate-spin text-gold"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                    lineNumber: 203,
                                    columnNumber: 17
                                }, this),
                                "Cargando adicionales..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                            lineNumber: 202,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[28.5rem] overflow-y-auto pr-1",
                            children: localAddons.map((addon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddonCard, {
                                    addon: addon,
                                    isSelected: isAddonSelected(addon.Id),
                                    onToggle: ()=>handleToggleAddon(addon),
                                    discountPercent: globalDiscountPercent,
                                    showDiscount: showGlobalDiscount
                                }, addon.Id, false, {
                                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                    lineNumber: 209,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                            lineNumber: 207,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleContinue,
                                className: "w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold rounded-xl hover:shadow-lg transition-all text-sm",
                                children: selectedAddons.length > 0 ? `Agregar ${selectedAddons.length} y continuar` : 'Continuar'
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
                    lineNumber: 172,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
            lineNumber: 161,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/shared/AddonsPrompt.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, this);
}
_s(AddonsPrompt, "vBuIi0ezKi1W++CxIbQTs2yl3Y4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c1 = AddonsPrompt;
var _c, _c1;
__turbopack_context__.k.register(_c, "AddonCard");
__turbopack_context__.k.register(_c1, "AddonsPrompt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "getClient",
    ()=>getClient,
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
// Check if Supabase env vars are configured
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoqbaxfynmlcxwrnaeyo.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcWJheGZ5bm1sY3h3cm5hZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDQ2OTMsImV4cCI6MjA4MzQ4MDY5M30.bfWfBQZ8bZgcjQcXlZXBhjbLyx-VN168xjnvgn-enYQ");
function createClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Use default cookie-based storage from @supabase/ssr
    // This is critical for PKCE flow to work across browser tabs
    // The code verifier is stored in cookies and accessible by the server
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey);
}
// Singleton instance for client-side usage
let clientInstance = null;
function getClient() {
    if (!clientInstance) {
        clientInstance = createClient();
    }
    return clientInstance;
}
function isSupabaseConfigured() {
    return !!supabaseUrl && !!supabaseAnonKey;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
'use client';
;
let supabaseInstance = null;
function getSupabase() {
    if (!supabaseInstance) {
        const { getClient } = __turbopack_context__.r("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
        supabaseInstance = getClient();
    }
    return supabaseInstance;
}
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        user: null,
        session: null,
        isLoading: false,
        isInitialized: false,
        error: null,
        otpEmail: null,
        initialize: async ()=>{
            if (get().isInitialized) return;
            set({
                isLoading: true
            });
            try {
                const supabase = getSupabase();
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                set({
                    user: session?.user ?? null,
                    session,
                    isInitialized: true,
                    isLoading: false
                });
                // Listen for auth changes
                supabase.auth.onAuthStateChange((_event, session)=>{
                    set({
                        user: session?.user ?? null,
                        session
                    });
                });
            } catch (error) {
                console.error('Auth initialization error:', error);
                set({
                    user: null,
                    session: null,
                    isInitialized: true,
                    isLoading: false
                });
            }
        },
        sendOtp: async (email)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const supabase = getSupabase();
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        shouldCreateUser: false
                    }
                });
                if (error) {
                    set({
                        error: 'No se pudo enviar el código. Verifica que el correo esté registrado.',
                        isLoading: false
                    });
                    return {
                        success: false,
                        error: error.message
                    };
                }
                set({
                    otpEmail: email,
                    isLoading: false
                });
                return {
                    success: true
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error desconocido';
                set({
                    error: message,
                    isLoading: false
                });
                return {
                    success: false,
                    error: message
                };
            }
        },
        verifyOtp: async (email, token)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const supabase = getSupabase();
                const { data, error } = await supabase.auth.verifyOtp({
                    email,
                    token,
                    type: 'email'
                });
                if (error) {
                    set({
                        error: 'Código incorrecto o expirado.',
                        isLoading: false
                    });
                    return {
                        success: false,
                        error: error.message
                    };
                }
                // Check admin role in profiles table
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
                if (!profile || profile.role !== 'admin' && profile.role !== 'mobile_manager') {
                    await supabase.auth.signOut();
                    set({
                        error: 'No tienes permisos de administrador.',
                        isLoading: false,
                        user: null,
                        session: null
                    });
                    return {
                        success: false,
                        error: 'Not admin'
                    };
                }
                set({
                    user: data.user,
                    session: data.session,
                    isLoading: false,
                    otpEmail: null
                });
                return {
                    success: true
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error desconocido';
                set({
                    error: message,
                    isLoading: false
                });
                return {
                    success: false,
                    error: message
                };
            }
        },
        signOut: async ()=>{
            set({
                isLoading: true
            });
            try {
                const supabase = getSupabase();
                await supabase.auth.signOut();
                set({
                    user: null,
                    session: null,
                    isLoading: false
                });
            } catch (error) {
                console.error('Sign out error:', error);
                set({
                    isLoading: false
                });
            }
        },
        clearError: ()=>set({
                error: null
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/AuthProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AuthProvider({ children }) {
    _s();
    const initialize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "AuthProvider.useAuthStore[initialize]": (state)=>state.initialize
    }["AuthProvider.useAuthStore[initialize]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            initialize();
        }
    }["AuthProvider.useEffect"], [
        initialize
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthProvider, "PDKoX6Aov6X+avJdSXinV5EMd0I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/ProtectedRoute.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProtectedRoute",
    ()=>ProtectedRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Spinner.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ProtectedRoute({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user, isLoading, isInitialized } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProtectedRoute.useEffect": ()=>{
            if (isInitialized && !isLoading && !user && pathname !== '/admin/login') {
                router.replace('/admin/login');
            }
        }
    }["ProtectedRoute.useEffect"], [
        user,
        isLoading,
        isInitialized,
        router,
        pathname
    ]);
    // Show loading while initializing
    if (!isInitialized || isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-beige-100",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                        size: "lg"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-warm-gray",
                        children: "Cargando..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    // If on login page, show it regardless of auth state
    if (pathname === '/admin/login') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    // If not authenticated, show nothing (will redirect)
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-beige-100",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                        size: "lg"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-warm-gray",
                        children: "Redirigiendo..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    // Authenticated, show children
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ProtectedRoute, "ZljizNJGQfGTwFqqx3L50toVDMc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = ProtectedRoute;
var _c;
__turbopack_context__.k.register(_c, "ProtectedRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/OtpChannelChoice.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OtpChannelChoice",
    ()=>OtpChannelChoice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
'use client';
;
;
function OtpChannelChoice({ email, phone, isLoading, onChooseEmail, onChooseWhatsApp }) {
    const hasEmail = Boolean(email);
    const hasPhone = Boolean(phone);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-warm-gray text-center mb-4",
                children: "¿Cómo quieres recibir tu código de verificación?"
            }, void 0, false, {
                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            hasEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onChooseEmail,
                disabled: isLoading,
                className: "w-full p-4 bg-white border-2 border-beige-200 rounded-xl hover:border-gold hover:shadow-md transition-all text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-6 h-6 text-gold animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                            lineNumber: 44,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                            className: "w-6 h-6 text-gold"
                        }, void 0, false, {
                            fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                            lineNumber: 46,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-dark",
                                children: "Correo electrónico"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-warm-gray",
                                children: email
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this),
            hasPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onChooseWhatsApp,
                disabled: isLoading,
                className: "w-full p-4 bg-white border-2 border-beige-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-6 h-6 text-green-600 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                            lineNumber: 66,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                            className: "w-6 h-6 text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                            lineNumber: 68,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-dark",
                                children: "WhatsApp"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-warm-gray",
                                children: phone
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth/OtpChannelChoice.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = OtpChannelChoice;
var _c;
__turbopack_context__.k.register(_c, "OtpChannelChoice");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/ProtectedRoute.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$OtpChannelChoice$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/OtpChannelChoice.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/WhatsAppBookingLink.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsAppBookingLink",
    ()=>WhatsAppBookingLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/track.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const PHONE = ("TURBOPACK compile-time value", "50764049464") || '50764049464';
function WhatsAppBookingLink({ message, cta, className, variant = 'button' }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('whatsapp');
    const text = message || 'Hola, quiero reservar una cita.';
    const handleClick = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["track"])('whatsapp_click', {
            meta: {
                cta
            }
        });
    };
    if (variant === 'link') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppUrl"])(PHONE, text),
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: handleClick,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2 text-sm font-medium text-dark/70 hover:text-dark underline underline-offset-4 transition-colors', className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                    className: "h-4 w-4 text-[#25D366]"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                t('bookAction')
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppUrl"])(PHONE, text),
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: handleClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full', 'border-2 border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white', 'text-sm font-medium transition-colors', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            t('bookAction')
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/WhatsAppBookingLink.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(WhatsAppBookingLink, "h6+q2O3NJKPY5uL0BIJGLIanww8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c = WhatsAppBookingLink;
var _c;
__turbopack_context__.k.register(_c, "WhatsAppBookingLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/PhoneInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PhoneInput",
    ()=>PhoneInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// The single phone-entry pattern for the whole site: country-code selector +
// local number. Emits digits only, WATI format (code + number, NO '+'),
// e.g. 50766124546. Keep the code list in sync with the portal login page.
const COUNTRY_CODES = [
    '507',
    '1',
    '52',
    '57',
    '506',
    '593',
    '51',
    '58',
    '34'
];
function splitValue(value) {
    const digits = (value || '').replace(/\D/g, '');
    // Longest code first so 507/506 win over 50, 57 etc.
    const byLength = [
        ...COUNTRY_CODES
    ].sort((a, b)=>b.length - a.length);
    for (const code of byLength){
        // Only treat it as a code when there is a number after it — a bare local
        // number like 66124546 stays local under the default +507.
        if (digits.startsWith(code) && digits.length > code.length + 5) {
            return {
                cc: code,
                local: digits.slice(code.length)
            };
        }
    }
    return {
        cc: '507',
        local: digits
    };
}
function PhoneInput({ value, onChange, placeholder = '6612 3456', required, disabled, inputClassName, selectClassName, showIcon = true }) {
    _s();
    const initial = splitValue(value);
    const [cc, setCc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial.cc);
    const [local, setLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial.local);
    // Adopt external value changes (async prefill from an API); no-op when the
    // change came from our own emit, so typing isn't disturbed.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PhoneInput.useEffect": ()=>{
            const digits = (value || '').replace(/\D/g, '');
            const current = local.replace(/\D/g, '') ? `${cc}${local.replace(/\D/g, '')}` : '';
            if (digits !== current) {
                const next = splitValue(digits);
                setCc(next.cc);
                setLocal(next.local);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PhoneInput.useEffect"], [
        value
    ]);
    const emit = (nextCc, nextLocal)=>{
        const digits = nextLocal.replace(/\D/g, '');
        onChange(digits ? `${nextCc}${digits}` : '');
    };
    const defaultInputCls = 'w-full py-3 border-2 border-beige-200 rounded-xl text-sm focus:outline-none ' + 'focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all disabled:opacity-50 ' + (showIcon ? 'pl-10 pr-3' : 'px-3');
    const defaultSelectCls = 'w-24 px-2 py-3 border-2 border-beige-200 rounded-xl text-sm bg-white ' + 'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all disabled:opacity-50';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: `+${cc}`,
                onChange: (e)=>{
                    const next = e.target.value.replace('+', '');
                    setCc(next);
                    emit(next, local);
                },
                disabled: disabled,
                className: selectClassName || defaultSelectCls,
                "aria-label": "Código de país",
                children: COUNTRY_CODES.map((code)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: `+${code}`,
                        children: [
                            "+",
                            code
                        ]
                    }, code, true, {
                        fileName: "[project]/src/components/shared/PhoneInput.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/shared/PhoneInput.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1",
                children: [
                    showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/PhoneInput.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "tel",
                        value: local,
                        onChange: (e)=>{
                            setLocal(e.target.value);
                            emit(cc, e.target.value);
                        },
                        placeholder: placeholder,
                        required: required,
                        disabled: disabled,
                        className: inputClassName || defaultInputCls
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/PhoneInput.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/PhoneInput.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/PhoneInput.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(PhoneInput, "fwzv1SRuXrhM8/O/56V6Brkw+QQ=");
_c = PhoneInput;
var _c;
__turbopack_context__.k.register(_c, "PhoneInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/steps/AuthStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthStep",
    ()=>AuthStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OtpInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OtpInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/auth/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$OtpChannelChoice$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/OtpChannelChoice.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/WhatsAppBookingLink.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$PhoneInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/PhoneInput.tsx [app-client] (ecmascript)");
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
function AuthStepContent() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const locale = params.locale || 'es';
    const { setClientInfo, nextStep, setStep, addService, loadPromotion, setLoading, setError, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const supabaseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [credential, setCredential] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [countryCode, setCountryCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('+507');
    const [authState, setAuthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('credential');
    const [isVerifying, setIsVerifying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [availableClients, setAvailableClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedClient, setSelectedClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [otpChannel, setOtpChannel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [registrationData, setRegistrationData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    // Guardrail: when a registration matches an EXISTING Mindbody account whose
    // name differs from what was typed, we pause and ask "is this you?" instead
    // of silently booking under the other name (real case: someone typed "Josue
    // Chavez" but the email belonged to another client's account).
    const [existingAccount, setExistingAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Dual verification for claiming an existing account with new data: the
    // person must confirm BOTH the email and the WhatsApp number they typed
    // before we update the Mindbody record. null = normal single-channel OTP.
    const [dualStage, setDualStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingUpdate, setPendingUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const getSupabase = ()=>{
        if (!supabaseRef.current) {
            const { getClient } = __turbopack_context__.r("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
            supabaseRef.current = getClient();
        }
        return supabaseRef.current;
    };
    // Auth now sits right before confirmation — deep-link preselection already
    // happened at page load, so after identifying we simply continue.
    const proceedAfterAuth = async (_clientId)=>{
        nextStep();
    };
    // Check for existing session on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthStepContent.useEffect": ()=>{
            const checkSession = {
                "AuthStepContent.useEffect.checkSession": async ()=>{
                    const supabase = getSupabase();
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        let mindbodyClientId = null;
                        // Fetch from Supabase profile (authoritative)
                        try {
                            const response = await fetch('/api/portal/client-id');
                            if (response.ok) {
                                const data = await response.json();
                                if (data.clientId) mindbodyClientId = data.clientId;
                            }
                        } catch (err) {
                            console.error('Error fetching client ID:', err);
                        }
                        // Fallback to user metadata
                        if (!mindbodyClientId && session.user.user_metadata?.mindbody_client_id) {
                            mindbodyClientId = session.user.user_metadata.mindbody_client_id;
                        }
                        if (mindbodyClientId) {
                            try {
                                const response = await fetch(`/api/portal/profile?clientId=${mindbodyClientId}`);
                                if (response.ok) {
                                    const data = await response.json();
                                    setClientInfo(data.client);
                                    await proceedAfterAuth(mindbodyClientId);
                                    return;
                                }
                            } catch (err) {
                                console.error('Error fetching client:', err);
                            }
                        }
                        if (session.user.email) {
                            setCredential(session.user.email);
                        }
                    }
                }
            }["AuthStepContent.useEffect.checkSession"];
            checkSession();
        }
    }["AuthStepContent.useEffect"], [
        setClientInfo,
        nextStep,
        setStep,
        addService,
        loadPromotion,
        searchParams
    ]);
    const handleCredentialSubmit = async ()=>{
        const cc = countryCode.replace(/\D/g, '');
        const local = credential.trim().replace(/\D/g, '');
        if (!local) {
            setError('Ingresa tu número de teléfono');
            return;
        }
        // WATI format: country code + number, NO + sign (e.g. 50766124546).
        // If the user typed their country code again, don't double-prefix it.
        const trimmed = local.startsWith(cc) && local.length > 9 ? local : `${cc}${local}`;
        if (trimmed.length < 10) {
            setError('Escribe tu número completo (ej: 6612 3456)');
            return;
        }
        setAuthState('sending');
        setError(null);
        setLoading(true);
        try {
            const response = await fetch('/api/portal/auth/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credential: trimmed
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al buscar cuenta');
            }
            if (data.notFound || data.clients.length === 0) {
                setRegistrationData((prev)=>({
                        ...prev,
                        phone: trimmed
                    }));
                setAuthState('register');
                return;
            }
            if (data.clients.length > 1) {
                setAvailableClients(data.clients);
                setAuthState('select-client');
                return;
            }
            const client = data.clients[0];
            setSelectedClient({
                clientId: client.Id,
                clientName: client.displayName || `${client.FirstName} ${client.LastName}`.trim(),
                email: client.Email,
                phone: client.MobilePhone
            });
            setAuthState('channel-choice');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
            setAuthState('credential');
        } finally{
            setLoading(false);
        }
    };
    const handleSelectClient = (client)=>{
        setSelectedClient({
            clientId: client.Id,
            clientName: client.displayName || `${client.FirstName} ${client.LastName}`.trim(),
            email: client.Email,
            phone: client.MobilePhone
        });
        setAvailableClients([]);
        setAuthState('channel-choice');
    };
    const handleChooseEmail = async ()=>{
        if (!selectedClient?.email) return;
        setLoading(true);
        setError(null);
        try {
            const supabase = getSupabase();
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: selectedClient.email,
                options: {
                    data: {
                        mindbody_client_id: selectedClient.clientId
                    }
                }
            });
            if (authError) throw new Error(authError.message);
            setOtpChannel('email');
            setAuthState('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar código');
        } finally{
            setLoading(false);
        }
    };
    const handleChooseWhatsApp = async ()=>{
        if (!selectedClient?.phone) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/portal/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: selectedClient.phone,
                    clientId: selectedClient.clientId,
                    clientName: selectedClient.clientName
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al enviar código');
            setOtpChannel('whatsapp');
            setAuthState('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar código por WhatsApp');
        } finally{
            setLoading(false);
        }
    };
    // Claiming an existing account with changed data: verify the typed email
    // first, then the typed WhatsApp number, then apply the update.
    const startDualVerification = async ()=>{
        if (!existingAccount || !pendingUpdate) return;
        setLoading(true);
        setError(null);
        try {
            const supabase = getSupabase();
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: pendingUpdate.email,
                options: {
                    data: {
                        mindbody_client_id: existingAccount.client.clientId
                    }
                }
            });
            if (authError) throw new Error(authError.message);
            setSelectedClient({
                clientId: existingAccount.client.clientId,
                clientName: existingAccount.client.clientName,
                email: pendingUpdate.email,
                phone: pendingUpdate.phone
            });
            setDualStage('email');
            setOtpChannel('email');
            setAuthState('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar código');
        } finally{
            setLoading(false);
        }
    };
    const handleVerifyOtp = async (code)=>{
        if (!selectedClient) return;
        setIsVerifying(true);
        setError(null);
        try {
            if (otpChannel === 'email') {
                const supabase = getSupabase();
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    email: selectedClient.email,
                    token: code,
                    type: 'email'
                });
                if (verifyError) throw new Error(verifyError.message);
                // Dual verification, step 1 done: now confirm the WhatsApp number
                // before touching the account.
                if (dualStage === 'email') {
                    const response = await fetch('/api/portal/auth/send-otp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            phone: selectedClient.phone,
                            clientId: selectedClient.clientId,
                            clientName: selectedClient.clientName
                        })
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Error al enviar código por WhatsApp');
                    setDualStage('whatsapp');
                    setOtpChannel('whatsapp');
                    setIsVerifying(false);
                    return;
                }
                // Save profile and link (fire-and-forget)
                Promise.all([
                    fetch('/api/portal/auth/save-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            clientId: selectedClient.clientId
                        })
                    }),
                    fetch('/api/portal/auth/link-account', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            credential: selectedClient.email,
                            credentialType: 'email',
                            clientId: selectedClient.clientId,
                            clientName: selectedClient.clientName
                        })
                    })
                ]).catch((err)=>console.error('Error saving profile/link:', err));
            } else {
                const response = await fetch('/api/portal/auth/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: selectedClient.phone,
                        otp_code: code,
                        email: selectedClient.email,
                        clientId: selectedClient.clientId,
                        clientName: selectedClient.clientName
                    })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Código incorrecto');
                // In dual verification the email step already created the session;
                // this step only proves ownership of the WhatsApp number.
                if (dualStage !== 'whatsapp') {
                    const supabase = getSupabase();
                    const { error: sessionError } = await supabase.auth.verifyOtp({
                        token_hash: data.token_hash,
                        type: 'magiclink'
                    });
                    if (sessionError) throw new Error(sessionError.message);
                }
            }
            // Both channels confirmed: apply the typed data to the Mindbody account
            if (dualStage === 'whatsapp' && pendingUpdate) {
                const updateRes = await fetch('/api/portal/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        clientId: selectedClient.clientId,
                        updates: {
                            FirstName: pendingUpdate.firstName,
                            LastName: pendingUpdate.lastName,
                            Email: pendingUpdate.email,
                            MobilePhone: pendingUpdate.phone
                        }
                    })
                });
                if (!updateRes.ok) {
                    const body = await updateRes.json().catch(()=>null);
                    throw new Error(body?.error || 'No se pudo actualizar tu perfil');
                }
                setDualStage(null);
                setPendingUpdate(null);
            }
            // Fetch client info and proceed
            const profileResponse = await fetch(`/api/portal/profile?clientId=${selectedClient.clientId}`);
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                setClientInfo(profileData.client);
            }
            await proceedAfterAuth(selectedClient.clientId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Código inválido');
            setIsVerifying(false);
        }
    };
    const handleResendOtp = async ()=>{
        if (!selectedClient) return;
        setError(null);
        setIsVerifying(false);
        try {
            if (otpChannel === 'email') {
                const supabase = getSupabase();
                const { error: authError } = await supabase.auth.signInWithOtp({
                    email: selectedClient.email,
                    options: {
                        data: {
                            mindbody_client_id: selectedClient.clientId
                        }
                    }
                });
                if (authError) throw new Error(authError.message);
            } else {
                const response = await fetch('/api/portal/auth/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: selectedClient.phone,
                        clientId: selectedClient.clientId,
                        clientName: selectedClient.clientName
                    })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Error al reenviar');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reenviar código');
        }
    };
    const handleRegistration = async ()=>{
        const { firstName, lastName, email: regEmail, phone } = registrationData;
        if (!firstName || !lastName || !regEmail || !phone) {
            setError('Por favor completa todos los campos');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/mindbody/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'register',
                    firstName,
                    lastName,
                    email: regEmail,
                    phone,
                    searchText: regEmail,
                    searchType: 'email'
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al registrar');
            const accountName = `${data.client.FirstName || ''} ${data.client.LastName || ''}`.trim();
            const typedName = `${firstName} ${lastName}`.trim();
            const foundClient = {
                clientId: data.client.Id,
                clientName: accountName || typedName,
                email: data.client.Email || regEmail,
                phone: data.client.MobilePhone || phone
            };
            // The email/phone matched an existing account under a DIFFERENT name:
            // stop and confirm identity instead of booking under the wrong person.
            const norm = (s)=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
            const sameFirstName = norm(accountName).split(' ')[0] === norm(typedName).split(' ')[0];
            if (data.existingClient && accountName && !sameFirstName) {
                setExistingAccount({
                    client: foundClient,
                    typedName
                });
                setPendingUpdate({
                    firstName,
                    lastName,
                    email: regEmail,
                    phone
                });
                setAuthState('confirm-identity');
                return;
            }
            setSelectedClient(foundClient);
            setAuthState('channel-choice');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally{
            setLoading(false);
        }
    };
    const handleKeyPress = (e)=>{
        if (e.key === 'Enter') handleCredentialSubmit();
    };
    // OTP step
    if (authState === 'otp') {
        const channelLabel = otpChannel === 'email' ? selectedClient?.email : selectedClient?.phone;
        const channelBg = otpChannel === 'email' ? 'bg-gold/10' : 'bg-green-50';
        const ChannelIcon = otpChannel === 'email' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
            className: "w-7 h-7 text-gold"
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 524,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
            className: "w-7 h-7 text-green-600"
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 525,
            columnNumber: 9
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-step flex flex-col h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md mx-auto text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-14 h-14 ${channelBg} rounded-full flex items-center justify-center mx-auto mb-4`,
                            children: ChannelIcon
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 531,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-dark mb-2",
                            children: dualStage ? `Ingresa tu código (paso ${dualStage === 'email' ? '1' : '2'} de 2)` : 'Ingresa tu código'
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 535,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-warm-gray mb-4",
                            children: [
                                otpChannel === 'email' ? 'Enviamos un código de 6 dígitos a' : 'Enviamos un código por WhatsApp a',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 540,
                                    columnNumber: 115
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-dark",
                                    children: channelLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 541,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 539,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OtpInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OtpInput"], {
                            onComplete: handleVerifyOtp,
                            disabled: isVerifying,
                            error: !!error
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 544,
                            columnNumber: 13
                        }, this),
                        isVerifying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex items-center justify-center gap-2 text-warm-gray",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-4 h-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 548,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm",
                                    children: "Verificando..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 549,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 547,
                            columnNumber: 15
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 554,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleResendOtp,
                                    disabled: isVerifying,
                                    className: "flex items-center justify-center gap-1.5 mx-auto text-gold hover:text-gold/80 font-medium transition-colors text-sm disabled:opacity-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 565,
                                            columnNumber: 17
                                        }, this),
                                        "Reenviar código"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 560,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setAuthState('channel-choice');
                                        setOtpChannel(null);
                                        setError(null);
                                        setIsVerifying(false);
                                    },
                                    className: "text-warm-gray hover:text-dark transition-colors text-sm",
                                    children: "← Cambiar canal"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 568,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 559,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                    lineNumber: 530,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 529,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 528,
            columnNumber: 7
        }, this);
    }
    // Channel choice step
    if (authState === 'channel-choice' && selectedClient) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-step flex flex-col h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 595,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 593,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-dark mb-0.5",
                                    children: "Verificar identidad"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 597,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-warm-gray",
                                    children: [
                                        "Hola ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-dark",
                                            children: selectedClient.clientName
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 599,
                                            columnNumber: 22
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 598,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 592,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 604,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$OtpChannelChoice$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OtpChannelChoice"], {
                            email: selectedClient.email,
                            phone: selectedClient.phone,
                            isLoading: isLoading,
                            onChooseEmail: handleChooseEmail,
                            onChooseWhatsApp: handleChooseWhatsApp
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 609,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setAuthState('credential');
                                setSelectedClient(null);
                                setError(null);
                            },
                            className: "w-full mt-3 py-2 text-sm text-warm-gray hover:text-dark transition-colors",
                            children: "← Usar otro correo o teléfono"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 617,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                    lineNumber: 591,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 590,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 589,
            columnNumber: 7
        }, this);
    }
    // Multiple clients selection
    if (authState === 'select-client') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-step flex flex-col h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 642,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 640,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-dark mb-0.5",
                                    children: "Selecciona tu Perfil"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 644,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-warm-gray",
                                    children: "Encontramos varias cuentas asociadas a este dato"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 645,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 639,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 649,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 mb-4",
                            children: availableClients.map((client)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleSelectClient(client),
                                    disabled: isLoading,
                                    className: "w-full p-3 bg-white border border-beige-200 rounded-xl transition-all flex items-center gap-3 text-left hover:border-gold hover:shadow-md cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-5 h-5 text-gold"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 664,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 663,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-dark text-sm",
                                                    children: client.displayName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 667,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-warm-gray",
                                                    children: client.Email || client.MobilePhone || '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 668,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 666,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, client.Id, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 656,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 654,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setAvailableClients([]);
                                setAuthState('credential');
                                setError(null);
                            },
                            className: "w-full py-2 text-sm text-warm-gray hover:text-dark transition-colors",
                            children: "← Usar otro correo o teléfono"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 674,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                    lineNumber: 638,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 637,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 636,
            columnNumber: 7
        }, this);
    }
    // Identity guardrail: the typed email/phone belongs to an existing account
    // with a different name — confirm before booking under it.
    if (authState === 'confirm-identity' && existingAccount) {
        const parts = existingAccount.client.clientName.split(/\s+/);
        const maskedName = `${parts[0]} ${(parts[1]?.[0] || '').toUpperCase()}.`.trim();
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-step flex flex-col h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md mx-auto text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "w-7 h-7 text-gold"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 700,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 699,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-dark mb-2",
                            children: "Ya existe una cuenta"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 702,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-warm-gray mb-5",
                            children: [
                                "El correo o teléfono que ingresaste pertenece a una cuenta a nombre de",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-dark",
                                    children: maskedName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 705,
                                    columnNumber: 15
                                }, this),
                                ", no de",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-dark",
                                    children: existingAccount.typedName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 706,
                                    columnNumber: 15
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 703,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: startDualVerification,
                                    disabled: isLoading,
                                    className: "w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50",
                                    children: isLoading ? 'Enviando código…' : 'Es mi cuenta — actualizar mis datos'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 709,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setSelectedClient(existingAccount.client);
                                        setExistingAccount(null);
                                        setPendingUpdate(null);
                                        setAuthState('channel-choice');
                                    },
                                    className: "w-full py-3 border-2 border-beige-200 text-dark font-medium rounded-xl hover:border-gold/50 transition-all text-sm",
                                    children: [
                                        "Continuar como ",
                                        maskedName,
                                        " sin cambios"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 717,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setExistingAccount(null);
                                        setPendingUpdate(null);
                                        setRegistrationData((prev)=>({
                                                ...prev,
                                                email: '',
                                                phone: ''
                                            }));
                                        setAuthState('register');
                                    },
                                    className: "w-full py-3 text-warm-gray font-medium rounded-xl hover:text-dark transition-all text-sm",
                                    children: "No soy yo — usar otro correo y teléfono"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 729,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 708,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-xs text-warm-gray",
                            children: "Para actualizar los datos te enviaremos un código a tu correo y otro a tu WhatsApp — así confirmamos que ambos te pertenecen."
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 742,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                    lineNumber: 698,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 697,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 696,
            columnNumber: 7
        }, this);
    }
    // Registration form
    if (authState === 'register') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-step flex flex-col h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 761,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 759,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-dark mb-0.5",
                                    children: "Crear Cuenta"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 763,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-warm-gray",
                                    children: "Número no registrado. Completa tus datos para crear una cuenta."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 764,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 758,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-medium text-dark mb-1",
                                                    children: "Nombre"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 770,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: registrationData.firstName,
                                                    onChange: (e)=>setRegistrationData((prev)=>({
                                                                ...prev,
                                                                firstName: e.target.value
                                                            })),
                                                    className: "w-full px-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all",
                                                    placeholder: "Tu nombre"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 771,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 769,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-medium text-dark mb-1",
                                                    children: "Apellido"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 780,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: registrationData.lastName,
                                                    onChange: (e)=>setRegistrationData((prev)=>({
                                                                ...prev,
                                                                lastName: e.target.value
                                                            })),
                                                    className: "w-full px-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all",
                                                    placeholder: "Tu apellido"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 779,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 768,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-dark mb-1",
                                            children: "Correo Electrónico"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 792,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    value: registrationData.email,
                                                    onChange: (e)=>setRegistrationData((prev)=>({
                                                                ...prev,
                                                                email: e.target.value
                                                            })),
                                                    className: "w-full pl-10 pr-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all",
                                                    placeholder: "correo@ejemplo.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 793,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 791,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-dark mb-1",
                                            children: "Teléfono / WhatsApp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 806,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$PhoneInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PhoneInput"], {
                                            value: registrationData.phone,
                                            onChange: (phone)=>setRegistrationData((prev)=>({
                                                        ...prev,
                                                        phone
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                            lineNumber: 807,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 805,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 767,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 815,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleRegistration,
                                    disabled: isLoading,
                                    className: "w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 830,
                                                columnNumber: 21
                                            }, this),
                                            "Creando cuenta..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Crear Cuenta y Continuar",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 832,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 821,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setAuthState('credential');
                                        setError(null);
                                    },
                                    className: "w-full py-2 text-sm text-warm-gray hover:text-dark transition-colors",
                                    children: "← Volver"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 836,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 820,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                    lineNumber: 757,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 756,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 755,
            columnNumber: 7
        }, this);
    }
    // Main credential input form
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "auth-step flex flex-col h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 overflow-y-auto pb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "w-5 h-5 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 860,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 858,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-dark mb-0.5",
                                children: "Último paso"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 862,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-warm-gray",
                                children: "Confirma tu número de teléfono para completar tu reserva"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 863,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 857,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-3 bg-beige-50 rounded-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-dark mb-1.5",
                                children: "Al iniciar sesión podrás:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 869,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "text-xs text-warm-gray space-y-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "• Ver tu historial de citas y compras"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 871,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "• Gestionar tus próximas reservaciones"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 872,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "• Recibir ofertas exclusivas"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 873,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "• Agilizar futuras reservas"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 874,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 870,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 868,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-medium text-dark mb-1.5",
                                children: "Número de teléfono"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 879,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: countryCode,
                                        onChange: (e)=>setCountryCode(e.target.value),
                                        disabled: authState === 'sending',
                                        className: "w-24 px-2 py-3 border-2 border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all bg-white disabled:opacity-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+507",
                                                children: "+507"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 891,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+1",
                                                children: "+1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 892,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+52",
                                                children: "+52"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 893,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+57",
                                                children: "+57"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 894,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+506",
                                                children: "+506"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 895,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+593",
                                                children: "+593"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 896,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+51",
                                                children: "+51"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 897,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+58",
                                                children: "+58"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 898,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "+34",
                                                children: "+34"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 899,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 883,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 902,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "tel",
                                                value: credential,
                                                onChange: (e)=>setCredential(e.target.value),
                                                onKeyPress: handleKeyPress,
                                                disabled: authState === 'sending',
                                                className: "w-full pl-10 pr-3 py-3 border-2 border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all disabled:opacity-50",
                                                placeholder: "6612 3456",
                                                autoFocus: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                                lineNumber: 903,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                        lineNumber: 901,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 882,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-warm-gray",
                                children: "Selecciona tu código de país e ingresa tu número (sin el código)."
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                lineNumber: 917,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 878,
                        columnNumber: 11
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 921,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCredentialSubmit,
                        disabled: authState === 'sending' || !credential.trim(),
                        className: "w-full mt-4 py-3 bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                        children: authState === 'sending' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-4 h-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 935,
                                    columnNumber: 17
                                }, this),
                                "Buscando..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                "Continuar",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                                    lineNumber: 937,
                                    columnNumber: 26
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 926,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-center text-xs text-warm-gray",
                        children: "Te enviaremos un código de verificación"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 941,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 pt-4 border-t border-beige-200 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$WhatsAppBookingLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WhatsAppBookingLink"], {
                            cta: "booking_auth_step",
                            variant: "link"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                            lineNumber: 947,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 946,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 856,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 855,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
        lineNumber: 854,
        columnNumber: 5
    }, this);
}
_s(AuthStepContent, "I82mMsUooVtxXcwp9tjWeZqyZkQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = AuthStepContent;
function AuthStepLoading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "auth-step flex flex-col h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 overflow-y-auto pb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md mx-auto text-center py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-6 h-6 animate-spin text-gold mx-auto mb-3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 960,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-warm-gray",
                        children: "Cargando..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                        lineNumber: 961,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
                lineNumber: 959,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 958,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
        lineNumber: 957,
        columnNumber: 5
    }, this);
}
_c1 = AuthStepLoading;
function AuthStep() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthStepLoading, {}, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 970,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthStepContent, {}, void 0, false, {
            fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
            lineNumber: 971,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/steps/AuthStep.tsx",
        lineNumber: 970,
        columnNumber: 5
    }, this);
}
_c2 = AuthStep;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AuthStepContent");
__turbopack_context__.k.register(_c1, "AuthStepLoading");
__turbopack_context__.k.register(_c2, "AuthStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/shared/LocationPills.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocationPills",
    ()=>LocationPills
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function LocationPills() {
    _s();
    const { locations, setLocations, selectedLocation, setLocation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Fetch locations once (store-cached)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocationPills.useEffect": ()=>{
            async function fetchLocations() {
                if (locations.length > 0) return;
                setIsLoading(true);
                try {
                    const response = await fetch('/api/mindbody/locations');
                    const data = await response.json();
                    if (response.ok) setLocations(data.locations);
                } catch  {
                // Pills simply stay empty; the step shows a retry via services error
                } finally{
                    setIsLoading(false);
                }
            }
            fetchLocations();
        }
    }["LocationPills.useEffect"], [
        locations.length,
        setLocations
    ]);
    const handleSelect = (location)=>{
        if (selectedLocation?.Id === location.Id) return;
        setLocation(location);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-2 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1 text-xs text-warm-gray mr-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "w-3.5 h-3.5 text-gold"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            "Spa:"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    isLoading && locations.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-4 h-4 animate-spin text-gold"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    locations.map((location)=>{
                        const isSelected = selectedLocation?.Id === location.Id;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleSelect(location),
                            className: `
                px-4 py-2 rounded-full text-sm font-medium border-2 transition-all
                ${isSelected ? 'bg-gold text-dark border-gold shadow-sm' : 'bg-white text-warm-gray border-beige-200 hover:border-gold/50 hover:text-dark'}
              `,
                            children: location.Name
                        }, location.Id, false, {
                            fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            !selectedLocation && !isLoading && locations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-xs text-gold-600 font-medium mt-2",
                children: "Elige tu spa para ver los tratamientos"
            }, void 0, false, {
                fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/shared/LocationPills.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(LocationPills, "LADnjVTnkAel3joS1t7SFQeP8Kc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = LocationPills;
var _c;
__turbopack_context__.k.register(_c, "LocationPills");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/steps/ServiceStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceStep",
    ()=>ServiceStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$LocationPills$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/shared/LocationPills.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Description Modal Component
function DescriptionModal({ service, onClose, discountPercent = 0, showDiscount = false }) {
    const discountedPrice = showDiscount && discountPercent > 0 ? Math.round(service.Price * (1 - discountPercent / 100) * 100) / 100 : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
        onClick: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/50"
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.95
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.95
                },
                transition: {
                    duration: 0.2
                },
                className: "relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-5 py-4 border-b border-beige-200 bg-gradient-to-r from-gold-50 to-beige-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-dark text-lg leading-snug",
                                            children: service.Name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 47,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mt-1",
                                            children: [
                                                service.Price > 0 ? discountedPrice !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm line-through text-warm-gray",
                                                            children: [
                                                                "$",
                                                                service.Price.toFixed(0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 54,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-green-600",
                                                            children: [
                                                                "$",
                                                                discountedPrice.toFixed(0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 55,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 53,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gold-600 font-bold",
                                                    children: [
                                                        "$",
                                                        service.Price.toFixed(0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 58,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gold-600 font-bold",
                                                    children: "Consultar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 61,
                                                    columnNumber: 19
                                                }, this),
                                                service.Duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1 text-xs text-warm-gray bg-white/80 px-2 py-0.5 rounded-full",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 65,
                                                            columnNumber: 21
                                                        }, this),
                                                        service.Duration,
                                                        " min"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "p-1.5 rounded-full hover:bg-white/80 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-5 h-5 text-warm-gray"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-5 py-4 overflow-y-auto max-h-[50vh]",
                        children: service.Description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-warm-gray-600 leading-relaxed prose prose-sm [&_p]:mb-2 [&_br]:hidden",
                            dangerouslySetInnerHTML: {
                                __html: service.Description
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-warm-gray italic",
                            children: "No hay descripción disponible para este tratamiento."
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = DescriptionModal;
// Promotion Tile Component - Shows only final price, with expandable services list
function PromotionTile({ promotion, isSelected, isLoading, onSelect, allServices }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Get service names from the allServices list
    // Check both Id (SessionTypeId) and ProductId since promotions might store either
    const includedServices = promotion.mindbody_service_ids ? allServices.filter((s)=>promotion.mindbody_service_ids.includes(s.Id) || s.ProductId && promotion.mindbody_service_ids.includes(s.ProductId)) : [];
    const handleToggleExpand = (e)=>{
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `
        promo-card relative rounded-2xl transition-all duration-200 overflow-hidden text-left w-full h-full
        bg-dark/85 text-cream
        ${isSelected ? 'ring-2 ring-gold shadow-[0_8px_30px_rgba(252,207,8,0.35)]' : 'shadow-lg hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]'}
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
      `,
        children: [
            promotion.image_url && // eslint-disable-next-line @next/next/no-img-element
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: promotion.image_url,
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover opacity-25"
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onSelect,
                disabled: isLoading,
                className: "relative w-full text-left p-2.5 pb-2",
                children: [
                    isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1.5 right-1.5 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "w-5 h-5 bg-gold rounded-full flex items-center justify-center shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-3.5 h-3.5 text-dark"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-display font-semibold text-cream !text-sm sm:!text-base leading-snug pr-6 mb-1.5 line-clamp-2",
                        children: promotion.title_es
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-baseline gap-2 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base sm:text-lg font-bold text-white",
                                children: [
                                    "$",
                                    promotion.price.toFixed(0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            promotion.duration_minutes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-0.5 text-[10px] sm:text-xs text-cream/70 bg-white/10 px-1.5 py-0.5 rounded-full whitespace-nowrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this),
                                    promotion.duration_minutes,
                                    " min"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-dark/50 flex items-center justify-center rounded-2xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-6 h-6 text-gold animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 195,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            includedServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleToggleExpand,
                        className: "relative w-full px-2.5 py-1.5 border-t border-white/15 flex items-center justify-between text-[11px] text-neutral-300 hover:bg-white/5 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Ver ",
                                    includedServices.length,
                                    " servicio",
                                    includedServices.length !== 1 ? 's' : '',
                                    " incluido",
                                    includedServices.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this),
                            isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 212,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                height: 0,
                                opacity: 0
                            },
                            animate: {
                                height: 'auto',
                                opacity: 1
                            },
                            exit: {
                                height: 0,
                                opacity: 0
                            },
                            transition: {
                                duration: 0.2
                            },
                            className: "overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative px-2.5 pb-2.5 pt-1 space-y-1.5",
                                children: includedServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gold text-xs mt-0.5",
                                                children: "✓"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 230,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-cream",
                                                        children: service.Name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 25
                                                    }, this),
                                                    service.Duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-cream/60",
                                                        children: [
                                                            service.Duration,
                                                            " min"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 231,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, service.Id, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 229,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 227,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 220,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(PromotionTile, "FPNvbbHVlWWR4LKxxNntSxiIS38=");
_c1 = PromotionTile;
// Category configuration with icons and colors
const CATEGORY_CONFIG = {
    'Tratamientos Corporales': {
        icon: '💆',
        color: 'bg-amber-100',
        gradient: 'from-amber-500/20 to-amber-600/5'
    },
    'Tratamientos Faciales': {
        icon: '✨',
        color: 'bg-pink-100',
        gradient: 'from-pink-500/20 to-pink-600/5'
    },
    'Paquetes Deluxe': {
        icon: '👑',
        color: 'bg-purple-100',
        gradient: 'from-purple-500/20 to-purple-600/5'
    },
    'Paquetes de Masajes': {
        icon: '🌿',
        color: 'bg-green-100',
        gradient: 'from-green-500/20 to-green-600/5'
    },
    'Tratamientos Parejas': {
        icon: '💕',
        color: 'bg-red-100',
        gradient: 'from-red-500/20 to-red-600/5'
    },
    'TAI': {
        icon: '🧘',
        color: 'bg-blue-100',
        gradient: 'from-blue-500/20 to-blue-600/5'
    },
    'Eventos': {
        icon: '🎉',
        color: 'bg-yellow-100',
        gradient: 'from-yellow-500/20 to-yellow-600/5'
    }
};
const DEFAULT_CONFIG = {
    icon: '🌸',
    color: 'bg-beige-100',
    gradient: 'from-gold/20 to-gold/5'
};
// Service Tile Component - Clickable anywhere
function ServiceTile({ service, isSelected, onToggle, onShowDescription, discountPercent = 0, showDiscount = false }) {
    const discountedPrice = showDiscount && discountPercent > 0 ? Math.round(service.Price * (1 - discountPercent / 100) * 100) / 100 : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `
        relative h-[112px] rounded-xl border-2 transition-all duration-200 overflow-hidden text-left w-full
        ${isSelected ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/20' : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'}
      `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onToggle,
                className: "w-full h-full text-left p-2.5 flex flex-col",
                children: [
                    isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1.5 right-1.5 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-5 h-5 bg-gold rounded-full flex items-center justify-center shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-3.5 h-3.5 text-dark"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 302,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pr-5 mb-1.5 flex-1 min-h-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "font-semibold text-dark text-xs sm:text-sm leading-snug line-clamp-2",
                            children: service.Name
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 flex-wrap pr-6",
                        children: [
                            service.Price > 0 ? discountedPrice !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs line-through text-warm-gray",
                                        children: [
                                            "$",
                                            service.Price.toFixed(0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-base font-bold text-green-600",
                                        children: [
                                            "$",
                                            discountedPrice.toFixed(0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 320,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 318,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-base font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`,
                                children: [
                                    "$",
                                    service.Price.toFixed(0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 323,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-base font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`,
                                children: "Consultar"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this),
                            service.Duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-0.5 text-[10px] sm:text-xs text-warm-gray bg-beige-100 px-1.5 py-0.5 rounded-full whitespace-nowrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 334,
                                        columnNumber: 15
                                    }, this),
                                    service.Duration,
                                    " min"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: (e)=>{
                    e.stopPropagation();
                    onShowDescription();
                },
                className: "absolute bottom-1.5 right-1.5 p-1 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors",
                title: "Ver descripción",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                    className: "w-3.5 h-3.5 text-gold-600"
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                    lineNumber: 351,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 342,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
        lineNumber: 283,
        columnNumber: 5
    }, this);
}
_c2 = ServiceTile;
function ServiceStep() {
    _s1();
    const { selectedLocation, services, setServices, selectedServices, addService, removeService, activePromotion, loadPromotion, clearPromotion, setStep, globalDiscountPercent, globalDiscountActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0;
    const hasServices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectHasServices"]);
    const [groupedServices, setGroupedServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [topPickServices, setTopPickServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [treatmentSettings, setTreatmentSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [expandedCategories, setExpandedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isRecommendationsExpanded, setIsRecommendationsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isPromotionsExpanded, setIsPromotionsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isLoadingServices, setIsLoadingServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [servicesError, setServicesError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [descriptionService, setDescriptionService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Promotion state
    const [activePromotions, setActivePromotions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const promoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [loadingPromotionId, setLoadingPromotionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch services, treatment settings, and active promotions on mount
    // State for all online services (for promotion lookups - no session type filter)
    const [allOnlineServices, setAllOnlineServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServiceStep.useEffect": ()=>{
            async function fetchServicesAndPromotions() {
                if (!selectedLocation) return;
                setIsLoadingServices(true);
                setServicesError(null);
                try {
                    // Fetch services twice:
                    // 1. Regular services (with session type filter) for direct booking
                    // 2. All online services (no session type filter) for promotion display
                    // Also fetch treatment settings and active promotions
                    const [servicesResponse, allServicesResponse, settingsResponse, promotionsResponse] = await Promise.all([
                        fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=main`),
                        fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=main&forPromotions=true`),
                        fetch('/api/treatments/settings'),
                        fetch('/api/promotions?active=true')
                    ]);
                    const servicesData = await servicesResponse.json();
                    const allServicesData = await allServicesResponse.json();
                    const settingsData = await settingsResponse.json();
                    const promotionsData = await promotionsResponse.json();
                    if (!servicesResponse.ok) {
                        throw new Error(servicesData.error || 'Error al cargar servicios');
                    }
                    // Create a map of settings by mindbody_service_id
                    const settingsMap = new Map();
                    if (settingsData.settings) {
                        for (const setting of settingsData.settings){
                            settingsMap.set(setting.mindbody_service_id, setting);
                        }
                    }
                    setTreatmentSettings(settingsMap);
                    // Helper to check if service should be shown in booking widget
                    // Default to true if no setting exists (allow services without explicit settings)
                    const shouldShowInBooking = {
                        "ServiceStep.useEffect.fetchServicesAndPromotions.shouldShowInBooking": (serviceId)=>{
                            const setting = settingsMap.get(serviceId);
                            return setting?.show_in_booking !== false // Show if not explicitly hidden
                            ;
                        }
                    }["ServiceStep.useEffect.fetchServicesAndPromotions.shouldShowInBooking"];
                    // Admin-managed ordering (drag & drop in /admin/tratamientos)
                    const orderOf = {
                        "ServiceStep.useEffect.fetchServicesAndPromotions.orderOf": (id)=>settingsMap.get(id)?.sort_order ?? 9999
                    }["ServiceStep.useEffect.fetchServicesAndPromotions.orderOf"];
                    const bySortOrder = {
                        "ServiceStep.useEffect.fetchServicesAndPromotions.bySortOrder": (a, b)=>orderOf(a.Id) - orderOf(b.Id) || a.Name.localeCompare(b.Name)
                    }["ServiceStep.useEffect.fetchServicesAndPromotions.bySortOrder"];
                    // Filter top pick services (must be top pick AND show_in_booking)
                    const topPicks = servicesData.services.filter({
                        "ServiceStep.useEffect.fetchServicesAndPromotions.topPicks": (service)=>{
                            const setting = settingsMap.get(service.Id);
                            return setting?.is_top_pick === true && shouldShowInBooking(service.Id);
                        }
                    }["ServiceStep.useEffect.fetchServicesAndPromotions.topPicks"]).sort(bySortOrder);
                    // Filter grouped services to only show those with show_in_booking: true
                    const filteredGrouped = {};
                    for (const [category, categoryServices] of Object.entries(servicesData.grouped)){
                        const filtered = categoryServices.filter({
                            "ServiceStep.useEffect.fetchServicesAndPromotions.filtered": (service)=>shouldShowInBooking(service.Id)
                        }["ServiceStep.useEffect.fetchServicesAndPromotions.filtered"]).sort(bySortOrder);
                        // Only include categories that have at least one visible service
                        if (filtered.length > 0) {
                            filteredGrouped[category] = filtered;
                        }
                    }
                    setServices(servicesData.services); // Services with session type filter for direct booking
                    setAllOnlineServices(allServicesData.services || []); // ALL online services for promotion lookups
                    setGroupedServices(filteredGrouped);
                    setTopPickServices(topPicks);
                    // Set active promotions (filter only those with mindbody_service_ids)
                    if (promotionsData.data) {
                        const promotionsWithServices = promotionsData.data.filter({
                            "ServiceStep.useEffect.fetchServicesAndPromotions.promotionsWithServices": (p)=>p.mindbody_service_ids && p.mindbody_service_ids.length > 0
                        }["ServiceStep.useEffect.fetchServicesAndPromotions.promotionsWithServices"]);
                        setActivePromotions(promotionsWithServices);
                    }
                    // P2: categories expanded by default — a hidden service used to cost
                    // 2 extra taps
                    setExpandedCategories(new Set(Object.keys(filteredGrouped)));
                } catch (err) {
                    setServicesError(err instanceof Error ? err.message : 'Error de conexión');
                } finally{
                    setIsLoadingServices(false);
                }
            }
            fetchServicesAndPromotions();
        }
    }["ServiceStep.useEffect"], [
        selectedLocation,
        setServices
    ]);
    // Handle selecting a promotion
    const handleSelectPromotion = async (promotion)=>{
        // If clicking the already selected promotion, deselect it
        if (activePromotion?.id === promotion.id) {
            clearPromotion();
            return;
        }
        setLoadingPromotionId(promotion.id);
        try {
            // Fetch promotion with full Mindbody services
            const response = await fetch(`/api/promotions/${promotion.id}/with-services`);
            if (!response.ok) {
                console.error('Failed to fetch promotion services');
                return;
            }
            const { data: promotionWithServices } = await response.json();
            // loadPromotion replaces the whole cart — never silently discard
            // services the client already picked by hand.
            if (selectedServices.length > 0 && !window.confirm('Elegir esta promoción reemplaza los servicios que ya seleccionaste. ¿Continuar?')) {
                return;
            }
            // Load promotion into cart (this will set selectedServices and activePromotion)
            loadPromotion(promotionWithServices);
            // loadPromotion sets step to 'addons', but we want to stay on services
            // so user can see what was added and continue browsing
            setStep('services');
        } catch (error) {
            console.error('Error loading promotion:', error);
        } finally{
            setLoadingPromotionId(null);
        }
    };
    const toggleCategory = (category)=>{
        setExpandedCategories((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };
    const isServiceSelected = (serviceId)=>{
        return selectedServices.some((s)=>s.Id === serviceId);
    };
    const handleToggleService = (service)=>{
        // Use the current state from the check to avoid race conditions
        const currentlySelected = isServiceSelected(service.Id);
        if (currentlySelected) {
            removeService(service.Id);
        } else {
            addService(service);
        }
    };
    const getCategoryConfig = (category)=>{
        return CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "service-step flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-5 h-5 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                    lineNumber: 572,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 570,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-dark mb-0.5",
                                children: "Selecciona tus Tratamientos"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 574,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-warm-gray",
                                children: "Explora las categorías y agrega servicios a tu carrito"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 577,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 569,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$LocationPills$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocationPills"], {}, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 583,
                        columnNumber: 7
                    }, this),
                    showGlobalDiscount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex items-center gap-2.5 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                className: "w-4 h-4 text-green-600 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 588,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-green-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: [
                                            globalDiscountPercent,
                                            "% de descuento"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this),
                                    ' ',
                                    "en todas las reservas online"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 589,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 587,
                        columnNumber: 9
                    }, this),
                    isLoadingServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-10 h-10 text-gold animate-spin mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 599,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-warm-gray",
                                children: "Cargando servicios..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 600,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 598,
                        columnNumber: 9
                    }, this),
                    servicesError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6",
                        children: servicesError
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 606,
                        columnNumber: 9
                    }, this),
                    !isLoadingServices && activePromotions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 rounded-2xl border-2 border-gold/40 overflow-hidden bg-neutral-100 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsPromotionsExpanded(!isPromotionsExpanded),
                                className: "w-full px-3.5 py-2.5 flex items-center justify-between hover:brightness-[0.98] transition-all duration-200 bg-gradient-to-br from-gold/15 via-gold/5 to-beige-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 bg-gradient-to-br from-gold to-gold/70 rounded-full flex items-center justify-center shadow-md",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                    className: "w-4 h-4 text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 621,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 620,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-dark !text-base md:!text-lg",
                                                        children: "Promociones Activas"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 624,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-warm-gray",
                                                        children: [
                                                            activePromotions.length,
                                                            " oferta",
                                                            activePromotions.length !== 1 ? 's' : '',
                                                            " especial",
                                                            activePromotions.length !== 1 ? 'es' : '',
                                                            activePromotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-gold-600 font-medium",
                                                                children: "• 1 seleccionada"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                                lineNumber: 628,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 625,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 623,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 619,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `
              w-8 h-8 rounded-full flex items-center justify-center
              ${isPromotionsExpanded ? 'bg-gold/20' : 'bg-white/50'}
              transition-colors
            `,
                                        children: isPromotionsExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                            className: "w-5 h-5 text-dark"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 640,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-5 h-5 text-warm-gray"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 642,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 634,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 615,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                children: isPromotionsExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    animate: {
                                        height: 'auto',
                                        opacity: 1
                                    },
                                    exit: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    transition: {
                                        duration: 0.2
                                    },
                                    className: "overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-3 pb-4 pt-0",
                                        children: activePromotions.length <= 3 ? /* All offers visible — no interaction required to see any */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-2.5 items-stretch",
                                            children: activePromotions.map((promotion)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PromotionTile, {
                                                    promotion: promotion,
                                                    isSelected: activePromotion?.id === promotion.id,
                                                    isLoading: loadingPromotionId === promotion.id,
                                                    onSelect: ()=>handleSelectPromotion(promotion),
                                                    allServices: allOnlineServices
                                                }, promotion.id, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 660,
                                            columnNumber: 21
                                        }, this) : /* 4+: overflow into a swipe row, nothing hidden behind dots */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>promoScrollRef.current?.scrollBy({
                                                            left: -300,
                                                            behavior: 'smooth'
                                                        }),
                                                    className: "hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/95 border border-gold/40 rounded-full shadow-lg items-center justify-center text-gold-700 hover:bg-gold hover:text-dark transition-colors",
                                                    "aria-label": "Promociones anteriores",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 682,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 675,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>promoScrollRef.current?.scrollBy({
                                                            left: 300,
                                                            behavior: 'smooth'
                                                        }),
                                                    className: "hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/95 border border-gold/40 rounded-full shadow-lg items-center justify-center text-gold-700 hover:bg-gold hover:text-dark transition-colors",
                                                    "aria-label": "Más promociones",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 691,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: promoScrollRef,
                                                    className: "flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 py-1",
                                                    style: {
                                                        scrollbarWidth: 'none',
                                                        msOverflowStyle: 'none'
                                                    },
                                                    children: activePromotions.map((promotion)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-shrink-0 snap-start w-[80%] sm:w-[calc((100%-1.5rem)/3)]",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PromotionTile, {
                                                                promotion: promotion,
                                                                isSelected: activePromotion?.id === promotion.id,
                                                                isLoading: loadingPromotionId === promotion.id,
                                                                onSelect: ()=>handleSelectPromotion(promotion),
                                                                allServices: allOnlineServices
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                                lineNumber: 700,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, promotion.id, false, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 699,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 693,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 674,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 657,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                    lineNumber: 650,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    !isLoadingServices && topPickServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 rounded-2xl border border-gold-300 overflow-hidden bg-gradient-to-r from-gold-50 to-beige-50 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsRecommendationsExpanded(!isRecommendationsExpanded),
                                className: "w-full px-3.5 py-2.5 flex items-center justify-between hover:brightness-[0.98] transition-all duration-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: "w-5 h-5 text-gold-500 fill-gold-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 728,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-dark !text-base md:!text-lg",
                                                        children: "Nuestras Recomendaciones"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 730,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-warm-gray",
                                                        children: [
                                                            topPickServices.length,
                                                            " tratamiento",
                                                            topPickServices.length !== 1 ? 's' : '',
                                                            " destacado",
                                                            topPickServices.length !== 1 ? 's' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 731,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 729,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 727,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `
              w-8 h-8 rounded-full flex items-center justify-center
              ${isRecommendationsExpanded ? 'bg-gold/20' : 'bg-white/50'}
              transition-colors
            `,
                                        children: isRecommendationsExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                            className: "w-5 h-5 text-dark"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 743,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-5 h-5 text-warm-gray"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 745,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 737,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 723,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                children: isRecommendationsExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    animate: {
                                        height: 'auto',
                                        opacity: 1
                                    },
                                    exit: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    transition: {
                                        duration: 0.2
                                    },
                                    className: "overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 pt-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-[repeat(auto-fill,minmax(126px,1fr))] gap-2.5",
                                            children: topPickServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceTile, {
                                                    service: service,
                                                    isSelected: isServiceSelected(service.Id),
                                                    onToggle: ()=>handleToggleService(service),
                                                    onShowDescription: ()=>setDescriptionService(service),
                                                    discountPercent: globalDiscountPercent,
                                                    showDiscount: showGlobalDiscount
                                                }, service.Id, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 763,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 761,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 760,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 751,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 721,
                        columnNumber: 9
                    }, this),
                    !isLoadingServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: Object.entries(groupedServices).map(([category, categoryServices])=>{
                            const config = getCategoryConfig(category);
                            const isExpanded = expandedCategories.has(category);
                            const selectedInCategory = categoryServices.filter((s)=>isServiceSelected(s.Id)).length;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-beige-200 overflow-hidden bg-white shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleCategory(category),
                                        className: `
                    w-full px-3.5 py-2.5 flex items-center justify-between
                    bg-gradient-to-r ${config.gradient}
                    hover:brightness-[0.98] transition-all duration-200
                  `,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xl",
                                                        role: "img",
                                                        "aria-hidden": "true",
                                                        children: config.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 804,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-left",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-semibold text-dark !text-base md:!text-lg",
                                                                children: category
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                                lineNumber: 808,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-warm-gray",
                                                                children: [
                                                                    categoryServices.length,
                                                                    " tratamiento",
                                                                    categoryServices.length !== 1 ? 's' : '',
                                                                    selectedInCategory > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "ml-2 text-gold-600 font-medium",
                                                                        children: [
                                                                            "• ",
                                                                            selectedInCategory,
                                                                            " en carrito"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                                        lineNumber: 812,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                                lineNumber: 809,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 803,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    selectedInCategory > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-6 h-6 bg-gold text-dark text-xs font-bold  rounded-full flex items-center justify-center",
                                                        children: selectedInCategory
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 822,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isExpanded ? 'bg-gold/20' : 'bg-white/50'}
                      transition-colors
                    `,
                                                        children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                            className: "w-5 h-5 text-dark"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 833,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "w-5 h-5 text-warm-gray"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                        lineNumber: 827,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 820,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 795,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        children: isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                height: 0,
                                                opacity: 0
                                            },
                                            animate: {
                                                height: 'auto',
                                                opacity: 1
                                            },
                                            exit: {
                                                height: 0,
                                                opacity: 0
                                            },
                                            transition: {
                                                duration: 0.2
                                            },
                                            className: "overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-beige-50/30",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-[repeat(auto-fill,minmax(126px,1fr))] gap-2.5",
                                                    children: categoryServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceTile, {
                                                            service: service,
                                                            isSelected: isServiceSelected(service.Id),
                                                            onToggle: ()=>handleToggleService(service),
                                                            onShowDescription: ()=>setDescriptionService(service),
                                                            discountPercent: globalDiscountPercent,
                                                            showDiscount: showGlobalDiscount
                                                        }, service.Id, false, {
                                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                            lineNumber: 854,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                    lineNumber: 852,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                                lineNumber: 851,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                            lineNumber: 844,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                        lineNumber: 842,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, category, true, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 790,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 783,
                        columnNumber: 9
                    }, this),
                    !isLoadingServices && selectedLocation && Object.keys(groupedServices).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12 bg-beige-50 rounded-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                className: "w-12 h-12 text-beige-300 mx-auto mb-3"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 878,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-warm-gray",
                                children: "No hay servicios disponibles"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                                lineNumber: 879,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                        lineNumber: 877,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 567,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: descriptionService && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DescriptionModal, {
                    service: descriptionService,
                    onClose: ()=>setDescriptionService(null),
                    discountPercent: globalDiscountPercent,
                    showDiscount: showGlobalDiscount
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                    lineNumber: 888,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
                lineNumber: 886,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/steps/ServiceStep.tsx",
        lineNumber: 565,
        columnNumber: 5
    }, this);
}
_s1(ServiceStep, "1RbfuSQRdPJlaiXZ9WCqANLccIg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c3 = ServiceStep;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "DescriptionModal");
__turbopack_context__.k.register(_c1, "PromotionTile");
__turbopack_context__.k.register(_c2, "ServiceTile");
__turbopack_context__.k.register(_c3, "ServiceStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/steps/DateTimeStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateTimeStep",
    ()=>DateTimeStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// P2: the therapist choice is an optional inline picker on this screen —
// default stays "Cualquier terapeuta" (null), no mandatory extra tap.
function TherapistPicker({ availableStaffIds }) {
    _s();
    const { selectedLocation, staff, setStaffList, selectedStaff, setStaff } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localStaff, setLocalStaff] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingStaff, setIsLoadingStaff] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TherapistPicker.useEffect": ()=>{
            async function fetchStaff() {
                if (!selectedLocation || availableStaffIds.length === 0) {
                    setLocalStaff([]);
                    return;
                }
                if (staff.length > 0) {
                    setLocalStaff(staff.filter({
                        "TherapistPicker.useEffect.fetchStaff": (s)=>availableStaffIds.includes(s.Id)
                    }["TherapistPicker.useEffect.fetchStaff"]));
                    return;
                }
                setIsLoadingStaff(true);
                try {
                    const response = await fetch(`/api/mindbody/staff?locationId=${selectedLocation.Id}`);
                    const data = await response.json();
                    if (response.ok) {
                        setStaffList(data.staff);
                        setLocalStaff(data.staff.filter({
                            "TherapistPicker.useEffect.fetchStaff": (s)=>availableStaffIds.includes(s.Id)
                        }["TherapistPicker.useEffect.fetchStaff"]));
                    }
                } catch  {
                // Picker is optional — "Cualquier terapeuta" always works
                } finally{
                    setIsLoadingStaff(false);
                }
            }
            fetchStaff();
        }
    }["TherapistPicker.useEffect"], [
        selectedLocation,
        availableStaffIds,
        staff,
        setStaffList
    ]);
    if (availableStaffIds.length === 0) return null;
    const staffName = (s)=>s.DisplayName || `${s.FirstName} ${s.LastName}`.trim();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        className: "bg-white border border-beige-200 rounded-xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-beige-100 rounded-lg flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "w-5 h-5 text-gold"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-warm-gray",
                                        children: "Terapeuta"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-dark font-semibold text-sm",
                                        children: selectedStaff ? staffName(selectedStaff) : 'Cualquier disponible'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsExpanded(!isExpanded),
                        className: "text-sm text-gold-600 hover:text-gold-700 font-medium",
                        children: isExpanded ? 'Cerrar' : selectedStaff ? 'Cambiar' : 'Elegir terapeuta'
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        height: 0,
                        opacity: 0
                    },
                    animate: {
                        height: 'auto',
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "overflow-hidden",
                    children: isLoadingStaff ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 pt-4 text-warm-gray text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 animate-spin text-gold"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 93,
                                columnNumber: 17
                            }, this),
                            "Cargando terapeutas..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                        lineNumber: 92,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-4 grid grid-cols-2 sm:grid-cols-3 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setStaff(null);
                                    setIsExpanded(false);
                                },
                                className: `
                    px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                    flex items-center justify-between gap-1
                    ${!selectedStaff ? 'border-gold bg-gold/5 text-dark' : 'border-beige-200 bg-white text-warm-gray hover:border-gold/50'}
                  `,
                                children: [
                                    "Cualquiera",
                                    !selectedStaff && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-4 h-4 text-gold"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 110,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 98,
                                columnNumber: 17
                            }, this),
                            localStaff.map((member)=>{
                                const isSelected = selectedStaff?.Id === member.Id;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setStaff(member);
                                        setIsExpanded(false);
                                    },
                                    className: `
                        px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                        flex items-center justify-between gap-1
                        ${isSelected ? 'border-gold bg-gold/5 text-dark' : 'border-beige-200 bg-white text-warm-gray hover:border-gold/50'}
                      `,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: staffName(member)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 127,
                                            columnNumber: 23
                                        }, this),
                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "w-4 h-4 text-gold flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 128,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, member.Id, true, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 115,
                                    columnNumber: 21
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                        lineNumber: 97,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                    lineNumber: 84,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(TherapistPicker, "9Y3Qbby502Pl6BGA1oWMhCusbwc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = TherapistPicker;
function DateTimeStep() {
    _s1();
    const { selectedLocation, selectedServices, selectedAddons, selectedDate, selectedTime, setDate, setTime, setAvailableDates, setAvailableSlots, slotConflictNotice, setSlotConflictNotice } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const totalDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTotalDuration"]);
    const setStaff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "DateTimeStep.useBookingStore[setStaff]": (state)=>state.setStaff
    }["DateTimeStep.useBookingStore[setStaff]"]);
    const selectedStaff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "DateTimeStep.useBookingStore[selectedStaff]": (state)=>state.selectedStaff
    }["DateTimeStep.useBookingStore[selectedStaff]"]);
    // Local state for this step
    const [availableDatesData, setAvailableDatesData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDateSlots, setSelectedDateSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [availabilityError, setAvailabilityError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Ref for horizontal scroll
    const dateScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Optional "book with my therapist" filter: most customers skip it, but
    // regulars can pick their person FIRST and see only their availability.
    const [allStaff, setAllStaff] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterStaff, setFilterStaff] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateTimeStep.useEffect": ()=>{
            async function fetchRoster() {
                if (!selectedLocation) return;
                try {
                    const response = await fetch(`/api/mindbody/staff?locationId=${selectedLocation.Id}`);
                    const data = await response.json();
                    if (response.ok) setAllStaff(data.staff || []);
                } catch  {
                // Filter is optional — quietly unavailable on error
                }
            }
            fetchRoster();
        }
    }["DateTimeStep.useEffect"], [
        selectedLocation
    ]);
    // The store clears selectedStaff whenever the time changes; if the customer
    // filtered by a therapist, re-apply that choice to the actual booking.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateTimeStep.useEffect": ()=>{
            if (filterStaff && selectedTime && selectedStaff?.Id !== filterStaff.Id) {
                setStaff(filterStaff);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["DateTimeStep.useEffect"], [
        filterStaff,
        selectedTime
    ]);
    // Availability restricted to the filtered therapist (client-side: each slot
    // already lists which staff can take it)
    const visibleDatesData = filterStaff ? availableDatesData.map((d)=>{
        const slots = d.slots.filter((sl)=>sl.availableStaffIds.includes(filterStaff.Id));
        return {
            ...d,
            slots,
            slotsCount: slots.length,
            hasAvailability: slots.length > 0
        };
    }).filter((d)=>d.slots.length > 0) : availableDatesData;
    const handleFilterChange = (staffId)=>{
        const member = allStaff.find((st)=>String(st.Id) === staffId) || null;
        setFilterStaff(member);
        // Reset a date that may not exist under the new filter FIRST — setDate
        // clears selectedStaff in the store, so the staff pick must come after.
        if (member && selectedDate) {
            const stillValid = availableDatesData.some((d)=>d.date === selectedDate && d.slots.some((sl)=>sl.availableStaffIds.includes(member.Id)));
            if (!stillValid) setDate('');
        }
        setStaff(member);
    };
    const staffName = (st)=>st.DisplayName || `${st.FirstName} ${st.LastName}`.trim();
    // Only offer therapists who actually have availability for this service in
    // the loaded window — hides system accounts and non-bookable staff.
    const bookableStaff = allStaff.filter((st)=>availableDatesData.some((d)=>d.slots.some((sl)=>sl.availableStaffIds.includes(st.Id))));
    // Fetch availability when step loads or services change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateTimeStep.useEffect": ()=>{
            async function fetchAvailability() {
                if (!selectedLocation || selectedServices.length === 0) return;
                setIsLoadingAvailability(true);
                setAvailabilityError(null);
                try {
                    // Get date range (next 30 days) using Panama local dates.
                    // toISOString() always returns UTC, so between UTC midnight and 5 AM
                    // (Panama 7 PM–midnight) it would give tomorrow's date instead of today's.
                    // en-CA locale produces YYYY-MM-DD format natively.
                    const panamaLocale = {
                        timeZone: 'America/Panama'
                    };
                    const startDate = new Date().toLocaleDateString('en-CA', panamaLocale);
                    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA', panamaLocale);
                    // Build service IDs (session type IDs)
                    const serviceIds = [
                        ...selectedServices.map({
                            "DateTimeStep.useEffect.fetchAvailability.serviceIds": (s)=>s.Id
                        }["DateTimeStep.useEffect.fetchAvailability.serviceIds"]),
                        ...selectedAddons.map({
                            "DateTimeStep.useEffect.fetchAvailability.serviceIds": (a)=>a.Id
                        }["DateTimeStep.useEffect.fetchAvailability.serviceIds"])
                    ].join(',');
                    const params = new URLSearchParams({
                        locationId: selectedLocation.Id.toString(),
                        serviceIds,
                        startDate,
                        endDate,
                        duration: totalDuration.toString()
                    });
                    console.log('Fetching availability with params:', {
                        locationId: selectedLocation.Id,
                        serviceIds: serviceIds,
                        services: selectedServices.map({
                            "DateTimeStep.useEffect.fetchAvailability": (s)=>({
                                    id: s.Id,
                                    name: s.Name
                                })
                        }["DateTimeStep.useEffect.fetchAvailability"]),
                        addons: selectedAddons.map({
                            "DateTimeStep.useEffect.fetchAvailability": (a)=>({
                                    id: a.Id,
                                    name: a.Name
                                })
                        }["DateTimeStep.useEffect.fetchAvailability"]),
                        duration: totalDuration
                    });
                    const response = await fetch(`/api/mindbody/availability?${params}`);
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al cargar disponibilidad');
                    }
                    setAvailableDatesData(data.availableDates);
                    setAvailableDates(data.availableDates);
                    // Auto-select TODAY when it has availability (else the first
                    // available date). Also recover when a persisted date is no longer
                    // offered (e.g. it passed while the cart was parked).
                    const dates = data.availableDates || [];
                    const today = new Date().toLocaleDateString('en-CA', panamaLocale);
                    const staleSelection = selectedDate && !dates.some({
                        "DateTimeStep.useEffect.fetchAvailability": (d)=>d.date === selectedDate
                    }["DateTimeStep.useEffect.fetchAvailability"]);
                    if ((!selectedDate || staleSelection) && dates.length > 0) {
                        const todayEntry = dates.find({
                            "DateTimeStep.useEffect.fetchAvailability.todayEntry": (d)=>d.date === today && d.slots.length > 0
                        }["DateTimeStep.useEffect.fetchAvailability.todayEntry"]);
                        setDate(todayEntry ? todayEntry.date : dates[0].date);
                    }
                } catch (err) {
                    setAvailabilityError(err instanceof Error ? err.message : 'Error de conexión');
                } finally{
                    setIsLoadingAvailability(false);
                }
            }
            fetchAvailability();
        }
    }["DateTimeStep.useEffect"], [
        selectedLocation,
        selectedServices,
        selectedAddons,
        totalDuration,
        setAvailableDates
    ]);
    // Update time slots when date is selected (respecting the therapist filter)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateTimeStep.useEffect": ()=>{
            if (selectedDate) {
                const dateData = availableDatesData.find({
                    "DateTimeStep.useEffect.dateData": (d)=>d.date === selectedDate
                }["DateTimeStep.useEffect.dateData"]);
                let slots = dateData?.slots || [];
                if (filterStaff) {
                    slots = slots.filter({
                        "DateTimeStep.useEffect": (sl)=>sl.availableStaffIds.includes(filterStaff.Id)
                    }["DateTimeStep.useEffect"]);
                }
                setSelectedDateSlots(slots);
                setAvailableSlots(slots);
            } else {
                setSelectedDateSlots([]);
                setAvailableSlots([]);
            }
        }
    }["DateTimeStep.useEffect"], [
        selectedDate,
        availableDatesData,
        filterStaff,
        setAvailableSlots
    ]);
    const handleDateSelect = (dateString)=>{
        setDate(dateString);
    // Note: setDate in store already resets selectedTime to null
    };
    const handleTimeSelect = (time)=>{
        // Picking a fresh slot resolves any prior slot-conflict notice
        if (slotConflictNotice) setSlotConflictNotice(null);
        setTime(time);
    };
    // Scroll dates left/right
    const scrollDates = (direction)=>{
        if (dateScrollRef.current) {
            const scrollAmount = 200;
            dateScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    // Parse display date to get day name and date number
    const parseDisplayDate = (displayDate, dateStr)=>{
        // displayDate format: "Miércoles, 14 de Enero"
        const parts = displayDate.split(',');
        const dayName = parts[0]?.trim() || '';
        const date = new Date(dateStr + 'T12:00:00');
        const dayNum = date.getDate();
        const monthShort = [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
        ][date.getMonth()];
        return {
            dayName,
            dayNum,
            monthShort
        };
    };
    // Get selected slot info for display
    const selectedSlot = selectedDateSlots.find((s)=>s.time === selectedTime);
    const selectedDateInfo = visibleDatesData.find((d)=>d.date === selectedDate);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "datetime-step flex flex-col h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 overflow-y-auto pb-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                className: "w-5 h-5 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 376,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-dark mb-0.5",
                            children: "Fecha y Hora"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 378,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-warm-gray",
                            children: [
                                "Selecciona cuándo deseas tu cita (",
                                totalDuration,
                                " min)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this),
                slotConflictNotice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                            className: "w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 389,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-amber-800",
                            children: slotConflictNotice
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 390,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                    lineNumber: 388,
                    columnNumber: 11
                }, this),
                isLoadingAvailability && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-10 h-10 text-gold animate-spin mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 397,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-warm-gray",
                            children: "Cargando disponibilidad..."
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 398,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                    lineNumber: 396,
                    columnNumber: 11
                }, this),
                availabilityError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6",
                    children: availabilityError
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                    lineNumber: 404,
                    columnNumber: 11
                }, this),
                !isLoadingAvailability && !availabilityError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        bookableStaff.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-2 flex-wrap -mb-2",
                            children: filterStaff ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-sm text-dark font-medium",
                                children: [
                                    "Mostrando horarios de ",
                                    staffName(filterStaff),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleFilterChange(''),
                                        className: "w-5 h-5 rounded-full bg-gold/30 hover:bg-gold text-dark flex items-center justify-center text-xs",
                                        "aria-label": "Quitar filtro de terapeuta",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 418,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 416,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-xs text-warm-gray",
                                children: [
                                    "¿Buscas a alguien en especial?",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: "",
                                        onChange: (e)=>handleFilterChange(e.target.value),
                                        className: "px-2 py-1.5 rounded-lg border border-beige-200 bg-white text-xs text-dark focus:outline-none focus:ring-2 focus:ring-gold/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Cualquier terapeuta"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                lineNumber: 435,
                                                columnNumber: 23
                                            }, this),
                                            bookableStaff.map((st)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: st.Id,
                                                    children: staffName(st)
                                                }, st.Id, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 25
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 429,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 427,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 414,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-beige-200 rounded-xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-dark flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "w-4 h-4 text-gold"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 19
                                                }, this),
                                                "Selecciona Fecha"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 448,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>scrollDates('left'),
                                                    className: "p-1.5 hover:bg-beige-100 rounded-lg transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                        className: "w-4 h-4 text-warm-gray"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                        lineNumber: 457,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>scrollDates('right'),
                                                    className: "p-1.5 hover:bg-beige-100 rounded-lg transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        className: "w-4 h-4 text-warm-gray"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                        lineNumber: 463,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 452,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, this),
                                visibleDatesData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8 text-warm-gray",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            className: "w-10 h-10 mx-auto mb-2 opacity-30"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 470,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm",
                                            children: "No hay fechas disponibles"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 471,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 469,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: dateScrollRef,
                                    className: "flex gap-2 overflow-x-auto pb-2 scrollbar-hide",
                                    style: {
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none'
                                    },
                                    children: visibleDatesData.map((dateItem)=>{
                                        const { dayName, dayNum, monthShort } = parseDisplayDate(dateItem.displayDate, dateItem.date);
                                        const isSelected = selectedDate === dateItem.date;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleDateSelect(dateItem.date),
                                            className: `
                          flex-shrink-0 flex flex-col items-center justify-center
                          w-16 h-20 rounded-xl transition-all
                          ${isSelected ? 'bg-gold text-dark shadow-lg scale-105' : 'bg-beige-50 text-dark hover:bg-gold/20 hover:scale-102'}
                        `,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-[10px] font-medium uppercase tracking-wide ${isSelected ? 'text-dark/70' : 'text-warm-gray'}`,
                                                    children: dayName.slice(0, 3)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xl font-bold",
                                                    children: dayNum
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 499,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-[10px] ${isSelected ? 'text-dark/70' : 'text-warm-gray'}`,
                                                    children: monthShort
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-[9px] mt-0.5 ${isSelected ? 'text-dark/60' : 'text-gold'}`,
                                                    children: [
                                                        dateItem.slotsCount,
                                                        " slots"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, dateItem.date, true, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 484,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 474,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 446,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-beige-200 rounded-xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-dark mb-4 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "w-4 h-4 text-gold"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 516,
                                            columnNumber: 17
                                        }, this),
                                        "Horarios Disponibles",
                                        selectedDateInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-normal text-warm-gray ml-auto",
                                            children: selectedDateInfo.displayDate
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 519,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 515,
                                    columnNumber: 15
                                }, this),
                                !selectedDate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8 text-warm-gray",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "w-10 h-10 mx-auto mb-2 opacity-30"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 527,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm",
                                            children: "Selecciona una fecha para ver los horarios"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 528,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 526,
                                    columnNumber: 17
                                }, this) : selectedDateSlots.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8 text-warm-gray",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "w-10 h-10 mx-auto mb-2 opacity-30"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 532,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm",
                                            children: "No hay horarios disponibles"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                            lineNumber: 533,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        children: selectedDateSlots.map((slot, index)=>{
                                            const isSelected = selectedTime === slot.time;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                initial: {
                                                    opacity: 0,
                                                    scale: 0.9
                                                },
                                                animate: {
                                                    opacity: 1,
                                                    scale: 1
                                                },
                                                transition: {
                                                    delay: index * 0.015,
                                                    duration: 0.2
                                                },
                                                onClick: ()=>handleTimeSelect(slot.time),
                                                disabled: !slot.available,
                                                className: `
                            relative py-3 px-2 rounded-xl text-center transition-all duration-200
                            ${isSelected ? 'bg-gradient-to-br from-gold to-gold/80 text-dark shadow-lg scale-105 ring-2 ring-gold/50' : slot.available ? 'bg-white border-2 border-beige-200 text-dark hover:border-gold hover:bg-gold/5 hover:scale-102 shadow-sm' : 'bg-beige-100 border-2 border-beige-100 text-beige-300 cursor-not-allowed'}
                          `,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-sm font-semibold ${isSelected ? 'text-dark' : ''}`,
                                                        children: slot.displayTime
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                        lineNumber: 558,
                                                        columnNumber: 27
                                                    }, this),
                                                    isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        initial: {
                                                            scale: 0
                                                        },
                                                        animate: {
                                                            scale: 1
                                                        },
                                                        className: "absolute -top-1 -right-1 w-4 h-4 bg-dark rounded-full flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-2.5 h-2.5 text-gold",
                                                            fill: "currentColor",
                                                            viewBox: "0 0 20 20",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                fillRule: "evenodd",
                                                                d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                                clipRule: "evenodd"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                                lineNumber: 568,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                            lineNumber: 567,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, slot.time, true, {
                                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                lineNumber: 541,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 537,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                    lineNumber: 536,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 514,
                            columnNumber: 13
                        }, this),
                        selectedDate && selectedTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: "p-4 bg-gold/10 border border-gold/30 rounded-xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "w-5 h-5 text-gold"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                lineNumber: 589,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-dark font-semibold text-sm",
                                                        children: selectedDateInfo?.displayDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-warm-gray text-xs",
                                                        children: [
                                                            selectedSlot?.displayTime,
                                                            selectedSlot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                children: [
                                                                    "• ",
                                                                    selectedSlot.availableStaffIds.length,
                                                                    " terapeuta",
                                                                    selectedSlot.availableStaffIds.length !== 1 ? 's' : '',
                                                                    " disponible",
                                                                    selectedSlot.availableStaffIds.length !== 1 ? 's' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                                lineNumber: 599,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                        lineNumber: 596,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                                lineNumber: 592,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 588,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-5 h-5 text-gold"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                        lineNumber: 606,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                                lineNumber: 587,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 582,
                            columnNumber: 15
                        }, this),
                        selectedDate && selectedTime && selectedSlot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TherapistPicker, {
                            availableStaffIds: selectedSlot.availableStaffIds
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                            lineNumber: 613,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
                    lineNumber: 410,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
            lineNumber: 371,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/steps/DateTimeStep.tsx",
        lineNumber: 369,
        columnNumber: 5
    }, this);
}
_s1(DateTimeStep, "mDlO4xW5xkoPoaM+jEPlkMKxJ64=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c1 = DateTimeStep;
var _c, _c1;
__turbopack_context__.k.register(_c, "TherapistPicker");
__turbopack_context__.k.register(_c1, "DateTimeStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/steps/ConfirmStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmStep",
    ()=>ConfirmStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/pricing.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ConfirmStep() {
    _s();
    const { clientInfo, selectedLocation, selectedServices, selectedAddons, selectedStaff, selectedDate, selectedTime, activePromotion, availableSlots, replaceAppointmentId, replaceBookingDetails, globalDiscountPercent, globalDiscountActive, setBookingConfirmation, setClientInfo, setStep, setDate, setLoading, setError, setSlotConflictNotice, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const totalDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTotalDuration"]);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [displayClientName, setDisplayClientName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Fetch client name on mount if missing from store
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfirmStep.useEffect": ()=>{
            const fetchClientIfNeeded = {
                "ConfirmStep.useEffect.fetchClientIfNeeded": async ()=>{
                    // Build current name from store
                    const currentName = `${clientInfo?.FirstName || ''} ${clientInfo?.LastName || ''}`.trim();
                    if (currentName && currentName.length >= 2) {
                        setDisplayClientName(currentName);
                        return;
                    }
                    // Name is missing - try to fetch from Supabase/Mindbody
                    try {
                        // First get the client ID from Supabase
                        const clientIdResponse = await fetch('/api/portal/client-id');
                        if (clientIdResponse.ok) {
                            const clientIdData = await clientIdResponse.json();
                            if (clientIdData.clientId) {
                                // Fetch full client profile from Mindbody
                                const profileResponse = await fetch(`/api/portal/profile?clientId=${clientIdData.clientId}`);
                                if (profileResponse.ok) {
                                    const profileData = await profileResponse.json();
                                    if (profileData.client) {
                                        const fetchedName = `${profileData.client.FirstName || ''} ${profileData.client.LastName || ''}`.trim();
                                        setDisplayClientName(fetchedName || 'Cliente');
                                        // Also update the store so the booking uses the correct data
                                        if (profileData.client.FirstName || profileData.client.LastName) {
                                            setClientInfo(profileData.client);
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.warn('Could not fetch client name:', err);
                        setDisplayClientName('Cliente');
                    }
                }
            }["ConfirmStep.useEffect.fetchClientIfNeeded"];
            fetchClientIfNeeded();
        }
    }["ConfirmStep.useEffect"], [
        clientInfo?.FirstName,
        clientInfo?.LastName,
        setClientInfo
    ]);
    // Calculate pricing with useMemo
    const pricing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConfirmStep.useMemo[pricing]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateCartPricing"])({
                services: selectedServices,
                addons: selectedAddons,
                promotion: activePromotion,
                globalDiscountActive,
                globalDiscountPercent
            })
    }["ConfirmStep.useMemo[pricing]"], [
        selectedServices,
        selectedAddons,
        activePromotion,
        globalDiscountActive,
        globalDiscountPercent
    ]);
    // Format date for display (shorter format)
    const formatDateShort = (dateStr)=>{
        const date = new Date(dateStr + 'T12:00:00');
        const days = [
            'Dom',
            'Lun',
            'Mar',
            'Mié',
            'Jue',
            'Vie',
            'Sáb'
        ];
        const months = [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
        ];
        return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
    };
    // Format time for display
    const formatTime = (time)=>{
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    const handleConfirmBooking = async ()=>{
        // Prevent double-clicks
        if (isSubmitting) return;
        if (!clientInfo || !selectedLocation || !selectedDate || !selectedTime) {
            setError('Información incompleta. Por favor vuelve a intentar.');
            return;
        }
        setIsSubmitting(true);
        setLoading(true);
        setError(null);
        try {
            // CRITICAL: Always fetch the authoritative client ID from Supabase
            // This ensures we use the ID stored during authentication
            const clientIdResponse = await fetch('/api/portal/client-id');
            const clientIdData = await clientIdResponse.json();
            if (!clientIdResponse.ok || !clientIdData.clientId) {
                // Fallback to clientInfo.Id if Supabase doesn't have the ID
                // but still validate it
                if (!clientInfo.Id || typeof clientInfo.Id !== 'number' || clientInfo.Id <= 0) {
                    throw new Error('No se encontró tu ID de cliente. Por favor inicia sesión nuevamente.');
                }
                console.warn('Using clientInfo.Id as fallback:', clientInfo.Id);
            }
            // Use Supabase client ID (authoritative) or fallback to clientInfo.Id
            const authorizedClientId = clientIdData.clientId || clientInfo.Id;
            // Final validation
            if (!authorizedClientId || typeof authorizedClientId !== 'number' || authorizedClientId <= 0) {
                throw new Error('ID de cliente inválido. Por favor inicia sesión nuevamente.');
            }
            console.log('Using authorized client ID from Supabase:', authorizedClientId);
            console.log('Client info from store:', {
                Id: clientInfo.Id,
                FirstName: clientInfo.FirstName,
                LastName: clientInfo.LastName,
                Email: clientInfo.Email,
                MobilePhone: clientInfo.MobilePhone
            });
            // If client name or phone is missing, fetch it from Mindbody
            let finalClientName = `${clientInfo.FirstName || ''} ${clientInfo.LastName || ''}`.trim();
            let finalClientPhone = clientInfo.MobilePhone;
            if (!finalClientName || finalClientName.length < 2 || !finalClientPhone) {
                console.log('Client name or phone missing, fetching from Mindbody...');
                try {
                    const profileResponse = await fetch(`/api/portal/profile?clientId=${authorizedClientId}`);
                    if (profileResponse.ok) {
                        const profileData = await profileResponse.json();
                        if (profileData.client) {
                            finalClientName = `${profileData.client.FirstName || ''} ${profileData.client.LastName || ''}`.trim() || finalClientName;
                            finalClientPhone = profileData.client.MobilePhone || finalClientPhone;
                            console.log('Fetched client profile from Mindbody:', {
                                finalClientName,
                                finalClientPhone
                            });
                        }
                    }
                } catch (profileErr) {
                    console.warn('Could not fetch client profile:', profileErr);
                }
            }
            const services = [
                ...selectedServices.map((s)=>({
                        sessionTypeId: s.Id,
                        duration: s.Duration,
                        name: s.Name
                    })),
                ...selectedAddons.map((a)=>({
                        sessionTypeId: a.Id,
                        duration: a.Duration,
                        name: a.Name
                    }))
            ];
            const startDateTime = `${selectedDate}T${selectedTime}:00`;
            // Get staff ID - use selected staff, or pick from available staff for the time slot
            let staffIdToUse = selectedStaff?.Id;
            if (!staffIdToUse && selectedTime) {
                const selectedSlot = availableSlots.find((s)=>s.time === selectedTime);
                if (selectedSlot?.availableStaffIds?.length) {
                    // Pick the first available staff for this slot
                    staffIdToUse = selectedSlot.availableStaffIds[0];
                }
            }
            const response = await fetch('/api/mindbody/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: authorizedClientId,
                    locationId: selectedLocation.Id,
                    services,
                    staffId: staffIdToUse,
                    startDateTime,
                    promotionName: activePromotion?.title_es,
                    // Use mindbody_service_ids (always present from Supabase) rather than
                    // services?.map(s => s.Id) which is optional and may be empty if the
                    // Mindbody fetch in with-services failed.
                    promoServiceIds: activePromotion?.mindbody_service_ids?.map(Number).filter((n)=>!isNaN(n)) ?? [],
                    globalDiscountPercent: pricing.hasGlobalDiscount ? pricing.globalDiscountPercent : 0,
                    clientName: finalClientName,
                    clientPhone: finalClientPhone,
                    locationName: selectedLocation.Name,
                    therapistName: selectedStaff ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}` : undefined,
                    totalDuration,
                    staffRequested: selectedStaff !== null,
                    // Pricing for Supabase record
                    subtotalBeforeTax: pricing.subtotalBeforeTax,
                    taxAmount: pricing.itbmAmount,
                    totalWithTax: pricing.totalWithTax,
                    // Appointment replacement: cancel old appointment after booking
                    replaceAppointmentId: replaceAppointmentId || undefined
                })
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.timeUnavailable) {
                    // Slot was taken while the user was confirming. Clear the stale
                    // time/staff selection and send them straight back to the datetime
                    // step — it refetches availability on mount, so the dead slot
                    // disappears. The banner there explains what happened.
                    setError(null);
                    setSlotConflictNotice('Ese horario acaba de ocuparse. Elige otro horario disponible.');
                    if (selectedDate) setDate(selectedDate);
                    setStep('datetime');
                } else {
                    throw new Error(data.error || 'Error al crear la reserva');
                }
                return;
            }
            setBookingConfirmation({
                success: true,
                confirmationNumber: data.confirmationNumber,
                appointments: data.appointments,
                location: selectedLocation,
                client: clientInfo,
                pricing: pricing,
                totalBooked: data.totalBooked,
                totalRequested: data.totalRequested
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally{
            setIsSubmitting(false);
            setLoading(false);
        }
    };
    const therapistName = selectedStaff ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}` : 'Cualquier disponible';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "confirm-step flex flex-col h-full",
        children: [
            isSubmitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[80] bg-white/80 backdrop-blur-sm flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-14 h-14 text-gold animate-spin mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                            lineNumber: 283,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-semibold text-dark",
                            children: "Confirmando tu reserva…"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-warm-gray mt-1",
                            children: "Estamos reservando tu espacio, esto toma unos segundos."
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                            lineNumber: 285,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                    lineNumber: 282,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    className: "w-5 h-5 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-dark mb-0.5",
                                children: "Confirmar Reserva"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-warm-gray",
                                children: "Revisa y confirma tu cita"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 bg-red-50 border border-red-200 rounded-xl mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2 text-red-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "w-4 h-4 flex-shrink-0 mt-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                    lineNumber: 313,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                            lineNumber: 311,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-beige-200 rounded-xl overflow-hidden mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-beige-50 border-b border-beige-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "w-4 h-4 text-gold"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-dark text-sm",
                                                    children: selectedDate && formatDateShort(selectedDate)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-warm-gray",
                                                    children: "•"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-dark text-sm",
                                                    children: selectedTime && formatTime(selectedTime)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 text-xs text-warm-gray bg-white px-2 py-1 rounded-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 335,
                                                    columnNumber: 17
                                                }, this),
                                                totalDuration,
                                                " min"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 322,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 grid grid-cols-2 gap-3 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-warm-gray mb-0.5",
                                                children: "Ubicación"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 344,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-dark flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "w-3 h-3 text-gold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 17
                                                    }, this),
                                                    selectedLocation?.Name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 345,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-warm-gray mb-0.5",
                                                children: "Terapeuta"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-dark flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "w-3 h-3 text-gold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 17
                                                    }, this),
                                                    therapistName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 352,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-beige-200 rounded-xl p-3 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2",
                                children: "Servicios"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    pricing.hasPromotion ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1.5 font-semibold text-dark text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                className: "w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                                lineNumber: 371,
                                                                columnNumber: 21
                                                            }, this),
                                                            pricing.promotionName
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 text-sm whitespace-nowrap",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "line-through text-warm-gray text-xs",
                                                                children: [
                                                                    "$",
                                                                    pricing.promoServicesSubtotal.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                                lineNumber: 375,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-dark",
                                                                children: [
                                                                    "$",
                                                                    pricing.promotionPrice.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                                lineNumber: 376,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 374,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 369,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pl-5 space-y-1",
                                                children: pricing.promoServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-warm-gray",
                                                        children: service.Name
                                                    }, service.Id, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 380,
                                                columnNumber: 17
                                            }, this),
                                            pricing.extraServices.map((service)=>{
                                                const discountedPrice = pricing.hasGlobalDiscount ? Math.round(service.Price * (1 - pricing.globalDiscountPercent / 100) * 100) / 100 : null;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-dark",
                                                            children: service.Name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5 whitespace-nowrap",
                                                            children: [
                                                                discountedPrice !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "line-through text-warm-gray text-xs",
                                                                    children: [
                                                                        "$",
                                                                        service.Price.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                                    lineNumber: 397,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-dark",
                                                                    children: [
                                                                        "$",
                                                                        (discountedPrice ?? service.Price).toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                                    lineNumber: 399,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, service.Id, true, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        ]
                                    }, void 0, true) : /* No promotion — each service with its price, discounted if applicable */ selectedServices.map((service)=>{
                                        const discountedPrice = pricing.hasGlobalDiscount ? Math.round(service.Price * (1 - pricing.globalDiscountPercent / 100) * 100) / 100 : null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-dark",
                                                    children: service.Name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 whitespace-nowrap",
                                                    children: [
                                                        discountedPrice !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "line-through text-warm-gray text-xs",
                                                            children: [
                                                                "$",
                                                                service.Price.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                            lineNumber: 416,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-dark",
                                                            children: [
                                                                "$",
                                                                (discountedPrice ?? service.Price).toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, service.Id, true, {
                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                            lineNumber: 412,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    selectedAddons.map((addon)=>{
                                        const discountedAddonPrice = pricing.hasGlobalDiscount ? Math.round(addon.Price * (1 - pricing.globalDiscountPercent / 100) * 100) / 100 : null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-dark",
                                                    children: [
                                                        "+ ",
                                                        addon.Name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 432,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 whitespace-nowrap",
                                                    children: [
                                                        discountedAddonPrice !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "line-through text-warm-gray text-xs",
                                                            children: [
                                                                "$",
                                                                addon.Price.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-dark",
                                                            children: [
                                                                "$",
                                                                (discountedAddonPrice ?? addon.Price).toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, addon.Id, true, {
                                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                            lineNumber: 431,
                                            columnNumber: 17
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 pt-3 border-t border-beige-200 space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-warm-gray",
                                                children: "Subtotal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 447,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-dark",
                                                children: [
                                                    "$",
                                                    pricing.subtotalBeforeTax.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 448,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 446,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-warm-gray",
                                                children: "ITBM (7%)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 451,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-dark",
                                                children: [
                                                    "$",
                                                    pricing.itbmAmount.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 452,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 450,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between font-bold text-base pt-1 border-t border-beige-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-dark",
                                                children: "Total"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 455,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-dark",
                                                children: [
                                                    "$",
                                                    pricing.totalWithTax.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 456,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 454,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 445,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-warm-gray text-center",
                        children: [
                            "Reserva a nombre de ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-dark",
                                children: displayClientName || 'Cargando...'
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 463,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this),
                    replaceAppointmentId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2 text-center",
                                children: "Cambio de cita"
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 469,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-red-50 border border-red-200 rounded-xl p-3 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-red-600 uppercase tracking-wider mb-2",
                                        children: "Cita actual · será cancelada"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 475,
                                        columnNumber: 15
                                    }, this),
                                    replaceBookingDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 text-sm text-red-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                        className: "w-3.5 h-3.5 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 481,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            replaceBookingDetails.date,
                                                            " · ",
                                                            replaceBookingDetails.time
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 482,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 480,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "w-3.5 h-3.5 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: replaceBookingDetails.locationName
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 486,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 484,
                                                columnNumber: 19
                                            }, this),
                                            replaceBookingDetails.services.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-red-700 text-xs pl-5",
                                                children: replaceBookingDetails.services.join(', ')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 489,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 479,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-red-600 italic",
                                        children: "Cargando detalles..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 474,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center my-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                    className: "w-4 h-4 text-warm-gray"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                    lineNumber: 501,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 500,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 border border-green-200 rounded-xl p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-green-700 uppercase tracking-wider mb-2",
                                        children: "Nueva cita · confirmada arriba"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 506,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 text-sm text-green-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                        className: "w-3.5 h-3.5 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 511,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            selectedDate && formatDateShort(selectedDate),
                                                            selectedTime && ` · ${formatTime(selectedTime)}`
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 510,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "w-3.5 h-3.5 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 518,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: selectedLocation?.Name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                        lineNumber: 519,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 517,
                                                columnNumber: 17
                                            }, this),
                                            selectedServices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-green-700 text-xs pl-5",
                                                children: selectedServices.map((s)=>s.Name).join(', ')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                                lineNumber: 522,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                        lineNumber: 509,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 505,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-warm-gray text-center mt-2",
                                children: "Al confirmar, recibirás un mensaje de cancelación para la cita anterior y una confirmación para la nueva."
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                                lineNumber: 529,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 468,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-amber-800 text-xs text-center",
                            children: "El pago se realiza en el spa al momento de tu visita"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                            lineNumber: 537,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                        lineNumber: 536,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleConfirmBooking,
                disabled: isSubmitting || isLoading,
                className: "hidden",
                id: "mobile-confirm-btn"
            }, void 0, false, {
                fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
                lineNumber: 544,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/steps/ConfirmStep.tsx",
        lineNumber: 277,
        columnNumber: 5
    }, this);
}
_s(ConfirmStep, "zKZlZXWjVWOiqte43rtX0RHvm2A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = ConfirmStep;
var _c;
__turbopack_context__.k.register(_c, "ConfirmStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/steps/SuccessStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuccessStep",
    ()=>SuccessStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/pricing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function SuccessStep() {
    _s();
    const { bookingConfirmation, selectedLocation, selectedServices, selectedAddons, selectedStaff, selectedDate, selectedTime, activePromotion, globalDiscountActive, globalDiscountPercent, replaceAppointmentId, resetForNewBooking } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    // Same pricing math as ConfirmStep/FloatingCart (the old store `pricing`
    // field was always null, so the total never rendered here).
    const pricing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateCartPricing"])({
        services: selectedServices,
        addons: selectedAddons,
        promotion: activePromotion,
        globalDiscountActive,
        globalDiscountPercent
    });
    const isReplacement = !!replaceAppointmentId;
    // Fire Google Ads conversion event on booking success
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuccessStep.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.gtag) {
                window.gtag('event', 'conversion', {
                    'send_to': 'AW-965602203/sZRACL3F-IccEJvXt8wD'
                });
            }
        }
    }["SuccessStep.useEffect"], []);
    // Format date for display
    const formatDate = (dateStr)=>{
        const date = new Date(dateStr + 'T12:00:00');
        const days = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado'
        ];
        const months = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ];
        return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    // Format time for display
    const formatTime = (time)=>{
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    const handleNewBooking = ()=>{
        resetForNewBooking();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "success-step flex flex-col h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 overflow-y-auto pb-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                scale: 0
                            },
                            animate: {
                                scale: 1
                            },
                            transition: {
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                                delay: 0.1
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        scale: 0
                                    },
                                    animate: {
                                        scale: 1
                                    },
                                    transition: {
                                        delay: 0.3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        className: "w-8 h-8 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                        lineNumber: 97,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-dark mb-1",
                                    children: isReplacement ? '¡Cita Actualizada!' : '¡Reserva Confirmada!'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-warm-gray mb-2",
                                    children: isReplacement ? 'Tu nueva cita fue confirmada y la anterior fue cancelada' : 'Tu cita ha sido registrada exitosamente'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                bookingConfirmation?.confirmationNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-block bg-beige-100 px-3 py-1.5 rounded-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-warm-gray",
                                            children: "Número de confirmación: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-dark text-sm",
                                            children: bookingConfirmation.confirmationNumber
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 120,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.5
                    },
                    className: "bg-white border border-beige-200 rounded-xl p-4 text-left mb-4",
                    children: [
                        activePromotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 mb-3 bg-gold/10 px-2 py-1.5 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                    className: "w-4 h-4 text-gold"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-dark text-sm",
                                    children: activePromotion.title_es
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                    className: "w-4 h-4 text-gold mt-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-dark text-sm",
                                            children: selectedLocation?.Name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 145,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-warm-gray",
                                            children: selectedLocation?.Address
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    className: "w-4 h-4 text-gold mt-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-dark text-sm",
                                            children: selectedDate && formatDate(selectedDate)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 154,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-warm-gray flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 17
                                                }, this),
                                                selectedTime && formatTime(selectedTime)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "w-4 h-4 text-gold mt-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium text-dark text-sm",
                                    children: selectedStaff ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}` : 'Terapeuta Asignado'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-beige-200 pt-3 mt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold text-warm-gray mb-1.5",
                                    children: "SERVICIOS:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-1",
                                    children: [
                                        selectedServices.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "text-xs text-dark flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: service.Name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-warm-gray",
                                                        children: [
                                                            service.Duration,
                                                            " min"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, service.Id, true, {
                                                fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this)),
                                        selectedAddons.map((addon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "text-xs text-gold-600 flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "+ ",
                                                            addon.Name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            addon.Duration,
                                                            " min"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, addon.Id, true, {
                                                fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this),
                        pricing.totalWithTax > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-beige-200 pt-3 mt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-dark text-sm",
                                            children: "Total a pagar:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 198,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-bold text-gold-600",
                                            children: [
                                                "$",
                                                pricing.totalWithTax.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                            lineNumber: 199,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-warm-gray mt-0.5",
                                    children: "Incluye ITBM (7%)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 203,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.6
                    },
                    className: "bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "font-semibold text-amber-800 text-sm mb-1.5",
                            children: "Información Importante:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "text-xs text-amber-700 space-y-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Llega 10 minutos antes de tu cita"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 219,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• El pago se realiza en el spa"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Cancelaciones: 24 horas de anticipación"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 218,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.7
                    },
                    className: "flex flex-col sm:flex-row items-center justify-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2 px-4 py-2.5 bg-beige-100 text-dark font-medium rounded-xl hover:bg-beige-200 transition-all text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this),
                                "Volver al Inicio"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleNewBooking,
                            className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold rounded-xl hover:shadow-lg transition-all text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this),
                                "Nueva Reserva"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    transition: {
                        delay: 0.8
                    },
                    className: "mt-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-warm-gray mb-1",
                            children: "¿Tienes alguna pregunta?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `https://wa.me/${("TURBOPACK compile-time value", "50764049464") || '50760001234'}`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, this),
                                "Contáctanos por WhatsApp"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/steps/SuccessStep.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(SuccessStep, "vRHvkPk/N1Z229m8fqQF0LXV9cY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = SuccessStep;
var _c;
__turbopack_context__.k.register(_c, "SuccessStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/BookingWidget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingWidget",
    ()=>BookingWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/track.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$StepProgress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/shared/StepProgress.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$FloatingCart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/shared/FloatingCart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$ClientSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/shared/ClientSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$BookingNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/shared/BookingNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$AddonsPrompt$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/shared/AddonsPrompt.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$AuthStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/steps/AuthStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$ServiceStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/steps/ServiceStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$DateTimeStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/steps/DateTimeStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$ConfirmStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/steps/ConfirmStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/steps/SuccessStep.tsx [app-client] (ecmascript)");
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
;
;
;
;
const stepVariants = {
    enter: (direction)=>({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction)=>({
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
};
function BookingWidget() {
    _s();
    const { currentStep, showClientSelector, availableClients, selectClient, showClientSelectorModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])();
    const stepNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectCurrentStepNumber"]);
    const [isSticky, setIsSticky] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Booking funnel: one first-party event per step reached (dedup per session
    // handled at query time via distinct session_id).
    const selectedLocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingWidget.useBookingStore[selectedLocation]": (state)=>state.selectedLocation
    }["BookingWidget.useBookingStore[selectedLocation]"]);
    const selectedServices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingWidget.useBookingStore[selectedServices]": (state)=>state.selectedServices
    }["BookingWidget.useBookingStore[selectedServices]"]);
    const trackedSteps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookingWidget.useEffect": ()=>{
            // Funnel top: fired once per widget mount, whatever the entry step is
            // (authenticated users skip the auth step, so booking_step_auth alone
            // undercounts starts and inflates conversion).
            if (!trackedSteps.current.has('__start')) {
                trackedSteps.current.add('__start');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["track"])('booking_start', {
                    locationId: selectedLocation?.Id
                });
            }
            if (trackedSteps.current.has(currentStep)) return;
            trackedSteps.current.add(currentStep);
            const event = currentStep === 'success' ? 'booking_completed' : `booking_step_${currentStep}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$track$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["track"])(event, {
                locationId: selectedLocation?.Id,
                meta: {
                    services: selectedServices.map({
                        "BookingWidget.useEffect": (s)=>s.Name
                    }["BookingWidget.useEffect"]).slice(0, 5),
                    service_count: selectedServices.length
                }
            });
        }
    }["BookingWidget.useEffect"], [
        currentStep,
        selectedLocation,
        selectedServices
    ]);
    // Intersection Observer for sticky header
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookingWidget.useEffect": ()=>{
            const sentinel = sentinelRef.current;
            if (!sentinel) return;
            const observer = new IntersectionObserver({
                "BookingWidget.useEffect": ([entry])=>{
                    setIsSticky(!entry.isIntersecting);
                }
            }["BookingWidget.useEffect"], {
                threshold: 0,
                rootMargin: '-80px 0px 0px 0px'
            });
            observer.observe(sentinel);
            return ({
                "BookingWidget.useEffect": ()=>observer.disconnect()
            })["BookingWidget.useEffect"];
        }
    }["BookingWidget.useEffect"], []);
    const renderStep = ()=>{
        switch(currentStep){
            case 'auth':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$AuthStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthStep"], {}, "auth", false, {
                    fileName: "[project]/src/components/booking/BookingWidget.tsx",
                    lineNumber: 90,
                    columnNumber: 16
                }, this);
            case 'datetime':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$DateTimeStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DateTimeStep"], {}, "datetime", false, {
                    fileName: "[project]/src/components/booking/BookingWidget.tsx",
                    lineNumber: 92,
                    columnNumber: 16
                }, this);
            case 'confirm':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$ConfirmStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmStep"], {}, "confirm", false, {
                    fileName: "[project]/src/components/booking/BookingWidget.tsx",
                    lineNumber: 94,
                    columnNumber: 16
                }, this);
            case 'success':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuccessStep"], {}, "success", false, {
                    fileName: "[project]/src/components/booking/BookingWidget.tsx",
                    lineNumber: 96,
                    columnNumber: 16
                }, this);
            default:
                // 'services' plus normalized legacy names
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$steps$2f$ServiceStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ServiceStep"], {}, "services", false, {
                    fileName: "[project]/src/components/booking/BookingWidget.tsx",
                    lineNumber: 99,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: sentinelRef,
                className: "h-0"
            }, void 0, false, {
                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            currentStep !== 'success' && isSticky && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-20 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm shadow-md border-b border-beige-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-4xl px-4 py-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$StepProgress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepProgress"], {
                        currentStep: stepNumber,
                        totalSteps: 4
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingWidget.tsx",
                        lineNumber: 112,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/BookingWidget.tsx",
                    lineNumber: 111,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "booking-widget bg-white rounded-2xl shadow-elevated overflow-hidden relative",
                children: [
                    currentStep !== 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-gold/10 to-gold/5 px-4 py-3 border-b border-beige-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$StepProgress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepProgress"], {
                            currentStep: stepNumber,
                            totalSteps: 4
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/BookingWidget.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingWidget.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 sm:p-6 h-[calc(100dvh-150px)] sm:h-[calc(100vh-220px)] flex flex-col",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            custom: stepNumber,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                custom: stepNumber,
                                variants: stepVariants,
                                initial: "enter",
                                animate: "center",
                                exit: "exit",
                                transition: {
                                    duration: 0.3,
                                    ease: 'easeInOut'
                                },
                                className: "flex-1 min-h-0 overflow-y-auto",
                                children: renderStep()
                            }, currentStep, false, {
                                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/BookingWidget.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingWidget.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    showClientSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$ClientSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClientSelector"], {
                        clients: availableClients,
                        onSelect: selectClient,
                        onCancel: ()=>showClientSelectorModal(false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingWidget.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    currentStep !== 'auth' && currentStep !== 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingWidget.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$AddonsPrompt$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddonsPrompt"], {}, void 0, false, {
                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$FloatingCart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingCart"], {}, void 0, false, {
                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$shared$2f$BookingNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookingNav"], {}, void 0, false, {
                fileName: "[project]/src/components/booking/BookingWidget.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(BookingWidget, "jXwy/vTJc1TeKSLVbwMVL6c9pfA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = BookingWidget;
var _c;
__turbopack_context__.k.register(_c, "BookingWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/booking/BookingPageContent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingPageContent",
    ()=>BookingPageContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/booking/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$BookingWidget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/booking/BookingWidget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function BookingPageInner() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const tBooking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('booking');
    const tCommon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('common');
    const currentStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[currentStep]": (state)=>state.currentStep
    }["BookingPageInner.useBookingStore[currentStep]"]);
    const clientInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[clientInfo]": (state)=>state.clientInfo
    }["BookingPageInner.useBookingStore[clientInfo]"]);
    const setClientInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[setClientInfo]": (state)=>state.setClientInfo
    }["BookingPageInner.useBookingStore[setClientInfo]"]);
    const setStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[setStep]": (state)=>state.setStep
    }["BookingPageInner.useBookingStore[setStep]"]);
    const loadPromotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[loadPromotion]": (state)=>state.loadPromotion
    }["BookingPageInner.useBookingStore[loadPromotion]"]);
    const addService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[addService]": (state)=>state.addService
    }["BookingPageInner.useBookingStore[addService]"]);
    const setReplaceAppointmentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[setReplaceAppointmentId]": (state)=>state.setReplaceAppointmentId
    }["BookingPageInner.useBookingStore[setReplaceAppointmentId]"]);
    const replaceAppointmentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[replaceAppointmentId]": (state)=>state.replaceAppointmentId
    }["BookingPageInner.useBookingStore[replaceAppointmentId]"]);
    const setReplaceBookingDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[setReplaceBookingDetails]": (state)=>state.setReplaceBookingDetails
    }["BookingPageInner.useBookingStore[setReplaceBookingDetails]"]);
    const setGlobalDiscount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"])({
        "BookingPageInner.useBookingStore[setGlobalDiscount]": (state)=>state.setGlobalDiscount
    }["BookingPageInner.useBookingStore[setGlobalDiscount]"]);
    const [isInitializing, setIsInitializing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const initRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Check auth on mount and skip auth step if already logged in
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookingPageInner.useEffect": ()=>{
            // Prevent double initialization in strict mode
            if (initRef.current) return;
            initRef.current = true;
            const checkAuthAndInitialize = {
                "BookingPageInner.useEffect.checkAuthAndInitialize": async ()=>{
                    // Capture ?replace=APPOINTMENT_ID for appointment replacement flow
                    const replaceId = searchParams.get('replace');
                    if (replaceId) {
                        setReplaceAppointmentId(replaceId);
                        fetch(`/api/booking/by-appointment?id=${replaceId}`).then({
                            "BookingPageInner.useEffect.checkAuthAndInitialize": (res)=>res.ok ? res.json() : null
                        }["BookingPageInner.useEffect.checkAuthAndInitialize"]).then({
                            "BookingPageInner.useEffect.checkAuthAndInitialize": (data)=>{
                                if (data?.booking) setReplaceBookingDetails(data.booking);
                            }
                        }["BookingPageInner.useEffect.checkAuthAndInitialize"]).catch({
                            "BookingPageInner.useEffect.checkAuthAndInitialize": ()=>{}
                        }["BookingPageInner.useEffect.checkAuthAndInitialize"]);
                    }
                    // Deep-link preselection runs for EVERYONE — browsing no longer requires
                    // an account (auth moved to the step before confirmation).
                    const promotionId = searchParams.get('promotionId');
                    const serviceId = searchParams.get('serviceId');
                    if (promotionId) {
                        try {
                            const response = await fetch(`/api/promotions/${promotionId}/with-services`);
                            if (response.ok) {
                                const { data } = await response.json();
                                if (data?.services?.length > 0) {
                                    loadPromotion(data);
                                }
                            }
                        } catch (err) {
                            console.error('Error loading promotion:', err);
                        }
                    } else if (serviceId) {
                        try {
                            const response = await fetch('/api/mindbody/services?type=all&includeOffline=true');
                            const data = await response.json();
                            if (data.services) {
                                const service = data.services.find({
                                    "BookingPageInner.useEffect.checkAuthAndInitialize.service": (s)=>s.Id === parseInt(serviceId, 10)
                                }["BookingPageInner.useEffect.checkAuthAndInitialize.service"]);
                                if (service) addService(service);
                            }
                        } catch (err) {
                            console.error('Error loading service:', err);
                        }
                    }
                    // Old auth-FIRST persisted sessions have an empty cart at 'auth' — send
                    // those to services. A cart mid-flow at auth (auth-last) stays put.
                    if (currentStep === 'auth' && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"].getState().selectedServices.length === 0) {
                        setStep('services');
                    }
                    // Show the widget now — everything below runs in the background.
                    setIsInitializing(false);
                    // Global online discount (non-blocking, non-critical)
                    fetch('/api/admin/settings').then({
                        "BookingPageInner.useEffect.checkAuthAndInitialize": (res)=>res.ok ? res.json() : null
                    }["BookingPageInner.useEffect.checkAuthAndInitialize"]).then({
                        "BookingPageInner.useEffect.checkAuthAndInitialize": (body)=>{
                            if (body?.data) {
                                setGlobalDiscount(body.data.online_discount_percent ?? 0, body.data.online_discount_active ?? false);
                            }
                        }
                    }["BookingPageInner.useEffect.checkAuthAndInitialize"]).catch({
                        "BookingPageInner.useEffect.checkAuthAndInitialize": ()=>{}
                    }["BookingPageInner.useEffect.checkAuthAndInitialize"]);
                    // Session restore: only hydrates clientInfo so the auth step later
                    // auto-skips for returning clients. Never changes the current step.
                    if (!clientInfo) {
                        try {
                            const { getClient } = await __turbopack_context__.A("[project]/src/lib/supabase/client.ts [app-client] (ecmascript, async loader)");
                            const supabase = getClient();
                            const { data: { session } } = await supabase.auth.getSession();
                            if (session?.user) {
                                let mindbodyClientId = null;
                                const urlClientId = searchParams.get('clientId');
                                if (urlClientId && !isNaN(parseInt(urlClientId, 10))) {
                                    mindbodyClientId = parseInt(urlClientId, 10);
                                }
                                if (!mindbodyClientId) {
                                    try {
                                        const response = await fetch('/api/portal/client-id');
                                        if (response.ok) {
                                            const data = await response.json();
                                            if (data.clientId) mindbodyClientId = data.clientId;
                                        }
                                    } catch (err) {
                                        console.error('Error fetching client ID:', err);
                                    }
                                }
                                if (!mindbodyClientId && session.user.user_metadata?.mindbody_client_id) {
                                    mindbodyClientId = session.user.user_metadata.mindbody_client_id;
                                }
                                if (mindbodyClientId) {
                                    const response = await fetch(`/api/portal/profile?clientId=${mindbodyClientId}`);
                                    if (response.ok) {
                                        const data = await response.json();
                                        setClientInfo(data.client);
                                    }
                                }
                            }
                        } catch (err) {
                            console.error('Error checking auth:', err);
                        }
                    }
                }
            }["BookingPageInner.useEffect.checkAuthAndInitialize"];
            checkAuthAndInitialize();
        }
    }["BookingPageInner.useEffect"], []); // Empty deps - only run once on mount
    // Show header only on auth step (before booking process starts)
    const showHeader = currentStep === 'auth' && !isInitializing;
    // Show loading while checking auth
    if (isInitializing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-cream flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-8 h-8 animate-spin text-gold mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-warm-gray",
                        children: tCommon('loading')
                    }, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/booking/BookingPageContent.tsx",
            lineNumber: 149,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-cream",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].section, {
                    initial: {
                        height: 'auto',
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0
                    },
                    transition: {
                        duration: 0.3,
                        ease: 'easeInOut'
                    },
                    className: "py-4 md:py-6 bg-beige text-center overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container-spa",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl md:text-3xl font-display font-semibold mb-1",
                                children: tBooking('pageTitle')
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-warm-gray",
                                children: tBooking('pageSubtitle')
                            }, void 0, false, {
                                fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                        lineNumber: 169,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                    lineNumber: 163,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            replaceAppointmentId && currentStep !== 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-blue-50 border-b border-blue-200 py-2.5 px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-4xl flex items-center gap-2 text-sm text-blue-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            className: "w-4 h-4 flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Estás modificando una cita existente. Selecciona nueva fecha y hora — la cita anterior se cancelará automáticamente al confirmar."
                        }, void 0, false, {
                            fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                    lineNumber: 182,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                lineNumber: 181,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-4 md:py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-spa max-w-4xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$booking$2f$BookingWidget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookingWidget"], {}, void 0, false, {
                        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                    lineNumber: 193,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, this);
}
_s(BookingPageInner, "dHJxltuqqQ4RdF3qIZ5j86SFPas=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$booking$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookingStore"]
    ];
});
_c = BookingPageInner;
// Loading fallback for Suspense
function BookingPageLoading() {
    _s1();
    const tCommon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('common');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-cream flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-8 h-8 animate-spin text-gold mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-warm-gray",
                    children: tCommon('loading')
                }, void 0, false, {
                    fileName: "[project]/src/components/booking/BookingPageContent.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/booking/BookingPageContent.tsx",
            lineNumber: 206,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s1(BookingPageLoading, "D+4QCcfc7SQcbGbaH8hjUaF0I0E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c1 = BookingPageLoading;
function BookingPageContent() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BookingPageLoading, {}, void 0, false, {
            fileName: "[project]/src/components/booking/BookingPageContent.tsx",
            lineNumber: 217,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BookingPageInner, {}, void 0, false, {
            fileName: "[project]/src/components/booking/BookingPageContent.tsx",
            lineNumber: 218,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/booking/BookingPageContent.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
}
_c2 = BookingPageContent;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "BookingPageInner");
__turbopack_context__.k.register(_c1, "BookingPageLoading");
__turbopack_context__.k.register(_c2, "BookingPageContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_ac91ec63._.js.map