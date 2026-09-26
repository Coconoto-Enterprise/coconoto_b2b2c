-- Use a security-definer RPC for guest interaction upserts. Direct upserts
-- require SELECT access to conflicting rows, which would expose like-only
-- guest records and their email addresses.
CREATE OR REPLACE FUNCTION public.save_guest_blog_interaction(
  p_blog_id TEXT,
  p_name TEXT,
  p_email TEXT,
  p_liked BOOLEAN DEFAULT false,
  p_comment TEXT DEFAULT '',
  p_wants_newsletter BOOLEAN DEFAULT false
)
RETURNS TABLE (
  interaction_id UUID,
  interaction_name TEXT,
  interaction_email TEXT,
  interaction_comment TEXT,
  interaction_liked BOOLEAN,
  interaction_wants_newsletter BOOLEAN,
  interaction_created_at TIMESTAMP WITH TIME ZONE,
  total_likes BIGINT,
  total_comments BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  saved blog_guest_interactions;
BEGIN
  IF char_length(trim(p_name)) NOT BETWEEN 1 AND 120
    OR char_length(trim(p_email)) NOT BETWEEN 3 AND 320
    OR char_length(coalesce(p_comment, '')) > 5000 THEN
    RAISE EXCEPTION 'Invalid guest interaction details';
  END IF;

  INSERT INTO blog_guest_interactions (blog_id, name, email, liked, comment, wants_newsletter)
  VALUES (p_blog_id, trim(p_name), lower(trim(p_email)), coalesce(p_liked, false), trim(coalesce(p_comment, '')), coalesce(p_wants_newsletter, false))
  ON CONFLICT (blog_id, email) DO UPDATE SET
    name = EXCLUDED.name,
    liked = EXCLUDED.liked,
    comment = CASE WHEN EXCLUDED.comment <> '' THEN EXCLUDED.comment ELSE blog_guest_interactions.comment END,
    wants_newsletter = EXCLUDED.wants_newsletter,
    updated_at = timezone('utc'::text, now())
  RETURNING * INTO saved;

  RETURN QUERY
  SELECT saved.id, saved.name, saved.email, saved.comment, saved.liked, saved.wants_newsletter, saved.created_at,
    count(*) FILTER (WHERE interactions.liked = true),
    count(*) FILTER (WHERE interactions.comment <> '')
  FROM blog_guest_interactions AS interactions
  WHERE interactions.blog_id = p_blog_id;
END;
$$;

REVOKE ALL ON FUNCTION public.save_guest_blog_interaction(TEXT, TEXT, TEXT, BOOLEAN, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_guest_blog_interaction(TEXT, TEXT, TEXT, BOOLEAN, TEXT, BOOLEAN) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can create guest blog interactions" ON blog_guest_interactions;
DROP POLICY IF EXISTS "Anyone can update guest blog interactions" ON blog_guest_interactions;

REVOKE SELECT (email, wants_newsletter) ON blog_guest_interactions FROM anon, authenticated;