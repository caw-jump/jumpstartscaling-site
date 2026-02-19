# Coolify Environment Variables

Set these in **Coolify → Application → Environment Variables**.

## Required (runtime)

| Variable      | Description                              | Example |
|---------------|------------------------------------------|---------|
| `N8N_WEBHOOK` | Full n8n webhook URL for form submissions| `https://n8n.yourserver.com/webhook/YOUR_ID` |

**Never commit the real URL.** Forms POST to `/api/submit-lead` and `/api/submit-scaling-survey`; the server proxies to this webhook.

## Optional (build-time)

These are baked into the static build. Use `PUBLIC_` prefix for client-visible values.

| Variable                      | Description                    |
|-------------------------------|--------------------------------|
| `PUBLIC_GA_ID`                | Google Analytics 4 ID         |
| `PUBLIC_CLARITY_ID`           | Microsoft Clarity ID           |
| `PUBLIC_META_PIXEL_ID`        | Meta (Facebook) Pixel ID       |
| `PUBLIC_TIKTOK_PIXEL_ID`      | TikTok Pixel ID                |
| `PUBLIC_PINTEREST_TAG_ID`     | Pinterest Tag ID               |
| `PUBLIC_X_TAG_ID`             | X (Twitter) Tag ID             |
| `PUBLIC_CALENDLY_URL`         | Calendly embed URL             |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console meta |
| `PUBLIC_BING_VERIFICATION`    | Bing Webmaster meta            |
| `PUBLIC_PINTEREST_VERIFICATION`| Pinterest domain verify meta   |

If not set, analytics scripts are skipped and the site still works.

## Making the repo public

GitHub: **Settings → General → Danger Zone → Change repository visibility → Public**

No secrets remain in the codebase; all sensitive values live in Coolify env.
