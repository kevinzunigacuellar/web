module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  theme: {
    extend: {
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
