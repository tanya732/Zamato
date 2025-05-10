import { create } from 'zustand';
import { MenuItem, MenuCategory } from '../types';
import { menuService } from '../services/menuService';

interface MenuState {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}

interface MenuActions {
  fetchMenuItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  selectCategory: (categoryId: string | null) => void;
  createMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
}

export const useMenuStore = create<MenuState & MenuActions>((set, get) => ({
  categories: [],
  menuItems: [],
  selectedCategory: null,
  loading: false,
  error: null,
  
  fetchMenuItems: async () => {
    set({ loading: true, error: null });
    
    try {
      const { selectedCategory } = get();
      
      let items: MenuItem[];
      
      if (selectedCategory) {
        items = await menuService.getMenuItemsByCategory(selectedCategory);
      } else {
        items = await menuService.getMenuItems();
      }
      
      set({ menuItems: items, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch menu items', 
        loading: false 
      });
    }
  },
  
  fetchCategories: async () => {
    set({ loading: true, error: null });
    
    try {
      const categories = await menuService.getCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch categories', 
        loading: false 
      });
    }
  },
  
  selectCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
    get().fetchMenuItems();
  },
  
  createMenuItem: async (item) => {
    set({ loading: true, error: null });
    
    try {
      const newItem = await menuService.createMenuItem(item);
      
      // Update the items list
      set(state => ({ 
        menuItems: [...state.menuItems, newItem],
        loading: false 
      }));
      
      return newItem;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create menu item', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateMenuItem: async (item) => {
    set({ loading: true, error: null });
    
    try {
      const updatedItem = await menuService.updateMenuItem(item);
      
      // Update the item in the items list
      set(state => ({
        menuItems: state.menuItems.map(i => 
          i.id === updatedItem.id ? updatedItem : i
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update menu item', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteMenuItem: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const success = await menuService.deleteMenuItem(id);
      
      if (success) {
        // Remove the item from the items list
        set(state => ({
          menuItems: state.menuItems.filter(item => item.id !== id),
          loading: false
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete menu item', 
        loading: false 
      });
      throw error;
    }
  }
}));