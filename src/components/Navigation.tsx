
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-gold-600/20' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gold-400 tracking-wider">
            MARQUEZ
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white relative z-50 p-2 rounded-lg hover:bg-gold-500/20 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={`absolute transition-all duration-300 transform ${
                  isMobileMenuOpen ? 'rotate-180 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                }`}
              />
              <X 
                size={24} 
                className={`absolute transition-all duration-300 transform ${
                  isMobileMenuOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-black to-gray-900 
                        border-l border-gold-600/20 transform transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col pt-20 px-8 space-y-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-gold-400 transition-all duration-300 text-left text-xl
                       transform hover:translate-x-2 hover:scale-105 py-3 border-b border-gold-600/20"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-white hover:text-gold-400 transition-all duration-300 text-left text-xl
                       transform hover:translate-x-2 hover:scale-105 py-3 border-b border-gold-600/20"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-gold-400 transition-all duration-300 text-left text-xl
                       transform hover:translate-x-2 hover:scale-105 py-3 border-b border-gold-600/20"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-gold-400 transition-all duration-300 text-left text-xl
                       transform hover:translate-x-2 hover:scale-105 py-3 border-b border-gold-600/20"
            >
              Contact
            </button>
            
            {/* Mobile Menu Footer */}
            <div className="pt-8 border-t border-gold-600/20">
              <div className="text-gold-400 font-bold text-lg mb-2">MARQUEZ</div>
              <p className="text-gray-400 text-sm">Luxury Fragrances</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
