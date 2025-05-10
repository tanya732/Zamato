import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Check, Image, DollarSign } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import { MenuItem, MenuCategory } from '../types';

const MenuManagerPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Form state
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const { 
    categories,
    menuItems,
    fetchCategories,
    fetchMenuItems,
    selectCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    loading,
    error
  } = useMenuStore();
  
  // Fetch categories and menu items on load
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, [fetchCategories, fetchMenuItems]);
  
  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
      selectCategory(categories[0].id);
    }
  }, [categories, selectedCategory, selectCategory]);
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    selectCategory(categoryId);
  };
  
  // Reset form and open modal for new item
  const handleAddNewItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemCategory(selectedCategory || '');
    setItemImage('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800');
    setIsVegetarian(false);
    setIsRecommended(false);
    setIsAvailable(true);
    setIsModalOpen(true);
  };
  
  // Open modal with item data for editing
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setItemImage(item.image);
    setIsVegetarian(item.isVegetarian);
    setIsRecommended(item.isRecommended);
    setIsAvailable(item.isAvailable);
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!itemName || !itemDescription || !itemPrice || !itemCategory || !itemImage) {
      alert('Please fill in all required fields');
      return;
    }
    
    const itemData = {
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      category: itemCategory,
      image: itemImage,
      isVegetarian,
      isRecommended,
      isAvailable
    };
    
    try {
      if (editingItem) {
        // Update existing item
        await updateMenuItem({
          ...itemData,
          id: editingItem.id
        });
      } else {
        // Create new item
        await createMenuItem(itemData);
      }
      
      // Close modal and reset form
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to save menu item:', err);
    }
  };
  
  // Handle item deletion
  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(itemId);
      } catch (err) {
        console.error('Failed to delete menu item:', err);
      }
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
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, type: 'spring', stiffness: 500, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      transition: { duration: 0.2 }
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
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Menu Manager
            </h1>
            <p className="text-gray-600">
              Manage your restaurant's menu items, categories, and pricing.
            </p>
          </div>
          
          <motion.button
            className="btn btn-primary flex items-center"
            onClick={handleAddNewItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} className="mr-2" />
            Add New Item
          </motion.button>
        </motion.div>
        
        {/* Category tabs */}
        <motion.div variants={itemVariants} className="border-b border-gray-200">
          <div className="flex overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 font-medium whitespace-nowrap text-sm ${
                  selectedCategory === category.id
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Menu items grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                layout
              >
                <div className="h-48 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <div className="text-lg font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {item.isVegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Vegetarian
                        </span>
                      )}
                      
                      {item.isRecommended && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        className="p-2 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100"
                        onClick={() => handleEditItem(item)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={16} />
                      </motion.button>
                      
                      <motion.button
                        className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                        onClick={() => handleDeleteItem(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* Add/Edit Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-xl w-full max-w-2xl shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-6">
                    {/* Item name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name*
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="input"
                        placeholder="e.g., Margherita Pizza"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* Item description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
                      <textarea
                        id="description"
                        className="input h-24 resize-none"
                        placeholder="Describe your food item..."
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    
                    {/* Price and category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Price*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={16} className="text-gray-500" />
                          </div>
                          <input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="input pl-8"
                            placeholder="0.00"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category*
                        </label>
                        <select
                          id="category"
                          className="input"
                          value={itemCategory}
                          onChange={(e) => setItemCategory(e.target.value)}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column */}
                  <div className="space-y-6">
                    {/* Image URL */}
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Image size={16} className="text-gray-500" />
                        </div>
                        <input
                          id="image"
                          type="text"
                          className="input pl-8"
                          placeholder="https://example.com/image.jpg"
                          value={itemImage}
                          onChange={(e) => setItemImage(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Image preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Preview
                      </label>
                      <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image URL provided
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Toggles */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="isVegetarian"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          checked={isVegetarian}
                          onChange={(e) => setIsVegetarian(e.target.checked)}
                        />
                        <label htmlFor="isVegetarian" className="ml-2 text-sm text-gray-700">
                          Vegetarian
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="isRecommended"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          checked={isRecommended}
                          onChange={(e) => setIsRecommended(e.target.checked)}
                        />
                        <label htmlFor="isRecommended" className="ml-2 text-sm text-gray-700">
                          Recommended
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="isAvailable"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          checked={isAvailable}
                          onChange={(e) => setIsAvailable(e.target.checked)}
                        />
                        <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                          Available
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={18} className="mr-2" />
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagerPage;