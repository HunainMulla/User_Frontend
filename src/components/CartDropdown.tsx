import React from 'react';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartDropdown = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeItem(id);
    }
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-gold-400 transition-colors duration-300"
      >
        <ShoppingBag size={24} />
        {state.items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {state.items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gold-600/20 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gold-400">Your Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {state.items.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b border-gold-600/10 pb-4">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {item.image.startsWith('/') ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'text-2xl';
                              fallback.textContent = '🛍️';
                              target.parentNode?.insertBefore(fallback, target);
                            }}
                          />
                        ) : (
                          <div className="text-2xl">{item.image}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-gold-400">{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gold-600/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white">Total:</span>
                    <span className="text-lg font-semibold text-gold-400">
                      ₹{state.total.toFixed(0)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black py-2 px-4 rounded
                             font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300
                             transform hover:scale-105"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 