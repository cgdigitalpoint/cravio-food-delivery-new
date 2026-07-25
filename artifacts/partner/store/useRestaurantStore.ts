// ─── Restaurant Store ─────────────────────────────────────────────────────────
import { create } from 'zustand';
import { restaurantService } from '@/services/restaurantService';
import type {
  PartnerRestaurant,
  RestaurantDocument,
  BankDetails,
  GSTDetails,
  BusinessHour,
  DocumentType,
} from '@/types/restaurant.types';

interface RestaurantState {
  restaurant: PartnerRestaurant | null;
  documents: RestaurantDocument[];
  bankDetails: BankDetails | null;
  gstDetails: GSTDetails | null;
  businessHours: BusinessHour[];
  isLoading: boolean;
  error: string | null;

  loadRestaurant: (partnerId: string) => Promise<void>;
  saveRestaurant: (
    partnerId: string,
    data: Partial<Omit<PartnerRestaurant, 'id' | 'partner_id' | 'created_at' | 'updated_at'>>
  ) => Promise<void>;
  toggleOpen: (isOpen: boolean) => Promise<void>;

  loadDocuments: () => Promise<void>;
  saveDocument: (documentType: DocumentType, documentUrl: string) => Promise<void>;

  loadBankDetails: () => Promise<void>;
  saveBankDetails: (
    details: Omit<BankDetails, 'id' | 'restaurant_id' | 'is_verified' | 'created_at' | 'updated_at'>
  ) => Promise<void>;

  loadGSTDetails: () => Promise<void>;
  saveGSTDetails: (
    details: Omit<GSTDetails, 'id' | 'restaurant_id' | 'is_verified' | 'created_at' | 'updated_at'>
  ) => Promise<void>;

  loadBusinessHours: () => Promise<void>;
  saveBusinessHours: (hours: Array<Omit<BusinessHour, 'id' | 'restaurant_id'>>) => Promise<void>;

  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurant: null,
  documents: [],
  bankDetails: null,
  gstDetails: null,
  businessHours: [],
  isLoading: false,
  error: null,

  setError: (error) => set({ error }),
  reset: () =>
    set({ restaurant: null, documents: [], bankDetails: null, gstDetails: null, businessHours: [], isLoading: false, error: null }),

  loadRestaurant: async (partnerId) => {
    set({ isLoading: true, error: null });
    try {
      const restaurant = await restaurantService.getRestaurant(partnerId);
      set({ restaurant, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load restaurant.', isLoading: false });
    }
  },

  saveRestaurant: async (partnerId, data) => {
    set({ isLoading: true, error: null });
    try {
      const restaurant = await restaurantService.upsertRestaurant(partnerId, data);
      set({ restaurant, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save restaurant.', isLoading: false });
      throw err;
    }
  },

  toggleOpen: async (isOpen) => {
    const { restaurant } = get();
    if (!restaurant) return;
    // Optimistic update
    set({ restaurant: { ...restaurant, is_open: isOpen } });
    try {
      await restaurantService.toggleOpen(restaurant.id, isOpen);
    } catch (err) {
      // Revert on failure
      set({ restaurant: { ...restaurant, is_open: !isOpen } });
      throw err;
    }
  },

  loadDocuments: async () => {
    const { restaurant } = get();
    if (!restaurant) return;
    set({ isLoading: true, error: null });
    try {
      const documents = await restaurantService.getDocuments(restaurant.id);
      set({ documents, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load documents.', isLoading: false });
    }
  },

  saveDocument: async (documentType, documentUrl) => {
    const { restaurant } = get();
    if (!restaurant) throw new Error('No restaurant linked.');
    const doc = await restaurantService.upsertDocument(restaurant.id, documentType, documentUrl);
    set((s) => ({
      documents: s.documents.some((d) => d.document_type === documentType)
        ? s.documents.map((d) => (d.document_type === documentType ? doc : d))
        : [...s.documents, doc],
    }));
  },

  loadBankDetails: async () => {
    const { restaurant } = get();
    if (!restaurant) return;
    try {
      const bankDetails = await restaurantService.getBankDetails(restaurant.id);
      set({ bankDetails });
    } catch (err) {
      console.warn('[Partner] Bank details load error:', err);
    }
  },

  saveBankDetails: async (details) => {
    const { restaurant } = get();
    if (!restaurant) throw new Error('No restaurant linked.');
    set({ isLoading: true, error: null });
    try {
      const bankDetails = await restaurantService.upsertBankDetails(restaurant.id, details);
      set({ bankDetails, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save bank details.', isLoading: false });
      throw err;
    }
  },

  loadGSTDetails: async () => {
    const { restaurant } = get();
    if (!restaurant) return;
    try {
      const gstDetails = await restaurantService.getGSTDetails(restaurant.id);
      set({ gstDetails });
    } catch (err) {
      console.warn('[Partner] GST details load error:', err);
    }
  },

  saveGSTDetails: async (details) => {
    const { restaurant } = get();
    if (!restaurant) throw new Error('No restaurant linked.');
    set({ isLoading: true, error: null });
    try {
      const gstDetails = await restaurantService.upsertGSTDetails(restaurant.id, details);
      set({ gstDetails, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save GST details.', isLoading: false });
      throw err;
    }
  },

  loadBusinessHours: async () => {
    const { restaurant } = get();
    if (!restaurant) return;
    try {
      const businessHours = await restaurantService.getBusinessHours(restaurant.id);
      set({ businessHours });
    } catch (err) {
      console.warn('[Partner] Business hours load error:', err);
    }
  },

  saveBusinessHours: async (hours) => {
    const { restaurant } = get();
    if (!restaurant) throw new Error('No restaurant linked.');
    set({ isLoading: true, error: null });
    try {
      await restaurantService.upsertBusinessHours(restaurant.id, hours);
      const hydrated: BusinessHour[] = hours.map((h) => ({
        ...h,
        id: '',
        restaurant_id: restaurant.id,
      }));
      set({ businessHours: hydrated, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save business hours.', isLoading: false });
      throw err;
    }
  },
}));
