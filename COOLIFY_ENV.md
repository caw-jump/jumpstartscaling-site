# Coolify Environment Variables

Set these in **Coolify → Application → Environment Variables**.

## Required (runtime)

| Variable      | Description                              | Example Value |
|---------------|------------------------------------------|---------------|
| `N8N_WEBHOOK` | Full n8n webhook URL for form submissions | `https://n8n.example.com/webhook/<your-token>` |
| `SITE_URL` | Site URL for sitemap/indexing | `https://your-site.com` |

**Do not commit real webhook URLs. Store them in environment variables.**

Forms POST to `/api/submit-lead` and `/api/submit-scaling-survey`; the server proxies to this webhook.

## Optional (build-time)

These are baked into the static build. Use `PUBLIC_` prefix for client-visible values.

| Variable                      | Description                    | Example |
|-------------------------------|--------------------------------|---------|
| `PUBLIC_GA_ID`                | Google Analytics 4 ID         | `G-XXXXXXXXXX` |
| `PUBLIC_CLARITY_ID`           | Microsoft Clarity ID           | `1234567890` |
| `PUBLIC_META_PIXEL_ID`        | Meta (Facebook) Pixel ID       | `1234567890123456` |
| `PUBLIC_TIKTOK_PIXEL_ID`      | TikTok Pixel ID                | `1234567890123456789` |
| `PUBLIC_PINTEREST_TAG_ID`     | Pinterest Tag ID               | `1234567890123456789` |
| `PUBLIC_X_TAG_ID`             | X (Twitter) Tag ID             | `1234567890` |
| `PUBLIC_CALENDLY_URL`         | Calendly embed URL             | `https://calendly.com/jumpstartscaling/30min` |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console meta | `abcdefghijklmnopqrstuvwxyz` |
| `PUBLIC_BING_VERIFICATION`    | Bing Webmaster meta            | `ABCDEF123456` |
| `PUBLIC_PINTEREST_VERIFICATION`| Pinterest domain verify meta   | `1234567890123456789` |

## Optional (runtime analytics)

| Variable                      | Description                    |
|-------------------------------|--------------------------------|
| `GA4_MEASUREMENT_ID`           | GA4 measurement ID (server-side) |
| `GA4_API_SECRET`               | GA4 API secret for server tracking |
| `GA4_DEBUG`                    | Set to '1' or 'true' for debug mode |
| `META_PIXEL_ID`               | Meta Pixel ID (server-side) |
| `META_CAPI_ACCESS_TOKEN`      | Meta Conversions API access token |
| `META_TEST_EVENT_CODE`        | Meta test event code for debugging |

## Optional (indexing)

| Variable                      | Description                    |
|-------------------------------|--------------------------------|
| `INDEXNOW_ENABLED`            | Set to '1' or 'true' to enable IndexNow |
| `INDEXNOW_KEY`                | IndexNow API key |
| `INDEXNOW_KEY_LOCATION`       | IndexNow key file URL |
| `REDIRECT_MATCH_THRESHOLD`    | Similarity threshold for redirects (default: 0.35) |

If not set, analytics scripts are skipped and the site still works.

## Making the repo public

GitHub: **Settings → General → Danger Zone → Change repository visibility → Public**

No secrets remain in the codebase; all sensitive values live in Coolify env.
