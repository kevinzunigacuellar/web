import { defineConfig } from 'astro/config'
import { astroImageTools } from 'astro-imagetools'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import solid from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroImageTools,
    tailwind(),
    solid(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  site: 'https://kevinzunigacuellar.com',
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
})
