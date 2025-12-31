import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Guide {
    id: string;
    title: string;
    icon: string;
    content: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const ICON_OPTIONS = [
    { value: 'BookOpen', label: 'Book' },
    { value: 'Thermometer', label: 'Thermometer' },
    { value: 'Droplet', label: 'Droplet' },
    { value: 'Syringe', label: 'Syringe' },
    { value: 'Clock', label: 'Clock' },
];

const GuideManager: React.FC = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formIcon, setFormIcon] = useState('BookOpen');
    const [formContent, setFormContent] = useState('');
    const [formActive, setFormActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const { data, error } = await supabase
                .from('guides')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setGuides(data || []);
        } catch (error) {
            console.error('Error fetching guides:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormTitle('');
        setFormIcon('BookOpen');
        setFormContent('');
        setFormActive(true);
        setEditingId(null);
        setIsAdding(false);
    };

    const startEditing = (guide: Guide) => {
        setEditingId(guide.id);
        setFormTitle(guide.title);
        setFormIcon(guide.icon);
        setFormContent(guide.content);
        setFormActive(guide.is_active);
        setIsAdding(false);
    };

    const startAdding = () => {
        resetForm();
        setIsAdding(true);
    };

    const handleSave = async () => {
        if (!formTitle.trim() || !formContent.trim()) {
            alert('Please fill in both title and content.');
            return;
        }

        setSaving(true);

        try {
            if (isAdding) {
                // Get max order_index
                const maxOrder = guides.reduce((max, g) => Math.max(max, g.order_index), 0);

                const { error } = await supabase
                    .from('guides')
                    .insert([{
                        title: formTitle.trim(),
                        icon: formIcon,
                        content: formContent,
                        order_index: maxOrder + 1,
                        is_active: formActive,
                    }]);

                if (error) throw error;
            } else if (editingId) {
                const { error } = await supabase
                    .from('guides')
                    .update({
                        title: formTitle.trim(),
                        icon: formIcon,
                        content: formContent,
                        is_active: formActive,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', editingId);

                if (error) throw error;
            }

            await fetchGuides();
            resetForm();
        } catch (error) {
            console.error('Error saving guide:', error);
            alert('Failed to save guide. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this guide?')) return;

        try {
            const { error } = await supabase
                .from('guides')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchGuides();
        } catch (error) {
            console.error('Error deleting guide:', error);
            alert('Failed to delete guide. Please try again.');
        }
    };

    const toggleActive = async (guide: Guide) => {
        try {
            const { error } = await supabase
                .from('guides')
                .update({ is_active: !guide.is_active })
                .eq('id', guide.id);

            if (error) throw error;
            await fetchGuides();
        } catch (error) {
            console.error('Error toggling guide:', error);
        }
    };

    const moveGuide = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= guides.length) return;

        const newGuides = [...guides];
        const [removed] = newGuides.splice(index, 1);
        newGuides.splice(newIndex, 0, removed);

        // Update order_index for all guides
        try {
            for (let i = 0; i < newGuides.length; i++) {
                await supabase
                    .from('guides')
                    .update({ order_index: i + 1 })
                    .eq('id', newGuides[i].id);
            }
            await fetchGuides();
        } catch (error) {
            console.error('Error reordering guides:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Manage Guides</h2>
                {!isAdding && !editingId && (
                    <button
                        onClick={startAdding}
                        className="flex items-center gap-2 bg-theme-accent text-white px-4 py-2 rounded-lg hover:bg-theme-accent/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Guide
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        {isAdding ? 'Add New Guide' : 'Edit Guide'}
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                                    placeholder="e.g., Storage Guidelines"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                </label>
                                <select
                                    value={formIcon}
                                    onChange={(e) => setFormIcon(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                                >
                                    {ICON_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content * (Markdown supported)
                            </label>
                            <textarea
                                value={formContent}
                                onChange={(e) => setFormContent(e.target.value)}
                                rows={12}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent font-mono text-sm"
                                placeholder="## Section Title&#10;&#10;- List item 1&#10;- List item 2&#10;&#10;**Bold text** and *italic text*"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use Markdown: ## for headings, - for lists, **bold**, *italic*, | for tables
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="formActive"
                                checked={formActive}
                                onChange={(e) => setFormActive(e.target.checked)}
                                className="w-4 h-4 text-theme-accent rounded"
                            />
                            <label htmlFor="formActive" className="text-sm text-gray-700">
                                Active (visible on public page)
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-theme-accent text-white px-4 py-2 rounded-lg hover:bg-theme-accent/90 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guides List */}
            <div className="space-y-3">
                {guides.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No guides yet. Add your first guide!</p>
                    </div>
                ) : (
                    guides.map((guide, index) => (
                        <div
                            key={guide.id}
                            className={`bg-white rounded-lg border p-4 ${guide.is_active ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveGuide(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                        >
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">{guide.title}</h4>
                                        <p className="text-xs text-gray-500">
                                            {guide.content.slice(0, 80)}...
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(guide)}
                                        className={`p-2 rounded-lg transition-colors ${guide.is_active
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-100'
                                            }`}
                                        title={guide.is_active ? 'Hide guide' : 'Show guide'}
                                    >
                                        {guide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => startEditing(guide)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(guide.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GuideManager;
