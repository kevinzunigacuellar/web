---
layout: '../../layouts/BlogLayout.astro'
title: Implementing dark mode with tailwindcss in Astro
heroImage: /public/assets/darkmode.jpeg
setup: import Image from '../../components/Image.astro'
publishDate: 2021-04-25
description: Perfect dark mode support to your Astro 🚀 website with tailwindcss
---

Some of the most popular websites use dark mode, and it's a great way to make your website more accessible. In this post, I will explain how you can implement a perfect dark mode with tailwindcss in your next Astro project.

For this example we will use preact to create the button toggle UI but feel free to use any other framework of your preference.

## 🧑‍💻 Set up your project

Start a new Astro project and install your dependecies:

```bash
npm create astro@latest
# and
npm install
```

Add the astro integration for tailwindcss and preact:

```bash
npm install -D @astrojs/tailwind @astrojs/preact
# and
npm install preact
```

Add the preact and tailwindcss integration to your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'

export default defineConfig({
  integrations: [preact(), tailwind()],
})
```

Finally, start your dev server

```bash
npm run dev
```

## 🚀 Hands-on time!

Astro has the option to add an inline script to your head tag. This script will be added to your html file which will run as soon as the html is loaded. This way we can avoid the dark flash. You can read more about inline scripts in the [Astro documentation](https://docs.astro.build/en/reference/directives-reference/#isinline).

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

This above script will add the class `dark` to the html element and set the current `localStorage` theme to `dark` if:

1. the user prefers dark mode and doesn't have a `localStorage` theme defined, or
2. the user have a `localStorage` theme set to `dark`.

If none of the above conditions are met, then the script will remove the class `dark` from the html element and set the `localStorage` theme to `light`.

## ⚛️ Creating the UI

For this example we will use preact to create a button to toggle between dark and light mode.

```tsx
import { useState, useEffect } from 'preact/hooks'
import type { FunctionalComponent } from 'preact'

export default function ThemeToggle(): FunctionalComponent {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return <button onClick={handleClick}>{theme === 'light' ? '🌙' : '🌞'}</button>
}
```

Nothig special here, just a button with a click event, and a state to toggle between theme `dark` and `light`.

The `useEffect` hook will be the one in change of updating the `localStorage` theme with the current theme.

## 🚫 Static Site Generation Problems

When using SSG the initial state will be undefined because the `localStorage` it is not available at build time. Theres a few things we can do to solve this problem:

1. add a fallback initial state, or
2. add a mounted state that will wait until the component is mounted.

### Fallback initial state

Adding a fallback initial state may be a good idea, but it's not the best solution because it may cause your UI to flick when the server render doesn't match your client render.

To implement the fallback initial state, we can use the nullish coalescing operator `??` to set a initial state.

```tsx
const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')
```

### Mounted state

Another option is to add a mounted state that will wait until the component is mounted. This will make sure that the `localStorage` theme is set when the component is mounted.

To implement this we can use the `useState` and `useEffect` hooks to create a mounted state. This render a fallback UI until the component is mounted.

```tsx
const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true)
}, [])

if (!isMounted) {
  return <FallbackUI />
}
```
