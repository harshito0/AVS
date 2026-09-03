/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F7F4',
          100: '#E1EDE6',
          200: '#C4DCD0',
          300: '#9BC3B1',
          400: '#6FA48F',
          500: '#4E8873',
          600: '#3A6E5C',
          700: '#2F574A',
          800: '#1B6F56',
          850: '#165B46',
          900: '#0F5B47',
          950: '#0B291F',
        },
        gold: {
          50: '#FAF8F2',
          100: '#F4EEDF',
          200: '#E9DCBE',
          300: '#DCC595',
          400: '#D0AE6B',
          500: '#C9A227',
          600: '#B08B1C',
          700: '#8A6B17',
          800: '#695115',
          900: '#4C3B12',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}