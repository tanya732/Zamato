import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronDown, ShoppingBag, MapPin, Phone, User } from 'lucide-react';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customerId: '1',
    customerName: 'John Doe',
    customerPhone: '(555) 123-4567',
    customerAddress: '123 Main St, Anytown, CA 12345',
    items: [
      { menuItemId: 'p1', menuItemName: 'Margherita Pizza', quantity: 2, price: 12.99 },
      { menuItemId: 's1', menuItemName: 'Garlic Bread', quantity: 1, price: 5.99 }
    ],
    subtotal: 31.97,
    tax: 2.56,
    deliveryFee: 2.99,
    total: 37.52,
    status: 'pending',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
  },
  {
    id: 'ORD-002',
    customerId: '2',
    customerName: 'Jane Smith',
    customerPhone: '(555) 987-6543',
    customerAddress: '456 Oak Ave, Somewhere, CA 67890',
    items: [
      { menuItemId: 'p3', menuItemName: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
      { menuItemId: 'p4', menuItemName: 'Vegetarian Pizza', quantity: 1, price: 13.99 },
      { menuItemId: 'b1', menuItemName: 'Soda', quantity: 2, price: 2.99 }
    ],
    subtotal: 34.96,
    tax: 2.80,
    deliveryFee: 2.99,
    total: 40.75,
    status: 'accepted',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString() // 45 minutes ago
  },
  {
    id: 'ORD-003',
    customerId: '3',
    customerName: 'Robert Johnson',
    customerPhone: '(555) 555-5555',
    customerAddress: '789 Pine St, Nowhere, CA 54321',
    items: [
      { menuItemId: 'p5', menuItemName: 'Hawaiian Pizza', quantity: 1, price: 15.99 },
      { menuItemId: 's2', menuItemName: 'Mozzarella Sticks', quantity: 1, price: 7.99 }
    ],
    subtotal: 23.98,
    tax: 1.92,
    deliveryFee: 2.99,
    total: 28.89,
    status: 'preparing',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString() // 1 hour ago
  },
  {
    id: 'ORD-004',
    customerId: '4',
    customerName: 'Emily Williams',
    customerPhone: '(555) 111-2222',
    customerAddress: '321 Cedar Rd, Anywhere, CA 98765',
    items: [
      { menuItemId: 'p6', menuItemName: "Meat Lover's Pizza", quantity: 1, price: 17.99 },
      { menuItemId: 's3', menuItemName: 'Chicken Wings', quantity: 1, price: 9.99 },
      { menuItemId: 'b2', menuItemName: 'Bottled Water', quantity: 1, price: 1.99 }
    ],
    subtotal: 29.97,
    tax: 2.40,
    deliveryFee: 2.99,
    total: 35.36,
    status: 'ready',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString() // 2 hours ago
  },
  {
    id: 'ORD-005',
    customerId: '5',
    customerName: 'Michael Brown',
    customerPhone: '(555) 333-4444',
    customerAddress: '654 Maple Ln, Somewhere, CA 13579',
    items: [
      { menuItemId: 'p1', menuItemName: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { menuItemId: 'p3', menuItemName: 'Pepperoni Pizza', quantity: 1, price: 14.99 }
    ],
    subtotal: 27.98,
    tax: 2.24,
    deliveryFee: 2.99,
    total: 33.21,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString() // 3 hours ago
  }
];

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'pending') {
      return order.status === 'pending';
    } else if (activeTab === 'active') {
      return ['accepted', 'preparing', 'ready', 'out_for_delivery'].includes(order.status);
    } else if (activeTab === 'completed') {
      return order.status === 'delivered';
    } else if (activeTab === 'cancelled') {
      return order.status === 'cancelled';
    }
    return true;
  });
  
  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return 'Out for Delivery';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header section */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Orders
          </h1>
          <p className="text-gray-600">
            Manage and track all your incoming orders.
          </p>
        </motion.div>
        
        {/* Tabs */}
        <motion.div variants={itemVariants} className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              className={`pb-4 text-base font-medium ${
                activeTab === 'pending'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`pb-4 text-base font-medium ${
                activeTab === 'active'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`pb-4 text-base font-medium ${
                activeTab === 'completed'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button
              className={`pb-4 text-base font-medium ${
                activeTab === 'cancelled'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </motion.div>
        
        {/* Orders list */}
        <motion.div variants={itemVariants} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                There are no {activeTab} orders at the moment.
              </p>
            </div>
          ) : (
            <>
              {filteredOrders.map(order => (
                <motion.div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                  layout
                >
                  {/* Order header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full p-3 mr-4">
                          <ShoppingBag size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900 mr-3">
                              {order.id}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(order.status)}`}>
                              {formatStatus(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>{formatDate(order.createdAt)}</span>
                            <span className="mx-2">•</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <motion.div
                          animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={20} className="text-gray-500" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order details */}
                  {expandedOrder === order.id && (
                    <motion.div
                      variants={detailsVariants}
                      initial="hidden"
                      animate="visible"
                      className="px-6 pb-6 border-t border-gray-100 pt-4"
                    >
                      {/* Customer info */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Customer Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start mb-3">
                            <User size={16} className="text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.customerName}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start mb-3">
                            <Phone size={16} className="text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.customerPhone}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin size={16} className="text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.customerAddress}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Order Items
                        </h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="min-w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Item
                                </th>
                                <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Qty
                                </th>
                                <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    {item.menuItemName}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900 text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                    ${item.price.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Order summary */}
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
                        {/* Order totals */}
                        <div className="sm:w-64">
                          <h4 className="text-sm font-medium text-gray-500 mb-3">
                            Order Summary
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Tax</span>
                              <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Delivery Fee</span>
                              <span className="text-gray-900">${order.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1 font-medium border-t border-gray-200 mt-1 pt-2">
                              <span className="text-gray-900">Total</span>
                              <span className="text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order actions */}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-500 mb-3">
                            Actions
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {order.status === 'pending' && (
                              <>
                                <button className="btn btn-primary py-2">
                                  Accept Order
                                </button>
                                <button className="btn bg-red-100 hover:bg-red-200 text-red-700 border-none py-2">
                                  Decline
                                </button>
                              </>
                            )}
                            
                            {order.status === 'accepted' && (
                              <button className="btn btn-primary py-2">
                                Start Preparing
                              </button>
                            )}
                            
                            {order.status === 'preparing' && (
                              <button className="btn btn-primary py-2">
                                Mark as Ready
                              </button>
                            )}
                            
                            {order.status === 'ready' && (
                              <button className="btn btn-primary py-2">
                                Out for Delivery
                              </button>
                            )}
                            
                            {order.status === 'out_for_delivery' && (
                              <button className="btn btn-primary py-2">
                                Mark as Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrdersPage;