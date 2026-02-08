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
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
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

    // Get vendor by email
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !vendor) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, vendor.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (!vendor.is_active) {
      return res.status(403).json({ 
        success: false, 
        error: 'Account is deactivated. Please contact support.' 
      });
    }

    // Remove password hash from response
    const { password_hash, ...vendorData } = vendor;

    return res.status(200).json({ 
      success: true, 
      vendor: vendorData 
    });

  } catch (error) {
    console.error('Vendor login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to login' 
    });
  }
};
