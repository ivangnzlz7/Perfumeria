/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    ],
  theme: {
    extend: {
      colors: {
        'regal-gray': 'rgb(52, 52, 53)',
      }
    },
  },
  variants: {
    extend: {
      // Asegúrate de que focus-visible esté habilitado
      outline: ['focus-visible'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      backgroundColor: ['focus-visible'],
      textColor: ['focus-visible'],
    },
  },
  plugins: [],
}

