-- 1. Create Categories Table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text,
  sort_order integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Products Table
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  category text references public.categories(id),
  base_price numeric not null,
  discount_price numeric,
  discount_start_date timestamp with time zone,
  discount_end_date timestamp with time zone,
  discount_active boolean default false,
  purity_percentage numeric,
  molecular_weight text,
  cas_number text,
  sequence text,
  storage_conditions text,
  inclusions text[], -- Array of strings
  is_complete_set boolean default false,
  complete_set_price numeric,
  complete_set_description text,
  stock_quantity integer default 0,
  available boolean default true,
  featured boolean default false,
  image_url text,
  safety_sheet_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Product Variations Table
create table if not exists public.product_variations (
  id uuid default gen_random_uuid() primary key,
  product_id text references public.products(id) on delete cascade,
  name text not null,
  quantity_mg numeric,
  price numeric not null,
  stock_quantity integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS (Security)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variations enable row level security;

-- 5. Create Policies (Public Read, Anon Insert for now)
drop policy if exists "Public Read Categories" on public.categories;
create policy "Public Read Categories" on public.categories for select using (true);

drop policy if exists "Public Read Products" on public.products;
create policy "Public Read Products" on public.products for select using (true);

drop policy if exists "Public Read Variations" on public.product_variations;
create policy "Public Read Variations" on public.product_variations for select using (true);

-- Allow full access for anon (for setup purposes, can be restricted later)
drop policy if exists "Anon Full Access Categories" on public.categories;
create policy "Anon Full Access Categories" on public.categories for all using (true);

drop policy if exists "Anon Full Access Products" on public.products;
create policy "Anon Full Access Products" on public.products for all using (true);

drop policy if exists "Anon Full Access Variations" on public.product_variations;
create policy "Anon Full Access Variations" on public.product_variations for all using (true);

-- 6. Insert Data (Categories & Products)
-- This includes the data from the previous step
insert into public.categories (id, name, icon, sort_order, active)
values
  ('peptides', 'Peptides', 'test-tube-2', 10, true),
  ('accessories', 'Accessories', 'syringe', 20, true)
on conflict (id) do update set name = excluded.name;

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
  ),
  (
    'peppie-pen', 'Peppie Pen', 
    'High-quality peptide injection pen.', 
    'accessories', 500, 0, 100, true, false, 
    NULL, 'Store at Room Temp', false, NULL
  ),
  (
    'needle-cartridges', 'Needle Cartridges', 
    'Sterile needle cartridges for Peppie Pen (Box of 10).', 
    'accessories', 300, 0, 100, true, false, 
    NULL, 'Store at Room Temp', false, NULL
  )
on conflict (id) do nothing;
