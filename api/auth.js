import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase only when needed
let supabase;

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

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

    // Validate action input
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

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
      case 'list-mail-users':
        return await handleListMailUsers(res);
      case 'create-mail-user':
        return await handleCreateMailUser(data, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed: ' + error.message
    });
  }
}

// Buyer Login
async function handleBuyerLogin(data, res) {
  const { email, password } = data;
  console.log('🔐 Buyer login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  try {
    const { data: buyer, error: fetchError } = await getSupabaseClient()
      .from('buyers')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (fetchError || !buyer) {
      console.log('❌ Buyer not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const passwordMatch = await bcrypt.compare(password, buyer.password_hash);

    if (!passwordMatch) {
      console.log('❌ Invalid password for buyer:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const { password_hash, ...buyerData } = buyer;
    console.log('✅ Buyer login successful:', email);
    return res.status(200).json({
      success: true,
      buyer: buyerData
    });
  } catch (error) {
    console.error('❌ Buyer login exception:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message
    });
  }
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

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: buyer, error: insertError } = await getSupabaseClient()
      .from('buyers')
      .insert([{
        email,
        password_hash: passwordHash,
        first_name: first_name || null,
        last_name: last_name || null,
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
        error: 'Signup failed: ' + insertError.message
      });
    }

    const { password_hash, ...buyerData } = buyer;
    console.log('✅ Buyer signup successful:', email);
    return res.status(201).json({
      success: true,
      buyer: buyerData
    });
  } catch (error) {
    console.error('❌ Buyer signup exception:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Signup failed: ' + error.message
    });
  }
}

// Vendor Login
async function handleVendorLogin(data, res) {
  const { email, password } = data;
  console.log('🔐 Vendor login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  try {
    const { data: vendor, error: fetchError } = await getSupabaseClient()
      .from('vendors')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (fetchError || !vendor) {
      console.log('❌ Vendor not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const passwordMatch = await bcrypt.compare(password, vendor.password_hash);

    if (!passwordMatch) {
      console.log('❌ Invalid password for vendor:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const { password_hash, ...vendorData } = vendor;
    console.log('✅ Vendor login successful:', email);
    return res.status(200).json({
      success: true,
      vendor: vendorData
    });
  } catch (error) {
    console.error('❌ Vendor login exception:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message
    });
  }
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

  // Validate required fields
  if (!email || !password || !business_name || !contact_name) {
    return res.status(400).json({
      success: false,
      error: 'Email, password, business name, and contact name are required'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: vendor, error: insertError } = await getSupabaseClient()
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
        error: 'Signup failed: ' + insertError.message
      });
    }

    const { password_hash, ...vendorData } = vendor;
    console.log('✅ Vendor signup successful:', email);
    return res.status(201).json({
      success: true,
      vendor: vendorData
    });
  } catch (error) {
    console.error('❌ Vendor signup exception:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Signup failed: ' + error.message
    });
  }
}

// Admin Login / Mail User Login
async function handleAdminLogin(data, res) {
  const { password } = data;

  console.log('🔐 Admin login attempt');

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required'
    });
  }

  try {
    const { data: mailUsers, error: fetchError } = await getSupabaseClient()
      .from('mail_users')
      .select('id, login_email, password_hash, sender_email, role, is_active')
      .eq('is_active', true);

    if (fetchError) {
      console.error('❌ Mail users fetch error:', fetchError);
      return res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }

    for (const user of mailUsers || []) {
      if (!user.password_hash) continue;
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (passwordMatch) {
        const { password_hash, ...userData } = user;
        console.log('✅ Mail user login successful:', user.login_email);
        return res.status(200).json({
          success: true,
          mailUser: userData
        });
      }
    }

    // Optional fallback admin password for super-admin access
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword && password === adminPassword) {
      console.log('✅ Super admin login successful');
      return res.status(200).json({
        success: true,
        mailUser: {
          id: 'super-admin',
          login_email: 'admin@coconoto.africa',
          sender_email: 'team@coconoto.africa',
          role: 'admin',
          is_active: true,
        }
      });
    }

    console.log('❌ Admin login failed - invalid password');
    return res.status(401).json({
      success: false,
      error: 'Invalid password'
    });
  } catch (error) {
    console.error('❌ Admin login exception:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message
    });
  }
}

async function handleListMailUsers(res) {
  try {
    const { data: users, error } = await getSupabaseClient()
      .from('mail_users')
      .select('id, login_email, sender_email, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Mail users list error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch mail users' });
    }

    return res.status(200).json({ success: true, mailUsers: users });
  } catch (error) {
    console.error('❌ Mail users list exception:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch mail users' });
  }
}

async function handleCreateMailUser(data, res) {
  const { login_email, password, sender_email, role } = data;

  if (!login_email || !password || !sender_email) {
    return res.status(400).json({
      success: false,
      error: 'Login email, password, and sender email are required'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const { data: createdUser, error: insertError } = await getSupabaseClient()
      .from('mail_users')
      .insert([{ login_email, sender_email, role: role || 'user', password_hash: passwordHash, is_active: true }])
      .select('id, login_email, sender_email, role, is_active, created_at, updated_at')
      .single();

    if (insertError) {
      console.error('❌ Create mail user error:', insertError);
      return res.status(500).json({ success: false, error: 'Failed to create mail user' });
    }

    return res.status(201).json({ success: true, mailUser: createdUser });
  } catch (error) {
    console.error('❌ Create mail user exception:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to create mail user' });
  }
}
