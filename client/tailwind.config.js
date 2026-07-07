/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF4FF',
          100: '#DCE7FF',
          400: '#5B8DFF',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#0F172A',
          50: '#F8FAFC',
          100: '#F1F5F9',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#16213E',
          900: '#0F172A',
        },
        accent: {
          DEFAULT: '#06B6D4',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        success: {
          DEFAULT: '#22C55E',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: '#F59E0B',
        danger: '#EF4444',
        // --- Cinematic palette (new) ---
        // Brief's "Primary" (#0F172A) is identical to secondary.900 above, so it's reused as-is.
        // Brief's "Highlight" (#06B6D4) is identical to the existing accent token above.
        violet: {
          DEFAULT: '#7C3AED',
          50: '#F3EEFD',
          400: '#9F75F0',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
        },
        surface: {
          DEFAULT: '#111827',
          700: '#1F2937',
          800: '#172033',
          900: '#111827',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.12)',
        glow: '0 0 24px 0 rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 32px 0 rgba(124, 58, 237, 0.45)',
        'glow-cyan': '0 0 28px 0 rgba(6, 182, 212, 0.4)',
        cinematic: '0 24px 60px -12px rgba(0, 0, 0, 0.55)',
      },
      backdropBlur: {
        glass: '16px',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.08)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite linear',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
