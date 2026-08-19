import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { TemplateService } from './_templateService.js';
import {
  applyCorsAllowlist,
  escapeHtml,
  sanitizeHeaderValue,
} from './_shared-auth.js';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase for email config & logging
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Recipients are now sourced from environment variables; the open relay
// of personal Gmail addresses embedded in source is removed.
const getInternalRecipients = () => {
  const raw = process.env.INTERNAL_NOTIFICATION_RECIPIENTS;
  if (!raw || !raw.trim()) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
};

const ALLOWED_FORM_TYPES = new Set([
  'waitlist signup',
  'waitlist',
  'contact form',
  'contact',
  'machine order',
  'desheller machine order',
  'dehusker machine order',
  'cocopeat equipment order',
  'product order',
  'event booking',
  'booking',
  'husk sale inquiry',
  'husk sale',
  'coconut husk sale',
]);

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
    console.warn('[send-email] Supabase not configured, using fallback sender');
    return {
      sender_email: 'team@coconoto.africa',
      sender_name: 'Coconoto Team',
    };
  }

  try {
    // SECURITY DEFINER RPC (v3 migration) — anon has no direct table access to
    // email_sender_config; this function returns only the active sender row for
    // the requested type. Falls back if the function is missing (older backend).
    const { data, error } = await supabase.rpc('get_sender_config_for_type', {
      p_email_type: emailType,
    });

    if (error || !data) {
      console.warn(`[send-email] No config found for ${emailType}, using fallback`);
      return {
        sender_email: 'team@coconoto.africa',
        sender_name: 'Coconoto Team',
      };
    }

    // RPC returns a single row (sender_email, sender_name) or empty.
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      console.warn(`[send-email] No config row for ${emailType}, using fallback`);
      return {
        sender_email: 'team@coconoto.africa',
        sender_name: 'Coconoto Team',
      };
    }
    return { sender_email: row.sender_email, sender_name: row.sender_name };
  } catch (err) {
    console.error(`[send-email] error fetching sender config: ${err.message}`);
    return {
      sender_email: 'team@coconoto.africa',
      sender_name: 'Coconoto Team',
    };
  }
}

/**
 * Log email to email_logs table
 */
async function logEmail(emailData) {
  if (!supabase) {
    console.warn('[send-email] Supabase not configured, skipping email log');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('email_logs')
      .insert([emailData])
      .select()
      .single();

    if (error) {
      console.error('[send-email] error logging email:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`[send-email] logEmail failure: ${err.message}`);
    return null;
  }
}

/**
 * Render the fallback system HTML when the form type has no template.
 * CRITICAL: every interpolated field is HTML-escaped to block stored XSS
 * reaching the admin inbox / dashboard preview.
 */
function fallbackSystemHtml({ formType, customerName, customerEmail, eventType, message, formData }) {
  return `
    <h2>New ${escapeHtml(formType)} - Coconoto</h2>
    <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
    <p><strong>Type:</strong> ${escapeHtml(eventType)}</p>
    <p><strong>Message:</strong> ${escapeHtml(message)}</p>
    <p><strong>Details:</strong></p>
    <pre>${escapeHtml(JSON.stringify(formData, null, 2))}</pre>
    <p>Submitted: ${escapeHtml(new Date().toISOString())}</p>
  `;
}

function fallbackUserHtml({ formType, customerName, eventType }) {
  return `
    <h2>Thank you for your interest - Coconoto</h2>
    <p>Dear ${escapeHtml(customerName)},</p>
    <p>We have received your ${escapeHtml(formType)} and will be in touch soon!</p>
    <p>Your request for: ${escapeHtml(eventType)}</p>
    <p>Best regards,<br>Coconoto Team</p>
  `;
}

export default async function handler(req, res) {
  applyCorsAllowlist(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Public form endpoint — no shared-secret gate. A secret cannot be shipped
  // to the browser, so the previous API_MUTATIONS_KEY gate made every form
  // submission fail with 503 "Endpoint unavailable". Abuse protection is the
  // strict validation below (form-type allowlist, email format), the CORS
  // allowlist, and header/HTML sanitization. A rate-limit / Turnstile layer
  // is tracked as a follow-up in docs/security-audit-2026-08-17.fixes.md.

  try {
    const { customerName, customerEmail, eventType, message, formType, formData } = req.body;

    if (!customerEmail || typeof customerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ success: false, error: 'Missing or invalid customer email' });
    }
    if (!formType || typeof formType !== 'string' || !ALLOWED_FORM_TYPES.has(formType.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid form type' });
    }

    // Map form type to email configuration type
    const emailType = mapFormTypeToEmailType(formType);

    // Get sender configuration
    const senderConfig = await getSenderConfig(emailType);
    const fromName = sanitizeHeaderValue(senderConfig.sender_name);
    const fromAddress = `${fromName} <${sanitizeHeaderValue(senderConfig.sender_email)}>`;
    console.log(`[send-email] emailType=${emailType} from=${senderConfig.sender_email}`);

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
      case 'cocopeat equipment order': {
        const et = (eventType || '').toString();
        const machineType = et.includes('Desheller') ? 'Desheller'
          : et.includes('Dehusker') ? 'Dehusker'
          : et.includes('Cocopeat') ? 'Cocopeat Equipment' : 'Machine';
        templates = TemplateService.getMachineTemplates(formData, machineType);
        break;
      }
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
        templates = {
          systemHtml: fallbackSystemHtml({ formType, customerName, customerEmail, eventType, message, formData }),
          userHtml: fallbackUserHtml({ formType, customerName, eventType }),
        };
    }

    const businessEmailHtml = templates.systemHtml;
    const customerEmailHtml = templates.userHtml;

    const businessAddresses = getInternalRecipients();
    if (businessAddresses.length === 0) {
      console.warn('[send-email] No internal recipients configured (set INTERNAL_NOTIFICATION_RECIPIENTS).');
      return res.status(503).json({ success: false, error: 'Notification recipients are not configured' });
    }

    // Build a CRLF-safe subject line.
    const subject = sanitizeHeaderValue(`New ${formType} - ${customerName}`);

    const businessResult = await resend.emails.send({
      from: fromAddress,
      to: businessAddresses,
      subject,
      html: businessEmailHtml,
      reply_to: customerEmail,
    });

    if (businessResult.error) {
      console.error('[send-email] Business email error:', businessResult.error);
      return res.status(500).json({
        success: false,
        error: `Business email failed: ${businessResult.error.message}`,
      });
    }

    if (businessResult.id) {
      await logEmail({
        from_address: senderConfig.sender_email,
        to_addresses: businessAddresses,
        subject,
        preview: message ? String(message).slice(0, 100) : 'Business notification',
        full_html: businessEmailHtml,
        email_type: emailType,
        status: 'delivered',
        resend_id: businessResult.id,
        resend_created_at: new Date().toISOString(),
      });
    }

    results.push({ type: 'business', result: businessResult });

    if (customerEmail && customerName) {
      const customerResult = await resend.emails.send({
        from: fromAddress,
        to: [customerEmail],
        subject: sanitizeHeaderValue('Thank you for your interest - Coconoto'),
        html: customerEmailHtml,
      });

      if (customerResult.error) {
        console.error('[send-email] Customer email error:', customerResult.error);
        results.push({ type: 'customer', result: customerResult, error: customerResult.error });
      } else if (customerResult.id) {
        await logEmail({
          from_address: senderConfig.sender_email,
          to_addresses: [customerEmail],
          subject: 'Thank you for your interest - Coconoto',
          preview: 'Customer confirmation email',
          full_html: customerEmailHtml,
          email_type: emailType,
          status: 'delivered',
          resend_id: customerResult.id,
          resend_created_at: new Date().toISOString(),
        });

        results.push({ type: 'customer', result: customerResult });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully!',
      sender: senderConfig.sender_email,
      email_type: emailType,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[send-email] failure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      timestamp: new Date().toISOString(),
    });
  }
}
