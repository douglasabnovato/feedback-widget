module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors:{
        brand:{
          500: "#8257e6",
        }
      }
    },
  },
  plugins: [ 
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}
