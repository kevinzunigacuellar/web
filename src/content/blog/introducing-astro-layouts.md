---
title: Introducing astro-layouts, my first npm package
description: I wrote and published my first npm package "astro-layouts". Here some details about how I got the idea and how it works
pubDate: 2022-11-20
updatedDate: 2023-06-04
hero: "~/assets/heros/astro_npm.png"
heroAlt: "The logo of Astro and npm"
---

I'm excited to announce my first npm package, `astro-layouts`. This package injects a layout property into MD and MDX files' frontmatter, making it easier to use layouts in Astro without the need to define them for each page in the frontmatter.

## Idea and Motivation

I came up with the idea for this package while helping people in the Astro Discord server. I noticed that many users were struggling to define layouts, especially when dealing with numerous pages. To simplify the process, I decided to create a package that would allow them to define layouts from the Astro config file using glob patterns. With this approach, users could define a layout once and use it across multiple pages.

## How It Works

The package utilizes glob patterns to match pages with their respective layouts. It then injects the layout property into the frontmatter of each page. The package leverages `picomatch` in the background to perform the glob pattern matching.

## Installation

To install the package, run the following command:

```bash
npm install astro-layouts
```

## Usage

To use the package, add it to the Astro config file in the remark plugin section. Here's an example of an `astro.config.mjs` file:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import astroLayouts from "astro-layouts";

const layoutOptions = {
  "pages/**/*": "/src/layouts/Layout.astro",
};

export default defineConfig({
  markdown: {
    remarkPlugins: [[astroLayouts, layoutOptions]],
  },
});
```

In the `layoutOptions` object, you define the glob pattern and the layout to be used. The `key` represents the glob pattern for selecting files, while the `value` represents the absolute path to the layout component.

You can be as specific as needed with the glob patterns. Here are some examples:

- `pages/blog/**/*.md` matches all markdown files in the blog folder.
- `pages/blog/**/*.mdx` matches all MDX files in the blog folder.
- `pages/projects/*` matches all top-level files in the blog folder.
- `pages/**/* matches` all files in the pages folder.

You can target any file within the `src` folder. For instance, if your content resides in the src/markdown folder, you can use the following configuration:

```js
const layoutOptions = {
  "content/**/*": "/src/layouts/Layout.astro",
};
```

If you have aliases defined in your `tsconfig.json` file, you can use them to create shorter layout paths. Here's an example of a `tsconfig.json` file:

```json title="tsconfig.json"
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@layouts/*": ["src/layouts/*"]
    }
  }
}
```

Then you can use aliases in the `layoutOptions`

```js
const layoutOptions = {
  "pages/**/*": "@layouts/Layout.astro",
};
```

## Final thoughts

I hope you find this package useful. If you have any questions or suggestions, feel free to raise an issue on [GitHub](https://github.com/kevinzunigacuellar/astro-layouts). I would appreciate any feedback. If you like the package, please consider giving it a star.

Writing this package was a lot of fun, and it provided me with valuable insights into the workings of npm packages and their publication process. I'm excited to create more packages in the future. Thank you for reading!
