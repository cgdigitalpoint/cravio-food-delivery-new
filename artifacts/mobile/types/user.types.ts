// ─── User Domain Types ────────────────────────────────────────────────────────
import type { Address } from './food.types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  savedAddresses: Address[];
  defaultAddressId?: string;
  preferences: UserPreferences;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  dietaryRestrictions: DietaryRestriction[];
  cuisinePreferences: string[];
  notificationsEnabled: boolean;
  marketingEmailsEnabled: boolean;
  darkMode: 'auto' | 'light' | 'dark';
}

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'halal'
  | 'kosher'
  | 'nut_free'
  | 'dairy_free';

export interface AuthState {
  user: User | null;
  session: AppSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled'
  | 'promo'
  | 'system';
