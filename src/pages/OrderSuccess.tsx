import React from 'react';
import { Navigation } from '@/components/Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Download, Home } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  // If no order data, redirect to shop
  React.useEffect(() => {
    if (!orderData) {
      navigate('/shop');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const { order, paymentIntentId } = orderData;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-green-500/20 p-4 rounded-full">
                  <CheckCircle className="text-green-500" size={48} />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">
                Order Confirmed!
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
              <p className="text-gray-400">
                Order ID: <span className="text-gold-400 font-mono">{order.id}</span>
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gold-400 mb-6 flex items-center">
                <Package className="mr-2" size={24} />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item: any) => (
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
                        <div className="text-3xl">{item.image}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-lg">{item.name}</h3>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-gold-400 font-semibold text-lg">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-gold-600/20">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white">
                    {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-semibold pt-3 border-t border-gold-600/20">
                  <span className="text-gold-400">Total Paid:</span>
                  <span className="text-gold-400">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {order.shippingAddress && (
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gold-400 mb-4">Shipping Address</h3>
                <div className="text-gray-300">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address.line1}</p>
                  {order.shippingAddress.address.line2 && <p>{order.shippingAddress.address.line2}</p>}
                  <p>
                    {order.shippingAddress.address.city}, {order.shippingAddress.address.state}{' '}
                    {order.shippingAddress.address.postal_code}
                  </p>
                  <p>{order.shippingAddress.address.country}</p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gold-400 mb-4">What's Next?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  You'll receive a confirmation email shortly with your order details
                </li>
                <li className="flex items-center">
                  <Package className="text-gold-400 mr-3 flex-shrink-0" size={20} />
                  Your order will be processed and shipped within 2-3 business days
                </li>
                <li className="flex items-center">
                  <Download className="text-blue-400 mr-3 flex-shrink-0" size={20} />
                  Track your order status in your account dashboard
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="flex items-center justify-center bg-gradient-to-r from-gold-500 to-gold-600 
                         text-black px-8 py-3 rounded-lg font-semibold hover:from-gold-400 hover:to-gold-500 
                         transition-all duration-300 transform hover:scale-105"
              >
                <Home className="mr-2" size={20} />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center justify-center border-2 border-gold-500 text-gold-400 
                         px-8 py-3 rounded-lg font-semibold hover:bg-gold-500 hover:text-black 
                         transition-all duration-300 transform hover:scale-105"
              >
                <Package className="mr-2" size={20} />
                View All Orders
              </button>
            </div>

            {/* Support */}
            <div className="text-center mt-12 p-6 bg-gray-900/30 rounded-lg">
              <p className="text-gray-400 mb-2">Need help with your order?</p>
              <p className="text-gold-400">Contact our customer support team</p>
              <p className="text-gray-500 text-sm mt-2">support@goldenmarquez.com | 1-800-PERFUME</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 