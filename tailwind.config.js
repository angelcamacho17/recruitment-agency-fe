/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ce2830',
          600: '#b91c24',
          700: '#991b1f',
          800: '#7f1d1d',
          900: '#6b1a1a',
        },
        accent: {
          50: '#fef2f4',
          100: '#fce7ec',
          200: '#f9d0db',
          300: '#f5b8c7',
          400: '#dc98a1',
          500: '#c47882',
          600: '#a65c66',
          700: '#8a4951',
          800: '#6d3a40',
          900: '#582f34',
        },
      },
    },
  },
  plugins: [],
}
