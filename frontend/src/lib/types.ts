export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address[];
  favorites?: string[];
  avatar?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  cuisineType: string[];
  address: Address;
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  openingHours: OpeningHours;
  coverImage: string;
  logo: string;
  featuredDishes?: MenuItem[];
  isOpen: boolean;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: string;
  isFeatured?: boolean;
  discount?: Discount;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  isAvailable: boolean;
  isFeatured?: boolean;
  restaurantId: string;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export type OpeningHours = {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange;
  sunday: TimeRange;
};

export type TimeRange = {
  open: string;
  close: string;
};

export type Discount = {
  percentage: number;
  validUntil: Date;
  minimumOrder?: number;
};

export type NutritionalInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type AuthState = {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};