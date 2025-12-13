
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // DESIGN LABORATORY PALETTE (Void Black)
        void: '#050505',       // Pure Black
        onyx: '#0A0A0C',       // Card Background
        'onyx-light': '#141419',
        gold: '#D4AF37',       // Primary Accent
        'gold-dim': '#8A7018',
        platinum: '#E1E1E3',   // Text Main
        'platinum-dim': '#8E8E93',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
