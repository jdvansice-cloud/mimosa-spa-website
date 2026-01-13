# Mimosa Spa Website - Version History

## Version 1.1.1 (January 13, 2026)

### 🛒 Cart in Step Progress Bar

Added cart icon integrated into the step progress bar:

#### Features:
- **Cart icon with badge** positioned after step 7 "Confirmar" in desktop view
- **Item count badge** shows number of items in cart (services + addons)
- **Click to toggle** opens/closes the cart sidebar
- **Auto-open** cart automatically opens when item is added
- **Mobile support** cart button in mobile progress bar header
- **Visual feedback** gold highlight when items in cart

#### Technical Changes:
- Added `isCartOpen`, `openCart`, `closeCart`, `toggleCart` to booking store
- `addService` and `addAddon` now auto-open cart when items added
- StepProgress component now includes cart button with item count
- FloatingCart uses store state instead of local state for open/close
- Removed fixed floating cart button (now in step bar)

### Files Changed:
| File | Changes |
|------|---------|
| `src/lib/booking/store.ts` | Added cart UI state and actions |
| `src/components/booking/shared/StepProgress.tsx` | Added cart icon with count |
| `src/components/booking/shared/FloatingCart.tsx` | Uses store for open/close |

---

## Version 1.1.0 (January 13, 2026)

### 🎯 Major Update: Pricing & Cart UI Improvements

Three critical fixes applied to improve booking experience:

#### 1. ITBM Tax Handling Fix
**Prices now display WITHOUT tax; ITBM calculated only in cart**

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

#### 2. Online Booking Filter Enhancement
**Only show services enabled for online booking**

Updated filtering in `getServices()` and `getAddons()`:
- `SellOnline === true` (must be enabled for online booking)
- `Count === 1` (single session only, no packages)
- `Price > 0` (must have a price)
- `ProgramId !== 8` for services (exclude Adicionales category)
- `ProgramId === 8` for addons (only Adicionales category)

#### 3. Cart Sidebar Overlay Redesign
**Converted dropdown to full-height sliding sidebar**

New FloatingCart.tsx features:
- **Fixed toggle button** on right edge of screen (always visible)
- **Full-height sidebar** slides from right (100% width mobile, 384px desktop)
- **Backdrop overlay** with blur effect
- **Escape key** closes sidebar
- **Click outside** closes sidebar
- **Body scroll prevention** when open
- **Spring animation** for smooth open/close
- **Detailed pricing breakdown:**
  - Tratamientos (services subtotal)
  - Adicionales (addons subtotal)
  - Promoción discount (if active)
  - Subtotal
  - ITBM (7%)
  - Total

### Files Changed

| File | Changes |
|------|---------|
| `src/lib/booking/mindbody.ts` | Added ITBM removal, enhanced filtering |
| `src/components/booking/shared/FloatingCart.tsx` | Complete redesign to sidebar |

---

## Version 1.0.23 (January 12, 2026)

### Maintenance Release
- Minor stability improvements
- Code cleanup

---

## Version 1.0.21 (January 12, 2026)

### 🐛 Critical Bug Fix: Infinite Loop in Pricing Calculation

**Fixed page unresponsive error caused by calculatePricing infinite loop**

#### Root Cause

The `calculatePricing` function in the Zustand store was calling `set()` to update state during component render. This triggered re-renders which called `calculatePricing` again, creating an infinite loop that caused the page to become unresponsive (5000+ errors in console).

#### Solution

Replaced `calculatePricing()` calls with `useMemo` hooks in all affected components:

1. **FloatingCart.tsx** - Uses local useMemo for pricing calculation
2. **CartSummary.tsx** - Uses local useMemo for pricing calculation  
3. **ConfirmStep.tsx** - Uses local useMemo for pricing calculation
4. **store.ts** - calculatePricing now returns pricing without calling set()

#### Technical Details

**Before (broken):**
```tsx
// Called during render - triggers infinite loop
const pricing = calculatePricing()
```

**After (fixed):**
```tsx
// Pure computation with useMemo - no state updates
const pricing = useMemo(() => {
  const servicesSubtotal = selectedServices.reduce((sum, s) => sum + s.Price, 0)
  // ... calculation
  return { subtotalBeforeTax, itbmAmount, totalWithTax }
}, [selectedServices, selectedAddons, activePromotion])
```

#### Updated Components

| Component | Change |
|-----------|--------|
| `FloatingCart.tsx` | Replaced calculatePricing() with useMemo |
| `CartSummary.tsx` | Replaced calculatePricing() with useMemo |
| `ConfirmStep.tsx` | Replaced calculatePricing() with useMemo |
| `store.ts` | Removed set() call from calculatePricing |

---

## Version 1.0.20 (January 12, 2026)

### 🎨 Service Tile UI Improvements & Bug Fixes

**Improved readability and fixed interaction issues**

#### UI Improvements

**Larger Service Titles**
- Service names now use `text-base sm:text-lg` (was `text-sm`)
- Bold font weight for better visibility
- Better line spacing for long service names

**Description Preview**
- 2-line preview of service description shown by default
- Uses `line-clamp-2` for truncation
- Expand button reveals full description
- Changed icon from Info to ChevronDown/ChevronUp for clarity

**Duration Badge**
- New pill-style duration badge with background
- Clock icon with time in rounded pill
- Better visual hierarchy

#### Bug Fixes

**Fixed: Page stalling when adding treatments**
- Added `setTimeout(() => ..., 0)` wrapper to all toggle handlers
- Prevents React state update race conditions
- Smooth interaction on add/remove

**Fixed: Event propagation issues**
- All button clicks now use `e.preventDefault()` and `e.stopPropagation()`
- Added `type="button"` to all buttons
- Prevents unintended form submissions

**Categories start collapsed**
- Categories now start collapsed by default
- Users expand what they're interested in
- Better UX for many categories

#### Updated Components

| Component | Changes |
|-----------|---------|
| `ServiceStep.tsx` | Larger titles, description preview, collapsed by default, fixed toggle |
| `AddonsStep.tsx` | Larger titles, description preview, fixed toggle |
| `ServiceTile.tsx` (shared) | Larger fonts, better event handling, description preview |

---

## Version 1.0.19 (January 12, 2026)

### 🛒 Retail-Style Cart & Tile UI Redesign

**Major UI overhaul for service selection experience!**

#### New Components

**FloatingCart** (`/components/booking/shared/FloatingCart.tsx`)
- Retail-style shopping bag icon with item count badge
- Dropdown cart panel with full item management
- Remove items directly from cart
- Pricing breakdown: Subtotal, ITBM (7%), Total
- Click outside to close
- Framer Motion animations for smooth interactions

**ServiceTile** (`/components/booking/shared/ServiceTile.tsx`)
- Card-based treatment display
- Expandable description panels
- Selected state visual indicators
- Price badge with duration
- Add/Remove toggle button

#### Updated Components

**ServiceStep** - Complete Redesign
- Category-grouped tile layout
- Category icons with colored gradients
- Expandable category sections
- Grid layout (2 columns)
- Category headers show count + selected count

**AddonsStep** - Tile Layout
- Consistent design with ServiceStep
- Expandable addon descriptions
- Grid-based layout

**BookingWidget** - Mobile Cart Integration
- FloatingCart in header on mobile
- Removed sticky bottom cart
- Desktop sidebar unchanged

#### Category Icons & Colors
| Category | Icon | Gradient |
|----------|------|----------|
| Tratamientos Corporales | 💆 | amber-orange |
| Tratamientos Faciales | ✨ | pink-rose |
| Paquetes Deluxe | 👑 | yellow-amber |
| Paquetes de Masajes | 🌿 | emerald-teal |
| Tratamientos Parejas | 💕 | rose-pink |
| TAI | 🧘 | blue-indigo |
| Eventos | 🎉 | violet-purple |

---

## Version 1.0.16 (January 12, 2026)

### 🚀 MAJOR: Native Booking System Implementation

**Complete native booking widget replacing iframe implementation!**

#### New Files Created

**API Routes:**
- `/api/mindbody/auth/route.ts` - Client lookup & registration
- `/api/mindbody/locations/route.ts` - Get spa locations
- `/api/mindbody/services/route.ts` - Get services with ADICIONALES filtering
- `/api/mindbody/staff/route.ts` - Get therapists
- `/api/mindbody/availability/route.ts` - Check availability
- `/api/mindbody/book/route.ts` - Create appointments
- `/api/cita/confirmar/route.ts` - Confirm appointment via WhatsApp button
- `/api/cita/cancelar/route.ts` - Cancel appointment via WhatsApp button

**Result Page:**
- `/app/cita/resultado/page.tsx` - Appointment confirmation/cancellation result page

**Booking Store:**
- `/lib/booking/store.ts` - Zustand state management
- `/lib/booking/mindbody.ts` - Mindbody API utility with token management
- `/lib/booking/wati.ts` - WATI WhatsApp API for notifications

**Types:**
- `/types/booking.ts` - Comprehensive booking system types

**UI Components:**
- `BookingWidget.tsx` - Main container with step routing
- `shared/StepProgress.tsx` - Visual progress indicator
- `shared/CartSummary.tsx` - Cart with ITBM calculation
- `shared/ClientSelector.tsx` - Multiple clients modal
- `steps/AuthStep.tsx` - Email/phone login & registration
- `steps/LocationStep.tsx` - Spa location selection
- `steps/ServiceStep.tsx` - Treatment selection with categories
- `steps/AddonsStep.tsx` - ADICIONALES selection
- `steps/StaffStep.tsx` - Therapist selection
- `steps/DateTimeStep.tsx` - Calendar & time slots
- `steps/ConfirmStep.tsx` - Booking summary & submit
- `steps/SuccessStep.tsx` - Confirmation with details

#### Features Implemented

1. **Authentication**
   - Email or phone number lookup
   - Multiple clients popup for shared contacts
   - New client registration

2. **Service Selection**
   - Collapsible category groups
   - ADICIONALES category separated
   - Multi-service selection

3. **Staff Selection**
   - "Any Therapist" option
   - Individual therapist cards with avatars

4. **Date/Time Selection**
   - Interactive calendar
   - Availability indicators
   - Time slot grid

5. **Cart & Pricing**
   - Promotion pricing with discount display
   - ITBM (7%) tax calculation
   - Total duration tracking

6. **Booking Confirmation**
   - Full booking summary
   - Submit to Mindbody
   - Success screen with confirmation number

7. **WATI WhatsApp Integration**
   - Automatic booking confirmation via WhatsApp
   - Template message support
   - `/lib/booking/wati.ts` - WATI API utility

#### Environment Variables Added

```
WATI_API_URL=https://live-mt-server.wati.io
WATI_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIs... (JWT token)
```

---

## Version 1.0.15 (January 12, 2026)

### Environment Variables Update
- **Updated:** `.env.example` with comprehensive Vercel configuration
- **Added:** Detailed Vercel Dashboard setup instructions in brief
- **Added:** Security notes for NEXT_PUBLIC_ vs server-only variables
- **Added:** Environment-specific configuration table

### Vercel Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `MINDBODY_API_KEY` | 🔒 Secret | Mindbody API key |
| `MINDBODY_SITE_ID` | Plain | Site ID (-41931) |
| `MINDBODY_API_URL` | Plain | API base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 Secret | Supabase service key |
| `NEXT_PUBLIC_SITE_URL` | Plain | Production URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Plain | WhatsApp number |
| `NEXT_PUBLIC_ITBM_RATE` | Plain | Tax rate (0.07) |

### Future Variables (Placeholders)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Online payments
- `STRIPE_SECRET_KEY` - Stripe server key
- `WATI_API_KEY` - WhatsApp notifications

---

## Version 1.0.14 (January 11, 2026)

### Documentation Updates
- **Added:** Authentication System section with email/phone lookup
- **Added:** Multiple clients selection popup for shared contact info
- **Added:** ClientSelector component specification
- **Added:** Client lookup API endpoint specification
- **Updated:** Booking state with multiple clients handling fields
- **Added:** useClientLookup hook to component structure

### Client Lookup Features
- Search by email OR phone number
- Single client → proceed directly
- Multiple clients → show selection popup
- No client found → offer registration

### Multiple Clients Popup
```
┌─────────────────────────────────────────┐
│     Selecciona tu perfil                │
├─────────────────────────────────────────┤
│  👤 María García López                  │
│  👤 Carlos García López                 │
│  👤 Sofia García (Menor)                │
└─────────────────────────────────────────┘
```

---

## Version 1.0.13 (January 11, 2026)

### Documentation Updates
- **Added:** ITBM (7%) tax calculation in cart
- **Updated:** Cart display shows Subtotal, ITBM, and Total lines
- **Updated:** Pricing calculation logic includes tax

### Cart Pricing Display
```
Subtotal:        $94.00
ITBM (7%):        $6.58
─────────────────────────
TOTAL:          $100.58
```

---

## Version 1.0.12 (January 11, 2026)

### Documentation Updates
- **Updated:** Implementation brief with detailed cart pricing display
- **Added:** Visual distinction between promotion and regular bookings
- **Added:** Cart summary component specifications
- **Added:** Pricing calculation logic
- **Added:** Confirmation step with booking submission flow

### Cart Features Planned
- Shows regular prices for each service
- Displays promotion price with discount amount
- Strikethrough on original prices when promotion active
- Gold styling for promotion bookings
- Running total with duration

### Visual Distinction
| Element | Promotion | Regular |
|---------|-----------|---------|
| Border | Gold 2px | Gray 1px |
| Background | Gold tint | White |
| Header | ⭐ PROMOCIÓN badge | None |
| Items | Checkmarks ✓ | Bullets • |
| Pricing | Shows discount | Regular price |

---

## Version 1.0.11 (January 11, 2026)

### Documentation
- **Added:** Comprehensive Booking System Implementation Brief
- **Location:** `/docs/BOOKING_SYSTEM_IMPLEMENTATION_BRIEF.md`

### Key Planning Decisions

#### Promotion-Linked Bookings
- Promotions will link to Mindbody promotions/packages
- Each website promotion stores array of Mindbody service IDs
- Clicking "Book" on promotion pre-loads all included services

#### Multi-Treatment Booking
- Booking cart supports multiple services
- Total duration calculated from all services + add-ons
- Availability checks for continuous time blocks

#### Add-on Services (ADICIONALES)
- "ADICIONALES" category hidden from main service list
- Shown as separate step after selecting main treatments
- Added to total duration for availability calculation

#### Booking Flow (8 Steps)
1. Authentication (email/phone)
2. Location Selection
3. Service Selection (excludes ADICIONALES)
4. Add-on Selection (ADICIONALES only)
5. Staff Selection
6. Date & Time Selection
7. Confirmation

---

## Version 1.0.10 (January 11, 2026)

### Changes
- **Updated:** Logo files with transparent backgrounds
- **Changed:** Header now displays full Mimosa logo image
- **Removed:** "Explorar" text from hero section, kept just the scroll arrow

---

## Version 1.0.9 (January 11, 2026)

### UI Improvements
- **Changed:** Header now has dark background for better contrast
- **Changed:** Navigation links are now light colored on dark header
- **Changed:** Language switcher supports dark variant for header
- **Improved:** Hero section text visibility with stronger overlay and text shadows
- **Improved:** Logo component now properly renders icon+text on dark backgrounds

---

## Version 1.0.8 (January 11, 2026)

### New Features
- **Added:** Mimosa flower favicon (browser tab icon)
- **Added:** Apple touch icon for iOS home screen
- **Added:** PWA icons (192x192, 512x512)
- **Updated:** Manifest.json with proper icon references

---

## Version 1.0.7 (January 11, 2026)

### New Features
- **Added:** Official Mimosa Spa logo integrated throughout the site
- **Added:** Logo icon (mimosa flower) for compact displays

### Logo Usage
```tsx
// Full logo (light backgrounds - header)
<Logo size="md" />

// Icon only (any background)
<Logo variant="icon" size="md" />

// Size options: sm, md, lg, xl
<Logo size="lg" />
```

---

## Version 1.0.6 (January 11, 2026)

### Improvements
- **Fixed:** Modal scrolling - modals now scroll when content exceeds screen height
- **Fixed:** Modal max-height limited to 90vh for better UX
- **Improved:** Logo component with theme support (light/dark) and size variants (sm/md/lg)
- **Improved:** Promotion form layout with better organization

---

## Version 1.0.5 (January 11, 2026)

### New Features
- **Added:** Supabase authentication for admin panel
- **Added:** Protected routes - admin pages require login
- **Added:** Auth store with Zustand for session management
- **Added:** Sign out functionality with proper session clearing
- **Added:** User email display in admin sidebar

### Files Added
- `src/lib/auth/store.ts` - Authentication state management
- `src/components/auth/AuthProvider.tsx` - Auth initialization
- `src/components/auth/ProtectedRoute.tsx` - Route protection
- `src/app/admin/AdminLayoutClient.tsx` - Client-side admin layout

### How to Create Admin User
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Click "Add user" → "Create new user"
4. Enter email and password for your admin account
5. User can now log in at `/admin/login`

---

## Version 1.0.4 (January 11, 2026)

### Major Updates
- **Upgraded:** Next.js 15.1.3 → 16.1.1
- **Upgraded:** React 18 → React 19.0.0
- **Upgraded:** next-intl 3.4.0 → 4.7.0 (Next.js 16 support, new routing API)
- **Upgraded:** lucide-react 0.303.0 → 0.469.0 (React 19 support)
- **Upgraded:** framer-motion 10.16.16 → 11.15.0 (React 19 support)
- **Upgraded:** zustand 4.4.7 → 5.0.0
- **Upgraded:** @supabase/ssr 0.1.0 → 0.6.0
- **Upgraded:** @supabase/supabase-js 2.39.0 → 2.48.0
- **Security:** All CVE patches included (CVE-2025-66478, CVE-2025-55183, CVE-2025-55184, CVE-2025-67779)

### Bug Fixes
- **Fixed:** Components updated to use `useLocale()` hook instead of locale props
- **Fixed:** Removed duplicate `src/lib/i18n/config.ts` (was conflicting with `src/i18n/request.ts`)
- **Fixed:** `getLocalizedContent` type signature for React 19 compatibility
- **Fixed:** Sample promotions missing required fields
- **Fixed:** `cookies()` async handling for Next.js 16

### Breaking Changes
- Updated next-intl configuration to v4 API (routing.ts, request.ts, middleware.ts)

### Validation Commands
```bash
# Quick check (lint + type-check) - May miss some build-time errors
npm run check-all

# Full build validation (catches ALL errors, same as Vercel)
npm run verify
```

**Important:** Always run `npm run verify` before pushing to ensure deployment success.

---

## Version 1.0.3 (January 8, 2026)

### Bug Fixes
- **Fixed:** All ESLint errors (unused imports, variables, any types)
- **Fixed:** Replaced `<a>` tags with Next.js `<Link>` components
- **Fixed:** Empty interface declarations converted to type aliases
- **Fixed:** Replaced `<img>` with Next.js `<Image>` component in Card
- **Added:** `type-check` and `check-all` npm scripts for local validation

---

## Version 1.0.2 (January 8, 2026)

### Bug Fixes
- **Fixed:** Supabase TypeScript typing errors in API routes (gallery, promotions)
- **Changed:** API routes now use direct Supabase client without strict typing

---

## Version 1.0.1 (January 8, 2026)

### Bug Fixes
- **Fixed:** TypeScript error in admin gallery page (Button `as` prop)
- **Fixed:** next-intl deprecation warning (moved i18n config to `src/i18n/request.ts`)
- **Security:** Updated Next.js from 14.0.4 to 14.2.21 to patch security vulnerability

---

## Version 1.0.0 (January 8, 2026)

### Initial Release

**Features:**
- Landing page with hero section, featured categories, promotions preview
- Menu page with treatment categories grid
- Promotions page with admin-managed promotions
- About Us page with company information
- Gallery page with lightbox and category filtering
- Booking page with embedded Mindbody widget
- Admin dashboard with login, promotions management
- Bilingual support (Spanish/English)
- Mobile-responsive design with PWA capabilities
- WhatsApp floating widget
- Mobile bottom navigation

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database, Auth, Storage)
- Vercel (Hosting)
- next-intl (i18n)
- Framer Motion (Animations)
- Lucide Icons

**Database Tables:**
- profiles (user management)
- promotions (monthly promotions)
- gallery_images (photo gallery)
- site_settings (configuration)

**Integrations:**
- Mindbody API (via Railway proxy)
- WhatsApp Business

---

## Changelog Format

### Version X.Y.Z (Date)
- **Added:** New features
- **Changed:** Changes in existing functionality
- **Fixed:** Bug fixes
- **Removed:** Removed features
- **Security:** Security fixes
