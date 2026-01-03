import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel configuration for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle FormData
  },
};

// Template builder functions
function buildCustomerTemplate(heading, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <center style="width: 100%; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

          <!-- Header with warm customer greeting -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #8CC63F;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="COCONOTO Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;">
                <h2 style="color: white; font-family: Arial, sans-serif; font-size: 18px; margin: 10px 0 0 0;">Thank you for choosing Coconoto!</h2>
              </td>
            </tr>
          </table>

          <!-- Main Content -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 30px;">
            <tr>
              <td align="left" style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #a37352;">

                ${heading ? `
                <h2 style="font-size: 24px; color: #618A42; margin: 0 0 20px 0; border-bottom: 2px solid #8CC63F; padding-bottom: 10px;">
                  ${heading}
                </h2>
                ` : ''}

                <div style="margin-bottom: 20px; white-space: pre-wrap;">${message}</div>

                <!-- Featured Products Section -->
                <div style="margin: 30px 0;">
                  <h3 style="color: #618A42; text-align: center; margin-bottom: 25px; font-size: 20px;">🥥 Featured Products</h3>
                  
                  <!-- Product Cards Container -->
                  <table border="0" cellpadding="0" cellspacing="10" width="100%" style="margin: 20px 0;">
                    <tr>
                      <!-- Product 1: Cocopeat -->
                      <td width="33%" style="vertical-align: top;">
                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <img src="https://www.coconoto.africa/assets/cocpeat1-03oJOxP8.jpeg" alt="Cocopeat" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                          <h4 style="color: #a37352; margin: 10px 0 5px 0; font-size: 16px;">Cocopeat</h4>
                          <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">Nutrient‑rich growing medium.</p>
                          <div style="margin: 10px 0;">
                            <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦10,000</span>
                            <span style="color: #999; font-size: 12px;">/5kg</span>
                          </div>
                          <a href="https://www.coconoto.africa/product/products" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                        </div>
                      </td>

                      <!-- Product 2: Fiber -->
                      <td width="33%" style="vertical-align: top;">
                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <img src="https://www.coconoto.africa/assets/fiber-Cx0Hxqe5.jpeg" alt="Fiber" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                          <h4 style="color: #a37352; margin: 10px 0 5px 0; font-size: 16px;">Fiber</h4>
                          <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">Biodegradable craft material.</p>
                          <div style="margin: 10px 0;">
                            <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦15,000</span>
                            <span style="color: #999; font-size: 12px;">/A Sack</span>
                          </div>
                          <a href="https://www.coconoto.africa/product/products" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                        </div>
                      </td>

                      <!-- Product 3: Cocopot -->
                      <td width="33%" style="vertical-align: top;">
                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <img src="https://www.coconoto.africa/assets/cocopot2-DJXRmWOe.jpg" alt="Cocopot" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                          <h4 style="color: #a37352; margin: 10px 0 5px 0; font-size: 16px;">Cocopot</h4>
                          <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">Eco‑friendly plant containers.</p>
                          <div style="margin: 10px 0;">
                            <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦10,000</span>
                            <span style="color: #999; font-size: 12px;">/Pot</span>
                          </div>
                          <a href="https://www.coconoto.africa/product/products" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- View All Products Link -->
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="https://www.coconoto.africa/product" style="color: #8CC63F; text-decoration: none; font-weight: bold; font-size: 14px; border-bottom: 2px solid #8CC63F;">View All Products →</a>
                  </div>
                </div>

                <div style="background-color: #fff8e7; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #f0d000;">
                  <p style="margin: 0; font-size: 14px; color: #b8860b;">
                    <strong>💡 Did you know?</strong> Coconoto provides premium coconut products sourced directly from local farmers, ensuring quality and supporting sustainable agriculture.
                  </p>
                </div>

                <p style="margin-top: 30px;">
                  Warm regards,<br>
                  <strong>The Coconoto Customer Team</strong><br>
                  <em>Your trusted partner in coconut excellence</em>
                </p>

                <p style="margin-top: 20px;">
                  <strong>Need immediate assistance?</strong><br>
                  📞 <strong>+234 814 860 9051</strong><br>
                  📧 <strong>coconutoenterprise@gmail.com</strong><br>
                  🌐 <a href="https://www.coconoto.com" style="color: #8CC63F; text-decoration: none; font-weight: bold;">www.coconoto.com</a>
                </p>

              </td>
            </tr>
          </table>

          <!-- Customer Footer -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; padding: 20px 0; background-color: #f8f8f8;">
            <tr>
              <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #a37352;">
                <div style="margin-bottom: 15px;">
                  <a href="https://m.facebook.com/p/Coconoto-100092422418297/" style="color: #8CC63F; text-decoration: none; margin: 0 10px;">Facebook</a>
                  <a href="https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw==" style="color: #8CC63F; text-decoration: none; margin: 0 10px;">Instagram</a>
                  <a href="https://www.linkedin.com/company/coconoto/" style="color: #8CC63F; text-decoration: none; margin: 0 10px;">LinkedIn</a>
                </div>
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Coconoto Enterprise | All Rights Reserved</p>
                <p style="margin: 5px 0; color: #888;">
                  <a href="mailto:coconutoenterprise@gmail.com?subject=Unsubscribe" style="color: #888; text-decoration: none;">Unsubscribe</a> | 
                  <a href="https://www.coconoto.africa/privacy-policy" style="color: #888; text-decoration: none;">Privacy Policy</a>
                </p>
              </td>
            </tr>
          </table>
        </div>
      </center>
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
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f0f0;">
      <center style="width: 100%; background-color: #f0f0f0;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff;">

          <!-- Internal Header -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #a37352;">
            <tr>
              <td align="center" style="padding: 40px 25px;">
                <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="COCONOTO Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;">
                <h2 style="color: white; font-family: Arial, sans-serif; font-size: 18px; margin: 10px 0 0 0;">Thank you for choosing Coconoto!</h2>
              </td>
            </tr>
          </table>

          <!-- Main Content -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #ffffff; padding: 25px;">
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #333333;">

                ${heading ? `
                <h2 style="font-size: 24px; color: #a37352; margin: 0 0 20px 0; border-bottom: 2px solid #8CC63F; padding-bottom: 10px;">
                  ${heading}
                </h2>
                ` : ''}

                <div style="margin-bottom: 20px; white-space: pre-wrap;">${message}</div>

                <!-- System Information -->
                <div style="background-color: #f8f8f8; padding: 15px; border-radius: 3px; margin: 20px 0; font-size: 12px; color: #666;">
                  <strong>System Info:</strong> 
                  Generated on ${new Date().toLocaleString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })} | 
                  Source: https://www.coconoto.africa
                </div>

                <!-- Quick Actions -->
                <div style="text-align: center; margin: 25px 0;">
                  <a href="https://www.coconoto.africa/vintage-dashboard" style="background-color: #a37352; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; margin: 0 10px; display: inline-block;">View Dashboard</a>
                </div>

              </td>
            </tr>
          </table>

          <!-- Internal Footer -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #333333; padding: 15px 0;">
            <tr>
              <td align="center" style="font-family: Arial, sans-serif; font-size: 11px; color: #cccccc;">
                <p style="margin: 5px 0;">
                  <strong>Coconoto Enterprise - Internal System</strong><br>
                  This is an automated notification. Do not reply to this email.
                </p>
                <p style="margin: 5px 0; color: #999999;">
                  <a href="https://wa.me/2349131678833" style="color: #8CC63F; text-decoration: none;">IT Support</a>
                </p>
                <p style="margin: 5px 0; font-size: 10px;">© ${new Date().getFullYear()} Coconoto Internal Communications System</p>
              </td>
            </tr>
          </table>
        </div>
      </center>
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
    // Parse FormData or JSON body
    const contentType = req.headers['content-type'] || '';
    let to, subject, message, heading, templateType;
    let attachments = [];
    
    if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data (with file uploads)
      const formidable = require('formidable');
      const fs = require('fs');
      
      const form = formidable({ 
        multiples: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB per file
      });
      
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });
      
      // Extract fields (formidable returns arrays for fields)
      to = Array.isArray(fields.to) ? fields.to[0] : fields.to;
      subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
      message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
      heading = Array.isArray(fields.heading) ? fields.heading[0] : fields.heading;
      templateType = Array.isArray(fields.templateType) ? fields.templateType[0] : fields.templateType;
      
      // Process uploaded files
      if (files.attachments) {
        const fileArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];
        
        for (const file of fileArray) {
          const fileContent = fs.readFileSync(file.filepath);
          attachments.push({
            filename: file.originalFilename || file.newFilename,
            content: fileContent,
          });
        }
      }
    } else {
      // Parse JSON body (backward compatibility)
      const body = req.body;
      to = body.to;
      subject = body.subject;
      message = body.message;
      heading = body.heading;
      templateType = body.templateType;
    }

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

    // Send email with attachments
    const emailData = {
      from: templateType === 'team' 
        ? 'Coconoto Internal Team <team@coconoto.africa>'
        : 'Coconoto Customer Service <team@coconoto.africa>',
      to: recipients,
      subject: subject,
      html: htmlContent,
    };
    
    // Add attachments if present
    if (attachments.length > 0) {
      emailData.attachments = attachments;
    }

    const result = await resend.emails.send(emailData);

    return res.status(200).json({
      success: true,
      message: `Email sent successfully${attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`,
      emailId: result.data?.id,
      attachmentCount: attachments.length
    });

  } catch (error) {
    console.error('Send custom email error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
}