# Coconoto B2B2C — Full Security Audit

**Date:** 2026-08-17
**Scope:** Supabase (migrations + RLS), all `api/*` Vercel serverless functions, `local-api-server.js`, `supabase/functions/`, all `src/**/*.{ts,tsx}`, dependency manifest.
**Mode:** Read-only. Nothing in this audit was changed.
**Auditor:** Automated deep review by WorkBuddy + 3 sub-agents (RLS, API endpoints, client-side).

---

## Executive summary

The app is **functional but dangerously exposed**. There are multiple unauthenticated server-side endpoints with full service-role keys, public RLS policies that leak customer PII (and password hashes), stored XSS sinks in the blog renderer, an open SMTP relay, and a hard-coded admin fallback password. **None of these are theoretical**: an attacker can hit them right now with curl, no credentials, no effort.

| Severity | Count | Examples |
|----------|-------|----------|
| **P0 — actively exploitable today** | **~12** | `DELETE /api/delete-record` + `service_role` + no auth = wipe 6 tables. `email_users.password_hash` readable by anon. Stored XSS via `dangerouslySetInnerHTML` in `BlogDetail.tsx`. Open email relay via `api/send-email.js`. |
| **P1 — exploitable with conditions or weak defaults** | **~13** | `bcrypt` cost 10 (use 12+). Default admin password `COCONOTO`/`COCO1234`. CORS `*` + `Allow-Credentials: true` on marketplace. No rate-limit / CAPTCHA / honeypot on any form. |
| **P2 — hardening / hygiene** | **~20** | Hard-coded personal Gmail addresses in source. PII written to `localStorage`. Dependency drift (`@types/react@18` vs `react@19`). Email `<script>document.write(...)</script>` template. |

**Top five to fix this week**, in order of impact-per-effort:

1. **Block the unauthenticated mutation endpoints** — `api/delete-record.js`, `api/update-status.js`, `api/update-price.js`. Add auth (a shared `SUPABASE_API_KEY` header, or move to service_role + require a Supabase JWT).
2. **Lock down Supabase SELECT on PII tables** — `email_users`, `email_logs`, `email_sender_config`, `vendors`, `vendor_orders`. Switch `USING (true)` to admin-only or NULL.
3. **Add `DOMPurify.sanitize(...)` at every `dangerouslySetInnerHTML` sink** in `BlogDetail.tsx`, `EditorRenderer.tsx`, `SentEmailsList.tsx`, `VintageDashboard.tsx`. Add `rehype-sanitize` to `MarkdownRenderer.tsx`.
4. **Authenticate + allowlist recipients on `api/send-email.js` and `api/send-custom-email.js`.** Right now they are open relays.
5. **Remove the hard-coded fallback password `COCO1234` / `COCONOTO`** from `local-api-server.js` and `api/auth.js`. Fail-closed if `ADMIN_PASSWORD` env is missing.

---

## Part 1 — Supabase / database (RLS + migrations)

Audit: `supabase/migrations/*.sql`, `supabase/functions/send-email/index.ts`, `src/lib/supabase.ts`, cross-grep against `src/`, `api/`, `local-api-server.js`.

### P0 — 12 findings (most actionable, but several require schema review)

| # | Finding | File |
|---|---------|------|
| **P0-1** | `buyers` table is **locked out** — all SELECT/INSERT/UPDATE policies removed in `20260807000001_secure_marketplace_sessions.sql:57-59`. Marketplace login must be silently broken. | `20260807000001_secure_marketplace_sessions.sql` |
| **P0-2** | `email_users` table has `SELECT USING (true)` — anon can read every admin's **password hash + email + role**. | `20260613000001_create_email_users_and_sent_by_columns.sql:15-29` |
| **P0-3** | `email_logs` is fully public — every recipient, subject line, full HTML body, and `sent_by_email` leaked to anon. Audit-trail/recon goldmine. | `20260219000002_create_email_logs_table.sql:25-41` |
| **P0-4** | `email_sender_config` is fully public — internal department addresses (admin@, support@, sales@, etc.) harvested for phishing recon. | `20260219000001_create_email_config_table.sql:18-29` |
| **P0-5** | `vendors` table public SELECT — every vendor's `password_hash`, `email`, `phone`, `address` leaked. UPDATE permissive — anon can flip `is_verified=true`. | `20260208000001_create_vendor_marketplace.sql:85-92` |
| **P0-6** | `vendor_orders` public SELECT — every buyer's delivery address, phone, email leaked across vendors. | `20260208000001_create_vendor_marketplace.sql:111-115` |
| **P0-7** | `blog_notifications` INSERT `WITH CHECK (true)` — anyone can spam notifications to any user's UUID (phishing primitive). | `20260218000001_create_mern_blog_system.sql:166-168` |
| **P0-8** | `mern_blogs` admin drafts publicly readable — the only author is the seeded admin UUID `00000000-0000-0000-0000-000000000001`; the SELECT policy treats that UUID as readable for everyone. Drafts aren't protected. | `20260218000002_fix_blog_rls_for_admin.sql:25-27` |
| **P0-9** | **Eight expected tables don't exist in any migration** (`waitlist`, `machine_orders`, `product_orders`, `book_event_requests`, `investment_inquiries`, `service_contacts`, `husk_sale_requests`, `toxic_results`). Created outside migrations → no RLS guarantee, no audit trail. Table Editor shows `machine_orders` exists but with what policies we cannot verify. | (all referenced `src/services/*.ts`, `src/components/BookEventModal.tsx`, `src/pages/.../machines/Order*.tsx`, `api/data.js`) |
| **P0-10** | `local-api-server.js` admin login uses plaintext `'COCO1234'` fallback password, no rate limit. | `local-api-server.js:28-46, 55-72` |
| **P0-11** | Edge function `send-email` is an unauthenticated, CORS-* **email open relay**. Anyone can send arbitrary HTML (no escaping) as `notifications@send.coconoto.africa` to anyone. | `supabase/functions/send-email/index.ts:4,8,67-80,134-146` |
| **P0-12** | `product-images` storage bucket INSERT has **no `auth.role()` check** — anon can upload attacker-controlled content into your CDN. | `20260214000001_create_product_images_bucket.sql:12-14` |

### Anon-role blast-radius table

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `vendors` | ✅ | ✅ | ✅ | ❌ |
| `vendor_orders` | ✅ | ✅ | ✅ | ❌ |
| `vendor_products` | ✅ (`is_active=true`) | ✅ | ✅ | ✅ |
| `buyers` | ❌ | ❌ | ❌ | ❌ |
| `blog_posts` | ✅ (published) | ❌ | ✅ (any auth'd) | ✅ (any auth'd) |
| `mern_blogs` | ✅ (incl. drafts by admin UUID) | ❌ | ❌ | ❌ |
| `blog_authors` | ✅ | ❌ | ❌ | ❌ |
| `blog_comments` | ✅ | ✅ | ✅ | ❌ |
| `blog_likes` | ✅ | ✅ | ✅ | ✅ |
| `blog_notifications` | ❌ | ✅ to anyone | ❌ | ❌ |
| `email_sender_config` | ✅ | ❌ | ✅ | ❌ |
| `email_logs` | ✅ | ✅ | ✅ | ❌ |
| `email_users` | ✅ | ✅ | ✅ | ❌ |

### Storage buckets

- **`product-images`** — public bucket, INSERT missing `auth.role()` check, UPDATE/DELETE lack ownership check. P1-P2.
- **`blog-images`** — public bucket, INSERT correctly requires `auth.role() = 'authenticated'`. OK on access (but the bucket is `public=true`, so any uploaded file is reachable to the world — a way to host attacker content under your domain).

---

## Part 2 — API endpoints (`/api/*` + `local-api-server.js` + Edge Functions)

### P0 — 8 findings

| # | Finding | File |
|---|---------|------|
| **API-1** | `api/delete-record.js` is **unauthenticated + service-role + dynamic table/id**. Wipes any row by `{table, id}` from 6 tables. | `api/delete-record.js:6, 31-34` |
| **API-2** | `api/update-status.js` is **unauthenticated + service-role + dynamic table/id/status**. Arbitrary state changes on any order. `status` not enum-validated. | `api/update-status.js:6, 31-34` |
| **API-3** | `api/cloudflare-analytics.js` is unauthenticated and proxies an `VITE_CLOUDFLARE_API_TOKEN`. **Rotate that token unless you've confirmed it's analytics-read-only** — anyone hitting the endpoint has full Cloudflare GraphQL power. Error path also leaks GraphQL responses with internal errors. | `api/cloudflare-analytics.js:2, 9-10, 127-132` |
| **API-4** | `api/send-custom-email.js` is an open SMTP relay with arbitrary HTML, arbitrary recipient, arbitrary attachment (10 MB / file, unlimited count). No MIME / magic-byte / filename sanitization. CRLF in subject or from = header injection. **Anyone can send mail as `team@coconoto.africa`.** | `api/send-custom-email.js:270-282, 348, 367-374, 380, 320` |
| **API-5** | `api/send-email.js` open relay. Defaults broadcast to `coconotoenterprise@gmail.com`, `bamigboyeayomide095@gmail.com`, `faejioluwatoke@gmail.com` — personal addresses baked into the repo. `<h2>New ${formType}` with `${customerName}` interpolated raw into HTML (XSS in inbox + admin UI), subject = `New ${formType} - ${customerName}` (header-injection via CRLF). | `api/send-email.js:97-99, 168-180, 194-198` |
| **API-6** | `api/auth.js` handles 14 actions on one URL using **`SUPABASE_SERVICE_ROLE_KEY`**, with admin check (`authorizeAdmin`) trusting client-supplied `requesterId` and `requesterEmail`. Default-admin fallback credentials: `info@coconoto.africa` / `COCONOTO`. | `api/auth.js:10-21, 51-85, 604-617, 656-666, 852-881` |
| **API-7** | `api/marketplace.js` sets CORS `Access-Control-Allow-Origin: req.headers.origin` **with** `Access-Control-Allow-Credentials: true` — textbook CSRF-against-cookies. Combined with the service-role Supabase client (bypasses RLS), the whole marketplace is exposed to any origin. | `api/marketplace.js:29-30, 87-93` |
| **API-8** | `local-api-server.js` `app.use(cors())` (open) + binds `0.0.0.0:3001` (LAN-reachable). Plaintext admin password comparison. `console.log('📝 Received password:', password); console.log('📝 Expected password:', adminPassword);` — credentials in stdout. | `local-api-server.js:17-20, 28-46, 346-348` |

### P1 — 12 findings

`bcrypt` cost 10 (P1-1) in all 6 sites — should be ≥12. No rate-limit / lockout / CAPTCHA anywhere (P1-2). `handleAdminLogin` loops through every active `mail_users` row with `bcrypt.compare` — non-constant-time brute-force oracle (P1-3). `handleBuyerSignup` returns `'Email already registered'` — enumeration oracle (P1-4). `authorizeAdmin` trusts client body (P1-5). Session-signing secret falls back to the **service-role key** if `MARKETPLACE_SESSION_SECRET` is unset — anyone with that key can forge marketplace cookies (P1-6). `upload-product-image.js` validates MIME not magic bytes — polyglot SVG/HTML can slip past and be served as `image/...` (P1-7). `update-price.js` overwrites prices with no auth (P1-8). Local API server LAN-reachable (P1-9). Stack traces echoed to client responses (P1-10). `data.js`'s `handleGetEmails` exposes full Resend inbox payload (P1-11). `_templateService.loadTemplate` uses un-allowlisted `path.join(cwd, 'templates', templatePath)` (P1-12).

### P2 — 14 findings (hygiene)

CORS is open `*` on every endpoint. `marketplace.js` `products` action exports vendor email/phone (scrapable). No `package.json` at project root → supply-chain drift. `send-custom-email.js` accepts `senderEmail` from body → phishing. `seo.js` `pageUrl` built from `req.headers.host` → SEO spam. `_templateService.replacePlaceholders` uses deprecated `substr` and a regex band-aid for placeholder collision. `send-email.js` PII in `console.log`. Hard-coded personal Gmail addresses (3 sites). Default Resend sender not verified-on-write. … and more.

---

## Part 3 — Client-side React (`src/**/*.tsx`)

### P0 — 3 stored-XSS sinks (highest-impact single change)

| # | Sink | File:line |
|---|------|-----------|
| **R-1** | `BlogDetail.tsx` renders EditorJS blocks via `dangerouslySetInnerHTML={{ __html: block.data.text }}` for header / paragraph / list items / quote (5 separate sinks). EditorJS does not sanitize by default. Any blog author (and any anon writer if `blogs` ever becomes writable from anon) can store `<img src=x onerror=...>` and have it execute in every visitor's browser. | `src/pages/blog/BlogDetail.tsx:306, 312, 318, 324, 331` |
| **R-2** | `MarkdownRenderer.tsx` uses `rehype-raw` with **no `rehype-sanitize`**. Raw HTML inside markdown is rendered verbatim. Any Markdown post = potential XSS. | `src/components/blog/MarkdownRenderer.tsx:19-22` |
| **R-3** | `EditorRenderer.tsx` renders `blockData.embed` as `<iframe src={blockData.embed}>` **without `sandbox`**, with a fallback `dangerouslySetInnerHTML` on the same field. EditorJS embed whitelist is honored at authoring only; direct DB writers can plant any URL. | `src/components/blog/EditorRenderer.tsx:118-134` |

### P1 — 6 findings

`SentEmailsList.tsx:462, 695` and `VintageDashboard.tsx:2048` render email HTML via `dangerouslySetInnerHTML` without sanitization (admin target). **No HTML sanitization library anywhere** in `src/` (verified by grep — zero matches for `DOMPurify|sanitize`). File uploads (`ImageUploader.tsx`, `RichMarkdownEditor.tsx`, `EditorComponent.tsx`) do **client-side only** validation and upload directly to Supabase Storage with the anon key — server-side `api/upload-product-image.js` is bypassed. Default admin password `COCO1234` in `local-api-server.js:28,55`. **No CAPTCHA / rate-limit / honeypot** on any of 7 public forms (Waitlist, ProductCheckout, BookEvent, HuskSale, OrderCocopeat, OrderMachine). `<script>document.write(...)</script>` in `src/utils/emailTemplates.ts:145, 232` — Apple Mail renders script in WebKit, and if these templates are ever rendered as preview HTML in a dashboard, the admin is one click away from RCE.

### P2 — 7 findings

PII in `localStorage` (`buyerId`, `buyerEmail`, `vendorId`, `adminLoggedIn`, etc.) — XSS-readable (P2-1). `TweetitLogin` forward arbitrary `?query` to dashboard; `TweetitDashboard` honors `?compose=1&to=&subject=` — UI-redress / phishing-the-admin primitive (P2-2). Tiptap StarterKit HTML output — verify downstream sinks (P2-3). `ProfileCard` accepts prop-driven CSS strings for `--icon`, `--grain`, `--behind-gradient`, `--inner-gradient` — currently static, but the API surface is open (P2-4). Dependency drift: `react@^19.2.1` + `@types/react@^18.2.37` (mismatched); `react-quill` listed but **not used** anywhere in `src/` (legacy CVE baggage); Express 5, Tiptap 3, Vite 5 bleeding-edge with no `engines` / no `.nvmrc` (P2-5). No `Content-Security-Policy` meta tag visible in static HTML; no documented CORS allowlist (P2-6). `useEffect` reads `location.search` for prefill → minor user-enumeration oracle via email prefill (P2-7).

### P3 — Positive findings (good practices already in place)

- BuyerLogin.tsx:94 and VendorLogin.tsx:60 sanitize `returnTo` with `startsWith('/')` — good open-redirect defense. **The same pattern should be applied in TweetitLogin.**
- `eval(`, `new Function(`, `document.write`, string-form `innerHTML=` — **zero matches** in `src/`. (The `<script>document.write(...)</script>` in email templates is inside a string literal, not code execution.)
- Session cookies are `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- `seo.js` uses `escapeHtml` + `escapeXml` for meta tags (correctly escaped).
- `api/upload-product-image.js` does have a real server-side allowlist + size cap — that endpoint is OK on its own.

---

## Part 4 — Dependency & build audit

Read from `package.json`:

- **Type-era mismatch:** `react@^19.2.1` paired with `@types/react@^18.2.37`. Wrong types will mask real bugs (React 19 changed ref-as-prop semantics).
- **Unused dep + legacy CVE baggage:** `react-quill@^2.0.0` declared but **0 imports** in `src/`. Quill 1.x has historical XSS CVEs — drop the dep.
- **Bleeding-edge surface:** `react@19.2.1`, `@tiptap/react@3.18.0`, `express@5.2.1`, `vite@5`. No `.nvmrc`, no `engines` field, no top-level `package.json` with locked versions.
- **No known-bad majors** (no `lodash <4.17.21`, no `axios <0.28`, no `node-ipc@*`). That's a positive.
- **No `package-lock.json` policy** in repo (run `npm ci` rather than `npm install` in any deployment script to lock the tree).

---

## Part 5 — Remediation plan (this week → this month)

### This week (P0 emergency response)

1. **Disable or auth-gate `api/delete-record.js`, `api/update-status.js`, `api/update-price.js`.** Simplest: require an `x-api-key` header compared against an env var.
2. **Rotate the `CLOUDFLARE_API_TOKEN`** used by `api/cloudflare-analytics.js` (reduce scope to Analytics: Read only) and add an `x-api-key` check.
3. **Drop open SELECT on PII tables** with one-off migrations:
   ```sql
   drop policy if exists "Allow admins to read email users" on public.email_users;
   drop policy if exists "Allow admins to read email logs" on public.email_logs;
   drop policy if exists "Allow admins to read email config" on public.email_sender_config;
   drop policy if exists "Vendors can view their own data" on public.vendors;
   drop policy if exists "Vendors can view their orders" on public.vendor_orders;

   -- Replace each with a service_role-only policy
   create policy "service_role reads email_users" on public.email_users
     for select to service_role using (true);
   -- (and same template for the other 4 tables)
   ```
4. **Fix the `send-email` open relay**: gate behind an `x-api-key`, escape HTML in the template, drop the hard-coded Gmail addresses.
5. **`DOMPurify.sanitize(...)` at every `dangerouslySetInnerHTML` sink** plus add `rehype-sanitize` (config: GitHub-style schema) to `MarkdownRenderer.tsx`.

### This month (P1 hardening)

6. **Authenticate `api/marketplace.js`** properly: switch the database client to anon-key + RLS (not service_role), narrow CORS to a specific allowlist, kill the `Allow-Credentials: true` echo.
7. **Move session secret away from the service-role key** — set `MARKETPLACE_SESSION_SECRET` to a real secret in Vercel.
8. **Replace `bcrypt` cost 10 → 12** in all 6 sites. Add `express-rate-limit` on `/api/auth`.
9. **Remove P2-grade defaults**: drop `COCO1234` / `COCONOTO` fallbacks (fail-closed), drop `react-quill`, remove personal Gmail addresses from source.
10. **Audit `local-api-server.js`** — bind to `127.0.0.1` only (`app.listen(3001, '127.0.0.1', ...)`), or guard behind `NODE_ENV !== 'production'`.
11. **`product-images` bucket**: tighten INSERT to `auth.uid() IS NOT NULL`; add `auth.uid() = owner` to UPDATE/DELETE. Same for `blog-images` UPDATE/DELETE.

### This quarter (P2 hygiene)

12. Adopt the `startsWith('/')` open-redirect sanitization in TweetitLogin / TweetitDashboard.
13. Replace `<script>document.write(...)</script>` in `emailTemplates.ts` with a static year.
14. Migrate `blog-images` uploads through `api/upload-product-image.js` (use magic-byte sniffing, not just `Content-Type`).
15. Add `Content-Security-Policy` meta tag (or HTTP header) on every served page — at least `default-src 'self' 'unsafe-inline'` baseline that's tightened over time.
16. Convert the 8 "tables that don't exist in any migration" into proper migrations, with `created_at` + `status` defaults and tight RLS.

---

## Quick-look index by file

| File | Highest severity in this file |
|------|-------------------------------|
| `api/delete-record.js` | **P0** |
| `api/update-status.js` | **P0** |
| `api/cloudflare-analytics.js` | **P0** |
| `api/send-email.js` | **P0** |
| `api/send-custom-email.js` | **P0** |
| `api/auth.js` | **P0** |
| `api/marketplace.js` | **P0** |
| `local-api-server.js` | **P0** |
| `supabase/functions/send-email/index.ts` | **P0** |
| `src/pages/blog/BlogDetail.tsx` | **P0** |
| `src/components/blog/MarkdownRenderer.tsx` | **P0** |
| `src/components/blog/EditorRenderer.tsx` | **P0** |
| `supabase/migrations/20260613000001_create_email_users_and_sent_by_columns.sql` | **P0** |
| `supabase/migrations/20260219000002_create_email_logs_table.sql` | **P0** |
| `supabase/migrations/20260219000001_create_email_config_table.sql` | **P0** |
| `supabase/migrations/20260208000001_create_vendor_marketplace.sql` | **P0** |
| `supabase/migrations/20260218000001_create_mern_blog_system.sql` | **P0** |
| `supabase/migrations/20260218000002_fix_blog_rls_for_admin.sql` | **P0** |
| `supabase/migrations/20260807000001_secure_marketplace_sessions.sql` | **P0** |
| `supabase/migrations/20260214000001_create_product_images_bucket.sql` | **P0** |
| `src/utils/emailTemplates.ts` | **P1** |
| `src/components/blog/ImageUploader.tsx` | **P1** |
| `src/components/admin/SentEmailsList.tsx` | **P1** |
| `src/pages/VintageDashboard.tsx` | **P1** |
| `package.json` | **P2** |

---

## Out-of-scope but flagged

- **`toxic_results`** — referenced by `api/data.js:263` and `local-api-server.js:158`, not in any migration. Its policy state is unknown and unaudited.
- **`waitlist_analytics`** — referenced by Table Editor screenshot, not found anywhere else in the repo. Its policy state is unknown.
- **`products_pricing`** — referenced in Table Editor, not found anywhere else in the repo. Pricing lives in `vendor_products.price` instead.

Recommend running `select * from pg_policies where schemaname='public'` once at the SQL editor to capture every live policy and reconcile against this report.

---

*End of audit. PII: This report contains no live credentials — only public file paths, line numbers, and code excerpts.*
