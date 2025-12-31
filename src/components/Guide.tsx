import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Guide {
    id: string;
    title: string;
    icon: string;
    content: string;
    order_index: number;
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen className="w-5 h-5" />,
    Thermometer: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Droplet: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a8 8 0 01-8-8c0-4.418 8-12 8-12s8 7.582 8 12a8 8 0 01-8 8z" />
        </svg>
    ),
    Syringe: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 11.625h4.5m-4.5 0v3.375m0-3.375H4.5m4.5 3.375H4.5m4.5-3.375v3.375M4.5 15v3.375a.375.375 0 00.375.375h3.75" />
        </svg>
    ),
    Clock: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const Guide: React.FC = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [openSection, setOpenSection] = useState<string | null>(null);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const { data, error } = await supabase
                .from('guides')
                .select('*')
                .eq('is_active', true)
                .order('order_index');

            if (error) throw error;

            if (data && data.length > 0) {
                setGuides(data);
                setOpenSection(data[0].id); // Open first section by default
            }
        } catch (error) {
            console.error('Error fetching guides:', error);
            // Fallback to empty state - admin can add guides
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (id: string) => {
        setOpenSection(openSection === id ? null : id);
    };

    const getIcon = (iconName: string) => {
        return iconMap[iconName] || <BookOpen className="w-5 h-5" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center pt-32">
                <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-theme-secondary to-theme-accent text-white py-16 px-4 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Electronic Guides</h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Everything you need to know about storing, reconstituting, and using peptides safely and effectively.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-3xl">
                {/* Disclaimer */}
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Disclaimer</p>
                        <p>This information is for educational purposes only. Always consult with a healthcare professional before starting any peptide regimen. Follow proper handling and storage guidelines.</p>
                    </div>
                </div>

                {guides.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No guides available yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Check back soon for helpful content!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {guides.map((guide, idx) => (
                            <motion.div
                                key={guide.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleSection(guide.id)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent">
                                            {getIcon(guide.icon)}
                                        </div>
                                        <span className="font-semibold text-gray-900 text-lg">{guide.title}</span>
                                    </div>
                                    {openSection === guide.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {openSection === guide.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-5 pb-5 pt-0"
                                    >
                                        <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:not-italic prose-table:text-sm">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {guide.content}
                                            </ReactMarkdown>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Guide;
