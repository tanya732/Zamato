import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import Header from './components/ui/Header';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartDrawer from './components/cart/CartDrawer';

function App() {
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  const { fetchCart } = useCartStore();
  
  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
    fetchCart();
  }, [checkAuth, fetchCart]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <CartDrawer />
    </div>
  );
}

export default App;