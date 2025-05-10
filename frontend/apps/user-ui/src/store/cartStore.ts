import { create } from 'zustand';
import { Cart, MenuItem } from '../types';
import { cartService } from '../services/cartService';

interface CartState {
  cart: Cart;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

interface CartActions {
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (restaurantId: string, restaurantName: string, menuItem: MenuItem, quantity: number, specialInstructions?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number, specialInstructions?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  cart: {
    restaurantId: null,
    restaurantName: null,
    items: [],
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    total: 0
  },
  isOpen: false,
  loading: false,
  error: null,
  
  openCart: () => set({ isOpen: true }),
  
  closeCart: () => set({ isOpen: false }),
  
  fetchCart: async () => {
    set({ loading: true, error: null });
    
    try {
      const cart = await cartService.getCart();
      set({ cart, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cart', 
        loading: false 
      });
    }
  },
  
  addItem: async (restaurantId, restaurantName, menuItem, quantity, specialInstructions) => {
    set({ loading: true, error: null });
    
    try {
      const cart = await cartService.addToCart(
        restaurantId,
        restaurantName,
        menuItem,
        quantity,
        specialInstructions
      );
      
      set({ 
        cart, 
        isOpen: true, // Open cart drawer when adding an item
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add item to cart', 
        loading: false 
      });
      
      throw error; // Re-throw to let the component handle it
    }
  },
  
  updateItem: async (itemId, quantity, specialInstructions) => {
    set({ loading: true, error: null });
    
    try {
      const cart = await cartService.updateCartItem(
        itemId,
        quantity,
        specialInstructions
      );
      
      set({ cart, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update cart item', 
        loading: false 
      });
    }
  },
  
  removeItem: async (itemId) => {
    set({ loading: true, error: null });
    
    try {
      const cart = await cartService.removeCartItem(itemId);
      set({ cart, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove cart item', 
        loading: false 
      });
    }
  },
  
  clearCart: async () => {
    set({ loading: true, error: null });
    
    try {
      const cart = await cartService.clearCart();
      set({ cart, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear cart', 
        loading: false 
      });
    }
  }
}));