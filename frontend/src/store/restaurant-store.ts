import { create } from 'zustand';
import { Restaurant, MenuItem } from '@/lib/types';

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
  fetchRestaurantById: (id: string) => Promise<void>;
  fetchMenuItems: (restaurantId: string) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
}

// Mock data for restaurants
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Haven',
    description: 'The best burgers in town with fresh ingredients',
    cuisineType: ['American', 'Fast Food'],
    address: {
      street: '123 Main St',
      city: 'Foodville',
      state: 'CA',
      postalCode: '90210',
      country: 'USA'
    },
    rating: 4.5,
    reviewCount: 256,
    priceRange: '$$',
    openingHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' }
    },
    coverImage: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
    logo: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
    deliveryFee: 2.99,
    minimumOrder: 10,
    estimatedDeliveryTime: '30-45 min',
    isFeatured: true,
    discount: {
      percentage: 10,
      validUntil: new Date('2025-12-31')
    }
  },
  {
    id: '2',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizza made in wood-fired ovens',
    cuisineType: ['Italian', 'Pizza'],
    address: {
      street: '456 Food Blvd',
      city: 'Foodville',
      state: 'CA',
      postalCode: '90211',
      country: 'USA'
    },
    rating: 4.7,
    reviewCount: 342,
    priceRange: '$$',
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    coverImage: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
    logo: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
    deliveryFee: 1.99,
    minimumOrder: 15,
    estimatedDeliveryTime: '25-40 min'
  },
  {
    id: '3',
    name: 'Sushi Sensation',
    description: 'Premium sushi and Japanese cuisine made with fresh ingredients',
    cuisineType: ['Japanese', 'Sushi'],
    address: {
      street: '789 Ocean Ave',
      city: 'Foodville',
      state: 'CA',
      postalCode: '90212',
      country: 'USA'
    },
    rating: 4.8,
    reviewCount: 189,
    priceRange: '$$$',
    openingHours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    coverImage: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg',
    logo: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
    deliveryFee: 3.99,
    minimumOrder: 20,
    estimatedDeliveryTime: '35-50 min',
    isFeatured: true
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street food and tacos',
    cuisineType: ['Mexican', 'Tex-Mex'],
    address: {
      street: '101 Spicy St',
      city: 'Foodville',
      state: 'CA',
      postalCode: '90213',
      country: 'USA'
    },
    rating: 4.4,
    reviewCount: 210,
    priceRange: '$',
    openingHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' }
    },
    coverImage: 'https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg',
    logo: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
    deliveryFee: 1.49,
    minimumOrder: 8,
    estimatedDeliveryTime: '20-35 min'
  }
];

// Mock data for menu items
const mockMenuItems: MenuItem[] = [
  // Burger Haven menu items
  {
    id: '101',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Burgers',
    isVegetarian: false,
    isAvailable: true,
    isFeatured: true,
    restaurantId: '1'
  },
  {
    id: '102',
    name: 'Bacon Avocado Burger',
    description: 'Beef patty topped with crispy bacon, fresh avocado, lettuce, and mayo',
    price: 11.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Burgers',
    isVegetarian: false,
    isAvailable: true,
    restaurantId: '1'
  },
  {
    id: '103',
    name: 'Garden Veggie Burger',
    description: 'Plant-based patty with lettuce, tomato, onion, and vegan mayo',
    price: 9.99,
    image: 'https://images.pexels.com/photos/3607284/pexels-photo-3607284.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Burgers',
    isVegetarian: true,
    isVegan: true,
    isAvailable: true,
    restaurantId: '1'
  },
  {
    id: '104',
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with sea salt',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Sides',
    isVegetarian: true,
    isVegan: true,
    isAvailable: true,
    restaurantId: '1'
  },

  // Pizza Palace menu items
  {
    id: '201',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizza',
    isVegetarian: true,
    isAvailable: true,
    isFeatured: true,
    restaurantId: '2'
  },
  {
    id: '202',
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with pepperoni slices and mozzarella',
    price: 14.99,
    image: 'https://images.pexels.com/photos/3682837/pexels-photo-3682837.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizza',
    isVegetarian: false,
    isAvailable: true,
    restaurantId: '2'
  },
  {
    id: '203',
    name: 'Meat Lover\'s Pizza',
    description: 'Pizza loaded with pepperoni, sausage, bacon, and ham',
    price: 16.99,
    image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizza',
    isVegetarian: false,
    isAvailable: true,
    restaurantId: '2'
  },
  {
    id: '204',
    name: 'Garlic Breadsticks',
    description: 'Warm breadsticks brushed with garlic butter and herbs',
    price: 5.99,
    image: 'https://images.pexels.com/photos/1060934/pexels-photo-1060934.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Sides',
    isVegetarian: true,
    isAvailable: true,
    restaurantId: '2'
  }
];

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  menuItems: [],
  isLoading: false,
  error: null,
  
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ restaurants: mockRestaurants, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch restaurants', isLoading: false });
    }
  },
  
  fetchRestaurantById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const restaurant = mockRestaurants.find(r => r.id === id);
      
      if (!restaurant) {
        set({ error: 'Restaurant not found', isLoading: false });
        return;
      }
      
      set({ selectedRestaurant: restaurant, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch restaurant details', isLoading: false });
    }
  },
  
  fetchMenuItems: async (restaurantId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const items = mockMenuItems.filter(item => item.restaurantId === restaurantId);
      
      set({ menuItems: items, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch menu items', isLoading: false });
    }
  },
  
  addMenuItem: async (newItem: Omit<MenuItem, 'id'>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const id = `new-${Date.now()}`;
      const item: MenuItem = { ...newItem, id };
      
      // In a real app, this would be an API call to create the item
      // For now, we'll just update our local state
      const currentItems = get().menuItems;
      set({ menuItems: [...currentItems, item], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add menu item', isLoading: false });
    }
  },
  
  updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const currentItems = get().menuItems;
      const updatedItems = currentItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      
      set({ menuItems: updatedItems, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update menu item', isLoading: false });
    }
  },
  
  deleteMenuItem: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const currentItems = get().menuItems;
      const updatedItems = currentItems.filter(item => item.id !== id);
      
      set({ menuItems: updatedItems, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete menu item', isLoading: false });
    }
  },
  
  searchRestaurants: async (query: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const normalizedQuery = query.toLowerCase();
      
      const filteredRestaurants = mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.cuisineType.some(cuisine => cuisine.toLowerCase().includes(normalizedQuery)) ||
        restaurant.description.toLowerCase().includes(normalizedQuery)
      );
      
      set({ restaurants: filteredRestaurants, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to search restaurants', isLoading: false });
    }
  }
}));