import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dannytortas.cl',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  build: {
    // Inline the CSS into <style> so the first paint doesn't wait on a separate
    // render-blocking stylesheet request (big LCP/FCP win on slow mobile).
    inlineStylesheets: 'always'
  }
});
