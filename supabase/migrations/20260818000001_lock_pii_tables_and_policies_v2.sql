-- Lock down PII tables that were previously left wide open to the `anon` role.
-- Generated in response to docs/security-audit-2026-08-17.md.
--
-- This is a hardened re-run of 20260817000001_lock_pii_tables_and_policies.sql.
-- The original failed with `relation "public.email_users" does not exist` —
-- meaning the table that this migration assumed existed was never created
-- in the target Supabase project (either an unapplied earlier migration,
-- or this is the wrong Supabase project). Run
-- 20260818000000_diag_what_tables_exist.sql first to confirm.
--
-- This version wraps every table block in existence checks so it is
-- safe to run repeatedly and against partial schemas. It will skip
-- (and NOTICEs) any table that is missing rather than aborting.
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

SET client_min_messages = NOTICE;

-- ===========================================================================
-- Helper: drop any policy whose name matches one of the given patterns,
-- then run the supplied callback. Used so a missing table never aborts the
-- whole migration.
-- ===========================================================================
CREATE OR REPLACE FUNCTION pg_temp._drop_policies(_schema text, _table text, _names text[])
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  nm text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = _schema AND table_name = _table
  ) THEN
    RAISE NOTICE '  [skip] %.% does not exist — leaving policies alone', _schema, _table;
    RETURN;
  END IF;
  FOREACH nm IN ARRAY _names LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', nm, _schema, _table);
  END LOOP;
END;
$$;

-- ===========================================================================
-- email_users
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='email_users') THEN
    RAISE NOTICE '[skip] public.email_users missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_policies('public','email_users', ARRAY[
    'Allow admins to read email users',
    'Allow admins to insert email users',
    'Allow admins to update email users',
    'Block anon from email_users',
    'Service role manages email_users'
  ]);
  REVOKE ALL ON public.email_users FROM anon;
  REVOKE ALL ON public.email_users FROM authenticated;
  GRANT  ALL ON public.email_users TO service_role;
  EXECUTE $E$
    CREATE POLICY "Service role manages email_users"
      ON public.email_users
      FOR ALL TO service_role
      USING (true) WITH CHECK (true)
  $E$;
END $$;

-- ===========================================================================
-- email_logs — senders see only their own rows
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='email_logs') THEN
    RAISE NOTICE '[skip] public.email_logs missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_policies('public','email_logs', ARRAY[
    'Allow admins to read email logs',
    'Allow API to insert email logs',
    'Allow admins to update email logs',
    'Block anon from email logs',
    'Senders can read their own email logs',
    'Senders can insert their own email logs',
    'Service role manages email logs'
  ]);
  REVOKE ALL ON public.email_logs FROM anon;
  GRANT  SELECT, INSERT, UPDATE ON public.email_logs TO authenticated;
  GRANT  ALL                          ON public.email_logs TO service_role;
  EXECUTE $E$
    CREATE POLICY "Senders can read their own email logs"
      ON public.email_logs FOR SELECT TO authenticated
      USING (
        lower(coalesce(sent_by_email, '')) =
        lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  $E$;
  EXECUTE $E$
    CREATE POLICY "Senders can insert their own email logs"
      ON public.email_logs FOR INSERT TO authenticated
      WITH CHECK (
        lower(coalesce(sent_by_email, '')) =
        lower(coalesce(auth.jwt() ->> 'email', ''))
        OR sent_by_email IS NULL
      )
  $E$;
  EXECUTE $E$
    CREATE POLICY "Service role manages email logs"
      ON public.email_logs FOR ALL TO service_role
      USING (true) WITH CHECK (true)
  $E$;
END $$;

-- ===========================================================================
-- email_sender_config + helper function for form-submission flow
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='email_sender_config') THEN
    RAISE NOTICE '[skip] public.email_sender_config missing';
  ELSE
    PERFORM pg_temp._drop_policies('public','email_sender_config', ARRAY[
      'Allow admins to read email config',
      'Allow admins to update email config',
      'Block anon from email config'
    ]);
    REVOKE ALL ON public.email_sender_config FROM anon;
    GRANT  SELECT ON public.email_sender_config TO authenticated;
    GRANT  ALL   ON public.email_sender_config TO service_role;
  END IF;
END $$;

-- The function is defined unconditionally so the api/ form-submit path can
-- call it even if the table is empty/missing on a partial project. We use
-- SECURITY DEFINER + a locked search_path so the function stays safe to
-- expose to `anon`.
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

-- ===========================================================================
-- vendors — passwords, phone, address, email
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='vendors') THEN
    RAISE NOTICE '[skip] public.vendors missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_policies('public','vendors', ARRAY[
    'Vendors can view their own data',
    'Vendors can insert their own data',
    'Vendors can update their own data',
    'Block anon from vendors',
    'Service role manages vendors'
  ]);
  REVOKE ALL ON public.vendors FROM anon;
  REVOKE ALL ON public.vendors FROM authenticated;
  GRANT  ALL ON public.vendors TO service_role;
  EXECUTE $E$
    CREATE POLICY "Service role manages vendors"
      ON public.vendors FOR ALL TO service_role
      USING (true) WITH CHECK (true)
  $E$;
END $$;

-- ===========================================================================
-- vendor_orders — cross-vendor buyer contact leak
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='vendor_orders') THEN
    RAISE NOTICE '[skip] public.vendor_orders missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_policies('public','vendor_orders', ARRAY[
    'Anyone can create orders',
    'Vendors can view their orders',
    'Vendors can update their orders',
    'Block anon from vendor_orders',
    'Service role manages vendor_orders'
  ]);
  REVOKE ALL ON public.vendor_orders FROM anon;
  REVOKE ALL ON public.vendor_orders FROM authenticated;
  GRANT  ALL ON public.vendor_orders TO service_role;
  EXECUTE $E$
    CREATE POLICY "Service role manages vendor_orders"
      ON public.vendor_orders FOR ALL TO service_role
      USING (true) WITH CHECK (true)
  $E$;
END $$;

-- ===========================================================================
-- blog_notifications — open `WITH CHECK (true)` on INSERT
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='blog_notifications') THEN
    RAISE NOTICE '[skip] public.blog_notifications missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_policies('public','blog_notifications', ARRAY[
    'Insert blog_notifications',
    'Read own blog_notifications',
    'Users can read their own notifications',
    'System can insert notifications',
    'Users can update their own notifications',
    'Service role manages blog_notifications'
  ]);
  REVOKE INSERT ON public.blog_notifications FROM anon;
  REVOKE INSERT ON public.blog_notifications FROM authenticated;
  GRANT  INSERT ON public.blog_notifications TO service_role;
  EXECUTE $E$
    CREATE POLICY "Service role manages blog_notifications"
      ON public.blog_notifications FOR ALL TO service_role
      USING (true) WITH CHECK (true)
  $E$;
END $$;

-- ===========================================================================
-- buyers — locked out by 20260807000001_secure_marketplace_sessions.sql.
-- Leave that intact; the marketplace backend (api/marketplace.js) uses
-- service_role + its own session cookie. No public SELECT is appropriate.
-- ===========================================================================

-- ===========================================================================
-- Defense-in-depth: drop ALL privileges from `anon` on tables we'd rather
-- lock even if a future migration forgets to set them. Wrapped in existence
-- checks so partial schemas don't blow up.
-- ===========================================================================
DO $$
DECLARE
  t text;
  locked text[] := ARRAY[
    'email_users','email_logs','email_sender_config',
    'vendors','vendor_orders','buyer_order_history','blog_notifications'
  ];
BEGIN
  FOREACH t IN ARRAY locked LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    END IF;
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS pg_temp._drop_policies(text, text, text[]);
