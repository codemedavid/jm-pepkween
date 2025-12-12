-- SQL Script to insert missing site settings
-- Run this in the Supabase SQL Editor

INSERT INTO site_settings (id, value, type, description)
VALUES 
  ('coa_page_enabled', 'false', 'boolean', 'Enable/Disable Certificate of Analysis page'),
  ('site_name', 'The Peppy Lab', 'text', 'Website name'),
  ('site_tagline', 'Peptides & Essentials', 'text', 'Website tagline'),
  ('contact_email', 'info@thepeppylab.com', 'email', 'Contact email'),
  ('contact_phone', '', 'text', 'Contact phone number'),
  ('min_order_amount', '0.00', 'number', 'Minimum order amount'),
  ('free_shipping_threshold', '5000.00', 'number', 'Free shipping threshold'),
  ('disclaimer', 'All products are sold for research purposes only. Not for human consumption.', 'text', 'Legal disclaimer')
ON CONFLICT (id) DO UPDATE 
SET value = EXCLUDED.value, 
    description = EXCLUDED.description;
