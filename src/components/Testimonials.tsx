import React from 'react';
import { Star } from 'lucide-react';
import { useTestimonials } from '../hooks/useTestimonials';

const Testimonials: React.FC = () => {
    const { testimonials, loading: loadingTestimonials } = useTestimonials(true); // Only approved

    return (
        <div className="bg-theme-bg min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-theme-secondary to-theme-accent text-white py-16 sm:py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm animate-bounce-slow">
                            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 animate-fadeIn tracking-tight">
                        Real Results from Real Customers
                    </h1>
                    <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90 animate-slideIn font-light leading-relaxed">
                        See authentic conversations, delivery confirmations, and progress updates from our satisfied customers. All testimonials are verified and showcase genuine experiences.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Testimonials Grid */}
                {loadingTestimonials ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner border-4 border-gray-200 border-t-theme-accent rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                        <p className="text-gray-500 text-lg">No testimonials found yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-theme-secondary group"
                            >
                                {/* Screenshot Image */}
                                {testimonial.image_url ? (
                                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <img
                                            src={testimonial.image_url}
                                            alt={testimonial.title || 'Customer testimonial'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No image</span>
                                    </div>
                                )}

                                {/* Title & Description */}
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-theme-accent transition-colors">
                                        {testimonial.title || testimonial.name || 'Customer Review'}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                        {testimonial.description || testimonial.content || ''}
                                    </p>
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
