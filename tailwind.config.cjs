/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette (derived from logo)
        primary: '#9282C4',
        'primary-dark': '#6E5DA6',
        turquoise: '#45BCD2',
        caramel: '#C2823F',
        sky: '#DCF0F7',
        cream: '#F7F4FB',
        ink: '#2C2738',
        muted: '#6B6480',
        'soft-beige': '#EFD9C2',
        'background-light': '#F7F4FB',
        'background-dark': '#191522'
      },
      fontFamily: {
        display: ['"Libre Caslon Text"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
        full: '9999px'
      },
      maxWidth: {
        container: '1200px'
      },
      spacing: {
        section: '80px'
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(110, 93, 166, 0.18)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
