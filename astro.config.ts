import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import codeTitle from "remark-code-title";
import { readFileSync } from "node:fs";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), mdx()],
  experimental: {
    assets: true,
  },
  site: "https://www.kevinzunigacuellar.com",
  markdown: {
    remarkPlugins: [codeTitle],
    shikiConfig: {
      theme: "dark-plus",
    },
  },
  vite: {
    plugins: [rawFonts([".ttf", ".woff"])],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});

// vite plugin to import fonts
function rawFonts(ext: string[]) {
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
