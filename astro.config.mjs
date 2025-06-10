import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import tailwindcss from "@tailwindcss/vite";
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
      terminalBackground: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[800] : colors.white,
      terminalTitlebarBackground: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[900] : colors.zinc[100],
      terminalTitlebarBorderBottomColor: ({ theme }) =>
        theme.type === "dark" ? colors.zinc[700] : colors.zinc[300],
    },
    borderWidth: "1px",
    codeBackground: ({ theme }) =>
      theme.type === "dark" ? colors.zinc[800] : colors.white,
    borderColor: ({ theme }) =>
      theme.type === "dark" ? colors.zinc[700] : colors.zinc[300],
    borderRadius: "0",
    codeFontFamily: "var(--font-mono)",
  },
};

export default defineConfig({
  integrations: [sitemap(), expressiveCode(astroExpressiveCodeOptions), icon()],
  site: "https://www.kevinzc.com",
  vite: {
    plugins: [rawFonts([".ttf", ".woff"]), tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  experimental: {
    svg: true,
  },
});

// vite plugin to import fonts for og image generation
function rawFonts(ext) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
