# DNS for Coolify Deployment

After deploying to Coolify (86.48.23.38), update Cloudflare:

| Domain | Record | Value | Notes |
|--------|--------|-------|------|
| jumpstartscaling.com | A | 86.48.23.38 | Points to Coolify |
| www.jumpstartscaling.com | CNAME | jumpstartscaling.com | Or A → 86.48.23.38 |
| n8n.jumpstartscaling.com | A | 150.136.117.198 | **Keep on Oracle** — n8n stays there |

**Important:** `n8n.jumpstartscaling.com` must stay pointed at Oracle (150.136.117.198) because form webhooks and n8n workflows run there. Only the main site moves to Coolify.
