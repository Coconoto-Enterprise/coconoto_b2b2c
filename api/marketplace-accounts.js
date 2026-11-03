// /api/marketplace-accounts.js
// Admin endpoint for the Vintage Dashboard to manage marketplace accounts
// (buyers + vendors). Supports listing with detail, soft-delete (deactivate),
// and hard-delete.
//
// SECURITY: This endpoint reads/writes the buyers and vendors tables using
// the Supabase service-role key. It is gated by the same CORS allowlist as
// the other admin endpoints. Real dashboard auth is tracked separately.

import { applyCorsAllowlist } from '../lib/shared-auth.js';
import { getMarketplaceSupabase } from '../lib/marketplace-session.js';

export default async function handler(req, res) {
  applyCorsAllowlist(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const action = req.method === 'GET' ? req.query.action : req.body?.action;

    switch (action) {
      case 'list':
        return await handleListAccounts(res);
      case 'detail':
        return await handleAccountDetail(req, res);
      case 'deactivate':
        return await handleDeactivateAccount(req, res);
      case 'reactivate':
        return await handleReactivateAccount(req, res);
      case 'delete':
        return await handleDeleteAccount(req, res);
      default:
        return res.status(400).json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    console.error('[marketplace-accounts] Error:', error.message);
    return res.status(500).json({ success: false, error: 'Request failed: ' + error.message });
  }
}

// ── List all accounts (buyers + vendors) with summary info ──────────────
async function handleListAccounts(res) {
  const supabase = getMarketplaceSupabase();

  // Fetch buyers (exclude password_hash)
  const { data: buyers, error: buyersError } = await supabase
    .from('buyers')
    .select(`
      id, email, first_name, last_name, phone, address, city, state, country,
      postal_code, is_active, clerk_user_id, created_at, updated_at
    `)
    .order('created_at', { ascending: false });

  if (buyersError) {
    console.error('[marketplace-accounts] buyers fetch error:', buyersError.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch buyer accounts' });
  }

  // Fetch vendors (exclude password_hash)
  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .select(`
      id, email, business_name, contact_name, phone, address, description,
      logo_url, is_verified, is_active, created_at, updated_at
    `)
    .order('created_at', { ascending: false });

  if (vendorsError) {
    console.error('[marketplace-accounts] vendors fetch error:', vendorsError.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch vendor accounts' });
  }

  // Count orders per buyer and products per vendor in parallel
  const [buyerOrderCounts, vendorProductCounts, vendorOrderCounts] = await Promise.all([
    countGrouped(supabase, 'buyer_order_history', 'buyer_id', buyers),
    countGrouped(supabase, 'vendor_products', 'vendor_id', vendors),
    countGrouped(supabase, 'vendor_orders', 'vendor_id', vendors),
  ]);

  const formattedBuyers = (buyers || []).map((b) => ({
    ...b,
    account_type: 'buyer',
    display_name: `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.email,
    order_count: buyerOrderCounts[b.id] || 0,
    is_seller: false,
  }));

  const formattedVendors = (vendors || []).map((v) => ({
    ...v,
    account_type: 'vendor',
    display_name: v.business_name || v.contact_name || v.email,
    product_count: vendorProductCounts[v.id] || 0,
    order_count: vendorOrderCounts[v.id] || 0,
    is_seller: true,
  }));

  return res.status(200).json({
    success: true,
    buyers: formattedBuyers,
    vendors: formattedVendors,
    total: formattedBuyers.length + formattedVendors.length,
  });
}

// Helper: count rows per group (e.g. orders per buyer_id) in a single query
async function countGrouped(supabase, table, groupCol, items) {
  if (!items || items.length === 0) return {};
  const ids = items.map((i) => i.id);
  const { data, error } = await supabase
    .from(table)
    .select(groupCol)
    .in(groupCol, ids);

  if (error || !data) {
    console.warn(`[marketplace-accounts] count ${table}:`, error?.message);
    return {};
  }

  const counts = {};
  for (const row of data) {
    const key = row[groupCol];
    if (key) counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

// ── Account detail (orders, products, etc.) ─────────────────────────────
async function handleAccountDetail(req, res) {
  const supabase = getMarketplaceSupabase();
  const { accountType, accountId } = req.method === 'GET' ? req.query : req.body;

  if (!accountType || !accountId) {
    return res.status(400).json({ success: false, error: 'accountType and accountId are required' });
  }

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(String(accountId))) {
    return res.status(400).json({ success: false, error: 'Invalid account ID' });
  }

  if (accountType === 'buyer') {
    const [{ data: buyer, error: bErr }, { data: orders, error: oErr }] = await Promise.all([
      supabase.from('buyers')
        .select('id, email, first_name, last_name, phone, address, city, state, country, postal_code, is_active, clerk_user_id, created_at, updated_at')
        .eq('id', accountId).single(),
      supabase.from('buyer_order_history').select('*').eq('buyer_id', accountId).order('created_at', { ascending: false }),
    ]);

    if (bErr) return res.status(404).json({ success: false, error: 'Buyer not found' });
    if (oErr) console.warn('[marketplace-accounts] buyer orders:', oErr.message);

    // Check if buyer is also a vendor
    const { data: linkedVendor } = await supabase
      .from('vendors')
      .select('id, business_name, is_active')
      .eq('email', buyer.email)
      .maybeSingle();

    return res.status(200).json({
      success: true,
      account: { ...buyer, account_type: 'buyer', linked_vendor: linkedVendor || null },
      orders: orders || [],
    });
  }

  if (accountType === 'vendor') {
    const [{ data: vendor, error: vErr }, { data: products, error: pErr }, { data: orders, error: voErr }] = await Promise.all([
      supabase.from('vendors')
        .select('id, email, business_name, contact_name, phone, address, description, logo_url, is_verified, is_active, created_at, updated_at')
        .eq('id', accountId).single(),
      supabase.from('vendor_products').select('*').eq('vendor_id', accountId).order('created_at', { ascending: false }),
      supabase.from('vendor_orders').select('*, product:vendor_products(product_name, category, price)').eq('vendor_id', accountId).order('created_at', { ascending: false }),
    ]);

    if (vErr) return res.status(404).json({ success: false, error: 'Vendor not found' });
    if (pErr) console.warn('[marketplace-accounts] vendor products:', pErr.message);
    if (voErr) console.warn('[marketplace-accounts] vendor orders:', voErr.message);

    return res.status(200).json({
      success: true,
      account: { ...vendor, account_type: 'vendor' },
      products: products || [],
      orders: orders || [],
    });
  }

  return res.status(400).json({ success: false, error: 'Invalid accountType' });
}

// ── Deactivate (soft delete) ─────────────────────────────────────────────
async function handleDeactivateAccount(req, res) {
  const supabase = getMarketplaceSupabase();
  const { accountType, accountId } = req.body;

  if (!accountType || !accountId) {
    return res.status(400).json({ success: false, error: 'accountType and accountId are required' });
  }

  const table = accountType === 'buyer' ? 'buyers' : accountType === 'vendor' ? 'vendors' : null;
  if (!table) {
    return res.status(400).json({ success: false, error: 'Invalid accountType' });
  }

  const { error } = await supabase
    .from(table)
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', accountId);

  if (error) {
    console.error('[marketplace-accounts] deactivate error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to deactivate account' });
  }

  // If deactivating a buyer who is also a vendor, deactivate the vendor too
  if (accountType === 'buyer') {
    const { data: buyer } = await supabase.from('buyers').select('email').eq('id', accountId).single();
    if (buyer?.email) {
      await supabase.from('vendors').update({ is_active: false }).eq('email', buyer.email);
    }
  }

  return res.status(200).json({ success: true, message: 'Account deactivated' });
}

// ── Reactivate ───────────────────────────────────────────────────────────
async function handleReactivateAccount(req, res) {
  const supabase = getMarketplaceSupabase();
  const { accountType, accountId } = req.body;

  if (!accountType || !accountId) {
    return res.status(400).json({ success: false, error: 'accountType and accountId are required' });
  }

  const table = accountType === 'buyer' ? 'buyers' : accountType === 'vendor' ? 'vendors' : null;
  if (!table) {
    return res.status(400).json({ success: false, error: 'Invalid accountType' });
  }

  const { error } = await supabase
    .from(table)
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq('id', accountId);

  if (error) {
    console.error('[marketplace-accounts] reactivate error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to reactivate account' });
  }

  return res.status(200).json({ success: true, message: 'Account reactivated' });
}

// ── Hard delete ──────────────────────────────────────────────────────────
async function handleDeleteAccount(req, res) {
  const supabase = getMarketplaceSupabase();
  const { accountType, accountId } = req.body;

  if (!accountType || !accountId) {
    return res.status(400).json({ success: false, error: 'accountType and accountId are required' });
  }

  const table = accountType === 'buyer' ? 'buyers' : accountType === 'vendor' ? 'vendors' : null;
  if (!table) {
    return res.status(400).json({ success: false, error: 'Invalid accountType' });
  }

  // Delete dependent records first to avoid FK violations
  if (accountType === 'buyer') {
    await supabase.from('buyer_order_history').delete().eq('buyer_id', accountId);
  } else {
    await supabase.from('vendor_orders').delete().eq('vendor_id', accountId);
    await supabase.from('vendor_products').delete().eq('vendor_id', accountId);
  }

  const { error } = await supabase.from(table).delete().eq('id', accountId);

  if (error) {
    console.error('[marketplace-accounts] delete error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to delete account: ' + error.message });
  }

  return res.status(200).json({ success: true, message: 'Account permanently deleted' });
}
