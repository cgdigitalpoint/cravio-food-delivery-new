// ─── Cart Store (Zustand) ─────────────────────────────────────────────────────
// Manages the active cart: items, totals, restaurant lock.
//
// Persistence strategy
// ────────────────────
// Local state is always the source of truth for the UI (instant, no latency).
// Remote sync via cartService is fire-and-forget: failures are logged but never
// surface to the user or roll back UI state, because cart sync is non-critical.
//
// Login:   loadFromRemote(userId) fetches the persisted cart from Supabase and
//          replaces the local state.
// Mutation: addItem / updateQuantity / removeItem each fire an async upsert /
//          delete in the background.
// Logout:  clearLocalOnly() wipes local state; the Supabase rows are kept so
//          the cart is still there when the user logs back in.
// Explicit clear (e.g. after placing an order): clearCart() wipes both local
//          state and the remote rows.

import { create } from 'zustand';
import type { CartItem, MenuItem } from '@/types';
import { getDeliveryFee } from '@/utils/orderPricing';
import { cartService } from '@/services/cartService';

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

  // The authenticated user ID — set by _layout.tsx after sign-in so background
  // sync knows who owns the cart.
  _userId: string | null;

  // Actions
  addItem: (menuItem: MenuItem, quantity?: number, notes?: string, restaurantName?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setTip: (tip: number) => void;
  applyPromoCode: (code: string, discount: number) => void;
  removePromoCode: () => void;
  /** Clear cart AND remote rows (e.g. after placing an order). */
  clearCart: () => void;
  /** Wipe local state only — keep Supabase rows so the cart survives logout. */
  clearLocalOnly: () => void;
  setCheckoutScrollTo: (target: 'payment' | null) => void;

  /** Called by _layout.tsx after sign-in: fetches persisted cart from Supabase
   *  and replaces local state.  Silently no-ops if userId is falsy. */
  loadFromRemote: (userId: string) => Promise<void>;
  /** Tracks which user owns the local cart (used by background sync). */
  setUserId: (userId: string | null) => void;
}

function calcTotals(items: CartItem[], tip: number, discount: number) {
  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  return {
    subtotal,
    deliveryFee: getDeliveryFee(subtotal),
    totalAmount: Math.max(0, subtotal - discount) + tip,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

/** Best-effort remote sync — log on failure, never throw. */
function syncSilently(fn: () => Promise<void>) {
  fn().catch((err) => {
    console.warn('[Cravio] Cart remote sync failed:', err?.message ?? err);
  });
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
  _userId: null,

  setUserId: (userId) => set({ _userId: userId }),

  addItem: (menuItem, quantity = 1, notes, restaurantName) => {
    set((state) => {
      const existing = state.items.find((item) => item.menuItem.id === menuItem.id);
      const items = existing
        ? state.items.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  notes: notes ?? item.notes,
                  totalPrice: item.menuItem.price * (item.quantity + quantity),
                }
              : item,
          )
        : [
            ...state.items,
            {
              id: `${menuItem.id}_${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
              menuItem,
              quantity,
              selectedCustomizations: {},
              notes,
              totalPrice: menuItem.price * quantity,
            },
          ];

      const newRestaurantName = restaurantName ?? state.restaurantName;

      // Background sync — upsert the final quantity for this food item
      const userId = state._userId;
      if (userId) {
        const newQty = existing
          ? (existing.quantity + quantity)
          : quantity;
        syncSilently(() =>
          cartService.upsertItem(userId, {
            food_id: menuItem.id,
            quantity: newQty,
            restaurant_id: menuItem.restaurantId ?? null,
            restaurant_name: newRestaurantName ?? null,
            food_name: menuItem.name,
            food_price: menuItem.price,
            food_image: menuItem.imageUrl ?? menuItem.imageUri ?? null,
            notes: notes ?? null,
          })
        );
      }

      return {
        items,
        restaurantId: menuItem.restaurantId,
        restaurantName: newRestaurantName,
        ...calcTotals(items, state.tip, state.promoDiscount),
      };
    });
  },

  removeItem: (cartItemId) => {
    set((state) => {
      const target = state.items.find((i) => i.id === cartItemId);
      const items = state.items.filter((i) => i.id !== cartItemId);

      // Background sync
      const userId = state._userId;
      if (userId && target) {
        syncSilently(() => cartService.removeItem(userId, target.menuItem.id));
      }

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
        const target = state.items.find((i) => i.id === cartItemId);
        const items = state.items.filter((i) => i.id !== cartItemId);

        const userId = state._userId;
        if (userId && target) {
          syncSilently(() => cartService.removeItem(userId, target.menuItem.id));
        }

        return {
          items,
          restaurantId: items.length === 0 ? null : state.restaurantId,
          ...calcTotals(items, state.tip, state.promoDiscount),
        };
      }

      const items = state.items.map((i) =>
        i.id === cartItemId
          ? { ...i, quantity, totalPrice: i.menuItem.price * quantity }
          : i
      );

      // Background sync
      const userId = state._userId;
      const updated = items.find((i) => i.id === cartItemId);
      if (userId && updated) {
        syncSilently(() =>
          cartService.upsertItem(userId, {
            food_id: updated.menuItem.id,
            quantity,
            restaurant_id: updated.menuItem.restaurantId ?? null,
            restaurant_name: state.restaurantName ?? null,
            food_name: updated.menuItem.name,
            food_price: updated.menuItem.price,
            food_image: updated.menuItem.imageUrl ?? updated.menuItem.imageUri ?? null,
            notes: updated.notes ?? null,
          })
        );
      }

      return { items, ...calcTotals(items, state.tip, state.promoDiscount) };
    });
  },

  setTip: (tip) => {
    set((state) => ({
      tip,
      totalAmount: Math.max(0, state.subtotal - state.promoDiscount) + tip,
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

  clearCart: () => {
    // Remote clear
    const userId = get()._userId;
    if (userId) {
      syncSilently(() => cartService.clearCart(userId));
    }

    set({
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
      // checkoutScrollTo intentionally NOT cleared here
    });
  },

  clearLocalOnly: () =>
    set({
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
    }),

  setCheckoutScrollTo: (target) => set({ checkoutScrollTo: target }),

  loadFromRemote: async (userId) => {
    if (!userId) return;
    try {
      const rows = await cartService.getCartItems(userId);
      if (rows.length === 0) return;

      // Reconstruct CartItems from the persisted rows.
      // The stored metadata (food_name, food_price, etc.) is enough to display
      // items and calculate totals.  Full MenuItem details are restored when the
      // user visits the restaurant page again.
      const items: CartItem[] = rows.map((row) => {
        const menuItem: MenuItem = {
          id: row.food_id,
          restaurantId: row.restaurant_id ?? '',
          name: row.food_name,
          description: '',
          price: row.food_price,
          imageUrl: row.food_image ?? '',
          category: '',
          tags: [],
          isAvailable: true,
          isPopular: false,
        };
        return {
          id: `${row.food_id}_restored`,
          menuItem,
          quantity: row.quantity,
          selectedCustomizations: {},
          notes: row.notes ?? undefined,
          totalPrice: row.food_price * row.quantity,
        };
      });

      // Determine restaurantId / restaurantName from the first row
      const firstRow = rows[0];
      const restaurantId = firstRow?.restaurant_id ?? null;
      const restaurantName = firstRow?.restaurant_name ?? null;

      set({
        items,
        restaurantId,
        restaurantName,
        tip: 0,
        promoCode: null,
        promoDiscount: 0,
        ...calcTotals(items, 0, 0),
      });
    } catch (err) {
      console.warn('[Cravio] Failed to load cart from remote:', err instanceof Error ? err.message : err);
    }
  },
}));
