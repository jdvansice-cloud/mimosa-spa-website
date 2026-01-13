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
        // Mimosa Brand Colors
        gold: {
          DEFAULT: '#FCCF08',
          50: '#FEF9E7',
          100: '#FEF3CF',
          200: '#FDE79F',
          300: '#FCDB6F',
          400: '#FCCF08',
          500: '#E5BB07',
          600: '#CCA606',
          700: '#997D05',
          800: '#665303',
          900: '#332A02',
        },
        beige: {
          DEFAULT: '#F5F1EB',
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F1EB',
          300: '#EBE4D9',
          400: '#DED3C3',
          500: '#C9BAA5',
          600: '#B3A087',
          700: '#8C7A61',
          800: '#5E5141',
          900: '#2F2921',
        },
        dark: {
          DEFAULT: '#2D2D2D',
          50: '#737373',
          100: '#666666',
          200: '#4D4D4D',
          300: '#3A3A3A',
          400: '#2D2D2D',
          500: '#262626',
          600: '#1F1F1F',
          700: '#171717',
          800: '#0F0F0F',
          900: '#080808',
        },
        'warm-gray': {
          DEFAULT: '#6B6B6B',
          50: '#E5E5E5',
          100: '#D9D9D9',
          200: '#BFBFBF',
          300: '#A6A6A6',
          400: '#8C8C8C',
          500: '#6B6B6B',
          600: '#595959',
          700: '#474747',
          800: '#353535',
          900: '#232323',
        },
        spa: {
          sage: '#9DB09F',
          lavender: '#C4B7CB',
          blush: '#E8C4C4',
          cream: '#F5E6D3',
          stone: '#C9C0B6',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #FCCF08 0%, #E5BB07 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F5F1EB 0%, #EBE4D9 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2D2D2D 0%, #1F1F1F 100%)',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'strong': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'gold': '0 4px 20px rgba(252, 207, 8, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
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
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
