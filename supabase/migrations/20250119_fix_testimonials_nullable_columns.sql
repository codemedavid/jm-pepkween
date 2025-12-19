-- Migration: Fix testimonials table to support screenshot-based entries
-- The new screenshot-based testimonials only require title, description, and image_url
-- Make the legacy fields (name, content, rating, category) nullable

-- Remove NOT NULL constraint from name column
ALTER TABLE public.testimonials ALTER COLUMN name DROP NOT NULL;

-- Remove NOT NULL constraint from content column
ALTER TABLE public.testimonials ALTER COLUMN content DROP NOT NULL;

-- Remove NOT NULL constraint and the check constraint from rating column
ALTER TABLE public.testimonials DROP CONSTRAINT IF EXISTS testimonials_rating_check;
ALTER TABLE public.testimonials ALTER COLUMN rating DROP NOT NULL;

-- Re-add the check constraint but allow NULL values
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_rating_check 
CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

-- Remove NOT NULL constraint from category column
ALTER TABLE public.testimonials ALTER COLUMN category DROP NOT NULL;
