import React from 'react';
import { ShieldCheck, Sparkles, FlaskConical } from 'lucide-react';

const TrustSection: React.FC = () => {
    return (
        <div className="py-12 md:py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                {/* Trust Indicators - Horizontal scrollable on mobile */}
                <div className="flex flex-row items-stretch gap-4 md:gap-8 max-w-3xl mx-auto overflow-x-auto pb-2 scrollbar-hide mb-12">
                    <div className="flex flex-col items-center gap-2 group min-w-[100px] flex-1">
                        <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-theme-accent/30 transition-colors">
                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-theme-accent" />
                        </div>
                        <p className="font-semibold text-theme-text text-xs md:text-sm text-center">Lab Verified</p>
                        <p className="text-[10px] md:text-xs text-gray-400 text-center">Purity Guaranteed</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 group min-w-[100px] flex-1">
                        <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-theme-secondary/30 transition-colors">
                            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-theme-secondary" />
                        </div>
                        <p className="font-semibold text-theme-text text-xs md:text-sm text-center">Premium Quality</p>
                        <p className="text-[10px] md:text-xs text-gray-400 text-center">Sourced for Excellence</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 group min-w-[100px] flex-1">
                        <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-theme-accent/30 transition-colors">
                            <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-theme-accent" />
                        </div>
                        <p className="font-semibold text-theme-text text-xs md:text-sm text-center">Real-World Tested</p>
                        <p className="text-[10px] md:text-xs text-gray-400 text-center">Verified by Our Team</p>
                    </div>
                </div>

                {/* Real-World Tested Section */}
                <div className="bg-theme-bg/50 rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <FlaskConical className="w-5 h-5 text-theme-accent" />
                        <h3 className="font-bold text-theme-text">Real-World Tested</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        Every peptide and supply item is used and verified by our team and community before being offered in our shop. Quality you can feel — results you can trust.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrustSection;
