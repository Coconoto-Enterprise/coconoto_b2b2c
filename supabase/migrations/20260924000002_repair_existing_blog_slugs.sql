-- Repair slugs generated before title normalization was fixed.
-- This intentionally uses title-only URLs; duplicate titles receive -2, -3, etc.

DROP INDEX IF EXISTS idx_mern_blogs_slug_unique;

ALTER TABLE mern_blogs
  ADD COLUMN IF NOT EXISTS slug TEXT;

WITH normalized AS (
  SELECT
    id,
    lower(
      trim(
        both '-' FROM regexp_replace(
          regexp_replace(
            lower(coalesce(title, 'blog-post')),
            '[^a-z0-9]+',
            '-',
            'g'
          ),
          '(^-+|-+$)',
          '',
          'g'
        )
      )
    ) AS base_slug,
    created_at,
    blog_id
  FROM mern_blogs
), ranked AS (
  SELECT
    id,
    base_slug,
    row_number() OVER (
      PARTITION BY base_slug
      ORDER BY created_at ASC, blog_id ASC
    ) AS slug_number
  FROM normalized
)
UPDATE mern_blogs AS blogs
SET slug = CASE
  WHEN ranked.slug_number = 1 THEN ranked.base_slug
  ELSE ranked.base_slug || '-' || ranked.slug_number
END
FROM ranked
WHERE blogs.id = ranked.id;

UPDATE mern_blogs
SET slug = 'blog-post-' || row_number
FROM (
  SELECT id, row_number() OVER (ORDER BY created_at ASC, blog_id ASC) AS row_number
  FROM mern_blogs
  WHERE slug IS NULL OR slug = ''
) AS missing
WHERE mern_blogs.id = missing.id;

CREATE UNIQUE INDEX idx_mern_blogs_slug_unique
ON mern_blogs (slug);

ALTER TABLE mern_blogs
  ALTER COLUMN slug SET NOT NULL;
