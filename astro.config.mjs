import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://jumpstartscaling.com',
  compressHTML: true,
  output: 'static',
  build: { inlineStylesheets: 'always' },
  integrations: [react(), mdx(), sitemap({ changefreq: 'weekly', priority: 0.7, lastmod: new Date() })],
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['jumpstartscaling.com', 'www.jumpstartscaling.com', 'localhost', '127.0.0.1'] },
    build: { cssCodeSplit: true, rollupOptions: { output: { manualChunks: { 'react-vendor': ['react', 'react-dom'] } } } }
  }
});