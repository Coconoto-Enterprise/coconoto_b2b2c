import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { to, subject, message, isHtml } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, message' 
      });
    }

    // Convert to array if string
    const recipients = Array.isArray(to) ? to : [to];

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of recipients) {
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid email address: ${email}` 
        });
      }
    }

    // Send email
    const emailData = {
      from: 'team@coconoto.africa',
      to: recipients,
      subject: subject,
      ...(isHtml ? { html: message } : { text: message })
    };

    const result = await resend.emails.send(emailData);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.data?.id
    });

  } catch (error) {
    console.error('Send custom email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email'
    });
  }
}