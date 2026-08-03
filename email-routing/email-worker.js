// Cloudflare Email Worker: inbound-mail-notify
//
// For every mail that hits a routing rule, this worker parses the original
// message and re-sends it to your real inbox with a "Reply from Tweetit"
// button injected at the top of the body. You receive ONE email — the
// original content with the button embedded — not a separate notification.
//
// Why re-send instead of forward? Cloudflare forwards messages unmodified
// (changing a message would break DKIM signatures), so injecting a button
// into a plain forward is impossible. Re-sending via Resend is the way.
// If the re-send fails for any reason, the worker falls back to a normal
// forward so mail is never lost.
//
// Deploy with wrangler (needs the postal-mime npm package — see README):
//   cd email-routing && npm install && npx wrangler deploy
//
// Secrets/vars (wrangler.toml + `npx wrangler secret put RESEND_API_KEY`):
//   RESEND_API_KEY  – your Resend API key
//   TWEETIT_URL     – https://www.coconoto.africa/tweetit-dashboard
//   NOTIFY_FROM     – verified Resend sender, e.g. mail@coconoto.africa

import PostalMime from 'postal-mime';

// Where each routed coconoto address actually delivers.
// Add one line per routing rule.
const FORWARD_MAP = {
  'info@coconoto.africa': 'infococonoto@gmail.com',
  'support@coconoto.africa': 'infococonoto@gmail.com',
  'team@coconoto.africa': 'infococonoto@gmail.com',
  'jacob.abiodun@coconoto.africa': 'jacobabiodun10@gmail.com',
};

const escapeHtml = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const toBase64 = (data) => {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const replyBanner = (replyUrl, from) => `
<div style="border:1px solid #bbf7d0;background:#f0fdf4;border-radius:12px;padding:16px 20px;margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="font-size:13px;color:#166534;">
      <strong>From:</strong> ${escapeHtml(from)}<br/>
      <span style="color:#4d7c0f;">Reply straight from the Tweetit dashboard — recipient is prefilled.</span>
    </td>
    <td align="right" style="vertical-align:middle;">
      <a href="${replyUrl}"
         style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:10px 26px;border-radius:999px;white-space:nowrap;">
        ↩ Reply from Tweetit
      </a>
    </td>
  </tr></table>
</div>`;

export default {
  async email(message, env, ctx) {
    const to = message.to.toLowerCase();
    const destination = FORWARD_MAP[to];

    if (!destination) {
      // Unknown address: just forward wherever the catch-all points, if any.
      return;
    }

    try {
      const parsed = await new PostalMime().parse(await message.raw());

      const fromAddr = parsed.from?.address || message.from;
      const fromName = parsed.from?.name || fromAddr;
      const subject = parsed.subject || '(no subject)';

      const base = (env.TWEETIT_URL || 'https://www.coconoto.africa/tweetit-dashboard').replace(/\/$/, '');
      const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
      const replyUrl =
        `${base}?compose=1&to=${encodeURIComponent(fromAddr)}&subject=${encodeURIComponent(replySubject)}`;

      // Original body with the button injected at the top.
      const banner = replyBanner(replyUrl, `${fromName} <${fromAddr}>`);
      const originalHtml = parsed.html
        || `<pre style="font-family:inherit;white-space:pre-wrap;">${escapeHtml(parsed.text || '')}</pre>`;
      const html = `${banner}${originalHtml}`;

      const attachments = (parsed.attachments || []).map((att) => ({
        filename: att.filename || 'attachment',
        content: toBase64(att.content),
      }));

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Show who it's really from in the display name; Reply-To keeps
          // native mail-client replies going to the original sender too.
          from: `${fromName.replace(/[<>"]/g, '')} via Coconoto <${env.NOTIFY_FROM || 'mail@coconoto.africa'}>`,
          to: destination,
          reply_to: fromAddr,
          subject,
          html,
          attachments: attachments.length ? attachments : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      // Never lose mail: fall back to a plain forward without the button.
      console.error('Inject-and-resend failed, forwarding original:', err);
      await message.forward(destination);
    }
  },
};
