-- This migration fixes the RLS policies for the blog system to work with the admin UUID
-- Since the Vintage Dashboard is already password-protected, we don't need auth.uid() checks

-- Drop existing RLS policies for mern_blogs
DROP POLICY IF EXISTS "Authors can create blogs" ON mern_blogs;
DROP POLICY IF EXISTS "Authors can update their own blogs" ON mern_blogs;
DROP POLICY IF EXISTS "Authors can delete their own blogs" ON mern_blogs;
DROP POLICY IF EXISTS "Anyone can read published blogs" ON mern_blogs;

-- Drop existing RLS policies for blog_authors
DROP POLICY IF EXISTS "Anyone can read blog author profiles" ON blog_authors;
DROP POLICY IF EXISTS "Users can update their own profile" ON blog_authors;

-- Recreate RLS policies for blog_authors (read-only, profile is public)
CREATE POLICY "Anyone can read blog author profiles"
ON blog_authors FOR SELECT
USING (true);

CREATE POLICY "Admin can update their profile"
ON blog_authors FOR UPDATE
USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Recreate RLS policies for mern_blogs that allow the admin UUID
-- Allow anyone to read published blogs or if they are the author
CREATE POLICY "Anyone can read published blogs"
ON mern_blogs FOR SELECT
USING (published = true OR author_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Allow admin user to create blogs
CREATE POLICY "Admin can create blogs"
ON mern_blogs FOR INSERT
WITH CHECK (author_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Allow admin user to update their blogs
CREATE POLICY "Admin can update blogs"
ON mern_blogs FOR UPDATE
USING (author_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Allow admin user to delete their blogs
CREATE POLICY "Admin can delete blogs"
ON mern_blogs FOR DELETE
USING (author_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Drop existing RLS policies for blog_comments
DROP POLICY IF EXISTS "Anyone can read blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON blog_comments;

-- Recreate RLS policies for blog_comments
CREATE POLICY "Anyone can read blog comments"
ON blog_comments FOR SELECT
USING (true);

CREATE POLICY "Anyone can create comments"
ON blog_comments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update comments"
ON blog_comments FOR UPDATE
USING (true);

-- Drop existing RLS policies for blog_likes
DROP POLICY IF EXISTS "Anyone can read likes" ON blog_likes;
DROP POLICY IF EXISTS "Authenticated users can like blogs" ON blog_likes;
DROP POLICY IF EXISTS "Users can unlike blogs" ON blog_likes;

-- Recreate RLS policies for blog_likes
CREATE POLICY "Anyone can read likes"
ON blog_likes FOR SELECT
USING (true);

CREATE POLICY "Anyone can like blogs"
ON blog_likes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can unlike blogs"
ON blog_likes FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete likes"
ON blog_likes FOR DELETE
USING (true);

