import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const node = 'C:/Users/user/.workbuddy/binaries/node/versions/22.22.2/node.exe';
const results = {};
for (const f of ['api/send-email.js']) {
  try {
    execFileSync(node, ['--check', 'C:/Users/user/Documents/GitHub/coconoto_b2b2c/' + f], { stdio: 'pipe' });
    results[f] = 'SYNTAX OK';
  } catch (e) {
    results[f] = 'SYNTAX FAIL: ' + (e.stderr ? e.stderr.toString().slice(0, 500) : String(e.message));
  }
}
// SQL files: balance check + presence of required statements
for (const f of ['supabase/migrations/20260818000006_lock_email_sender_config_rls.sql']) {
  const c = readFileSync('C:/Users/user/Documents/GitHub/coconoto_b2b2c/' + f, 'utf8');
  results[f] = {
    hasEnable: c.includes('ENABLE ROW LEVEL SECURITY'),
    hasPolicy: c.includes('CREATE POLICY "Service role manages email_sender_config"'),
    hasRevokeAnon: c.includes('REVOKE ALL ON public.email_sender_config FROM anon'),
    hasRevokeAuth: c.includes('REVOKE ALL ON public.email_sender_config FROM authenticated'),
    hasGrantService: c.includes('GRANT  ALL ON public.email_sender_config TO service_role'),
    hasDoBlock: c.includes('DO $$'),
    endsWithEnd: c.trim().endsWith('END $$;'),
  };
}
writeFileSync('C:/Users/user/Documents/GitHub/coconoto_b2b2c/_syntax.json', JSON.stringify(results, null, 2), 'utf8');