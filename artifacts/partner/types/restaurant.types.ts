// ─── Restaurant Partner Types ─────────────────────────────────────────────────

export type ApprovalStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type DocumentType =
  | 'fssai'
  | 'gst_certificate'
  | 'pan_card'
  | 'shop_act'
  | 'other';

export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export type AccountType = 'savings' | 'current';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// ── Entities ──────────────────────────────────────────────────────────────────

export interface RestaurantPartner {
  id: string;              // matches auth.users(id)
  name: string;
  email: string;
  phone: string | null;
  approval_status: ApprovalStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerRestaurant {
  id: string;
  partner_id: string;
  name: string;
  description: string | null;
  cuisine_type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  logo_url: string | null;
  is_open: boolean;
  min_order: number;
  avg_delivery_time: number;
  delivery_fee: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantDocument {
  id: string;
  restaurant_id: string;
  document_type: DocumentType;
  document_url: string;
  status: DocumentStatus;
  rejection_reason: string | null;
  created_at: string;
}

export interface BankDetails {
  id: string;
  restaurant_id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch: string;
  account_type: AccountType;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GSTDetails {
  id: string;
  restaurant_id: string;
  gst_number: string;
  business_name: string;
  business_address: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessHour {
  id: string;
  restaurant_id: string;
  day: DayOfWeek;
  is_open: boolean;
  open_time: string;   // "HH:MM"
  close_time: string;  // "HH:MM"
}
