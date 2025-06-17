import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Search, Filter, Eye, Download, Calendar, Package, User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import { createApiUrl } from '@/config/api';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size?: string; // bottle volume like 20ml / 50ml / 100ml
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  status: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  items: OrderItem[];
  paymentStatus: string;
  shippingAddress?: any;
  billingAddress?: any;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
}

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  thisMonthOrders: number;
}

const UserOrders = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: any) => state.login.value);
  const { isAdmin, verifyAdminWithServer } = useAdmin();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminVerifying, setAdminVerifying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses = ['All', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Verify admin status and redirect if needed
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isLoggedIn) {
        navigate('/login');
        return;
      }
      
      // Verify admin status with server
      const isVerifiedAdmin = await verifyAdminWithServer();
      setAdminVerifying(false);
      
      if (!isVerifiedAdmin) {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        return;
      }
      
      // If we reach here, user is verified admin
      fetchOrders();
      fetchStats();
    };

    checkAdminAccess();
  }, [isLoggedIn, navigate, verifyAdminWithServer]);

  const fetchOrders = async () => {
    try {
      console.log('Admin fetching all orders...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found when fetching orders');
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(createApiUrl('api/orders/admin/all-orders'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Fetch orders response status:', response.status);
      const data = await response.json();
      console.log('Fetch orders response data:', data);
      
      if (data.success) {
        console.log(`Successfully fetched ${data.orders.length} orders`);
        if (data.orders.length > 0) {
          console.log('Sample order statuses:', data.orders.slice(0, 3).map(o => ({id: o.id.slice(-8), status: o.status})));
        }
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch orders",
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

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl('api/orders/admin/stats'), {
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log(`Admin attempting to update order ${orderId} to status: ${newStatus}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication Error",
          description: "Please log in again to update order status",
          variant: "destructive",
        });
        return;
      }

      console.log('Sending PUT request to update order status...');
      const response = await fetch(createApiUrl(`api/orders/admin/update-status/${orderId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log(`Order ${orderId} status successfully updated to ${newStatus} in database`);
        
        // Update the order in the local state
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          );
          console.log('Updated local orders state:', updatedOrders.find(o => o.id === orderId));
          return updatedOrders;
        });
        
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder.id === orderId) {
          const updatedSelectedOrder = { ...selectedOrder, status: newStatus };
          setSelectedOrder(updatedSelectedOrder);
          console.log('Updated selected order:', updatedSelectedOrder);
        }
        
        toast({
          title: "Status Updated Successfully! ✅",
          description: `Order status changed to "${newStatus.toUpperCase()}". Customer will see this change immediately.`,
        });
        
        console.log('Status update process completed successfully');
      } else {
        console.error('Server responded with failure:', data);
        toast({
          title: "Error",
          description: data.message || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Show loading state while verifying admin status
  if (adminVerifying || loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {adminVerifying ? 'Verifying admin access...' : 'Loading orders...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-6 lg:space-y-0">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">User Orders</h1>
              <p className="text-gray-300">Manage and track all customer orders</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => {
                  console.log('Admin refreshing orders...');
                  fetchOrders();
                  fetchStats();
                }}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300 whitespace-nowrap"
              >
                <span>🔄</span>
                <span>Refresh Orders</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-400 transition-all duration-300 whitespace-nowrap">
                <Download size={16} />
                <span>Export Orders</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                  </div>
                  <Package className="text-gold-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Customers</p>
                    <p className="text-2xl font-bold text-white">{stats.activeCustomers}</p>
                  </div>
                  <User className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">This Month</p>
                    <p className="text-2xl font-bold text-white">{stats.thisMonthOrders}</p>
                  </div>
                  <Calendar className="text-purple-400" size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order ID, customer name, or email..."
                  className="w-full bg-gray-900/50 border border-gold-600/20 rounded-lg px-4 py-3 pl-12
                           text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                           transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="flex space-x-3 overflow-x-auto">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 capitalize ${
                    statusFilter === status
                      ? 'bg-gold-500 text-black font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-gray-900/30 border border-gold-600/20 rounded-lg overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Orders Found</h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'All' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No orders have been placed yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-semibold">Order ID</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Customer</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Total</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={order.id} className={`border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200`}>
                        <td className="p-4">
                          <span className="font-semibold text-gold-400">{order.id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">{order.userName}</p>
                            <p className="text-sm text-gray-400">{order.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-white">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center space-x-1 text-gold-400 hover:text-gold-300 transition-colors duration-200"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gold-600/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gold-400">Order Details - {selectedOrder.id.slice(-8).toUpperCase()}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Name:</span> <span className="text-white">{selectedOrder.userName}</span></p>
                    <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedOrder.userEmail}</span></p>
                    <p><span className="text-gray-400">User ID:</span> <span className="text-white">{selectedOrder.userId}</span></p>
                    {selectedOrder.shippingAddress?.phone && (
                      <p><span className="text-gray-400">Phone:</span> <span className="text-white">{selectedOrder.shippingAddress.phone}</span></p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Order Date:</span> <span className="text-white">{new Date(selectedOrder.date).toLocaleDateString()}</span></p>
                    <p><span className="text-gray-400">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                    <p><span className="text-gray-400">Total:</span> <span className="text-white font-semibold">${selectedOrder.total.toFixed(2)}</span></p>
                    {selectedOrder.paymentStatus && <p><span className="text-gray-400">Payment:</span> <span className="text-green-400">{selectedOrder.paymentStatus}</span></p>}
                  </div>
                </div>
              </div>

              {/* Shipping and Billing Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                  {selectedOrder.shippingAddress ? (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="space-y-1 text-sm">
                        {selectedOrder.shippingAddress.name && (
                          <p className="font-medium text-white">{selectedOrder.shippingAddress.name}</p>
                        )}
                        {selectedOrder.shippingAddress.address && (
                          <>
                            <p className="text-gray-300">{selectedOrder.shippingAddress.address.line1}</p>
                            {selectedOrder.shippingAddress.address.line2 && (
                              <p className="text-gray-300">{selectedOrder.shippingAddress.address.line2}</p>
                            )}
                            <p className="text-gray-300">
                              {selectedOrder.shippingAddress.address.city}, {selectedOrder.shippingAddress.address.state} {selectedOrder.shippingAddress.address.postal_code}
                            </p>
                            <p className="text-gray-300">{selectedOrder.shippingAddress.address.country}</p>
                          </>
                        )}
                        {selectedOrder.shippingAddress.phone && (
                          <p className="text-gold-400 font-medium">📞 {selectedOrder.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">No shipping address available</p>
                    </div>
                  )}
                </div>

                {/* Billing Address */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Billing Address</h3>
                  {selectedOrder.billingAddress ? (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="space-y-1 text-sm">
                        {selectedOrder.billingAddress.name && (
                          <p className="font-medium text-white">{selectedOrder.billingAddress.name}</p>
                        )}
                        {selectedOrder.billingAddress.address && (
                          <>
                            <p className="text-gray-300">{selectedOrder.billingAddress.address.line1}</p>
                            {selectedOrder.billingAddress.address.line2 && (
                              <p className="text-gray-300">{selectedOrder.billingAddress.address.line2}</p>
                            )}
                            <p className="text-gray-300">
                              {selectedOrder.billingAddress.address.city}, {selectedOrder.billingAddress.address.state} {selectedOrder.billingAddress.address.postal_code}
                            </p>
                            <p className="text-gray-300">{selectedOrder.billingAddress.address.country}</p>
                          </>
                        )}
                        {selectedOrder.billingAddress.phone && (
                          <p className="text-gold-400 font-medium">📞 {selectedOrder.billingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Same as shipping address</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          {item.size && (
                            <p className="text-sm text-gray-400">Size: {item.size}</p>
                          )}
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-white">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Update Status</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Status changes will be immediately visible to the customer.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 capitalize border ${
                        selectedOrder.status === status
                          ? 'bg-gold-500 text-black font-semibold border-gold-500'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                      }`}
                    >
                      {status === 'confirmed' && '✅'} 
                      {status === 'processing' && '🔄'} 
                      {status === 'shipped' && '🚚'} 
                      {status === 'delivered' && '📦'} 
                      {status === 'cancelled' && '❌'} 
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders; 