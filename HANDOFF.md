# Project Handoff Script

## Project Overview
This is a JumpStart Scaling site with programmatic SEO (PSEO), analytics integrations, and SEO optimizations. The project uses Astro framework with Node.js server.

## Current Status
✅ **Completed Tasks:**
- Analytics integrations (GA4, Clarity, Meta Pixel) with environment-driven setup
- Server-side analytics forwarding endpoint (`/api/track`)
- Uniqueness audit script for headlines
- Environment-gated IndexNow submissions
- Client-side view_content tracking on tools/insights pages
- Build verification and runtime testing

## Key Files & Configurations

### Environment Variables (`.env`)
```bash
# Public analytics IDs
PUBLIC_GA4_MEASUREMENT_ID=G-VKT7QBTYNX
PUBLIC_CLARITY_PROJECT_ID=ueehvbrmy3
# PUBLIC_META_PIXEL_ID=  # Add if needed

# Private secrets (add these for full functionality)
# GA4_API_SECRET=your_secret
# META_CAPI_ACCESS_TOKEN=your_token
# META_TEST_EVENT_CODE=test
# GA4_DEBUG=true

# IndexNow control
# INDEXNOW_ENABLED=true
# SITE_URL=https://yourdomain.com
# SITE_HOST=yourdomain.com
# INDEXNOW_KEY=your_key
# INDEXNOW_KEY_LOCATION=/jumpstart-indexnow-key-2026.txt
```

### Core Files
- **`src/layouts/BaseLayout.astro`** - Analytics injection and client-side tracking
- **`server.js`** - Server logic with `/api/track` endpoint
- **`scripts/audit_uniqueness.py`** - Headline uniqueness audit
- **`scripts/submit-indexnow.mjs`** - IndexNow submissions (env-gated)
- **`package.json`** - Build scripts and dependencies

## Analytics Architecture

### Client-Side (BaseLayout.astro)
- GA4 loads automatically when `PUBLIC_GA4_MEASUREMENT_ID` is set
- Clarity loads automatically when `PUBLIC_CLARITY_PROJECT_ID` is set
- Meta Pixel loads when `PUBLIC_META_PIXEL_ID` is set
- Automatic `view_content` events on `/tools/*` and `/insights/*` pages

### Server-Side (`/api/track`)
- Forwards events to GA4 Measurement Protocol
- Forwards events to Meta Conversions API
- Captures IP and User-Agent
- Deduplicates events using `event_id`
- Safe fallback when secrets are missing

## SEO Features

### IndexNow Integration
- Controlled by `INDEXNOW_ENABLED` environment variable
- Submits URLs from sitemap during build
- Configurable host and key location
- Silent failures when disabled

### Uniqueness Audit
- Python script analyzes headline duplicates
- Uses normalization and SimHash clustering
- Run via: `npm run audit:uniqueness`

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run uniqueness audit
npm run audit:uniqueness

# Preview production build
npm run preview
```

## Known Issues & Considerations

### Build Warnings
- CSS logical property warnings (non-critical)
- These don't affect functionality

### Missing Secrets
- Server-side forwarding disabled until private secrets added
- Client-side analytics work with public IDs only

### Testing Recommendations
1. Test analytics locally with current setup
2. Add private secrets for full server-side forwarding
3. Run uniqueness audit after content changes
4. Verify IndexNow submissions in production

## Next Steps for New Chat

### Immediate Actions
1. **Verify current state** - Run `npm run build` to ensure everything works
2. **Check analytics** - Verify client-side tracking is working
3. **Test server endpoint** - Check `/api/track` responds correctly

### Potential Enhancements
1. Add Meta Pixel ID if needed
2. Configure private secrets for server-side forwarding
3. Enable IndexNow for production
4. Address CSS warnings if desired
5. Add more comprehensive error handling

### Debugging Checklist
- Check `.env` file exists and has correct values
- Verify `public/jumpstart-indexnow-key-2026.txt` exists
- Test analytics in browser dev tools
- Monitor server logs for `/api/track` requests
- Run uniqueness audit after content updates

## Architecture Notes

### PSEO System
- Dynamic page generation via `spintaxEngine.ts`
- Content stored in `src/data/pseo/`
- Slugs managed via `slugs.json` and `redirects.json`

### Server Architecture
- Static file serving
- API endpoints for webhooks and analytics
- Redirect handling for slug stability
- IndexNow integration

### Analytics Flow
1. Page load → Client-side scripts initialize
2. User interactions → Client-side events
3. Optional: Server-side forwarding via `/api/track`
4. Deduplication and enrichment server-side

## Contact Information
- Project uses Astro + Node.js
- Analytics credentials already configured
- Environment-driven architecture
- Built for scalability and SEO optimization

---
**Last Updated**: Current session
**Status**: Ready for handoff
