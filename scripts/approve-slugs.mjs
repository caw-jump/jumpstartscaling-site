#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const currentPath = join(__dirname, 'slugs_current.json');
const baselinePath = join(__dirname, 'slugs_baseline.json');

const current = JSON.parse(readFileSync(currentPath, 'utf-8'));
writeFileSync(baselinePath, JSON.stringify(current, null, 2));
console.log(`Wrote baseline: ${baselinePath} (${current.length} slugs)`);
