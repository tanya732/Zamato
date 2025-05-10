import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const location = useLocation();
  const { scrollY } = useScroll();
  const { isAuthenticated, user, signout } = useAuthStore();
  const { cart, openCart } = useCartStore();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Header background opacity based on scroll
  const headerBgOpacity = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
  );
  
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0, 0, 0, 0)", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"]
  );
  
  const textColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(255, 255, 255)", "rgb(31, 41, 55)"]
  );
  
  // When header is visible over hero, use dark text, otherwise white
  const isHomePage = location.pathname === '/';
  
  // Nav items with animation variants
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'About', path: '/about' },
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
  
  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: isHomePage ? headerBgOpacity : 'white',
          boxShadow: isHomePage ? headerShadow : undefined,
        }}
      >
        <div className="max-w-7xl mx-auto">
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
              <motion.span 
                className="ml-2 text-2xl font-bold"
                style={{ color: isHomePage ? textColor : '#1F2937' }}
              >
                Zamato
              </motion.span>
            </Link>
            
            {/* Desktop Navigation */}
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
                    className={`text-lg font-medium hover:text-primary-500 transition-colors ${
                      location.pathname === item.path ? 'text-primary-500' : isHomePage ? 'text-white' : 'text-gray-800'
                    }`}
                    style={{ color: location.pathname === item.path ? '#E23744' : isHomePage ? textColor : undefined }}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Cart button with indicator */}
              <motion.button
                className="relative p-2 text-gray-800 hover:text-primary-500 transition-colors"
                onClick={openCart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ color: isHomePage ? textColor : undefined }}
              >
                <ShoppingBag size={24} />
                {cart.items.length > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    {cart.items.reduce((total, item) => total + item.quantity, 0)}
                  </motion.span>
                )}
              </motion.button>
              
              {/* User account button */}
              {isAuthenticated ? (
                <div className="relative hidden md:block">
                  <motion.button
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2 font-medium" style={{ color: isHomePage ? textColor : undefined }}>
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
                  Sign In
                </motion.button>
              )}
              
              {/* Mobile menu button */}
              <motion.button
                className="block md:hidden text-gray-800"
                onClick={() => setIsMenuOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ color: isHomePage ? textColor : undefined }}
              >
                <Menu size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
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
          
          <div className="mt-8 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-gray-800">{user?.name}</span>
                </div>
                <motion.button
                  className="w-full btn btn-secondary"
                  onClick={handleSignout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
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
                Sign In
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