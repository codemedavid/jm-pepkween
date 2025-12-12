-- Create payment-proofs bucket and policies
-- Run this in Supabase SQL Editor

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  true, -- Public for easier access by admin
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Policies
-- Public Read (Admin needs to see them, or user needs to see confirmation)
DROP POLICY IF EXISTS "Public read access for payment proofs" ON storage.objects;
CREATE POLICY "Public read access for payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Public Upload (Anyone can upload a proof)
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

-- Public Update (optional, maybe not needed if we just upload new ones)
DROP POLICY IF EXISTS "Anyone can update payment proofs" ON storage.objects;
CREATE POLICY "Anyone can update payment proofs"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'payment-proofs');

-- Public Delete (optional)
DROP POLICY IF EXISTS "Anyone can delete payment proofs" ON storage.objects;
CREATE POLICY "Anyone can delete payment proofs"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'payment-proofs');
