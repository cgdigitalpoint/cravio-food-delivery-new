// ─── Partner Auth Service ─────────────────────────────────────────────────────
import { supabase } from './supabase';
import type { RestaurantPartner } from '@/types/restaurant.types';

export const partnerAuthService = {
  async signUp(email: string, password: string, name: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: name, role: 'restaurant_partner' } },
    });
    if (error) throw new Error(error.message);

    if (data.user) {
      const { error: profileError } = await supabase
        .from('restaurant_partners')
        .upsert({
          id: data.user.id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() ?? null,
          approval_status: 'pending',
          rejection_reason: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      if (profileError) {
        console.warn('[Partner] Profile upsert error:', profileError.message);
      }
    }
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase()
    );
    if (error) throw new Error(error.message);
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  },

  async getPartnerProfile(userId: string): Promise<RestaurantPartner | null> {
    const { data, error } = await supabase
      .from('restaurant_partners')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data as RestaurantPartner;
  },

  async updatePartnerProfile(
    userId: string,
    updates: Partial<Pick<RestaurantPartner, 'name' | 'phone'>>
  ): Promise<RestaurantPartner> {
    const { data, error } = await supabase
      .from('restaurant_partners')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as RestaurantPartner;
  },
};
