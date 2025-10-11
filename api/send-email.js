const { Resend } = require('resend');

// Initialize Resend - will be done inside handler for better error handling
let resend;

// Import email templates (inline for serverless function)
function getCustomerEmailTemplate(customerName, orderDetails, orderType) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Coconoto - Order Confirmation</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        .cta-button { 
            background-color: #8CC63F; 
            color: white; 
            padding: 12px 25px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            font-weight: bold;
            margin: 15px 0;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center style="width: 100%; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

            <!-- Header -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #8CC63F;">
                <tr>
                    <td align="center" style="padding: 25px 0;">
                        <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto Logo" style="height: 40px; margin-bottom: 10px;" />
                        <h2 style="color: white; font-family: Arial, sans-serif; font-size: 18px; margin: 10px 0 0 0;">Thank you for choosing Coconoto!</h2>
                    </td>
                </tr>
            </table>

            <!-- Main Content -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 30px;">
                <tr>
                    <td align="left" style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #694C39;">

                        <h1 style="font-size: 24px; color: #618A42; margin: 0 0 20px 0;">Dear ${customerName},</h1>

                        <p style="margin-bottom: 20px;">We appreciate your interest in Coco-Connect! Watch out for updates on our product offerings and launch.</p>

                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #618A42; margin: 0 0 15px 0;">Your ${orderType} Details:</h3>
                            <p style="color: #694C39; margin: 0;">${orderDetails}</p>
                        </div>

                        <p style="margin-bottom: 25px;">We'll be in touch soon with more information about your request.</p>

                        <center>
                            <a href="https://www.coconoto.africa/product" class="cta-button" style="background-color: #8CC63F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 15px 0;">View Our Products</a>
                        </center>

                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #694C39; padding: 20px;">
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 14px; color: white;">
                        <p style="margin: 0 0 10px 0;">Follow us on social media for updates!</p>
                        <p style="margin: 0; color: #cccccc;">© 2025 Coconoto Enterprise. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
  `;
}

function getBusinessEmailTemplate(notificationType, customerInfo, orderDetails, timestamp, priority = 'HIGH') {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Coconoto - Internal Notification</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        .data-table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background-color: #8CC63F; color: white; }
        .priority-high { color: #dc3545; font-weight: bold; }
        .priority-medium { color: #ffc107; font-weight: bold; }
        .priority-low { color: #28a745; font-weight: bold; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center style="width: 100%; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

            <!-- Header -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #618A42;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto Logo" style="height: 35px; margin-bottom: 8px;" />
                        <h2 style="color: white; font-family: Arial, sans-serif; font-size: 16px; margin: 8px 0 0 0;">New ${notificationType}</h2>
                        <p style="color: #cccccc; margin: 5px 0 0 0; font-size: 12px;">Priority: <span class="priority-${priority.toLowerCase()}">${priority}</span></p>
                    </td>
                </tr>
            </table>

            <!-- Main Content -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 25px;">
                <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #333333;">

                        <h3 style="color: #618A42; margin: 0 0 15px 0;">Customer Information:</h3>
                        <table class="data-table">
                            <tr><th>Name</th><td>${customerInfo.name || 'Not provided'}</td></tr>
                            <tr><th>Email</th><td>${customerInfo.email || 'Not provided'}</td></tr>
                            <tr><th>Phone</th><td>${customerInfo.phone || 'Not provided'}</td></tr>
                            <tr><th>Company</th><td>${customerInfo.company || 'Not provided'}</td></tr>
                        </table>

                        <h3 style="color: #618A42; margin: 20px 0 15px 0;">Request Details:</h3>
                        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #8CC63F; margin-bottom: 20px;">
                            <p style="margin: 0; white-space: pre-line;">${orderDetails}</p>
                        </div>

                        <p style="margin: 15px 0; font-size: 12px; color: #666666;">
                            <strong>Timestamp:</strong> ${timestamp}<br>
                            <strong>Source:</strong> Coconoto Website
                        </p>

                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-top: 20px;">
                            <p style="margin: 0; font-size: 14px; color: #856404;">
                                <strong>⚡ Action Required:</strong> Please follow up with this customer within 24 hours.
                            </p>
                        </div>

                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #694C39; padding: 15px;">
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #cccccc;">
                        <p style="margin: 0;">Coconoto Internal Notification System</p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
  `;
}

module.exports = async function handler(req, res) {
  // Add CORS headers
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

  // Check if API key is available
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable not set');
    return res.status(500).json({ 
      success: false, 
      error: 'Email service configuration error' 
    });
  }

  try {
    // Initialize Resend inside the handler
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }

    const { 
      subject, 
      customerEmail, 
      customerName,
      formType,
      formData,
      eventType,
      message
    } = req.body;

    console.log('📧 API Route - Processing email request');
    console.log('📧 Environment check - API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('📧 Subject:', subject);
    console.log('� Form Type:', formType);
    console.log('�📬 Customer Email:', customerEmail);

    const results = [];

    // Generate business notification email
    const businessEmailHtml = getBusinessEmailTemplate(
      formType,
      {
        name: customerName || 'Unknown',
        email: customerEmail || 'Not provided', 
        phone: formData?.phone || 'Not provided',
        company: formData?.company || 'Not provided'
      },
      `${formType}: ${eventType || 'New submission'}

Customer Details:
${message || 'No additional message'}

Form Data: ${JSON.stringify(formData, null, 2)}`,
      new Date().toISOString(),
      'HIGH'
    );

    // Send business notification email
    console.log('📤 Sending business notification...');
    const businessResult = await resend.emails.send({
      from: 'Coconoto <onboarding@resend.dev>',
      to: ['info@coconoto.africa'], // Your business email
      subject: subject,
      html: businessEmailHtml,
    });

    console.log('✅ Business email sent:', businessResult);
    results.push({ type: 'business', result: businessResult });

    // Send customer confirmation email if provided
    if (customerEmail && customerName) {
      console.log('📤 Sending customer confirmation...');
      
      const customerEmailHtml = getCustomerEmailTemplate(
        customerName,
        `Thank you for your ${formType.toLowerCase()} submission. We have received your request for: ${eventType || 'our services'}.`,
        formType
      );

      const customerResult = await resend.emails.send({
        from: 'Coconoto <onboarding@resend.dev>', // Production: hello@coconoto.africa
        to: [customerEmail],
        subject: 'Thank you for your interest - Coconoto',
        html: customerEmailHtml,
      });

      console.log('✅ Customer email sent:', customerResult);
      results.push({ type: 'customer', result: customerResult });
    }

    console.log('🎉 All emails sent successfully via Resend API!');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Emails sent successfully',
      results: results
    });

  } catch (error) {
    console.error('❌ API Route - Email sending failed:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}