import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    image(),
    mdx({
      remarkPlugins: [setFallbackLayout, remarkReadingTime],
      extendPlugins: 'astroDefaults',
      }
    )],
  site: "https://www.kevinzunigacuellar.com",
  markdown: {
    shikiConfig: {
      theme: "dracula-soft",
      wrap: true,
    },
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});

function setFallbackLayout() {
  // sets a default layout for all mdx files
  return function (_tree, file) {
    const layout =
      file.data.astro.frontmatter.layout ?? "@layouts/BlogLayout.astro";
    file.data.astro.frontmatter.layout = layout;
  };
}

function remarkReadingTime() {
  // adds a reading time to all mdx files
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    file.data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
