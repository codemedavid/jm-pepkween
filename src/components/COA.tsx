import React, { useState } from 'react';
import { Download, ExternalLink, ShieldCheck, CheckCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our COA data
interface COAReport {
    id: string;
    productName: string;
    image: string;
    purity: string;
    quantity: string;
    taskNumber: string;
    verificationKey: string;
    testDate: string;
    isVerified: boolean;
}

const COA: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Static data matching the setup guide's examples
    const reports: COAReport[] = [
        {
            id: '1',
            productName: 'Tirzepatide 15mg',
            image: '/coa/tirzepatide-15mg-coa.jpg',
            purity: '99.658%',
            quantity: '16.80 mg',
            taskNumber: '#68396',
            verificationKey: '9AUYT3EZV9Y9',
            testDate: '20 JUN 2025',
            isVerified: true
        },
        {
            id: '2',
            productName: 'Tirzepatide 30mg',
            image: '/coa/tirzepatide-30mg-coa.jpg',
            purity: '99.683%',
            quantity: '31.21 mg',
            taskNumber: '#68397',
            verificationKey: 'ZW6YWJ55MXK9',
            testDate: '19 JUN 2025',
            isVerified: true
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-theme-accent text-white py-16 px-4 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Lab Reports & Analysis</h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            We value transparency. View our third-party testing results to verify the purity and quality of our products.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: ShieldCheck, title: "Third-Party Tested", desc: "Independent lab verification" },
                        { icon: CheckCircle, title: "99%+ Purity", desc: "Consistently high quality standards" },
                        { icon: Search, title: "Verifiable Results", desc: "Direct links to lab database" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
                        >
                            <div className="bg-theme-accent/10 p-3 rounded-full text-theme-accent">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reports.map((report) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 group"
                        >
                            {/* Image Preview */}
                            <div
                                className="h-64 bg-gray-100 relative overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(report.image)}
                            >
                                <img
                                    src={report.image}
                                    alt={`${report.productName} COA`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        // Fallback if image not found
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x800?text=Report+Image+Coming+Soon';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-900 px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 duration-300">
                                        Click to Enlarge
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">{report.productName}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>Task: {report.taskNumber}</span>
                                            <span>•</span>
                                            <span>{report.testDate}</span>
                                        </div>
                                    </div>
                                    {report.isVerified && (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> VERIFIED
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Purity</span>
                                        <div className="text-2xl font-bold text-theme-accent">{report.purity}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Quantity</span>
                                        <div className="text-lg font-semibold text-gray-700">{report.quantity}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={`https://janoshik.com/verify/${report.verificationKey}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-theme-accent text-white py-2.5 px-4 rounded-lg font-medium hover:bg-theme-accent/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Verify at Janoshik
                                    </a>
                                    <button
                                        onClick={() => window.open(report.image, '_blank')}
                                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage}
                            alt="Full Report"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default COA;
