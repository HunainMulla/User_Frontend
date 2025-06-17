import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Navigation } from '@/components/Navigation';
import { CheckoutForm } from '@/components/CheckoutForm';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Package, Truck, CreditCard } from 'lucide-react';
import stripePromise from '@/lib/stripe';
import { createApiUrl } from '@/config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const isLoggedIn = useSelector((state: any) => state.login.value);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (cartState.items.length === 0) {
      navigate('/shop');
      return;
    }
  }, [isLoggedIn, cartState.items.length, navigate]);

  // Create payment intent when component mounts
  useEffect(() => {
    if (cartState.items.length > 0) {
      createPaymentIntent();
    }
  }, [cartState.items]);

  const createPaymentIntent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl('api/payment/create-payment-intent'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartState.items,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClientSecret(data.clientSecret);
        setOrderSummary({
          subtotal: data.subtotal,
          shipping: data.shipping,
          total: data.amount
        });
      } else {
        console.error('Failed to create payment intent:', data.message);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#D4AF37',
      colorBackground: '#1F2937',
      colorText: '#FFFFFF',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
      fontSize: '16px',
      fontSizeBase: '16px',
      fontSizeSm: '14px',
      spacingGridRow: '20px',
      spacingGridColumn: '20px',
    },
    rules: {
      '.Input': {
        padding: '12px 16px',
        fontSize: '16px',
        lineHeight: '1.5',
        minHeight: '44px',
      },
      '.Input:focus': {
        borderColor: '#D4AF37',
        boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.2)',
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '8px',
      },
      '.Tab': {
        padding: '12px 16px',
        fontSize: '16px',
        minHeight: '44px',
      },
      '.Tab--selected': {
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading || !clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Preparing your checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center text-gray-400 hover:text-gold-400 transition-colors mr-4"
            >
              <ArrowLeft size={20} />
              <span className="ml-2">Back to Shop</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gold-400">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gold-400 mb-6 flex items-center">
                  <Package className="mr-2" size={20} />
                  Order Summary
                </h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gold-600/10">
                      <div className="w-16 h-16 flex items-center justify-center">
                          {item.image && item.image.startsWith('/') ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain rounded"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.onerror = null;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-2xl">{item.image}</div>
                          )}
                        </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-gold-400 font-semibold">
                        ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-gold-600/20">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center">
                      <Truck className="mr-1" size={16} />
                      Shipping:
                    </span>
                    <span className="text-white">
                      {orderSummary.shipping === 0 ? 'FREE' : `$${orderSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gold-600/20">
                    <span className="text-gold-400">Total:</span>
                    <span className="text-gold-400">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-gold-600/10 rounded-lg">
                  <div className="flex items-center text-gold-300 mb-2">
                    <Truck className="mr-2" size={16} />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    On orders over $100. Standard shipping applies to orders under $100.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gold-400 mb-6 flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  Payment Details
                </h2>
                
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm 
                    cartItems={cartState.items}
                    orderSummary={orderSummary}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 