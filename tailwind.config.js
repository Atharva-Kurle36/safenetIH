/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0a0c10",
        panel: "#161b22",
        primary: "#00f0ff",
        secondary: "#0ff0bc",
        danger: "#ff3366"
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)"
      }
    },
  },
  plugins: [],
}
