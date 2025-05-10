import { Restaurant, MenuCategory } from '../types';
import restaurantsData from '../mocks/restaurants.json';
import menuData from '../mocks/menu.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const restaurantService = {
  // Get paginated list of restaurants
  async getRestaurants(page: number = 1, limit: number = 4): Promise<Restaurant[]> {
    await delay(1000); // Simulate API call
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return restaurantsData.restaurants.slice(start, end);
  },
  
  // Get a specific restaurant by ID
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    await delay(500); // Simulate API call
    
    const restaurant = restaurantsData.restaurants.find(r => r.id === id);
    return restaurant || null;
  },
  
  // Get the menu for a specific restaurant
  async getMenuByRestaurantId(id: string): Promise<{ restaurant: Restaurant, categories: MenuCategory[] } | null> {
    await delay(1000); // Simulate API call
    
    // For demo purposes, we'll return the same menu for any restaurant ID
    // In a real app, this would fetch the specific menu for the given restaurant ID
    return {
      restaurant: menuData.restaurant,
      categories: menuData.categories
    };
  }
};