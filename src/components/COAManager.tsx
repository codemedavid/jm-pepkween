import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { COA } from '../types';
import { Trash2, Edit, Plus, Save, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface COAManagerProps {
    onBack: () => void;
}

const COAManager: React.FC<COAManagerProps> = ({ onBack }) => {
    const [coas, setCoas] = useState<COA[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<COA>>({
        product_name: '',
        purity: '99.0%',
        quantity: '',
        task_number: '',
        verification_key: '',
        test_date: '',
        image_url: '',
        is_verified: true
    });

    useEffect(() => {
        fetchCOAs();
    }, []);

    const fetchCOAs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('coas')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoas(data || []);
        } catch (error) {
            console.error('Error fetching COAs:', error);
            alert('Failed to load lab reports');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (coa: COA) => {
        setFormData({
            product_name: coa.product_name || coa.title, // Fallback to title for compatibility
            purity: coa.purity || '',
            quantity: coa.quantity || '',
            task_number: coa.task_number || '',
            verification_key: coa.verification_key || '',
            test_date: coa.test_date || '',
            image_url: coa.image_url,
            is_verified: coa.is_verified ?? true
        });
        setEditingId(coa.id);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setFormData({
            product_name: '',
            purity: '99.9%',
            quantity: '',
            task_number: '',
            verification_key: '',
            test_date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
            image_url: '',
            is_verified: true
        });
        setEditingId(null);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!formData.product_name || !formData.image_url) {
            alert('Product Name and Image are required');
            return;
        }

        try {
            setSaving(true);

            // Map form data to DB columns
            const payload = {
                title: formData.product_name, // Keep title synced for now
                product_name: formData.product_name,
                image_url: formData.image_url,
                purity: formData.purity,
                quantity: formData.quantity,
                task_number: formData.task_number,
                verification_key: formData.verification_key,
                test_date: formData.test_date,
                is_verified: formData.is_verified
            };

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('coas')
                    .update(payload)
                    .eq('id', editingId);

                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('coas')
                    .insert([payload]);

                if (error) throw error;
            }

            setIsEditing(false);
            setEditingId(null);
            fetchCOAs();
        } catch (error) {
            console.error('Error saving COA:', error);
            alert('Failed to save lab report');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return;

        try {
            const { error } = await supabase
                .from('coas')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCOAs();
        } catch (error) {
            console.error('Error deleting COA:', error);
            alert('Failed to delete report');
        }
    };

    const handleImageChange = (url: string | undefined) => {
        setFormData(prev => ({ ...prev, image_url: url || '' }));
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading lab reports...</div>;
    }

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto my-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingId ? 'Edit Lab Report' : 'Add New Lab Report'}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Image *</label>
                        <ImageUpload
                            folder="coa"
                            currentImage={formData.image_url}
                            onImageChange={handleImageChange}
                        />
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input
                                type="text"
                                value={formData.product_name}
                                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-theme-accent focus:border-theme-accent"
                                placeholder="e.g. Tirzepatide 15mg"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                                <input
                                    type="text"
                                    value={formData.purity}
                                    onChange={e => setFormData({ ...formData, purity: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="99.X%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="text"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="15.50 mg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Number</label>
                                <input
                                    type="text"
                                    value={formData.task_number}
                                    onChange={e => setFormData({ ...formData, task_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="#12345"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
                                <input
                                    type="text"
                                    value={formData.test_date}
                                    onChange={e => setFormData({ ...formData, test_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="DD MON YYYY"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Janoshik Key</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.verification_key}
                                    onChange={e => setFormData({ ...formData, verification_key: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Unique Key"
                                />
                                {formData.verification_key && (
                                    <a
                                        href={`https://janoshik.com/verify/${formData.verification_key}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                                        title="Test Verification Link"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_verified}
                                    onChange={e => setFormData({ ...formData, is_verified: e.target.checked })}
                                    className="w-4 h-4 text-theme-accent rounded focus:ring-theme-accent"
                                />
                                <span className="text-sm font-medium text-gray-700">Display "Verified" Badge</span>
                            </label>
                        </div>

                        <div className="pt-6 flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/90 flex items-center gap-2"
                            >
                                {saving ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Report'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lab Reports Manager</h1>
                    <p className="text-gray-500 text-sm">Manage Certificates of Analysis (COA)</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-theme-accent text-white px-4 py-2 rounded-lg hover:bg-theme-accent/90 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Report
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Verification</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <ImageIcon className="w-12 h-12 text-gray-300" />
                                            <p>No lab reports found</p>
                                            <button
                                                onClick={handleAddNew}
                                                className="text-theme-accent hover:underline text-sm"
                                            >
                                                Add your first report
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                coas.map((coa) => (
                                    <tr key={coa.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                <img
                                                    src={coa.image_url}
                                                    alt={coa.product_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=Error'}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{coa.product_name || coa.title}</p>
                                            <p className="text-xs text-gray-500">{coa.task_number}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p><span className="text-gray-500">Purity:</span> {coa.purity}</p>
                                                <p><span className="text-gray-500">Qty:</span> {coa.quantity}</p>
                                                <p><span className="text-gray-500">Date:</span> {coa.test_date}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {coa.verification_key ? (
                                                <a
                                                    href={`https://janoshik.com/verify/${coa.verification_key}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100"
                                                >
                                                    {coa.verification_key} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">No key</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(coa)}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coa.id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default COAManager;
