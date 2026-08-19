import { rmSync, existsSync } from 'node:fs';

const files = [
  'read-doc.mjs', 'probe.mjs', 'probe2.mjs', 'probe3.mjs', 'probe4.mjs',
  'probe5.mjs', 'probe6.mjs', 'probe7.mjs', 'probe8.mjs',
  'apply-doc-edits.mjs', 'verify-doc.mjs', 'status-check.mjs',
  'doc-dump.txt', '_dump.json', '_inspect.json', '_full_dump.json',
  '_tail_dump.json', '_db_chunks.json', '_verify.json', '_status.txt',
  '_readtest.txt', 'zebra_alpha_001.txt', '_fixes_root.md',
  'docs/_fixes_copy.md',
];
const removed = [], missing = [];
for (const f of files) {
  const p = 'C:/Users/user/Documents/GitHub/coconoto_b2b2c/' + f;
  if (existsSync(p)) { rmSync(p); removed.push(f); }
  else { missing.push(f); }
}
const chunks = [];
for (let i = 0; i < 10; i++) {
  const f = `_chunk_${String(i).padStart(2, '0')}.json`;
  const p = 'C:/Users/user/Documents/GitHub/coconoto_b2b2c/' + f;
  if (existsSync(p)) { rmSync(p); removed.push(f); }
}
import { writeFileSync } from 'node:fs';
writeFileSync('C:/Users/user/Documents/GitHub/coconoto_b2b2c/_cleanup-status.txt',
  `removed(${removed.length}): ${removed.join(', ')}\nmissing: ${missing.join(', ')}`, 'utf8');
console.log('done');