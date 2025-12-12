-- Restore missing tables: shipping_locations and vouchers

-- 1. Create shipping_locations table
CREATE TABLE IF NOT EXISTS shipping_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (though we disabled it globally, it's good practice to have it ready)
ALTER TABLE shipping_locations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public can view active shipping locations" ON shipping_locations;
CREATE POLICY "Public can view active shipping locations"
    ON shipping_locations FOR SELECT
    USING (is_active = true);

-- Insert default shipping locations if empty
INSERT INTO shipping_locations (id, name, fee, order_index)
VALUES 
    ('NCR', 'Metro Manila', 100.00, 1),
    ('LUZON', 'Luzon', 150.00, 2),
    ('VISAYAS_MINDANAO', 'Visayas & Mindanao', 200.00, 3)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    fee = EXCLUDED.fee;


-- 2. Create vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2), -- Optional max discount for percentage
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Create policy for public to validate vouchers
DROP POLICY IF EXISTS "Public can view active vouchers" ON vouchers;
CREATE POLICY "Public can view active vouchers"
    ON vouchers FOR SELECT
    USING (is_active = true);

-- Insert sample voucher
INSERT INTO vouchers (code, discount_type, discount_value, min_spend, is_active)
VALUES 
    ('WELCOME10', 'percentage', 10.00, 500.00, true),
    ('SAVE50', 'fixed', 50.00, 1000.00, true)
ON CONFLICT (code) DO NOTHING;

-- 3. Ensure RLS is disabled as per previous request (just to be sure for these new tables)
ALTER TABLE shipping_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers DISABLE ROW LEVEL SECURITY;
