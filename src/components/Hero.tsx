import React from 'react';
import { ArrowRight } from 'lucide-react';

type HeroProps = {
  onShopAll?: () => void;
};

const Hero: React.FC<HeroProps> = ({ onShopAll }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-4 pb-10 md:pt-8 md:pb-16 lg:pt-12 lg:pb-24 border-b border-pink-100">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-theme-accent/20 to-purple-200/20 blur-3xl opacity-60 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[25rem] h-[25rem] rounded-full bg-gradient-to-tr from-theme-secondary/30 to-pink-200/30 blur-3xl opacity-60 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      {/* Wave Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="/assets/hero-wave.png" 
          alt="Background Pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Wave Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="/assets/hero-wave.png" 
          alt="Background Pattern" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* chic badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 shadow-sm animate-fadeIn hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-theme-accent"></span>
              </span>
              <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-theme-text to-gray-600 bg-clip-text text-transparent tracking-wide uppercase">
                The Gold Standard in Peptides
              </span>
            </div>
          </div>

          {/* Main Heading with aesthetic typography */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-theme-text mb-8 tracking-tight leading-[1.1] relative inline-block drop-shadow-sm">
            Unlock Your <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-theme-accent via-pink-500 to-purple-500 relative">
              Inner Glow
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-theme-secondary/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            Premium peptides for weight loss, anti-aging, and wellness.
            Experience the <span className="font-semibold text-theme-accent">JM Pepkween</span> difference—where science meets beauty. ✨
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-20">
            <button
              className="btn-primary w-full sm:w-auto group flex items-center justify-center gap-2 shadow-lg shadow-theme-accent/25 hover:shadow-xl hover:shadow-theme-accent/30 transform hover:-translate-y-1 transition-all duration-300 text-lg px-8 py-4 rounded-full"
              onClick={onShopAll}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-4 border-t border-gray-100/50 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> 99% Purity Guaranteed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Lab Tested
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Fast Shipping
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;

