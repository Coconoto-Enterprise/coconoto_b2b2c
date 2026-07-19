# Inbound Email → Tweetit Reply Button

## How it works

```
someone@gmail.com  →  info@coconoto.africa
                        │
                        ▼
        Cloudflare Email Routing rule fires the Worker below
                        │
                        ├── 1. forwards the original mail to your inbox (unchanged)
                        └── 2. sends a "New inbound mail" notification via Resend
                               containing a REPLY button that links to:
        https://www.coconoto.africa/tweetit-dashboard?compose=1&to=someone@gmail.com&subject=Re:...
                        │
                        ▼
        Clicking REPLY opens the Tweetit dashboard with the composer
        already open and the sender's address prefilled in Recipients.
        (If logged out, you land on login and are forwarded after login.)
```

The dashboard deep link is already implemented — `/tweetit-dashboard?compose=1&to=<email>&subject=<subject>` opens the composer prefilled. The Worker is what generates that link from each inbound mail.

## Setup (one time, ~10 minutes)

1. Cloudflare dashboard → your `coconoto.africa` zone → **Workers & Pages → Create Worker**.
   Name it `inbound-mail-notify`, paste the code from `email-worker.js` (this folder).

2. Worker → **Settings → Variables** → add:
   - `RESEND_API_KEY` (secret) — same key as in Vercel
   - `TWEETIT_URL` — `https://www.coconoto.africa/tweetit-dashboard`
   - `NOTIFY_FROM` — `notify@coconoto.africa` (any verified sender on Resend)

3. **Email → Email Routing → Routing rules**: for each address
   (info@, support@, team@, jacob.abiodun@ …) change the action from
   "Send to an email" to **Run Worker → inbound-mail-notify**.
   Put the final destination inbox for each address in the
   `FORWARD_MAP` at the top of the worker.

That's it — every inbound mail still lands in the usual inbox, plus each
routed address gets a notification with the one-click Reply button.
