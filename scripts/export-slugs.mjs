#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

function readSitemapUrls() {
  const sitemapPath = join(distDir, 'sitemap-0.xml');
  const xml = readFileSync(sitemapPath, 'utf-8');
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  return [...matches].map((m) => m[1]);
}

function toPath(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return '/';
  }
}

const urls = readSitemapUrls();
const paths = Array.from(new Set(urls.map(toPath))).sort();

writeFileSync(join(distDir, 'slugs.json'), JSON.stringify(paths, null, 2));
writeFileSync(join(__dirname, 'slugs_current.json'), JSON.stringify(paths, null, 2));

console.log(`Exported ${paths.length} slugs to dist/slugs.json and scripts/slugs_current.json`);
