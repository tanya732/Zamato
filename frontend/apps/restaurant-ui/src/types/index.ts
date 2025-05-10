// Authentication Types
export interface RestaurantUser {
  id: string;
  name: string;
  email: string;
  restaurantId: string;
  restaurantName: string;
  role: 'owner' | 'manager' | 'staff';
}

export interface AuthState {
  user: RestaurantUser | null;
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
  restaurantName: string;
}

// Restaurant Types
export interface RestaurantProfile {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string[];
  openingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  image: string;
  banner: string;
  isOnline: boolean;
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
  id: string;
  name: string;
  displayOrder: number;
}

// Order Types
export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime?: string;
}