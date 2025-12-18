-- Migration to CREATE and POPULATE public.faqs table
-- 1. Creates table if missing (with policies and indexes)
-- 2. Clears existing data
-- 3. Inserts new FAQs from fax.txt

-- SECTION 1: DDL - Create Table and Security Settings
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'PRODUCT & USAGE',
  order_index integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first to allow re-running script without errors)
DROP POLICY IF EXISTS "Allow public read access" ON public.faqs;
CREATE POLICY "Allow public read access" ON public.faqs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON public.faqs;
CREATE POLICY "Allow authenticated insert" ON public.faqs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON public.faqs;
CREATE POLICY "Allow authenticated update" ON public.faqs
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete" ON public.faqs;
CREATE POLICY "Allow authenticated delete" ON public.faqs
  FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS faqs_order_idx ON public.faqs (order_index ASC);
CREATE INDEX IF NOT EXISTS faqs_category_idx ON public.faqs (category);
CREATE INDEX IF NOT EXISTS faqs_active_idx ON public.faqs (is_active);

-- Grant permissions (safe to run multiple times)
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO authenticated;


-- SECTION 2: DML - Populate Data
-- Clear existing entries to ensure a clean slate matching the text file
TRUNCATE TABLE public.faqs;

-- Insert FAQs for 'Product & Usage'
INSERT INTO public.faqs (category, question, answer, order_index, is_active) VALUES
(
    'Product & Usage',
    'Before purchasing, is Tirzepatide suitable for me?',
    '✔️ Check if Tirzepatide fits your needs using our checklist — Contact us for more details before ordering.',
    1,
    true
),
(
    'Product & Usage',
    'Do you reconstitute (recon) Tirzepatide?',
    'Yes! Reconstitution is available for Metro Manila orders only.

Free when you purchase the complete set

Pharma-grade bacteriostatic water used

Shipped with ice pack + insulated pouch to maintain stability',
    2,
    true
),
(
    'Product & Usage',
    'Can the pen pusher be retracted?',
    'Reusable pens: Yes, the pusher can be retracted

Disposable pens: No, the pusher stays forward once pushed',
    3,
    true
),
(
    'Product & Usage',
    'Needle & Cartridge Info',
    'Standard sizes for convenience:

Syringe needle: 30G / 8mm : 31G / 8mm

Pen needle: 31G / 8mm

Cartridge: 3ml
Included with orders if applicable. Handle carefully and follow proper instructions',
    4,
    true
),
(
    'Product & Usage',
    'How should peptides be stored?',
    'Store lyophilized peptides in a cool, dry place (2–8°C).
Reconstituted peptides: Keep in the refrigerator (2–8°C) and use within the recommended timeframe. Avoid sunlight, moisture, and contamination.

Disclaimer!
 I am not responsible for any outcomes. Always do your own research before use. Follow proper handling and storage guidelines.',
    5,
    true
);

-- Insert FAQs for 'Ordering & Packaging'
INSERT INTO public.faqs (category, question, answer, order_index, is_active) VALUES
(
    'Ordering & Packaging',
    'What’s Included in My Order',
    'Peptides Kit

💧 Bacteriostatic Water for reconstitution
💉 Syringe for precise reconstitution
🩺 6 insulin syringes
🧴 10 alcohol pads
🧼 Mini alcohol spray
🧻 Mini tissue
🧰 Protective case (small plastic box)
🧤 Sterile gloves
🍵 Refreshing spearmint tea
🧪 Peptides included: based on your selected order

Pen Kit

💧 Bacteriostatic Water for reconstitution
💉 Syringe for precise reconstitution + 1 extra luer lock needle
🩺 6 pen needles
🧪 Cartridge: 1
🧴 10 alcohol pads
🧼 Mini alcohol spray
🧻 Mini tissue
🧤 Sterile gloves
🍵 Refreshing spearmint tea
🧪 Peptides included: based on your selected order',
    1,
    true
),
(
    'Ordering & Packaging',
    'Do you offer bundles or discounts?',
    'Yes! We offer ready-made bundles and you can also request a custom set—choose which products or accessories to include.
For bulk orders, please send us a private message (PM) so we can assist you personally.',
    2,
    true
),
(
    'Ordering & Packaging',
    'Can I return items?',
    'Pens: Returnable within 1 week if defective

Needles, syringes, and cartridges: Cannot be returned for hygiene and safety reasons',
    3,
    true
);

-- Insert FAQs for 'Payment Methods'
INSERT INTO public.faqs (category, question, answer, order_index, is_active) VALUES
(
    'Payment Methods',
    'What payment options do you accept?',
    'We accept the following:

💸 GCash

💳 Maya

💰 Gotyme

🏦 BPI

🏦 MariBank

🛒 Shopee Pay


❌ Cash on Delivery (COD) is not accepted, except for Lalamove deliveries.
→ You can pay the rider directly or have the rider pay upfront on your behalf.
💵 Maximum order amount for COD: ₱2,000',
    1,
    true
);

-- Insert FAQs for 'Shipping & Delivery'
INSERT INTO public.faqs (category, question, answer, order_index, is_active) VALUES
(
    'Shipping & Delivery',
    'Where are you located?',
    '📍 Imus, Cavite',
    1,
    true
),
(
    'Shipping & Delivery',
    'How long is shipping? (Estimated)',
    'Lalamove (local/nearby) → 1–3 hours within Imus or nearby areas

J&T Express / LBC (nationwide) → 1–5 days depending on location
Times may vary depending on courier schedules and order volume',
    2,
    true
),
(
    'Shipping & Delivery',
    'When do orders ship out?',
    'Orders placed before 11:00 AM → Dropped off or picked up same day by courier

Orders placed after 11:00 AM → Dropped off or picked up next day
→ Subject to order volume',
    3,
    true
),
(
    'Shipping & Delivery',
    'Do you ship nationwide?',
    'Yes! We ship nationwide via J&T Express and LBC, and use Lalamove for nearby areas and Metro Manila',
    4,
    true
);
