import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { TemplateService } from './templateService.js';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase for email config & logging
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Map form type to email configuration type
 */
function mapFormTypeToEmailType(formType) {
  const normalized = (formType || '').toLowerCase().trim();

  if (normalized.includes('waitlist')) return 'waitlist_signup';
  if (normalized.includes('contact')) return 'contact_inquiry';
  if (normalized.includes('machine') || normalized.includes('desheller') || normalized.includes('dehusker')) {
    return 'machine_order';
  }
  if (normalized.includes('product')) return 'product_order';
  if (normalized.includes('husk') || normalized.includes('coconut husk')) return 'husk_sale';
  if (normalized.includes('booking') || normalized.includes('event')) return 'event_booking';

  return 'internal_notification';
}

/**
 * Get sender configuration for email type
 */
async function getSenderConfig(emailType) {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured, using fallback sender');
    return {
      sender_email: 'team@coconoto.africa',
      sender_name: 'Coconoto Team'
    };
  }

  try {
    const { data, error } = await supabase
      .from('email_sender_config')
      .select('sender_email, sender_name')
      .eq('email_type', emailType)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.warn(`⚠️ No config found for ${emailType}, using fallback`);
      return {
        sender_email: 'team@coconoto.africa',
        sender_name: 'Coconoto Team'
      };
    }

    return data;
  } catch (err) {
    console.error(`❌ Error fetching sender config: ${err.message}`);
    return {
      sender_email: 'team@coconoto.africa',
      sender_name: 'Coconoto Team'
    };
  }
}

/**
 * Log email to email_logs table
 */
async function logEmail(emailData) {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured, skipping email log');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('email_logs')
      .insert([emailData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error logging email:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`❌ Error in logEmail: ${err.message}`);
    return null;
  }
}

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
    console.log('📧 Form Data:', JSON.stringify(formData, null, 2));

    // Map form type to email configuration type
    const emailType = mapFormTypeToEmailType(formType);
    console.log(`📧 Email type: ${emailType}`);

    // Get sender configuration
    const senderConfig = await getSenderConfig(emailType);
    const senderEmail = `${senderConfig.sender_name} <${senderConfig.sender_email}>`;
    console.log(`📤 Sender: ${senderEmail}`);

    const results = [];

    // Get appropriate templates based on form type
    let templates;
    
    switch (formType.toLowerCase()) {
      case 'waitlist signup':
      case 'waitlist':
        templates = await TemplateService.getWaitlistTemplates(formData);
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
      case 'husk sale inquiry':
      case 'husk sale':
      case 'coconut husk sale':
        templates = TemplateService.getHuskTemplates(formData);
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
    
    const businessAddresses = [
      'coconotoenterprise@gmail.com',
      'bamigboyeayomide095@gmail.com',
      'faejioluwatoke@gmail.com'
    ];

    const businessResult = await resend.emails.send({
      from: senderEmail,
      to: businessAddresses,
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
    
    // Log business email to database
    if (businessResult.id) {
      await logEmail({
        from_address: senderConfig.sender_email,
        to_addresses: businessAddresses,
        subject: `New ${formType} - ${customerName}`,
        preview: message ? message.substring(0, 100) : 'Business notification',
        full_html: businessEmailHtml,
        email_type: emailType,
        status: 'delivered',
        resend_id: businessResult.id,
        resend_created_at: new Date().toISOString()
      });
    }

    results.push({ type: 'business', result: businessResult });

    // Send customer confirmation
    if (customerEmail && customerName) {
      console.log('📤 Sending customer confirmation...');
      
      const customerResult = await resend.emails.send({
        from: senderEmail,
        to: [customerEmail],
        subject: 'Thank you for your interest - Coconoto',
        html: customerEmailHtml,
      });

      console.log('✅ Customer email sent:', customerResult);
      
      // Check if there was an error in the customer email
      if (customerResult.error) {
        console.error('❌ Customer email error:', customerResult.error);
        results.push({ type: 'customer', result: customerResult, error: customerResult.error });
      } else {
        // Log customer email to database
        if (customerResult.id) {
          await logEmail({
            from_address: senderConfig.sender_email,
            to_addresses: [customerEmail],
            subject: 'Thank you for your interest - Coconoto',
            preview: 'Customer confirmation email',
            full_html: customerEmailHtml,
            email_type: emailType,
            status: 'delivered',
            resend_id: customerResult.id,
            resend_created_at: new Date().toISOString()
          });
        }

        results.push({ type: 'customer', result: customerResult });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully!',
      sender: senderConfig.sender_email,
      email_type: emailType,
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