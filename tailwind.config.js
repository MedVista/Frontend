/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',

      'md': '855px',

      'lg': '1300px',
      // => @media (min-width: 1024px) { ... }
    }
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar'),
],
}