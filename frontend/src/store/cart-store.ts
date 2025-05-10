import { create } from 'zustand';
import { Cart, CartItem, MenuItem } from '@/lib/types';

interface CartState {
  cart: Cart | null;
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  return { subtotal, deliveryFee, tax, total };
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  
  addToCart: (item: MenuItem, quantity: number) => {
    const { cart } = get();
    
    // If cart is empty, create a new one
    if (!cart) {
      const newCart: Cart = {
        id: '1',
        userId: '1', // Assuming user with ID 1
        restaurantId: item.restaurantId,
        items: [{ menuItem: item, quantity }],
        subtotal: item.price * quantity,
        deliveryFee: 2.99,
        tax: item.price * quantity * 0.08,
        total: (item.price * quantity) + 2.99 + (item.price * quantity * 0.08),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({ cart: newCart });
      return;
    }
    
    // If trying to add an item from a different restaurant
    if (item.restaurantId !== cart.restaurantId) {
      if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        const newCart: Cart = {
          ...cart,
          restaurantId: item.restaurantId,
          items: [{ menuItem: item, quantity }],
          updatedAt: new Date(),
        };
        
        const { subtotal, deliveryFee, tax, total } = calculateCartTotals(newCart.items);
        newCart.subtotal = subtotal;
        newCart.deliveryFee = deliveryFee;
        newCart.tax = tax;
        newCart.total = total;
        
        set({ cart: newCart });
      }
      return;
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.menuItem.id === item.id
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += quantity;
      
      const updatedCart = {
        ...cart,
        items: updatedItems,
        updatedAt: new Date(),
      };
      
      const { subtotal, deliveryFee, tax, total } = calculateCartTotals(updatedCart.items);
      updatedCart.subtotal = subtotal;
      updatedCart.deliveryFee = deliveryFee;
      updatedCart.tax = tax;
      updatedCart.total = total;
      
      set({ cart: updatedCart });
    } else {
      // Add new item
      const updatedItems = [...cart.items, { menuItem: item, quantity }];
      
      const updatedCart = {
        ...cart,
        items: updatedItems,
        updatedAt: new Date(),
      };
      
      const { subtotal, deliveryFee, tax, total } = calculateCartTotals(updatedCart.items);
      updatedCart.subtotal = subtotal;
      updatedCart.deliveryFee = deliveryFee;
      updatedCart.tax = tax;
      updatedCart.total = total;
      
      set({ cart: updatedCart });
    }
  },
  
  removeFromCart: (itemId: string) => {
    const { cart } = get();
    if (!cart) return;
    
    const updatedItems = cart.items.filter(item => item.menuItem.id !== itemId);
    
    const updatedCart = {
      ...cart,
      items: updatedItems,
      updatedAt: new Date(),
    };
    
    const { subtotal, deliveryFee, tax, total } = calculateCartTotals(updatedCart.items);
    updatedCart.subtotal = subtotal;
    updatedCart.deliveryFee = deliveryFee;
    updatedCart.tax = tax;
    updatedCart.total = total;
    
    set({ cart: updatedCart });
  },
  
  updateQuantity: (itemId: string, quantity: number) => {
    const { cart } = get();
    if (!cart) return;
    
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    const updatedItems = cart.items.map(item => 
      item.menuItem.id === itemId 
        ? { ...item, quantity } 
        : item
    );
    
    const updatedCart = {
      ...cart,
      items: updatedItems,
      updatedAt: new Date(),
    };
    
    const { subtotal, deliveryFee, tax, total } = calculateCartTotals(updatedCart.items);
    updatedCart.subtotal = subtotal;
    updatedCart.deliveryFee = deliveryFee;
    updatedCart.tax = tax;
    updatedCart.total = total;
    
    set({ cart: updatedCart });
  },
  
  clearCart: () => {
    set({ cart: null });
  },
  
  getTotalItems: () => {
    const { cart } = get();
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },
}));