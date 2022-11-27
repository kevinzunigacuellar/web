import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import astroLayouts from "astro-layouts";
import codeTitle from "remark-code-title";

const layoutOptions = {
  "pages/blog/**/*": "@layouts/BlogLayout.astro",
};

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), image(), mdx()],
  site: "https://www.kevinzunigacuellar.com",
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [[astroLayouts, layoutOptions], codeTitle],
    shikiConfig: {
      theme: "dark-plus",
    },
  },
});
