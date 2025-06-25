import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Package, Truck, CreditCard } from 'lucide-react';
import { createApiUrl } from '@/config/api';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const isLoggedIn = useSelector((state: any) => state.login.value);
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    phone: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN'
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

  // Calculate order summary when cart changes
  useEffect(() => {
    if (cartState.items.length > 0) {
      const subtotal = cartState.items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('₹', '').replace(/,/g, ''));
        return sum + (price * item.quantity);
      }, 0);
      const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000, ₹200 otherwise
      const total = subtotal + shipping;
      
      setOrderSummary({
        subtotal,
        shipping,
        total
      });
    }
  }, [cartState.items]);

  const handleAddressChange = (type: 'shipping' | 'billing', field: string, value: string) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateAddresses = () => {
    const shippingFields = ['name', 'address', 'city', 'state', 'postalCode', 'phone'];
    const billingFields = ['name', 'address', 'city', 'state', 'postalCode'];
    
    const shippingValid = shippingFields.every(field => shippingAddress[field as keyof typeof shippingAddress]?.trim());
    const billingValid = billingFields.every(field => billingAddress[field as keyof typeof billingAddress]?.trim());
    
    return shippingValid && billingValid;
  };

  const handlePayment = async () => {
    if (!validateAddresses()) {
      alert('Please fill in all required address fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create Razorpay order
      const response = await fetch(createApiUrl('api/payment/create-order'), {
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
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_HEvPGKLBmgyZZS', // Replace with your key
        amount: data.amount * 100, // Convert to paise (only multiply by 100 once)
        currency: data.currency,
        name: 'Golden Marquez',
        description: 'Luxury Perfumes',
        order_id: data.orderId,
        // Add payment methods configuration to enable UPI
        method: {
          netbanking: true,
          card: true,
          upi: true, // Enable UPI
          wallet: true,
          emi: true,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              },
              cards: {
                name: "Pay using Credit/Debit Cards",
                instruments: [
                  {
                    method: "card"
                  }
                ]
              },
              netbanking: {
                name: "Pay using Net Banking",
                instruments: [
                  {
                    method: "netbanking"
                  }
                ]
              }
            },
            sequence: ["block.banks", "block.cards", "block.netbanking"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response: any) {
          try {
            // Confirm payment with backend
            const confirmResponse = await fetch(createApiUrl('api/payment/confirm-payment'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                items: cartState.items,
                shippingAddress,
                billingAddress,
                total: data.amount,
                subtotal: data.subtotal,
                shipping: data.shipping
              }),
            });

            const confirmData = await confirmResponse.json();

            if (confirmData.success) {
              // Clear cart after successful payment
              await clearCart();
              
              // Navigate to success page
              navigate('/order-success', { 
                state: { 
                  order: confirmData.order,
                  paymentId: response.razorpay_payment_id 
                } 
              });
            } else {
              throw new Error(confirmData.message || 'Failed to confirm payment');
            }
          } catch (error) {
            console.error('Payment confirmation error:', error);
            alert('Payment succeeded but there was an issue processing your order. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: '', // You can get this from user context
          contact: shippingAddress.phone
        },
        theme: {
          color: '#D4AF37'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-gold-600/20">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">₹{orderSummary.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center">
                      <Truck className="mr-1" size={16} />
                      Shipping:
                    </span>
                    <span className="text-white">
                      {orderSummary.shipping === 0 ? 'FREE' : `₹${orderSummary.shipping.toFixed(0)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gold-600/20">
                    <span className="text-gold-400">Total:</span>
                    <span className="text-gold-400">₹{orderSummary.total.toFixed(0)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-gold-600/10 rounded-lg">
                  <div className="flex items-center text-gold-300 mb-2">
                    <Truck className="mr-2" size={16} />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    On orders over ₹5,000. Standard shipping (₹200) applies to orders under ₹5,000.
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
                
                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gold-300 mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={shippingAddress.name}
                      onChange={(e) => handleAddressChange('shipping', 'name', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address *"
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange('shipping', 'address', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City *"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={shippingAddress.state}
                        onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Postal Code *"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleAddressChange('shipping', 'postalCode', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone *"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('shipping', 'phone', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gold-300 mb-4">Billing Address</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={billingAddress.name}
                      onChange={(e) => handleAddressChange('billing', 'name', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address *"
                      value={billingAddress.address}
                      onChange={(e) => handleAddressChange('billing', 'address', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City *"
                        value={billingAddress.city}
                        onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={billingAddress.state}
                        onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Postal Code *"
                      value={billingAddress.postalCode}
                      onChange={(e) => handleAddressChange('billing', 'postalCode', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading || cartState.items.length === 0}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black py-4 px-6 rounded-lg
                           font-semibold text-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300
                           transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:transform-none flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${orderSummary.total.toFixed(0)}`
                  )}
                </button>

                {/* Payment Methods */}
                <div className="text-center text-sm text-gray-400 mt-4">
                  <p>Secure payment powered by Razorpay</p>
                  <div className="flex justify-center space-x-4 mt-2">
                    <span className="text-gold-400">💳 Credit Cards</span>
                    <span className="text-gold-400">🏦 Net Banking</span>
                    <span className="text-gold-400">📱 UPI</span>
                    <span className="text-gold-400">💳 Debit Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 