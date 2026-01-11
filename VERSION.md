# Mimosa Spa Website - Version History

## Version 1.0.10 (January 11, 2026)

### Changes
- **Updated:** Logo files with transparent backgrounds
- **Changed:** Header now displays full Mimosa logo image
- **Removed:** "Explorar" text from hero section, kept just the scroll arrow
- **Improved:** Scroll indicator arrow is now larger and cleaner

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
