-- Create Blog Authors/Users extension table (linked to auth.users)
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  fullname TEXT NOT NULL,
  bio TEXT DEFAULT '',
  profile_img TEXT DEFAULT '',
  -- Social links
  youtube TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  github TEXT DEFAULT '',
  website TEXT DEFAULT '',
  -- Account info
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Enhanced Blog table
CREATE TABLE IF NOT EXISTS mern_blogs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  blog_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  banner TEXT DEFAULT '',
  des TEXT DEFAULT '', -- Short description/excerpt
  content JSONB DEFAULT '[]', -- EditorJS content
  tags TEXT[] DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES blog_authors(id) ON DELETE CASCADE,
  
  -- Activity tracking
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_reads INTEGER DEFAULT 0,
  total_parent_comments INTEGER DEFAULT 0,
  
  -- Publishing status
  is_draft BOOLEAN DEFAULT true,
  draft_version TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- For backward compatibility
  content_blocks JSONB DEFAULT '{"time":0,"blocks":[]}'::jsonb
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  comment_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  blog_id TEXT NOT NULL REFERENCES mern_blogs(blog_id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES blog_authors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  children_level INTEGER DEFAULT 0,
  is_reply_to TEXT DEFAULT '', -- comment_id of parent comment
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL REFERENCES mern_blogs(blog_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES blog_authors(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(blog_id, user_id)
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS blog_notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  notification_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES blog_authors(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'like', 'comment', 'reply', 'follow'
  from_user_id UUID REFERENCES blog_authors(id) ON DELETE CASCADE,
  blog_id TEXT REFERENCES mern_blogs(blog_id) ON DELETE CASCADE,
  comment_id TEXT REFERENCES blog_comments(comment_id) ON DELETE CASCADE,
  message TEXT DEFAULT '',
  is_seen BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mern_blogs_author_id ON mern_blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_mern_blogs_published ON mern_blogs(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_mern_blogs_draft ON mern_blogs(is_draft);
CREATE INDEX IF NOT EXISTS idx_mern_blogs_tags ON mern_blogs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_author_id ON blog_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_notifications_user_id ON blog_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_notifications_is_seen ON blog_notifications(is_seen);

-- Enable RLS
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mern_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_authors (read-only, profile is public)
CREATE POLICY "Anyone can read blog author profiles"
ON blog_authors FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON blog_authors FOR UPDATE
USING (auth.uid() = id);

-- RLS Policies for mern_blogs
CREATE POLICY "Anyone can read published blogs"
ON mern_blogs FOR SELECT
USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Authors can create blogs"
ON mern_blogs FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own blogs"
ON mern_blogs FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own blogs"
ON mern_blogs FOR DELETE
USING (auth.uid() = author_id);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can read blog comments"
ON blog_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON blog_comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
ON blog_comments FOR UPDATE
USING (auth.uid() = author_id);

-- RLS Policies for blog_likes
CREATE POLICY "Anyone can read likes"
ON blog_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like blogs"
ON blog_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own likes"
ON blog_likes FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for blog_notifications
CREATE POLICY "Users can read their own notifications"
ON blog_notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON blog_notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
ON blog_notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for blog-images bucket (drop if exist and recreate)
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can read blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "Anyone can read blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

  CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
EXCEPTION WHEN OTHERS THEN
  -- If policies already exist, continue
  NULL;
END $$;
