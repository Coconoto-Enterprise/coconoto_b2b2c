import { getMarketplaceSupabase, requireSession } from './_marketplace-session.js';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PROFILE_FIELDS = ['first_name', 'last_name', 'phone', 'address', 'city', 'state', 'country', 'postal_code'];
const PRODUCT_FIELDS = ['product_name', 'description', 'category', 'price', 'unit', 'stock_quantity', 'image_url', 'is_active'];

const pick = (input, fields) => fields.reduce((out, field) => {
  if (Object.prototype.hasOwnProperty.call(input || {}, field)) out[field] = input[field];
  return out;
}, {});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const action = req.method === 'GET' ? req.query.action : req.body?.action;
    const data = req.method === 'GET' ? req.query : req.body || {};
    const supabase = getMarketplaceSupabase();

    if (action === 'products') {
      const { data: products, error } = await supabase
        .from('vendor_products')
        .select('*, vendor:vendors(business_name, contact_name, phone, email, is_verified)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, products: products || [] });
    }

    if (action === 'buyer-dashboard') {
      const session = requireSession(req, res, 'buyer');
      if (!session) return;
      const [{ data: buyer, error: buyerError }, { data: orders, error: orderError }] = await Promise.all([
        supabase.from('buyers').select('id, email, first_name, last_name, phone, address, city, state, country, postal_code, is_active, created_at, updated_at').eq('id', session.id).eq('is_active', true).single(),
        supabase.from('buyer_order_history').select('*').eq('buyer_id', session.id).order('created_at', { ascending: false }),
      ]);
      if (buyerError) return res.status(401).json({ success: false, error: 'Buyer account is unavailable' });
      if (orderError) throw orderError;
      return res.status(200).json({ success: true, buyer, orders: orders || [] });
    }

    if (action === 'buyer-profile-update') {
      const session = requireSession(req, res, 'buyer');
      if (!session) return;
      const updates = pick(data.updates, PROFILE_FIELDS);
      if (!updates.first_name?.trim() || !updates.last_name?.trim()) {
        return res.status(400).json({ success: false, error: 'First and last name are required' });
      }
      const { data: buyer, error } = await supabase
        .from('buyers').update(updates).eq('id', session.id)
        .select('id, email, first_name, last_name, phone, address, city, state, country, postal_code, is_active, created_at, updated_at').single();
      if (error) throw error;
      return res.status(200).json({ success: true, buyer });
    }

    if (action === 'buyer-order-create') {
      const session = requireSession(req, res, 'buyer');
      if (!session) return;
      const quantity = Number.parseInt(data.quantity, 10);
      if (!data.productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, error: 'A valid product and quantity are required' });
      }
      const { data: order, error } = await supabase.rpc('create_authenticated_buyer_order', {
        p_buyer_id: session.id,
        p_product_id: data.productId,
        p_quantity: quantity,
        p_delivery_address: data.deliveryAddress || null,
        p_notes: data.notes || null,
      });
      if (error) return res.status(400).json({ success: false, error: error.message || 'Unable to place order' });
      return res.status(201).json({ success: true, order });
    }

    if (action === 'vendor-dashboard') {
      const session = requireSession(req, res, 'vendor');
      if (!session) return;
      const [{ data: vendor, error: vendorError }, { data: products, error: productsError }, { data: orders, error: ordersError }] = await Promise.all([
        supabase.from('vendors').select('id, email, business_name, contact_name, phone, address, description, logo_url, is_verified, is_active, created_at, updated_at').eq('id', session.id).eq('is_active', true).single(),
        supabase.from('vendor_products').select('*').eq('vendor_id', session.id).order('created_at', { ascending: false }),
        supabase.from('vendor_orders').select('*, product:vendor_products(product_name, category, unit, price, image_url)').eq('vendor_id', session.id).order('created_at', { ascending: false }),
      ]);
      if (vendorError) return res.status(401).json({ success: false, error: 'Vendor account is unavailable' });
      if (productsError || ordersError) throw productsError || ordersError;
      return res.status(200).json({ success: true, vendor, products: products || [], orders: orders || [] });
    }

    if (action === 'vendor-product-save') {
      const session = requireSession(req, res, 'vendor');
      if (!session) return;
      const product = pick(data.product, PRODUCT_FIELDS);
      product.price = Number(product.price);
      product.stock_quantity = Number.parseInt(product.stock_quantity, 10);
      if (!product.product_name?.trim() || !product.description?.trim() || !(product.price > 0) || product.stock_quantity < 0) {
        return res.status(400).json({ success: false, error: 'Complete all required product fields with valid values' });
      }
      let query;
      if (data.productId) {
        query = supabase.from('vendor_products').update(product).eq('id', data.productId).eq('vendor_id', session.id).select().single();
      } else {
        query = supabase.from('vendor_products').insert([{ ...product, vendor_id: session.id }]).select().single();
      }
      const { data: saved, error } = await query;
      if (error) throw error;
      return res.status(data.productId ? 200 : 201).json({ success: true, product: saved });
    }

    if (action === 'vendor-product-delete') {
      const session = requireSession(req, res, 'vendor');
      if (!session) return;
      const { error } = await supabase.from('vendor_products').delete().eq('id', data.productId).eq('vendor_id', session.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === 'vendor-order-status') {
      const session = requireSession(req, res, 'vendor');
      if (!session) return;
      if (!ORDER_STATUSES.includes(data.status)) return res.status(400).json({ success: false, error: 'Invalid order status' });
      const { error } = await supabase.from('vendor_orders').update({ status: data.status }).eq('id', data.orderId).eq('vendor_id', session.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ success: false, error: 'Invalid marketplace action' });
  } catch (error) {
    console.error('Marketplace API error:', error);
    return res.status(500).json({ success: false, error: 'Marketplace request failed' });
  }
}
