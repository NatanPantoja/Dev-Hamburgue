/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        'prime-brown': '#3D2C24', 
        'prime-gold': '#D4AF37',
        'prime-cinza': '#B0B0B0'   
      },

      backgroundImage:{
        "home": "url('../src/img/fundo.png')"
      }
    },
  },
  plugins: [],
}

