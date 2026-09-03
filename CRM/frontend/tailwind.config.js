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
          950: '#07160F',
          900: '#0B1F17',
          850: '#0F291E',
          800: '#143527',
          700: '#1B4332',
          600: '#265C45',
          500: '#2D6A4F',
          100: '#E8F3EE',
          50: '#F2F8F5',
        },
        gold: {
          50: '#FCFAF5',
          100: '#F8F2E4',
          200: '#EFE1C3',
          300: '#E4CC9C',
          400: '#D5B471',
          500: '#C5A880',
          600: '#B89758',
          700: '#94753B',
          800: '#735B2F',
        },
        cream: {
          50: '#FCFBF9',
          100: '#FAF7F2',
          200: '#F3EEE5',
          300: '#E8E1D3',
        },
        spa: {
          bg: '#F5F7F5',
          card: '#FFFFFF',
          border: '#E3EAE5',
          hover: '#F0F5F2',
          muted: '#667A70',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 41, 30, 0.05), 0 1px 2px -1px rgba(15, 41, 30, 0.05)',
        'card': '0 4px 12px -2px rgba(15, 41, 30, 0.05), 0 2px 6px -2px rgba(15, 41, 30, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(15, 41, 30, 0.08), 0 4px 10px -2px rgba(15, 41, 30, 0.04)',
        'drawer': '-10px 0 30px rgba(11, 31, 23, 0.15)',
        'modal': '0 20px 45px -5px rgba(11, 31, 23, 0.25)',
      }
    },
  },
  plugins: [],
}
