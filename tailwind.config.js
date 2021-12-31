module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grayfirst': '#212328',
        'graysecond': "#27292E",
        'graythird': "#515254",
        'ambercustom': "#A85F16",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide")
  ],
}
