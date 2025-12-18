
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, HelpCircle, AlertCircle, Package, CreditCard, Truck } from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface FAQCategory {
    title: string;
    icon: React.ReactNode;
    items: FAQItem[];
}

const FAQ: React.FC = () => {
    const [openCategory, setOpenCategory] = useState<string | null>('PRODUCT & USAGE');
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);
    const [faqData, setFaqData] = useState<FAQCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .eq('is_active', true)
                .order('category')
                .order('order_index');

            if (error) throw error;

            if (data) {
                // Group by category
                const grouped = data.reduce((acc, item) => {
                    const cat = item.category.toUpperCase();
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(item);
                    return acc;
                }, {} as Record<string, FAQItem[]>);

                // Map to display structure with icons
                const categories: FAQCategory[] = [
                    {
                        title: "PRODUCT & USAGE",
                        icon: <HelpCircle className="w-5 h-5" />,
                        items: grouped['PRODUCT & USAGE'] || []
                    },
                    {
                        title: "ORDERING & PACKAGING",
                        icon: <Package className="w-5 h-5" />,
                        items: grouped['ORDERING & PACKAGING'] || []
                    },
                    {
                        title: "PAYMENT METHODS",
                        icon: <CreditCard className="w-5 h-5" />,
                        items: grouped['PAYMENT METHODS'] || []
                    },
                    {
                        title: "SHIPPING & DELIVERY",
                        icon: <Truck className="w-5 h-5" />,
                        items: grouped['SHIPPING & DELIVERY'] || []
                    }
                ];

                // Add any other categories that might be in DB but not hardcoded above
                Object.keys(grouped).forEach(key => {
                    if (!categories.find(c => c.title === key)) {
                        categories.push({
                            title: key,
                            icon: <HelpCircle className="w-5 h-5" />, // Default icon
                            items: grouped[key]
                        });
                    }
                });

                // Filter out empty categories
                setFaqData(categories.filter(c => c.items.length > 0));

                // Set first non-empty category as open by default
                if (categories.length > 0 && categories[0].items.length > 0) {
                    setOpenCategory(categories[0].title);
                }
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (title: string) => {
        setOpenCategory(openCategory === title ? null : title);
    };

    const toggleQuestion = (id: string) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pb-12 flex justify-center pt-24">
                <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-12">
            <div className="bg-gradient-to-r from-theme-secondary/10 to-theme-accent/5 py-12 mb-8">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-theme-text mb-2">Frequently Asked Questions</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about our products, shipping, and more.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Disclaimer</p>
                        <p>I am not responsible for any outcomes. Always do your own research before use. Follow proper handling and storage guidelines.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {faqData.map((category) => (
                        <div key={category.title} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleCategory(category.title)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-theme-secondary">
                                        {category.icon}
                                    </div>
                                    <span className="font-semibold text-gray-900">{category.title}</span>
                                </div>
                                {openCategory === category.title ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            {openCategory === category.title && (
                                <div className="divide-y divide-gray-100">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="bg-white">
                                            <button
                                                onClick={() => toggleQuestion(item.id)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <span className="font-medium text-gray-700 pr-4">{item.question}</span>
                                                {openQuestion === item.id ? (
                                                    <ChevronUp className="w-4 h-4 text-theme-accent flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>
                                            {openQuestion === item.id && (
                                                <div className="px-4 pb-4 pt-0 text-gray-600 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200 whitespace-pre-line">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
