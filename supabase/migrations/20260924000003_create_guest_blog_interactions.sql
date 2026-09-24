-- Public blog readers can interact without creating an account.
CREATE TABLE IF NOT EXISTS blog_guest_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT NOT NULL REFERENCES mern_blogs(blog_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  liked BOOLEAN NOT NULL DEFAULT false,
  wants_newsletter BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (blog_id, email)
);

CREATE INDEX IF NOT EXISTS idx_blog_guest_interactions_blog_id
  ON blog_guest_interactions(blog_id);

ALTER TABLE blog_guest_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guest blog comments"
ON blog_guest_interactions FOR SELECT
USING (comment <> '');

CREATE POLICY "Anyone can create guest blog interactions"
ON blog_guest_interactions FOR INSERT
WITH CHECK (char_length(trim(name)) BETWEEN 1 AND 120
  AND char_length(trim(email)) BETWEEN 3 AND 320
  AND char_length(comment) <= 5000);

CREATE POLICY "Anyone can update guest blog interactions"
ON blog_guest_interactions FOR UPDATE
USING (true)
WITH CHECK (char_length(trim(name)) BETWEEN 1 AND 120
  AND char_length(trim(email)) BETWEEN 3 AND 320
  AND char_length(comment) <= 5000);

CREATE OR REPLACE FUNCTION get_guest_blog_counts(p_blog_id TEXT)
RETURNS TABLE(total_likes BIGINT, total_comments BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    count(*) FILTER (WHERE liked = true),
    count(*) FILTER (WHERE comment <> '')
  FROM blog_guest_interactions
  WHERE blog_id = p_blog_id;
$$;

REVOKE ALL ON FUNCTION get_guest_blog_counts(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_guest_blog_counts(TEXT) TO anon, authenticated;