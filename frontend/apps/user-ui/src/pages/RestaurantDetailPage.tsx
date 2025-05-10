import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, ChevronRight, ArrowLeft, X, Info } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { restaurantService } from '../services/restaurantService';
import { Restaurant, MenuCategory, MenuItem } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplacingCart, setIsReplacingCart] = useState(false);
  
  const { addItem, cart, clearCart } = useCartStore();
  
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const menuData = await restaurantService.getMenuByRestaurantId(id);
        
        if (menuData) {
          setRestaurant(menuData.restaurant);
          setMenuCategories(menuData.categories);
          
          // Set the first category as active
          if (menuData.categories.length > 0) {
            setActiveCategory(menuData.categories[0].name);
          }
        } else {
          setError('Restaurant not found');
        }
      } catch (err) {
        setError('Failed to load restaurant data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantAndMenu();
  }, [id]);
  
  // Scroll to category when active category changes
  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      categoryRefs.current[activeCategory]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [activeCategory]);
  
  // Handle adding item to cart
  const handleAddToCart = async () => {
    if (!restaurant || !selectedItem) return;
    
    try {
      // If cart has items from another restaurant, confirm replacement
      if (cart.restaurantId && cart.restaurantId !== restaurant.id && cart.items.length > 0) {
        setIsReplacingCart(true);
        return;
      }
      
      await addItem(
        restaurant.id,
        restaurant.name,
        selectedItem,
        quantity,
        specialInstructions || undefined
      );
      
      // Reset and close modal
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedItem(null);
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add item to cart');
      }
    }
  };
  
  // Handle replacing cart with new restaurant
  const handleReplaceCart = async () => {
    try {
      await clearCart();
      await addItem(
        restaurant!.id,
        restaurant!.name,
        selectedItem!,
        quantity,
        specialInstructions || undefined
      );
      
      // Reset and close modal
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedItem(null);
      setIsModalOpen(false);
      setIsReplacingCart(false);
    } catch (err) {
      setError('Failed to update cart');
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Restaurant not found'}
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 pb-16">
      {/* Restaurant header */}
      <div
        className="h-64 sm:h-80 bg-center bg-cover relative"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <motion.button
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </motion.button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1 fill-current" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{restaurant.deliveryTime} min</span>
              </div>
              
              <div className="font-medium">{restaurant.priceRange}</div>
              
              <div>{restaurant.cuisine.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category navigation */}
          <motion.div
            className="md:w-64 flex-shrink-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
            
            <nav className="space-y-1 sticky top-24">
              {menuCategories.map((category) => (
                <motion.button
                  key={category.name}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category.name
                      ? 'bg-primary-100 text-primary-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    {activeCategory === category.name && (
                      <ChevronRight size={16} className="text-primary-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </nav>
          </motion.div>
          
          {/* Menu items */}
          <motion.div
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {menuCategories.map((category) => (
              <div
                key={category.name}
                className="mb-12"
                ref={(el) => (categoryRefs.current[category.name] = el)}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 sticky top-0 bg-white py-4 z-10">
                  {category.name}
                </h2>
                
                <div className="space-y-6">
                  {category.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-48 sm:h-auto">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          
                          <p className="mt-2 text-gray-600 text-sm">
                            {item.description}
                          </p>
                          
                          <div className="mt-4 flex items-center">
                            {item.isVegetarian && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                                Vegetarian
                              </span>
                            )}
                            
                            {item.isRecommended && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Item detail modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg shadow-xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Item image */}
            <div className="h-56 md:h-64 relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
              
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>
            
            {/* Item details */}
            <div className="p-6">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedItem.name}
                </h3>
                <span className="font-bold text-gray-900">
                  {formatCurrency(selectedItem.price)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">
                {selectedItem.description}
              </p>
              
              {/* Quantity selector */}
              <div className="mb-6">
                <label className="block font-medium text-gray-800 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    className="btn btn-secondary h-10 w-10 p-0 flex items-center justify-center"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-4 font-medium text-lg">{quantity}</span>
                  <button
                    className="btn btn-secondary h-10 w-10 p-0 flex items-center justify-center"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Special instructions */}
              <div className="mb-6">
                <label 
                  htmlFor="instructions" 
                  className="block font-medium text-gray-800 mb-2"
                >
                  Special Instructions (optional)
                </label>
                <textarea
                  id="instructions"
                  className="input h-24 resize-none"
                  placeholder="Any specific preferences or allergies?"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                ></textarea>
              </div>
              
              {/* Action buttons */}
              <button
                className="btn btn-primary w-full py-3"
                onClick={handleAddToCart}
              >
                Add to Cart - {formatCurrency(selectedItem.price * quantity)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Cart replacement confirmation modal */}
      {isReplacingCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl w-full max-w-md shadow-xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-start mb-4">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <Info size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Replace Your Cart?
                </h3>
                <p className="text-gray-600 mb-4">
                  Your cart contains items from a different restaurant. Would you like to clear your current cart and add this item instead?
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="btn btn-secondary flex-1"
                onClick={() => setIsReplacingCart(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={handleReplaceCart}
              >
                Replace Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;