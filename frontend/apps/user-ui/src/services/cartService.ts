import { Cart, CartItem, MenuItem } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initial cart state
const initialCart: Cart = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0
};

// Helper function to calculate cart totals
const calculateTotals = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal > 0 ? 2.99 : 0; // $2.99 delivery fee if there are items
  const total = subtotal + tax + deliveryFee;
  
  return {
    ...cart,
    subtotal,
    tax,
    deliveryFee,
    total
  };
};

// Local storage key
const CART_STORAGE_KEY = 'zamato_cart';

export const cartService = {
  // Get the current cart
  async getCart(): Promise<Cart> {
    await delay(300); // Simulate API call
    
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
    
    return initialCart;
  },
  
  // Add an item to the cart
  async addToCart(restaurantId: string, restaurantName: string, menuItem: MenuItem, quantity: number = 1, specialInstructions?: string): Promise<Cart> {
    await delay(500); // Simulate API call
    
    // Get current cart
    const currentCart = await this.getCart();
    
    // Check if adding from a different restaurant
    if (currentCart.restaurantId && currentCart.restaurantId !== restaurantId) {
      throw new Error('Your cart contains items from another restaurant. Would you like to clear your cart and add this item instead?');
    }
    
    // Check if item already exists in cart
    const existingItemIndex = currentCart.items.findIndex(item => item.menuItem.id === menuItem.id);
    
    let updatedCart: Cart;
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        specialInstructions: specialInstructions || updatedItems[existingItemIndex].specialInstructions
      };
      
      updatedCart = {
        ...currentCart,
        items: updatedItems
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Math.random().toString(36).substr(2, 9),
        menuItem,
        quantity,
        specialInstructions
      };
      
      updatedCart = {
        ...currentCart,
        restaurantId,
        restaurantName,
        items: [...currentCart.items, newItem]
      };
    }
    
    // Calculate totals
    const finalCart = calculateTotals(updatedCart);
    
    // Save to storage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(finalCart));
    
    return finalCart;
  },
  
  // Update a cart item
  async updateCartItem(itemId: string, quantity: number, specialInstructions?: string): Promise<Cart> {
    await delay(500); // Simulate API call
    
    // Get current cart
    const currentCart = await this.getCart();
    
    // Find the item
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    let updatedCart: Cart;
    
    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      updatedCart = {
        ...currentCart,
        items: currentCart.items.filter(item => item.id !== itemId)
      };
      
      // Reset restaurant info if cart is empty
      if (updatedCart.items.length === 0) {
        updatedCart.restaurantId = null;
        updatedCart.restaurantName = null;
      }
    } else {
      // Update quantity
      const updatedItems = [...currentCart.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
        specialInstructions: specialInstructions !== undefined 
          ? specialInstructions 
          : updatedItems[itemIndex].specialInstructions
      };
      
      updatedCart = {
        ...currentCart,
        items: updatedItems
      };
    }
    
    // Calculate totals
    const finalCart = calculateTotals(updatedCart);
    
    // Save to storage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(finalCart));
    
    return finalCart;
  },
  
  // Remove an item from the cart
  async removeCartItem(itemId: string): Promise<Cart> {
    await delay(500); // Simulate API call
    
    // Get current cart
    const currentCart = await this.getCart();
    
    // Remove the item
    const updatedCart = {
      ...currentCart,
      items: currentCart.items.filter(item => item.id !== itemId)
    };
    
    // Reset restaurant info if cart is empty
    if (updatedCart.items.length === 0) {
      updatedCart.restaurantId = null;
      updatedCart.restaurantName = null;
    }
    
    // Calculate totals
    const finalCart = calculateTotals(updatedCart);
    
    // Save to storage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(finalCart));
    
    return finalCart;
  },
  
  // Clear the entire cart
  async clearCart(): Promise<Cart> {
    await delay(300); // Simulate API call
    
    localStorage.removeItem(CART_STORAGE_KEY);
    
    return initialCart;
  }
};