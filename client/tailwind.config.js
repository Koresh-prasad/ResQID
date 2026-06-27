/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f62fe',
        primaryDark: '#063b96',
        emergency: '#dc2626',
        ink: '#0f172a'
      },
      boxShadow: {
        soft: '0 18px 55px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
