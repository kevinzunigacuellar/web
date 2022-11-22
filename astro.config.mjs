import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import rehypePrettyCode from "rehype-pretty-code";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import astroLayouts from "astro-layouts";

const layoutOptions = {
  "pages/blog/**/*": "@layouts/BlogLayout.astro",
};

const prettyCodeOptions = {
  theme: "one-dark-pro",
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    image(),
    mdx({
      remarkPlugins: [[astroLayouts, layoutOptions]],
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      extendPlugins: "astroDefaults",
    }),
  ],
  site: "https://www.kevinzunigacuellar.com",
  markdown: {
    syntaxHighlight: false,
  },
});
