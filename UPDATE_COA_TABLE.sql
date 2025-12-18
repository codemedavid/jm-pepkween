-- Add new columns to the existing coas table
ALTER TABLE coas 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS purity TEXT,
ADD COLUMN IF NOT EXISTS quantity TEXT,
ADD COLUMN IF NOT EXISTS task_number TEXT, -- e.g. "#68396"
ADD COLUMN IF NOT EXISTS verification_key TEXT,
ADD COLUMN IF NOT EXISTS test_date TEXT, -- Keeping as text for flexibility "20 JUN 2025"
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true;

-- Update existing rows if any (optional, safe to run if empty)
-- UPDATE coas SET product_name = title WHERE product_name IS NULL;
