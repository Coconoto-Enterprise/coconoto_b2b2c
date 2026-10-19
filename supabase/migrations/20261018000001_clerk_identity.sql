-- Clerk becomes the identity provider for marketplace buyers.
--
-- The `buyers` row stays the profile of record (orders, addresses, dashboards
-- all reference buyers.id), but the password now lives in Clerk, so:
--   • password_hash must allow NULL for accounts created through Clerk;
--   • clerk_user_id links a Clerk user to its buyer row.
--
-- Existing buyers keep working: the /api/auth `clerk-session` bridge looks up
-- by clerk_user_id first, then by email, and claims the matching row on first
-- Clerk sign-in. Their old bcrypt hash simply stops being read.
--
-- Run with `supabase db push`, or paste into the SQL editor.

ALTER TABLE buyers ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE buyers ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- Partial: pre-Clerk rows have NULL here and must not collide.
CREATE UNIQUE INDEX IF NOT EXISTS idx_buyers_clerk_user_id
  ON buyers (clerk_user_id)
  WHERE clerk_user_id IS NOT NULL;

COMMENT ON COLUMN buyers.clerk_user_id IS
  'Clerk user id (user_…). Set by the /api/auth clerk-session bridge.';
