/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
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
        display: ['Be Vietnam Pro', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
