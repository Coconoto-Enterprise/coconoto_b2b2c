-- Diagnostic: list every public table that actually exists.
-- Run this first, paste the output back, and we can decide what the
-- RLS-lockdown migration needs to touch.

SELECT
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

-- The migration expects these specifically:
--   public.email_users
--   public.email_logs
--   public.email_sender_config
--   public.vendors
--   public.vendor_orders
--   public.blog_notifications
-- (and the implicit public.* defaults in the mern-blog / vendor migrations)

-- If a table is MISSING from the list, two likely causes:
--   1. The migration that creates it (e.g. 20260613000001_create_email_users_and_sent_by_columns.sql)
--      was never applied to this Supabase project. Apply it first.
--   2. You're on the wrong Supabase project (marketplace vs blog).
--      The marketplace Supabase will have vendors / vendor_orders / vendor_products.
--      The blog Supabase will have mern_blogs / blog_authors / blog_notifications.
--      email_users / email_logs / email_sender_config are in the marketing/email project.
