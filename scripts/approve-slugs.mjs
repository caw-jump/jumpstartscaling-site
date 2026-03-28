#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const currentPath = join(__dirname, 'slugs_current.json');
const baselinePath = join(__dirname, 'slugs_baseline.json');

let current;
try {
  const raw = readFileSync(currentPath, 'utf-8');
  current = JSON.parse(raw);
} catch (err) {
  console.error(`Failed to read or parse ${currentPath}:`, err.message);
  process.exit(1);
}

if (!Array.isArray(current)) {
  console.error(`Expected array in ${currentPath}, got ${typeof current}`);
  process.exit(1);
}

writeFileSync(baselinePath, JSON.stringify(current, null, 2));
console.log(`Wrote baseline: ${baselinePath} (${current.length} slugs)`);
