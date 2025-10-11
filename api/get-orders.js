import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Missing Supabase environment variables - orders will be empty');
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Getting orders from Supabase...');
    console.log('Supabase URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
    console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
    
    // If Supabase is not configured, return empty orders
    if (!supabase) {
      console.log('❌ Supabase not configured - returning empty orders');
      return res.status(200).json({
        success: true,
        orders: []
      });
    }

    // Get orders from Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    console.log('📦 Supabase orders response:', { orders, error });

    if (error) {
      console.error('Supabase error:', error);
      // Return empty orders instead of error to prevent dashboard crash
      return res.status(200).json({
        success: true,
        orders: []
      });
    }

    return res.status(200).json({
      success: true,
      orders: orders || []
    });

  } catch (error) {
    console.error('Get orders error:', error);
    // Return empty orders instead of error to prevent dashboard crash
    return res.status(200).json({
      success: true,
      orders: []
    });
  }
}