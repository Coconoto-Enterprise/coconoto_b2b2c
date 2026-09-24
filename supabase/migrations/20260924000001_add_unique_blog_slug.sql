ALTER TABLE mern_blogs
  ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE mern_blogs
SET slug = lower(
  regexp_replace(
    coalesce(title, 'blog-post'),
    '[^a-z0-9]+',
    '-',
    'g'
  )
)
WHERE slug IS NULL OR slug = '';

UPDATE mern_blogs
SET slug = slug || '-' || substring(blog_id, 1, 6)
WHERE slug IS NULL OR slug = '' OR EXISTS (
  SELECT 1
  FROM mern_blogs AS existing
  WHERE existing.slug = mern_blogs.slug
    AND existing.blog_id <> mern_blogs.blog_id
);

WITH ranked AS (
  SELECT
    id,
    slug,
    ROW_NUMBER() OVER (
      PARTITION BY slug
      ORDER BY created_at ASC, blog_id ASC
    ) AS rn
  FROM mern_blogs
)
UPDATE mern_blogs
SET slug = ranked.slug || '-' || ranked.rn
FROM ranked
WHERE mern_blogs.id = ranked.id
  AND ranked.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mern_blogs_slug_unique
ON mern_blogs (slug);

ALTER TABLE mern_blogs
  ALTER COLUMN slug SET NOT NULL;
