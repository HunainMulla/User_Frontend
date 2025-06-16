import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden shadow-lg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black shadow-lg"></div>
      
      {/* Floating golden particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gold-300 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gold-500 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 relative">
          {/* Dust particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gold-400 rounded-full opacity-0 animate-dust-settle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`small-${i}`}
                className="absolute w-0.5 h-0.5 bg-gold-300 rounded-full opacity-0 animate-dust-settle"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.15 + 0.5}s`,
                  animationDuration: '1.8s'
                }}
              />
            ))}
          </div>
          
          {/* Logo with dust reveal animation */}
          <img 
            src="/images/mar_logo-removebg-preview.png" 
            alt="Marquez Logo" 
            className="h-28 md:h-32 w-auto mx-auto mb-[-14px] opacity-0 animate-logo-dust-reveal"
          />
        </div>
        
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-3 animate-fade-in">
          <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
            MARQUEZ
          </span>
        </h1>
        
        <p className="font-serif text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
          Luxury Fragrances That Define Elegance
        </p>
        
        <p className="font-serif text-md text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
          Discover our exclusive collection of premium perfumes, crafted with the finest ingredients 
          to create unforgettable scent experiences.
        </p>
        
        <button 
          onClick={scrollToProducts}
          className="group bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-4 text-lg font-semibold 
                   hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105
                   animate-slide-up relative overflow-hidden"
          style={{animationDelay: '0.9s'}}
        >
          <span className="relative z-10">Explore Collection</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-700 animate-shimmer"></div>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-gold-400" size={32} />
      </div>
    </section>
  );
};
