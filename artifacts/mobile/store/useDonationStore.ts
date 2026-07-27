// ─── Donation Store ───────────────────────────────────────────────────────────
import { create } from 'zustand';
import { donationService } from '@/services/donationService';
import type { DbDonation, DonationManagementSnapshot } from '@/types/donation.types';

interface DonationStoreState {
  donations: DbDonation[];
  managementSnapshot: DonationManagementSnapshot | null;
  isLoading: boolean;
  error: string | null;
  fetchDonations: (userId: string) => Promise<void>;
  fetchManagementSnapshot: () => Promise<void>;
  clearDonations: () => void;
}

export const useDonationStore = create<DonationStoreState>((set) => ({
  donations: [],
  managementSnapshot: null,
  isLoading: false,
  error: null,

  fetchDonations: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const donations = await donationService.getDonationHistory(userId);
      set({ donations, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unable to load donation history.',
      });
    }
  },

  fetchManagementSnapshot: async () => {
    set({ isLoading: true, error: null });
    try {
      const managementSnapshot = await donationService.getManagementSnapshot();
      set({ managementSnapshot, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unable to load donation management data.',
      });
    }
  },

  clearDonations: () => set({ donations: [], managementSnapshot: null, error: null }),
}));