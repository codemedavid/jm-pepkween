-- FIX CHECKOUT ERROR
-- Run this ENTIRE SCRIPT in your Supabase SQL Editor
-- This will create the missing orders table and ensure all columns exist

-- 1. Create the orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping Address
  shipping_address TEXT NOT NULL,
  shipping_barangay TEXT DEFAULT '',
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip_code TEXT NOT NULL,
  shipping_country TEXT,
  
  -- Shipping Details
  shipping_location TEXT, -- NCR, LUZON, VISAYAS_MINDANAO
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Order Details
  order_items JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method_id TEXT,
  payment_method_name TEXT,
  payment_proof_url TEXT,
  payment_status TEXT DEFAULT 'pending',
  
  -- Contact Method
  contact_method TEXT,
  
  -- Order Status
  order_status TEXT DEFAULT 'new',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add any missing columns (safe to run even if table exists)
DO $$ 
BEGIN
  -- shipping_barangay
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_barangay') THEN
    ALTER TABLE orders ADD COLUMN shipping_barangay TEXT DEFAULT '';
  END IF;

  -- shipping_location
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_location') THEN
    ALTER TABLE orders ADD COLUMN shipping_location TEXT;
  END IF;

  -- shipping_fee
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_fee') THEN
    ALTER TABLE orders ADD COLUMN shipping_fee DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- payment_proof_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_proof_url') THEN
    ALTER TABLE orders ADD COLUMN payment_proof_url TEXT;
  END IF;
  
  -- contact_method
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'contact_method') THEN
    ALTER TABLE orders ADD COLUMN contact_method TEXT;
  END IF;
END $$;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 4. Enable Row Level Security (RLS) and add public policy
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Remove existing policy if any to avoid errors
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;

-- Create policy to allow anyone to place an order
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to read their own orders (optional, but good for confirmation pages if using auth)
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT
  TO public
  USING (true); -- For now, open read to allow confirmation page to work without complex auth

-- 5. Fix permissions for public role
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON orders TO service_role;
