// ─── Donations API contract ───────────────────────────────────────────────────
// Runtime persistence is implemented by services/donationService.ts so the
// mobile app uses the authenticated Supabase client and RLS policies.

import type {
  DbDonation,
  DonationManagementSnapshot,
} from '@/types/donation.types';

export interface CreateDonationPayload {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

export interface DonationHistoryResponse {
  data: DbDonation[];
  error: string | null;
}

export interface DonationManagementResponse {
  data: DonationManagementSnapshot | null;
  error: string | null;
}