-- COMPLETE FIX: Products and Vouchers Tables
-- Run this in Supabase SQL Editor
-- This ensures all tables and columns exist with correct names

-- ============================================
-- STEP 1: Disable RLS on all tables
-- ============================================

ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_variations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vouchers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shipping_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS guide_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS assessment_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS date_availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coas DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Create/Fix products table
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  base_price NUMERIC DEFAULT 0,
  discount_price NUMERIC,
  discount_start_date TIMESTAMPTZ,
  discount_end_date TIMESTAMPTZ,
  discount_active BOOLEAN DEFAULT false,
  purity_percentage NUMERIC DEFAULT 0,
  molecular_weight TEXT,
  cas_number TEXT,
  sequence TEXT,
  storage_conditions TEXT DEFAULT 'Store at -20°C',
  inclusions TEXT[],
  is_complete_set BOOLEAN DEFAULT false,
  complete_set_price NUMERIC,
  complete_set_description TEXT,
  stock_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  safety_sheet_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
    ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'purity_percentage') THEN
    ALTER TABLE products ADD COLUMN purity_percentage NUMERIC DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_complete_set') THEN
    ALTER TABLE products ADD COLUMN is_complete_set BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'complete_set_price') THEN
    ALTER TABLE products ADD COLUMN complete_set_price NUMERIC;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'complete_set_description') THEN
    ALTER TABLE products ADD COLUMN complete_set_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url') THEN
    ALTER TABLE products ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'molecular_weight') THEN
    ALTER TABLE products ADD COLUMN molecular_weight TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cas_number') THEN
    ALTER TABLE products ADD COLUMN cas_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sequence') THEN
    ALTER TABLE products ADD COLUMN sequence TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'storage_conditions') THEN
    ALTER TABLE products ADD COLUMN storage_conditions TEXT DEFAULT 'Store at -20°C';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'inclusions') THEN
    ALTER TABLE products ADD COLUMN inclusions TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'safety_sheet_url') THEN
    ALTER TABLE products ADD COLUMN safety_sheet_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_active') THEN
    ALTER TABLE products ADD COLUMN discount_active BOOLEAN DEFAULT false;
  END IF;
END $$;

ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create/Fix vouchers table
-- ============================================

-- Drop and recreate vouchers table with correct column names
DROP TABLE IF EXISTS vouchers CASCADE;

CREATE TABLE vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vouchers DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create categories table if missing
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '💊',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Insert default category if none exist
INSERT INTO categories (id, name, icon, sort_order, active)
VALUES ('peptides', 'Peptides', '💊', 1, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Grant permissions
-- ============================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['products', 'product_variations', 'categories', 'vouchers', 'orders', 'payment_methods', 'shipping_locations', 'testimonials', 'faqs', 'site_settings', 'guide_topics', 'assessment_responses', 'date_availability', 'coas']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT ALL ON %I TO anon, authenticated', tbl);
    END IF;
  END LOOP;
END $$;

-- ============================================
-- STEP 6: Create helper functions
-- ============================================

CREATE OR REPLACE FUNCTION increment_voucher_usage(voucher_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE vouchers 
  SET times_used = COALESCE(times_used, 0) + 1,
      updated_at = NOW()
  WHERE code = voucher_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_voucher_usage(TEXT) TO anon, authenticated;

-- ============================================
-- DONE!
-- ============================================
SELECT 'SUCCESS! All tables created and permissions granted.' AS status;
