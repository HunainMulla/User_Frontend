import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const products = [
  {
    id: 1,
    name: "Marquez Noir",
    description: "A bold and mysterious fragrance with notes of bergamot, black pepper, and sandalwood. Perfect for evening wear and special occasions.",
    price: "$120",
    originalPrice: "$150",
    image: "🖤",
    category: "Unisex",
    size: "100ml",
    notes: ["Bergamot", "Black Pepper", "Sandalwood"],
    inStock: true
  },
  {
    id: 2,
    name: "Golden Essence",
    description: "An elegant blend of jasmine, vanilla, and amber that captures pure luxury and sophistication.",
    price: "$150",
    originalPrice: "$180",
    image: "✨",
    category: "Women",
    size: "100ml",
    notes: ["Jasmine", "Vanilla", "Amber"],
    inStock: true
  },
  {
    id: 3,
    name: "Royal Velvet",
    description: "A sophisticated scent featuring rose petals, patchouli, and cedar wood for the modern woman.",
    price: "$135",
    originalPrice: "$160",
    image: "👑",
    category: "Women",
    size: "100ml",
    notes: ["Rose Petals", "Patchouli", "Cedar Wood"],
    inStock: true
  },
  {
    id: 4,
    name: "Midnight Oud",
    description: "Deep and intoxicating with oud, leather, and smoky incense notes. A masterpiece for the connoisseur.",
    price: "$180",
    originalPrice: "$220",
    image: "🌙",
    category: "Men",
    size: "100ml",
    notes: ["Oud", "Leather", "Smoky Incense"],
    inStock: true
  },
  {
    id: 5,
    name: "Citrus Gold",
    description: "Fresh and vibrant with bergamot, lemon, and golden amber finish. Perfect for daily wear.",
    price: "$110",
    originalPrice: "$130",
    image: "🍊",
    category: "Unisex",
    size: "100ml",
    notes: ["Bergamot", "Lemon", "Golden Amber"],
    inStock: true
  },
  {
    id: 6,
    name: "Imperial Rose",
    description: "Luxurious and romantic with Bulgarian rose, musk, and white tea. An enchanting feminine fragrance.",
    price: "$165",
    originalPrice: "$190",
    image: "🌹",
    category: "Women",
    size: "100ml",
    notes: ["Bulgarian Rose", "Musk", "White Tea"],
    inStock: false
  },
  {
    id: 7,
    name: "Ocean Breeze",
    description: "Fresh aquatic scent with sea salt, mint, and driftwood. Captures the essence of coastal luxury.",
    price: "$125",
    originalPrice: "$155",
    image: "🌊",
    category: "Unisex",
    size: "100ml",
    notes: ["Sea Salt", "Mint", "Driftwood"],
    inStock: true
  },
  {
    id: 8,
    name: "Spice Emperor",
    description: "Bold and commanding with cardamom, cinnamon, and tobacco leaf. For the distinguished gentleman.",
    price: "$155",
    originalPrice: "$185",
    image: "🔥",
    category: "Men",
    size: "100ml",
    notes: ["Cardamom", "Cinnamon", "Tobacco Leaf"],
    inStock: true
  }
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const { toast } = useToast();

  const categories = ['All', 'Men', 'Women', 'Unisex'];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') {
      return parseInt(a.price.slice(1)) - parseInt(b.price.slice(1));
    }
    return a.name.localeCompare(b.name);
  });

  const handleAddToCart = (product: typeof products[0]) => {
    if (!product.inStock) return;
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gold-400 animate-fade-in">
              Shop Collection
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              Discover our exclusive range of luxury fragrances, each crafted with the finest ingredients 
              and designed to create unforgettable moments.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-12 space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex space-x-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gold-500 text-black font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 text-sm rounded-lg border border-gold-600/20 focus:outline-none focus:border-gold-400"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product, index) => (
              <div 
                key={product.id}
                className="group bg-gray-900/50 backdrop-blur-sm border border-gold-600/20 rounded-lg overflow-hidden
                         hover:border-gold-400/50 transition-all duration-500 transform hover:scale-105
                         hover:shadow-2xl hover:shadow-gold-500/20 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {product.image}
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="inline-block bg-gold-600/20 text-gold-300 px-2 py-1 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                      <span className="text-gray-400 text-sm">{product.size}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gold-300 mb-3 group-hover:text-gold-200 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Key Notes:</div>
                    <div className="flex flex-wrap gap-1">
                      {product.notes.map((note, i) => (
                        <span key={i} className="bg-gray-800 text-gold-300 px-2 py-1 rounded text-xs">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gold-400">{product.price}</span>
                      <span className="text-gray-500 line-through ml-2 text-sm">{product.originalPrice}</span>
                    </div>
                    <div className={`text-sm font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <button 
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-3 font-semibold transition-all duration-300 transform relative overflow-hidden group
                      ${product.inStock 
                        ? 'bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black hover:scale-105' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed border-2 border-gray-600'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      {product.inStock && <ArrowRight className="ml-2" size={16} />}
                    </span>
                    {product.inStock && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-700"></div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-lg p-8">
              <h3 className="text-3xl font-bold text-gold-400 mb-4">Can't Find What You're Looking For?</h3>
              <p className="text-gray-300 mb-6">Contact our fragrance experts for personalized recommendations</p>
              <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-3 font-semibold 
                               hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
