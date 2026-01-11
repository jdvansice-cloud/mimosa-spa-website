# Mimosa Spa Website - Version History

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

### Breaking Changes
- Updated next-intl configuration to v4 API (routing.ts, request.ts, middleware.ts)

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
