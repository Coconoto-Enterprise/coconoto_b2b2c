// /api/delete-record.js
// Deletes a record from a specified table in Supabase.
//
// SECURITY: requires the caller to present a valid `x-api-key` matching
// `API_MUTATIONS_KEY`. Fails closed (503) if the env var is unset so we
// never silently fall back to "open to everyone".

import { createClient } from '@supabase/supabase-js';
import { requireApiKey, applyCorsAllowlist } from './_shared-auth.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (!applyCorsAllowlist(req, res)) {
    // Stale `Origin` from a non-allowlisted site — block preflight too.
    if (req.method === 'OPTIONS') return res.status(204).end();
  }
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireApiKey(req, res)) return;

  const { table, id } = req.body;
  if (!table || !id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Strict allowlist of tables — never propagate the caller-provided
  // `table` value into Supabase without filtering it first.
  const allowedTables = [
    'book_event_requests',
    'machine_orders',
    'product_orders',
    'service_contacts',
    'husk_sale_requests',
    'waitlist',
  ];
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }

  // ID must be a UUID — refuses anything else.
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(String(id))) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    // Don't echo the raw Supabase error to the client in production.
    if (process.env.NODE_ENV === 'production') {
      console.error(`[delete-record] ${table}/${id}: ${error.message}`);
      return res.status(500).json({ error: 'Delete failed' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, message: `Record deleted from ${table}` });
}
