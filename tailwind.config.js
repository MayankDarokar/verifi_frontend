/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        verifi: {
          bg: '#080c14',
          surface: '#0f172a',
          surfaceElevated: '#162238',
          surfaceBorder: 'rgba(255, 255, 255, 0.08)',
          accent: '#6366f1',
          accentGlow: 'rgba(99, 102, 241, 0.25)',
          cyan: '#38bdf8',
          textMuted: '#94a3b8',
          textSubtle: '#64748b',
          riskCritical: '#ef4444',
          riskHigh: '#f97316',
          riskSuspicious: '#f59e0b',
          riskClean: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'spatial-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'spatial-md': '0 12px 24px -6px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'spatial-lg': '0 24px 48px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        'spatial-glow': '0 0 40px -10px rgba(99, 102, 241, 0.2)',
        'spatial-critical': '0 0 40px -10px rgba(239, 68, 68, 0.25)',
        'spatial-clean': '0 0 40px -10px rgba(16, 185, 129, 0.2)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))',
        'grid-pattern': "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
