/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'standard': "url('./images/bg-standard.webp')",
      },
    },
  },
  plugins: [],
}

