-- Create vouchers table
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

-- RLS Policies
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for checkout validation)
CREATE POLICY "Public read access" ON vouchers
  FOR SELECT TO public
  USING (true);

-- Admin full access
CREATE POLICY "Admin full access" ON vouchers
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);

-- Update orders table to store voucher info
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS voucher_code TEXT,
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
