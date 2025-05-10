import { LoginCredentials, SignupCredentials, RestaurantUser } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage
let currentUser: RestaurantUser | null = null;

export const authService = {
  // Sign up a new restaurant user
  async signup(credentials: SignupCredentials): Promise<RestaurantUser> {
    await delay(1000); // Simulate API call
    
    // In a real app, this would be an API call to create a user and restaurant
    const newUser: RestaurantUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: credentials.name,
      email: credentials.email,
      restaurantId: Math.random().toString(36).substr(2, 9),
      restaurantName: credentials.restaurantName,
      role: 'owner'
    };
    
    // Store the user (simulating server-side storage)
    currentUser = newUser;
    localStorage.setItem('zamato_restaurant_user', JSON.stringify(newUser));
    
    return newUser;
  },
  
  // Sign in an existing restaurant user
  async login(credentials: LoginCredentials): Promise<RestaurantUser> {
    await delay(1000); // Simulate API call
    
    // For demo purposes, any valid email/password will work
    // In a real app, this would validate against a server
    if (credentials.email && credentials.password) {
      const user: RestaurantUser = {
        id: "1",
        name: credentials.email.split('@')[0],
        email: credentials.email,
        restaurantId: "1",
        restaurantName: "Pizza Paradise",
        role: 'owner'
      };
      
      currentUser = user;
      localStorage.setItem('zamato_restaurant_user', JSON.stringify(user));
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  // Sign out the current user
  async signout(): Promise<void> {
    await delay(300); // Simulate API call
    
    currentUser = null;
    localStorage.removeItem('zamato_restaurant_user');
  },
  
  // Get the current user if they're logged in
  getCurrentUser(): RestaurantUser | null {
    if (currentUser) return currentUser;
    
    const storedUser = localStorage.getItem('zamato_restaurant_user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
    
    return null;
  },
  
  // Check if a user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
};