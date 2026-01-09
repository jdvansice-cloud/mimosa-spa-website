# Mimosa Spa Website - Version History

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
