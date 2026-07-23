// ─── Database Row Types ───────────────────────────────────────────────────────
// These mirror the Supabase table columns exactly.
// Domain/UI types live in food.types.ts and user.types.ts.

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  created_at: string;
}

export interface DbAddress {
  id: string;
  user_id: string;
  title: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

export interface DbRestaurant {
  id: string;
  name: string;
  rating: number;
  delivery_time: number;
  delivery_fee: number;
  image: string;
  is_open: boolean;
}

export interface DbFood {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  veg: boolean;
  rating: number;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  food_id: string;
  food_name: string;
  food_image: string;
  quantity: number;
  price: number;
}

export interface DbOrder {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  status: OrderStatus;
  total: number;
  payment_method: string;
  created_at: string;
  order_items?: DbOrderItem[];
}

export interface DbFavorite {
  id: string;
  user_id: string;
  restaurant_id: string;
}

export interface DbCart {
  user_id: string;
  food_id: string;
  quantity: number;
}
