-- Add content_blocks column to blog_posts table for EditorJS support
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'content_blocks'
  ) THEN
    ALTER TABLE blog_posts 
    ADD COLUMN content_blocks JSONB DEFAULT '{"time":0,"blocks":[]}';
  END IF;
END $$;

-- Add view_count column if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE blog_posts 
    ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created_at 
ON blog_posts(published DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_tags 
ON blog_posts USING GIN(tags);

-- Ensure RLS is enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create or replace policies (drop existing first if needed)
DROP POLICY IF EXISTS "Allow public to read published posts" ON blog_posts;
CREATE POLICY "Allow public to read published posts"
ON blog_posts
FOR SELECT
USING (published = true);

DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON blog_posts;
CREATE POLICY "Allow authenticated users to manage posts"
ON blog_posts
FOR ALL
USING (auth.role() = 'authenticated');

-- Create storage bucket for blog images (if not exists)
DO $$ BEGIN
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Create or replace storage policies
DROP POLICY IF EXISTS "Allow public to read blog images" ON storage.objects;
CREATE POLICY "Allow public to read blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Allow authenticated to upload blog images" ON storage.objects;
CREATE POLICY "Allow authenticated to upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
