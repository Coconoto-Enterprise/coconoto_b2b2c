-- Sellers created from the buyer dashboard ("Become a Seller") authenticate with
-- Clerk (Google or email+password) through the buyer session, so there is no
-- separate seller credential to store. Requiring one forced Google users to
-- invent a password that nothing ever verified.
--
-- Mirrors what 20261018000001_clerk_identity.sql did for buyers.password_hash.
--
-- Run with `supabase db push`, or paste into the SQL editor.

ALTER TABLE vendors ALTER COLUMN password_hash DROP NOT NULL;

COMMENT ON COLUMN vendors.password_hash IS
  'Legacy /vendor-login credential. NULL for sellers created via the buyer dashboard (Clerk identity).';
