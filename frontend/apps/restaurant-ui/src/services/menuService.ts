import { MenuItem, MenuCategory } from '../types';
import restaurantData from '../mocks/restaurant.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const menuService = {
  // Get all menu categories
  async getCategories(): Promise<MenuCategory[]> {
    await delay(500); // Simulate API call
    
    return restaurantData.categories;
  },
  
  // Get all menu items
  async getMenuItems(): Promise<MenuItem[]> {
    await delay(1000); // Simulate API call
    
    // Transform the data to match our MenuItem type
    return restaurantData.menuItems.map(item => ({
      ...item,
      category: restaurantData.categories.find(cat => cat.id === item.category)?.name || ''
    }));
  },
  
  // Get menu items by category
  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    await delay(700); // Simulate API call
    
    // Filter items by category and transform to match MenuItem type
    return restaurantData.menuItems
      .filter(item => item.category === categoryId)
      .map(item => ({
        ...item,
        category: restaurantData.categories.find(cat => cat.id === item.category)?.name || ''
      }));
  },
  
  // Create a new menu item
  async createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    await delay(1000); // Simulate API call
    
    // In a real app, this would send the data to an API
    // Here we just return the item with a generated ID
    const newItem: MenuItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    return newItem;
  },
  
  // Update an existing menu item
  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    await delay(1000); // Simulate API call
    
    // In a real app, this would send the updated data to an API
    // Here we just return the updated item
    return item;
  },
  
  // Delete a menu item
  async deleteMenuItem(id: string): Promise<boolean> {
    await delay(1000); // Simulate API call
    
    // In a real app, this would send a delete request to an API
    // Here we just return true to indicate success
    return true;
  }
};