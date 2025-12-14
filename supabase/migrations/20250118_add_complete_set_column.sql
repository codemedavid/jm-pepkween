-- Add is_complete_set column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_complete_set BOOLEAN DEFAULT false;

-- Disable RLS on products to ensure no access issues (as generally requested)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
