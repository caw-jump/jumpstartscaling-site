#!/usr/bin/env node
/**
 * Submit /tools/* URLs to IndexNow for fast indexing (Bing, Yandex, etc.).
 * Run after deploy: node scripts/submit-indexnow.mjs
 * Requires INDEXNOW_KEY env var or uses default from key file.
 */
const SITE = 'https://jumpstartscaling.com';
const KEY = process.env.INDEXNOW_KEY || 'jumpstart-indexnow-key-2026';
const KEY_LOCATION = `${SITE}/jumpstart-indexnow-key-2026.txt`;

const TOOL_SLUGS = [
  'startup-valuation-calculator',
  'ecommerce-sales-projector',
  'company-sales-comparison',
  'loyalty-rewards-optimizer',
  'unemployment-impact-simulator',
  'acquisition-value-estimator',
  'interest-rate-cut-calculator',
  'labor-dispute-risk-analyzer',
  'ai-music-royalty-calculator',
  'ai-ip-risk-estimator',
];

const urlList = [
  `${SITE}/tools`,
  ...TOOL_SLUGS.map((s) => `${SITE}/tools/${s}`),
];

const payload = {
  host: 'jumpstartscaling.com',
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

async function submit() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      console.log(`${endpoint}: ${res.status} ${res.statusText}`);
    } catch (e) {
      console.error(`${endpoint}: ${e.message}`);
    }
  }
}

submit();
