import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, ...data } = req.body;

    // Route to appropriate handler based on action
    switch (action) {
      case 'buyer-login':
        return await handleBuyerLogin(data, res);
      case 'buyer-signup':
        return await handleBuyerSignup(data, res);
      case 'vendor-login':
        return await handleVendorLogin(data, res);
      case 'vendor-signup':
        return await handleVendorSignup(data, res);
      case 'admin-login':
        return await handleAdminLogin(data, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('❌ Auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

// Buyer Login
async function handleBuyerLogin(data, res) {
  const { email, password } = data;
  console.log('🔐 Buyer login attempt:', email);

  const { data: buyer, error: fetchError } = await supabase
    .from('buyers')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (fetchError || !buyer) {
    console.log('❌ Buyer not found');
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  const passwordMatch = await bcrypt.compare(password, buyer.password_hash);

  if (!passwordMatch) {
    console.log('❌ Invalid password');
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  const { password_hash, ...buyerData } = buyer;
  console.log('✅ Buyer login successful');
  return res.status(200).json({
    success: true,
    buyer: buyerData
  });
}

// Buyer Signup
async function handleBuyerSignup(data, res) {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    address,
    city,
    state,
    country,
    postal_code
  } = data;

  console.log('📝 Buyer signup attempt:', email);

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: buyer, error: insertError } = await supabase
    .from('buyers')
    .insert([{
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      postal_code: postal_code || null
    }])
    .select()
    .single();

  if (insertError) {
    console.error('❌ Buyer signup error:', insertError);
    
    if (insertError.message.includes('duplicate') || insertError.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Signup failed'
    });
  }

  const { password_hash, ...buyerData } = buyer;
  console.log('✅ Buyer signup successful');
  return res.status(201).json({
    success: true,
    buyer: buyerData
  });
}

// Vendor Login
async function handleVendorLogin(data, res) {
  const { email, password } = data;
  console.log('🔐 Vendor login attempt:', email);

  const { data: vendor, error: fetchError } = await supabase
    .from('vendors')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (fetchError || !vendor) {
    console.log('❌ Vendor not found');
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  const passwordMatch = await bcrypt.compare(password, vendor.password_hash);

  if (!passwordMatch) {
    console.log('❌ Invalid password');
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  const { password_hash, ...vendorData } = vendor;
  console.log('✅ Vendor login successful');
  return res.status(200).json({
    success: true,
    vendor: vendorData
  });
}

// Vendor Signup
async function handleVendorSignup(data, res) {
  const {
    email,
    password,
    business_name,
    contact_name,
    phone,
    address,
    description
  } = data;

  console.log('📝 Vendor signup attempt:', email);

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: vendor, error: insertError } = await supabase
    .from('vendors')
    .insert([{
      email,
      password_hash: passwordHash,
      business_name,
      contact_name,
      phone: phone || null,
      address: address || null,
      description: description || null
    }])
    .select()
    .single();

  if (insertError) {
    console.error('❌ Vendor signup error:', insertError);
    
    if (insertError.message.includes('duplicate') || insertError.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Signup failed'
    });
  }

  const { password_hash, ...vendorData } = vendor;
  console.log('✅ Vendor signup successful');
  return res.status(201).json({
    success: true,
    vendor: vendorData
  });
}

// Admin Login
async function handleAdminLogin(data, res) {
  const { password } = data;
  const adminPassword = process.env.ADMIN_PASSWORD || 'COCO1234';

  console.log('🔐 Admin login attempt');

  if (password === adminPassword) {
    console.log('✅ Admin login successful');
    return res.status(200).json({
      success: true,
      message: 'Login successful'
    });
  } else {
    console.log('❌ Admin login failed - invalid password');
    return res.status(401).json({
      success: false,
      error: 'Invalid password'
    });
  }
}
