import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartDropdown } from './CartDropdown';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleShopNow = () => {
    navigate('/shop');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gold-600/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gold-400 tracking-wider cursor-pointer"
               onClick={() => navigate('/')}>
            MARQUEZ
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => {scrollToSection('home')
                navigate('/')
              }}
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
            <button 
              onClick={handleShopNow}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-4 py-2 font-semibold text-sm
                       hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105"
            >
              Shop Now
            </button>
            <CartDropdown />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <CartDropdown />
            <button
              className="text-white"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gold-600/20">
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() =>{ navigate('/')
                scrollToSection('home')

                }}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Contact
              </button>
              <button 
                onClick={handleShopNow}
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-4 py-2 font-semibold text-sm
                         hover:from-gold-400 hover:to-gold-500 transition-all duration-300 text-left mt-2 w-fit"
              >
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
