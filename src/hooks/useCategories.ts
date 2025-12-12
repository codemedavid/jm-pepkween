import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('categories')
        .insert({
          id: category.id,
          name: category.name,
          icon: category.icon,
          sort_order: category.sort_order,
          active: category.active
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          icon: updates.icon,
          sort_order: updates.sort_order,
          active: updates.active
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('Starting deletion for category:', id);

      // 1. Get all products in this category to delete their variations first (just in case cascade is missing)
      const { data: products, error: productsFetchError } = await supabase
        .from('products')
        .select('id')
        .eq('category', id);

      if (productsFetchError) {
        console.error('Error fetching products during delete:', productsFetchError);
        throw new Error('Failed to fetch associated products');
      }

      const productIds = products?.map(p => p.id) || [];
      console.log(`Found ${productIds.length} products to clean up`);

      if (productIds.length > 0) {
        // 2. Delete variations for these products
        const { error: variationsDeleteError } = await supabase
          .from('product_variations')
          .delete()
          .in('product_id', productIds);

        if (variationsDeleteError) {
          console.error('Error deleting variations:', variationsDeleteError);
          // Don't throw here, usually CASCADE handles this, but we log if manual delete fails
        }

        // 3. Delete the products
        const { error: productsDeleteError } = await supabase
          .from('products')
          .delete()
          .eq('category', id);

        if (productsDeleteError) {
          console.error('Error deleting products:', productsDeleteError);
          throw new Error(`Failed to delete products: ${productsDeleteError.message}`);
        }
      }

      // 4. Finally delete the category
      const { error: deleteError, count: deletedCount } = await supabase
        .from('categories')
        .delete({ count: 'exact' }) // Request exact count
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting category record:', deleteError);
        throw deleteError;
      }

      console.log(`Deleted category rows: ${deletedCount}`);

      if (deletedCount === 0) {
        throw new Error('Database reported success but 0 records were deleted. This usually means Row Level Security (RLS) is blocking the delete operation. Check your Supabase policies.');
      }

      await fetchCategories();
      console.log('Category deleted successfully');
    } catch (err) {
      console.error('Error in deleteCategory:', err);
      throw err;
    }
  };

  const reorderCategories = async (reorderedCategories: Category[]) => {
    try {
      const updates = reorderedCategories.map((cat, index) => ({
        id: cat.id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('categories')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error reordering categories:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();

    // Set up real-time subscription for category changes
    const categoriesChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('Category changed:', payload);
          fetchCategories(); // Refetch categories when any change occurs
        }
      )
      .subscribe();

    // Refetch data when window regains focus
    const handleFocus = () => {
      fetchCategories();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(categoriesChannel);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    refetch: fetchCategories
  };
};