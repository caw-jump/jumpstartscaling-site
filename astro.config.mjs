import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://jumpstartscaling.com',
  compressHTML: true,
  output: 'static',
  build: { 
    inlineStylesheets: 'always',
    concurrency: 12 // Optimized for 8-core VPS to prevent OOM while maintaining speed
  },
  integrations: [
    react(), 
    mdx(), 
    sitemap({ 
      changefreq: 'weekly', 
      priority: 0.7, 
      lastmod: new Date(),
      entryLimit: 45000 // Chunks sitemap into multiple files for 280k+ pages
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['jumpstartscaling.com', 'www.jumpstartscaling.com', 'localhost', '127.0.0.1'] },
    build: { cssCodeSplit: true }
  }
});