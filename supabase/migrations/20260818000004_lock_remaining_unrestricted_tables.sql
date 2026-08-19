-- Lock down the remaining UNRESTRICTED tables in the live schema.
-- Follow-up to 20260818000003_lock_pii_tables_and_policies_v3.sql, which
-- covered email_logs / email_sender_config / mail_users / vendors /
-- vendor_orders / blog_notifications.
--
-- Live-schema check (2026-08-18): these tables are STILL UNRESTRICTED
-- (RLS disabled or no policies set), meaning the `anon` role can read
-- every row:
--   book_event_requests, buyer_order_history, husk_sale_requests,
--   investment_inquiries, products_pricing, service_contacts,
--   toxic_results, waitlist, waitlist_analytics
--
-- POLICY MATRIX (derived from actual codebase usage, api/ + src/):
--   Public form-submission tables — anon may INSERT (the React forms call
--   supabase.from('...').insert() directly with the anon key), but anon
--   must NOT be able to SELECT / UPDATE / DELETE:
--     waitlist, book_event_requests, husk_sale_requests,
--     investment_inquiries, service_contacts
--     (also: machine_orders, product_orders — same pattern, same file
--     family; locked here too for consistency)
--   Internal-only tables — no anon access at all; admin reads go through
--   api/data.js (api delete-record.js) using the service_role key:
--     buyer_order_history, products_pricing, toxic_results,
--     waitlist_analytics
--
-- The admin dashboard (VintageDashboard.tsx) and all admin mutating
-- endpoints (delete-record.js, update-status.js, ...) use the
-- service_role client, which bypasses RLS — so locking these tables does
-- NOT break the admin UI or the mutation endpoints.
--
-- IMPORTANT: apply via `supabase db push` or the Supabase SQL editor.
-- It will not auto-run on Vercel deploys.

SET client_min_messages = NOTICE;

-- ===========================================================================
-- Helper: drop any policy whose name matches one of the given patterns.
-- Used so a missing table or already-dropped policy never aborts the
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
-- Public form-submission tables.
-- anon may INSERT (forms work). anon may NOT SELECT / UPDATE / DELETE.
-- Authenticated has the same INSERT-only grant (a logged-in buyer filling
-- a form is still just inserting).
-- ===========================================================================
DO $$
DECLARE
  t text;
  formTables text[] := ARRAY[
    'waitlist',
    'book_event_requests',
    'husk_sale_requests',
    'investment_inquiries',
    'service_contacts',
    'machine_orders',
    'product_orders'
  ];
BEGIN
  FOREACH t IN ARRAY formTables LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                   WHERE table_schema='public' AND table_name=t) THEN
      RAISE NOTICE '[skip] public.% missing — skipping', t;
      CONTINUE;
    END IF;

    RAISE NOTICE '[lock] public.% (form-submission: anon INSERT only)', t;

    -- Enable RLS (these tables had none set, hence UNRESTRICTED).
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    -- Drop any legacy policies we know by name (best-effort pattern match).
    PERFORM pg_temp._drop_policies('public', t, ARRAY[
      'Enable insert for authenticated users only',
      'Enable read access for all users',
      'Enable insert access for all users',
      'Allow anon insert ' || t,
      'Allow anon read ' || t,
      'Allow anon update ' || t,
      'Allow anon delete ' || t,
      'Allow authenticated insert ' || t,
      'Allow authenticated read ' || t,
      'Allow authenticated update ' || t,
      'Allow authenticated delete ' || t,
      'Anyone can insert ' || t,
      'Anyone can read ' || t,
      'Anyone can update ' || t,
      'Anyone can delete ' || t,
      'Service role manages ' || t,
      'Service role manages ' || t || ' inserts',
      'Service role manages ' || t || ' updates',
      'Service role manages ' || t || ' deletes'
    ]);

    -- anon / authenticated: INSERT only.
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    EXECUTE format('GRANT INSERT ON public.%I TO anon', t);
    EXECUTE format('GRANT INSERT ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

    -- Explicit policy: anon can insert rows (needed for public forms),
    -- but nobody except service_role can read / update / delete.
    EXECUTE format($E$
      CREATE POLICY "Public can insert %1$s"
        ON public.%1$s
        FOR INSERT TO anon
        WITH CHECK (true)
    $E$, t);
    EXECUTE format($E$
      CREATE POLICY "Authenticated can insert %1$s"
        ON public.%1$s
        FOR INSERT TO authenticated
        WITH CHECK (true)
    $E$, t);
    EXECUTE format($E$
      CREATE POLICY "Service role manages %1$s"
        ON public.%1$s
        FOR ALL TO service_role
        USING (true)
        WITH CHECK (true)
    $E$, t);
  END LOOP;
END $$;

-- ===========================================================================
-- Internal-only tables — no anon / authenticated access at all.
-- Admin reads go through api/data.js and api/delete-record.js using the
-- service_role key (bypasses RLS). Nothing in src/ references these.
-- ===========================================================================
DO $$
DECLARE
  t text;
  internalTables text[] := ARRAY[
    'buyer_order_history',
    'products_pricing',
    'toxic_results',
    'waitlist_analytics'
  ];
BEGIN
  FOREACH t IN ARRAY internalTables LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                   WHERE table_schema='public' AND table_name=t) THEN
      RAISE NOTICE '[skip] public.% missing — skipping', t;
      CONTINUE;
    END IF;

    RAISE NOTICE '[lock] public.% (internal-only: service_role)', t;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    PERFORM pg_temp._drop_policies('public', t, ARRAY[
      'Enable read access for all users',
      'Enable insert access for all users',
      'Enable update access for all users',
      'Enable delete access for all users',
      'Enable write access for all users',
      'Allow anon read ' || t,
      'Allow anon insert ' || t,
      'Allow anon update ' || t,
      'Allow anon delete ' || t,
      'Allow authenticated read ' || t,
      'Allow authenticated insert ' || t,
      'Allow authenticated update ' || t,
      'Allow authenticated delete ' || t,
      'Anyone can read ' || t,
      'Anyone can insert ' || t,
      'Anyone can update ' || t,
      'Anyone can delete ' || t,
      'Service role manages ' || t,
      'Service role manages ' || t || ' inserts',
      'Service role manages ' || t || ' updates',
      'Service role manages ' || t || ' deletes'
    ]);

    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

    EXECUTE format($E$
      CREATE POLICY "Service role manages %1$s"
        ON public.%1$s
        FOR ALL TO service_role
        USING (true)
        WITH CHECK (true)
    $E$, t);
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS pg_temp._drop_policies(text, text, text[]);