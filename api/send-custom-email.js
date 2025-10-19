import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template builder functions
function buildCustomerTemplate(heading, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px 20px; text-align: center; }
        .logo { width: 120px; height: auto; }
        .content { padding: 30px 20px; }
        .heading-section { background-color: #f9fafb; border-left: 4px solid #059669; padding: 15px 20px; margin: 20px 0; }
        .heading-title { font-size: 18px; font-weight: bold; color: #059669; margin: 0; text-transform: uppercase; }
        .message-content { margin: 20px 0; white-space: pre-wrap; }
        .products { display: flex; gap: 15px; margin: 30px 0; flex-wrap: wrap; }
        .product-card { flex: 1; min-width: 150px; background: #f9fafb; border-radius: 8px; padding: 15px; text-align: center; }
        .product-name { font-weight: bold; color: #1f2937; margin: 10px 0 5px; }
        .product-price { color: #059669; font-weight: bold; font-size: 18px; }
        .cta-button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
        .footer-links { margin: 15px 0; }
        .footer-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.coconoto.africa/Logo_1.png" alt="COCONOTO" class="logo">
          <h1 style="color: white; margin: 15px 0 5px;">Thank you for choosing Coconoto!</h1>
        </div>
        
        <div class="content">
          ${heading ? `
          <div class="heading-section">
            <h2 class="heading-title">${heading}</h2>
          </div>
          ` : ''}
          
          <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
          
          <h3 style="color: #1f2937; margin-top: 30px;">🥥 Featured Products</h3>
          <div class="products">
            <div class="product-card">
              <div class="product-name">Cocopeat</div>
              <p style="color: #6b7280; font-size: 14px;">Nutrient-rich growing medium.</p>
              <div class="product-price">₦7,000 /5kg</div>
              <a href="https://www.coconoto.africa/product/products" class="cta-button" style="font-size: 14px; padding: 8px 20px; margin-top: 10px;">Order Now</a>
            </div>
            <div class="product-card">
              <div class="product-name">Fiber</div>
              <p style="color: #6b7280; font-size: 14px;">Biodegradable craft material.</p>
              <div class="product-price">₦15,000 /Sack</div>
              <a href="https://www.coconoto.africa/product/products" class="cta-button" style="font-size: 14px; padding: 8px 20px; margin-top: 10px;">Order Now</a>
            </div>
            <div class="product-card">
              <div class="product-name">Cocopot</div>
              <p style="color: #6b7280; font-size: 14px;">Eco-friendly plant containers.</p>
              <div class="product-price">₦10,000 /Pot</div>
              <a href="https://www.coconoto.africa/product/products" class="cta-button" style="font-size: 14px; padding: 8px 20px; margin-top: 10px;">Order Now</a>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.coconoto.africa/product" class="cta-button">View All Products →</a>
          </div>
          
          <p style="color: #6b7280; font-style: italic; margin-top: 30px;">
            💡 Did you know? Coconoto provides premium coconut products sourced directly from local farmers, ensuring quality and supporting sustainable agriculture.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 5px 0;"><strong>Warm regards,</strong></p>
            <p style="margin: 5px 0;">The Coconoto Customer Team</p>
            <p style="color: #6b7280; font-style: italic; margin: 5px 0;">Your trusted partner in coconut excellence</p>
          </div>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 5px 0; font-weight: bold;">Need immediate assistance?</p>
            <p style="margin: 5px 0;">📞 +234 814 860 9051</p>
            <p style="margin: 5px 0;">📧 coconutoenterprise@gmail.com</p>
            <p style="margin: 5px 0;">🌐 www.coconoto.com</p>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-links">
            <a href="https://facebook.com/coconoto">Facebook</a>
            <a href="https://instagram.com/coconoto">Instagram</a>
            <a href="https://linkedin.com/company/coconoto">LinkedIn</a>
          </div>
          <p style="margin: 10px 0; font-size: 14px;">© Coconoto Enterprise | All Rights Reserved</p>
          <div style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
            <a href="https://www.coconoto.africa/privacy-policy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> | 
            <a href="mailto:coconutoenterprise@gmail.com?subject=Unsubscribe" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildTeamTemplate(heading, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 20px; text-align: center; }
        .logo { width: 100px; height: auto; }
        .content { padding: 30px 20px; }
        .heading-section { background-color: #f3f4f6; border-left: 4px solid #1f2937; padding: 15px 20px; margin: 20px 0; }
        .heading-title { font-size: 18px; font-weight: bold; color: #1f2937; margin: 0; text-transform: uppercase; }
        .message-content { margin: 20px 0; white-space: pre-wrap; background: #f9fafb; padding: 20px; border-radius: 5px; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
        .system-info { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 10px 15px; margin: 20px 0; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.coconoto.africa/Logo_1.png" alt="COCONOTO" class="logo">
          <h2 style="color: white; margin: 10px 0 0;">Coconoto Internal System</h2>
        </div>
        
        <div class="content">
          ${heading ? `
          <div class="heading-section">
            <h2 class="heading-title">${heading}</h2>
          </div>
          ` : ''}
          
          <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
          
          <div class="system-info">
            <strong>⚠️ System Info:</strong> Generated on ${new Date().toLocaleString('en-GB', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })} | Source: https://www.coconoto.africa
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.coconoto.africa/vintage-dashboard" style="display: inline-block; background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <strong>Coconoto Enterprise - Internal System</strong><br>
            This is an automated notification. Do not reply to this email.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 5px 0;">Coconoto Internal Communications System</p>
          <p style="margin: 5px 0;">
            <a href="mailto:coconutoenterprise@gmail.com" style="color: #10b981; text-decoration: none;">IT Support</a>
          </p>
          <p style="margin: 10px 0;">© Coconoto Internal Communications System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

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
    const { to, subject, message, heading, templateType } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, message' 
      });
    }

    // Convert to array if string
    const recipients = Array.isArray(to) ? to : to.split(',').map(email => email.trim());

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

    // Build HTML based on template type
    let htmlContent;
    if (templateType === 'team') {
      htmlContent = buildTeamTemplate(heading || '', message);
    } else {
      // Default to customer template
      htmlContent = buildCustomerTemplate(heading || '', message);
    }

    // Send email
    const emailData = {
      from: 'team@coconoto.africa',
      to: recipients,
      subject: subject,
      html: htmlContent
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