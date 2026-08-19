const { spawnSync } = require('child_process');
const root = 'C:\\Users\\user\\Documents\\GitHub\\coconoto_b2b2c';
const targets = [
  'api/_shared-auth.js', 'api/_attachment-magic.js', 'api/_marketplace-session.js',
  'api/auth.js', 'api/delete-record.js', 'api/update-status.js', 'api/update-price.js',
  'api/send-email.js', 'api/send-custom-email.js', 'api/cloudflare-analytics.js',
  'local-api-server.js',
];
const lines = [];
let fail = 0;
for (const rel of targets) {
  const r = spawnSync(process.execPath, ['--check', root + '\\' + rel], { encoding: 'utf8', shell: false });
  if (r.status !== 0) fail++;
  lines.push((r.status === 0 ? 'OK  ' : 'FAIL') + ' ' + rel);
}
require('fs').writeFileSync('C:\\Users\\user\\AppData\\Local\\Temp\\all-syntax.txt', lines.join('\n') + '\nFailures: ' + fail);
