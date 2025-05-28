
import React from 'react';

const products = [
  {
    id: 1,
    name: "Marquez Noir",
    description: "A bold and mysterious fragrance with notes of bergamot, black pepper, and sandalwood.",
    price: "$120",
    image: "🖤"
  },
  {
    id: 2,
    name: "Golden Essence",
    description: "An elegant blend of jasmine, vanilla, and amber that captures pure luxury.",
    price: "$150",
    image: "✨"
  },
  {
    id: 3,
    name: "Royal Velvet",
    description: "A sophisticated scent featuring rose petals, patchouli, and cedar wood.",
    price: "$135",
    image: "👑"
  }
];

export const ProductShowcase = () => {
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

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group bg-gray-900/50 backdrop-blur-sm border border-gold-600/20 rounded-lg p-8 
                       hover:border-gold-400/50 transition-all duration-500 transform hover:scale-105
                       hover:shadow-2xl hover:shadow-gold-500/20 animate-slide-up"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="text-center">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {product.image}
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
                                 transform hover:scale-105 w-full font-semibold">
                  Add to Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
