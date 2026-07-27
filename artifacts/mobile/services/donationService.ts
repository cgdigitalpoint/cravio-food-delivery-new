// ─── Donation Service ─────────────────────────────────────────────────────────
// Donations are persisted in their own wallet ledger and never share settlement
// tables with restaurants, delivery partners, or platform commissions.

import { supabase } from './supabase';
import type {
  DbDonation,
  DonationManagementSnapshot,
} from '@/types/donation.types';

export const donationService = {
  async getDonationHistory(userId: string): Promise<DbDonation[]> {
    const { data, error } = await supabase
      .from('donation_wallet_entries')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as DbDonation[];
  },

  async getDonationByOrderId(orderId: string): Promise<DbDonation | null> {
    const { data, error } = await supabase
      .from('donation_wallet_entries')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data ?? null) as DbDonation | null;
  },

  /**
   * This endpoint is intentionally admin-claim protected in SQL. It is the
   * stable data contract the future full Admin Panel can consume.
   */
  async getManagementSnapshot(): Promise<DonationManagementSnapshot> {
    const { data, error } = await supabase.rpc('get_donation_management_snapshot');
    if (error) throw new Error(error.message);
    return data as DonationManagementSnapshot;
  },
};