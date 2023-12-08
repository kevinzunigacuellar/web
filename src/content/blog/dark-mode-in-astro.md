---
title: Add dark mode to Astro with Tailwind CSS
description: In this guide, you will learn how to add perfect dark mode to your Astro project using Tailwind CSS and the prefers-color-scheme media query
pubDate: 2022-05-04
updatedDate: 2023-06-04
hero: "~/assets/heros/astro_dark.png"
heroAlt: "The logo of Astro and Tailwind CSS"
---

Adding a dark mode to your website is a great way to improve accessibility. In this guide, we will learn how to implement a perfect dark mode in your Astro project using Tailwind CSS. You can use any framework you prefer, but we will be using Preact for the UI creation.

## Getting Started

To begin, create a new Astro project:

```sh
npm create astro@latest
```

Next, install the TailwindCSS and Preact integrations:

```sh
npm install -D @astrojs/tailwind @astrojs/preact
npm install preact
```

Add both integrations to your `astro.config.mjs` file:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact(), tailwind()],
});
```

Create a minimal TailwindCSS config file in the root of your project. Make sure to modify the `content` property to include all the files that contain your styles. Also, set the `darkMode` property to `"class"` to enable dark mode:

```js title="tailwind.config.cjs"
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",
  theme: {},
  plugins: [],
};
```

## Hands-on Time

Astro provides a feature to add inline scripts directly to your Astro files, which run as soon as the HTML is loaded. This prevents the "flash of inaccurate color theme" issue that commonly occurs when implementing dark mode with hydration. You can find more information about inline scripts in the [Astro documentation](https://docs.astro.build/en/reference/directives-reference/#isinline).

The following code retrieves the user's preferred theme and applies it to the HTML element. You can copy/paste or modify this code snippet in your Astro project. We will explain each line of code in the next paragraph.

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

The `theme` variable is an immediately invoked function expression (IIFE) that returns the current theme based on the user's preference. The first `if` statement checks if the user has a previously saved theme in localStorage. If so, it returns that theme. The second `if` statement checks if the user prefers dark mode based on their system settings. If so, it returns `"dark"`. If none of the conditions are met, it returns `"light"`. Once the theme is defined, we use it to add or remove the `"dark"` class from the HTML element and save the theme to localStorage.

## Creating the UI

In Astro, you can use any UI framework of your choice. For this example, we will use **Preact** due to its small size and performance. The following code snippet renders a button that toggles between dark and light mode:

```tsx title="ThemeToggle.tsx"
import { useEffect, useState } from "preact/hooks";
import type { FunctionalComponent } from "preact";

export default function ThemeToggle(): FunctionalComponent {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button onClick={handleClick}>{theme === "light" ? "🌙" : "🌞"}</button>
  );
}
```

## Rendering Components on the Server

Regardless of the UI framework you use, if you are using Static Site Generation (SSG), Astro will render your UI components on the server at build time and hydrate them on the client side. This feature improves website performance, accessibility, and SEO.

However, this feature also has some trade-offs. Since components are rendered on the server, web APIs like `localStorage` or `window` are not available.

### Fallback Initial State

To overcome this limitation, you can add a fallback initial state that will be used during build time and then updated to the correct state after hydration. For example:

```jsx
const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
```

In the above code, we attempt to get the theme from `localStorage`, and if it's not available, we use `"light"` as the initial state. Using a fallback initial state is a common approach to solve this problem. However, it can lead to a "client/server state mismatch" issue, where the initial state differs from the state after hydration.

### Addressing the Client/Server Mismatch

One way to address the client/server mismatch is by adding a `mounted` state. This state ensures that your component's rendering waits until it is mounted to the DOM, making all the web APIs available and ensuring that the initial state matches the state after hydration. You can achieve this using the `useState` and `useEffect` hooks to create a mounted state. Here's an example:

```jsx title="ThemeToggle.tsx"
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return <FallbackUI />; // or null;
}

return <button>{theme === "light" ? "🌙" : "🌞"}</button>;
```

By checking the `isMounted` state, we can render a fallback UI or `null` until the component is mounted. Once it's mounted, the actual UI will be rendered.
