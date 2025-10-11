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
    const { password } = req.body;
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

  } catch (error) {
    console.error('❌ Admin login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error occurred'
    });
  }
}