const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = 'C:\\Users\\user\\Documents\\GitHub\\coconoto_b2b2c';
process.chdir(root);

const targets = [
  'api/_shared-auth.js',
  'api/_attachment-magic.js',
  'api/_shared-auth.test.mjs',
  'api/auth.js',
  'api/delete-record.js',
  'api/update-status.js',
  'api/update-price.js',
  'api/send-email.js',
  'api/send-custom-email.js',
  'api/cloudflare-analytics.js',
  'local-api-server.js',
];

const lines = [];
for (const rel of targets) {
  const r = spawnSync(process.execPath, ['--check', path.join(root, rel)], { encoding: 'utf8', shell: false });
  lines.push((r.status === 0 ? 'OK   ' : 'FAIL ') + rel + (r.stderr ? '\n    ' + r.stderr.slice(0, 400) : ''));
}

const out = '== syntax check ==\n' + lines.join('\n');

// Smoke test
const test = spawnSync(process.execPath, [path.join(root, 'api/_shared-auth.test.mjs')], {
  encoding: 'utf8', shell: false, env: { ...process.env, API_MUTATIONS_KEY: 'unit-test-secret' },
});
const fullOut = out + '\n\n== smoke test (exit ' + test.status + ') ==\n' + (test.stdout || '') + (test.stderr || '');

fs.writeFileSync(path.join(root, 'verify-final.txt'), fullOut);
