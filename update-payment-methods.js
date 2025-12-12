import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newMethods = [
    { id: 'gcash', name: 'GCash', sort_order: 1 },
    { id: 'maya', name: 'Maya', sort_order: 2 },
    { id: 'gotyme', name: 'GoTyme', sort_order: 3 },
    { id: 'bpi', name: 'BPI', sort_order: 4 },
    { id: 'maribank', name: 'SeaBank (Maribank)', sort_order: 5 }, // SeaBank is formerly Maribank/associated often
    { id: 'shopeepay', name: 'ShopeePay', sort_order: 6 },
];

async function updatePaymentMethods() {
    console.log('Updating payment methods...');

    // 1. Delete existing (truncate-like)
    const { error: deleteError } = await supabase
        .from('payment_methods')
        .delete()
        .neq('id', 'placeholder'); // effectively delete all

    if (deleteError) {
        console.error('Error deleting old methods:', deleteError);
    } else {
        console.log('Cleared existing payment methods.');
    }

    // 2. Insert new
    for (const method of newMethods) {
        const { error: insertError } = await supabase.from('payment_methods').insert({
            id: method.id,
            name: method.name,
            account_name: 'JM Pepkween',
            account_number: '09XX XXX XXXX', // Placeholder
            qr_code_url: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', // Placeholder
            active: true,
            sort_order: method.sort_order,
        });

        if (insertError) {
            console.error(`Error inserting ${method.name}:`, insertError);
        } else {
            console.log(`Added ${method.name}`);
        }
    }

    console.log('Payment methods update complete.');
}

updatePaymentMethods();
