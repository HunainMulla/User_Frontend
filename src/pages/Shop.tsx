import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { ArrowRight, Search, Star } from 'lucide-react';

const Shop = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();
  const isLoggedIn = useSelector((state: any) => state.login.value);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.notes.some(note => note.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') {
      return parseInt(a.price.slice(1)) - parseInt(b.price.slice(1));
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return a.name.localeCompare(b.name);
  });

  const handleAddToCart = (product: typeof products[0]) => {
    if (!product.inStock) return;
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />);
    }

    return stars;
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

          {/* Search and Filters */}
          <div className="flex flex-col space-y-6 mb-12">
            {/* Search Bar */}
            <div className="max-w-md mx-auto w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or notes..."
                  className="w-full bg-gray-900/50 border border-gold-600/20 rounded-lg px-4 py-3 pl-12
                           text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                           transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-gold-500 text-black font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex justify-center mb-8">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 text-sm rounded-lg border border-gold-600/20 
                         focus:outline-none focus:border-gold-400"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-center mb-6">
              <p className="text-gray-400">
                {sortedProducts.length === 0 
                  ? 'No products found' 
                  : `Showing ${sortedProducts.length} product${sortedProducts.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {sortedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="group bg-gray-900/50 backdrop-blur-sm border border-gold-600/20 rounded-lg p-4 
                           hover:border-gold-400/50 transition-all duration-500 transform hover:scale-105
                           hover:shadow-2xl hover:shadow-gold-500/20 animate-slide-up cursor-pointer"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="text-center">
                    <div className="h-28 flex items-center justify-center mb-2 transform group-hover:scale-105 transition-transform duration-300">
                      {product.image.startsWith('/') ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="max-h-24 max-w-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'text-6xl';
                            fallback.textContent = '🛍️';
                            target.parentNode?.insertBefore(fallback, target);
                          }}
                        />
                      ) : (
                        <div className="text-6xl">{product.image}</div>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-block bg-gold-600/20 text-gold-300 px-2 py-1 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gold-300 mb-1 group-hover:text-gold-200 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2 h-10">
                      {product.description}
                    </p>

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center justify-center mb-2">
                        <div className="flex items-center mr-2">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-400">
                          ({product.rating}) • {product.reviews?.length || 0} reviews
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg font-bold text-gold-400">
                          {product.price}
                        </span>
                        {product.originalPrice && product.originalPrice !== product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!product.inStock}
                      className="bg-transparent border-2 border-gold-500 text-gold-400 px-4 py-2 
                               hover:bg-gold-500 hover:text-black transition-all duration-300
                               transform hover:scale-105 w-full font-semibold relative overflow-hidden group
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent 
                               disabled:hover:text-gold-400 disabled:hover:scale-100 text-sm"
                    >
                      <span className="relative z-10">
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
            <div className="text-center mt-16 w-full">
              <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-lg p-8">
                <h3 className="text-3xl font-bold text-gold-400 mb-4">Can't Find What You're Looking For?</h3>
                <p className="text-gray-300 mb-6">Contact our fragrance experts for personalized recommendations</p>
                <button 
                  className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-3 font-semibold
                           hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
