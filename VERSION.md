# Mimosa Spa Website - Version History

**Project:** Mimosa Spa Retreat Website & Booking Widget  
**Repository:** mimosa-spa-website  
**Current Version:** 1.1.3  
**Last Updated:** January 13, 2026

---

## Table of Contents

- [Version 1.1.x (Current)](#version-11x-current)
- [Version 1.0.x](#version-10x)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)

---

## Version 1.1.x (Current)

### Version 1.1.3 (January 13, 2026)

#### 🔧 Bug Fix: Scroll Lock Issue on Desktop

Fixed critical issue where page became unscrollable after adding items to cart.

**Problem:**
- After adding items to cart, the entire page became static
- User couldn't scroll to see the "Continuar" button at the bottom
- Caused by body scroll lock from FloatingCart being applied on desktop

**Solution:**
- **Mobile-only scroll lock:** Body scroll is now only locked on mobile (under 1024px) when the FloatingCart overlay is shown
- **Desktop sidebar doesn't lock scroll:** On desktop, the cart is a sidebar in BookingWidget, not an overlay
- **FloatingCart overlay hidden on desktop:** Added `lg:hidden` wrapper so the overlay only renders on mobile
- **Window resize listener:** Properly handles scroll lock when resizing between mobile/desktop

**Technical Changes:**
```typescript
// Before: Always locked scroll when cart open
if (isCartOpen) {
  document.body.style.overflow = 'hidden'
}

// After: Only lock on mobile
const isMobile = window.innerWidth < 1024
if (isCartOpen && isMobile) {
  document.body.style.overflow = 'hidden'
}
```

**Files Changed:**
| File | Changes |
|------|---------|
| `src/components/booking/shared/FloatingCart.tsx` | Mobile-only scroll lock, mobile-only overlay rendering |

---

### Version 1.1.2 (January 13, 2026)

#### 🔧 Bug Fixes: Duration Parsing & Cart Close Button

Fixed two issues reported in cart functionality.

**1. Duration Now Parsed from Service Names**

Services show correct duration instead of "0 minutos".

- Added `parseDurationFromName()` helper function
- Extracts duration from service names like "Baño de Luna - 120 min"
- Supports various formats: "60 min", "90 minutos", "45 mins", "2 horas"
- Applied to both services and addons

**Examples:**
```
"Baño de Luna - 120 min" → Duration: 120
"Masaje Relajante - 60min" → Duration: 60
"Tratamiento Facial - 90 minutos" → Duration: 90
```

**2. Cart Close Button Added**

- Added X button in cart header to close sidebar
- Button visible on both mobile overlay and desktop sidebar
- Uses `closeCart()` action from booking store

**Files Changed:**
| File | Changes |
|------|---------|
| `src/lib/booking/mindbody.ts` | Added `parseDurationFromName()` helper |
| `src/components/booking/shared/FloatingCart.tsx` | Close button in header |
| `src/components/booking/shared/CartSummary.tsx` | Optional close button prop |

---

### Version 1.1.1 (January 13, 2026)

#### 🛒 Cart Icon in Step Progress Bar

Added cart icon to the step progress bar for better UX.

**Features:**
- **Desktop:** Cart icon appears after step 7 "Confirmar" with connector line
- **Mobile:** Cart button in the progress bar header next to step name
- **Badge:** Shows item count when services/addons are in cart
- **Auto-open:** Cart sidebar opens automatically when you add an item
- **Click toggle:** Click cart icon to open/close the sidebar

**Visual Preview:**
```
[1]—[2]—[3]—[4]—[5]—[6]—[7]—[🛒]
 ✓   ✓   ●   ○   ○   ○   ○   2️⃣  ← item count badge
```

**Technical Changes:**
- Added `isCartOpen`, `openCart`, `closeCart`, `toggleCart` to booking store
- `addService` and `addAddon` now auto-open cart when items added
- StepProgress component now includes cart button with item count
- FloatingCart uses store state instead of local state for open/close

**Files Changed:**
| File | Changes |
|------|---------|
| `src/lib/booking/store.ts` | Added cart UI state and actions |
| `src/components/booking/shared/StepProgress.tsx` | Added cart icon with count |
| `src/components/booking/shared/FloatingCart.tsx` | Uses store for open/close |

---

### Version 1.1.0 (January 13, 2026)

#### 🎯 Major Update: Pricing & Cart UI Improvements

Three critical fixes applied to improve booking experience.

**1. ITBM Tax Handling Fix**

Prices now display WITHOUT tax; ITBM calculated only in cart.

- Added `removeTaxFromPrice()` helper function in mindbody.ts
- Mindbody returns prices WITH 7% ITBM included
- Now we remove ITBM for display: `priceWithoutTax = priceWithTax / 1.07`
- ITBM is calculated and shown separately in cart summary
- This matches customer expectation: "see base price, tax added at checkout"

**Formula:**
```typescript
const ITBM_TAX_RATE = 0.07
function removeTaxFromPrice(priceWithTax: number): number {
  return Math.round(priceWithTax / (1 + ITBM_TAX_RATE))
}
```

**Example:**
```
Baño de Luna in Mindbody: $149 (includes ITBM)
Widget display price: $139 (without ITBM)
Cart breakdown: Subtotal $139 + ITBM $9.73 = Total $148.73
```

**2. Online Booking Filter Enhancement**

Only show services enabled for online booking.

Updated filtering in `getServices()` and `getAddons()`:
- `SellOnline === true` (must be enabled for online booking)
- `Count === 1` (single session only, no packages)
- `Price > 0` (must have a price)
- `ProgramId !== 8` for services (exclude Adicionales category)
- `ProgramId === 8` for addons (only Adicionales category)

**3. Cart Sidebar Overlay Redesign**

Converted dropdown to full-height sliding sidebar.

New FloatingCart.tsx features:
- **Fixed toggle button** on right edge of screen (always visible)
- **Full-height sidebar** slides from right (100% width mobile, 384px desktop)
- **Backdrop overlay** with blur effect
- **Escape key** closes sidebar
- **Click outside** closes sidebar
- **Body scroll prevention** when open (mobile only)
- **Spring animation** for smooth open/close
- **Detailed pricing breakdown:**
  - Tratamientos (services subtotal)
  - Adicionales (addons subtotal)
  - Promoción discount (if active)
  - Subtotal
  - ITBM (7%)
  - Total

**Files Changed:**
| File | Changes |
|------|---------|
| `src/lib/booking/mindbody.ts` | Added ITBM removal, enhanced filtering |
| `src/components/booking/shared/FloatingCart.tsx` | Complete redesign to sidebar |

---

## Version 1.0.x

### Version 1.0.23 (January 12, 2026)

**Fixed:**
- TypeScript error in ConfirmStep.tsx: Changed `activePromotion?.name` to `activePromotion?.title_es`
- `PromotionWithServices` type uses `title_es` not `name` for the promotion title

---

### Version 1.0.22 (January 12, 2026)

**Fixed:**
- TypeScript compilation error in ConfirmStep.tsx
- `useMemo` now returns complete `CartPricing` object
- Added missing fields: `services`, `addons`, `servicesSubtotal`, `addonsSubtotal`, `hasPromotion`, `promotionName`, `promotionPrice`, `promotionDiscount`, `totalDuration`

---

### Version 1.0.21 (January 12, 2026)

**Added:**
- FloatingCart component with tile-based layout
- Removed inline cart from BookingWidget
- Floating cart button fixed to bottom-right corner
- Cart shows service/addon tiles with remove buttons
- Real-time price calculations with ITBM

---

### Version 1.0.20 (January 12, 2026)

**Fixed:**
- CartPricing calculation moved from store method to local useMemo
- Prevents infinite re-render loop caused by store updates during render
- Applied fix to FloatingCart.tsx, CartSummary.tsx, and ConfirmStep.tsx

---

### Version 1.0.19 (January 12, 2026)

**Added:**
- Floating cart icon component
- ServiceTile component for visual service display
- Improved cart interaction patterns

---

### Version 1.0.18 (January 11, 2026)

**Fixed:**
- Build errors related to component imports
- TypeScript strict mode compliance

---

### Version 1.0.17 (January 11, 2026)

**Fixed:**
- Services API fix with `onlineOnly` parameter
- Filtering services by online booking availability
- API endpoint parameter corrections

---

### Version 1.0.16 (January 10, 2026)

**Added:**
- WATI WhatsApp integration for booking confirmations
- Native booking system implementation
- Removed Mindbody widget dependency
- Full API integration with Mindbody Public API v6

---

### Version 1.0.15 (January 9, 2026)

**Added:**
- Promotions system with Supabase backend
- Admin interface for managing promotions
- Promotion cards with images and descriptions
- Date-based promotion validity

---

### Version 1.0.14 (January 8, 2026)

**Added:**
- Photo gallery component
- Admin gallery management
- Image upload to Supabase storage

---

### Version 1.0.13 (January 7, 2026)

**Added:**
- Menu page with treatment categories
- Collapsible accordion sections
- Service cards with pricing and duration

---

### Version 1.0.12 (January 6, 2026)

**Added:**
- About Us page content
- Location information
- Contact details

---

### Version 1.0.11 (January 5, 2026)

**Added:**
- PWA (Progressive Web App) configuration
- Service worker for offline support
- App manifest for mobile installation

---

### Version 1.0.10 (January 4, 2026)

**Added:**
- WhatsApp contact widget
- Fixed position button on all pages
- Direct link to business WhatsApp

---

### Version 1.0.9 (January 3, 2026)

**Added:**
- Multilingual support (Spanish/English)
- next-intl integration
- Language switcher component

---

### Version 1.0.8 (January 2, 2026)

**Added:**
- Mobile-responsive navigation
- Hamburger menu for mobile
- Smooth scroll navigation

---

### Version 1.0.7 (January 1, 2026)

**Added:**
- Homepage hero section
- Featured services section
- Call-to-action buttons

---

### Version 1.0.6 (December 31, 2025)

**Added:**
- Supabase authentication integration
- Admin login system
- Protected admin routes

---

### Version 1.0.5 (December 30, 2025)

**Added:**
- Tailwind CSS configuration
- Custom color palette (beige, gold theme)
- Typography setup

---

### Version 1.0.4 (December 29, 2025)

**Added:**
- Next.js 15 project setup
- Basic routing structure
- Layout components

---

### Version 1.0.3 (December 28, 2025)

**Added:**
- Vercel deployment configuration
- Environment variable setup
- Build optimization

---

### Version 1.0.2 (December 27, 2025)

**Added:**
- GitHub repository setup
- Initial commit structure
- README documentation

---

### Version 1.0.1 (December 26, 2025)

**Initial Release:**
- Project initialization
- Basic file structure
- Development environment setup

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mindbody API
MINDBODY_API_KEY=your_api_key
MINDBODY_SITE_ID=-41931

# WhatsApp (WATI)
WATI_API_KEY=your_wati_key
WATI_ENDPOINT=your_wati_endpoint

# App Config
NEXT_PUBLIC_APP_URL=https://mimosaretreat.com
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| API Integration | Mindbody Public API v6 |
| Messaging | WATI (WhatsApp) |
| Hosting | Vercel |
| i18n | next-intl |

---

## Deployment

### Vercel (Automatic)

1. Push to `main` branch on GitHub
2. Vercel auto-deploys from connected repository
3. Environment variables configured in Vercel dashboard

### Manual Deployment

```bash
# Extract zip package
unzip mimosa-spa-v1.1.3.zip -d mimosa-spa-website
cd mimosa-spa-website

# Install dependencies
npm install

# Build
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Document Information

| Field | Value |
|-------|-------|
| Document Version | 2.0 |
| Created | December 26, 2025 |
| Last Updated | January 13, 2026 |
| Maintainer | Development Team |
| Client | Mimosa Spa Retreat, Panama |
