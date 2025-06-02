import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  size: string;
  inStock: boolean;
  image: string;
  notes: string[];
  rating?: number;
  reviews?: Review[];
  createdAt?: string;
}

export interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;
  addReview: (productId: number, review: Omit<Review, 'id'>) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial demo products
const initialProducts: Product[] = [
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
    inStock: true,
    rating: 4.9,
    reviews: [
      {
        id: 1,
        userId: "user1",
        userName: "Sarah Johnson",
        rating: 5,
        comment: "Absolutely love this fragrance! It's sophisticated and long-lasting.",
        date: "2024-01-10"
      },
      {
        id: 2,
        userId: "user2",
        userName: "Michael Chen",
        rating: 4,
        comment: "Great scent, very unique. Gets compliments every time I wear it.",
        date: "2024-01-08"
      }
    ],
    createdAt: "2024-01-01"
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
    inStock: true,
    rating: 4.8,
    reviews: [
      {
        id: 3,
        userId: "user3",
        userName: "Emma Williams",
        rating: 5,
        comment: "This is my signature scent now! So elegant and feminine.",
        date: "2024-01-12"
      }
    ],
    createdAt: "2024-01-01"
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
    inStock: true,
    rating: 4.9,
    reviews: [],
    createdAt: "2024-01-01"
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
    inStock: true,
    rating: 5.0,
    reviews: [],
    createdAt: "2024-01-01"
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
    inStock: true,
    rating: 4.7,
    reviews: [],
    createdAt: "2024-01-01"
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
    inStock: false,
    rating: 4.8,
    reviews: [],
    createdAt: "2024-01-01"
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // If no saved products, use initial products
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProduct = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const addReview = (productId: number, review: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now()
    };

    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedReviews = [...(product.reviews || []), newReview];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        
        return {
          ...product,
          reviews: updatedReviews,
          rating: Math.round(avgRating * 10) / 10 // Round to 1 decimal place
        };
      }
      return product;
    }));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        addReview
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 