import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Users, Clock, Package } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useProducts, Product, Review } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, addReview } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<{ volume: string; price: string } | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    userName: ''
  });

  useEffect(() => {
    if (id) {
      const foundProduct = getProduct(parseInt(id));
      setProduct(foundProduct || null);
    }
  }, [id, getProduct]);

  // Initialize selected size whenever product changes
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        // fallback to legacy single-size fields
        setSelectedSize({ volume: product.size ?? '', price: product.price });
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gold-400 mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')} className="bg-gold-500 hover:bg-gold-600 text-black">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock || !selectedSize) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: `${product.name} (${selectedSize.volume})`,
        price: selectedSize.price,
        image: product.image
      });
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewData.userName.trim() || !reviewData.comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and review comment.",
        variant: "destructive",
      });
      return;
    }

    addReview(product.id, {
      userId: `user_${Date.now()}`,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Review Submitted! 🌟",
      description: "Thank you for your feedback!",
    });

    setReviewData({
      rating: 5,
      comment: '',
      userName: ''
    });

    // Refresh product data
    const updatedProduct = getProduct(product.id);
    setProduct(updatedProduct || null);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-400'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive && onRatingChange ? () => onRatingChange(i) : undefined}
        />
      );
    }
    
    return stars;
  };

  const calculateDiscount = () => {
    if (!product.originalPrice || !selectedSize) return 0;
    const original = parseFloat(product.originalPrice.replace('$', ''));
    const current = parseFloat(selectedSize.price.replace('$', ''));
    return Math.round((1 - current / original) * 100);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-6 pt-4">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-gold-400 hover:text-gold-300 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Shop
          </button>
        </div>

        {/* Product Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="flex justify-center mb-8 animate-float max-h-72">
                  {product.image.startsWith('/') ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-9xl';
                        fallback.textContent = '🛍️';
                        target.parentNode?.insertBefore(fallback, target);
                      }}
                    />
                  ) : (
                    <div className="text-9xl">{product.image}</div>
                  )}
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="flex items-center space-x-4">
                <span className="bg-gold-600/20 text-gold-300 px-4 py-2 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm">
                  {selectedSize?.volume}
                </span>
                {calculateDiscount() > 0 && (
                  <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium">
                    Save {calculateDiscount()}%
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-gold-400 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-lg text-gray-300">
                    {product.rating} ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="font-serif text-md text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center space-x-2">
                  <label htmlFor="size" className="text-gray-300">Size:</label>
                  <select
                    id="size"
                    value={selectedSize?.volume}
                    onChange={e => {
                      const sel = product.sizes?.find(s => s.volume === e.target.value);
                      if (sel) setSelectedSize(sel);
                    }}
                    className="bg-gray-800 border border-gold-600/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400"
                  >
                    {product.sizes.map(s => (
                      <option key={s.volume} value={s.volume}>{s.volume} - {s.price}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pricing */}
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gold-400">
                  {selectedSize?.price}
                </span>
                {product.originalPrice && product.originalPrice !== product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <Package size={20} className={product.inStock ? 'text-green-400' : 'text-red-400'} />
                <span className={`font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              {product.inStock && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-300">Qty:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="bg-gray-800 border border-gold-600/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-semibold py-4 text-lg"
                  >
                    <ShoppingCart className="mr-2" size={20} />
                    Add to Cart - {(selectedSize ? (parseFloat(selectedSize.price.replace('$',''))*quantity).toFixed(2) : '')}
                  </Button>
                </div>
              )}

              {/* Fragrance Notes */}
              {product.notes && product.notes.length > 0 && (
                <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gold-300 mb-4">Fragrance Notes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.notes.map((note, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 border border-gold-600/20 text-gold-300 px-3 py-2 rounded-full text-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="container mx-auto px-6 py-8 border-t border-gray-800">
          <div className="flex space-x-8 mb-8">
            {['details', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-gold-400 border-gold-400'
                    : 'text-gray-400 border-transparent hover:text-gold-300'
                }`}
              >
                {tab === 'details' ? 'Product Details' : `Reviews (${product.reviews?.length || 0})`}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  Product Information
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-gold-300">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-gold-300">{product.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className={product.inStock ? 'text-green-400' : 'text-red-400'}>
                      {product.inStock ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                  {product.createdAt && (
                    <div className="flex justify-between">
                      <span>Added:</span>
                      <span className="text-gold-300">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Why Choose This Fragrance?
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    Premium quality ingredients
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    Long-lasting fragrance (8-12 hours)
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    Luxury packaging
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    Perfect for special occasions
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Add Review Form */}
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gold-300 mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <Input
                        value={reviewData.userName}
                        onChange={(e) => setReviewData(prev => ({ ...prev, userName: e.target.value }))}
                        placeholder="Enter your name"
                        className="bg-gray-800 border-gold-600/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rating *
                      </label>
                      <div className="flex items-center space-x-1">
                        {renderStars(reviewData.rating, true, (rating) => 
                          setReviewData(prev => ({ ...prev, rating }))
                        )}
                        <span className="ml-2 text-gray-300">({reviewData.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Review *
                    </label>
                    <Textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this fragrance..."
                      rows={4}
                      className="bg-gray-800 border-gold-600/20 text-white"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black">
                    Submit Review
                  </Button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gold-300">{review.userName}</h4>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💭</div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews yet</h3>
                    <p className="text-gray-500">Be the first to review this fragrance!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 