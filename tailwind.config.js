/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif Pro"', '"Charter"', '"Georgia"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Light theme palette — paper-warm whites and quiet grays.
        ink: {
          950: '#fbfaf7', // page background
          900: '#f4f2ec', // softer surface
          850: '#ecebe5',
          800: '#dedcd3', // borders / strong surface
          700: '#c4c2b8',
          600: '#9c9a91',
          500: '#71706a', // muted label
          400: '#52524d',
          300: '#3a3a36',
          200: '#28282a', // body text
          100: '#16161a', // headings
        },
        // Pastel accents — softer, less saturated.
        accent: {
          definice: '#bcd9c4', // sage
          veta: '#bcd6e0', // dusty blue
          priklad: '#ecd9a8', // warm sand
          poznamka: '#d7c8e0', // mauve
          lemma: '#ecc9b3', // peach
          dusledek: '#e6c1c8', // rose
          dukaz: '#cfd1d3', // pale steel
        },
      },
    },
  },
  plugins: [],
}
