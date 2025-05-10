import { LoginCredentials, SignupCredentials, User } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage
let currentUser: User | null = null;

export const authService = {
  // Sign up a new user
  async signup(credentials: SignupCredentials): Promise<User> {
    await delay(1000); // Simulate API call
    
    // In a real app, this would be an API call to create a user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
    };
    
    // Store the user (simulating server-side storage)
    currentUser = newUser;
    localStorage.setItem('zamato_user', JSON.stringify(newUser));
    
    return newUser;
  },
  
  // Sign in an existing user
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(1000); // Simulate API call
    
    // For demo purposes, any valid email/password will work
    // In a real app, this would validate against a server
    if (credentials.email && credentials.password) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: credentials.email.split('@')[0],
        email: credentials.email,
      };
      
      currentUser = user;
      localStorage.setItem('zamato_user', JSON.stringify(user));
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  // Sign out the current user
  async signout(): Promise<void> {
    await delay(300); // Simulate API call
    
    currentUser = null;
    localStorage.removeItem('zamato_user');
  },
  
  // Get the current user if they're logged in
  getCurrentUser(): User | null {
    if (currentUser) return currentUser;
    
    const storedUser = localStorage.getItem('zamato_user');
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