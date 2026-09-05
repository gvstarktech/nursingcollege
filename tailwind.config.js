/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fa',
          100: '#cce2f5',
          200: '#99c4eb',
          300: '#66a7e0',
          400: '#3389d6',
          500: '#006ccc',
          600: '#0057a3',
          700: '#004B87',
          800: '#003763',
          900: '#002440',
          950: '#001324',
        },
        green: {
          50: '#e6f7ef',
          100: '#ccf0df',
          200: '#99e1bf',
          300: '#66d29f',
          400: '#33c37f',
          500: '#00A651',
          600: '#009448',
          700: '#00783a',
          800: '#005c2d',
          900: '#00401f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

