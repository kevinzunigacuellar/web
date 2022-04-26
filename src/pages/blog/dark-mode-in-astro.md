---
layout: '../../layouts/BlogLayout.astro'
title: Implementing dark mode in Astro
heroImage: /assets/social.png
publishDate: 2021-04-25
description: Add perfect dark mode support to your Astro 🚀 website
---
## Why do we need dark mode?
Some of the most popular websites use dark mode, and it's a great way to make your website more accessible. Some of the most popular websites use dark mode, and it's a great way to make your website more accessible. Some of the most popular websites use dark mode, and it's a great way to make your website more accessible. Some of the most popular websites use dark mode, and it's a great way to make your website more accessible.

```html
<script is:inline>
  const root = document.documentElement;
  const theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('theme-dark');
  } else {
    root.classList.remove('theme-dark');
  }
</script>
```

## 📝 Dark mode in Astro

Some text bobble

Deploy in [Vercel](https://vercel.com/astro-web)

some more text

- Some other text
- Todo 1
- Todo 2
- Todo 3

1. Todo 1
2. Todo 2
3. Todo 3