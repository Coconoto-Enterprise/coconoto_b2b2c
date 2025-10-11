export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const envStatus = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set ✅' : 'Missing ❌',
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set ✅' : 'Missing ❌ (will use default)',
    
    // Show partial values for verification (first/last 4 characters)
    RESEND_PARTIAL: process.env.RESEND_API_KEY 
      ? `${process.env.RESEND_API_KEY.substring(0, 4)}...${process.env.RESEND_API_KEY.slice(-4)}`
      : 'Not set',
    SUPABASE_URL_PARTIAL: process.env.VITE_SUPABASE_URL
      ? `${process.env.VITE_SUPABASE_URL.substring(0, 8)}...${process.env.VITE_SUPABASE_URL.slice(-8)}`
      : 'Not set'
  };

  console.log('🔍 Environment Variables Check:', envStatus);

  return res.status(200).json({
    success: true,
    message: 'Environment variables status',
    environment: envStatus,
    timestamp: new Date().toISOString()
  });
}