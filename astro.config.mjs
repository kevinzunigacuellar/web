import {
  defineConfig,
  sharpImageService,
  defineConfig,
  envField,
} from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
  themes: ["houston", "catppuccin-latte"],
  styleOverrides: {
    codeFontSize: "0.9rem",
  },
};

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    expressiveCode(astroExpressiveCodeOptions),
    icon(),
  ],
  site: "https://www.kevinzunigacuellar.com",
  vite: {
    plugins: [rawFonts([".ttf", ".woff"])],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  env: {
    schema: {
      GH_TOKEN: envField.string({ context: "server", access: "secret" }),
    },
  },
});

// vite plugin to import fonts
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
