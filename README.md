# Mimosa Spa Retreat Website

A modern, bilingual (Spanish/English) website for Mimosa Spa Retreat in Panama, featuring online booking integration with Mindbody, admin-managed promotions, and a photo gallery.

## 🌟 Features

- **Bilingual Support**: Full Spanish and English translations with URL-based routing (`/es`, `/en`)
- **Booking Integration**: Embedded Mindbody booking widget
- **Dynamic Menu**: Treatment menu populated from Mindbody API
- **Promotions Management**: Admin dashboard for managing monthly promotions
- **Photo Gallery**: Manageable gallery with category filtering
- **Mobile-First Design**: Responsive design with PWA capabilities
- **WhatsApp Integration**: Floating contact button

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel
- **Booking API**: Railway (Mindbody proxy)

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Internationalized pages
│   │   ├── page.tsx        # Landing page
│   │   ├── menu/           # Treatment menu
│   │   ├── promociones/    # Promotions
│   │   ├── nosotros/       # About us
│   │   ├── galeria/        # Gallery
│   │   └── reservar/       # Booking page
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Header, Footer, Navigation
│   └── ...                 # Feature-specific components
├── lib/                    # Utilities and configurations
├── messages/               # i18n translation files
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mimosa-spa-website.git
   cd mimosa-spa-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and other configuration.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migrations from `supabase/migrations/`
   - Create storage buckets: `promotions`, `gallery`, `assets`

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Set these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAILWAY_API_URL`
- `NEXT_PUBLIC_BOOKING_WIDGET_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`

## 📝 Admin Dashboard

Access the admin dashboard at `/admin` to:

- Manage promotions (create, edit, delete)
- Upload and organize gallery images
- Update site settings

### Admin Access

Admin authentication is handled through Supabase Auth. To create an admin user:

1. Go to Supabase Dashboard → Authentication
2. Create a new user with email/password
3. Add user metadata: `{ "role": "admin" }`

## 🎨 Customization

### Colors

Brand colors are defined in `tailwind.config.ts`:

- **Gold**: `#FCCF08` - Primary accent
- **Cream**: `#FDFAF5` - Background
- **Beige**: `#F5EFE7` - Cards
- **Dark**: `#333333` - Text

### Fonts

- **Display**: Cormorant Garamond (headings)
- **Body**: Lato (body text)

## 📄 License

Private project for Mimosa Spa Retreat, Panama.

## 🆘 Support

For technical support, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
