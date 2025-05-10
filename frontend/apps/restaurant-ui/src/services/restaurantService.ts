import { RestaurantProfile } from '../types';
import restaurantData from '../mocks/restaurant.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const restaurantService = {
  // Get restaurant profile
  async getProfile(): Promise<RestaurantProfile> {
    await delay(800); // Simulate API call
    
    return restaurantData.profile;
  },
  
  // Update restaurant profile
  async updateProfile(profile: Partial<RestaurantProfile>): Promise<RestaurantProfile> {
    await delay(1000); // Simulate API call
    
    // In a real app, this would send the updated profile to an API
    // Here we just merge the updated fields with the existing profile
    const updatedProfile = {
      ...restaurantData.profile,
      ...profile
    };
    
    return updatedProfile;
  },
  
  // Set restaurant online status
  async setOnlineStatus(isOnline: boolean): Promise<{ isOnline: boolean }> {
    await delay(500); // Simulate API call
    
    // In a real app, this would update the status in the database
    return { isOnline };
  }
};