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
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8fd28f',
          400: '#5db75d',
          500: '#3d9c3d',
          600: '#2e7c2e',
          700: '#256225',
          800: '#204e20',
          900: '#1c411c',
        }
      }
    },
  },
  plugins: [],
}