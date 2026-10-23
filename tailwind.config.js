/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EAF7EF',
          100: '#C8EDDA',
          200: '#A3D977',
          300: '#7DC866',
          400: '#4CAF50',
          500: '#176B45',
          600: '#0D4935',
          700: '#0A3828',
          800: '#072519',
          900: '#03120C',
        },
        surface: {
          light: '#F7F9F5',
          DEFAULT: '#FFFFFF',
          dark: '#0F1A14',
        },
        lime: '#A3D977',
        mint: '#EAF7EF',
        forest: '#176B45',
        emerald: '#0D4935',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(23,107,69,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        glow: '0 0 24px rgba(23,107,69,0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(-16px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
