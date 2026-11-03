// /api/admin.js
// Consolidated admin mutation endpoint — merges the former delete-record,
// update-status, and update-price routes into a single serverless function
// so the deployment stays under Vercel's Hobby plan 12-function limit.
//
// Dispatch: ?action=delete-record | update-status | update-price
//
// SECURITY: input is strictly validated (table allowlist, UUID, status
// allowlist, price bounds). No shared-secret gate because browser callers
// cannot present x-api-key. Real dashboard auth is tracked as a follow-up
// in docs/security-audit-2026-08-17.fixes.md.

import { createClient } from '@supabase/supabase-js';
import { applyCorsAllowlist } from '../lib/shared-auth.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('[admin] Supabase credentials missing.');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DELETE_TABLES = [
  'book_event_requests',
  'machine_orders',
  'product_orders',
  'service_contacts',
  'husk_sale_requests',
  'waitlist',
];

const STATUS_TABLES = [
  'book_event_requests',
  'machine_orders',
  'product_orders',
  'service_contacts',
  'husk_sale_requests',
];

const ALLOWED_STATUSES = [
  'pending', 'confirmed', 'processing', 'shipped',
  'delivered', 'cancelled', 'completed', 'archived',
];

const PRICE_TABLES = ['machine_orders', 'product_orders', 'book_event_requests'];
const PRICE_COLUMN = {
  machine_orders: 'total_price',
  product_orders: 'total_price',
  book_event_requests: 'price',
};

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function deleteRecord(req, res) {
  const { table, id } = req.body;
  if (!table || !id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!DELETE_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }
  if (!UUID_RE.test(String(id))) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[admin:delete] ${table}/${id}: ${error.message}`);
      return res.status(500).json({ error: 'Delete failed' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, message: `Record deleted from ${table}` });
}

async function updateStatus(req, res) {
  const { table, id, status } = req.body;
  if (!table || !id || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!STATUS_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }
  if (!ALLOWED_STATUSES.includes(String(status))) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (!UUID_RE.test(String(id))) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { error } = await supabase.from(table).update({ status }).eq('id', id);

  if (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[admin:status] ${table}/${id}: ${error.message}`);
      return res.status(500).json({ error: 'Update failed' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}

async function updatePrice(req, res) {
  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Pricing service unavailable' });
  }

  const { table, id, price } = req.body;

  if (!table || !id || price === undefined || price === null) {
    return res.status(400).json({ success: false, error: 'Missing required fields: table, id, and price' });
  }
  if (!PRICE_TABLES.includes(table)) {
    return res.status(400).json({ success: false, error: 'Invalid table name' });
  }
  if (!UUID_RE.test(String(id))) {
    return res.status(400).json({ success: false, error: 'Invalid id' });
  }

  const priceValue = Number.parseFloat(price);
  if (!Number.isFinite(priceValue) || priceValue < 0 || priceValue > 1_000_000_000) {
    return res.status(400).json({ success: false, error: 'Invalid price value' });
  }

  const priceColumn = PRICE_COLUMN[table];
  const updateData = { [priceColumn]: priceValue };

  const { data, error } = await supabase
    .from(table)
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[admin:price] ${table}/${id}: ${error.message}`);
      return res.status(500).json({ success: false, error: 'Pricing update failed' });
    }
    return res.status(500).json({ success: false, error: `Failed to update price: ${error.message}` });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  return res.status(200).json({
    success: true,
    message: `Price updated successfully to ${priceValue.toLocaleString('en-NG')}`,
    data: data[0],
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (!applyCorsAllowlist(req, res)) {
    if (req.method === 'OPTIONS') return res.status(204).end();
  }
  if (req.method === 'OPTIONS') return res.status(204).end();

  const action = req.query.action;

  if (action === 'delete-record') {
    if (req.method !== 'DELETE' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return deleteRecord(req, res);
  }

  if (action === 'update-status') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return updateStatus(req, res);
  }

  if (action === 'update-price') {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    try {
      return updatePrice(req, res);
    } catch (error) {
      console.error('[admin:price] unexpected error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  return res.status(400).json({ error: 'Missing or invalid ?action= parameter' });
}
