import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import { astroImageTools } from 'astro-imagetools'

export default defineConfig({
  integrations: [astroImageTools, tailwind(), preact()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
  site: 'https://kevinzunigacuellar.com',
})
