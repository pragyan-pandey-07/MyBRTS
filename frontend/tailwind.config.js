/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0e7490', // cyan-700
        secondary: '#0f172a', // slate-900
      }
    },
  },
  plugins: [],
}
