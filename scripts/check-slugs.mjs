#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baselinePath = join(__dirname, 'slugs_baseline.json');
const currentPath = join(__dirname, 'slugs_current.json');

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}

let baseline;
let current;
try {
  baseline = readJson(baselinePath);
} catch (e) {
  console.error(`Missing slug baseline at ${baselinePath}. Run: npm run slugs:approve`);
  process.exit(1);
}

try {
  current = readJson(currentPath);
} catch (e) {
  console.error(`Missing current slugs at ${currentPath}. Run: npm run build`);
  process.exit(1);
}

const baselineSet = new Set(baseline);
const currentSet = new Set(current);

const removed = baseline.filter((p) => !currentSet.has(p));
const added = current.filter((p) => !baselineSet.has(p));

if (removed.length || added.length) {
  console.error('Slug drift detected.');
  if (removed.length) {
    console.error(`Removed (${removed.length}):`);
    for (const p of removed.slice(0, 50)) console.error(`- ${p}`);
    if (removed.length > 50) console.error(`...and ${removed.length - 50} more`);
  }
  if (added.length) {
    console.error(`Added (${added.length}):`);
    for (const p of added.slice(0, 50)) console.error(`+ ${p}`);
    if (added.length > 50) console.error(`...and ${added.length - 50} more`);
  }
  console.error('If this change is intentional, run: npm run slugs:approve');
  process.exit(2);
}

console.log(`OK: ${current.length} slugs match baseline`);
