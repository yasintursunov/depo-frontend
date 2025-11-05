/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6F3FF5',
        accent: '#10B981'
      }
    }
  },
  plugins: []
};
