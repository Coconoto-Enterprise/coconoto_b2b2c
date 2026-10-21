import { Resend } from 'resend';
import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
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
// `email_logs` had every privilege revoked from `anon` by
// 20260818000003_lock_pii_tables_and_policies_v3.sql, so logging with the anon
// key fails with 42501 and the send is silently never recorded. Use the
// service-role key (server-only) and keep the anon key purely as a local-dev
// fallback.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_ANON_KEY;
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

// Only addresses on this domain may receive the internal ("team") template.
const INTERNAL_DOMAIN = 'coconoto.africa';

// Brand constants shared by both bodies. Mirrors templates/users/* and
// templates/system/* so a Tweetit mail belongs to the same visual family as
// the order/receipt mails instead of being a bare-bones block.
const BRAND = {
  logo: 'https://www.coconoto.africa/CoconotoWhitePalmLogo.png',
  green: '#8CC63F',
  greenDark: '#618A42',
  brown: '#a37352',
  pageBg: '#f4f4f4',
  bodyText: '#a37352',
  footerBg: '#f8f8f8',
  internalFooterBg: '#333333',
  site: 'https://www.coconoto.africa',
  shop: 'https://www.coconoto.africa/cococycle-hub',
  privacy: 'https://www.coconoto.africa/privacy-policy',
  unsubscribe: 'mailto:team@coconoto.africa?subject=Unsubscribe',
  dashboard: 'https://www.coconoto.africa/vintage',
  phone: '+234 813 777 5689',
  email: 'coconotoenterprise@gmail.com',
  itSupport: 'https://wa.me/2349131678833',
  facebook: 'https://m.facebook.com/p/Coconoto-100092422418297/',
  instagram: 'https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw==',
  linkedin: 'https://www.linkedin.com/company/coconoto/',
};

/**
 * Customer-facing body — the branded "receipt" look: green header, greeting,
 * heading, message, signature, real help block, social + legal footer.
 * `heading` and `message` are HTML-escaped before interpolation.
 */
function buildCustomerTemplate(heading, message) {
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Coconoto</title></head>
<body style="margin:0;padding:0;background-color:${BRAND.pageBg};-webkit-text-size-adjust:100%;">
  <center style="width:100%;background-color:${BRAND.pageBg};">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">

      <!-- Header -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:${BRAND.green};">
        <tr><td align="center" style="padding:40px 0;">
          <img src="${BRAND.logo}" alt="Coconoto" width="200" style="display:block;border:0;max-width:100%;height:auto;">
          <h2 style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:bold;margin:10px 0 0 0;">Thank you for choosing Coconoto!</h2>
        </td></tr>
      </table>

      <!-- Body -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;">
        <tr><td align="left" style="padding:30px;font-family:Arial,sans-serif;font-size:16px;line-height:24px;color:${BRAND.bodyText};">

          <h1 style="font-size:24px;color:${BRAND.greenDark};margin:0 0 20px 0;">Dear Valued Customer,</h1>
          <p style="margin:0 0 20px 0;">We appreciate your interest in Coconoto and are always glad to help.</p>

          ${heading ? `<h2 style="font-size:22px;color:${BRAND.greenDark};margin:0 0 20px 0;border-bottom:2px solid ${BRAND.green};padding-bottom:10px;">${safeHeading}</h2>` : ''}

          <div style="margin:0 0 20px 0;white-space:pre-wrap;">${safeMessage}</div>

          <!-- Featured Products — same cards as templates/users/user-product.html -->
          <div style="margin:30px 0;">
            <h3 style="color:${BRAND.greenDark};text-align:center;margin:0 0 25px 0;font-size:20px;">&#129381; Featured Products</h3>
            <table border="0" cellpadding="0" cellspacing="10" width="100%" style="margin:20px 0;">
              <tr>
                <td width="33%" style="vertical-align:top;">
                  <div style="background-color:#ffffff;border:2px solid #e0e0e0;border-radius:8px;padding:15px;text-align:center;">
                    <img src="${BRAND.site}/assets/cocpeat1-03oJOxP8.jpeg" alt="Cocopeat" width="120" height="120" style="border-radius:8px;display:block;margin:0 auto 10px auto;border:0;">
                    <h4 style="color:${BRAND.brown};margin:10px 0 5px 0;font-size:16px;">Cocopeat</h4>
                    <p style="font-size:12px;color:#666666;margin:5px 0;line-height:16px;">Nutrient-rich growing medium.</p>
                    <div style="margin:10px 0;">
                      <span style="color:${BRAND.green};font-size:18px;font-weight:bold;">&#8358;10,000</span>
                      <span style="color:#999999;font-size:12px;">/5kg</span>
                    </div>
                    <a href="${BRAND.shop}" style="background-color:${BRAND.green};color:#ffffff;padding:8px 15px;text-decoration:none;border-radius:4px;font-size:12px;font-weight:bold;display:inline-block;margin-top:5px;">Order Now</a>
                  </div>
                </td>
                <td width="33%" style="vertical-align:top;">
                  <div style="background-color:#ffffff;border:2px solid #e0e0e0;border-radius:8px;padding:15px;text-align:center;">
                    <img src="${BRAND.site}/assets/fiber-Cx0Hxqe5.jpeg" alt="Fiber" width="120" height="120" style="border-radius:8px;display:block;margin:0 auto 10px auto;border:0;">
                    <h4 style="color:${BRAND.brown};margin:10px 0 5px 0;font-size:16px;">Fiber</h4>
                    <p style="font-size:12px;color:#666666;margin:5px 0;line-height:16px;">Biodegradable craft material.</p>
                    <div style="margin:10px 0;">
                      <span style="color:${BRAND.green};font-size:18px;font-weight:bold;">&#8358;15,000</span>
                      <span style="color:#999999;font-size:12px;">/A Sack</span>
                    </div>
                    <a href="${BRAND.shop}" style="background-color:${BRAND.green};color:#ffffff;padding:8px 15px;text-decoration:none;border-radius:4px;font-size:12px;font-weight:bold;display:inline-block;margin-top:5px;">Order Now</a>
                  </div>
                </td>
                <td width="33%" style="vertical-align:top;">
                  <div style="background-color:#ffffff;border:2px solid #e0e0e0;border-radius:8px;padding:15px;text-align:center;">
                    <img src="${BRAND.site}/assets/cocopot2-DJXRmWOe.jpg" alt="Cocopot" width="120" height="120" style="border-radius:8px;display:block;margin:0 auto 10px auto;border:0;">
                    <h4 style="color:${BRAND.brown};margin:10px 0 5px 0;font-size:16px;">Cocopot</h4>
                    <p style="font-size:12px;color:#666666;margin:5px 0;line-height:16px;">Eco-friendly plant containers.</p>
                    <div style="margin:10px 0;">
                      <span style="color:${BRAND.green};font-size:18px;font-weight:bold;">&#8358;10,000</span>
                      <span style="color:#999999;font-size:12px;">/Pot</span>
                    </div>
                    <a href="${BRAND.shop}" style="background-color:${BRAND.green};color:#ffffff;padding:8px 15px;text-decoration:none;border-radius:4px;font-size:12px;font-weight:bold;display:inline-block;margin-top:5px;">Order Now</a>
                  </div>
                </td>
              </tr>
            </table>
            <div style="text-align:center;margin:20px 0;">
              <a href="${BRAND.shop}" style="color:${BRAND.green};text-decoration:none;font-weight:bold;font-size:14px;border-bottom:2px solid ${BRAND.green};">View All Products &#8594;</a>
            </div>
          </div>

          <div style="background-color:#fff8e7;padding:15px;border-radius:5px;margin:20px 0;border:1px solid #f0d000;">
            <p style="margin:0;font-size:14px;color:#b8860b;">
              <strong>&#128161; Did you know?</strong> Coconoto provides premium coconut products sourced directly from local farmers, ensuring quality and supporting sustainable agriculture.
            </p>
          </div>

          <p style="margin:30px 0 0 0;">
            Warm regards,<br>
            <strong>The Coconoto Customer Team</strong><br>
            <em>Your trusted partner in coconut excellence</em>
          </p>

          <p style="margin:20px 0 0 0;">
            <strong>Need immediate assistance?</strong><br>
            &#128222; <strong>${BRAND.phone}</strong><br>
            &#128231; <strong>${BRAND.email}</strong><br>
            &#127760; <a href="${BRAND.site}" style="color:${BRAND.green};text-decoration:none;font-weight:bold;">www.coconoto.africa</a>
          </p>

        </td></tr>
      </table>

      <!-- Footer -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:${BRAND.footerBg};">
        <tr><td align="center" style="padding:20px 0;font-family:Arial,sans-serif;font-size:12px;color:${BRAND.bodyText};">
          <div style="margin-bottom:15px;">
            <a href="${BRAND.facebook}" style="color:${BRAND.green};text-decoration:none;margin:0 10px;">Facebook</a>
            <a href="${BRAND.instagram}" style="color:${BRAND.green};text-decoration:none;margin:0 10px;">Instagram</a>
            <a href="${BRAND.linkedin}" style="color:${BRAND.green};text-decoration:none;margin:0 10px;">LinkedIn</a>
          </div>
          <p style="margin:5px 0;">&copy; ${year} Coconoto Limited | All Rights Reserved</p>
          <p style="margin:5px 0;color:#888;">
            <a href="${BRAND.unsubscribe}" style="color:#888;text-decoration:none;">Unsubscribe</a> |
            <a href="${BRAND.privacy}" style="color:#888;text-decoration:none;">Privacy Policy</a>
          </p>
        </td></tr>
      </table>

    </div>
  </center>
</body></html>`;
}

/**
 * Internal ("team") body — deliberately unmistakable: brown header with an
 * INTERNAL NOTE eyebrow, System Info strip, dashboard button and the dark
 * "Internal System" footer. `heading` and `message` are HTML-escaped.
 */
function buildTeamTemplate(heading, message) {
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const year = new Date().getFullYear();
  const generatedAt = escapeHtml(new Date().toLocaleString('en-GB'));
  const refId = Math.random().toString(36).slice(2, 11);
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Coconoto - Internal Note</title></head>
<body style="margin:0;padding:0;background-color:#f0f0f0;-webkit-text-size-adjust:100%;">
  <center style="width:100%;background-color:#f0f0f0;">
    <div style="max-width:700px;margin:0 auto;background-color:#ffffff;">

      <!-- Header -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;background-color:${BRAND.brown};">
        <tr><td align="center" style="padding:40px 25px;">
          <img src="${BRAND.logo}" alt="Coconoto" width="200" style="display:inline-block;border:0;max-width:100%;height:auto;">
          <h2 style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;margin:10px 0 0 0;">Thank you for choosing Coconoto!</h2>
        </td></tr>
      </table>

      <!-- Body -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;background-color:#ffffff;">
        <tr><td align="left" style="padding:25px;font-family:Arial,sans-serif;font-size:15px;line-height:22px;color:#333333;">

          ${heading ? `<h2 style="font-size:24px;color:${BRAND.brown};margin:0 0 20px 0;border-bottom:2px solid ${BRAND.green};padding-bottom:10px;">${safeHeading}</h2>` : ''}

          <div style="margin:0 0 20px 0;white-space:pre-wrap;">${safeMessage}</div>

          <div style="background-color:#f8f8f8;padding:15px;border-radius:3px;margin:20px 0;font-size:12px;color:#666666;">
            <strong>System Info:</strong> Generated on ${generatedAt} | Reference ID: ${refId} | Source: coconoto.africa
          </div>

          <div style="text-align:center;margin:25px 0;">
            <a href="${BRAND.dashboard}" style="background-color:${BRAND.brown};color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:3px;display:inline-block;font-weight:bold;">View Dashboard</a>
          </div>

        </td></tr>
      </table>

      <!-- Internal footer -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;background-color:${BRAND.internalFooterBg};">
        <tr><td align="center" style="padding:15px 0;font-family:Arial,sans-serif;font-size:11px;color:#cccccc;">
          <p style="margin:5px 0;">
            <strong>Coconoto Limited - Internal System</strong><br>
            This is an automated notification. Do not reply to this email.
          </p>
          <p style="margin:5px 0;color:#999999;">
            <a href="${BRAND.itSupport}" style="color:${BRAND.green};text-decoration:none;">IT Support</a>
          </p>
          <p style="margin:5px 0;font-size:10px;">&copy; ${year} Coconoto Internal Communications System</p>
        </td></tr>
      </table>

    </div>
  </center>
</body></html>`;
}

/**
 * Recipient addresses are no longer restricted to a sender-domain allowlist:
 * the composer is used to mail customers, vendors and partners on their own
 * domains, so any syntactically valid address is accepted.
 *
 * The remaining abuse controls are the composer login gate (`mail_users`, via
 * `authorizeComposer`) and the attachment MIME/size allowlist below.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecipientAllowed = (email) => EMAIL_RE.test(String(email || '').trim().toLowerCase());

/**
 * Verify the caller is a real, active `mail_users` row.
 *
 * The dashboards keep their session in localStorage (`tweetitUser` /
 * `currentMailUser`) and send `senderId` + `senderEmail` with every send, so
 * this re-checks both against the database — the client-supplied values are
 * never trusted. Mirrors `resolveRequester` in api/email-data.js.
 *
 * Returns the matched user record, or null.
 */
async function authorizeComposer(senderId, senderEmail) {
  const id = String(senderId || '').trim();
  const claimed = String(senderEmail || '').trim().toLowerCase();
  if (!supabase || !id || !EMAIL_RE.test(claimed)) return null;

  try {
    const { data, error } = await supabase
      .from('mail_users')
      .select('id, login_email, sender_email, role, is_active')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) return null;

    // The claimed address must be one of the addresses this user owns.
    const known = [data.login_email, data.sender_email]
      .map((v) => String(v || '').trim().toLowerCase())
      .filter(Boolean);
    return known.includes(claimed) ? data : null;
  } catch (err) {
    console.error('[send-custom-email] composer auth check failed:', err?.message);
    return null;
  }
}

export default async function handler(req, res) {
  applyCorsAllowlist(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Admin mail composer. Callers must be a real, active row in `mail_users`
  // (the same hand-rolled session the dashboards already keep in
  // localStorage) — without it this endpoint is an open relay, since the
  // recipient allowlist was removed. Abuse is further bounded by the
  // attachment MIME/size allowlist.
  // Auth runs below, once `senderId` / `senderEmail` have been parsed.

  try {
    const contentType = req.headers['content-type'] || '';
    let to, subject, message, heading, templateType, senderEmail, senderId;
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
      senderEmail = Array.isArray(fields.senderEmail) ? fields.senderEmail[0] : fields.senderEmail;
      senderId = Array.isArray(fields.senderId) ? fields.senderId[0] : fields.senderId;

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
      senderEmail = body.senderEmail;
      senderId = body.senderId;
    }

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, message',
      });
    }

    // Auth gate, after parsing: the caller must prove they hold a live
    // `mail_users` session before we relay anything on our domain's behalf.
    const composerUser = await authorizeComposer(senderId, senderEmail);
    if (!composerUser) {
      return res.status(401).json({
        success: false,
        error: 'Your session is no longer valid. Please sign in again.',
      });
    }

    const recipients = Array.isArray(to) ? to : String(to).split(',').map((e) => e.trim());
    // Now only a syntax check — the address may be on any domain.
    const invalidRecipient = recipients.find((email) => !isRecipientAllowed(email));
    if (invalidRecipient) {
      return res.status(400).json({
        success: false,
        error: `Invalid recipient address: ${invalidRecipient}`,
      });
    }

    const cleanSubject = sanitizeHeaderValue(subject);
    if (!cleanSubject) {
      return res.status(400).json({ success: false, error: 'Subject is required (after sanitization)' });
    }

    // Template choice is recipient-driven, never purely client-driven.
    //
    // The team body ("System Info", "© Coconoto Internal Communications
    // System") is an internal artefact. Previously the only thing standing
    // between a customer and that body was the `templateType` string the
    // dashboard happened to post, so a stale/mis-set Team selection in the
    // composer was enough to put the internal template in a customer's inbox.
    // Now: the team body is only ever used when EVERY recipient is on our own
    // domain. Anything external gets the customer body, no matter what the
    // client asked for.
    const allInternal = recipients.every((email) =>
      String(email).trim().toLowerCase().endsWith(`@${INTERNAL_DOMAIN}`)
    );
    const requestedTeam = templateType === 'team';
    const useTeamTemplate = requestedTeam && allInternal;
    const templateUsed = useTeamTemplate ? 'team' : 'customer';

    if (requestedTeam && !allInternal) {
      console.warn(
        '[send-custom-email] team template requested for non-internal recipients — sending customer template instead'
      );
    }

    // The Subject doubles as the body heading when no Heading is typed, so
    // "PRODUCT ORDER" / "Dear Valued Customer" land where the order mails put
    // them. An explicit Heading still wins.
    const bodyHeading = String(heading || subject || '').trim();

    const htmlContent = useTeamTemplate
      ? buildTeamTemplate(bodyHeading, message)
      : buildCustomerTemplate(bodyHeading, message);

    // The from address is always our own domain — never trust a client-provided
    // sender address (phishing).
    const safeFromName = sanitizeHeaderValue(useTeamTemplate
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
      // The envelope `from` stays on our own verified domain — a client-supplied
      // sender address is never trusted (phishing). We do record WHO sent it so
      // the dashboard's per-mailbox views work. `sent_by_id` is deliberately not
      // written: the local migration points that FK at `public.email_users`,
      // which does not exist in this project (the live table is `mail_users`),
      // so a stale constraint there would reject the whole row.
      const attributedSender = /@coconoto\.africa$/i.test(String(senderEmail || '').trim())
        ? String(senderEmail).trim().toLowerCase()
        : null;

      const logRow = {
        from_address: safeFromDomain,
        to_addresses: recipients,
        subject: cleanSubject,
        preview: message ? String(message).slice(0, 500) : null,
        full_html: htmlContent,
        // Log what was actually rendered, not what the client claimed.
        email_type: templateUsed,
        status: emailStatus,
        resend_id: result?.id || null,
        resend_created_at: result?.created_at || null,
        sent_by_email: attributedSender,
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
      // Lets the dashboard confirm which body actually went out.
      template_used: templateUsed,
      template_requested: requestedTeam ? 'team' : 'customer',
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
