import { create } from 'zustand';
import { User, LoginCredentials, RegisterCredentials } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    phone: '123-456-7890',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Restaurant Owner',
    email: 'restaurant@example.com',
    phone: '123-456-7890',
    avatar: 'https://i.pravatar.cc/150?img=2',
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (user && credentials.password === 'password') {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
      }
    } catch (error) {
      set({ error: 'An error occurred during login', isLoading: false });
    }
  },
  
  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      
      if (existingUser) {
        set({ error: 'Email already exists', isLoading: false });
        return;
      }
      
      if (credentials.password !== credentials.confirmPassword) {
        set({ error: 'Passwords do not match', isLoading: false });
        return;
      }
      
      // Create new user (in a real app this would be stored in a database)
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name: credentials.name,
        email: credentials.email,
        avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 3}`,
      };
      
      // In a real app, we would add the user to the database
      // For this demo, we'll just set the user as authenticated
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'An error occurred during registration', isLoading: false });
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));