const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = 'C:\\Users\\user\\Documents\\GitHub\\coconoto_b2b2c';

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

const results = targets.map((rel) => {
  const r = spawnSync(process.execPath, ['--check', path.join(root, rel)], { encoding: 'utf8', shell: false });
  return { file: rel, ok: r.status === 0, err: (r.stderr || '').slice(0, 500) };
});

fs.writeFileSync(path.join(root, 'syntax2.json'), JSON.stringify(results, null, 2));

// Also run smoke test
const testOut = spawnSync(process.execPath, [path.join(root, 'api/_shared-auth.test.mjs')], {
  encoding: 'utf8', shell: false, env: { ...process.env, API_MUTATIONS_KEY: 'unit-test-secret' },
});
fs.writeFileSync(path.join(root, 'test2.json'), JSON.stringify({
  ok: testOut.status === 0,
  exit: testOut.status,
  output: (testOut.stdout || '') + (testOut.stderr || ''),
}, null, 2));

console.log('VERIFY-DONE');
