/** @type {import('tailwindcss').Config} */
export default {
  // Scan Vue and TS entry files so utility classes in SFC templates are preserved.
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
