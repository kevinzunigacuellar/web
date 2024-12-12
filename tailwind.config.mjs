import defaultTheme from "tailwindcss/defaultTheme";
import typographyPlugin from "@tailwindcss/typography";
import colors from "tailwindcss/colors";

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
              backgroundColor: colors.zinc[200],
              padding: "0.15rem 0.375rem",
              fontWeight: defaultTheme.fontWeight.normal,
            },
          },
        },
        invert: {
          css: {
            ":not(pre) > code": {
              backgroundColor: colors.zinc[700],
            },
          },
        },
      },
    },
  },
  plugins: [typographyPlugin],
};
