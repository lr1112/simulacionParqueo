/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/flowbite/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
