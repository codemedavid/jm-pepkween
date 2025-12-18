import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    content: string;
    rating: number;
    category: string;
    date: string;
    image_url?: string | null;
    approved: boolean;
    created_at: string;
}

export function useTestimonials(approvedOnly = true) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (approvedOnly) {
                query = query.eq('approved', true);
            }

            const { data, error } = await query;

            if (error) throw error;

            setTestimonials(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred fetching testimonials');
            console.error('Error fetching testimonials:', err);
        } finally {
            setLoading(false);
        }
    }, [approvedOnly]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'approved' | 'date'> & { approved?: boolean }) => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .insert([{
                    ...testimonial,
                    approved: testimonial.approved !== undefined ? testimonial.approved : false // Use provided status or default to false
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (err) {
            console.error('Error adding testimonial:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Failed to add testimonial' };
        }
    };

    const updateTestimonialStatus = async (id: number, approved: boolean) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ approved })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setTestimonials(prev => prev.map(t =>
                t.id === id ? { ...t, approved } : t
            ));

            return { success: true };
        } catch (err) {
            console.error('Error updating testimonial:', err);
            return { success: false, error: err };
        }
    };

    const deleteTestimonial = async (id: number) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setTestimonials(prev => prev.filter(t => t.id !== id));

            return { success: true };
        } catch (err) {
            console.error('Error deleting testimonial:', err);
            return { success: false, error: err };
        }
    };

    return {
        testimonials,
        loading,
        error,
        addTestimonial,
        updateTestimonialStatus,
        deleteTestimonial,
        refreshTestimonials: fetchTestimonials
    };
}
