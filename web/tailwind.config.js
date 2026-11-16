module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors:{
        brand:{
          300: "#996DFF",
          /* Hover do botão de envio: texto claro com contraste 6:1 (o 300 dava 3,5:1, achado do axe em 16/11/2026) */
          600: "#6f47d1",
          500: "#8257e6",
        }
      },
      borderRadius:{
        md: "4px",
      }
    },
  },
  plugins: [ 
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
