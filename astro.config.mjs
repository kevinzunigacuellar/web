import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import { astroImageTools } from 'astro-imagetools'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'

// https://astro.build/config
export default defineConfig({
  integrations: [astroImageTools, tailwind(), preact(), sitemap(), partytown()],
  site: 'https://kevinzunigacuellar.com',
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
})
