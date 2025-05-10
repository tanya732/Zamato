import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, Users, ShoppingBag, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

const DashboardPage: React.FC = () => {
  const { profile, setOnlineStatus } = useRestaurantStore();
  const navigate = useNavigate();
  
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
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, manage your restaurant operations from here.
          </p>
        </motion.div>
        
        {/* Restaurant status card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="sm:flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile?.name || 'Your Restaurant'}
                </h2>
                <div className="flex items-center">
                  <div 
                    className={`h-3 w-3 rounded-full mr-2 ${
                      profile?.isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span 
                    className={`font-medium ${
                      profile?.isOnline ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {profile?.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <motion.button 
                className={`mt-4 sm:mt-0 btn ${
                  profile?.isOnline 
                    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                } border-none`}
                onClick={() => profile && setOnlineStatus(!profile.isOnline)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {profile?.isOnline ? (
                  <>
                    <AlertTriangle size={16} className="mr-2" />
                    Set Restaurant Offline
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Set Restaurant Online
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Stats cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Orders Today */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">Orders Today</p>
                <h3 className="text-2xl font-bold text-gray-900">15</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ArrowUp size={16} className="mr-1" />
              <span className="text-sm font-medium">12% from yesterday</span>
            </div>
          </motion.div>
          
          {/* Revenue Today */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">Revenue Today</p>
                <h3 className="text-2xl font-bold text-gray-900">$358.25</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ArrowUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ArrowUp size={16} className="mr-1" />
              <span className="text-sm font-medium">18% from yesterday</span>
            </div>
          </motion.div>
          
          {/* Avg. Delivery Time */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">Avg. Delivery Time</p>
                <h3 className="text-2xl font-bold text-gray-900">28 min</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="flex items-center text-red-600">
              <ArrowDown size={16} className="mr-1" />
              <span className="text-sm font-medium">3 min improvement</span>
            </div>
          </motion.div>
          
          {/* New Customers */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">New Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ArrowUp size={16} className="mr-1" />
              <span className="text-sm font-medium">4 more than yesterday</span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Quick actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500 cursor-pointer"
              onClick={() => navigate('/menu')}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Menu</h3>
              <p className="text-gray-600 text-sm">Update your restaurant's menu items, prices, and availability.</p>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 cursor-pointer"
              onClick={() => navigate('/orders')}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm">Check incoming orders, accept or reject them, and manage delivery.</p>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 cursor-pointer"
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Update Profile</h3>
              <p className="text-gray-600 text-sm">Manage your restaurant's details, hours, and contact information.</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;