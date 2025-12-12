-- Force Delete Coffee Categories Script
-- Run this in the Supabase SQL Editor to permanently remove coffee categories and related products.

-- 1. Delete variations for products in coffee categories
DELETE FROM product_variations 
WHERE product_id IN (
    SELECT id FROM products 
    WHERE category IN ('hot-coffee', 'iced-coffee')
);

-- 2. Delete products in coffee categories
DELETE FROM products 
WHERE category IN ('hot-coffee', 'iced-coffee');

-- 3. Delete the categories themselves
DELETE FROM categories 
WHERE id IN ('hot-coffee', 'iced-coffee');

-- 4. Cleanup by name/icon in case IDs are different
DELETE FROM product_variations 
WHERE product_id IN (
    SELECT id FROM products 
    WHERE category IN (SELECT id FROM categories WHERE name ILIKE '%coffee%' OR icon = '☕')
);

DELETE FROM products 
WHERE category IN (SELECT id FROM categories WHERE name ILIKE '%coffee%' OR icon = '☕');

DELETE FROM categories 
WHERE name ILIKE '%coffee%' OR icon = '☕';
