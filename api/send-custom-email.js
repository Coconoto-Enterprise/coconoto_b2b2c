import { Resend } from 'resend';
import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  requireApiKey,
  applyCorsAllowlist,
  escapeHtml,
  sanitizeHeaderValue,
} from './_shared-auth.js';
import { detectMimeFromBuffer } from './_attachment-magic.js';

function determineEmailStatus(result) {
  if (!result) return 'failed';
  if (result.error) return 'failed';
  if (result.id) return 'delivered';
  if (result.data?.id) return 'delivered';
  if (typeof result.status === 'string' && result.status.trim()) return result.status;
  return 'failed';
}

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.error('[send-custom-email] Supabase client not configured.');
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle FormData
  },
};

const ALLOWED_ATTACHMENT_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'text/plain',
]);

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10MB per file
const MAX_ATTACHMENT_COUNT = 5;

/**
 * Build a customer-facing template. Both `heading` and `message` are
 * HTML-escaped before interpolation.
 */
function buildCustomerTemplate(heading, message) {
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  return `<!DOCTYPE html>
    <html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:30px;">
        <div style="background-color:#8CC63F;text-align:center;padding:40px 0;">
          <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto" width="200" style="display:block;border:0;max-width:100%;">
          <h2 style="color:white;font-family:Arial,sans-serif;font-size:18px;margin:10px 0 0 0;">Thank you for choosing Coconoto!</h2>
        </div>
        ${heading ? `<h2 style="font-size:24px;color:#618A42;margin:0 0 20px 0;border-bottom:2px solid #8CC63F;padding-bottom:10px;">${safeHeading}</h2>` : ''}
        <div style="margin-bottom:20px;white-space:pre-wrap;">${safeMessage}</div>
        <p style="margin-top:30px;">Warm regards,<br><strong>The Coconoto Customer Team</strong></p>
        <p style="margin-top:20px;font-size:12px;color:#888;">© ${new Date().getFullYear()} Coconoto Limited | All Rights Reserved</p>
      </div>
    </body></html>`;
}

/**
 * Build a team-facing template. Both `heading` and `message` are HTML-escaped.
 */
function buildTeamTemplate(heading, message) {
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  return `<!DOCTYPE html>
    <html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f0f0f0;font-family:Arial,sans-serif;">
      <div style="max-width:700px;margin:0 auto;background-color:#ffffff;padding:25px;">
        <div style="background-color:#a37352;text-align:center;padding:40px 25px;">
          <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto" width="200" style="display:block;border:0;max-width:100%;">
        </div>
        ${heading ? `<h2 style="font-size:24px;color:#a37352;margin:0 0 20px 0;border-bottom:2px solid #8CC63F;padding-bottom:10px;">${safeHeading}</h2>` : ''}
        <div style="margin-bottom:20px;white-space:pre-wrap;">${safeMessage}</div>
        <div style="background-color:#f8f8f8;padding:15px;font-size:12px;color:#666;">
          <strong>System Info:</strong> Generated on ${escapeHtml(new Date().toLocaleString('en-GB'))} | Source: coconoto.africa
        </div>
        <p style="font-size:10px;color:#999;">© ${new Date().getFullYear()} Coconoto Internal Communications System</p>
      </div>
    </body></html>`;
}

const ALLOWED_RECIPIENT_DOMAINS = (process.env.CUSTOM_EMAIL_ALLOWED_DOMAINS || 'coconoto.africa')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const isRecipientAllowed = (email) => {
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return false;
  const domain = e.split('@')[1];
  return ALLOWED_RECIPIENT_DOMAINS.includes(domain);
};

export default async function handler(req, res) {
  applyCorsAllowlist(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!requireApiKey(req, res)) return;

  try {
    const contentType = req.headers['content-type'] || '';
    let to, subject, message, heading, templateType;
    let attachments = [];

    if (contentType.includes('multipart/form-data')) {
      const form = formidable({
        multiples: true,
        maxFileSize: MAX_ATTACHMENT_BYTES,
        maxFiles: MAX_ATTACHMENT_COUNT,
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      to = Array.isArray(fields.to) ? fields.to[0] : fields.to;
      subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
      message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
      heading = Array.isArray(fields.heading) ? fields.heading[0] : fields.heading;
      templateType = Array.isArray(fields.templateType) ? fields.templateType[0] : fields.templateType;

      if (files.attachments) {
        const fileArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];
        for (const file of fileArray) {
          const fileContent = fs.readFileSync(file.filepath);
          // Detect the real MIME type from magic bytes; the user-supplied
          // mimetype is intentionally ignored for policy decisions.
          const detectedMime = detectMimeFromBuffer(fileContent);
          if (!detectedMime || !ALLOWED_ATTACHMENT_MIMES.has(detectedMime)) {
            return res.status(400).json({
              success: false,
              error: `Unsupported attachment type: ${detectedMime || 'unknown'}`,
            });
          }
          // Sanitize filename to printable ASCII / no path traversal.
          const safeFilename = String(file.originalFilename || 'attachment')
            .replace(/[^\w.\-]+/g, '_')
            .slice(0, 200);
          attachments.push({
            filename: safeFilename,
            content: fileContent,
            contentType: detectedMime,
          });
        }
      }
    } else {
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
        error: 'Missing required fields: to, subject, message',
      });
    }

    const recipients = Array.isArray(to) ? to : String(to).split(',').map((e) => e.trim());
    for (const email of recipients) {
      if (!isRecipientAllowed(email)) {
        return res.status(400).json({
          success: false,
          error: `Recipient not on allowlist: ${email}. Configure CUSTOM_EMAIL_ALLOWED_DOMAINS.`,
        });
      }
    }

    const cleanSubject = sanitizeHeaderValue(subject);
    if (!cleanSubject) {
      return res.status(400).json({ success: false, error: 'Subject is required (after sanitization)' });
    }

    let htmlContent;
    if (templateType === 'team') {
      htmlContent = buildTeamTemplate(heading || '', message);
    } else {
      htmlContent = buildCustomerTemplate(heading || '', message);
    }

    // The from address is always our own domain — never trust a client-provided
    // sender address (phishing).
    const safeFromName = sanitizeHeaderValue(templateType === 'team'
      ? 'Coconoto Internal Team'
      : 'Coconoto Customer Service');
    const safeFromDomain = 'team@coconoto.africa';
    const fromAddress = `${safeFromName} <${safeFromDomain}>`;

    const emailData = {
      from: fromAddress,
      to: recipients,
      subject: cleanSubject,
      html: htmlContent,
    };

    if (attachments.length > 0) {
      emailData.attachments = attachments;
    }

    const result = await resend.emails.send(emailData);
    const emailStatus = determineEmailStatus(result);

    let logResult = null;
    if (supabase) {
      const logRow = {
        from_address: safeFromDomain,
        to_addresses: recipients,
        subject: cleanSubject,
        preview: message ? String(message).slice(0, 500) : null,
        full_html: htmlContent,
        email_type: templateType || null,
        status: emailStatus,
        resend_id: result?.id || null,
        resend_created_at: result?.created_at || null,
      };
      try {
        const { data: logData, error: logError } = await supabase.from('email_logs').insert([logRow]);
        if (logError) {
          console.error('[send-custom-email] log insert failed:', logError?.message);
          logResult = { success: false, error: logError?.message };
        } else {
          logResult = { success: true, data: logData };
        }
      } catch (logError) {
        console.error('[send-custom-email] unexpected log error:', logError?.message);
        logResult = { success: false, error: logError?.message };
      }
    }

    return res.status(200).json({
      success: true,
      message: `Email sent successfully${attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`,
      emailId: result?.id,
      status: emailStatus,
      attachmentCount: attachments.length,
      log: logResult,
    });
  } catch (error) {
    console.error('[send-custom-email] error:', error?.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
    });
  }
}
