import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Utensils, Clock, Shield } from 'lucide-react';
import RestaurantsList from '../components/restaurants/RestaurantsList';

const HomePage: React.FC = () => {
  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Features animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-500 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Hero content */}
              <div className="md:col-span-3 text-white">
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                  variants={itemVariants}
                >
                  Your Favorite Food, <br />
                  Delivered Fast
                </motion.h1>
                
                <motion.p 
                  className="text-lg md:text-xl mb-8 opacity-90"
                  variants={itemVariants}
                >
                  Order from the best restaurants in your area with just a few clicks.
                  Fast delivery, amazing food, and a seamless experience.
                </motion.p>
                
                {/* Search bar */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-2 mb-8"
                  variants={itemVariants}
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your delivery address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                  <Link to="/restaurants">
                    <motion.button
                      className="bg-white text-primary-500 font-medium px-6 py-3 rounded-lg flex items-center justify-center whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Find Food <ArrowRight size={18} className="ml-2" />
                    </motion.button>
                  </Link>
                </motion.div>
                
                {/* Features */}
                <motion.div 
                  className="flex flex-wrap gap-6"
                  variants={containerVariants}
                >
                  <motion.div className="flex items-center" variants={featureVariants}>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <Utensils size={20} className="text-white" />
                    </div>
                    <span>1000+ Restaurants</span>
                  </motion.div>
                  
                  <motion.div className="flex items-center" variants={featureVariants}>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <Clock size={20} className="text-white" />
                    </div>
                    <span>Fast Delivery</span>
                  </motion.div>
                  
                  <motion.div className="flex items-center" variants={featureVariants}>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <Shield size={20} className="text-white" />
                    </div>
                    <span>Secure Payments</span>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Hero image */}
              <motion.div 
                className="md:col-span-2 hidden md:block"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Delicious food"
                    className="rounded-lg shadow-2xl w-full object-cover transform translate-x-4 translate-y-4"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Popular Restaurants Section */}
      <RestaurantsList />
    </>
  );
};

export default HomePage;