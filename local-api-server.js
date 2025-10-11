// Local development API server
import express from 'express';
import cors from 'cors';

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

// Get emails endpoint (mock for local dev)
app.get('/api/get-emails', (req, res) => {
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

  res.json({
    success: true,
    emails: mockEmails
  });
});

// Get orders endpoint (mock for local dev) 
app.get('/api/get-orders', (req, res) => {
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

  res.json({
    success: true,
    orders: mockOrders
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

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('  POST /api/admin-login');
  console.log('  GET  /api/get-emails');
  console.log('  GET  /api/get-orders');
  console.log('  POST /api/send-custom-email');
});

export default app;