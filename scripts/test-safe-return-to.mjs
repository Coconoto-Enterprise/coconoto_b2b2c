/**
 * Regression test for safeReturnTo — the open-redirect guard used by every
 * post-login navigation.
 *
 * Run: node scripts/test-safe-return-to.mjs
 *
 * No test runner: the repo has none, and this is one pure function. esbuild is
 * already present (Vite dependency) so the TypeScript source is compiled in
 * memory rather than duplicated here — the test can never drift from the code.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
// Vite is already a devDependency and bundles esbuild; using its own transform
// avoids depending on a nested node_modules/esbuild path.
import { transformWithEsbuild } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(here, '../src/lib/safeReturnTo.ts'), 'utf8');
const { code: js } = await transformWithEsbuild(source, 'safeReturnTo.ts', {
  loader: 'ts',
  format: 'esm',
});

const { safeReturnTo } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
);

const FALLBACK = '/cococonnect';

/** [input, expected, why] */
const cases = [
  // ── Allowed: ordinary site-relative paths ────────────────────────────────
  ['/cococonnect', '/cococonnect', 'plain path'],
  ['/buyer-dashboard', '/buyer-dashboard', 'plain path'],
  ['/profile/links', '/profile/links', 'nested path'],
  ['/cococonnect?category=Nuts', '/cococonnect?category=Nuts', 'query string'],
  ['/terms-of-service#section-4', '/terms-of-service#section-4', 'hash'],
  ['/blog/post-1', '/blog/post-1', 'colon-free path'],
  ['  /buyer-dashboard  ', '/buyer-dashboard', 'surrounding whitespace trimmed'],

  // ── Rejected: CVE-2025-68470 bypass ─────────────────────────────────────
  ['/\\evil.com', FALLBACK, 'backslash normalised to // by the URL parser'],
  ['/\\\\evil.com', FALLBACK, 'double backslash'],
  ['/\\/evil.com', FALLBACK, 'mixed slash/backslash'],

  // ── Rejected: protocol-relative and absolute URLs ───────────────────────
  ['//evil.com', FALLBACK, 'protocol-relative'],
  ['///evil.com', FALLBACK, 'triple slash'],
  ['https://evil.com', FALLBACK, 'absolute https'],
  ['http://evil.com', FALLBACK, 'absolute http'],
  ['javascript:alert(1)', FALLBACK, 'javascript scheme'],
  ['/javascript:alert(1)', FALLBACK, 'scheme hidden after the leading slash'],
  ['data:text/html,<script>alert(1)</script>', FALLBACK, 'data URL'],

  // ── Rejected: control characters ────────────────────────────────────────
  // Trailing whitespace is trimmed and the remainder is still an internal
  // path, so it is allowed. Embedded control characters are not.
  ['/buyer-dashboard\n', '/buyer-dashboard', 'trailing newline trimmed to a safe path'],
  ['/buyer-dashboard\t', '/buyer-dashboard', 'trailing tab trimmed to a safe path'],
  ['/buyer-dash\nboard', FALLBACK, 'embedded newline'],
  ['/java\nscript:alert(1)', FALLBACK, 'scheme split by a newline'],
  ['/coco\u0000nect', FALLBACK, 'embedded NUL'],

  // ── Rejected: empty / missing ───────────────────────────────────────────
  [null, FALLBACK, 'absent param'],
  [undefined, FALLBACK, 'undefined param'],
  ['', FALLBACK, 'empty string'],
  ['   ', FALLBACK, 'whitespace only'],
  ['cococonnect', FALLBACK, 'relative path with no leading slash'],
];

let failed = 0;
for (const [input, expected, why] of cases) {
  const actual = safeReturnTo(input, FALLBACK);
  if (actual !== expected) {
    failed += 1;
    console.error(`✗ ${JSON.stringify(input)} → ${JSON.stringify(actual)} (want ${JSON.stringify(expected)}) — ${why}`);
  }
}

const total = cases.length;
if (failed) {
  console.error(`\n${failed}/${total} failed`);
  process.exit(1);
}
console.log(`✓ all ${total} safeReturnTo cases passed`);
