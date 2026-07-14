import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stray lockfiles in $HOME make Turbopack infer the wrong workspace root
  // in dev (API routes 404). Pin it to this repo.
  turbopack: {
    root: import.meta.dirname,
  },
  // Branded short links for social bios (UTM-tagged for the Marketing page)
  async redirects() {
    return [
      { source: '/ig', destination: '/?utm_source=instagram&utm_medium=bio', permanent: false },
      { source: '/fb', destination: '/?utm_source=facebook&utm_medium=bio', permanent: false },
      { source: '/wa', destination: '/?utm_source=whatsapp&utm_medium=chat', permanent: false },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'aoqbaxfynmlcxwrnaeyo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
