-- Storage policy lockdown for the `product-images` and `blog-images` buckets.
-- v2 of 20260817000002_lock_product_and_blog_image_buckets.sql.
-- Hardened so it skips the per-bucket block if the bucket doesn't exist
-- in the target Supabase project (rather than aborting the whole run).
--
-- Before: INSERT into `product-images` had `WITH CHECK (bucket_id = ...)`
-- with no `auth.role()` constraint, meaning the `anon` role could upload
-- attacker-controlled content into the bucket (and have it served from
-- the project's CDN). UPDATE/DELETE accepted any object in the bucket.
--
-- The `blog-images` bucket is public-readable but the original migration
-- already gates INSERT on `auth.role() = 'authenticated'` — that one
-- stays the same, but we tighten the UPDATE/DELETE policies to require
-- the object owner to match the JWT subject.

SET client_min_messages = NOTICE;

-- Helper: drop any policy by exact name, only if the named bucket exists.
CREATE OR REPLACE FUNCTION pg_temp._drop_storage_policies(_bucket text, _names text[])
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  nm text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = _bucket) THEN
    RAISE NOTICE '  [skip] storage bucket % does not exist — leaving policies alone', _bucket;
    RETURN;
  END IF;
  FOREACH nm IN ARRAY _names LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', nm);
  END LOOP;
END;
$$;

-- ===========================================================================
-- product-images
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'product-images') THEN
    RAISE NOTICE '[skip] storage bucket product-images missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_storage_policies('product-images', ARRAY[
    'Public read access for product images',
    'Vendors can upload product images',
    'Vendors can update their own product images',
    'Vendors can delete their own product images',
    'Service role manages product-images inserts',
    'Service role manages product-images updates',
    'Service role manages product-images deletes',
    'Authenticated vendors can insert product images',
    'Authenticated vendors can update own product images',
    'Authenticated vendors can delete own product images'
  ]);

  -- Public read stays (the bucket is intentionally public so buyers can
  -- load product photos without an account).
  EXECUTE $E$
    CREATE POLICY "Public read access for product images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'product-images')
  $E$;

  -- Inserts must come from an authenticated vendor.
  EXECUTE $E$
    CREATE POLICY "Authenticated vendors can insert product images"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL)
  $E$;

  -- Updates/Deletes scope to objects owned by the calling vendor.
  EXECUTE $E$
    CREATE POLICY "Authenticated vendors can update own product images"
      ON storage.objects FOR UPDATE TO authenticated
      USING  (bucket_id = 'product-images' AND auth.uid() IS NOT NULL AND owner = auth.uid())
      WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL)
  $E$;

  EXECUTE $E$
    CREATE POLICY "Authenticated vendors can delete own product images"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL AND owner = auth.uid())
  $E$;

  -- Service-role path used by api/upload-product-image.js (server-side
  -- uploads are also restricted to authenticated vendors via JWT before
  -- the function runs).
  EXECUTE $E$
    CREATE POLICY "Service role manages product-images inserts"
      ON storage.objects FOR INSERT TO service_role
      WITH CHECK (bucket_id = 'product-images')
  $E$;
  EXECUTE $E$
    CREATE POLICY "Service role manages product-images updates"
      ON storage.objects FOR UPDATE TO service_role
      USING (bucket_id = 'product-images')
  $E$;
  EXECUTE $E$
    CREATE POLICY "Service role manages product-images deletes"
      ON storage.objects FOR DELETE TO service_role
      USING (bucket_id = 'product-images')
  $E$;
END $$;

-- Belt & braces: revoke INSERT/UPDATE/DELETE on the bucket from anon,
-- so a misconfigured policy can't widen things accidentally. Idempotent.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'product-images') THEN
    EXECUTE 'REVOKE INSERT, UPDATE, DELETE ON storage.objects FROM anon';
  END IF;
END $$;

-- ===========================================================================
-- blog-images
-- Already required `auth.role() = 'authenticated'` for INSERT, but the
-- UPDATE/DELETE checks used `bucket_id = ...` only. Tighten to require
-- the row's `owner` to match the JWT.
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'blog-images') THEN
    RAISE NOTICE '[skip] storage bucket blog-images missing';
    RETURN;
  END IF;
  PERFORM pg_temp._drop_storage_policies('blog-images', ARRAY[
    'Public read access for blog images',
    'Authenticated authors can upload blog images',
    'Authors can update their own blog images',
    'Authors can delete their own blog images'
  ]);

  EXECUTE $E$
    CREATE POLICY "Public read access for blog images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'blog-images')
  $E$;

  EXECUTE $E$
    CREATE POLICY "Authenticated authors can upload blog images"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL)
  $E$;

  EXECUTE $E$
    CREATE POLICY "Authors can update their own blog images"
      ON storage.objects FOR UPDATE TO authenticated
      USING  (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL AND owner = auth.uid())
      WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL)
  $E$;

  EXECUTE $E$
    CREATE POLICY "Authors can delete their own blog images"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL AND owner = auth.uid())
  $E$;
END $$;

DROP FUNCTION IF EXISTS pg_temp._drop_storage_policies(text, text[]);
