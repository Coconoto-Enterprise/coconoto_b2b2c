// Local development API server.
//
// Hardened so it cannot accidentally run in production with a fallback
// admin password, log credentials to stdout, or answer requests on the LAN.
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
const PORT = parseInt(process.env.LOCAL_API_PORT || '3001', 10);
const HOST = process.env.LOCAL_API_HOST || '127.0.0.1';

// Production guard: refuse to bind on 0.0.0.0 and refuse to run if no
// admin password is configured.
if (process.env.NODE_ENV === 'production' && (HOST === '0.0.0.0' || HOST === '::')) {
  console.error('[local-api-server] Refusing to bind to LAN-reachable address in production.');
  process.exit(1);
}

const getAdminPassword = () => {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    // Fail closed: never silently fall back to a known string.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_PASSWORD must be configured in production');
    }
    if (!process.env.ALLOW_DEV_FALLBACK_PASSWORD) {
      throw new Error('ADMIN_PASSWORD is not set. Set it in .env, or ALLOW_DEV_FALLBACK_PASSWORD=1 for local-only dev with a temporary password.');
    }
    console.warn('[local-api-server] ⚠️ Running with a dev fallback password (ALLOW_DEV_FALLBACK_PASSWORD=1). DO NOT use in production.');
    return 'COCO1234';
  }
  return pwd;
};

const ADMIN_PASSWORD = (() => {
  try {
    return getAdminPassword();
  } catch (err) {
    console.error(`[local-api-server] ${err.message}`);
    return null;
  }
})();

const allowedDevOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / curl with no Origin header.
    if (!origin) return callback(null, true);
    if (allowedDevOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by local-api-server'));
  },
  credentials: false,
}));
app.use(express.json());

const requireAdminPassword = (res) => {
  if (!ADMIN_PASSWORD) {
    res.status(503).json({ success: false, error: 'Admin login is not configured' });
    return false;
  }
  return true;
};

// Admin login endpoint
app.post('/api/admin-login', (req, res) => {
  console.log('[local-api-server] admin-login attempt');

  if (!requireAdminPassword(res)) return;

  const { password } = req.body;
  // Constant-time comparison to avoid timing oracles on the dev password.
  if (typeof password !== 'string' || password.length !== ADMIN_PASSWORD.length) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  if (mismatch !== 0) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  return res.json({ success: true, message: 'Login successful' });
});

// Generic auth endpoint with action routing
app.post('/api/auth', (req, res) => {
  const { action, password } = req.body;

  if (action === 'admin-login') {
    if (!requireAdminPassword(res)) return;
    if (typeof password !== 'string' || password.length !== ADMIN_PASSWORD.length) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
    let mismatch = 0;
    for (let i = 0; i < password.length; i++) {
      mismatch |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
    }
    if (mismatch !== 0) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
    return res.json({ success: true, message: 'Login successful' });
  }

  res.status(400).json({ success: false, error: 'Invalid action' });
});

// Consolidated data endpoint (mock for local dev)
app.get('/api/data', (req, res) => {
  const type = req.query.type || 'all-data';

  if (type === 'emails') {
    console.log('[local-api-server] serving mock emails');
    const mockEmails = [
      {
        id: '1',
        to: ['customer@example.com'],
        from: 'support@coconoto.africa',
        subject: 'Welcome to Coconoto',
        created_at: new Date().toISOString(),
        last_event: 'delivered',
        html: '<p>Welcome to Coconoto! Thank you for your interest.</p>',
      },
      {
        id: '2',
        to: ['coconotoenterprise@gmail.com'],
        from: 'team@coconoto.africa',
        subject: 'New Customer Inquiry',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        last_event: 'delivered',
        html: '<p>You have received a new customer inquiry.</p>',
      },
    ];
    return res.json({ success: true, emails: mockEmails });
  }

  if (type === 'orders') {
    console.log('[local-api-server] serving mock orders');
    const mockOrders = [
      {
        id: '1',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        product_type: 'Coconut Oil',
        quantity: 5,
        status: 'completed',
        created_at: new Date().toISOString(),
        total_amount: 125.5,
      },
      {
        id: '2',
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        product_type: 'Coconut Fiber',
        quantity: 10,
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        total_amount: 89.99,
      },
    ];
    return res.json({ success: true, orders: mockOrders });
  }

  console.log('[local-api-server] serving mock all-data');
  return res.json({
    success: true,
    data: {
      bookEventRequests: [],
      investmentInquiries: [],
      machineOrders: [],
      productOrders: [],
      serviceContacts: [],
      toxicResults: [],
      waitlist: [],
      huskSaleRequests: [],
    },
    total_records: 0,
    timestamp: new Date().toISOString(),
  });
});

// Send custom email endpoint (mock for local dev).
// Logs only the request shape — never the body.
app.post('/api/send-custom-email', (req, res) => {
  console.log('[local-api-server] send-custom-email invoked', {
    to: Array.isArray(req.body?.to) ? req.body.to.length : (req.body?.to ? 1 : 0),
    subjectLength: typeof req.body?.subject === 'string' ? req.body.subject.length : 0,
    messageLength: typeof req.body?.message === 'string' ? req.body.message.length : 0,
  });

  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  setTimeout(() => {
    res.json({
      success: true,
      message: 'Email sent successfully (mock)',
      emailId: 'mock-' + Date.now(),
    });
  }, 1000);
});

// Vendor signup endpoint
app.post('/api/vendor-signup', async (req, res) => {
  console.log('[local-api-server] vendor-signup attempt');
  try {
    const { email, password, business_name, contact_name, phone, address, description } = req.body;

    if (!email || !password || !business_name || !contact_name) {
      return res.status(400).json({ success: false, error: 'Email, password, business name, and contact name are required' });
    }

    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase not configured' });
    }

    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('email')
      .eq('email', email)
      .single();

    // Use a constant-time-vague error to prevent account-enumeration oracles.
    if (existingVendor) {
      return res.status(400).json({ success: false, error: 'Email already registered or otherwise unavailable' });
    }

    // bcrypt cost 12 (was 10) to keep pace with modern hardware.
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: newVendor, error } = await supabase
      .from('vendors')
      .insert([{
        email,
        password_hash,
        business_name,
        contact_name,
        phone: phone || null,
        address: address || null,
        description: description || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('[local-api-server] supabase error:', error.message);
      return res.status(500).json({ success: false, error: 'Could not create vendor account' });
    }

    const { password_hash: _, ...vendorData } = newVendor;
    console.log('[local-api-server] vendor signup ok:', vendorData.email);

    return res.status(200).json({ success: true, vendor: vendorData });
  } catch (error) {
    console.error('[local-api-server] vendor-signup error:', error?.message);
    return res.status(500).json({ success: false, error: 'Failed to create vendor account' });
  }
});

// Vendor login endpoint
app.post('/api/vendor-login', async (req, res) => {
  console.log('[local-api-server] vendor-login attempt');
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase not configured' });
    }

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .single();

    // Always run bcrypt.compare to keep timings constant regardless of whether
    // the email exists.
    const dummyHash = '$2a$12$0000000000000000000000000000000000000000000000000000';
    const compareTarget = vendor?.password_hash || dummyHash;
    const isValidPassword = await bcrypt.compare(password, compareTarget);

    if (error || !vendor || !isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (!vendor.is_active) {
      return res.status(403).json({ success: false, error: 'Account is deactivated. Please contact support.' });
    }

    const { password_hash, ...vendorData } = vendor;
    console.log('[local-api-server] vendor login ok:', vendorData.email);

    return res.status(200).json({ success: true, vendor: vendorData });
  } catch (error) {
    console.error('[local-api-server] vendor-login error:', error?.message);
    return res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

if (ADMIN_PASSWORD) {
  app.listen(PORT, HOST, () => {
    console.log(`[local-api-server] listening on http://${HOST}:${PORT}`);
    console.log('[local-api-server] endpoints: /api/admin-login, /api/auth, /api/data, /api/send-custom-email, /api/vendor-signup, /api/vendor-login');
  });
} else {
  console.warn('[local-api-server] not starting because ADMIN_PASSWORD is not configured.');
}

export default app;
