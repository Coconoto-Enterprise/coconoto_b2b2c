// /api/update-price.js
// Updates a price column on a small allowlist of tables.
//
// SECURITY: requires the caller to present a valid `x-api-key` matching
// `API_MUTATIONS_KEY`. Fails closed (503) if the env var is unset.

import { createClient } from '@supabase/supabase-js';
import { requireApiKey, applyCorsAllowlist } from './_shared-auth.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('[update-price] Supabase credentials missing.');
}

const ALLOWED_TABLES = ['machine_orders', 'product_orders', 'book_event_requests'];

const PRICE_COLUMN = {
  machine_orders: 'total_price',
  product_orders: 'total_price',
  book_event_requests: 'price',
};

export default async function handler(req, res) {
  applyCorsAllowlist(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!requireApiKey(req, res)) return;

  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Pricing service unavailable' });
  }

  try {
    const { table, id, price } = req.body;

    if (!table || !id || price === undefined || price === null) {
      return res.status(400).json({ success: false, error: 'Missing required fields: table, id, and price' });
    }

    if (!ALLOWED_TABLES.includes(table)) {
      return res.status(400).json({ success: false, error: 'Invalid table name' });
    }

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(String(id))) {
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
        console.error(`[update-price] ${table}/${id}: ${error.message}`);
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
  } catch (error) {
    console.error('[update-price] unexpected error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
