import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatCurrency';

const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isOpen, 
    closeCart, 
    fetchCart, 
    updateItem, 
    removeItem, 
    loading 
  } = useCartStore();
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  
  // Drawer animation variants
  const drawerVariants = {
    hidden: { 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3
      }
    },
    visible: { 
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3
      }
    },
    exit: { 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3
      }
    }
  };
  
  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    }),
    removed: {
      opacity: 0,
      x: 100,
      height: 0,
      margin: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItem(itemId, newQuantity);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="text-primary-500 mr-2" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                {cart.items.length > 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {cart.items.reduce((total, item) => total + item.quantity, 0)} items
                  </span>
                )}
              </div>
              <motion.button
                onClick={closeCart}
                className="text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            {/* Cart content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add items from a restaurant to get started</p>
                  <motion.button
                    className="btn btn-primary"
                    onClick={closeCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Restaurants
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Restaurant name */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order from:
                    </h3>
                    <p className="text-primary-500 font-medium">
                      {cart.restaurantName}
                    </p>
                  </div>
                  
                  {/* Items list */}
                  <ul className="space-y-4">
                    <AnimatePresence>
                      {cart.items.map((item, index) => (
                        <motion.li
                          key={item.id}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="removed"
                          className="flex py-4 border-b border-gray-100 last:border-0"
                        >
                          {/* Item image */}
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          {/* Item details */}
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-base font-medium text-gray-900">
                                {item.menuItem.name}
                              </h4>
                              <span className="text-gray-900 font-medium">
                                {formatCurrency(item.menuItem.price * item.quantity)}
                              </span>
                            </div>
                            
                            <p className="text-gray-500 text-sm mt-1">
                              {formatCurrency(item.menuItem.price)} each
                            </p>
                            
                            {/* Quantity controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <motion.button
                                  className="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  whileHover={{ backgroundColor: '#f3f4f6' }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={loading}
                                >
                                  <Minus size={16} />
                                </motion.button>
                                
                                <span className="px-4 py-1 font-medium">
                                  {item.quantity}
                                </span>
                                
                                <motion.button
                                  className="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  whileHover={{ backgroundColor: '#f3f4f6' }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={loading}
                                >
                                  <Plus size={16} />
                                </motion.button>
                              </div>
                              
                              <motion.button
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => handleRemoveItem(item.id)}
                                whileHover={{ scale: 1.1, color: '#ef4444' }}
                                whileTap={{ scale: 0.9 }}
                                disabled={loading}
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </>
              )}
            </div>
            
            {/* Footer with totals and checkout button */}
            {cart.items.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatCurrency(cart.tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(cart.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatCurrency(cart.total)}</span>
                  </div>
                </div>
                
                <motion.button
                  className="btn btn-primary w-full py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;