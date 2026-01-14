import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FCCF08',
          50: '#FFF9E0',
          100: '#FFF3B0',
          200: '#FFEB7A',
          300: '#FFE244',
          400: '#FFD91A',
          500: '#FCCF08',
          600: '#D4AD00',
          700: '#A68700',
          800: '#786200',
          900: '#4A3C00',
        },
        cream: {
          DEFAULT: '#FDFAF5',
          50: '#FFFFFF',
          100: '#FDFAF5',
          200: '#F8F2E8',
          300: '#F3EADB',
          400: '#EEE2CE',
        },
        beige: {
          DEFAULT: '#F5EFE7',
          100: '#FAF7F2',
          200: '#F5EFE7',
          300: '#E8DFD1',
          400: '#DBCFBB',
          500: '#CEBFA5',
        },
        'warm-gray': {
          DEFAULT: '#8B8680',
          100: '#D4D2CF',
          200: '#B8B5B1',
          300: '#9C9893',
          400: '#8B8680',
          500: '#6F6B66',
          600: '#54514D',
        },
        dark: {
          DEFAULT: '#333333',
          100: '#666666',
          200: '#4D4D4D',
          300: '#333333',
          400: '#1A1A1A',
          500: '#000000',
        },
        spa: {
          green: '#7A9E7E',
          brown: '#8B7355',
          rose: '#D4A5A5',
          sage: '#B4C4AE',
        }
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-lato)', 'Lato', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-spa': 'linear-gradient(135deg, #FDFAF5 0%, #F5EFE7 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FCCF08 0%, #D4AD00 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
