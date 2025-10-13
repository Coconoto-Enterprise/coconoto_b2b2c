import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Missing Supabase environment variables - data will be empty');
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
          waitlist: []
        },
        message: 'Supabase not configured'
      });
    }

    const allData = {
      bookEventRequests: [],
      investmentInquiries: [],
      machineOrders: [],
      productOrders: [],
      serviceContacts: [],
      toxicResults: [],
      waitlist: []
    };

    // 1. Book Event Requests
    try {
      console.log('🎉 Fetching book_event_requests...');
      const { data: bookEvents, error: bookError } = await supabase
        .from('book_event_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!bookError && bookEvents) {
        allData.bookEventRequests = bookEvents;
        console.log(`✅ Found ${bookEvents.length} book event requests`);
      } else if (bookError) {
        console.log('❌ book_event_requests error:', bookError.message);
      }
    } catch (err) {
      console.log('❌ book_event_requests table error:', err.message);
    }



    // 2. Machine Orders
    try {
      console.log('🏭 Fetching machine_orders...');
      const { data: machineOrders, error: machineError } = await supabase
        .from('machine_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!machineError && machineOrders) {
        allData.machineOrders = machineOrders;
        console.log(`✅ Found ${machineOrders.length} machine orders`);
      } else if (machineError) {
        console.log('❌ machine_orders error:', machineError.message);
      }
    } catch (err) {
      console.log('❌ machine_orders table error:', err.message);
    }

    // 3. Product Orders
    try {
      console.log('🛒 Fetching product_orders...');
      const { data: productOrders, error: productError } = await supabase
        .from('product_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!productError && productOrders) {
        allData.productOrders = productOrders;
        console.log(`✅ Found ${productOrders.length} product orders`);
      } else if (productError) {
        console.log('❌ product_orders error:', productError.message);
      }
    } catch (err) {
      console.log('❌ product_orders table error:', err.message);
    }

    // 4. Service Contacts
    try {
      console.log('📞 Fetching service_contacts...');
      const { data: serviceContacts, error: serviceError } = await supabase
        .from('service_contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!serviceError && serviceContacts) {
        allData.serviceContacts = serviceContacts;
        console.log(`✅ Found ${serviceContacts.length} service contacts`);
      } else if (serviceError) {
        console.log('❌ service_contacts error:', serviceError.message);
      }
    } catch (err) {
      console.log('❌ service_contacts table error:', err.message);
    }

    // 5. Investment Inquiries
    try {
      console.log('💰 Fetching investment_inquiries...');
      const { data: investmentInquiries, error: investmentError } = await supabase
        .from('investment_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!investmentError && investmentInquiries) {
        allData.investmentInquiries = investmentInquiries;
        console.log(`✅ Found ${investmentInquiries.length} investment inquiries`);
      } else if (investmentError) {
        console.log('❌ investment_inquiries error:', investmentError.message);
      }
    } catch (err) {
      console.log('❌ investment_inquiries table error:', err.message);
    }

    // 6. Toxic Results
    try {
      console.log('🧪 Fetching toxic_results...');
      const { data: toxicResults, error: toxicError } = await supabase
        .from('toxic_results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!toxicError && toxicResults) {
        allData.toxicResults = toxicResults;
        console.log(`✅ Found ${toxicResults.length} toxic results`);
      } else if (toxicError) {
        console.log('❌ toxic_results error:', toxicError.message);
      }
    } catch (err) {
      console.log('❌ toxic_results table error:', err.message);
    }

    // 7. Waitlist
    try {
      console.log('📝 Fetching waitlist...');
      const { data: waitlist, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (!waitlistError && waitlist) {
        allData.waitlist = waitlist;
        console.log(`✅ Found ${waitlist.length} waitlist entries`);
      } else if (waitlistError) {
        console.log('❌ waitlist error:', waitlistError.message);
      }
    } catch (err) {
      console.log('❌ waitlist table error:', err.message);
    }

    const totalEntries = Object.values(allData).reduce((sum, arr) => sum + arr.length, 0);
    
    console.log(`📦 Total entries found: ${totalEntries}`);
    console.log('Table counts:', {
      bookEventRequests: allData.bookEventRequests.length,
      investmentInquiries: allData.investmentInquiries.length,
      machineOrders: allData.machineOrders.length,
      productOrders: allData.productOrders.length,
      serviceContacts: allData.serviceContacts.length,
      toxicResults: allData.toxicResults.length,
      waitlist: allData.waitlist.length
    });

    return res.status(200).json({
      success: true,
      data: allData,
      total: totalEntries,
      tables_checked: ['book_event_requests', 'machine_orders', 'product_orders', 'service_contacts', 'waitlist'],
      message: `Found ${totalEntries} total entries across all tables`
    });

  } catch (error) {
    console.error('❌ Get all data error:', error);
    return res.status(200).json({
      success: true,
      data: {
        bookEventRequests: [],
        investmentInquiries: [],
        machineOrders: [],
        productOrders: [],
        serviceContacts: [],
        toxicResults: [],
        waitlist: []
      },
      error: error.message,
      message: 'Error fetching data - showing empty state'
    });
  }
}