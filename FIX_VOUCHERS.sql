-- Create vouchers table if it doesn't exist
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_spend DECIMAL(10, 2) DEFAULT 0,
  usage_limit INTEGER, -- NULL means unlimited
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors on re-run
DROP POLICY IF EXISTS "Public read access" ON vouchers;
DROP POLICY IF EXISTS "Admin full access" ON vouchers;

-- Create Policies
-- Public read access (needed for checkout validation)
CREATE POLICY "Public read access" ON vouchers
  FOR SELECT TO public
  USING (true);

-- Admin full access (simplistic security for this app level)
CREATE POLICY "Admin full access" ON vouchers
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);

-- Update orders table to store voucher info
-- Using DO block to check if column exists first (Postgres < 9.6 style often needed, but IF NOT EXISTS works in newer)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS voucher_code TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Function to increment usage safely
CREATE OR REPLACE FUNCTION increment_voucher_usage(voucher_code TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE vouchers
  SET times_used = times_used + 1
  WHERE code = voucher_code;
END;
$$;
