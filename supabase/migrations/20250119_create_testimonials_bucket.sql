-- Create storage bucket for testimonial screenshots
-- Run this in Supabase SQL Editor

-- Create the testimonials bucket
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'testimonials',
  'testimonials',
  true,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
  10485760 -- 10MB
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
  file_size_limit = 10485760;

-- Allow public read access to testimonial images
CREATE POLICY "Public testimonial images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonials');

-- Allow uploads (permissive for now, can be restricted later)
CREATE POLICY "Anyone can upload testimonial images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'testimonials');

-- Allow deletes for cleanup
CREATE POLICY "Anyone can delete testimonial images"
ON storage.objects FOR DELETE
USING (bucket_id = 'testimonials');
