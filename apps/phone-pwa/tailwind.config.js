/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-lavender': '#EEF0F8',
        'deep-ink': '#2D3158',
        'muted-slate': '#8A8FA8',
        'iris-purple': '#7B7FD4',
        'soft-violet': '#B48FE0',
        'blush-pink': '#F5DAEA',
        'lavender-mid': '#C9CCEE',
        'success-green': '#3DD68C',
        'alert-red': '#E05A6A',
        'warm-yellow': '#FFD166',
        'accent-pink': '#FF7BAC',
      }
    },
  },
  plugins: [],
}
