// ─── Cart Store (Zustand) ─────────────────────────────────────────────────────
// Manages the active cart: items, totals, restaurant lock.

import { create } from 'zustand';
import type { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  subtotal: number;
  deliveryFee: number;
  tip: number;
  promoCode: string | null;
  promoDiscount: number;

  // Computed
  totalAmount: number;
  itemCount: number;

  // Signal for checkout scroll-to-section (cleared by CheckoutScreen after use)
  checkoutScrollTo: 'payment' | null;

  // Actions
  addItem: (menuItem: MenuItem, quantity?: number, notes?: string, restaurantName?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setTip: (tip: number) => void;
  applyPromoCode: (code: string, discount: number) => void;
  removePromoCode: () => void;
  clearCart: () => void;
  setCheckoutScrollTo: (target: 'payment' | null) => void;
}

function calcTotals(items: CartItem[], tip: number, discount: number) {
  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  return {
    subtotal,
    totalAmount: Math.max(0, subtotal - discount) + tip,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,
  subtotal: 0,
  deliveryFee: 0,
  tip: 0,
  promoCode: null,
  promoDiscount: 0,
  totalAmount: 0,
  itemCount: 0,
  checkoutScrollTo: null,

  addItem: (menuItem, quantity = 1, notes, restaurantName) => {
    const id = `${menuItem.id}_${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
    const cartItem: CartItem = {
      id,
      menuItem,
      quantity,
      selectedCustomizations: {},
      notes,
      totalPrice: menuItem.price * quantity,
    };
    set((state) => {
      const items = [...state.items, cartItem];
      return {
        items,
        restaurantId: menuItem.restaurantId,
        // Use the provided name; fall back to whatever is already in state (same
        // restaurant add) so successive addItem calls don't clear the name.
        restaurantName: restaurantName ?? state.restaurantName,
        ...calcTotals(items, state.tip, state.promoDiscount),
      };
    });
  },

  removeItem: (cartItemId) => {
    set((state) => {
      const items = state.items.filter((i) => i.id !== cartItemId);
      return {
        items,
        restaurantId: items.length === 0 ? null : state.restaurantId,
        restaurantName: items.length === 0 ? null : state.restaurantName,
        ...calcTotals(items, state.tip, state.promoDiscount),
      };
    });
  },

  updateQuantity: (cartItemId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const items = state.items.filter((i) => i.id !== cartItemId);
        return {
          items,
          restaurantId: items.length === 0 ? null : state.restaurantId,
          ...calcTotals(items, state.tip, state.promoDiscount),
        };
      }
      const items = state.items.map((i) =>
        i.id === cartItemId
          ? {
              ...i,
              quantity,
              totalPrice: i.menuItem.price * quantity,
            }
          : i
      );
      return { items, ...calcTotals(items, state.tip, state.promoDiscount) };
    });
  },

  setTip: (tip) => {
    set((state) => ({
      tip,
      totalAmount:
        Math.max(0, state.subtotal - state.promoDiscount) + tip,
    }));
  },

  applyPromoCode: (code, discount) => {
    set((state) => ({
      promoCode: code,
      promoDiscount: discount,
      ...calcTotals(state.items, state.tip, discount),
    }));
  },

  removePromoCode: () => {
    set((state) => ({
      promoCode: null,
      promoDiscount: 0,
      ...calcTotals(state.items, state.tip, 0),
    }));
  },

  clearCart: () =>
    set({
      items: [],
      restaurantId: null,
      restaurantName: null,
      subtotal: 0,
      tip: 0,
      promoCode: null,
      promoDiscount: 0,
      totalAmount: 0,
      itemCount: 0,
      // checkoutScrollTo is intentionally NOT cleared here — it is a UI signal
      // owned by CheckoutScreen, which clears it after consuming it.
    }),

  setCheckoutScrollTo: (target) => set({ checkoutScrollTo: target }),
}));
