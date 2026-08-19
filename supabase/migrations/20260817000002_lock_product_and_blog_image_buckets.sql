-- Storage policy lockdown for the `product-images` and `blog-images` buckets.
-- Generated in response to docs/security-audit-2026-08-17.md.
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

-- =====================================================================
-- product-images
-- =====================================================================
DROP POLICY IF EXISTS "Public read access for product images"          ON storage.objects;
DROP POLICY IF EXISTS "Vendors can upload product images"              ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their own product images"    ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their own product images"    ON storage.objects;
DROP POLICY IF EXISTS "Service role manages product-images inserts"    ON storage.objects;
DROP POLICY IF EXISTS "Service role manages product-images updates"    ON storage.objects;
DROP POLICY IF EXISTS "Service role manages product-images deletes"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated vendors can insert product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated vendors can update own product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated vendors can delete own product images" ON storage.objects;

-- Public read stays (the bucket is intentionally public so that buyers can
-- load product photos without an account).
CREATE POLICY "Public read access for product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Inserts must come from an authenticated vendor.
CREATE POLICY "Authenticated vendors can insert product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

-- Updates/Deletes scope to objects owned by the calling vendor.
CREATE POLICY "Authenticated vendors can update own product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
    AND owner = auth.uid()
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated vendors can delete own product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
    AND owner = auth.uid()
  );

-- Service-role path used by api/upload-product-image.js (server-side
-- uploads are also restricted to authenticated vendors via JWT before
-- the function runs).
CREATE POLICY "Service role manages product-images inserts"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Service role manages product-images updates"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role manages product-images deletes"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'product-images');

-- Belt & braces: revoke INSERT/UPDATE/DELETE on the bucket from anon,
-- so a misconfigured policy can't widen things accidentally.
REVOKE INSERT, UPDATE, DELETE ON storage.objects FROM anon;

-- =====================================================================
-- blog-images
-- Already required `auth.role() = 'authenticated'` for INSERT, but the
-- UPDATE/DELETE checks used `bucket_id = ...` only. Tighten to require
-- the row's `owner` to match the JWT.
-- =====================================================================
DROP POLICY IF EXISTS "Public read access for blog images"          ON storage.objects;
DROP POLICY IF EXISTS "Authenticated authors can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authors can update their own blog images"     ON storage.objects;
DROP POLICY IF EXISTS "Authors can delete their own blog images"     ON storage.objects;

CREATE POLICY "Public read access for blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated authors can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can update their own blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
    AND owner = auth.uid()
  )
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can delete their own blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
    AND owner = auth.uid()
  );
