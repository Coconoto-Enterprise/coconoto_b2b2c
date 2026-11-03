// Smoke test for the shared-auth helper. ESM because package.json sets
// "type": "module". Run with `node api/_shared-auth.test.mjs`.

import assert from 'node:assert/strict';
import { requireApiKey, applyCorsAllowlist, escapeHtml, sanitizeHeaderValue } from './_shared-auth.js';

process.env.API_MUTATIONS_KEY = 'unit-test-secret-do-not-use-in-prod';

const mkRes = () => {
  const r = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { return this; },
  };
  return r;
};

const mkReq = (headers = {}) => ({ headers, method: 'GET' });

// 1) Missing key fails 401.
{
  const res = mkRes();
  const ok = requireApiKey(mkReq(), res, { envVar: 'API_MUTATIONS_KEY' });
  assert.equal(ok, false);
  assert.equal(res.statusCode, 401);
  console.log('case1 ok (no header -> 401)');
}

// 2) Wrong key fails 401.
{
  const res = mkRes();
  const ok = requireApiKey(mkReq({ 'x-api-key': 'wrong' }), res, { envVar: 'API_MUTATIONS_KEY' });
  assert.equal(ok, false);
  assert.equal(res.statusCode, 401);
  console.log('case2 ok (wrong header -> 401)');
}

// 3) Correct key passes.
{
  const res = mkRes();
  const ok = requireApiKey(mkReq({ 'x-api-key': 'unit-test-secret-do-not-use-in-prod' }), res, { envVar: 'API_MUTATIONS_KEY' });
  assert.equal(ok, true);
  console.log('case3 ok (good header -> 200)');
}

// 4) Missing env var fails closed (503).
{
  delete process.env.API_MUTATIONS_KEY;
  const res = mkRes();
  const ok = requireApiKey(mkReq({ 'x-api-key': 'anything' }), res, { envVar: 'API_MUTATIONS_KEY' });
  assert.equal(ok, false);
  assert.equal(res.statusCode, 503);
  console.log('case4 ok (no env var -> 503 fail-closed)');
  process.env.API_MUTATIONS_KEY = 'unit-test-secret-do-not-use-in-prod';
}

// 5) escapeHtml.
assert.equal(
  escapeHtml('<script>alert("xss")</script>'),
  '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
);
console.log('case5 ok (escapeHtml)');

// 6) sanitizeHeaderValue strips CRLF and tabs (CRLF-injection mitigation).
assert.equal(
  sanitizeHeaderValue('Hello\r\nBcc: attacker@example.com'),
  'Hello Bcc: attacker@example.com'
);
console.log('case6 ok (sanitizeHeaderValue)');

// 7) applyCorsAllowlist sets the right header for an allowed origin.
{
  const res = mkRes();
  applyCorsAllowlist({ headers: { origin: 'https://www.coconoto.africa' } }, res);
  assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://www.coconoto.africa');
  console.log('case7 ok (allowed origin)');
}

// 8) applyCorsAllowlist rejects unknown origins.
{
  const res = mkRes();
  applyCorsAllowlist({ headers: { origin: 'https://evil.example' } }, res);
  assert.notEqual(res.headers['Access-Control-Allow-Origin'], 'https://evil.example');
  console.log('case8 ok (evil origin not echoed)');
}

console.log('all shared-auth smoke tests passed');
