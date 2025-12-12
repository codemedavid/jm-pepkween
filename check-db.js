import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking connection...');
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
        console.error('Error querying products:', error);
    } else {
        console.log('Connection successful. Products found:', data?.length);
    }

    const { error: pmError } = await supabase.from('payment_methods').select('*').limit(1);
    if (pmError) {
        console.error('Payment Methods Error:', pmError.message);
    } else {
        console.log('Payment Methods table exists.');
    }
}

check();
