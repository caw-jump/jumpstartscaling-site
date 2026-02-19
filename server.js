import { createServer } from 'http';
import { readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8100;
const DIST_DIR = join(__dirname, 'dist');

// n8n webhook - MUST be set in Coolify env (never commit)
const N8N_WEBHOOK = process.env.N8N_WEBHOOK;

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
            proxyToWebhook(data, res);
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
    const urlPath = (req.url || '/').split('?')[0];

    // API routes - proxy to n8n (Coolify deployment)
    if (req.method === 'POST') {
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
        try {
            const content = readFileSync(join(DIST_DIR, 'index.html'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
