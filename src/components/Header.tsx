import React, { useState } from 'react';
import { ShoppingCart, Menu, X, MessageCircle } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);




  return (
    <>
      <header className="bg-white sticky top-0 z-50 border-b-2 border-theme-secondary">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Brand */}
            <button
              onClick={() => { onMenuClick(); setMobileMenuOpen(false); }}
              className="flex items-center space-x-3 hover:opacity-80 transition-all group min-w-0 flex-1 max-w-[calc(100%-130px)] sm:max-w-none sm:flex-initial"
            >
              <div className="relative flex-shrink-0">
                <div className="bg-theme-accent/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src="/assets/logo.jpeg" alt="JM Pepkween" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-left min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-theme-text leading-tight whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
                  JM Pepkween
                </h1>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Peptides & Essentials
                  </span>
                </p>
              </div>
            </button>

            {/* Right Side Navigation */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                <button
                  onClick={onMenuClick}
                  className="text-sm font-medium text-gray-600 hover:text-theme-accent transition-colors"
                >
                  Products
                </button>

                <a
                  href="/coa"
                  className="text-sm font-medium text-gray-600 hover:text-theme-accent transition-colors"
                >
                  Lab Reports
                </a>

                <a
                  href="/faq"
                  className="text-sm font-medium text-gray-600 hover:text-theme-accent transition-colors"
                >
                  FAQ
                </a>

                <a
                  href="/testimonials"
                  className="text-sm font-medium text-gray-600 hover:text-theme-accent transition-colors"
                >
                  Testimonials
                </a>

                <a
                  href="https://www.facebook.com/jmpepkween"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-theme-accent transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </a>


              </nav>

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-theme-text hover:text-theme-accent transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-theme-secondary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-theme-text hover:text-theme-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-[65px] right-0 left-0 bg-white shadow-soft animate-slideIn border-b border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="px-4 py-6">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    onMenuClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-theme-text font-medium text-base hover:text-theme-accent transition-colors"
                >
                  Products
                </button>

                <a
                  href="/coa"
                  className="text-left text-theme-text font-medium text-base hover:text-theme-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📋 Lab Reports
                </a>

                <a
                  href="/faq"
                  className="text-left text-theme-text font-medium text-base hover:text-theme-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>

                <a
                  href="/testimonials"
                  className="text-left text-theme-text font-medium text-base hover:text-theme-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>



                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <a
                    href="https://www.facebook.com/jmpepkween"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-theme-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Contact Seller via Facebook</span>
                  </a>
                </div>
              </div>
            </nav>
          </div >
        </div >
      )}
    </>
  );
};

export default Header;
