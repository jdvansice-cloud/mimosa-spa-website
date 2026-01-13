# Changelog - Mimosa Spa Website

All notable changes to this project will be documented in this file.

## [1.0.23] - 2026-01-12

### Fixed
- **TypeScript error in ConfirmStep.tsx**: Changed `activePromotion?.name` to `activePromotion?.title_es`
- `PromotionWithServices` type uses `title_es` not `name` for the promotion title

---

## [1.0.22] - 2026-01-12

### Fixed
- **TypeScript compilation error in ConfirmStep.tsx**: `useMemo` now returns complete `CartPricing` object
- Added missing fields: `services`, `addons`, `servicesSubtotal`, `addonsSubtotal`, `hasPromotion`, `promotionName`, `promotionPrice`, `promotionDiscount`, `totalDuration`
- Fixes error: "Type is missing properties from CartPricing: services, addons, servicesSubtotal..."

---

## [1.0.21] - 2026-01-12

### Fixed
- **CRITICAL: Infinite loop causing page unresponsive**: `calculatePricing()` was calling `set()` during render, triggering infinite re-renders (5000+ errors)
- **FloatingCart.tsx**: Replaced `calculatePricing()` call with local `useMemo` computation
- **CartSummary.tsx**: Replaced `useEffect` + `calculatePricing()` with local `useMemo` computation
- **ConfirmStep.tsx**: Replaced `useEffect` + `calculatePricing()` with local `useMemo` computation
- **store.ts**: Removed `set()` call from `calculatePricing` to prevent state updates during render

### Technical Details
- All pricing calculations now use `useMemo` with proper dependencies
- Store's `calculatePricing` is now a pure function that returns pricing without side effects
- ITBM_RATE constant (0.07) defined locally in components that need it

---

## [1.0.20] - 2026-01-12

### Fixed
- **Page stalling when adding treatments**: Added `setTimeout()` wrapper to toggle handlers to prevent React state race conditions
- **Event propagation issues**: All buttons now use `e.preventDefault()` and `e.stopPropagation()` with explicit `type="button"` attribute

### Changed
- **Service tile titles**: Larger font size (`text-base sm:text-lg` from `text-sm`) for better readability
- **Duration display**: New pill-style badge with clock icon and rounded background
- **Categories start collapsed**: Categories now start collapsed by default for better UX
- **Description preview**: 2-line description preview shown by default with `line-clamp-2`
- **Info button icon**: Changed from Info/X icons to ChevronDown/ChevronUp for expand/collapse

### Updated Components
- `ServiceStep.tsx` - Larger titles, description preview, collapsed categories, fixed toggle
- `AddonsStep.tsx` - Larger titles, description preview, fixed toggle
- `ServiceTile.tsx` (shared) - Larger fonts, better event handling, description preview

---

## [1.0.19] - 2026-01-12

### Added
- **FloatingCart component**: Retail-style floating cart icon with dropdown
  - Shopping bag icon with item count badge
  - Dropdown panel showing services and add-ons
  - Remove items directly from cart
  - Pricing breakdown (subtotal, ITBM 7%, total)
  - Click outside to close functionality
  - Framer Motion animations
- **ServiceTile component**: Tile-based treatment display with expandable descriptions
  - Cards with add/remove button and info toggle
  - Expandable description panels
  - Selected state visual indicators
  - Duration and price display

### Changed
- **ServiceStep**: Complete redesign with tile-based category layout
  - Category headers with icons and colored gradients
  - Grid layout for services within categories
  - All categories expanded by default
  - Service count and selected count per category
  - Info button to expand/collapse descriptions
- **AddonsStep**: Updated to tile-based layout
  - Consistent tile design with ServiceStep
  - Expandable descriptions
  - Cleaner visual hierarchy
- **BookingWidget**: Integrated FloatingCart for mobile view
  - Floating cart icon in header on mobile
  - Replaced sticky bottom cart with floating dropdown
  - Desktop sidebar cart unchanged

### UI/UX
- Category icons: 💆 Corporales, ✨ Faciales, 👑 Deluxe, 🌿 Masajes, 💕 Parejas, 🧘 TAI, 🎉 Eventos
- Color-coded category gradients
- Improved mobile cart experience with floating dropdown


## [1.0.18] - 2026-01-12

### Changed
- **Services data source**: Now uses ONLY `/sale/services` endpoint for service pricing
- Services are filtered for single session pricing only (`Count === 1`)
- Removed session types combination - all data from sale/services
- Add-ons also use single session filtering

### Removed
- `extractPriceFromHtml()` function (no longer needed)
- `cleanHtmlToText()` function (no longer needed)
- Session types API call for services

### UI
- Duration display hidden when Duration is 0 (sale/services doesn't provide duration)


## [1.0.17] - 2026-01-12

### Fixed
- **Services API**: Now correctly uses `onlineOnly=true` parameter to fetch only online-bookable services
- **Price extraction**: Prices are now extracted from HTML OnlineDescription field (e.g., `<em>30 minutos $59</em>`)
- **Spanish categories**: Services now display Spanish category names based on ProgramId mapping
- **Add-ons endpoint**: Separate `/sale/services` API for add-ons with actual prices (ProgramId 8)

### Changed
- Updated `getServices()` in mindbody.ts to:
  - Use `onlineOnly=true` parameter
  - Extract prices from HTML descriptions
  - Map English categories to Spanish
  - Clean HTML entities from descriptions
- Added `getAddons()` function using `/sale/services` endpoint for proper add-on pricing
- Services route now filters by ProgramId (8 = Adicionales) instead of category string

### Technical
- Added PROGRAM_NAMES mapping for Spanish program names
- Added CATEGORY_TRANSLATIONS for English to Spanish fallback
- Added `extractPriceFromHtml()` and `cleanHtmlToText()` helper functions


## [1.0.16] - 2026-01-12

### Added
- WATI WhatsApp integration for booking confirmations
- Spanish templates: `confirmacion_reserva` and `recordatorio_cita`
- Appointment confirmation/cancellation endpoints (`/api/cita/confirmar`, `/api/cita/cancelar`)
- Health check endpoint (`/api/health`)

### Fixed
- TypeScript error in AppointmentResponse interface
- PWA manifest warnings (apple-mobile-web-app-capable, icon sizes)
- Mindbody API configuration validation
- Locale detection forcing Spanish as default
- Logo placement in header and footer
- Location name overrides (Costa del Este, San Francisco)

### Changed
- Updated all icons to use Mimosa flower logo
- Footer logo now shows icon with cream background


## [1.0.15] - 2026-01-12

### Added
- Client authentication with multiple clients popup
- CartSummary component with ITBM tax display
- 8-step booking flow implementation
- Zustand store for booking state management


## [1.0.0 - 1.0.14] - Previous versions

Initial development including:
- Next.js 15 with App Router
- React 19 with TypeScript
- Supabase authentication for admin
- Tailwind CSS styling
- PWA configuration
- Mindbody API integration foundation
- Multilingual support (ES/EN)
- Dark header with prominent logo
- Responsive design
