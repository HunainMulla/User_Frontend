import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

export const ProductShowcase = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Debug: Log the first product's image path
  React.useEffect(() => {
    if (products.length > 0) {
      console.log('First product image path:', products[0].image);
      console.log('Full path:', new URL(products[0].image, window.location.origin).href);
    }
  }, [products]);
  
  // Show first 6 products for homepage showcase
  const featuredProducts = products.slice(0, 6);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewCollection = () => {
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    if (!product.inStock) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
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
          {featuredProducts.map((product, index) => (
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
                        // Fallback to emoji if image fails to load
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
                
                <div className="mb-4">
                  <span className="inline-block bg-gold-600/20 text-gold-300 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gold-300 mb-2 group-hover:text-gold-200 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-400">
                      ({product.rating}) • {product.reviews?.length || 0} reviews
                    </span>
                  </div>
                )}
                
                <p className="text-gray-400 mb-3 text-xs leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl font-bold text-gold-400">
                      {product.price}
                    </span>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                        <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-medium">
                          Save {Math.round((1 - parseFloat(product.price.replace('$', '')) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.inStock ? (
                    <span className="text-green-400 text-sm">✓ In Stock</span>
                  ) : (
                    <span className="text-red-400 text-sm">✗ Out of Stock</span>
                  )}
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.inStock}
                  className="bg-transparent border-2 border-gold-500 text-gold-400 px-6 py-3 
                           hover:bg-gold-500 hover:text-black transition-all duration-300
                           transform hover:scale-105 w-full font-semibold relative overflow-hidden group
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent 
                           disabled:hover:text-gold-400 disabled:hover:scale-100"
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

        <div className="text-center mt-16">
          <button 
            onClick={handleViewCollection}
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
