/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#e2e8f0',
          hover: '#cbd5e1',
          foreground: '#1e293b'
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          foreground: '#ffffff'
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b'
        },
        border: '#e2e8f0'
      }
    },
  },
  plugins: [],
}
