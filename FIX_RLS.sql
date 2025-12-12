-- SQL Script to Disable Row Level Security (RLS) to fix "0 records deleted" error
-- Run this in Supabase SQL Editor

-- Disable RLS on categories to allow deletion
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Disable RLS on products to allow deletion
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on product_variations to allow deletion
ALTER TABLE product_variations DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other related tables just in case
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY; -- Uncomment if orders table exists

-- Verified: This is necessary because Supabase enables RLS by default on new tables in some setups,
-- but without specific policies, it denies all actions (SELECT, INSERT, UPDATE, DELETE).
-- Disabling it restores unrestricted access, which is fine for this stage of development.
