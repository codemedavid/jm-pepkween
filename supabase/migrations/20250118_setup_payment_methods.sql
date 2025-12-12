-- Create payment_methods table
create table if not exists public.payment_methods (
  id text primary key,
  name text not null,
  account_number text,
  account_name text,
  qr_code_url text not null,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.payment_methods enable row level security;

-- Create policy to allow read access for everyone
create policy "Allow public read access" on public.payment_methods
  for select using (true);

-- Create policy to allow insert/update/delete for authenticated service role (or everyone if just testing)
-- For now, let's allow all just to be safe with Anon key setup if needed, but standard is:
create policy "Allow anon insert" on public.payment_methods
  for insert with check (true);

create policy "Allow anon update" on public.payment_methods
  for update using (true);

create policy "Allow anon delete" on public.payment_methods
  for delete using (true);

-- Insert new methods
insert into public.payment_methods (id, name, account_number, account_name, qr_code_url, active, sort_order)
values 
  ('gcash', 'GCash', '09XX XXX XXXX', 'JM Pepkween', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', true, 1),
  ('maya', 'Maya', '09XX XXX XXXX', 'JM Pepkween', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', true, 2),
  ('gotyme', 'GoTyme', '09XX XXX XXXX', 'JM Pepkween', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', true, 3),
  ('bpi', 'BPI', '09XX XXX XXXX', 'JM Pepkween', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', true, 4),
  ('maribank', 'SeaBank (Maribank)', '09XX XXX XXXX', 'JM Pepkween', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', true, 5),
  ('shopeepay', 'ShopeePay', '09XX XXX XXXX', 'JM Pepkween', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', true, 6)
on conflict (id) do update set 
  name = excluded.name, 
  active = excluded.active,
  sort_order = excluded.sort_order;
