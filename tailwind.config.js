/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serialb: ['Serial B Bold', 'sans-serif'],
        serialt: ['Serial B Thin', 'sans-serif'],
      },
      colors: {
        'sketchbook-pink': '#FFE4E6',
      }
    },
  },
  plugins: [],
}