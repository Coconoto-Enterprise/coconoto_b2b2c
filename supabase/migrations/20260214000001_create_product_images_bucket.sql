-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated vendors to upload images
CREATE POLICY "Vendors can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow vendors to update their own images
CREATE POLICY "Vendors can update their own product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow vendors to delete their own images
CREATE POLICY "Vendors can delete their own product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
