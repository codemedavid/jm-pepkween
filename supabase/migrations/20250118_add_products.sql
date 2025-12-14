-- 1. Insert Categories
insert into public.categories (id, name, icon, sort_order, active)
values
  ('peptides', 'Peptides', 'test-tube-2', 10, true),
  ('bac-water', 'Bacteriostatic Water', 'droplet', 15, true),
  ('accessories', 'Accessories', 'syringe', 20, true)
on conflict (id) do update set name = excluded.name, active = true;

-- 2. Insert Products (Peptides)
-- Common description for Complete Set
DO $$
DECLARE
  complete_set_desc text := 'Complete Set/Biohacking kit Includes:
• 💧 BAC Water for reconstitution
• 💉 Syringe for precise reconstitution
• 🩺 6 syringes based on administration route:
  – IM peptides: 6 intramuscular syringes
  – Subcutaneous peptides: 6 insulin syringes
• 🧴 10 alcohol pads
• 🧼 Mini alcohol spray
• 🧻 Mini tissue
• 🧰 Protective case (small plastic box)
• 🧤 Sterile gloves
• 🍵 Refreshing spearmint tea';
BEGIN
  insert into public.products (
    id, name, description, category, base_price, stock_quantity, available, featured, 
    is_complete_set, complete_set_price, complete_set_description
  )
  values
    ('acetic-acid-10ml', 'Acetic Acid 10ml', '', 'peptides', 100, 100, true, false, false, NULL, NULL),
    ('ahk-cu-100mg', 'AHK-CU 100mg', '', 'peptides', 1100, 100, true, false, true, 1300, complete_set_desc),
    ('aod-9604-5mg', 'AOD-9604 5mg', '', 'peptides', 1420, 100, true, false, true, 1620, complete_set_desc),
    ('bpc-157-10mg', 'BPC-157 10mg', '', 'peptides', 1000, 100, true, false, true, 1200, complete_set_desc),
    ('bpc-157-5mg-tb-500-5mg', 'BPC-157 5mg + TB-500 5mg', '', 'peptides', 1790, 100, true, false, true, 1990, complete_set_desc),
    ('cagrilintide-5mg', 'Cagrilintide 5mg', '', 'peptides', 1600, 100, true, false, true, 1800, complete_set_desc),
    ('cagrilintide-10mg', 'Cagrilintide 10mg', '', 'peptides', 2560, 100, true, false, true, 2760, complete_set_desc),
    ('cjc-ipamorelin-5mg-no-dac', 'CJC + Ipamorelin 5mg (No DAC)', '', 'peptides', 2760, 100, true, false, true, 2960, complete_set_desc),
    ('epithalon-50mg', 'Epithalon 50mg', '', 'peptides', 2170, 100, true, false, true, 2370, complete_set_desc),
    ('fat-blaster-10ml', 'Fat Blaster 10ml', '', 'peptides', 1600, 100, true, false, true, 1800, complete_set_desc),
    ('ghkcu-1g-cream-topical', 'GHKCU 1g Cream Topical', '', 'peptides', 940, 100, true, false, true, 1140, complete_set_desc),
    ('ghkcu-100mg', 'GHKCU 100mg', '', 'peptides', 860, 100, true, false, true, 1060, complete_set_desc),
    ('glow', 'GLOW', '', 'peptides', 2620, 100, true, false, true, 2820, complete_set_desc),
    ('glutathione-1500mg', 'Glutathione 1500mg', '', 'peptides', 1300, 100, true, false, true, 1500, complete_set_desc),
    ('hhb-blend-10ml', 'HHB Healthy Hair Skin Nails Blend 10ml', '', 'peptides', 1620, 100, true, false, true, 1820, complete_set_desc),
    ('kisspeptin-10mg', 'Kisspeptin 10mg', '', 'peptides', 1400, 100, true, false, true, 1600, complete_set_desc),
    ('klow', 'KLOW', '', 'peptides', 2820, 100, true, false, true, 3020, complete_set_desc),
    ('kpv-10mg', 'KPV 10mg', '', 'peptides', 1170, 100, true, false, true, 1370, complete_set_desc),
    ('lemon-bottle-10ml', 'Lemon Bottle 10ml', '', 'peptides', 1030, 100, true, false, true, 1230, complete_set_desc),
    ('lipo-c-b12', 'Lipo C with B12', '', 'peptides', 800, 100, true, false, true, 1000, complete_set_desc),
    ('mots-c-10mg', 'Mots C 10mg', '', 'peptides', 1100, 100, true, false, true, 1300, complete_set_desc),
    ('mots-c-40mg', 'Mots C 40mg', '', 'peptides', 2460, 100, true, false, true, 2660, complete_set_desc),
    ('nad-500mg', 'NAD+ 500mg', '', 'peptides', 1280, 100, true, false, true, 1480, complete_set_desc),
    ('pt-141-10mg', 'PT-141 10mg', '', 'peptides', 1130, 100, true, false, true, 1330, complete_set_desc),
    ('retatrutide-30mg', 'Retatrutide 30mg', '', 'peptides', 2800, 100, true, false, true, 3000, complete_set_desc),
    ('selank-10mg', 'Selank 10mg', '', 'peptides', 1160, 100, true, false, true, 1360, complete_set_desc),
    ('semax-10mg', 'Semax 10mg', '', 'peptides', 1160, 100, true, false, true, 1360, complete_set_desc),
    ('snap8-10mg', 'Snap8 10mg', '', 'peptides', 920, 100, true, false, true, 1120, complete_set_desc),
    ('ss-31-10mg', 'SS-31 10mg', '', 'peptides', 830, 100, true, false, true, 1030, complete_set_desc),
    ('tb-500-5mg', 'TB-500 5mg', '', 'peptides', 1230, 100, true, false, true, 1430, complete_set_desc),
    ('tirzepatide-15mg', 'Tirzepatide 15mg', '', 'peptides', 1600, 100, true, false, true, 1800, complete_set_desc),
    ('tirzepatide-30mg', 'Tirzepatide 30mg', '', 'peptides', 2000, 100, true, false, true, 2200, complete_set_desc)
  on conflict (id) do update set 
    name = excluded.name,
    base_price = excluded.base_price,
    is_complete_set = excluded.is_complete_set,
    complete_set_price = excluded.complete_set_price,
    complete_set_description = excluded.complete_set_description,
    category = excluded.category;
END $$;

-- 3. Insert Products (Bacteriostatic Water)
insert into public.products (
  id, name, description, category, base_price, stock_quantity, available, featured, 
  is_complete_set, complete_set_price
)
values
  ('bac-water-pharmagrade-10ml', 'BAC Water Pharmagrade 10ml', 'Pharmagrade', 'bac-water', 250, 100, true, false, false, NULL),
  ('bacwater-3ml', 'Bacwater 3ml', '', 'bac-water', 100, 100, true, false, false, NULL),
  ('bacwater-5ml', 'Bacwater 5ml', '', 'bac-water', 110, 100, true, false, false, NULL),
  ('bacwater-10ml', 'Bacwater 10ml', 'Standard', 'bac-water', 120, 100, true, false, false, NULL)
on conflict (id) do update set 
  name = excluded.name,
  base_price = excluded.base_price,
  is_complete_set = excluded.is_complete_set,
  complete_set_price = excluded.complete_set_price,
  category = excluded.category;

-- 4. Insert Products (Others / Accessories)
insert into public.products (
  id, name, description, category, base_price, stock_quantity, available, featured, 
  is_complete_set, complete_set_price
)
values
  ('biohacking-kit', 'Biohacking Kit', '', 'accessories', 250, 100, true, false, false, NULL),
  ('insulin-syringes-100s', 'Insulin Syringes 100s', 'Pack of 100', 'accessories', 550, 100, true, false, false, NULL),
  ('insulin-syringes-10s', 'Insulin Syringes 10s', 'Pack of 10', 'accessories', 60, 100, true, false, false, NULL),
  ('human-ergo-ii', 'Human Ergo II', 'w/ 6 pen needles & 1 cartridge', 'accessories', 1500, 100, true, false, false, NULL),
  ('peppie-pen-candy', 'Peppie Pen Candy Colored', 'w/ 6 pen needles & 1 cartridge', 'accessories', 1200, 100, true, false, false, NULL),
  ('peppie-pen-v1', 'Peppie Pen V1', 'w/ 6 pen needles & 1 cartridge', 'accessories', 1400, 100, true, false, false, NULL),
  ('pen-needles-100s', 'Pen Needles 31g/8mm 100s', 'Pack of 100', 'accessories', 450, 100, true, false, false, NULL),
  ('pen-needles-10s', 'Pen Needles 31g/8mm 10s', 'Pack of 10', 'accessories', 50, 100, true, false, false, NULL),
  ('pen-cartridge', 'Pen Cartridge (Steam Sterilized)', 'Steam Sterilized', 'accessories', 40, 100, true, false, false, NULL)
on conflict (id) do update set 
  name = excluded.name,
  base_price = excluded.base_price,
  is_complete_set = excluded.is_complete_set,
  complete_set_price = excluded.complete_set_price,
  category = excluded.category;
