-- 1. Delete Variations for products that are NOT in our new categories
delete from public.product_variations 
where product_id in (
  select id from public.products 
  where category not in ('peptides', 'accessories')
);

-- 2. Delete Products that are NOT in our new categories
delete from public.products 
where category not in ('peptides', 'accessories');

-- 3. Delete Categories that are NOT Peptides or Accessories
delete from public.categories 
where id not in ('peptides', 'accessories');
