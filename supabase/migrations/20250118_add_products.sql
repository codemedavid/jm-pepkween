-- 1. Insert Categories
insert into public.categories (id, name, icon, sort_order, active)
values
  ('peptides', 'Peptides', 'test-tube-2', 10, true),
  ('accessories', 'Accessories', 'syringe', 20, true)
on conflict (id) do update set name = excluded.name, active = true;

-- 2. Insert Products (Peptides)
insert into public.products (
  id, name, description, category, base_price, purity_percentage, stock_quantity, available, featured, 
  molecular_weight, storage_conditions, is_complete_set, complete_set_price
)
values
  (
    'ghk-cu', 'GHK-Cu', 
    'Copper peptide known for skin regeneration and anti-aging properties.', 
    'peptides', 1500, 99.0, 50, true, true, 
    '340.5 g/mol', 'Store at 2-8°C', true, 1800
  ),
  (
    'klow', 'KLOW', 
    'Peptide blend for enhanced wellness.', 
    'peptides', 1600, 99.0, 50, true, false, 
    'N/A', 'Store at 2-8°C', true, 1900
  ),
  (
    'aod-9604', 'AOD 9604', 
    'Anti-obesity drug derived from GH, aids in fat loss.', 
    'peptides', 1400, 99.0, 50, true, true, 
    '1815.1 g/mol', 'Store at 2-8°C', true, 1700
  ),
  (
    'epithalon', 'Epithalon', 
    'Anti-aging peptide known for telomere lengthening.', 
    'peptides', 1800, 99.0, 50, true, false, 
    '390.3 g/mol', 'Store at 2-8°C', true, 2100
  );

-- 3. Insert Products (Accessories)
insert into public.products (
  id, name, description, category, base_price, purity_percentage, stock_quantity, available, featured,
  storage_conditions, is_complete_set
)
values
  (
    'peppie-pen', 'Peppie Pen', 
    'High-quality peptide injection pen.', 
    'accessories', 500, 0, 100, true, false, 
    'Store at Room Temp', false
  ),
  (
    'needle-cartridges', 'Needle Cartridges', 
    'Sterile needle cartridges for Peppie Pen (Box of 10).', 
    'accessories', 300, 0, 100, true, false, 
    'Store at Room Temp', false
  )
on conflict (id) do nothing;
