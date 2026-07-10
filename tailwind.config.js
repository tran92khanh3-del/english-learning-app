/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        kid: ['"Baloo 2"', '"Comic Sans MS"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '0 4px 0 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
