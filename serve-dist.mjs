/**
 * Minimal static server for the built SPA.
 *
 * Why not `vite preview`? This has no host-checking and, more importantly, it
 * falls back to index.html for unknown paths so deep links such as
 * /figma/equipment work when opened directly (React Router handles them client
 * side). Vite emits hashed asset names, so those are cached aggressively while
 * index.html is never cached.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

if (!fs.existsSync(ROOT)) {
  console.error(`[serve-dist] Build output not found at ${ROOT}. Run "npm run build" first.`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  // Resolve inside ROOT only — no path traversal.
  const candidate = path.join(ROOT, path.normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  const isInsideRoot = candidate.startsWith(ROOT);

  let filePath = candidate;
  if (!isInsideRoot || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, 'index.html'); // SPA fallback
  }

  const ext = path.extname(filePath).toLowerCase();
  const isHashedAsset = /\/assets\//.test(filePath);

  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': isHashedAsset
      ? 'public, max-age=31536000, immutable'
      : 'no-cache, must-revalidate',
  });

  fs.createReadStream(filePath)
    .on('error', () => res.end())
    .pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`[serve-dist] serving ${ROOT} on http://${HOST}:${PORT}`);
});
