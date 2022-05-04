---
layout: '../../layouts/BlogLayout.astro'
title: Implement dark mode with tailwindcss in Astro
heroImage: /public/assets/darkmode.jpeg
setup: import Image from '../../components/Image.astro'
publishDate: 2021-04-25
description: Perfect dark mode implementation to your Astro 🚀 website with tailwindcss
---

Some of the most popular websites use dark mode. It's a great way to make your
website more accessible. In this post, I will explain how you can implement a
perfect dark mode with TailwindCSS in your next Astro project.

In this example we will use preact to create the button toggler UI but feel free
to use any other framework of your preference.

## 🧑‍💻 Set up your project

Start a new Astro project and install your dependecies:

```bash
npm create astro@latest
```

Add the astro integration for TailwindCSS and preact:

```bash
npm install -D @astrojs/tailwind @astrojs/preact
# and
npm install preact
```

Add the preact and tailwindcss integration to your `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact(), tailwind()],
});
```

Create a `tailwind.config.cjs` file in your project root and update your content
paths and set `darkMode` to `class`.

```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",
  theme: {},
  plugins: [],
};
```

Finally, start your dev server

```bash
npm run dev
```

## 🚀 Hands-on time!

Astro has a nice option to add inline scripts to your html. This script will run
as soon as the html is loaded. This is perfect to prevent the dark flash which
is a very common problem when implementing dark mode with hydration. You can
read more about inline scripts in the
[Astro documentation](https://docs.astro.build/en/reference/directives-reference/#isinline).

```html
<script is:inline>
  const theme = localStorage.getItem('theme')
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    window.localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    window.localStorage.setItem('theme', 'light')
  }
</script>
```

The above script will add the class `dark` to the html element and set the local
storage theme to `dark` if:

1. the user prefers dark mode and doesn't have a local storage theme defined, or
2. the user have a local storage theme set to `dark`.

If none of the above conditions are met, then the script will remove the class
`dark` from the html element and set the local storage theme to `light`.

## ⚛️ Making the UI

In this example we will use preact to create a button to toggle between dark and
light mode with preact.

```tsx
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

  return <button onClick={handleClick}>{theme === "light" ? "🌙" : "🌞"}</button>;
}
```

The above code will render a button with the text 🌙 if the theme is `dark` and 🌞
if the theme is `light`. When the user clicks the button, the theme state will
update and store the current theme in the local storage.

## 🚫 Static Site Generation Problems

When using static site generation the initial state will be undefined at compile
time because `localStorage` is not available. There is a few things we can do to
solve this problem:

1. Add a fallback initial state, or
2. Add a mounted state that will wait until the component is mounted.

### Fallback initial state

Adding a fallback initial state is the most common way to solve problem.
However, it creates a new problem called the UI flick. Essentially, the UI will
flick every time the server render doesn't match your client render. You may
have seen it before with login buttons, when the user is authenticated but when
the page loads it renders the login button but it rapidly switches to the user
name.

To implement the fallback initial state, we can use the nullish coalescing
operator `??` to set the initial state.

```tsx
const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
```

### Mounted state

Another way to solve the SSG problem is to add a mounted state. This state will
make your button render wait until the component is mounted. This way the local
storage theme will be available in the first render.

To implement method we use `useState` and `useEffect` hooks to create a mounted
state. This render a fallback UI until the component is mounted.

```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return <FallbackUI />; // or null;
}

return <button>{theme === "light" ? "🌙" : "🌞"}</button>;
```
