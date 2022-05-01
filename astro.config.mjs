import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import astroImagePlugin from 'astro-imagetools/plugin'

export default defineConfig({
  integrations: [tailwind(), preact()],
  vite: {
    plugins: [astroImagePlugin],
  },
  markdown:{
    shikiConfig:{
      theme: 'one-dark-pro',
      wrap: true,
    }
  },
  site: 'https://kevinzunigacuellar.com',
})
