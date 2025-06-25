import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { toast } = useToast();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Unisex',
    size: '100ml',
    inStock: true,
    image: '🌟', // Default emoji
    notes: ['']
  });

  const categories = ['Men', 'Women', 'Unisex'];
  const sizes = ['30ml', '50ml', '100ml', '150ml'];

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...productData.notes];
    newNotes[index] = value;
    setProductData(prev => ({
      ...prev,
      notes: newNotes
    }));
  };

  const addNote = () => {
    setProductData(prev => ({
      ...prev,
      notes: [...prev.notes, '']
    }));
  };

  const removeNote = (index: number) => {
    if (productData.notes.length > 1) {
      const newNotes = productData.notes.filter((_, i) => i !== index);
      setProductData(prev => ({
        ...prev,
        notes: newNotes
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Add the product to the global state
    addProduct({
      name: productData.name,
      description: productData.description,
      price: `₹${productData.price}`,
      originalPrice: productData.originalPrice ? `₹${productData.originalPrice}` : `₹${productData.price}`,
      category: productData.category,
      size: productData.size || '100ml',
      inStock: productData.inStock,
      image: productData.image,
      notes: productData.notes.filter(note => note.trim() !== '')
    });

    toast({
      title: "Product Created Successfully! 🎉",
      description: "Your new product has been added to the catalog.",
    });

    // Reset form
    setProductData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'Unisex',
      size: '100ml',
      inStock: true,
      image: '🌟',
      notes: ['']
    });

    // Navigate to shop to see the new product
    setTimeout(() => {
      navigate('/shop');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">Create Product</h1>
              <p className="text-gray-300">Add a new luxury fragrance to the collection</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                               text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                               transition-all duration-300"
                      placeholder="e.g., Midnight Elegance"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={productData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                               text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                               transition-all duration-300 resize-none"
                      placeholder="Describe the fragrance, its inspiration, and key characteristics..."
                      required
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price * (₹)
                      </label>
                      <input
                        type="number"
                        value={productData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                        placeholder="9960"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={productData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                        placeholder="12450"
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-400 mt-1">Leave empty if no discount</p>
                    </div>
                  </div>

                  {/* Category and Size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={productData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                      >
                        {categories.map(category => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Size
                      </label>
                      <select
                        value={productData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                      >
                        {sizes.map(size => (
                          <option key={size} value={size} className="bg-gray-800">
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Product Image/Emoji */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Icon/Emoji
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={productData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className="flex-1 bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                        placeholder="🌟"
                      />
                      <div className="w-16 h-16 bg-gray-800/50 border border-gold-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{productData.image || '🌟'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Use an emoji or icon to represent the product</p>
                  </div>

                  {/* Fragrance Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fragrance Notes
                    </label>
                    <div className="space-y-3">
                      {productData.notes.map((note, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={note}
                            onChange={(e) => handleNoteChange(index, e.target.value)}
                            className="flex-1 bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-2
                                     text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                                     transition-all duration-300"
                            placeholder="e.g., Bergamot, Sandalwood, Vanilla"
                          />
                          {productData.notes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeNote(index)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addNote}
                        className="flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors duration-200"
                      >
                        <Plus size={16} />
                        <span>Add Note</span>
                      </button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stock Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="inStock"
                          checked={productData.inStock}
                          onChange={() => handleInputChange('inStock', true)}
                          className="form-radio bg-gray-800 border-gold-600/20 text-gold-500 focus:ring-gold-500"
                        />
                        <span className="ml-2 text-green-400">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="inStock"
                          checked={!productData.inStock}
                          onChange={() => handleInputChange('inStock', false)}
                          className="form-radio bg-gray-800 border-gold-600/20 text-gold-500 focus:ring-gold-500"
                        />
                        <span className="ml-2 text-red-400">Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  {/* Image Upload Placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Images
                    </label>
                    <div className="border-2 border-dashed border-gold-600/20 rounded-lg p-8 text-center">
                      <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-400 mb-2">Upload product images</p>
                      <button
                        type="button"
                        className="flex items-center space-x-2 mx-auto bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Upload size={16} />
                        <span>Choose Files</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Support: JPG, PNG, WebP (Max: 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black rounded-lg font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300"
                >
                  <Save size={16} />
                  <span>Create Product</span>
                </button>
              </div>
            </form>

            {/* Preview Card */}
            {productData.name && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gold-400 mb-4">Product Preview</h3>
                <div className="bg-gray-900/30 border border-gold-600/20 rounded-lg p-6 max-w-sm">
                  <div className="text-center mb-4">
                    <span className="text-4xl mb-4 block">{productData.image}</span>
                    <h4 className="text-lg font-semibold text-white mb-2">{productData.name}</h4>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{productData.description}</p>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-gold-400">
                        {productData.price}
                      </span>
                      {productData.originalPrice && productData.originalPrice !== productData.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {productData.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                      <span>{productData.category}</span>
                      <span>•</span>
                      <span>{productData.size}</span>
                    </div>
                    {productData.notes.filter(note => note.trim()).length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Notes:</p>
                        <p className="text-xs text-gray-400">
                          {productData.notes.filter(note => note.trim()).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct; 