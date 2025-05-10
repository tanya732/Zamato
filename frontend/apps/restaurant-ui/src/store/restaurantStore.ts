import { create } from 'zustand';
import { RestaurantProfile } from '../types';
import { restaurantService } from '../services/restaurantService';

interface RestaurantState {
  profile: RestaurantProfile | null;
  loading: boolean;
  error: string | null;
}

interface RestaurantActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedProfile: Partial<RestaurantProfile>) => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState & RestaurantActions>((set) => ({
  profile: null,
  loading: false,
  error: null,
  
  fetchProfile: async () => {
    set({ loading: true, error: null });
    
    try {
      const profile = await restaurantService.getProfile();
      set({ profile, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurant profile', 
        loading: false 
      });
    }
  },
  
  updateProfile: async (updatedProfile) => {
    set({ loading: true, error: null });
    
    try {
      const profile = await restaurantService.updateProfile(updatedProfile);
      set({ profile, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update restaurant profile', 
        loading: false 
      });
    }
  },
  
  setOnlineStatus: async (isOnline) => {
    set({ loading: true, error: null });
    
    try {
      const { isOnline: updatedStatus } = await restaurantService.setOnlineStatus(isOnline);
      
      // Update the profile with the new status
      set(state => ({
        profile: state.profile 
          ? { ...state.profile, isOnline: updatedStatus } 
          : null,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update online status', 
        loading: false 
      });
    }
  }
}));