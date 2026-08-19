# Security audit fixes — `docs/security-audit-2026-08-17.md`

Applied on 2026-08-17 against P0 / P1 findings. Read this alongside the audit.
Out-of-scope items are noted at the bottom.

## Shared helpers (new)

| File | What it does |
|---|---|
| `api/_shared-auth.js` | `requireApiKey(req, res)` — gate any privileged endpoint behind a `x-api-key` header that matches `API_MUTATIONS_KEY` (constant-time). `applyCorsAllowlist` replaces `Access-Control-Allow-Origin: *`. `escapeHtml` / `sanitizeHeaderValue` for safe template interpolation. **Fails closed (503)** when the env var is unset. |
| `api/_attachment-magic.js` | Inspects uploaded-file magic bytes (PDF, PNG, JPEG, GIF, WEBP, plain text) — does not trust `Content-Type`. Lets callers reject SVG / HTML / JS / unknown payloads that could otherwise be served as `image/...`. |
| `api/_shared-auth.test.mjs` | Smoke test for the helper. Verifies 401 / 503 / 200 / escape / sanitize / CORS allowlist paths. **Run with `node api/_shared-auth.test.mjs`** (set `API_MUTATIONS_KEY` in your shell first if you want the positive case to exercise). |

## API endpoints

| File | Why it changed | New env vars |
|---|---|---|
| `api/delete-record.js` | Was an open, unauthenticated `service_role` wipe. Now requires `x-api-key`, table allowlist tightened, UUID regex on `id`, and the Supabase error is not echoed back in production. | `API_MUTATIONS_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `api/update-status.js` | Same shape as above; added an enum allowlist for `status`. | same |
| `api/update-price.js` | Same shape; price column is now derived from the table (no longer interpolated), price bounded to ≤1B, UUID regex on `id`. | same |
| `api/send-email.js` | Open relay with hard-coded personal Gmail addresses (P0). Requires `x-api-key`, recipients now sourced from `INTERNAL_NOTIFICATION_RECIPIENTS` (CSV in env), user input is HTML-escaped before interpolation into the email body, CRLF stripped from subject/from, `formType` validated against an allowlist. | `API_MUTATIONS_KEY`, `INTERNAL_NOTIFICATION_RECIPIENTS`, `RESEND_API_KEY`, plus existing `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` |
| `api/send-custom-email.js` | Open relay with arbitrary HTML and `senderEmail` (phishing). Requires `x-api-key`, recipient domain allowlist (`CUSTOM_EMAIL_ALLOWED_DOMAINS`, default `coconoto.africa`), magic-byte MIME sniffing for attachments (rejects SVG/HTML/JS), `from` is forced to our domain, HTML escaping of `heading`/`message`, CRLF strip on `subject`. | `API_MUTATIONS_KEY`, `CUSTOM_EMAIL_ALLOWED_DOMAINS` |
| `api/cloudflare-analytics.js` | Was unauthenticated and echoed raw GraphQL responses. Now requires `x-api-key`; in error paths the raw GraphQL payload is logged server-side but not returned to the caller. | `API_MUTATIONS_KEY`, `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_TOKEN`. **You still need to rotate the Cloudflare token to Analytics-Read scope.** |
| `api/auth.js` | Tightened `handleAdminLogin` — always runs the same number of bcrypt compares per request (no brute-force timing oracle), super-admin fallback only when the request also carries `x-api-key` matching `ADMIN_PASSWORD`. `handleEmailUserLogin` no longer falls back to hard-coded `COCONOTO`; default-admin fallback now requires both `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_SECRET`. `authorizeAdmin` is no longer trustworthy from a forged client body — the `default-admin` path now requires the same constant-time secret check via `x-api-key`. `bcrypt` cost bumped to 12 (was 10) on signup paths. Signup endpoints return a generic "Could not create account" instead of "Email already registered" to defuse account-enumeration oracles. | `ADMIN_PASSWORD`, `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_SECRET`, `API_MUTATIONS_KEY` |
| `local-api-server.js` | Was LAN-reachable (`0.0.0.0`), `console.log`'d passwords in plaintext, fell back to `COCO1234` if `ADMIN_PASSWORD` was unset. Now binds `127.0.0.1` by default, fails closed when `ADMIN_PASSWORD` is missing in production (dev must opt in via `ALLOW_DEV_FALLBACK_PASSWORD=1`), CORS restricted to local-dev origins, plaintext login replaced with constant-time comparison. | `LOCAL_API_HOST`, `LOCAL_API_PORT`, `ADMIN_PASSWORD`, `ALLOW_DEV_FALLBACK_PASSWORD` |

## Client (`src/`)

| File | Change |
|---|---|
| `src/pages/blog/BlogDetail.tsx` | Every `dangerouslySetInnerHTML` sink (header / paragraph / list / quote) now goes through `sanitizeInline` (DOMPurify with `style/script/iframe/object/embed/form` and inline event-handler attributes blocked). The `embed` iframe is sandboxed, lazy-loaded, referrer-policy `no-referrer`, and the embed URL is filtered against an allowlist (`youtube`, `vimeo`, `codepen`, `codesandbox`) — `javascript:` / `data:` URIs return `null` instead of being rendered. |
| `src/components/blog/MarkdownRenderer.tsx` | Added `rehype-sanitize` to the rehype plugins so raw HTML in Markdown can no longer ship `<script>` or inline event handlers. |
| `src/components/blog/EditorRenderer.tsx` | Removed the `dangerouslySetInnerHTML` fallback on `blockData.embed`. The embed URL is allowlisted + the iframe is sandboxed (lazy, referrer-policy `no-referrer`). Bad URLs render an inert placeholder. |
| `src/components/admin/SentEmailsList.tsx` | Both email-detail `dangerouslySetInnerHTML` sinks (lines 462 / 695) now go through `sanitizeEmailHtml` (DOMPurify with the same exclusions). |
| `src/pages/VintageDashboard.tsx` | Same DOMPurify wrapper around the email-content `dangerouslySetInnerHTML` sink at line 2048. |
| `src/vite-env.d.ts` | Added an ambient `declare module 'dompurify'` so the import type-checks even on machines without `@types/dompurify`. |

## Database (Supabase)

| File | Change |
|---|---|
| `supabase/migrations/20260817000001_lock_pii_tables_and_policies.sql` | **NEW (v1).** Drops the `USING (true)` and `WITH CHECK (true)` permissive policies on `email_users`, `email_logs`, `email_sender_config`, `vendors`, `vendor_orders`, `blog_notifications`. Locks each to either `service_role` only or (for `email_logs`) authenticated users who own the row. Adds `public.get_sender_config_for_type(text)` so the form-submission email flow doesn't need anon SELECT. Revokes all privs from `anon` on the locked tables. **Apply via `supabase db push` or the SQL editor — the file does not auto-run on Vercel deploys.** v1 hard-fails with `relation "public.email_users" does not exist` on Supabase projects that never had the table-creating migrations applied (e.g. you ran it on the wrong project). |
| `supabase/migrations/20260818000001_lock_pii_tables_and_policies_v2.sql` | **NEW (v2).** First tolerant cut — every table block wrapped in `EXISTS` checks. Would have skipped tables that didn't exist instead of aborting. Did NOT match this project's schema: the admin/password table is named `public.mail_users` here, not `public.email_users` (the local `20260613000001` migration was never applied to this Supabase project, and the table was hand-rolled under a different name). |
| `supabase/migrations/20260818000003_lock_pii_tables_and_policies_v3.sql` | **NEW (v3 — use this one).** Live-schema cut. Lockdown blocks now pick whichever of `public.email_users` or `public.mail_users` exists (or both). Removed `public.buyer_order_history` from the defense-in-depth array (verified 2026-08-18 to not exist in this project). All other tables in v2 are present in the live schema and locked as before. |
| `supabase/migrations/20260818000000_diag_what_tables_exist.sql` | **NEW.** Diagnostic. Lists every base table in non-system schemas, plus notes on which earlier migrations create which tables. Run this first if v1 failed — the output tells us whether you're on the wrong Supabase project or whether an earlier table-creating migration is missing. |
| `supabase/migrations/20260817000002_lock_product_and_blog_image_buckets.sql` | **NEW (v1).** Tightens the `product-images` and `blog-images` storage policies: INSERT requires `auth.uid()`; UPDATE / DELETE requires `owner = auth.uid()`. Public read for both buckets remains. |
| `supabase/migrations/20260818000002_lock_product_and_blog_image_buckets_v2.sql` | **NEW (v2 — use this one).** Same as v1, but the per-bucket blocks are wrapped in `EXISTS` checks against `storage.buckets` so a project that only has one of the two buckets can still run it. |
| `supabase/migrations/20260818000004_lock_remaining_unrestricted_tables.sql` | **NEW (v1 — SUPERSEDED by v2 below; do not run this).** Hard-fails with `ERROR 42809: ALTER action ENABLE ROW SECURITY cannot be performed on relation` because `buyer_order_history` (and `waitlist_analytics`) are **views** — RLS is not applicable to views. Follow-up to v3. Locks `book_event_requests`, `buyer_order_history`, `husk_sale_requests`, `investment_inquiries`, `products_pricing`, `service_contacts`, `toxic_results`, `waitlist`, `waitlist_analytics`, `machine_orders`, `product_orders`. Two groups with different policies: (1) **form-submission tables** (waitlist, book_event_requests, husk_sale_requests, investment_inquiries, service_contacts, machine_orders, product_orders) — anon may INSERT only (the React forms insert directly with the anon key); anon SELECT/UPDATE/DELETE revoked. (2) **internal-only tables** (buyer_order_history, products_pricing, toxic_results, waitlist_analytics) — no anon/authenticated access at all; service_role only. Admin reads via `api/data.js` / `api/delete-record.js` use service_role, so the admin UI is unaffected. |
| `supabase/migrations/20260818000005_lock_remaining_unrestricted_tables_v2.sql` | **NEW (v2 — use this one for the remaining UNRESTRICTED tables/views).** Fixes the v1 abort. Detects each relation's kind via `information_schema.tables.table_type` and branches: **tables** get RLS enabled + policies created / dropped; **views** get privilege revoke/grant only (`REVOKE ALL ... FROM anon / authenticated`, `GRANT ALL ... TO service_role`) plus a NOTICE — this is the effective control for views since RLS never applies. Also drops the exact policy names it creates before re-creating them, so it re-runs cleanly even after v1 aborted mid-way (the 7 form tables were already locked). Fully idempotent. Same policy matrix as intended by v1: 7 form tables anon-INSERT-only, 4 internal relations service_role-only (admin `api/data.js` / `api/delete-record.js` still work). |
| `supabase/migrations/20260818000006_lock_email_sender_config_rls.sql` | **NEW (v6).** v3 dropped the permissive policies and revoked `anon` on `email_sender_config` but never ran `ENABLE ROW LEVEL SECURITY`, so the RLS dashboard still flagged it UNRESTRICTED. v6 enables RLS, drops ALL existing policies, revokes anon/authenticated, grants service_role ALL, and creates a single `Service role manages email_sender_config` policy (idempotent — safe to re-run). Anon lookups now go through the SECURITY DEFINER RPC `get_sender_config_for_type(text)`; `api/send-email.js` was switched from a direct anon-key table read to that RPC so email sender mapping keeps working. |

## Dependencies (`package.json`)

- `dompurify@^3.4.13` (runtime)
- `rehype-sanitize@^6.0.0` (runtime, paired with the existing `rehype-raw`)
- `@types/dompurify@^3.0.5` (devDependency) — installed alongside DOMPurify. The `src/vite-env.d.ts` shim keeps TypeScript happy even if `@types/dompurify` is later removed.

Run `npm install` after pulling.

---

# What was **not** fixed (deliberately out of scope this pass)

P1 hardening items the audit raised but that need a follow-up ticket rather than a one-file edit:

- `api/marketplace.js` still uses the service-role key. Switching to anon-key + RLS requires changes to every consumer in `src/` that currently relies on service-role roundtrips.
- No `express-rate-limit` or CAPTCHA on any public form (Waitlist, ProductCheckout, BookEvent, HuskSale, OrderCocopeat, OrderMachine, contact, comment). The forms still need hardening at the network layer (Cloudflare Turnstile or an IP throttle).
- The ghost tables that had no tracked migration (`waitlist`, `machine_orders`, `product_orders`, `book_event_requests`, `investment_inquiries`, `service_contacts`, `husk_sale_requests`, `toxic_results`, plus `buyer_order_history`, `products_pricing`, `waitlist_analytics`) were UNRESTRICTED in the live schema. RLS lockdowns now ship in `20260818000005_lock_remaining_unrestricted_tables_v2.sql` (anon INSERT preserved for the public form tables so the React forms still work). Still missing: first-class CREATE TABLE migrations for those 11 tables so the schema is fully reproducible from migrations.
- The dashboard admin targets (`EmailContent` in `VintageDashboard.tsx`) are now sanitized, but the corresponding form inputs (`RichMarkdownEditor.tsx`, `EditorComponent.tsx`, `ImageUploader.tsx`) still upload directly to Supabase Storage from the browser, bypassing `api/upload-product-image.js`. That boundary needs to be re-routed server-side.
- `emailTemplates.ts` still contains `<script>document.write(...)</script>` strings (line 145 / 232). Apple Mail renders `<script>` inside WebKit, so if those templates are ever pasted into a dashboard preview, the script executes. Replace with a static year/date string.
- `TweetitLogin` / `TweetitDashboard` `?compose=1&to=&subject=` URL prefill should be sanitized the same way `BuyerLogin` / `VendorLogin` sanitize `returnTo`.
- PII still in `localStorage` (`buyerId`, `buyerEmail`, `adminLoggedIn`, …). XSS-readable if a future XSS slips in. Move to `HttpOnly` cookies.
- Dependency drift (`react@19` vs `@types/react@18`, unused `react-quill`, no `engines` / `.nvmrc`).
- No `Content-Security-Policy` header on the deployed HTML. Baseline suggestion:
  `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.supabase.co data:; connect-src 'self' https://*.supabase.co https://api.resend.com`.

Once the migrations in `supabase/migrations/20260817*.sql` are applied, the **immediate P0 blast radius from the audit** is closed for the items addressed above. The remaining items are tracked above for the next pass.
