# Clerk setup — CoCo-Connect sign in / sign up

The two auth screens (`/buyer-login`, `/buyer-signup`) already talk to Clerk —
the code is in place. Everything below is what only you can do, because it lives
in accounts and dashboards I don't have.

Until `VITE_CLERK_PUBLISHABLE_KEY` exists, both pages keep using the original
`/api/auth` email + password flow. Nothing is broken in the meantime, and the
Google button reports "not available yet".

## Where we are (2026-10-19)

| Step | Status |
|---|---|
| Clerk application + live instance | done |
| Email + Password, min length 8 | done |
| Email verification code (matches the "Check Your Email" screen) | done |
| Google connection + OAuth client ID/secret | done |
| `buyers.clerk_user_id` migration | run in the Supabase SQL editor |
| DNS: `clerk`, `accounts`, `clkmail`, `clk._domainkey`, `clk2._domainkey` | **all five resolve, Clerk shows Verified** |
| SSL certificate for `clerk.coconoto.africa` | **issuing** — automatic, minutes |
| `VITE_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` on Vercel | **still to do — the remaining blocker** |
| Google consent screen published (Audience → Publish app) | still in Testing |

Verified against public DNS on 2026-10-19:

```
clerk.coconoto.africa            -> frontend-api.clerk.services.
accounts.coconoto.africa         -> accounts.clerk.services.
clkmail.coconoto.africa          -> mail.482t0ia9ma9u.clerk.services.
clk._domainkey.coconoto.africa   -> dkim1.482t0ia9ma9u.clerk.services.
clk2._domainkey.coconoto.africa  -> dkim2.482t0ia9ma9u.clerk.services.
```

## How it works (so the settings below make sense)

```
browser ──Clerk──> verifies the password / Google account
   │
   └─ session JWT ──> POST /api/auth { action: "clerk-session" }
                          │ verifies the JWT with CLERK_SECRET_KEY
                          │ finds or creates the buyers row
                          └─> sets the SAME marketplace cookie as before
```

Clerk replaces the *credential*, not the profile. `buyers` still owns the row,
so `/api/marketplace`, both dashboards and the order flow are untouched.

## 1. Create the Clerk application

1. https://dashboard.clerk.com → **Create application**.
2. Name it `Coconoto`, and enable **Email** and **Google** as sign-in options.
3. Start in the **Development** instance — its keys are free and its Google
   connection uses Clerk's shared OAuth client, so Google works immediately.

## 2. Turn on the two strategies

**User & Authentication → Email, Phone, Username**
- Email address: **required**
- Password: **on**, minimum length **8** (the sign-up form enforces 8)
- Sign-up with email verification: **Email verification code** — the design now
  has a matching "Check Your Email" step. If you switch verification *off*, the
  form skips straight through; both paths are handled.

**User & Authentication → Social connections → Google**: enable.
> For the **production** instance Clerk will ask for your own Google OAuth
> client (Google Cloud Console → Credentials → OAuth client → Web application,
> authorised redirect URI = the one Clerk shows you). Development instances use
> Clerk's shared client and need nothing.

## 3. Copy the keys

**API keys** in the dashboard:

| Key | Goes where | Exposed to browser? |
|---|---|---|
| `pk_test_…` / `pk_live_…` | `VITE_CLERK_PUBLISHABLE_KEY` | yes, by design |
| `sk_test_…` / `sk_live_…` | `CLERK_SECRET_KEY` | **never** |

Locally, add both to `.env.local`. On Vercel, **Project → Settings → Environment
Variables**, add both for Production (and Preview if you want it there), then
redeploy — Vite inlines `VITE_*` at build time, so a redeploy is required.

## 4. Run the migration

`supabase/migrations/20261018000001_clerk_identity.sql` adds
`buyers.clerk_user_id` and makes `buyers.password_hash` nullable.

```bash
supabase db push
# or paste the file into the Supabase SQL editor
```

Without it, `clerk-session` returns a 503 that names the missing file.

## 5. Domains and DNS (done)

**Domains** in Clerk: `coconoto.africa` is added to the production instance and
shows **Verified**. The five CNAMEs below live in Cloudflare
(`coconoto.africa` → DNS → Records). All are **Proxy status: DNS only (grey
cloud)** — the orange cloud breaks Clerk's verification.

| Type | Name | Target | Covers |
|---|---|---|---|
| `CNAME` | `clerk` | `frontend-api.clerk.services` | Frontend API — sign-in cannot load without it |
| `CNAME` | `accounts` | `accounts.clerk.services` | Hosted account pages |
| `CNAME` | `clkmail` | `mail.482t0ia9ma9u.clerk.services` | Mail return-path / bounces |
| `CNAME` | `clk._domainkey` | `dkim1.482t0ia9ma9u.clerk.services` | DKIM key 1 |
| `CNAME` | `clk2._domainkey` | `dkim2.482t0ia9ma9u.clerk.services` | DKIM key 2 |

The three email records are what keep the verification code out of spam. Without
DKIM, Gmail/Outlook cannot prove the message was authorised by
`coconoto.africa`, which is exactly the pattern spam filters are built to catch.
They are subdomains — your apex `MX` records and `team@coconoto.africa` are
untouched.

`localhost:5173` is on the development instance by default. A **production**
instance refuses `http://localhost` as an origin, which is why local dev keeps
the `pk_test_…` key in `.env.local` and production keeps `pk_live_…` in
`.env.production.local` (gitignored).

## 6. Existing buyers — pick one

`buyers` already holds real accounts with bcrypt hashes. On first Clerk
sign-in the bridge looks the buyer up by `clerk_user_id`, then by **email**, and
claims the row — so the profile, orders and addresses survive either way.

The gap is the *credential*:

- **Buyers who use Google with the same email** — nothing to do. Their first
  Google sign-in claims the existing row automatically.
- **Buyers who expect their old password** — Clerk doesn't know it yet. Either:
  - **Import them** (recommended): Clerk dashboard → **Users → Import**, upload
    `email` + `password_hash` with `password_hasher: bcrypt`. Their existing
    passwords then work unchanged. Export with
    `select email, password_hash from buyers;`.
  - or have them use **Forgot password** (built, see §6a) — but only once Clerk
    knows the address. A buyer who exists only in `buyers` and never signed in
    through Clerk has no Clerk account yet, so the reset correctly answers
    "we could not find an account with that email". Import is the real fix.

## 6a. Forgot password (`/buyer-reset-password`)

Headless, two steps, no Clerk-hosted page:

1. `signIn.create({ strategy: 'reset_password_email_code', identifier })` mails a
   6-digit code.
2. `signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code,
   password })` returns a live session.

The session is then bridged into `coconoto_marketplace_session` by the same
`/api/auth {action:'clerk-session'}` exchange a normal sign-in uses, so the buyer
lands on `/cococonnect` already signed in. Nothing on the backend changed.

**Clerk dashboard dependency:** the code email comes from the **"Reset password
code"** template (Customization → Emails). If it is disabled or the instance is
in a mode that blocks that strategy, step 1 fails with a strategy error. Verify
with one real reset before announcing the feature.

**Vendors are not covered** — they still live on bcrypt in `vendors`, so the
"no account" message points sellers at support@coconoto.africa.

**Content blockers:** clerk-js loads from `clerk.coconoto.africa`. When it is
blocked, the page cannot reach Clerk at all; the submit now says so explicitly
instead of doing nothing.

**Local dev caveat:** the production publishable key is domain-locked to
`coconoto.africa`, so Clerk returns `origin_invalid` on `localhost` and this
page can only be tested end-to-end on the deployed domain.

## 7. Vendors are not affected

`/vendor-login` and the `vendors` table keep their bcrypt passwords. The buyer
form still falls back to the vendor lookup when Clerk rejects the credentials,
so a seller can keep using the same form. Migrating vendors to Clerk is a
separate decision — say the word and I'll do it the same way.

## Google branding verification

Clerk only requests `openid`, `email` and `profile` — all **non-sensitive** — so Google does not
require a review. Publishing is just **Audience → Publish app**.

The Branding screen still needs three URLs, and they must be crawlable:

| Field | Value |
|---|---|
| Application home page | `https://www.coconoto.africa` |
| Privacy policy | `https://www.coconoto.africa/privacy-policy` |
| Terms of service | `https://www.coconoto.africa/terms-of-service` |
| Authorized domain | `coconoto.africa` |

**Why the pages used to fail:** they shipped an empty `<div id="root">` — every word was rendered by
React after hydration, so a verifier that does not run JavaScript saw ~32 characters. `api/seo.js`
now renders the legal body into the shell, and the copy lives in one place
(`api/_legal-content.js`) so the server version and the React version cannot drift.

If Google returns "Failed to verify branding / ongoing verification request", a run is already in
flight — refresh, don't re-save, and publish anyway. Branding verification is not a prerequisite.

## Checklist

- [x] Clerk application created (Development first)
- [x] Email + Password enabled, min length 8
- [x] Email verification: code (or off)
- [x] Google connection enabled
- [x] Migration `20261018000001_clerk_identity.sql` applied
- [x] Domains added to Clerk — `coconoto.africa` Verified
- [x] Five DNS CNAMEs in Cloudflare, proxy off, all resolving
- [ ] SSL certificate for `clerk.coconoto.africa` finished issuing
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` added on Vercel
- [ ] Redeployed (Vite inlines `VITE_*` at build time, so this is required)
- [ ] Google consent screen published — Audience → **Publish app**
- [ ] Existing buyers: import bcrypt hashes, or accept Google-only for them
- [ ] Rotate `sk_live_…` (it was pasted into a chat transcript)
- [ ] One real reset end-to-end on production (`/buyer-reset-password`) — proves the
      "Reset password code" email template is enabled on the live instance

### The two Vercel values

Production only, **Project → Settings → Environment Variables**:

```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_Y2xlcmsuY29jb25vdG8uYWZyaWNhJA
CLERK_SECRET_KEY           = sk_live_…            (mark as Sensitive)
```

`pk_live_Y2xlcmsuY29jb25vdG8uYWZyaWNhJA` base64-decodes to
`clerk.coconoto.africa$`, so it is the correct key for this domain. Both must be
scoped to **Production** (and Preview only if you want Clerk there too).
`@clerk/backend` is already a production dependency, so the serverless function
will resolve it — it is not a devDependency that Vercel would prune.
