import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import { defineConfig, fontProviders } from "astro/config";
import { readFileSync } from "node:fs";
import colors from "tailwindcss/colors";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
  themes: ["houston", "catppuccin-latte"],
  styleOverrides: {
    frames: {
      editorActiveTabBackground: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[800] : colors.white,
      editorTabBarBackground: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[900] : colors.zinc[100],
      frameBoxShadowCssValue: "none",
      editorTabBarBorderBottomColor: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[700] : colors.zinc[300],
      terminalBackground: ({ theme }) => (theme.type === "dark" ? colors.zinc[800] : colors.white),
      terminalTitlebarBackground: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[900] : colors.zinc[100],
      terminalTitlebarBorderBottomColor: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[700] : colors.zinc[300],
    },
    borderWidth: "1px",
    codeBackground: ({ theme }) => (theme.type === "dark" ? colors.zinc[800] : colors.white),
    borderColor: ({ theme }) => (theme.type === "dark" ? colors.zinc[700] : colors.zinc[300]),
    borderRadius: "0",
    codeFontFamily: "var(--font-mono)",
  },
};

export default defineConfig({
  integrations: [sitemap(), expressiveCode(astroExpressiveCodeOptions)],
  site: "https://www.kevinzc.com",
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: ["100 800"],
      fallbacks: ["monospace"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--og-font-jetbrains-mono",
      weights: [400, 700],
      fallbacks: ["monospace"],
      styles: ["normal"],
      formats: ["woff"],
    },
  ],
});
