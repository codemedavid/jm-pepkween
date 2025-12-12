import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Voucher } from '../types';

export function useVouchers() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('vouchers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVouchers(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch vouchers');
        } finally {
            setLoading(false);
        }
    }, []);

    const addVoucher = async (voucher: Omit<Voucher, 'id' | 'created_at' | 'times_used'>) => {
        try {
            const { data, error } = await supabase
                .from('vouchers')
                .insert([{ ...voucher, times_used: 0 }])
                .select()
                .single();

            if (error) throw error;
            setVouchers([data, ...vouchers]);
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Failed to add voucher' };
        }
    };

    const updateVoucher = async (id: string, updates: Partial<Voucher>) => {
        try {
            const { data, error } = await supabase
                .from('vouchers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setVouchers(vouchers.map(v => v.id === id ? data : v));
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Failed to update voucher' };
        }
    };

    const deleteVoucher = async (id: string) => {
        try {
            const { error } = await supabase
                .from('vouchers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setVouchers(vouchers.filter(v => v.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Failed to delete voucher' };
        }
    };

    const validateVoucher = async (code: string, cartTotal: number) => {
        try {
            const { data, error } = await supabase
                .from('vouchers')
                .select('*')
                .eq('code', code)
                .single();

            if (error) throw new Error('Invalid voucher code');

            if (!data.is_active) throw new Error('This voucher is no longer active');

            // Check expiry
            if (data.expires_at) {
                const expiry = new Date(data.expires_at);
                if (expiry < new Date()) throw new Error('This voucher has expired');
            }

            // Check min spend
            if (data.min_spend > 0 && cartTotal < data.min_spend) {
                throw new Error(`Minimum spend of ₱${data.min_spend} required`);
            }

            // Check usage limit
            // IMPORTANT: We check strictly here. But concurrency issues exist if not using a transaction/trigger.
            // For this app scale, this check is "good enough" combined with the final check at checkout.
            if (data.usage_limit !== null && data.times_used >= data.usage_limit) {
                throw new Error('This voucher has reached its usage limit');
            }

            return { success: true, voucher: data };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Invalid voucher' };
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    return {
        vouchers,
        loading,
        error,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        validateVoucher,
        refreshVouchers: fetchVouchers
    };
}
