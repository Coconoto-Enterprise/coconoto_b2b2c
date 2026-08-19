-- ============================================================================
--  Coconoto Supabase diagnostic — paste into Supabase SQL Editor and run
--  Safe: read-only. No INSERT/UPDATE/DELETE.
-- ============================================================================

-- 1. Does the machine_orders table exist at all?
--    (This is the table the React modals insert into.)
select
  'machine_orders_exists' as check_name,
  exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name   = 'machine_orders'
  ) as result;

-- 2. If it exists, show its columns + types + nullability.
--    (Required so we can match the React insert payload.)
select
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'machine_orders'
order by ordinal_position;

-- 3. How many machine orders are stored (and a few sample rows)?
select 'row_count' as metric, count(*)::text as value
from public.machine_orders
union all
select 'latest_5_rows', coalesce(json_agg(t)::text, 'no rows')
from (
  select id, name, email, type, quantity, submitted_at
  from public.machine_orders
  order by submitted_at desc nulls last
  limit 5
) t;

-- 4. Is RLS on, and what policies exist on machine_orders?
select
  c.relname                              as table_name,
  c.relrowsecurity                       as rls_enabled,
  c.relforcerowsecurity                  as rls_forced,
  pol.polname                             as policy_name,
  pol.polcmd                              as command,
  pol.polpermissive                       as permissive,
  pol.roles                              as roles,
  pol.qual                               as using_expression,
  pol.with_check                         as with_check_expression
from pg_class c
left join pg_policy pol
  on pol.polrelid = c.oid
where c.relname = 'machine_orders'
  and c.relnamespace = 'public'::regnamespace
order by pol.polcmd, pol.polname;

-- 5. Quick view of ALL tables in the public schema
--    (so we can see what else is there, e.g. waitlist, vendor_orders, buyers…)
select
  table_name,
  (select count(*) from information_schema.columns c
   where c.table_schema = 'public' and c.table_name = t.table_name) as column_count
from information_schema.tables t
where table_schema = 'public'
  and table_type   = 'BASE TABLE'
order by table_name;

-- 6. Any tables that look like they could store machine/cocopeat orders?
--    (helps if your devs used a different name like "orders", "machine_quotes", etc.)
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_type   = 'BASE TABLE'
  and (
        table_name ilike '%order%'
     or table_name ilike '%machine%'
     or table_name ilike '%quote%'
     or table_name ilike '%desheller%'
     or table_name ilike '%dehusker%'
     or table_name ilike '%cocopeat%'
     or table_name ilike '%milk%'
  )
order by table_name;
