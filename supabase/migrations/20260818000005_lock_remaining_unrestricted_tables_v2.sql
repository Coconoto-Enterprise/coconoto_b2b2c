-- Lock down the remaining UNRESTRICTED tables / views in the live schema.
-- v2 — fixes the v1 (20260818000004) failure:
--   `ALTER TABLE public.buyer_order_history ENABLE ROW LEVEL SECURITY`
--   → ERROR 42809 "cannot be performed on relation ... views"
--
-- WHY IT FAILED: `buyer_order_history` (and `waitlist_analytics`) are
--   VIEWS, not base tables. RLS only applies to tables. Views are already
--   gated by (a) the privileges on the view itself and (b) the privileges
--   / RLS on the underlying tables. `ALTER TABLE ... ENABLE ROW LEVEL
--   SECURITY` and `CREATE POLICY ... ON <view>` are both illegal for views.
--
-- WHAT THIS VERSION DOES DIFFERENTLY:
--   1. Detects the relation kind per name (table / view / missing) and
--      branches: tables get RLS + policies; views get privilege revoke/
--      grant only (the effective control for views) + a NOTICE.
--   2. Drops the EXACT policy names this migration itself creates before
--      (re)creating them, so a re-run after the aborted v1 does not hit
--      "policy already exists".
--   3. Is fully idempotent — safe to run against a partially-locked schema.
--
-- POLICY MATRIX (derived from actual codebase usage, api/ + src/):
--   Public form-submission tables — anon may INSERT (the React forms call
--   supabase.from('...').insert() directly with the anon key), but anon
--   must NOT be able to SELECT / UPDATE / DELETE:
--     waitlist, book_event_requests, husk_sale_requests,
--     investment_inquiries, service_contacts, machine_orders, product_orders
--   Internal-only relations — no anon / authenticated access at all;
--   admin reads go through api/data.js and api/delete-record.js with the
--   service_role key (bypasses RLS):
--     buyer_order_history (VIEW), products_pricing (TABLE),
--     toxic_results (TABLE), waitlist_analytics (VIEW)
--
-- The admin dashboard (VintageDashboard.tsx) and all admin mutating
-- endpoints use the service_role client — locking these does NOT break
-- the admin UI or mutation endpoints.
--
-- IMPORTANT: apply via `supabase db push` or the Supabase SQL editor.
-- It will not auto-run on Vercel deploys.

SET client_min_messages = NOTICE;

-- ===========================================================================
-- Helper: drop any policy whose name matches one of the given patterns.
-- No-ops if the relation is missing or not a table (views cannot have
-- policies and DROP POLICY on them would error).
-- ===========================================================================
CREATE OR REPLACE FUNCTION pg_temp._drop_policies(_schema text, _table text, _names text[])
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  nm text;
  _is_table boolean;
BEGIN
  SELECT (table_type = 'BASE TABLE') INTO _is_table
  FROM information_schema.tables
  WHERE table_schema = _schema AND table_name = _table;

  IF _is_table IS NULL THEN
    RAISE NOTICE '  [skip] %.% does not exist — leaving policies alone', _schema, _table;
    RETURN;
  END IF;
  IF NOT _is_table THEN
    RAISE NOTICE '  [note] %.% is a VIEW — skipping policy drops (RLS does not apply)', _schema, _table;
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
-- Authenticated has the same INSERT-only grant.
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
  _kind text;
BEGIN
  FOREACH t IN ARRAY formTables LOOP
    -- Resolve relation kind: 'table' | 'view' | NULL (missing)
    SELECT CASE table_type
             WHEN 'BASE TABLE' THEN 'table'
             WHEN 'VIEW' THEN 'view'
             ELSE NULL END
    INTO _kind
    FROM information_schema.tables
    WHERE table_schema='public' AND table_name=t;

    IF _kind IS NULL THEN
      RAISE NOTICE '[skip] public.% missing — skipping', t;
      CONTINUE;
    END IF;
    IF _kind = 'view' THEN
      RAISE NOTICE '[skip] public.% is a VIEW — RLS not applicable (revoke only)', t;
      CONTINUE;
    END IF;

    RAISE NOTICE '[lock] public.% (form-submission: anon INSERT only)', t;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    -- Drop legacy policies AND the exact names this migration creates.
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
      'Service role manages ' || t || ' deletes',
      'Public can insert ' || t,
      'Authenticated can insert ' || t
    ]);

    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    EXECUTE format('GRANT INSERT ON public.%I TO anon', t);
    EXECUTE format('GRANT INSERT ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

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
-- Internal-only relations — no anon / authenticated access at all.
-- Tables: enable RLS + service_role policy.
-- Views: privilege revoke/grant only (RLS is not applicable).
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
  _kind text;
BEGIN
  FOREACH t IN ARRAY internalTables LOOP
    SELECT CASE table_type
             WHEN 'BASE TABLE' THEN 'table'
             WHEN 'VIEW' THEN 'view'
             ELSE NULL END
    INTO _kind
    FROM information_schema.tables
    WHERE table_schema='public' AND table_name=t;

    IF _kind IS NULL THEN
      RAISE NOTICE '[skip] public.% missing — skipping', t;
      CONTINUE;
    END IF;

    -- Views cannot have RLS; privilege control is the effective control.
    -- GRANT to service_role keeps api/data.js + api/delete-record.js working
    -- (they connect with the service-role key).
    IF _kind = 'view' THEN
      RAISE NOTICE '[lock] public.% (VIEW — revoking anon/authenticated, granting service_role)', t;
      PERFORM pg_temp._drop_policies('public', t, ARRAY[]::text[]); -- notice only
      EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
      EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
      EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
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