# Mimosa Spa Website - Version History

## Current Version: 1.1.0
**Release Date:** January 13, 2026
**Status:** Production Ready

---

## Version 1.1.0 (Current) - Major Refactor

### Key Changes
1. **Cart UI Redesign** - Converted to collapsible overlay sidebar from the right
   - Fixed toggle button on right edge (visible when cart has items)
   - Sliding sidebar with spring animation
   - Backdrop overlay with blur effect
   - Escape key to close
   - Item count badge and total price display

2. **ITBM Pricing Fix** - Removed 7% tax from display prices
   - Mindbody prices INCLUDE 7% ITBM tax
   - Display prices now show WITHOUT tax
   - ITBM calculated and shown in cart breakdown
   - Example: Baño de Luna shows $139 (not $148.73)

3. **Online Booking Filter** - Only show bookable services
   - Filter services by `SellOnline === true`
   - Exclude packages (multi-session services)
   - Hide categories with no online-bookable services
   - Exclude "ADICIONALES" from main services (shown separately as addons)

4. **Dependency Stabilization** - Fixed Next.js 16 incompatibility
   - Downgraded to Next.js 15.1.3 (compatible with next-intl 3.25.0)
   - Stable React 18.3.1
   - Zustand 5.0.2 for state management
   - Framer Motion 11.15.0 for animations

### Technical Improvements
- Pure `calculatePricing()` function separated from Zustand store
- Components use `useMemo(() => calculatePricing(...))` for pricing
- No state updates during render (prevents infinite loops)
- TypeScript strict mode compliance

### Files Changed
- `src/lib/booking/mindbody.ts` - ITBM removal, online filter
- `src/lib/booking/store.ts` - calculatePricing extraction
- `src/components/booking/CartSidebar.tsx` - Overlay sidebar
- `src/components/booking/BookingWidget.tsx` - Integration fixes
- `package.json` - Stable dependencies

---

## Version 1.0.22 - Bug Fix Release

### Changes
- Fixed TypeScript compilation error in ConfirmStep.tsx
- Updated useMemo to return all required CartPricing fields
- Full CartPricing type compliance

---

## Version 1.0.21 - Infinite Loop Fix

### Changes
- Fixed critical infinite render loop bug
- Replaced store calculatePricing() calls with local useMemo hooks
- Modified store to not call set() during render

### Bug Details
- Issue: Booking page became unresponsive with 5000+ console errors
- Cause: calculatePricing() in store calling set() during component renders
- Solution: Pure computation with React useMemo, no state updates during render

---

## Version 1.0.x - Initial Development

### Features Implemented
- Multi-step booking flow (login → location → services → addons → staff → datetime → confirm)
- Location selection (Costa del Este & San Francisco)
- Service categories with accordion UI
- Addon services (ADICIONALES category)
- Staff selection (pending full implementation)
- Date/time selection (pending full implementation)
- Internationalization (Spanish/English)
- Responsive design (mobile-first)
- WhatsApp contact button
- Promotions display

---

## Deployment Information

### Stack
- **Framework:** Next.js 15.1.3
- **Styling:** Tailwind CSS 3.4.17
- **State:** Zustand 5.0.2
- **i18n:** next-intl 3.25.0
- **Animations:** Framer Motion 11.15.0
- **Database:** Supabase
- **Hosting:** Vercel
- **API:** Mindbody Public API v6.0

### Environment Variables Required
```
MINDBODY_API_KEY=your_api_key
MINDBODY_SITE_ID=-41931
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Deployment Commands
```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Type check
npm run type-check

# Deploy to Vercel
vercel --prod
```

---

## Known Issues & Pending Items

### Pending Implementation
- Staff selection step (UI exists, API integration pending)
- DateTime availability step (UI exists, API integration pending)
- Booking confirmation step (final API call pending)
- Supabase promotions integration
- Image uploads (currently placeholders)
- Mindbody staff token management

### Known Limitations
- Staff token authentication not implemented (using public endpoints)
- Booking API call not wired (needs testing environment)
- Some placeholder images in use

---

## Contact

**Project:** Mimosa Spa Retreat Website
**Client:** Mimosa Spa Retreat, Panama
**Locations:** 
- Costa del Este: Star Plaza, frente al Riba Smith
- San Francisco: Calle 74E, al lado de la Delta de Calle 50
