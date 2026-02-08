const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, business_name, contact_name, phone, address, description } = req.body;

    // Validate required fields
    if (!email || !password || !business_name || !contact_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, business name, and contact name are required' 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error' 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if vendor already exists
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('email')
      .eq('email', email)
      .single();

    if (existingVendor) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new vendor
    const { data: newVendor, error } = await supabase
      .from('vendors')
      .insert([{
        email,
        password_hash,
        business_name,
        contact_name,
        phone: phone || null,
        address: address || null,
        description: description || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }

    // Remove password hash from response
    const { password_hash: _, ...vendorData } = newVendor;

    return res.status(200).json({ 
      success: true, 
      vendor: vendorData 
    });

  } catch (error) {
    console.error('Vendor signup error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create vendor account' 
    });
  }
};
