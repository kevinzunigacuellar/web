import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import astroLayouts from "astro-layouts";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    image(),
    mdx({
      remarkPlugins: [
        [
          astroLayouts,
          {
            blog: "/src/layouts/BlogLayout.astro",
          },
        ],
      ],
      extendPlugins: "astroDefaults",
    }),
  ],
  site: "https://www.kevinzunigacuellar.com",
  markdown: {
    shikiConfig: {
      wrap: true,
      theme: "slack-dark",
    },
  },
});
