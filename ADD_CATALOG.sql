-- SQL Script to populate Categories and Products
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
  v_peptides_id TEXT := 'peptides';
  v_topicals_id TEXT := 'topicals';
  v_addons_id TEXT := 'add-ons';
  v_extras_id TEXT := 'extras';
BEGIN
  -- 1. Insert Categories (Using TEXT IDs for simplicity/readability like slugs, or UPSERT if existing)
  -- 'categories' table usually has 'id' as TEXT based on CategoryManager logic: generateIdFromName
  
  -- Peptides
  INSERT INTO categories (id, name, icon, sort_order, active)
  VALUES (v_peptides_id, 'Peptides', '🧬', 1, true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

  -- Topicals
  INSERT INTO categories (id, name, icon, sort_order, active)
  VALUES (v_topicals_id, 'Topicals', '🧴', 2, true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

  -- Add ons
  INSERT INTO categories (id, name, icon, sort_order, active)
  VALUES (v_addons_id, 'Add ons', '💉', 3, true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

  -- Extras
  INSERT INTO categories (id, name, icon, sort_order, active)
  VALUES (v_extras_id, 'Extras', '✨', 4, true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;


  -- 2. Insert Products
  -- We use ON CONFLICT (id) DO NOTHING if possible, but we don't know IDs.
  -- Ideally we clear old products or just insert. To avoid duplicates on multiple runs, we can check by name.
  -- For this script, I'll delete existing products with these names first to ensure clean state, or just Insert.
  -- Safest is just INSERT. User can delete duplicates if they run it twice.

  -- Peptides
  INSERT INTO products (name, description, category, base_price, stock_quantity, available, created_at, updated_at)
  VALUES 
    ('Tirz 15mg', 'Description for Tirz 15mg', v_peptides_id, 0, 100, true, NOW(), NOW()),
    ('Tirz 30mg', 'Description for Tirz 30mg', v_peptides_id, 0, 100, true, NOW(), NOW()),
    ('GHKCU 100mg', 'Description for GHKCU 100mg', v_peptides_id, 0, 100, true, NOW(), NOW()),
    ('NAD 500mg', 'Description for NAD 500mg', v_peptides_id, 0, 100, true, NOW(), NOW());

  -- Topicals
  INSERT INTO products (name, description, category, base_price, stock_quantity, available, created_at, updated_at)
  VALUES 
    ('GHKCu 1g', 'Description for GHKCu 1g', v_topicals_id, 0, 100, true, NOW(), NOW()),
    ('AHKCu 1g', 'Description for AHKCu 1g', v_topicals_id, 0, 100, true, NOW(), NOW());

  -- Add ons
  INSERT INTO products (name, description, category, base_price, stock_quantity, available, created_at, updated_at)
  VALUES 
    ('Dispo Peppy Pen', 'Description for Dispo Peppy Pen', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('Reusable Peppy Pen', 'Description for Reusable Peppy Pen', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('Alcohol Pads', 'Description for Alcohol Pads', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('3ml syringe', 'Description for 3ml syringe', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('0.5 insulin syringe', 'Description for 0.5 insulin syringe', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('1ml insulin syringe', 'Description for 1ml insulin syringe', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('Peppy pen needle', 'Description for Peppy pen needle', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('Peppy pen cartridge', 'Description for Peppy pen cartridge', v_addons_id, 0, 100, true, NOW(), NOW()),
    ('Bac water 10ml', 'Description for Bac water 10ml', v_addons_id, 0, 100, true, NOW(), NOW());

  -- Extras
  INSERT INTO products (name, description, category, base_price, stock_quantity, available, created_at, updated_at)
  VALUES 
    ('Gluta 1500mg', 'Description for Gluta 1500mg', v_extras_id, 0, 100, true, NOW(), NOW()),
    ('Lipo C Fat Blaster', 'Description for Lipo C Fat Blaster', v_extras_id, 0, 100, true, NOW(), NOW());

END $$;
