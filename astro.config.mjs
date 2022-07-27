import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), image(), prefetch(), mdx()],
  site: "https://kevinzunigacuellar.com",
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
});
