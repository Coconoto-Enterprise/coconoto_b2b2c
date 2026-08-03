# Inbound Email → Reply Button Inside the Mail Itself

Every mail that comes through Cloudflare Email Routing is re-delivered to
your inbox as ONE email: the original subject, body, and attachments, with
a green **"↩ Reply from Tweetit"** banner injected at the top. Clicking it
opens the Tweetit dashboard composer with the sender's address already in
the Recipients box and "Re: <subject>" as the subject.

```
someone@gmail.com  →  info@coconoto.africa
                        │
              Cloudflare routing rule → Worker
                        │
         Worker parses the mail, injects the Reply
         banner at the top, re-sends it via Resend
                        │
                        ▼
   Your inbox gets the original mail WITH the button in it
   (native "Reply" in Gmail still works too, via Reply-To)
```

If injection ever fails, the worker falls back to a plain forward — mail
is never lost.

## Deploy (one time)

Needs Node on your machine (you have it). From the repo root:

```bash
cd email-routing
npm install
npx wrangler login          # opens browser, authorize your Cloudflare account
npx wrangler secret put RESEND_API_KEY   # paste the same key Vercel uses
npx wrangler deploy
```

Before deploying, edit `FORWARD_MAP` at the top of `email-worker.js` —
one line per coconoto address, mapping it to the inbox that should
receive the mail. `wrangler.toml` holds `TWEETIT_URL` and `NOTIFY_FROM`
(NOTIFY_FROM must be a verified sender in Resend).

## Point the routing rules at the worker

Cloudflare dashboard → your zone → **Email → Email Routing → Routing
rules** → edit each address → change the action to
**Run Worker → inbound-mail-notify**.

## Test

Send a mail from a personal address to info@coconoto.africa. Within a
minute the destination inbox receives it with the green banner on top.
Click the button → Tweetit composer opens prefilled (login first if
needed — the prefill survives login).

## Notes

- The re-sent mail arrives "from" `NOTIFY_FROM` with the original
  sender's name in the display name; `Reply-To` is set to the original
  sender, so replying natively from Gmail also works.
- The Tweetit deep link (`?compose=1&to=...&subject=...`) is handled in
  `src/pages/TweetitDashboard.tsx` — make sure the main app is deployed.
