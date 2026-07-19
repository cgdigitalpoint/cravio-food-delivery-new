// ─── Food Domain Types ────────────────────────────────────────────────────────
// Core data shapes for the Cravio food delivery platform.
// These are stubs for Phase 1 — full implementation in Phase 2+.

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number; // minutes
  deliveryFee: number;
  minOrderAmount: number;
  categories: string[];
  tags: string[];
  isOpen: boolean;
  location: GeoLocation;
  address: Address;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  isAvailable: boolean;
  isPopular: boolean;
  calories?: number;
  preparationTime?: number; // minutes
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  isRequired: boolean;
  maxSelections: number;
  minSelections: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  priceModifier: number;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: Record<string, string[]>;
  notes?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: Pick<Restaurant, 'id' | 'name' | 'imageUrl'>;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  totalAmount: number;
  deliveryAddress: Address;
  estimatedDeliveryTime: number; // minutes
  actualDeliveryTime?: number;
  driverId?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'card' | 'wallet' | 'cash';

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  instructions?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  imageUrl?: string;
  restaurantCount: number;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
  phone: string;
  location?: GeoLocation;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiresAt: string;
  usageLimit?: number;
  usageCount: number;
}
