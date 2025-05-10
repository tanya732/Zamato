/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#E23744', // Main Zamato red
          600: '#C53030',
          700: '#9B2C2C',
          800: '#822727',
          900: '#63171B',
        },
        secondary: {
          50: '#EBF4FF',
          100: '#C3DAFE',
          200: '#A3BFFA',
          300: '#7F9CF5',
          400: '#667EEA',
          500: '#5A67D8',
          600: '#4C51BF',
          700: '#434190',
          800: '#3C366B',
          900: '#282F45',
        },
        accent: {
          50: '#F0F9FF',
          100: '#E1F0FE',
          200: '#BAE6FD',
          300: '#7FCAFF',
          400: '#36ADFF',
          500: '#0090FF',
          600: '#0077D6',
          700: '#0062B0',
          800: '#004C8C',
          900: '#003E72',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};