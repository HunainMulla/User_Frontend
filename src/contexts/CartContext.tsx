import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApiUrl } from '@/config/api';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CartState = {
  items: [],
  total: 0,
  isLoading: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        isLoading: false,
      };
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
      };
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };
    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace('₹', '').replace(/,/g, ''));
    return total + price * item.quantity;
  }, 0);
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Track debounce timers for quantity updates so rapid clicks coalesce
const quantityUpdateTimers: Record<number, ReturnType<typeof setTimeout>> = {};

// API functions
const getAuthToken = () => localStorage.getItem('token');

const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(createApiUrl(`api/cart${url}`), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API call failed');
  }
  
  return response.json();
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isLoggedIn = useSelector((state: any) => state.login.value);

  // Load cart from backend when user logs in
  const loadCart = async () => {
    if (!isLoggedIn) {
      // If not logged in, load from localStorage for guest cart
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: parsedCart });
      } else {
        // Clear cart if no guest cart exists
        dispatch({ type: 'CLEAR_CART' });
      }
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get guest cart before loading user cart
      const guestCartData = localStorage.getItem('guestCart');
      const guestCart = guestCartData ? JSON.parse(guestCartData) : [];
      
      // Load user cart from backend
      const response = await apiCall('/');
      const userCart = response.cart || [];
      
      // Merge guest cart with user cart if guest cart exists
      if (guestCart.length > 0) {
        // Add guest cart items to user cart via API
        for (const guestItem of guestCart) {
          try {
            await apiCall('/add', {
              method: 'POST',
              body: JSON.stringify(guestItem),
            });
          } catch (error) {
            console.error('Failed to add guest item to user cart:', error);
          }
        }
        
        // Clear guest cart after successful merge
        localStorage.removeItem('guestCart');
        
        // Reload cart to get the merged data
        const updatedResponse = await apiCall('/');
        dispatch({ type: 'SET_CART', payload: updatedResponse.cart });
      } else {
        dispatch({ type: 'SET_CART', payload: userCart });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Sync cart when login status changes
  useEffect(() => {
    loadCart();
  }, [isLoggedIn]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    }
  }, [state.items, isLoggedIn]);

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    if (!isLoggedIn) {
      // Add to local state for guest users
      dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
      return;
    }

    try {
      const response = await apiCall('/add', {
        method: 'POST',
        body: JSON.stringify({ ...item, quantity: 1 }),
      });
      dispatch({ type: 'SET_CART', payload: response.cart });
    } catch (error) {
      console.error('Failed to add item:', error);
      // Fallback to local addition
      dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
    }
  };

  const removeItem = async (id: number) => {
    if (!isLoggedIn) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      return;
    }

    try {
      const response = await apiCall(`/remove/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'SET_CART', payload: response.cart });
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Fallback to local removal
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const updateQuantity = (id: number, quantity: number): Promise<void> => {
    // Optimistic UI update for snappy feel
    const optimisticType = quantity <= 0 ? 'REMOVE_ITEM' : 'UPDATE_QUANTITY';
    const optimisticPayload = optimisticType === 'REMOVE_ITEM' ? id : { id, quantity } as any;
    dispatch({ type: optimisticType as any, payload: optimisticPayload });

    // Guests: no server sync needed
    if (!isLoggedIn) return;

    // Debounce server update so burst clicks send only once
    if (quantityUpdateTimers[id]) {
      clearTimeout(quantityUpdateTimers[id]);
    }
    quantityUpdateTimers[id] = setTimeout(async () => {
      try {
        await apiCall('/update', {
          method: 'PUT',
          body: JSON.stringify({ id, quantity }),
        });
        // No need to overwrite state; optimistic state already up-to-date
      } catch (error) {
        console.error('Failed to update quantity:', error);
        // Fetch server state to correct if needed
        try {
          const fallback = await apiCall('/');
          dispatch({ type: 'SET_CART', payload: fallback.cart });
        } catch (e) {
          console.error('Also failed to fetch cart:', e);
        }
      }
    }, 300);

    return Promise.resolve();
  };

  const clearCart = async () => {
    if (!isLoggedIn) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    try {
      await apiCall('/clear', {
        method: 'DELETE',
      });
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Fallback to local clear
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 