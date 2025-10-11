import { Resend } from 'resend';

console.log('🔑 Resend API Key:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');
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
    console.log('🔍 Getting emails from Resend...');
    
    // Get emails from Resend
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