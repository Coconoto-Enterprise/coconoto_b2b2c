// /api/update-status.js
// Updates the status of an item in a specified table.
//
// SECURITY: requires the caller to present a valid `x-api-key` matching
// `API_MUTATIONS_KEY`. Fails closed (503) if the env var is unset.

import { createClient } from '@supabase/supabase-js';
import { requireApiKey, applyCorsAllowlist } from './_shared-auth.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ALLOWED_TABLES = [
  'book_event_requests',
  'machine_orders',
  'product_orders',
  'service_contacts',
  'husk_sale_requests',
];

const ALLOWED_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'completed', 'archived'];

export default async function handler(req, res) {
  if (!applyCorsAllowlist(req, res)) {
    if (req.method === 'OPTIONS') return res.status(204).end();
  }
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireApiKey(req, res)) return;

  const { table, id, status } = req.body;
  if (!table || !id || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }

  if (!ALLOWED_STATUSES.includes(String(status))) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(String(id))) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id);

  if (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[update-status] ${table}/${id}: ${error.message}`);
      return res.status(500).json({ error: 'Update failed' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
