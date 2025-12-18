import React, { useState } from 'react';
import { useTestimonials, Testimonial } from '../hooks/useTestimonials';
import { Check, X, Trash2, Search, Filter, MessageSquare, Star, ArrowLeft, Plus } from 'lucide-react';

interface TestimonialsManagerProps {
    onBack: () => void;
}

const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({ onBack }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Verified Customer',
        content: '',
        rating: 5,
        category: 'Product Quality'
    });
    const { addTestimonial, testimonials, loading, updateTestimonialStatus, deleteTestimonial, refreshTestimonials } = useTestimonials(false);

    // ... existing filter/search logic ...
    const filteredTestimonials = testimonials.filter(t => {
        const matchesSearch =
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.content.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'pending') return matchesSearch && !t.approved;
        if (filter === 'approved') return matchesSearch && t.approved;
        return matchesSearch;
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(-1); // Use -1 for create loading state

        try {
            const result = await addTestimonial({
                ...formData,
                approved: true // Admins post automatically approved reviews
            });

            if (result.success) {
                await refreshTestimonials();
                setShowAddForm(false);
                setFormData({
                    name: '',
                    role: 'Verified Customer',
                    content: '',
                    rating: 5,
                    category: 'Product Quality'
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

    if (showAddForm) {
        return (
            <div className="min-h-screen bg-theme-bg p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Add Customer Review</h2>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Title (Optional)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g. Verified Customer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="input-field"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Product Quality">Product Quality</option>
                                <option value="Service">Service</option>
                                <option value="Results">Results</option>
                                <option value="Delivery">Delivery</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="focus:outline-none"
                                    >
                                        <Star className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                            <textarea
                                required
                                rows={4}
                                className="input-field"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Enter the customer review..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing === -1}
                                className="btn-primary"
                            >
                                {isProcessing === -1 ? 'Saving...' : 'Post Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ... existing handlers ...

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
                                <Plus className="w-4 h-4" /> Add Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ... rest of existing render code ... */}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search review..."
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
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No testimonials found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredTestimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={`bg-white rounded-lg p-5 shadow-sm border-l-4 transition-all ${testimonial.approved ? 'border-l-green-500' : 'border-l-yellow-400'}`}
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-0.5 text-xs rounded-full border ${testimonial.approved ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                                {testimonial.approved ? 'Approved' : 'Pending Review'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(testimonial.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs font-medium text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                                                {testimonial.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                                            {testimonial.role && <span className="text-sm text-gray-500">- {testimonial.role}</span>}
                                        </div>

                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-gray-600 italic">"{testimonial.content}"</p>
                                    </div>

                                    <div className="flex md:flex-col gap-2 min-w-[120px] justify-end md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                                        {!testimonial.approved ? (
                                            <button
                                                onClick={() => handleApprove(testimonial.id)}
                                                disabled={isProcessing === testimonial.id}
                                                className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnapprove(testimonial.id)}
                                                disabled={isProcessing === testimonial.id}
                                                className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X className="w-4 h-4" /> Hide
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            disabled={isProcessing === testimonial.id}
                                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
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
