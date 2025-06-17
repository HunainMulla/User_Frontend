import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartDropdown } from './CartDropdown';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '@/slice/loginSlice';
import { useAdmin } from '@/contexts/AdminContext';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: any) => state.login.value);
  const { isAdmin, clearAdminStatus } = useAdmin();
  
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

  const handleLogout = () => {
    dispatch(logout());
    clearAdminStatus(); // Clear admin status when logging out
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gold-600/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-serif text-2xl font-bold text-gold-400 tracking-wider cursor-pointer"
               onClick={() => navigate('/')}>
            MARQUEZ
            {isAdmin && <span className="text-xs ml-2 bg-gold-500 text-black px-2 py-1 rounded">ADMIN</span>}
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
      {  !isLoggedIn &&     <button 
              onClick={() => {scrollToSection('login-page')
                navigate('/login')
              }}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>}
            <button 
              onClick={() => navigate('/shop')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            {isLoggedIn && <button 
              onClick={() => navigate('/orders')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Orders
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>}
            {/* {isAdmin && <button 
              onClick={() => navigate('/admin')}
              className="text-gold-400 hover:text-gold-300 transition-colors duration-300 relative group font-semibold"
            >
              Admin Panel
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>} */}
            {isAdmin && <button 
              onClick={() => navigate('/admin/create-product')}
              className="text-gold-400 hover:text-gold-300 transition-colors duration-300 relative group font-semibold"
            >
              Create Product
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>}
            {isAdmin && <button 
              onClick={() => navigate('/admin/user-orders')}
              className="text-gold-400 hover:text-gold-300 transition-colors duration-300 relative group font-semibold"
            >
              User Orders
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>}
            <button 
              onClick={() => navigate('/contact')}
              className="text-white hover:text-gold-400 transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            {isLoggedIn && <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors duration-300 relative group font-semibold"
            >
              Logout
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
            </button>}
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
              
          { !isLoggedIn && <button 
                onClick={() =>{ navigate('/login')
                scrollToSection('login-page')

                }}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Login
              </button>}
              
              <button 
                onClick={() => navigate('/shop')}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Products
              </button>
              {isLoggedIn && <button 
                onClick={() => {
                  navigate('/orders');
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Orders
              </button>}
              
              {/* Admin Section */}
              {isAdmin && (
                <>
                  <div className="border-t border-gold-600/30 my-2"></div>
                  <div className="text-gold-400 text-sm font-semibold mb-2">Admin Options</div>
                  <button 
                    onClick={() => {
                      navigate('/admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gold-400 hover:text-gold-300 transition-colors duration-300 text-left font-semibold pl-4"
                  >
                    Admin Panel
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/admin/create-product');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gold-400 hover:text-gold-300 transition-colors duration-300 text-left font-semibold pl-4"
                  >
                    Create Product
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/admin/user-orders');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gold-400 hover:text-gold-300 transition-colors duration-300 text-left font-semibold pl-4"
                  >
                    User Orders
                  </button>
                  <div className="border-t border-gold-600/30 my-2"></div>
                </>
              )}
              
              <button 
                onClick={() => {
                  navigate('/about');
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                About
              </button>
              <button 
                onClick={() => {
                  navigate('/contact');
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-gold-400 transition-colors duration-300 text-left"
              >
                Contact
              </button>
              {isLoggedIn && <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors duration-300 text-left font-semibold"
              >
                Logout
              </button>}
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
