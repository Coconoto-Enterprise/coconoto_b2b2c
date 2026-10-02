/**
 * Tests for api/seo.js — run with:
 *
 *   node api/_seo.test.mjs
 *
 * The shell fetch is pointed at the local dev server via the forwarded headers,
 * so this exercises the real code path (fetch index.html → rewrite the <head>)
 * rather than a stub. Requires `npm run dev` to be running on :5173.
 */
import { readFileSync } from 'node:fs';

// ── Minimal .env.local loader (no dotenv dependency) ─────────────────────────
// MUST run before seo.js is evaluated: seo.js reads process.env at module scope
// to build its Supabase client. A static `import handler from './seo.js'` is
// hoisted above this loop, so it would always see an undefined key and silently
// fall back to a static-only sitemap. Hence the dynamic import below.
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
} catch {
  console.warn('! .env.local not readable — sitemap will contain static routes only');
}

const { default: handler } = await import('./seo.js');

const ORIGIN = 'http://localhost:5173';
const SITE = 'https://www.coconoto.africa';
const HOME_CANONICAL = `${SITE}/`;

const pass = [];
const fail = [];
const ok = (cond, msg) => (cond ? pass : fail).push(msg);

function mockRes() {
  return {
    statusCode: null,
    headers: {},
    body: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    send(b) { this.body = b; return this; },
    json(o) { this.body = JSON.stringify(o); return this; },
    end() { return this; },
  };
}

const call = async (query) => {
  const res = mockRes();
  await handler(
    {
      method: 'GET',
      query,
      headers: { host: 'localhost:5173', 'x-forwarded-proto': 'http', 'x-forwarded-host': 'localhost:5173' },
    },
    res
  );
  return res;
};

// ── Sitemap ──────────────────────────────────────────────────────────────────
const sm = await call({ action: 'sitemap' });
ok(sm.statusCode === 200, `sitemap returns 200 (got ${sm.statusCode})`);
ok(
  String(sm.headers['content-type']).includes('application/xml'),
  `sitemap is served as XML (got ${sm.headers['content-type']})`
);

const xml = sm.body;
const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
console.log(`sitemap: ${locs.length} URLs`);
locs.forEach((l) => console.log('   ' + l));

ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap has an XML declaration');
ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'sitemap uses the urlset namespace');
ok((xml.match(/<url>/g) || []).length === (xml.match(/<\/url>/g) || []).length, '<url> tags are balanced');

// Every route the sitemap claims must be a real public route.
for (const p of ['/', '/about', '/services', '/product', '/marketplace', '/blog', '/contact', '/help-center', '/privacy-policy', '/terms-of-service', '/cookie-policy']) {
  const want = p === '/' ? HOME_CANONICAL : `https://www.coconoto.africa${p}`;
  ok(locs.includes(want), `sitemap includes ${want}`);
}

// Things that must NOT be crawlable.
for (const bad of ['/login', '/signup', '/buyer-dashboard', '/vendor-dashboard', '/blog-editor', '/profile', '/figma', '/500', '/vintage-dashboard']) {
  ok(!locs.some((l) => l.endsWith(bad)), `sitemap excludes ${bad}`);
}

// No unescaped ampersands in element text.
ok(!/<loc>[^<]*&(?!(amp|lt|gt|quot|apos);)/.test(xml), 'no unescaped & in <loc>');

const blogLocs = locs.filter((l) => l.includes('/blog/'));
ok(blogLocs.length > 0, `blog posts are included (${blogLocs.length} found)`);
ok(
  blogLocs.every((l) => /^https:\/\/www\.coconoto\.africa\/blog\/[a-z0-9-]+$/.test(l)),
  'every blog URL is a clean lowercase slug'
);

// ── page-meta: every public route gets its OWN canonical ─────────────────────
const PUBLIC = ['/', '/about', '/services', '/product', '/marketplace', '/blog', '/contact', '/help-center', '/privacy-policy', '/terms-of-service', '/cookie-policy'];
const seenTitles = new Map();

for (const path of PUBLIC) {
  const r = await call({ action: 'page-meta', path });
  ok(r.statusCode === 200, `${path}: returns 200 (got ${r.statusCode})`);

  const canonical = r.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const title = r.body.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const desc = r.body.match(/<meta name="description" content="([^"]*)"/)?.[1];

  const wantCanonical = path === '/' ? HOME_CANONICAL : `https://www.coconoto.africa${path}`;
  ok(canonical === wantCanonical, `${path}: canonical is ${wantCanonical} (got ${canonical})`);
  ok(!!title && title.length > 5, `${path}: has a real <title> (got ${JSON.stringify(title)})`);
  ok(!!desc && desc.length > 20, `${path}: has a real description (${desc?.length ?? 0} chars)`);

  // Exactly one of each — a duplicate canonical is ambiguous for Google.
  ok((r.body.match(/rel="canonical"/g) || []).length === 1, `${path}: exactly one canonical tag`);
  ok((r.body.match(/<title>/g) || []).length === 1, `${path}: exactly one <title>`);

  // The shell's homepage canonical must be gone, not merely shadowed.
  if (path !== '/') {
    ok(!r.body.includes(`<link rel="canonical" href="${HOME_CANONICAL}"`), `${path}: homepage canonical removed`);
  }
  ok(!!r.body.includes('</head>') && !!r.body.includes('id="root"'), `${path}: still serves a usable SPA shell`);

  seenTitles.set(path, title);
}

// Distinct titles — duplicate titles across pages is its own ranking problem.
const dupes = [...seenTitles.entries()].filter(([p, t], i, a) => a.findIndex(([, t2]) => t2 === t) !== i);
ok(dupes.length === 0, `all page titles are distinct (dupes: ${dupes.map(([p]) => p).join(', ') || 'none'})`);

// ── Fallbacks ────────────────────────────────────────────────────────────────
const unknown = await call({ action: 'page-meta', path: '/not-a-real-page' });
ok(unknown.statusCode === 200, `unknown path falls back to the shell (got ${unknown.statusCode})`);
ok(
  unknown.body.includes(`<link rel="canonical" href="${HOME_CANONICAL}"`),
  'unknown path keeps the untouched shell rather than inventing a canonical'
);

const noAction = await call({});
ok(noAction.statusCode === 400, `missing action returns 400 (got ${noAction.statusCode})`);

// Path normalisation: trailing slash and query string must resolve the same page.
const trailing = await call({ action: 'page-meta', path: '/services/' });
ok(
  trailing.body.includes('href="https://www.coconoto.africa/services"'),
  '/services/ (trailing slash) normalises to the /services canonical'
);

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\nPASS ${pass.length}`);
if (fail.length) {
  console.log(`FAIL ${fail.length}`);
  fail.forEach((f) => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('all green');
