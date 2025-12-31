-- ============================================
-- GUIDES TABLE FOR ELECTRONIC GUIDES PAGE
-- ============================================
-- Run this in your Supabase SQL Editor

-- Create guides table
CREATE TABLE IF NOT EXISTS public.guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT DEFAULT 'BookOpen',
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS guides_order_idx ON public.guides (order_index ASC);
CREATE INDEX IF NOT EXISTS guides_active_idx ON public.guides (is_active);

-- Disable RLS for simplicity (matching your other tables)
ALTER TABLE public.guides DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE public.guides TO anon, authenticated, service_role;

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_guides_updated_at ON public.guides;
CREATE TRIGGER update_guides_updated_at
    BEFORE UPDATE ON public.guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed with initial guide data
INSERT INTO public.guides (title, icon, content, order_index, is_active) VALUES
(
    'Storage Guidelines',
    'Thermometer',
    '## Before Reconstitution

- Store peptide vials in the refrigerator (2-8°C / 36-46°F)
- Keep away from direct light
- Lyophilized (powder) peptides can be stored for up to 12 months
- For long-term storage, freezer (-20°C) is ideal

## After Reconstitution

- Always store reconstituted peptides in the refrigerator
- Use within 4-6 weeks for best potency
- Never freeze reconstituted peptides
- Keep vials upright to prevent contamination',
    1,
    true
),
(
    'Reconstitution Guide',
    'Droplet',
    '> ⚠️ **Important:** Always use bacteriostatic water (BAC water) for reconstitution. This helps preserve the peptide and prevents bacterial growth.

## Step-by-Step Instructions

1. **Gather supplies:** peptide vial, BAC water, alcohol swabs, insulin syringe
2. **Clean** the rubber stopper of both vials with alcohol swabs
3. **Draw up** your desired amount of BAC water (typically 1-2ml)
4. **Insert needle** into the peptide vial at an angle, aiming at the glass wall
5. **Slowly inject** the BAC water down the side - DO NOT spray directly on the powder
6. **Gently swirl** the vial (never shake) until powder is fully dissolved
7. **Store** in refrigerator and label with reconstitution date',
    2,
    true
),
(
    'Injection Guide',
    'Syringe',
    '## Subcutaneous Injection Sites

- **Abdomen** - 2 inches from navel
- **Upper thigh** - front/outer area
- **Back of upper arm**

## Best Practices

- Rotate injection sites
- Use 29-31 gauge insulin syringes
- Pinch skin and inject at 45-90° angle

## Injection Steps

1. ✅ Clean injection site with alcohol swab
2. ✅ Draw up correct dose from vial
3. ✅ Pinch skin between thumb and forefinger
4. ✅ Insert needle smoothly at 45-90° angle
5. ✅ Inject slowly and steadily
6. ✅ Wait 5 seconds before removing needle
7. ✅ Apply gentle pressure with cotton ball if needed',
    3,
    true
),
(
    'Tirzepatide Dosing Reference',
    'Clock',
    '> **Note:** This is a general reference guide. Always consult with a healthcare provider for personalized dosing recommendations.

## Standard Titration Schedule

| Week | Dose | Frequency |
|------|------|-----------|
| Weeks 1-4 | 2.5mg | Once weekly |
| Weeks 5-8 | 5mg | Once weekly |
| Weeks 9-12 | 7.5mg | Once weekly |
| Weeks 13-16 | 10mg | Once weekly |
| Week 17+ | 12.5-15mg | Once weekly |

## Tips for Best Results

- Inject on the same day each week
- Take with or without food
- Stay hydrated and maintain balanced nutrition
- Titrate slowly if experiencing side effects',
    4,
    true
)
ON CONFLICT DO NOTHING;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify
SELECT 'guides' as table_name, COUNT(*) as row_count FROM public.guides;
