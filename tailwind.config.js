/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        panel: "#080c1a",
        primary: "#1d4ed8",
        secondary: "#3b82f6",
        danger: "#ef4444"
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(29, 78, 216, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(29, 78, 216, 0.12) 1px, transparent 1px)"
      }
    },
  },
  plugins: [],
}
