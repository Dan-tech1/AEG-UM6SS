/* ============================================================
   AEG-UM6SS — Tailwind CSS Configuration (Production)
   Direction artistique : Campus Dynamique
   ============================================================ */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./config/**/*.{html,js}",
  ],
  safelist: [
    'bg-emerald-600', 'bg-emerald-700', 'border-emerald-400/30', 'text-emerald-200/60', 'text-emerald-100/80', 'border-emerald-200/50',
    'bg-yellow-400', 'bg-yellow-300', 'border-yellow-500/40', 'text-yellow-700/60', 'border-yellow-600/50',
    'bg-blue-600', 'bg-blue-700', 'border-blue-400/30', 'text-blue-200/60', 'text-blue-100/80', 'border-blue-200/50',
    'hover:bg-emerald-700', 'hover:bg-yellow-300', 'hover:bg-blue-700',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006B3C',
          50:  '#e6f5ed',
          100: '#b3e0c9',
          200: '#80cba5',
          300: '#4db681',
          400: '#26a65e',
          500: '#006B3C',
          600: '#005a32',
          700: '#004d2b',
          800: '#003d22',
          900: '#002e19',
        },
        secondary: {
          DEFAULT: '#FCD116',
          50:  '#fffbe6',
          100: '#fff3b3',
          200: '#ffeb80',
          300: '#ffe34d',
          400: '#ffdd26',
          500: '#FCD116',
          600: '#e6bc00',
          700: '#cca600',
          800: '#b39100',
          900: '#997c00',
        },
        accent:  '#3A8E55',
        coral:   '#FF6B4A',
        teal:    '#0EA5A0',
        indigo:  '#4F46E5',
        amber:   '#F59E0B',
        success: '#10B981',
        surface: {
          DEFAULT: '#f8fafc',
          50:  '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
        },
        dark: {
          DEFAULT: '#0c1220',
          card:    '#151b2b',
          700:     '#1a2035',
          600:     '#1e293b',
          500:     '#2a3348',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'card':  '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)',
        'soft':  '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'lift':  '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
        'glow':  '0 14px 35px -8px rgba(0,107,60,0.18)',
        'gold':  '0 4px 20px rgba(252,209,22,0.35)',
        'float': '0 8px 32px rgba(0,107,60,0.35), 0 0 0 4px rgba(0,107,60,0.12)',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease both',
        'fade-in-up':   'fadeInUp 0.7s ease both',
        'fade-in-down': 'fadeInDown 0.5s ease both',
        'slide-up':     'slideUp 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'bounce-sm':    'bounceSm 0.3s ease',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.08)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,74,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(255,107,74,0)' },
        },
      },
      backgroundImage: {
        'gradient-energy': 'linear-gradient(135deg, #006B3C 0%, #0EA5A0 100%)',
        'gradient-hero':   'linear-gradient(135deg, rgba(0,107,60,0.92), rgba(0,77,43,0.95), rgba(10,30,20,0.97))',
        'gradient-cta':    'linear-gradient(135deg, #FF6B4A, #FF8A65)',
        'gradient-gold':   'linear-gradient(135deg, #FCD116, #FFE066)',
      },
    },
  },
  plugins: [],
};
