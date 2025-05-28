import React from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Marquez Noir",
    description: "A bold and mysterious fragrance with notes of bergamot, black pepper, and sandalwood.",
    price: "$120",
    image: "🖤",
    category: "Unisex"
  },
  {
    id: 2,
    name: "Golden Essence",
    description: "An elegant blend of jasmine, vanilla, and amber that captures pure luxury.",
    price: "$150",
    image: "✨",
    category: "Women"
  },
  {
    id: 3,
    name: "Royal Velvet",
    description: "A sophisticated scent featuring rose petals, patchouli, and cedar wood.",
    price: "$135",
    image: "👑",
    category: "Women"
  },
  {
    id: 4,
    name: "Midnight Oud",
    description: "Deep and intoxicating with oud, leather, and smoky incense notes.",
    price: "$180",
    image: "🌙",
    category: "Men"
  },
  {
    id: 5,
    name: "Citrus Gold",
    description: "Fresh and vibrant with bergamot, lemon, and golden amber finish.",
    price: "$110",
    image: "🍊",
    category: "Unisex"
  },
  {
    id: 6,
    name: "Imperial Rose",
    description: "Luxurious and romantic with Bulgarian rose, musk, and white tea.",
    price: "$165",
    image: "🌹",
    category: "Women"
  }
];

export const ProductShowcase = () => {
  const navigate = useNavigate();
  
  return (
    <section id="products" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gold-400 animate-fade-in">
            Our Signature Collection
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
            Each fragrance tells a unique story, carefully crafted to evoke emotions and create lasting memories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group bg-gray-900/50 backdrop-blur-sm border border-gold-600/20 rounded-lg p-8 
                       hover:border-gold-400/50 transition-all duration-500 transform hover:scale-105
                       hover:shadow-2xl hover:shadow-gold-500/20 animate-slide-up cursor-pointer"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-center">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                
                <div className="mb-4">
                  <span className="inline-block bg-gold-600/20 text-gold-300 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gold-300 mb-4 group-hover:text-gold-200 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="text-2xl font-bold text-gold-400 mb-6">
                  {product.price}
                </div>
                
                <button className="bg-transparent border-2 border-gold-500 text-gold-400 px-6 py-3 
                                 hover:bg-gold-500 hover:text-black transition-all duration-300
                                 transform hover:scale-105 w-full font-semibold relative overflow-hidden group">
                  <span className="relative z-10">Add to Collection</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-4 text-lg font-semibold 
                     hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105
                     relative overflow-hidden group"
          >
            <span className="relative z-10">View Full Collection</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                          transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </section>
  );
};
