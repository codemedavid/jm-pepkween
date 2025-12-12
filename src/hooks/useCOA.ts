import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { COA } from '../types';

export function useCOA() {
    const [coas, setCoas] = useState<COA[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchCOAs();
    }, []);

    async function fetchCOAs() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('coas')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoas(data || []);
        } catch (err) {
            console.error('Error fetching COAs:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function addCOA(title: string, imageUrl: string) {
        try {
            const { data, error } = await supabase
                .from('coas')
                .insert([{ title, image_url: imageUrl }])
                .select()
                .single();

            if (error) throw error;
            setCoas([data, ...coas]);
            return { success: true, data };
        } catch (err) {
            console.error('Error adding COA:', err);
            return { success: false, error: err };
        }
    }

    async function deleteCOA(id: string) {
        try {
            const { error } = await supabase
                .from('coas')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCoas(coas.filter(c => c.id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting COA:', err);
            return { success: false, error: err };
        }
    }

    return {
        coas,
        loading,
        error,
        fetchCOAs,
        addCOA,
        deleteCOA
    };
}
