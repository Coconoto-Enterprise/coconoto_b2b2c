module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const apiKeyLength = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0;
    
    return res.status(200).json({
      status: 'API endpoint working',
      environment: process.env.NODE_ENV || 'unknown',
      hasResendApiKey: hasApiKey,
      apiKeyLength: apiKeyLength > 0 ? `${apiKeyLength} characters` : 'not set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
};