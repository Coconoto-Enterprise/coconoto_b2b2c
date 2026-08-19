-- Lock down PII tables that were previously left wide open to the `anon` role.
-- Generated in response to docs/security-audit-2026-08-17.md.
--
-- Pre-migration blast radius (anonymous role): SELECT on `email_users` (incl.
-- password hashes), `email_logs` (incl. full email bodies), `email_sender_config`
-- (internal department addresses), `vendors` (incl. password hashes + phone +
-- address), and `vendor_orders` (every buyer's delivery address/phone/email).
--
-- Post-migration: all five tables reject anonymous and unrestricted
-- authenticated read. Access is restricted to:
--   1. The `service_role` (used by Vercel serverless functions via the
--      supabase service-role key), and
--   2. For `email_logs`, the authenticated user to whom the row is attributed
--      (via `sent_by_email`) — so admins still see their own sent history in
--      the dashboard frontend.
--
-- IMPORTANT: this migration must be applied manually via `supabase db push` or
-- the Supabase SQL editor. It will not auto-run.

-- =====================================================================
-- email_users — admins / password hashes / recovery emails. Never public.
-- =====================================================================
DROP POLICY IF EXISTS "Allow admins to read email users"    ON public.email_users;
DROP POLICY IF EXISTS "Allow admins to insert email users"  ON public.email_users;
DROP POLICY IF EXISTS "Allow admins to update email users"  ON public.email_users;
DROP POLICY IF EXISTS "Block anon from email_users"         ON public.email_users;
DROP POLICY IF EXISTS "Service role manages email_users"    ON public.email_users;

-- Clear permissive grants from the public / anon / authenticated roles.
REVOKE ALL ON public.email_users FROM anon;
REVOKE ALL ON public.email_users FROM authenticated;
GRANT ALL  ON public.email_users TO service_role;

-- service_role bypasses RLS by default, but define the explicit policy for
-- clarity and so we don't trip over future `auditor` roles or similar.
CREATE POLICY "Service role manages email_users"
  ON public.email_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- email_logs — every recipient, subject, full HTML body, sender email.
-- Authenticated users see only rows they themselves sent.
-- =====================================================================
DROP POLICY IF EXISTS "Allow admins to read email logs"   ON public.email_logs;
DROP POLICY IF EXISTS "Allow API to insert email logs"    ON public.email_logs;
DROP POLICY IF EXISTS "Allow admins to update email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Block anon from email logs"        ON public.email_logs;

REVOKE ALL ON public.email_logs FROM anon;
GRANT  SELECT, INSERT, UPDATE ON public.email_logs TO authenticated;
GRANT  ALL  ON public.email_logs TO service_role;

-- Only the sender (matched by email) or service_role can read a given row.
CREATE POLICY "Senders can read their own email logs"
  ON public.email_logs
  FOR SELECT
  TO authenticated
  USING (
    lower(coalesce(sent_by_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Authenticated users can append their own rows but cannot impersonate other
-- senders. Service role bypasses this for backend logging paths.
CREATE POLICY "Senders can insert their own email logs"
  ON public.email_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lower(coalesce(sent_by_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    OR sent_by_email IS NULL
  );

CREATE POLICY "Service role manages email logs"
  ON public.email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- email_sender_config — internal department addresses (admin@, support@…).
-- Not strictly secret, but no reason to publish it on the open internet.
-- =====================================================================
DROP POLICY IF EXISTS "Allow admins to read email config"   ON public.email_sender_config;
DROP POLICY IF EXISTS "Allow admins to update email config" ON public.email_sender_config;
DROP POLICY IF EXISTS "Block anon from email config"        ON public.email_sender_config;

REVOKE ALL ON public.email_sender_config FROM anon;
GRANT  SELECT ON public.email_sender_config TO authenticated;
GRANT  ALL   ON public.email_sender_config TO service_role;

-- Helper that any caller (including anon form submissions) can use to look
-- up the configured sender for an email type without exposing the underlying
-- table directly.
CREATE OR REPLACE FUNCTION public.get_sender_config_for_type(p_email_type text)
RETURNS TABLE(sender_email text, sender_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sender_email, sender_name
  FROM public.email_sender_config
  WHERE email_type = p_email_type
    AND is_active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_sender_config_for_type(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_sender_config_for_type(text) TO anon, authenticated, service_role;

-- =====================================================================
-- vendors — password hashes, phone, address, email. Highly sensitive.
-- =====================================================================
DROP POLICY IF EXISTS "Vendors can view their own data"      ON public.vendors;
DROP POLICY IF EXISTS "Vendors can insert their own data"    ON public.vendors;
DROP POLICY IF EXISTS "Vendors can update their own data"    ON public.vendors;
DROP POLICY IF EXISTS "Block anon from vendors"              ON public.vendors;

REVOKE ALL ON public.vendors FROM anon;
REVOKE ALL ON public.vendors FROM authenticated;
GRANT ALL  ON public.vendors TO service_role;

CREATE POLICY "Service role manages vendors"
  ON public.vendors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- vendor_orders — cross-vendor leak of buyer contact info and addresses.
-- =====================================================================
DROP POLICY IF EXISTS "Anyone can create orders"             ON public.vendor_orders;
DROP POLICY IF EXISTS "Vendors can view their orders"        ON public.vendor_orders;
DROP POLICY IF EXISTS "Vendors can update their orders"      ON public.vendor_orders;
DROP POLICY IF EXISTS "Block anon from vendor_orders"        ON public.vendor_orders;

REVOKE ALL ON public.vendor_orders FROM anon;
REVOKE ALL ON public.vendor_orders FROM authenticated;
GRANT ALL  ON public.vendor_orders TO service_role;

CREATE POLICY "Service role manages vendor_orders"
  ON public.vendor_orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- blog_notifications — anyone can spam notifications to any UUID.
-- Originally `WITH CHECK (true)` on INSERT.
-- =====================================================================
DROP POLICY IF EXISTS "Insert blog_notifications"           ON public.blog_notifications;
DROP POLICY IF EXISTS "Read own blog_notifications"          ON public.blog_notifications;

REVOKE INSERT ON public.blog_notifications FROM anon;
REVOKE INSERT ON public.blog_notifications FROM authenticated;
GRANT  INSERT ON public.blog_notifications TO service_role;

CREATE POLICY "Service role manages blog_notifications"
  ON public.blog_notifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- buyers — currently locked out by 20260807000001_secure_marketplace_sessions.sql.
-- Leave that intact; the marketplace backend (api/marketplace.js) uses
-- service_role + its own session cookie. No public SELECT is appropriate.
-- =====================================================================

-- =====================================================================
-- Defense-in-depth: drop ALL privileges from `anon` on tables we'd
-- rather lock even if a future migration forgets to set them. This block
-- cannot hurt anything that depends on service_role access.
-- =====================================================================
REVOKE ALL ON public.email_users           FROM anon;
REVOKE ALL ON public.email_logs            FROM anon;
REVOKE ALL ON public.email_sender_config   FROM anon;
REVOKE ALL ON public.vendors               FROM anon;
REVOKE ALL ON public.vendor_orders         FROM anon;
REVOKE ALL ON public.buyer_order_history   FROM anon;
REVOKE ALL ON public.blog_notifications    FROM anon;
