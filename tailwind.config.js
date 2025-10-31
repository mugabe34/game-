/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        brand: {
          blue: '#2b6cb0',
          light: '#e6f0ff'
        }
      }
    },
  },
  plugins: [],
}


