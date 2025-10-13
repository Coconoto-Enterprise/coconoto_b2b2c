import { Resend } from 'resend';
import { TemplateService } from './templateService.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { customerName, customerEmail, eventType, message, formType, formData } = req.body;

    console.log('📧 Processing email request');
    console.log('📧 Customer:', customerName, customerEmail);
    console.log('📧 Form Type:', formType);

    const results = [];

    // Get appropriate templates based on form type
    let templates;
    
    switch (formType.toLowerCase()) {
      case 'waitlist signup':
      case 'waitlist':
        templates = TemplateService.getWaitlistTemplates(formData);
        break;
      case 'contact form':
      case 'contact':
        templates = TemplateService.getContactTemplates(formData);
        break;
      case 'machine order':
      case 'desheller machine order':
      case 'dehusker machine order':
      case 'cocopeat equipment order':
        const machineType = eventType.includes('Desheller') ? 'Desheller' : 
                           eventType.includes('Dehusker') ? 'Dehusker' : 
                           eventType.includes('Cocopeat') ? 'Cocopeat Equipment' : 'Machine';
        templates = TemplateService.getMachineTemplates(formData, machineType);
        break;
      case 'product order':
        templates = TemplateService.getProductTemplates(formData);
        break;
      case 'event booking':
      case 'booking':
        templates = TemplateService.getBookingTemplates(formData);
        break;
      default:
        // Fallback to simple templates for unknown types
        templates = {
          systemHtml: `
            <h2>New ${formType} - Coconoto</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Type:</strong> ${eventType}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Details:</strong></p>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
            <p>Submitted: ${new Date().toISOString()}</p>
          `,
          userHtml: `
            <h2>Thank you for your interest - Coconoto 🥥</h2>
            <p>Dear ${customerName},</p>
            <p>We have received your ${formType.toLowerCase()} and will be in touch soon!</p>
            <p>Your request for: ${eventType}</p>
            <p>Best regards,<br>Coconoto Team</p>
          `
        };
    }

    const businessEmailHtml = templates.systemHtml;
    const customerEmailHtml = templates.userHtml;

    // Send business notification
    console.log('📤 Sending business notification...');
    
    // Use your VERIFIED domain (same as Supabase SMTP)
    const businessResult = await resend.emails.send({
      from: 'Coconoto <team@coconoto.africa>',
      to: [
        'coconotoenterprise@gmail.com',     // Business Gmail
        'bamigboyeayomide095@gmail.com'     // Your personal email
      ],
      subject: `New ${formType} - ${customerName}`,
      html: businessEmailHtml,
    });

    console.log('✅ Business email sent:', businessResult);
    
    // Check if there was an error in the Resend response
    if (businessResult.error) {
      console.error('❌ Business email error:', businessResult.error);
      return res.status(500).json({
        success: false,
        error: `Business email failed: ${businessResult.error.message}`,
        details: businessResult.error
      });
    }
    
    results.push({ type: 'business', result: businessResult });

    // Send customer confirmation
    if (customerEmail && customerName) {
      console.log('📤 Sending customer confirmation...');
      
      // Use your verified custom domain
      const customerResult = await resend.emails.send({
        from: 'Coconoto <support@coconoto.africa>',
        to: [customerEmail],
        subject: 'Thank you for your interest - Coconoto',
        html: customerEmailHtml,
      });

      console.log('✅ Customer email sent:', customerResult);
      
      // Check if there was an error in the customer email
      if (customerResult.error) {
        console.error('❌ Customer email error:', customerResult.error);
        // Still return success for business email but note the customer email issue
        results.push({ type: 'customer', result: customerResult, error: customerResult.error });
      } else {
        results.push({ type: 'customer', result: customerResult });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully!',
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}