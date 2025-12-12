-- Create the COA table
CREATE TABLE IF NOT EXISTS coas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coas ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the website)
CREATE POLICY "Public read access" ON coas
  FOR SELECT TO public
  USING (true);

-- Allow authenticated users (admin) to manage (insert/update/delete)
CREATE POLICY "Admin full access" ON coas
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
