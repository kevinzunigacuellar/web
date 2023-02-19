import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import codeTitle from "remark-code-title";
import fs from "node:fs";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), image(), mdx()],
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
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
