import { readFileSync, writeFileSync } from 'node:fs';
const content = readFileSync('C:/Users/user/Documents/GitHub/coconoto_b2b2c/docs/security-audit-2026-08-17.fixes.md', 'utf8');
const flags = {
  v2row: content.includes('20260818000005_lock_remaining_unrestricted_tables_v2.sql'),
  superseded: content.includes('SUPERSEDED by v2 below; do not run this'),
  outScope: content.includes('RLS lockdowns now ship in `20260818000005_lock_remaining_unrestricted_tables_v2.sql`'),
  len: content.length
};
writeFileSync('C:/Users/user/Documents/GitHub/coconoto_b2b2c/_doc_check.json', JSON.stringify(flags), 'utf8');