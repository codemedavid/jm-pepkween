-- Migration: Update testimonials table for screenshot-based testimonials
-- Add title and description columns for the new gallery format

-- Add title column
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS title TEXT;

-- Add description column (summary of the screenshot content)
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing testimonials to have a default title if they have content
UPDATE public.testimonials 
SET title = 'Customer Review', 
    description = content 
WHERE title IS NULL AND content IS NOT NULL;
