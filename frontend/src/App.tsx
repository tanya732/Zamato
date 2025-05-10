import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

import { HomePage } from '@/pages/HomePage';
import { RestaurantListPage } from '@/pages/RestaurantListPage';
import { RestaurantDetailPage } from '@/pages/RestaurantDetailPage';
import { CartPage } from '@/pages/CartPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RestaurantDashboard } from '@/pages/restaurant/RestaurantDashboard';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;