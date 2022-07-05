import { defineConfig } from 'astro/config'
import { astroImageTools } from 'astro-imagetools'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [astroImageTools, tailwind(), solid(), sitemap()],
  site: 'https://kevinzunigacuellar.com',
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
  vite: {
    ssr: {
      external: ['svgo'],
    },
  },
  experimental: {
    integrations: true,
  },
})
