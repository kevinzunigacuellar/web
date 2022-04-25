import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import turbolinks from '@astrojs/turbolinks';

export default defineConfig({
  integrations: [tailwind(), preact(), turbolinks()],
});
