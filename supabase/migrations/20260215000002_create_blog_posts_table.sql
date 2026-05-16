-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  content_blocks JSONB DEFAULT '{"time":0,"blocks":[]}',
  excerpt TEXT,
  author TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  view_count INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created_at 
ON blog_posts(published DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_tags 
ON blog_posts USING GIN(tags);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Allow public to read published posts"
ON blog_posts
FOR SELECT
USING (published = true);

-- Authenticated users can create, read, update posts
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

-- Allow public to read blog images
CREATE POLICY "Allow public to read blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated to upload blog images
CREATE POLICY "Allow authenticated to upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
