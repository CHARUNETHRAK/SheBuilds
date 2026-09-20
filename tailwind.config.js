/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shield: {
          dark: '#0b132b',
          slate: '#1c2541',
          blue: '#3a506b',
          teal: '#06b6d4',
          accent: '#10b981',
          safe: '#059669',
          alert: '#f59e0b',
          danger: '#e11d48',
          card: '#1e293b',
          cardHover: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
