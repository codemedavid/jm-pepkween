import React, { useState } from 'react';
import { Star, MessageSquare, Send, User, Quote } from 'lucide-react';
import { useTestimonials } from '../hooks/useTestimonials';

const CATEGORIES = ['All', 'Product Quality', 'Service', 'Results', 'Delivery'];

const Testimonials: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const { testimonials, loading: loadingTestimonials, addTestimonial } = useTestimonials(true); // Only approved

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Product Quality',
        content: '',
        rating: 5
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const filteredTestimonials = activeCategory === 'All'
        ? testimonials
        : testimonials.filter(t => t.category === activeCategory);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Call addTestimonial from hook
        const result = await addTestimonial({
            name: formData.name,
            content: formData.content,
            rating: Number(formData.rating),
            category: formData.category,
            role: 'Verified Customer' // Default role
        });

        setSubmitting(false);

        if (result.success) {
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                category: 'Product Quality',
                content: '',
                rating: 5
            });
            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } else {
            alert("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="bg-theme-bg min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-theme-secondary to-theme-accent text-white py-16 sm:py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fadeIn">Client Love</h1>
                    <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90 animate-slideIn">
                        See what our community has to say about their journey with The Peppy Lab.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                ? 'bg-theme-accent text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-theme-secondary hover:text-theme-secondary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Testimonials Grid */}
                {loadingTestimonials ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner border-4 border-gray-200 border-t-theme-accent rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                        <p className="text-gray-500 text-lg">No testimonials found yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        {filteredTestimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-theme-secondary flex flex-col h-full"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium text-gray-400">{new Date(testimonial.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="relative mb-6 flex-grow">
                                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-theme-secondary opacity-20 transform -scale-x-100" />
                                    <p className="text-gray-600 relative z-10 italic pl-4 leading-relaxed">"{testimonial.content}"</p>
                                </div>

                                <div className="flex items-center pt-4 border-t border-gray-50 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-theme-bg flex items-center justify-center text-theme-accent font-bold mr-3 border border-theme-secondary">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-theme-text text-sm">{testimonial.name}</h4>
                                        <p className="text-xs text-gray-400">{testimonial.role || 'Verified Customer'}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="inline-block px-2 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-md border border-gray-100 uppercase tracking-wider">
                                            {testimonial.category}
                                        </span>
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

export default Testimonials;
