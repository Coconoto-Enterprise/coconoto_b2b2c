-- ============================================================================
--  machine_orders — schema + RLS diagnosis  (FIXED v2)
-- ============================================================================

-- 1. Columns of machine_orders (this is what the React insert expects)
select
  column_name,
  data_type,
  character_maximum_length,
  numeric_precision,
  numeric_scale,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'machine_orders'
order by ordinal_position;

-- 2. RLS state + every policy on machine_orders
--    Fixed: use polroles (oid[]) joined against pg_roles, decode polcmd by hand.
select
  c.relname                              as table_name,
  c.relrowsecurity                       as rls_enabled,
  c.relforcerowsecurity                  as rls_forced,
  pol.polname                             as policy_name,
  case pol.polcmd
    when 'r' then 'SELECT'
    when 'a' then 'INSERT'
    when 'w' then 'UPDATE'
    when 'd' then 'DELETE'
    when '*' then 'ALL'
  end                                     as command,
  pol.polpermissive                       as permissive,
  coalesce(
    string_agg(r.rolname, ', ' order by r.rolname),
    'PUBLIC'
  )                                       as roles,
  pg_get_expr(pol.polqual,     pol.polrelid) as using_expression,
  pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression
from pg_class c
left join pg_policy pol on pol.polrelid = c.oid
left join pg_roles   r   on r.oid = any(pol.polroles)
where c.relname = 'machine_orders'
  and c.relnamespace = 'public'::regnamespace
group by
  c.relname, c.relrowsecurity, c.relforcerowsecurity,
  pol.polname, pol.polcmd, pol.polpermissive,
  pol.polrelid, pol.polqual, pol.polwithcheck
order by command, policy_name;

-- 3. Quick "is there any data?" check
select
  count(*)                                as total_rows,
  max(submitted_at)                       as most_recent_submit,
  (select email from public.machine_orders order by submitted_at desc nulls last limit 1)
                                          as most_recent_email
from public.machine_orders;

-- 4. For comparison — column lists of related "order-like" tables
select
  table_name,
  string_agg(column_name || ' ' || data_type, ', ' order by ordinal_position) as columns
from information_schema.columns
where table_schema = 'public'
  and table_name in ('product_orders', 'husk_sale_requests', 'service_contacts', 'book_event_requests')
group by table_name;
