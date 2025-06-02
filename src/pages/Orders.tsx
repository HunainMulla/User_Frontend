import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Truck, 
  Eye, 
  ShoppingBag,
  DollarSign,
  MapPin,
  Clock,
  RefreshCw
} from 'lucide-react';
import { createApiUrl } from '@/config/api';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  paymentStatus: string;
  shippingAddress?: any;
  billingAddress?: any;
  paymentMethod: string;
  stripePaymentIntentId: string;
}

interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  recentOrdersCount: number;
}

const Orders = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: any) => state.login.value);
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoUpdating, setAutoUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
    fetchStats();
    
    // Set up automatic refresh every 10 seconds to check for status updates (reduced from 30s)
    const intervalId = setInterval(() => {
      fetchOrdersQuietly(); // Fetch without showing loading state
    }, 10000); // 10 seconds for faster updates
    
    return () => clearInterval(intervalId);
  }, [isLoggedIn, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl('api/orders/my-orders'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Customer orders fetched:', data.orders);
        setOrders(data.orders);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Silent fetch for automatic updates (doesn't show loading state)
  const fetchOrdersQuietly = async () => {
    setAutoUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl('api/orders/my-orders'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Silent fetch - orders data:', data.orders);
        
        // Check if any order status has changed
        const oldOrders = orders;
        const newOrders = data.orders;
        
        console.log('Comparing orders - Old count:', oldOrders.length, 'New count:', newOrders.length);
        
        // Find status changes
        const statusChanges = newOrders.filter(newOrder => {
          const oldOrder = oldOrders.find(old => old.id === newOrder.id);
          const hasChanged = oldOrder && oldOrder.status !== newOrder.status;
          if (hasChanged) {
            console.log(`Status change detected for order ${newOrder.id}: ${oldOrder.status} -> ${newOrder.status}`);
          }
          return hasChanged;
        });
        
        console.log('Status changes found:', statusChanges.length);
        
        // Show notification for status changes
        statusChanges.forEach(order => {
          const oldStatus = oldOrders.find(old => old.id === order.id)?.status;
          toast({
            title: "Order Status Updated! 🔄",
            description: `Order #${order.id.slice(-8).toUpperCase()} status changed from "${oldStatus}" to "${order.status.toUpperCase()}"`,
          });
        });
        
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders quietly:', error);
    } finally {
      setAutoUpdating(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    await fetchStats();
    setRefreshing(false);
    toast({
      title: "Refreshed Successfully! ✅",
      description: "Order information has been updated from the server",
    });
  };

  // Add a function to force immediate check
  const handleForceCheck = async () => {
    console.log('Force checking order status...');
    await fetchOrdersQuietly();
    toast({
      title: "Manual Check Complete 🔍",
      description: "Checked for order status updates",
    });
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl('api/orders/stats'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'processing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your orders...</p>
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
          {/* Header with Refresh Button */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">My Orders</h1>
              <p className="text-xl text-gray-300">Track and view your order history</p>
              {autoUpdating && (
                <div className="flex items-center justify-center lg:justify-start mt-2 text-sm text-gray-400">
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                  <span>Checking for updates...</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:ml-6">
              <div className="text-center sm:text-right text-xs text-gray-500 order-3 sm:order-1">
                <p>Auto-refresh: 10s</p>
                <p>Last check: {new Date().toLocaleTimeString()}</p>
              </div>
              <button
                onClick={handleForceCheck}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-300 text-sm whitespace-nowrap order-1 sm:order-2"
              >
                <span>🔍</span>
                <span>Force Check</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 whitespace-nowrap order-2 sm:order-3"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Now'}</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-gold-400">{stats.totalOrders}</p>
                  </div>
                  <ShoppingBag className="text-gold-400" size={24} />
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-green-400">${stats.totalSpent.toFixed(2)}</p>
                  </div>
                  <DollarSign className="text-green-400" size={24} />
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Average Order</p>
                    <p className="text-2xl font-bold text-blue-400">${stats.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <Package className="text-blue-400" size={24} />
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Recent Orders</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.recentOrdersCount}</p>
                  </div>
                  <Calendar className="text-purple-400" size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-300 mb-4">No Orders Yet</h3>
              <p className="text-gray-400 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-3 rounded-lg 
                         font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 
                         transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="bg-gold-600/20 p-3 rounded-lg">
                        <Package className="text-gold-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Order #{order.id.slice(-8).toUpperCase()}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="mr-1" size={14} />
                          {formatDate(order.date)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize font-medium text-sm">{order.status}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gold-400">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t border-gold-600/20 pt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-2xl">{item.image}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{item.name}</h4>
                            <p className="text-sm text-gray-400">Qty: {item.quantity} • {item.price}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-800/30 p-3 rounded-lg border-2 border-dashed border-gray-600">
                          <span className="text-gray-400">+{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="flex items-center justify-center bg-transparent border-2 border-gold-500 
                               text-gold-400 px-4 py-2 rounded-lg font-semibold hover:bg-gold-500 
                               hover:text-black transition-all duration-300"
                    >
                      <Eye className="mr-2" size={16} />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => navigate('/shop')}
                      className="flex items-center justify-center bg-gray-700 text-white px-4 py-2 
                               rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                    >
                      <ShoppingBag className="mr-2" size={16} />
                      Reorder Items
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gold-600/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gold-400">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Order ID:</span> <span className="text-white">{selectedOrder.id}</span></p>
                    <p><span className="text-gray-400">Date:</span> <span className="text-white">{formatDate(selectedOrder.date)}</span></p>
                    <p className="flex items-center">
                      <span className="text-gray-400 mr-2">Status:</span> 
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="capitalize">{selectedOrder.status}</span>
                      </span>
                    </p>
                    <p><span className="text-gray-400">Payment:</span> <span className="text-green-400">{selectedOrder.paymentStatus}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-sm text-gray-300">
                      <p>{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.address.line1}</p>
                      {selectedOrder.shippingAddress.address.line2 && <p>{selectedOrder.shippingAddress.address.line2}</p>}
                      <p>{selectedOrder.shippingAddress.address.city}, {selectedOrder.shippingAddress.address.state} {selectedOrder.shippingAddress.address.postal_code}</p>
                      <p>{selectedOrder.shippingAddress.address.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No shipping address available</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Items Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gold-400">{item.price}</p>
                        <p className="text-sm text-gray-400">Each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">Total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">
                      {selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gold-400">Total:</span>
                      <span className="text-gold-400">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 