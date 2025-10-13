import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Missing Supabase environment variables');
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase not configured' 
    });
  }

  try {
    const { table, id, price } = req.body;

    if (!table || !id || price === undefined || price === null) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: table, id, and price' 
      });
    }

    // Validate table name for security
    const allowedTables = ['machine_orders', 'product_orders', 'book_event_requests'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid table name' 
      });
    }

    // Validate price
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid price value' 
      });
    }

    console.log(`🔄 Updating price in ${table} for ID ${id} to ₦${priceValue}`);

    // Update the price based on table type
    let updateData = {};
    let priceColumn = '';

    if (table === 'machine_orders') {
      priceColumn = 'total_price';
      updateData = { total_price: priceValue };
    } else if (table === 'product_orders') {
      priceColumn = 'total_price';
      updateData = { total_price: priceValue };
    } else if (table === 'book_event_requests') {
      priceColumn = 'price';
      updateData = { price: priceValue };
    }

    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`❌ Error updating ${table}:`, error);
      return res.status(500).json({ 
        success: false, 
        error: `Failed to update price: ${error.message}` 
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Record not found' 
      });
    }

    console.log(`✅ Successfully updated price for ${table} ID ${id}`);
    
    return res.status(200).json({
      success: true,
      message: `Price updated successfully to ₦${priceValue.toLocaleString()}`,
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Update price error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}