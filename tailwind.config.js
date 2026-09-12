/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF6EF',
        sand: '#EBE0CC',
        charcoal: '#2B2620',
        plum: '#6E2438',
        plumDark: '#531B2A',
        gold: '#B08A4E',
        goldLight: '#D4B579',
      },
      fontFamily: {
        display: ['"Amiri"', 'serif'],
        body: ['"Tajawal"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
