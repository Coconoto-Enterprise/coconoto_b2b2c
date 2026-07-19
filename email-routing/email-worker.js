// Cloudflare Email Worker: inbound-mail-notify
//
// Attach this Worker to your Email Routing rules (one rule per coconoto
// address). For every inbound mail it:
//   1. forwards the original message to the real destination inbox, and
//   2. sends a notification email (via Resend) containing a Reply button
//      that opens the Tweetit dashboard composer with the sender's address
//      already in the Recipients box.
//
// Required Worker variables (Settings → Variables):
//   RESEND_API_KEY  (secret)  – your Resend API key
//   TWEETIT_URL               – https://www.coconoto.africa/tweetit-dashboard
//   NOTIFY_FROM               – verified Resend sender, e.g. notify@coconoto.africa

// Where each routed address actually delivers. The notification is also
// sent to this inbox. Add one line per routing rule.
const FORWARD_MAP = {
  'info@coconoto.africa': 'infococonoto@gmail.com',
  'support@coconoto.africa': 'infococonoto@gmail.com',
  'team@coconoto.africa': 'infococonoto@gmail.com',
  'jacob.abiodun@coconoto.africa': 'jacobabiodun10@gmail.com',
};

const escapeHtml = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export default {
  async email(message, env, ctx) {
    const from = message.from;                 // the outside sender
    const to = message.to;                     // the coconoto address hit
    const subject = message.headers.get('subject') || '(no subject)';
    const destination = FORWARD_MAP[to.toLowerCase()];

    // 1) Forward the original mail so the normal inbox flow is unchanged.
    if (destination) {
      await message.forward(destination);
    }

    // 2) Fire the Reply-button notification. Failures here must never block
    //    delivery, so it runs via waitUntil and swallows errors.
    ctx.waitUntil(sendNotification(env, { from, to, subject, destination }));
  },
};

async function sendNotification(env, { from, to, subject, destination }) {
  try {
    const base = (env.TWEETIT_URL || 'https://www.coconoto.africa/tweetit-dashboard').replace(/\/$/, '');
    const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
    const replyUrl =
      `${base}?compose=1&to=${encodeURIComponent(from)}&subject=${encodeURIComponent(replySubject)}`;

    const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f8f6;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#15803d;padding:16px 24px;">
        <p style="margin:0;color:#ffffff;font-size:16px;font-weight:bold;">📬 New inbound mail</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#6b7280;width:80px;">From</td>
            <td style="padding:6px 0;font-weight:bold;">${escapeHtml(from)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;">To</td>
            <td style="padding:6px 0;">${escapeHtml(to)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Subject</td>
            <td style="padding:6px 0;">${escapeHtml(subject)}</td>
          </tr>
        </table>
        <div style="text-align:center;margin:28px 0 8px;">
          <a href="${replyUrl}"
             style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 36px;border-radius:999px;">
            Reply from Tweetit
          </a>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
          Opens the Tweetit composer with ${escapeHtml(from)} already in the recipient box.
        </p>
      </div>
    </div>
  </body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || 'notify@coconoto.africa',
        to: destination || to,
        subject: `📬 ${from} → ${to}: ${subject}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error('Notification send failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Notification error:', err);
  }
}
