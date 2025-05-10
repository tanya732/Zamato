import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, AlertTriangle, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useRestaurantStore } from '../../store/restaurantStore';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const location = useLocation();
  const { isAuthenticated, user, signout } = useAuthStore();
  const { profile, setOnlineStatus } = useRestaurantStore();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Nav items with animation variants
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Orders', path: '/orders' },
    { name: 'Profile', path: '/profile' },
  ];
  
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }),
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };
  
  // The mobile menu animation variants
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        duration: 0.3,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    },
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }
  };
  
  const handleSignout = async () => {
    await signout();
    setIsMenuOpen(false);
  };
  
  const toggleOnlineStatus = () => {
    if (profile) {
      setOnlineStatus(!profile.isOnline);
    }
  };
  
  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div 
                className="h-10 w-10 bg-primary-500 rounded-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span className="text-white font-bold text-lg">Z</motion.span>
              </motion.div>
              <motion.span className="ml-2 text-2xl font-bold text-gray-900">
                Zamato <span className="text-sm text-primary-500 font-normal">Restaurant</span>
              </motion.span>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-8">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Link
                      to={item.path}
                      className={`text-base font-medium hover:text-primary-500 transition-colors ${
                        location.pathname === item.path ? 'text-primary-500' : 'text-gray-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            )}
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Restaurant status toggle */}
              {isAuthenticated && profile && (
                <motion.button
                  className={`hidden md:flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    profile.isOnline 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                  onClick={toggleOnlineStatus}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {profile.isOnline ? (
                    <span className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      Offline
                    </span>
                  )}
                </motion.button>
              )}
              
              {/* User account button */}
              {isAuthenticated ? (
                <div className="relative hidden md:block">
                  <motion.button
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2 font-medium text-gray-800">
                      {user?.name}
                    </span>
                    <div className="h-8 w-8 bg-primary-500 text-white rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  className="hidden md:block btn btn-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Restaurant Login
                </motion.button>
              )}
              
              {/* Mobile menu button */}
              <motion.button
                className="block md:hidden text-gray-800"
                onClick={() => setIsMenuOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <motion.div
        className="fixed top-0 right-0 h-full w-full max-w-xs bg-white z-50 shadow-xl"
        variants={menuVariants}
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-800">Zamato</span>
            </div>
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} className="text-gray-800" />
            </motion.button>
          </div>
          
          {isAuthenticated && (
            <>
              {/* Restaurant status toggle (mobile) */}
              {profile && (
                <motion.button
                  className={`flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm font-medium mb-6 ${
                    profile.isOnline 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                  onClick={toggleOnlineStatus}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {profile.isOnline ? (
                    <span className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      Restaurant is Online
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      Restaurant is Offline
                    </span>
                  )}
                </motion.button>
              )}
              
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    variants={navItemVariants}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Link
                      to={item.path}
                      className={`text-lg font-medium ${
                        location.pathname === item.path 
                          ? 'text-primary-500' 
                          : 'text-gray-800 hover:text-primary-500'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </>
          )}
          
          <div className="mt-8 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.restaurantName}</span>
                  </div>
                </div>
                <motion.button
                  className="w-full btn btn-secondary flex items-center justify-center"
                  onClick={handleSignout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </motion.button>
              </>
            ) : (
              <motion.button
                className="w-full btn btn-primary"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Restaurant Login
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Background overlay when menu is open */}
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Auth modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;