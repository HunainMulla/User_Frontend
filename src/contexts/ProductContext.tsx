import { it } from 'node:test';
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
    name: "Marquez Maximus",
    description: "Unleash your inner strength with Maximus, a bold reinterpretation of the classic aquatic fragrance. Inspired by the timeless elegance of Davidoff Cool Water, Maximus brings a modern twist to a legendary scent — a wave of freshness, confidence, and charisma that lingers long after you leave the room.Crafted for the modern man who conquers every challenge with calm determination, Maximus opens with a surge of crisp marine notes and cool mint, awakening the senses like a brisk ocean breeze. The heart reveals an elegant blend of lavender and neroli, offering a clean, aromatic sophistication. As the scent settles, warm amber and soft musk anchor the composition, leaving a powerful yet smooth trail of masculinity.",
    price: "$120",
    originalPrice: "$150",
    image: '/images/Maximus.png',
    category: "Unisex",
    size: "50ml",
    notes: ["Peppermint", "Amber", "Musk", "Green Notes"],
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
    name: "Marquez Victoria",
    description: "Flirtatious, radiant, and full of life — Victoria captures the essence of confidence wrapped in a floral-fruity sparkle. Inspired by the iconic Bombshell, this fragrance is a celebration of bold femininity and modern charm.From the very first spritz, Victoria opens with an explosion of juicy passionfruit, grapefruit, and fresh berries — vibrant and addictive. At its heart lies a bouquet of peony and orchid, soft yet lively, evoking a playful elegance. The fragrance settles into a warm base of musk and woods, leaving behind a trail that's both sexy and sophisticated.",
    price: "$150",
    originalPrice: "$180",
    image: '/images/Victoria.png',
    category: "Women",
    size: "100ml",
    notes: ["Passionfruit","Grapefruit","Pineapple","Strawberry"],
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
    name: "Marquez Cardinal",
    description: "Mysterious. Regal. Endlessly captivating. The Cardinal is a tribute to timeless strength and sensual depth — a refined recreation of Tom Ford’s Oud Wood, reimagined for those who command attention without ever raising their voice.This majestic scent opens with an aromatic blend of rare spices and precious woods. As it evolves, rich oud rises — smoky, exotic, and deeply seductive — balanced by creamy sandalwood and warm amber. A whisper of vanilla and tonka bean in the base smooths the edges, leaving an impression that is both powerful and polished.",
    price: "$135",
    originalPrice: "$160",
    image: '/images/Cardinal.png',
    category: "Women",
    size: "100ml",
    notes: ["Cardamom","Rosewood","Sichuan Pepper","Vetiver"],
    inStock: true,
    rating: 4.9,
    reviews: [],
    createdAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Marquez Bayard",
    description: "Daring. Mysterious. Irresistibly elegant. Bayard is a sensual homage to the timeless luxury of Black Orchid, redefined with modern refinement and intrigue. Crafted for those who embrace bold sophistication, Bayard is a journey into the dark heart of floral seduction.It begins with an opulent burst of truffle and black plum, layered with citrus and spice that tease the senses. The heart blooms with the richness of black orchid and velvety florals, unveiling a core of depth and allure. As the scent deepens, dark chocolate, patchouli, and creamy vanilla unfold — an intoxicating trail of warmth, mystery, and confidence.",
    price: "$180",
    originalPrice: "$220",
    image: '/images/Bayard.png',
    category: "Men",
    size: "100ml",
    notes: ["Dark Chocolate", "Black Truffle ", "Ylang Ylang","Blackcurrant"],
    inStock: true,
    rating: 5.0,
    reviews: [],
    createdAt: "2024-01-01"
  },
  {
    id: 5,
    name: "Marquez Combo pack",
    description: "Signature Trio Collection\nVictoria • The Cardinal • Bayard\n\nExperience elegance in every form with the Signature Trio Collection — a refined set of three distinct fragrances for every mood and moment.\n\nVictoria – Bright, fruity, and irresistibly feminine. A playful burst of confidence inspired by Bombshell.\nThe Cardinal – Deep, smoky oud wrapped in spice and warmth. Inspired by Oud Wood, it's bold and refined.\nBayard – Darkly luxurious and mysterious. A sensual floral blend inspired by Black Orchid.\n\nWhether gifting or indulging, this trio is your perfect scent wardrobe — elegant, versatile, and unforgettable.",
    price: "$110",
    originalPrice: "$130",
    image: '/images/combo.png',
    category: "Unisex",
    size: "20ml",
    notes: ["Bergamot", "Lemon", "Golden Amber"],
    inStock: true,
    rating: 4.7,
    reviews: [],
    createdAt: "2024-01-01"
  },
  {
    id: 6,
    name: "Marquez Napoleon",
    description: "Victory, vision, and ambition — Napoleon is more than a fragrance; it's a legacy in a bottle. Inspired by the legendary Creed Aventus, this powerful reinterpretation celebrates the fearless spirit of leaders who shape their own destiny.                                                                                        Opening with a bold burst of fresh pineapple and Italian bergamot, Napoleon announces its presence with undeniable charisma. The heart unveils a complex blend of smoky birch and sensual patchouli — a tribute to strength and sophistication. As it settles, the base of oakmoss, musk, and a hint of vanilla leaves an unforgettable impression of refined dominance.  ",
    price: "$165",
    originalPrice: "$190",
    image: '/images/Napolean.png',
    category: "Men",
    size: "100ml",
    notes: ["Pineapple", "Vanilla", "Musk", "Moroccan Jasmine"],
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
    // const savedProducts = localStorage.getItem('products');
    // if (savedProducts) {
    //   setProducts(JSON.parse(savedProducts));
    // } else {
    //   // If no saved products, use initial products
    //   // localStorage.setItem('products', JSON.stringify(initialProducts));
    // }
    setProducts(initialProducts);
  }, []);

  // Save products to localStorage whenever products change
  // useEffect(() => {
    // localStorage.setItem('products', JSON.stringify(products));
  // }, [products]);

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