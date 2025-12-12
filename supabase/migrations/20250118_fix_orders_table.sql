-- Migration to fix missing orders table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping Address
  shipping_address TEXT NOT NULL,
  shipping_barangay TEXT NOT NULL,
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
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  
  -- Contact Method
  contact_method TEXT, -- messenger
  
  -- Order Id / Number
  order_number TEXT,
  
  -- Order Status
  order_status TEXT DEFAULT 'new', -- new, confirmed, processing, shipped, delivered, cancelled
  notes TEXT,
  
  -- Vouchers
  voucher_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow public inserts for now (simplifies initial setup)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for everyone" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON orders FOR SELECT TO public USING (true);
CREATE POLICY "Enable update for everyone" ON orders FOR UPDATE TO public USING (true);
