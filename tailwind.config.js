/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          500: '#2E7D32',
          600: '#1B5E20',
          700: '#0D4612'
        },
        secondary: {
          100: '#E8F5E8',
          300: '#A5D6A7',
          400: '#81C784',
          500: '#4CAF50'
        },
        accent: {
          500: '#FF6F00',
          600: '#E65100'
        },
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    },
  },
  plugins: [],
}