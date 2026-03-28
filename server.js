import { createServer } from 'http';
import { readFileSync, statSync, writeFile, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8100;
const DIST_DIR = join(__dirname, 'dist');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function normalizePathname(p) {
    let path = (p || '/').split('?')[0];
    if (!path.startsWith('/')) path = `/${path}`;
    // Normalize trailing slash (keep root as '/')
    path = path.replace(/\/+$/, '') || '/';
    return path;
}

function safeReadJson(filePath) {
    try {
        return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
        return null;
    }
}

// Optional redirect map: { "/old": "/new" }
const redirectMap = safeReadJson(join(DIST_DIR, 'redirects.json')) || {};

// Canonical slugs exported from sitemap at build time
const validSlugs = safeReadJson(join(DIST_DIR, 'slugs.json')) || [];
const validSlugSet = new Set(validSlugs);

function trigrams(s) {
    const t = `  ${s}  `;
    const out = new Set();
    for (let i = 0; i < t.length - 2; i++) out.add(t.slice(i, i + 3));
    return out;
}

const slugTrigrams = validSlugs.map((p) => ({ p, grams: trigrams(p) }));

function trigramSimilarity(a, b) {
    const A = trigrams(a);
    const B = trigrams(b);
    let inter = 0;
    for (const g of A) if (B.has(g)) inter++;
    const denom = A.size + B.size - inter;
    return denom === 0 ? 0 : inter / denom;
}

function bestMatch(pathname) {
    // Fast exits
    if (validSlugSet.has(pathname)) return { path: pathname, score: 1 };

    let best = null;
    let bestScore = 0;
    // Limit comparisons for speed by focusing on same prefix bucket when possible
    const prefix = pathname.split('/').slice(0, 2).join('/');

    for (const item of slugTrigrams) {
        if (prefix !== '/' && item.p.startsWith(prefix) === false) {
            // Still allow some cross-prefix matches, but de-prioritize by skipping most
            // (keeps perf sane on large slug lists)
            continue;
        }

        const score = trigramSimilarity(pathname, item.p);
        if (score > bestScore) {
            bestScore = score;
            best = item.p;
        }
    }

    // If prefix-bucket search failed, do a broader sweep on a small sample of top candidates
    if (!best) {
        for (let i = 0; i < slugTrigrams.length; i += 25) {
            const p = slugTrigrams[i].p;
            const score = trigramSimilarity(pathname, p);
            if (score > bestScore) {
                bestScore = score;
                best = p;
            }
        }
    }

    return { path: best, score: bestScore };
}

// n8n webhook - MUST be set in Coolify env (never commit)
const N8N_WEBHOOK = process.env.N8N_WEBHOOK;
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || process.env.PUBLIC_GA4_MEASUREMENT_ID || '';
const GA4_API_SECRET = process.env.GA4_API_SECRET || '';
const GA4_DEBUG = String(process.env.GA4_DEBUG || process.env.PUBLIC_GA4_DEBUG || '').toLowerCase() === '1' || String(process.env.GA4_DEBUG || process.env.PUBLIC_GA4_DEBUG || '').toLowerCase() === 'true';
const META_PIXEL_ID = process.env.META_PIXEL_ID || process.env.PUBLIC_META_PIXEL_ID || '';
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';

function safeString(v, fallback = '') {
    if (v === null || v === undefined) return fallback;
    return String(v);
}

function getClientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (Array.isArray(fwd) && fwd.length > 0) return safeString(fwd[0]).split(',')[0].trim();
    if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string' && realIp.length > 0) return realIp.trim();
    return req.socket?.remoteAddress || '';
}

async function forwardToGa4TrackEvent(trackPayload) {
    if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) {
        return { enabled: false, delivered: false, reason: 'ga4_not_configured' };
    }

    const endpoint = GA4_DEBUG
        ? 'https://www.google-analytics.com/debug/mp/collect'
        : 'https://www.google-analytics.com/mp/collect';
    const eventName = safeString(trackPayload.name || 'custom_event').trim() || 'custom_event';
    const params = trackPayload.params && typeof trackPayload.params === 'object' ? trackPayload.params : {};
    const clientId = safeString(trackPayload.client_id || trackPayload.clientId || `jss.${Date.now()}.${Math.floor(Math.random() * 1e9)}`);

    const body = {
        client_id: clientId,
        events: [{
            name: eventName,
            params: {
                ...params,
                event_id: safeString(trackPayload.event_id || trackPayload.eventId || ''),
                page_location: safeString(trackPayload.url || params.page_location || ''),
            }
        }]
    };

    const response = await fetch(`${endpoint}?measurement_id=${encodeURIComponent(GA4_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(GA4_API_SECRET)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        return { enabled: true, delivered: false, status: response.status, body: text.slice(0, 300) };
    }

    if (GA4_DEBUG) {
        const debugBody = await response.text();
        return { enabled: true, delivered: true, status: response.status, body: debugBody.slice(0, 300) };
    }

    return { enabled: true, delivered: true, status: response.status };
}

async function forwardToMetaCapiTrackEvent(trackPayload, req) {
    if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
        return { enabled: false, delivered: false, reason: 'meta_capi_not_configured' };
    }

    const eventNameMap = {
        page_view: 'PageView',
        view_content: 'ViewContent',
        search: 'Search',
        lead: 'Lead',
        form_submit: 'CompleteRegistration'
    };
    const mappedEventName = eventNameMap[safeString(trackPayload.name)] || safeString(trackPayload.name || 'CustomEvent');
    const params = trackPayload.params && typeof trackPayload.params === 'object' ? trackPayload.params : {};

    const payload = {
        data: [{
            event_name: mappedEventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: safeString(trackPayload.event_id || trackPayload.eventId || ''),
            action_source: 'website',
            event_source_url: safeString(trackPayload.url || params.page_location || ''),
            user_data: {
                client_ip_address: getClientIp(req),
                client_user_agent: safeString(req.headers['user-agent'] || '')
            },
            custom_data: params
        }]
    };

    if (META_TEST_EVENT_CODE) payload.test_event_code = META_TEST_EVENT_CODE;

    const endpoint = `https://graph.facebook.com/v20.0/${encodeURIComponent(META_PIXEL_ID)}/events?access_token=${encodeURIComponent(META_CAPI_ACCESS_TOKEN)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        return { enabled: true, delivered: false, status: response.status, body: text.slice(0, 300) };
    }

    return { enabled: true, delivered: true, status: response.status };
}

function proxyToWebhook(body, res) {
    const data = JSON.stringify(body);
    const req = https.request(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Submitted' }));
    });
    req.on('error', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Received' }));
    });
    req.write(data);
    req.end();
}

function handleApiPost(urlPath, req, res) {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
        try {
            const data = body ? JSON.parse(body) : {};
            // Server-side analytics forwarding scaffold
            if (urlPath === '/api/track') {
                (async () => {
                    try {
                        const [ga4, meta] = await Promise.all([
                            forwardToGa4TrackEvent(data),
                            forwardToMetaCapiTrackEvent(data, req)
                        ]);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ success: true, ga4, meta }));
                    } catch (forwardErr) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ success: true, warning: 'tracking_forward_failed' }));
                    }
                })();
                return;
            }

            proxyToWebhook(data, res);
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

/**
 * ADMIN API - Support for hot-updates and background builds
 */
let currentBuildProcess = null;

function handleAdminApi(urlPath, req, res) {
    if (!ADMIN_TOKEN) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'ADMIN_TOKEN not configured on server' }));
    }

    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Forbidden' }));
    }

    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
        try {
            const data = body ? JSON.parse(body) : {};

            // TRIGGER BACKGROUND BUILD
            if (urlPath === '/api/admin/rebuild') {
                if (currentBuildProcess) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Build already in progress', pid: currentBuildProcess.pid }));
                }

                // Start build in separate process
                // Use a temporary dist folder and rsync/mv to avoid downtime
                const env = { ...process.env, RENDER_PSEO: data.renderPseo === false ? 'false' : 'true' };
                if (data.pseoLimit) env.PSEO_LIMIT = String(data.pseoLimit);

                console.log(`[Admin] Starting background build. RENDER_PSEO=${env.RENDER_PSEO}`);

                currentBuildProcess = spawn('npm', ['run', 'build'], { env, shell: true });
                
                currentBuildProcess.stdout.on('data', (d) => console.log(`[Build] ${d}`));
                currentBuildProcess.stderr.on('data', (d) => console.error(`[Build Error] ${d}`));

                currentBuildProcess.on('close', (code) => {
                    console.log(`[Admin] Build finished with code ${code}`);
                    currentBuildProcess = null;
                });

                res.writeHead(202, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: 'Build started in background' }));
            }

            // UPDATE JSON DATA
            if (urlPath === '/api/admin/update-json') {
                const { filename, content } = data;
                if (!filename || !content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Missing filename or content' }));
                }

                // Strict filename validation to prevent path traversal
                if (filename.includes('..') || filename.includes('/') || filename.includes('\\') || filename.includes('\0')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Invalid filename' }));
                }
                if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Filename contains invalid characters' }));
                }

                const safeFilename = filename;
                const targetPath = join(__dirname, 'src/data/pseo', safeFilename);

                writeFile(targetPath, JSON.stringify(content, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to write file', details: err.message }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: `Updated ${safeFilename}` }));
                });
                return;
            }

            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Admin route not found' }));
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = createServer((req, res) => {
    const urlPath = normalizePathname(req.url || '/');

    // API routes - proxy to n8n (Coolify deployment)
    if (req.method === 'POST') {
        if (urlPath.startsWith('/api/admin/')) {
            return handleAdminApi(urlPath, req, res);
        }
        if (urlPath === '/api/track') {
            return handleApiPost(urlPath, req, res);
        }
        if (urlPath === '/api/submit-lead' || urlPath === '/api/submit-scaling-survey') {
            if (!N8N_WEBHOOK) {
                console.warn('N8N_WEBHOOK not set - form submissions will be accepted but not forwarded');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: 'Received' }));
            }
            return handleApiPost(urlPath, req, res);
        }
    }

    let filePath = join(DIST_DIR, urlPath === '/' || urlPath === '' ? 'index.html' : urlPath);

    try {
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            filePath = join(filePath, 'index.html');
        }

        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const content = readFileSync(filePath);

        const isStatic = ['.js', '.css', '.png', '.jpg', '.gif', '.svg', '.ico', '.webp', '.mp4', '.webm', '.woff', '.woff2', '.ttf', '.eot'].includes(ext);
        const cacheControl = isStatic ? 'public, max-age=31536000, immutable' : 'public, max-age=3600';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': cacheControl
        });
        res.end(content);
    } catch (error) {
        // Redirect safety net (Option 2)
        const mapped = redirectMap[urlPath];
        if (mapped) {
            res.writeHead(301, { Location: mapped });
            return res.end();
        }

        const { path: matched, score } = bestMatch(urlPath);
        const THRESHOLD = Number(process.env.REDIRECT_MATCH_THRESHOLD || '0.35');
        if (matched && score >= THRESHOLD) {
            res.writeHead(301, { Location: matched });
            return res.end();
        }

        const q = encodeURIComponent(urlPath.replace(/^\//, ''));
        res.writeHead(301, { Location: `/search?q=${q}` });
        return res.end();
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
