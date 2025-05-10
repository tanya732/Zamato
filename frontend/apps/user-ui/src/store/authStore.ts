import { create } from 'zustand';
import { AuthState, LoginCredentials, SignupCredentials } from '../types';
import { authService } from '../services/authService';

export const useAuthStore = create<AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  signout: () => Promise<void>;
  checkAuth: () => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  
  login: async (credentials) => {
    set({ loading: true, error: null });
    
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        loading: false 
      });
    }
  },
  
  signup: async (credentials) => {
    set({ loading: true, error: null });
    
    try {
      const user = await authService.signup(credentials);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign up', 
        loading: false 
      });
    }
  },
  
  signout: async () => {
    set({ loading: true });
    
    try {
      await authService.signout();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out', 
        loading: false 
      });
    }
  },
  
  checkAuth: () => {
    const user = authService.getCurrentUser();
    set({ 
      user, 
      isAuthenticated: !!user, 
      loading: false 
    });
  }
}));