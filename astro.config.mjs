import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solid(), sitemap(), image()],
  site: 'https://kevinzunigacuellar.com',
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
})
