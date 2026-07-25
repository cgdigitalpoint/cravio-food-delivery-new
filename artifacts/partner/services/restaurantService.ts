// ─── Restaurant Service ───────────────────────────────────────────────────────
import { supabase } from './supabase';
import type {
  PartnerRestaurant,
  RestaurantDocument,
  BankDetails,
  GSTDetails,
  BusinessHour,
  DocumentType,
} from '@/types/restaurant.types';

export const restaurantService = {
  // ── Restaurant Profile ──────────────────────────────────────────────────────
  async getRestaurant(partnerId: string): Promise<PartnerRestaurant | null> {
    const { data, error } = await supabase
      .from('partner_restaurants')
      .select('*')
      .eq('partner_id', partnerId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data as PartnerRestaurant;
  },

  async upsertRestaurant(
    partnerId: string,
    restaurant: Partial<Omit<PartnerRestaurant, 'id' | 'partner_id' | 'created_at' | 'updated_at'>>
  ): Promise<PartnerRestaurant> {
    const { data: existing } = await supabase
      .from('partner_restaurants')
      .select('id')
      .eq('partner_id', partnerId)
      .single();

    const payload = {
      ...restaurant,
      partner_id: partnerId,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { data, error } = await supabase
        .from('partner_restaurants')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as PartnerRestaurant;
    } else {
      const { data, error } = await supabase
        .from('partner_restaurants')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as PartnerRestaurant;
    }
  },

  async toggleOpen(restaurantId: string, isOpen: boolean): Promise<void> {
    const { error } = await supabase
      .from('partner_restaurants')
      .update({ is_open: isOpen, updated_at: new Date().toISOString() })
      .eq('id', restaurantId);
    if (error) throw new Error(error.message);
  },

  // ── Documents ───────────────────────────────────────────────────────────────
  async getDocuments(restaurantId: string): Promise<RestaurantDocument[]> {
    const { data, error } = await supabase
      .from('restaurant_documents')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as RestaurantDocument[];
  },

  async upsertDocument(
    restaurantId: string,
    documentType: DocumentType,
    documentUrl: string
  ): Promise<RestaurantDocument> {
    const { data: existing } = await supabase
      .from('restaurant_documents')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('document_type', documentType)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('restaurant_documents')
        .update({ document_url: documentUrl, status: 'pending', rejection_reason: null })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as RestaurantDocument;
    } else {
      const { data, error } = await supabase
        .from('restaurant_documents')
        .insert({
          restaurant_id: restaurantId,
          document_type: documentType,
          document_url: documentUrl,
          status: 'pending',
          rejection_reason: null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as RestaurantDocument;
    }
  },

  // ── Bank Details ─────────────────────────────────────────────────────────────
  async getBankDetails(restaurantId: string): Promise<BankDetails | null> {
    const { data, error } = await supabase
      .from('bank_details')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data as BankDetails;
  },

  async upsertBankDetails(
    restaurantId: string,
    details: Omit<BankDetails, 'id' | 'restaurant_id' | 'is_verified' | 'created_at' | 'updated_at'>
  ): Promise<BankDetails> {
    const { data: existing } = await supabase
      .from('bank_details')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('bank_details')
        .update({ ...details, is_verified: false, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as BankDetails;
    } else {
      const { data, error } = await supabase
        .from('bank_details')
        .insert({
          restaurant_id: restaurantId,
          ...details,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as BankDetails;
    }
  },

  // ── GST Details ──────────────────────────────────────────────────────────────
  async getGSTDetails(restaurantId: string): Promise<GSTDetails | null> {
    const { data, error } = await supabase
      .from('gst_details')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data as GSTDetails;
  },

  async upsertGSTDetails(
    restaurantId: string,
    details: Omit<GSTDetails, 'id' | 'restaurant_id' | 'is_verified' | 'created_at' | 'updated_at'>
  ): Promise<GSTDetails> {
    const { data: existing } = await supabase
      .from('gst_details')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('gst_details')
        .update({ ...details, is_verified: false, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as GSTDetails;
    } else {
      const { data, error } = await supabase
        .from('gst_details')
        .insert({
          restaurant_id: restaurantId,
          ...details,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as GSTDetails;
    }
  },

  // ── Business Hours ───────────────────────────────────────────────────────────
  async getBusinessHours(restaurantId: string): Promise<BusinessHour[]> {
    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .eq('restaurant_id', restaurantId);
    if (error) throw new Error(error.message);
    return (data ?? []) as BusinessHour[];
  },

  async upsertBusinessHours(
    restaurantId: string,
    hours: Array<Omit<BusinessHour, 'id' | 'restaurant_id'>>
  ): Promise<void> {
    const rows = hours.map((h) => ({ restaurant_id: restaurantId, ...h }));
    const { error } = await supabase
      .from('business_hours')
      .upsert(rows, { onConflict: 'restaurant_id,day' });
    if (error) throw new Error(error.message);
  },
};
