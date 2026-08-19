import { rmSync, existsSync, writeFileSync } from 'node:fs';
const files = ['_doc6.mjs','_status6.txt','_memcheck6.mjs','_memtail.txt'];
const removed = [], missing = [];
for (const f of files) {
  const p = 'C:/Users/user/Documents/GitHub/coconoto_b2b2c/' + f;
  if (existsSync(p)) { rmSync(p); removed.push(f); } else { missing.push(f); }
}
writeFileSync('C:/Users/user/Documents/GitHub/coconoto_b2b2c/_rm.txt', `removed: ${removed.join(',')} | missing: ${missing.join(',')}`, 'utf8');