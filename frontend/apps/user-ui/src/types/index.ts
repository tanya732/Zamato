// Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  phone?: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  priceRange: string;
  isPromoted: boolean;
  isFastDelivery: boolean;
  isTopRated: boolean;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  isRecommended: boolean;
  isAvailable: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

// Cart Types
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}