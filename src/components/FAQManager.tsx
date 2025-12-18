import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, HelpCircle, GripVertical } from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
    is_active: boolean;
    created_at?: string;
}

interface FAQManagerProps {
    onBack: () => void;
}

const FAQManager: React.FC<FAQManagerProps> = ({ onBack }) => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
    const [formData, setFormData] = useState<Partial<FAQ>>({
        question: '',
        answer: '',
        category: 'Product & Usage',
        order_index: 0,
        is_active: true
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const CATEGORIES = [
        'Product & Usage',
        'Ordering & Packaging',
        'Payment Methods',
        'Shipping & Delivery',
        'Other'
    ];

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('category')
                .order('order_index');

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            alert('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        // Find the next order index for default
        const maxIndex = faqs.reduce((max, faq) => (faq.order_index > max ? faq.order_index : max), 0);
        setFormData({
            question: '',
            answer: '',
            category: 'Product & Usage',
            order_index: maxIndex + 1,
            is_active: true
        });
        setEditingId(null);
        setCurrentView('add');
    };

    const handleEdit = (faq: FAQ) => {
        setFormData(faq);
        setEditingId(faq.id);
        setCurrentView('edit');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            setLoading(true);
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) throw error;
            await fetchFaqs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Failed to delete FAQ');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.question || !formData.answer || !formData.category) return;

        try {
            setSubmitting(true);

            const payload = {
                question: formData.question,
                answer: formData.answer,
                category: formData.category.toUpperCase(), // Store categories in uppercase as originally in DB or normalize
                order_index: formData.order_index,
                is_active: formData.is_active
            };

            // Helper to normalize category for display consistency if needed
            // But keeping it simple: just use what is in form

            if (currentView === 'add') {
                const { error } = await supabase.from('faqs').insert([payload]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('faqs')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            }

            await fetchFaqs();
            setCurrentView('list');
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Failed to save FAQ');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setCurrentView('list');
        setEditingId(null);
    };

    if (loading && faqs.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (currentView === 'add' || currentView === 'edit') {
        return (
            <div className="bg-white rounded-lg shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">
                            {currentView === 'add' ? 'Add New FAQ' : 'Edit FAQ'}
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category} // You might need to handle casing
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input-field"
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question
                        </label>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="input-field"
                            placeholder="e.g., How do I store my peptides?"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Answer
                        </label>
                        <textarea
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            className="input-field min-h-[150px]"
                            placeholder="Enter the answer here..."
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can use basic formatting. New lines will be preserved.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-24">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                className="input-field"
                            />
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded text-theme-accent focus:ring-theme-accent h-4 w-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Active (Visible to public)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {submitting ? 'Saving...' : 'Save FAQ'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Group FAQs by category for display
    const groupedFaqs = faqs.reduce((acc, faq) => {
        // Normalize or use raw category
        const cat = faq.category.toUpperCase();
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
                    <p className="text-gray-500 text-sm">Manage frequently asked questions displayed on the website</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Question
                </button>
            </div>

            <div className="grid gap-6">
                {Object.entries(groupedFaqs).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-lg shadow-soft overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-theme-secondary" />
                                {category}
                            </h3>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">
                                {items.length} items
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map((faq) => (
                                <div key={faq.id} className="p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {!faq.is_active && (
                                                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium uppercase">
                                                        Inactive
                                                    </span>
                                                )}
                                                <h4 className="text-sm font-medium text-gray-900">{faq.question}</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2">{faq.answer}</p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(faq)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQManager;
