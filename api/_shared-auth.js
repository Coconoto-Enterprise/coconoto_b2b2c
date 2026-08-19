// Shared authentication helper for internal admin/mutation endpoints.
//
// All Vercel serverless endpoints that touch privileged Supabase actions
// (service-role key, PII tables, email relays) must call `requireApiKey(req, res)`
// before doing any work. The expected key is configured via the environment
// variable `API_MUTATIONS_KEY` — if it is missing, the helper *fails closed*
// (returns 503) rather than silently allowing access.
//
// Use `coerceOriginToAllowlist(req, res, allowed)` to lock CORS to a set of
// known origins instead of echoing `Access-Control-Allow-Origin: *` (or worse:
// the request `Origin` header).

import crypto from 'crypto';

const compareSecret = (provided, expected) => {
  if (!provided || !expected) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
};

/**
 * Require the caller to present a valid `x-api-key` header that matches
 * `process.env.API_MUTATIONS_KEY`. Returns `true` when authorized, or
 * sends a 401/503 response and returns `false`.
 *
 * Usage:
 *   if (!requireApiKey(req, res)) return;
 */
export const requireApiKey = (req, res, { headerName = 'x-api-key', envVar = 'API_MUTATIONS_KEY' } = {}) => {
  const expected = process.env[envVar];
  if (!expected) {
    console.warn(`[auth] ${envVar} not configured — endpoint refused.`);
    res.status(503).json({ success: false, error: 'Endpoint unavailable' });
    return false;
  }
  const provided = req.headers?.[headerName] || req.headers?.[headerName.toLowerCase()];
  if (!provided || !compareSecret(provided, expected)) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return false;
  }
  return true;
};

/**
 * Returns a parseable list of trusted origins for CORS allowlists.
 * Reads `MARKETPLACE_CORS_ALLOWED_ORIGINS` (comma-separated). Falls back to
 * a small local-dev allowlist.
 */
export const getAllowedOrigins = () => {
  const raw = process.env.MARKETPLACE_CORS_ALLOWED_ORIGINS;
  if (raw && raw.trim()) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://www.coconoto.africa',
    'https://coconoto.africa',
  ];
};

/**
 * Replace the default `Access-Control-Allow-Origin: *` (or "echo the request
 * Origin even with credentials") pattern with a strict allowlist.
 *
 * When `allowCredentials` is `true`, browsers refuse to send cookies unless
 * the `Allow-Origin` is a single explicit value, so we only ever set one.
 *
 * Returns `true` if the request's origin is allowed, `false` if it was not
 * (which still leaves CORS headers unset — the browser will block it).
 */
export const applyCorsAllowlist = (req, res, { allowCredentials = false, methods = 'GET, POST, OPTIONS' } = {}) => {
  const origin = req.headers?.origin;
  const allowed = getAllowedOrigins();
  const allowOriginHeader = origin && allowed.includes(origin);
  if (allowOriginHeader) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (!origin) {
    // Same-origin or curl: respond without an Allow-Origin header so the
    // browser allows it but other sites still cannot.
    res.setHeader('Access-Control-Allow-Origin', '');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'null');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, Authorization');
  if (allowCredentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  return allowOriginHeader;
};

/**
 * Strip newlines / carriage returns from a string before it is interpolated
 * into an email header. CRLF injection is a classic SMTP smuggling primitive.
 */
export const sanitizeHeaderValue = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).replace(/[\r\n\t]+/g, ' ').slice(0, 998);
};

/**
 * HTML-escape user input before it is interpolated into an email body to
 * block both stored XSS in admin inboxes and reflected XSS in dashboard
 * previews.
 */
export const escapeHtml = (value) => {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
