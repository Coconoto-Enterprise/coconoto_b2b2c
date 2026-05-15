// Local development API server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Admin login endpoint
app.post('/api/admin-login', (req, res) => {
  console.log('🔐 Admin login attempt (local dev)');
  
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'COCO1234';
  
  console.log('📝 Received password:', password);
  console.log('📝 Expected password:', adminPassword);

  if (password === adminPassword) {
    console.log('✅ Admin login successful');
    return res.json({
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
});

// Consolidated data endpoint (mock for local dev)
app.get('/api/data', (req, res) => {
  const type = req.query.type || 'all-data';
  
  if (type === 'emails') {
    console.log('📧 Fetching emails (local dev - mock data)');
    
    const mockEmails = [
      {
        id: '1',
        to: ['customer@example.com'],
        from: 'support@coconoto.africa',
        subject: 'Welcome to Coconoto',
        created_at: new Date().toISOString(),
        last_event: 'delivered',
        html: '<p>Welcome to Coconoto! Thank you for your interest.</p>'
      },
      {
        id: '2', 
        to: ['coconotoenterprise@gmail.com'],
        from: 'team@coconoto.africa',
        subject: 'New Customer Inquiry',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        last_event: 'delivered',
        html: '<p>You have received a new customer inquiry.</p>'
      }
    ];

    return res.json({
      success: true,
      emails: mockEmails
    });
  }

  if (type === 'orders') {
    console.log('📦 Fetching orders (local dev - mock data)');
    
    const mockOrders = [
      {
        id: '1',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        product_type: 'Coconut Oil',
        quantity: 5,
        status: 'completed',
        created_at: new Date().toISOString(),
        total_amount: 125.50
      },
      {
        id: '2',
        customer_name: 'Jane Smith', 
        customer_email: 'jane@example.com',
        product_type: 'Coconut Fiber',
        quantity: 10,
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        total_amount: 89.99
      }
    ];

    return res.json({
      success: true,
      orders: mockOrders
    });
  }

  // Default: all-data
  console.log('📊 Fetching all data (local dev - mock data)');
  res.json({
    success: true,
    data: {
      bookEventRequests: [],
      investmentInquiries: [],
      machineOrders: [],
      productOrders: [],
      serviceContacts: [],
      toxicResults: [],
      waitlist: [],
      huskSaleRequests: []
    },
    total_records: 0,
    timestamp: new Date().toISOString()
  });
});

// Send custom email endpoint (mock for local dev)
app.post('/api/send-custom-email', (req, res) => {
  console.log('📤 Sending custom email (local dev - mock)');
  console.log('Email data:', req.body);
  
  const { to, subject, message } = req.body;
  
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Simulate email sending
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Email sent successfully (mock)',
      emailId: 'mock-' + Date.now()
    });
  }, 1000);
});

// Vendor signup endpoint
app.post('/api/vendor-signup', async (req, res) => {
  console.log('👥 Vendor signup attempt (local dev)');
  
  try {
    const { email, password, business_name, contact_name, phone, address, description } = req.body;

    // Validate required fields
    if (!email || !password || !business_name || !contact_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, business name, and contact name are required' 
      });
    }

    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY' 
      });
    }

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

    console.log('✅ Vendor signup successful:', vendorData.email);

    return res.status(200).json({ 
      success: true, 
      vendor: vendorData 
    });

  } catch (error) {
    console.error('❌ Vendor signup error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create vendor account' 
    });
  }
});

// Vendor login endpoint
app.post('/api/vendor-login', async (req, res) => {
  console.log('🔐 Vendor login attempt (local dev)');
  
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY' 
      });
    }

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

    console.log('✅ Vendor login successful:', vendorData.email);

    return res.status(200).json({ 
      success: true, 
      vendor: vendorData 
    });

  } catch (error) {
    console.error('❌ Vendor login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to login' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('  POST /api/admin-login');
  console.log('  GET  /api/data?type=emails');
  console.log('  GET  /api/data?type=orders');
  console.log('  GET  /api/data (default: all-data)');
  console.log('  POST /api/send-custom-email');
  console.log('  POST /api/vendor-signup');
  console.log('  POST /api/vendor-login');
});

export default app;