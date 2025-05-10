import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';

const LoginPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      // Automatically open auth modal
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated, navigate]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
  
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="flex flex-col md:flex-row gap-8 md:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left content */}
          <div className="md:w-1/2">
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Grow Your Restaurant Business with Zamato
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              variants={itemVariants}
            >
              Join thousands of restaurants on Zamato's platform and reach more customers. Manage your menu, track orders, and increase your revenue with our easy-to-use restaurant dashboard.
            </motion.p>
            
            <motion.ul className="space-y-4 mb-8" variants={itemVariants}>
              <li className="flex items-center">
                <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600">✓</span>
                </span>
                <span className="text-gray-700">Increase your restaurant's visibility</span>
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600">✓</span>
                </span>
                <span className="text-gray-700">Manage your menu effortlessly</span>
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600">✓</span>
                </span>
                <span className="text-gray-700">Track orders and deliveries in real-time</span>
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600">✓</span>
                </span>
                <span className="text-gray-700">Grow your customer base</span>
              </li>
            </motion.ul>
            
            <motion.button
              className="btn btn-primary px-8 py-3"
              onClick={() => setIsAuthModalOpen(true)}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
          
          {/* Right image */}
          <motion.div 
            className="md:w-1/2"
            variants={itemVariants}
          >
            <img
              src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Restaurant kitchen"
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Auth modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
};

export default LoginPage;