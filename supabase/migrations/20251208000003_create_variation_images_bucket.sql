-- Create storage bucket for variation images
-- Run this in your Supabase SQL Editor

-- Create the variation-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('variation-images', 'variation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create public access policy for the bucket
CREATE POLICY IF NOT EXISTS "Allow public read access on variation-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'variation-images');

CREATE POLICY IF NOT EXISTS "Allow authenticated uploads to variation-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'variation-images');

CREATE POLICY IF NOT EXISTS "Allow authenticated updates to variation-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'variation-images');

CREATE POLICY IF NOT EXISTS "Allow authenticated deletes from variation-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'variation-images');

-- Alternatively, if the above policies fail, run these (simpler version):
-- DROP POLICY IF EXISTS "Allow public read access on variation-images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated uploads to variation-images" ON storage.objects;

-- CREATE POLICY "variation-images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'variation-images');
-- CREATE POLICY "variation-images_public_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'variation-images');
-- CREATE POLICY "variation-images_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'variation-images');
-- CREATE POLICY "variation-images_public_delete" ON storage.objects FOR DELETE USING (bucket_id = 'variation-images');

-- Verify
SELECT * FROM storage.buckets WHERE id = 'variation-images';
