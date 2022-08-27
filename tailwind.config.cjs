/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            p: {
              code:{
                backgroundColor: '#282c34',
                padding: '0.250rem',
                borderRadius: '0.250rem',
                fontWeight: '400',
              }
            },
            li: {
              code:{
                backgroundColor: '#282c34',
                padding: '0.250rem',
                borderRadius: '0.250rem',
                fontWeight: '400',
              }
            }
          }
        }
      },
      keyframes: {
        "move-bg": {
          to: {
            backgroundPosition: "400% 0",
          },
        },
      },
      animation: {
        "move-bg": "move-bg 8s infinite linear",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
