-- SQL Script to clean up unwanted coffee categories
-- Run this in the Supabase SQL Editor

-- Delete categories with IDs or Names related to coffee
DELETE FROM categories 
WHERE id IN ('hot-coffee', 'iced-coffee') 
   OR name ILIKE '%coffee%' 
   OR icon = '☕';

-- Ideally products referencing these would cascade delete or be orphaned. 
-- Assuming ON DELETE SET NULL or CASCADE is not strictly set, let's clean them too if they exist.
DELETE FROM products WHERE category IN ('hot-coffee', 'iced-coffee');
