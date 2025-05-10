import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { useRestaurantStore } from './store/restaurantStore';
import Header from './components/ui/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MenuManagerPage from './pages/MenuManagerPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore();
  
  // If still checking auth status, show nothing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render the protected route
  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  const { fetchProfile } = useRestaurantStore();
  
  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Fetch restaurant profile when authenticated
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 mt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/menu" 
              element={
                <ProtectedRoute>
                  <MenuManagerPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect any unmatched route to home if authenticated, or login if not */}
            <Route 
              path="*" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;