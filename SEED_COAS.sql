-- Insert COA records for the locally added images
-- This script assumes the images are present in public/assets/coas/

INSERT INTO coas (title, image_url)
VALUES
  ('GHK-CU 50mg', '/assets/coas/ghk-cu-50mg.jpg'),
  ('Tirzepatide 30mg', '/assets/coas/tirzepatide-30mg.jpg'),
  ('AHK-Cu / AHK Copper (1:1)', '/assets/coas/ahk-cu.jpg'),
  ('NAD+ 500mg', '/assets/coas/nad-500mg.jpg'),
  ('Copper Peptide', '/assets/coas/copper-peptide.jpg')
ON CONFLICT DO NOTHING; -- Assuming title might be unique or we tolerate duplicates if no unique constraint
