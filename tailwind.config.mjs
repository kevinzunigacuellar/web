import defaultTheme from "tailwindcss/defaultTheme";
import typographyPlugin from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "Inter", ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            ":not(pre) > code": {
              backgroundColor: "#e8ebf1",
              padding: "0.15rem 0.375rem",
              borderRadius: "0.3rem",
              fontWeight: "400",
            },
          },
        },
        invert: {
          css: {
            ":not(pre) > code": {
              backgroundColor: "#353a45",
            },
          },
        },
      },
    },
  },
  plugins: [typographyPlugin],
};
