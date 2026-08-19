-- =============================================================================
-- Enable RLS on email_sender_config (the one PII table v3 left RLS-disabled).
-- 2026-08-18 follow-up to 20260818000003_lock_pii_tables_and_policies_v3.sql
--
-- WHY THIS EXISTS:
--   v3 dropped the permissive legacy policies and revoked `anon`, but never ran
--   `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. The Supabase dashboard still
--   flags the table UNRESTRICTED (RLS toggle off). This migration closes the gap.
--
-- ACCESS MODEL (matches the other internal-only tables):
--   - anon:          NOTHING at the table level.
--                    Lookups go through the SECURITY DEFINER function
--                    `public.get_sender_config_for_type(text)` (v3),
--                    which is EXECUTE-granted to anon and can't leak rows.
--   - authenticated: NOTHING at the table level.
--   - service_role:  ALL (admin reads / api/* mutations).
--
-- IDEMPOTENT: safe to re-run. Drops ALL existing policies first, then creates
-- the single service_role policy. Apply via `supabase db push` or SQL editor.
-- =============================================================================

SET client_min_messages = NOTICE;

DO $$
DECLARE
  pol text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema='public' AND table_name='email_sender_config') THEN
    RAISE NOTICE '[skip] public.email_sender_config missing — nothing to do';
    RETURN;
  END IF;

  RAISE NOTICE '[lock] public.email_sender_config — enabling RLS, service_role only';

  -- The actual missing step from v3.
  ALTER TABLE public.email_sender_config ENABLE ROW LEVEL SECURITY;

  -- Drop every policy currently on the table (legacy permissive + any
  -- partial-state leftovers) so CREATE POLICY below cannot collide.
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'email_sender_config'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.email_sender_config', pol);
  END LOOP;

  REVOKE ALL ON public.email_sender_config FROM anon;
  REVOKE ALL ON public.email_sender_config FROM authenticated;
  GRANT  ALL ON public.email_sender_config TO service_role;

  CREATE POLICY "Service role manages email_sender_config"
    ON public.email_sender_config
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

  RAISE NOTICE '[ok] public.email_sender_config locked — anon/authenticated revoked, service_role only';
END $$;