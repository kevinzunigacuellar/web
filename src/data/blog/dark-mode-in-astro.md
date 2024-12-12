---
title: Add dark mode to Astro with Tailwind CSS
description: Learn how to implement dark mode to your Astro website using Tailwind CSS, TypeScript and Web Components.
pubDate: 2022-05-04
updatedDate: 2024-12-11
hero: "astro_dark.png"
heroAlt: "The logo of Astro and Tailwind CSS"
---

Adding a dark mode to your website is a great way to improve accessibility. In this guide, you will learn how to implement dark mode in Astro using Tailwind CSS. You will also learn how to create a theme toggle button using TypeScript and Web Components.

## Getting Started

To begin, create a new Astro project:

```sh
npm create astro@latest
```

Next, install the Tailwind CSS integration:

```sh
npm install -D @astrojs/tailwind
```

Add the integration to your `astro.config.mjs` file:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
});
```

Create a minimal TailwindCSS config file in the root of your project. Make sure to modify the `content` property to include all the files that contain your styles. Also, set the `darkMode` property to `"class"` since we will be using the `dark` class to apply dark mode styles.

```js title="tailwind.config.cjs" {3}
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",
  theme: {},
  plugins: [],
};
```

## Detecting the User's theme

Astro provides a feature to add inline scripts directly to your Astro files, which run as soon as the HTML is loaded. This prevents the "flash of inaccurate color theme" issue that commonly occurs when implementing dark mode. You can find more information about inline scripts in the [Astro documentation](https://docs.astro.build/en/reference/directives-reference/#isinline).

The following code retrieves the user's preferred theme and applies it to the HTML element. You can copy/paste or modify this code snippet in your Astro project.

```astro title="Layout.astro"
<script is:inline>
  const theme = (() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  })();

  if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
  window.localStorage.setItem("theme", theme);
</script>
```

## Creating a Theme Toggle Button

Astro is flexible and works with many UI frameworks. However, for this guide, you will use TypeScript to create a theme toggle button. You can use any framework you prefer, such as React, Preact, or Svelte.

The following code snippet creates a custom element called `theme-toggle` that toggles between light and dark themes when clicked.

```astro title="src/components/ThemeToggle.astro"
<theme-toggle>
  <button></button>
</theme-toggle>
<script>
  class ThemeToggle extends HTMLElement {
    private readonly STORAGE_KEY = "theme-preference";
    private _darkTheme = false;
    private button: HTMLButtonElement | null;

    constructor() {
      super();
      this.button = this.querySelector("button");

      if (!this.button) {
        console.error("Theme toggle button not found");
        return;
      }

      // Load theme preference
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      if (!savedTheme) {
        this.darkTheme = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
      } else {
        this.darkTheme = savedTheme === "dark";
      }

      // Setup event listeners
      this.button.addEventListener("click", () => {
        this.darkTheme = !this.darkTheme;
        localStorage.setItem(
          this.STORAGE_KEY,
          this.darkTheme ? "dark" : "light",
        );
      });

      // Listen for system theme changes
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.darkTheme = e.matches;
          }
        });
    }

    get darkTheme(): boolean {
      return this._darkTheme;
    }

    set darkTheme(value: boolean) {
      this._darkTheme = value;
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      const iconSun = "☀️";
      const iconMoon = "🌙";

      if (!this.button) {
        return;
      }

      this.button.innerHTML = value ? iconSun : iconMoon;
      this.button.setAttribute(
        "aria-label",
        value ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }
  customElements.define("theme-toggle", ThemeToggle);
</script>
```

You can now use the `ThemeToggle` component in your Astro project by importing it.

```astro title="Layout.astro" {2,7}
---
import ThemeToggle from "../components/ThemeToggle.astro";
import Layout from "./layouts/Layout.astro";
---

<Layout>
  <ThemeToggle />
</Layout>
```

That's it! You have successfully added dark mode to your Astro website using Tailwind CSS. Feel free to customize the dark mode styles and theme toggle button to match your website's design.
