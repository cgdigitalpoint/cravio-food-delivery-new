// ─── Address Store (Zustand) ──────────────────────────────────────────────────
import { create } from 'zustand';
import { addressService } from '@/services/addressService';
import type { DbAddress } from '@/types/db.types';

interface AddressStoreState {
  addresses: DbAddress[];
  isLoading: boolean;
  error: string | null;

  fetchAddresses: (userId: string) => Promise<void>;
  createAddress: (userId: string, address: Omit<DbAddress, 'id' | 'user_id'>) => Promise<void>;
  updateAddress: (addressId: string, userId: string, updates: Partial<Omit<DbAddress, 'id' | 'user_id'>>) => Promise<void>;
  deleteAddress: (addressId: string, userId: string) => Promise<void>;
  setDefault: (addressId: string, userId: string) => Promise<void>;
  getDefault: () => DbAddress | undefined;
  clearAddresses: () => void;
}

export const useAddressStore = create<AddressStoreState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await addressService.getAddresses(userId);
      set({ addresses, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load addresses.', isLoading: false });
    }
  },

  createAddress: async (userId, address) => {
    set({ isLoading: true, error: null });
    try {
      const created = await addressService.createAddress(userId, address);
      set((state) => ({
        addresses: address.is_default
          ? [created, ...state.addresses.map((a) => ({ ...a, is_default: false }))]
          : [...state.addresses, created],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save address.', isLoading: false });
      throw err;
    }
  },

  updateAddress: async (addressId, userId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await addressService.updateAddress(addressId, userId, updates);
      set((state) => ({
        addresses: state.addresses.map((a) => {
          if (updates.is_default && a.id !== addressId) return { ...a, is_default: false };
          return a.id === addressId ? updated : a;
        }),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update address.', isLoading: false });
      throw err;
    }
  },

  deleteAddress: async (addressId, userId) => {
    const prev = get().addresses;
    set({ addresses: prev.filter((a) => a.id !== addressId) });
    try {
      await addressService.deleteAddress(addressId, userId);
    } catch (err) {
      set({ addresses: prev, error: err instanceof Error ? err.message : 'Failed to delete address.' });
      throw err;
    }
  },

  setDefault: async (addressId, userId) => {
    try {
      await addressService.setDefault(addressId, userId);
      set((state) => ({
        addresses: state.addresses.map((a) => ({ ...a, is_default: a.id === addressId })),
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to set default.' });
      throw err;
    }
  },

  getDefault: () => get().addresses.find((a) => a.is_default),
  clearAddresses: () => set({ addresses: [], error: null }),
}));
