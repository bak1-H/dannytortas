/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9282c4',
        'background-light': '#f7f6f7',
        'background-dark': '#17151d',
        'pastel-blue': '#DCF0F7',
        'soft-beige': '#E6C7AB'
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.12)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
