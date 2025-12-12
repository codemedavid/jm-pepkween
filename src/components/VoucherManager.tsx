import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, Ticket } from 'lucide-react';
import { useVouchers } from '../hooks/useVouchers';
import type { Voucher } from '../types';

interface VoucherManagerProps {
    onBack?: () => void;
}

const VoucherManager: React.FC<VoucherManagerProps> = ({ onBack }) => {
    const { vouchers, loading, addVoucher, updateVoucher, deleteVoucher } = useVouchers();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Voucher>>({
        code: '',
        discount_type: 'fixed',
        discount_value: 0,
        min_spend: 0,
        usage_limit: null,
        is_active: true,
        expires_at: null
    });

    const handleEdit = (voucher: Voucher) => {
        setFormData({
            code: voucher.code,
            discount_type: voucher.discount_type,
            discount_value: voucher.discount_value,
            min_spend: voucher.min_spend,
            usage_limit: voucher.usage_limit,
            is_active: voucher.is_active,
            expires_at: voucher.expires_at ? new Date(voucher.expires_at).toISOString().split('T')[0] : null
        });
        setEditingId(voucher.id);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setFormData({
            code: '',
            discount_type: 'fixed',
            discount_value: 0,
            min_spend: 0,
            usage_limit: null,
            is_active: true,
            expires_at: null
        });
        setEditingId(null);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!formData.code || formData.discount_value === undefined) {
            alert('Code and discount value are required');
            return;
        }

        const voucherData: any = {
            ...formData,
            code: formData.code.toUpperCase().trim()
        };

        if (editingId) {
            await updateVoucher(editingId, voucherData);
        } else {
            await addVoucher(voucherData);
        }
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this voucher?')) {
            await deleteVoucher(id);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading vouchers...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-theme-bg to-white rounded-t-xl">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Ticket className="w-5 h-5 md:w-6 md:h-6 text-theme-accent" />
                    </div>
                    Voucher Management
                </h2>
                <div className="flex w-full md:w-auto gap-2">
                    {onBack && (
                        <button onClick={onBack} className="flex-1 md:flex-none px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleAddNew}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Voucher
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="p-6 bg-gray-50 border-b border-gray-100 animate-fadeIn">
                    <h3 className="font-bold mb-4">{editingId ? 'Edit Voucher' : 'New Voucher'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="input-field"
                                placeholder="PROMO2025"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.discount_type}
                                    onChange={e => setFormData({ ...formData, discount_type: e.target.value as 'fixed' | 'percentage' })}
                                    className="input-field"
                                >
                                    <option value="fixed">Fixed Amount (₱)</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input
                                    type="number"
                                    value={formData.discount_value}
                                    onChange={e => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Spend (₱)</label>
                            <input
                                type="number"
                                value={formData.min_spend}
                                onChange={e => setFormData({ ...formData, min_spend: parseFloat(e.target.value) })}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (leave empty for unlimited)</label>
                            <input
                                type="number"
                                value={formData.usage_limit || ''}
                                onChange={e => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                                className="input-field"
                                placeholder="Unlimited"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.expires_at || ''}
                                onChange={e => setFormData({ ...formData, expires_at: e.target.value || null })}
                                className="input-field"
                            />
                        </div>

                        <div className="flex items-center mt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 text-theme-accent rounded focus:ring-theme-accent"
                                />
                                <span className="font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-theme-accent text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Voucher
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 p-4">
                {vouchers.map((voucher) => (
                    <div key={voucher.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-theme-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{voucher.code}</h3>
                                <p className="text-theme-accent font-medium">
                                    {voucher.discount_type === 'percentage' ? `${voucher.discount_value}% OFF` : `₱${voucher.discount_value.toLocaleString()} OFF`}
                                </p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${voucher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {voucher.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Min Spend</p>
                                <p className="font-semibold text-gray-700">
                                    {voucher.min_spend > 0 ? `₱${voucher.min_spend.toLocaleString()}` : 'No minimum'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Usage</p>
                                <p className={`font-semibold ${voucher.usage_limit && voucher.times_used >= voucher.usage_limit ? 'text-red-600' : 'text-gray-700'}`}>
                                    {voucher.times_used} <span className="text-gray-400">/</span> {voucher.usage_limit || '∞'}
                                </p>
                            </div>
                            {voucher.expires_at && (
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Expires On</p>
                                    <p className="font-semibold text-gray-700">
                                        {new Date(voucher.expires_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => handleEdit(voucher)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(voucher.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {vouchers.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No vouchers yet</h3>
                        <p className="text-gray-500">Create your first voucher to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherManager;
