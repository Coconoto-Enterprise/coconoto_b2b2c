import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Missing Supabase environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const type = req.query.type || 'all-data';

    switch (type) {
      case 'emails':
        return await handleGetEmails(res);
      case 'orders':
        return await handleGetOrders(res);
      case 'all-data':
      default:
        return await handleGetAllData(res);
    }
  } catch (error) {
    console.error('Data fetch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Get emails from Resend
async function handleGetEmails(res) {
  console.log('🔍 Getting emails from Resend...');
  
  try {
    const emails = await resend.emails.list({
      limit: 100,
    });

    console.log('📧 Resend response:', emails);

    return res.status(200).json({
      success: true,
      emails: emails.data || []
    });
  } catch (error) {
    console.error('Get emails error:', error);
    // Return empty emails instead of error to prevent dashboard crash
    return res.status(200).json({
      success: true,
      emails: []
    });
  }
}

// Get orders from Supabase tables
async function handleGetOrders(res) {
  console.log('🔍 Fetching from YOUR ACTUAL Supabase tables...');
  console.log('Supabase URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  
  if (!supabase) {
    console.log('❌ Supabase not configured - returning empty orders');
    return res.status(200).json({
      success: true,
      orders: [],
      message: 'Supabase not configured'
    });
  }

  let allOrders = [];

  // 1. Get MACHINE ORDERS
  try {
    console.log('🏭 Fetching machine_orders...');
    const { data: machineOrders, error: machineError } = await supabase
      .from('machine_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!machineError && machineOrders) {
      const formattedMachines = machineOrders.map(order => ({
        id: order.id,
        customer_name: order.name,
        customer_email: order.email,
        product_type: `Machine Order`,
        quantity: order.quantity || 1,
        status: 'pending',
        created_at: order.created_at,
        total_amount: 0,
        type: 'machine_order',
        phone: order.phone,
        installation_address: order.installation_address,
        additional_requirements: order.additional_requirements
      }));
      allOrders.push(...formattedMachines);
      console.log(`✅ Found ${machineOrders.length} machine orders`);
    } else if (machineError) {
      console.log('❌ machine_orders error:', machineError.message);
    }
  } catch (err) {
    console.log('❌ machine_orders table error:', err.message);
  }

  // 2. Get WAITLIST ENTRIES
  try {
    console.log('📝 Fetching waitlist...');
    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!waitlistError && waitlist) {
      const formattedWaitlist = waitlist.map(entry => ({
        id: entry.id,
        customer_name: entry.name,
        customer_email: entry.email,
        product_type: `Waitlist: ${entry.account_type}`,
        quantity: 1,
        status: 'waitlist',
        created_at: entry.created_at,
        total_amount: 0,
        type: 'waitlist',
        phone: entry.phone,
        company: entry.company,
        country: entry.country,
        business_type: entry.business_type
      }));
      allOrders.push(...formattedWaitlist);
      console.log(`✅ Found ${waitlist.length} waitlist entries`);
    } else if (waitlistError) {
      console.log('❌ waitlist error:', waitlistError.message);
    }
  } catch (err) {
    console.log('❌ waitlist table error:', err.message);
  }

  // 3. Get PRODUCT ORDERS
  try {
    console.log('🛒 Fetching product_orders...');
    const { data: productOrders, error: productError } = await supabase
      .from('product_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!productError && productOrders) {
      const formattedProducts = productOrders.map(order => ({
        id: order.id,
        customer_name: order.name,
        customer_email: order.email,
        product_type: `Product Order`,
        quantity: order.products ? order.products.length : 1,
        status: 'pending',
        created_at: order.created_at,
        total_amount: 0,
        type: 'product_order',
        phone: order.phone,
        address: order.address,
        products: order.products
      }));
      allOrders.push(...formattedProducts);
      console.log(`✅ Found ${productOrders.length} product orders`);
    } else if (productError) {
      console.log('❌ product_orders error:', productError.message);
    }
  } catch (err) {
    console.log('❌ product_orders table error:', err.message);
  }

  // Sort all orders by created_at descending
  allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log(`📦 Total orders found: ${allOrders.length}`);

  return res.status(200).json({
    success: true,
    orders: allOrders,
    count: allOrders.length,
    tables_checked: ['machine_orders', 'waitlist', 'product_orders'],
    message: `Found ${allOrders.length} total orders across all tables`
  });
}

// Get all data from all Supabase tables
async function handleGetAllData(res) {
  console.log('🔍 Fetching ALL your Supabase tables...');
  console.log('Supabase URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  
  if (!supabase) {
    console.log('❌ Supabase not configured - returning empty data');
    return res.status(200).json({
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
      message: 'Supabase not configured'
    });
  }

  const allTables = {};

  // Helper function to safely fetch from a table
  const fetchTable = async (tableName) => {
    try {
      console.log(`📋 Fetching from ${tableName}...`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log(`❌ ${tableName} error:`, error.message);
        return [];
      }

      console.log(`✅ ${tableName}: ${data ? data.length : 0} records`);
      return data || [];
    } catch (err) {
      console.log(`❌ ${tableName} exception:`, err.message);
      return [];
    }
  };

  // Fetch all tables
  allTables.bookEventRequests = await fetchTable('book_event_requests');
  allTables.investmentInquiries = await fetchTable('investment_inquiries');
  allTables.machineOrders = await fetchTable('machine_orders');
  allTables.productOrders = await fetchTable('product_orders');
  allTables.serviceContacts = await fetchTable('service_contacts');
  allTables.toxicResults = await fetchTable('toxic_results');
  allTables.waitlist = await fetchTable('waitlist');
  allTables.huskSaleRequests = await fetchTable('husk_sale_requests');

  const totalRecords = Object.values(allTables).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`📊 Total records across all tables: ${totalRecords}`);

  return res.status(200).json({
    success: true,
    data: allTables,
    total_records: totalRecords,
    timestamp: new Date().toISOString()
  });
}
