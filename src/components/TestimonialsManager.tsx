import React, { useState } from 'react';
import { useTestimonials, Testimonial } from '../hooks/useTestimonials';
import { useImageUpload } from '../hooks/useImageUpload';
import { Check, X, Trash2, Search, MessageSquare, ArrowLeft, Plus, Upload, Image, Pencil } from 'lucide-react';

interface TestimonialsManagerProps {
    onBack: () => void;
}

const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({ onBack }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: ''
    });
    const { addTestimonial, updateTestimonial, testimonials, loading, error, updateTestimonialStatus, deleteTestimonial, refreshTestimonials } = useTestimonials(false);
    const { uploadImage, uploading, uploadProgress } = useImageUpload('testimonials');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState<number | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Show error state if data fetching fails
    if (error) {
        return (
            <div className="min-h-screen bg-theme-bg p-8 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Testimonials</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="bg-gray-50 p-4 rounded text-left text-sm text-gray-500 mb-6">
                        <p className="font-medium mb-1">Troubleshooting:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Check database connection</li>
                            <li>Ensure 'testimonials' table exists</li>
                            <li>Run migration: <code>20250119_update_testimonials_for_screenshots.sql</code></li>
                        </ul>
                    </div>
                    <button
                        onClick={onBack}
                        className="btn-primary w-full"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const filteredTestimonials = testimonials.filter(t => {
        const matchesSearch =
            (t.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'pending') return matchesSearch && !t.approved;
        if (filter === 'approved') return matchesSearch && t.approved;
        return matchesSearch;
    });

    const handleImageUpload = async (file: File) => {
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, image_url: url }));
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload image. Please try again.');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image_url) {
            alert('Please upload a screenshot image');
            return;
        }

        setIsProcessing(-1);

        try {
            const result = await addTestimonial({
                ...formData,
                approved: true
            } as any);

            if (result.success) {
                await refreshTestimonials();
                setShowAddForm(false);
                setFormData({
                    title: '',
                    description: '',
                    image_url: ''
                });
            } else {
                alert('Failed to create testimonial');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsProcessing(null);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            title: testimonial.title || testimonial.name || '',
            description: testimonial.description || testimonial.content || '',
            image_url: testimonial.image_url || ''
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingTestimonial) return;

        setIsProcessing(editingTestimonial.id);

        try {
            const result = await updateTestimonial(editingTestimonial.id, {
                title: formData.title,
                description: formData.description,
                image_url: formData.image_url
            });

            if (result.success) {
                setEditingTestimonial(null);
                setFormData({
                    title: '',
                    description: '',
                    image_url: ''
                });
            } else {
                alert('Failed to update testimonial');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsProcessing(null);
        }
    };

    const handleApprove = async (id: number) => {
        setIsProcessing(id);
        await updateTestimonialStatus(id, true);
        setIsProcessing(null);
    };

    const handleUnapprove = async (id: number) => {
        setIsProcessing(id);
        await updateTestimonialStatus(id, false);
        setIsProcessing(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        setIsProcessing(id);
        await deleteTestimonial(id);
        setIsProcessing(null);
    };

    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingTestimonial(null);
        setFormData({
            title: '',
            description: '',
            image_url: ''
        });
    };

    // Show Add or Edit Form
    if (showAddForm || editingTestimonial) {
        const isEditing = !!editingTestimonial;

        return (
            <div className="min-h-screen bg-theme-bg p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={handleCancelForm}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Edit Testimonial' : 'Add Customer Screenshot'}
                        </h2>
                    </div>

                    <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Screenshot Image *</label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive ? 'border-theme-accent bg-theme-accent/5' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {formData.image_url ? (
                                    <div className="relative">
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : uploading ? (
                                    <div className="py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 relative">
                                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                            <div
                                                className="absolute inset-0 border-4 border-theme-accent rounded-full border-t-transparent animate-spin"
                                                style={{ animationDuration: '1s' }}
                                            ></div>
                                        </div>
                                        <p className="text-gray-600">Uploading... {uploadProgress}%</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-2">Drag and drop your screenshot here, or</p>
                                        <label className="cursor-pointer">
                                            <span className="btn-primary inline-block">Browse Files</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        handleImageUpload(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-400 mt-3">Supports: JPG, PNG, WebP, HEIC (Max 10MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Dosage Guidance & Effectiveness"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows={3}
                                className="input-field"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief summary of what the screenshot shows..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing !== null || (!isEditing && !formData.image_url)}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing !== null ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Screenshot')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-theme-bg">
            <div className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="text-gray-500 hover:text-theme-accent transition-colors"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-theme-accent" />
                                Testimonials Manager
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="btn-primary flex items-center gap-2 px-3 py-1.5 text-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Screenshot
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search testimonials..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-theme-accent w-full md:w-64"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-md">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-theme-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'pending' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'approved' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Approved
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner border-4 border-gray-200 border-t-theme-accent rounded-full w-8 h-8 animate-spin"></div>
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No testimonials found</h3>
                        <p className="text-gray-500">Upload your first customer screenshot to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTestimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={`bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-all ${testimonial.approved ? 'border-green-200' : 'border-yellow-200'
                                    }`}
                            >
                                {/* Image */}
                                {testimonial.image_url ? (
                                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <img
                                            src={testimonial.image_url}
                                            alt={testimonial.title || 'Testimonial'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                                        <Image className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}

                                <div className="p-4">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-2 py-0.5 text-xs rounded-full border ${testimonial.approved
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {testimonial.approved ? 'Approved' : 'Pending'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(testimonial.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                        {testimonial.title || testimonial.name || 'Untitled'}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                        {testimonial.description || testimonial.content || 'No description'}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(testimonial)}
                                            disabled={isProcessing === testimonial.id}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        {!testimonial.approved ? (
                                            <button
                                                onClick={() => handleApprove(testimonial.id)}
                                                disabled={isProcessing === testimonial.id}
                                                className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnapprove(testimonial.id)}
                                                disabled={isProcessing === testimonial.id}
                                                className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                            >
                                                <X className="w-4 h-4" /> Hide
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            disabled={isProcessing === testimonial.id}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsManager;
