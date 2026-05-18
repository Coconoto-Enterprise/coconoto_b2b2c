-- Migration to create the admin author for blog system
-- This allows the blog system to work without actual Supabase auth

-- Remove the foreign key constraint from blog_authors if it exists
-- This allows us to use custom UUIDs not tied to auth.users
ALTER TABLE blog_authors DROP CONSTRAINT IF EXISTS blog_authors_id_fkey;

-- Insert the admin author
INSERT INTO blog_authors (id, username, fullname, bio, profile_img)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin',
  'Coconoto Admin',
  'Administrator for Coconoto Blog System',
  ''
)
ON CONFLICT (id) DO NOTHING;


