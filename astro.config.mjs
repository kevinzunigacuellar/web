import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import setFallbackLayout from "./remark/defaultLayout";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    mdx({
      remarkPlugins: [setFallbackLayout],
      extendPlugins: "astroDefaults",
    }),
  ],
  site: "https://www.kevinzunigacuellar.com",
  markdown: {
    shikiConfig: {
      wrap: true,
      theme: "slack-dark",
      // vitesse-dark
    },
  },
});
