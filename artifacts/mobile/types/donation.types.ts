// ─── Donation domain types ────────────────────────────────────────────────────

export type DonationPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DbDonation {
  id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  payment_status: DonationPaymentStatus;
  transaction_id: string | null;
  payment_method: string;
  created_at: string;
  customer_name?: string | null;
  customer_email?: string | null;
}

export interface DbDonationWithdrawal {
  id: string;
  amount: number;
  status: 'requested' | 'approved' | 'completed' | 'rejected';
  requested_at: string;
  completed_at: string | null;
}

export interface DbDonationUtilization {
  id: string;
  amount: number;
  purpose: string;
  beneficiary_count: number | null;
  status: 'planned' | 'approved' | 'completed' | 'cancelled';
  utilized_at: string | null;
  created_at: string;
}

export interface DonationManagementSnapshot {
  totalDonations: number;
  todaysDonations: number;
  monthlyDonations: number;
  yearlyDonations: number;
  walletBalance: number;
  donationCollection: number;
  donationBalance: number;
  donationUtilized: number;
  remainingBalance: number;
  recentDonations: DbDonation[];
  withdrawalHistory: DbDonationWithdrawal[];
  utilizationRecords: DbDonationUtilization[];
}