import React, { useState } from 'react';
import { useCOA } from '../hooks/useCOA';
import { supabase } from '../lib/supabase';
import { Trash2, Upload, FileCheck } from 'lucide-react';

interface COAManagerProps {
    onBack?: () => void;
}

const COAManager: React.FC<COAManagerProps> = ({ onBack }) => {
    const { coas, loading, addCOA, deleteCOA } = useCOA();
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        setError(null);

        try {
            // 1. Upload image to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `coa-images/${fileName}`;

            // Create bucket if fetching fails (simple check)
            // Ideally buckets are created via SQL or dashboard, assuming 'products' or 'public' bucket exists.
            // Using 'product-images' for simplicity as it exists, or fallback to 'public'
            const { error: uploadError } = await supabase.storage
                .from('product-images') // Reusing existing bucket for now
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 3. Add record to DB
            const finalTitle = title.trim() || file.name;
            const result = await addCOA(finalTitle, data.publicUrl);

            if (!result.success) throw result.error;

            setTitle('');
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this certificate?')) {
            await deleteCOA(id);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading certificates...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-theme-bg to-white rounded-t-xl">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-theme-accent" />
                    COA Management
                </h2>
                {onBack && (
                    <button onClick={onBack} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Back
                    </button>
                )}
            </div>

            <div className="p-6">
                {/* Upload Section */}
                <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-4 hover:border-theme-accent/50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                        <Upload className="w-6 h-6 text-theme-accent" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900">Upload New Certificate</h3>
                        <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>

                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <input
                                type="text"
                                placeholder="Certificate Title (Optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field text-sm text-center"
                            />
                            <label className={`btn-primary cursor-pointer flex items-center justify-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                {uploading ? 'Uploading...' : 'Select File'}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {coas.map((coa) => (
                        <div key={coa.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                <img src={coa.image_url} alt={coa.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(coa.id)}
                                        className="bg-white p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-medium text-gray-900 truncate" title={coa.title}>{coa.title}</h4>
                                <p className="text-xs text-gray-500">{new Date(coa.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {coas.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No certificates found. Upload one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default COAManager;
