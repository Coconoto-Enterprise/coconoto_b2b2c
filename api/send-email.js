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
    // Basic test response for debugging
    console.log('📧 API Debug - Request received');
    console.log('📧 Method:', req.method);
    console.log('📧 Body:', req.body);
    console.log('📧 Environment - API Key exists:', !!process.env.RESEND_API_KEY);

    return res.status(200).json({
      success: true,
      message: 'API endpoint is working - Debug Mode',
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
      requestBody: req.body,
      requestMethod: req.method
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}