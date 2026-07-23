// ─── Address Service ──────────────────────────────────────────────────────────
import { supabase } from './supabase';
import type { DbAddress } from '@/types/db.types';

export const addressService = {
  /** Fetch all addresses for a user. */
  async getAddresses(userId: string): Promise<DbAddress[]> {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as DbAddress[];
  },

  /** Create a new address. */
  async createAddress(
    userId: string,
    address: Omit<DbAddress, 'id' | 'user_id'>
  ): Promise<DbAddress> {
    // If this is set as default, clear other defaults first
    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...address, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DbAddress;
  },

  /** Update an existing address. */
  async updateAddress(
    addressId: string,
    userId: string,
    updates: Partial<Omit<DbAddress, 'id' | 'user_id'>>
  ): Promise<DbAddress> {
    if (updates.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DbAddress;
  },

  /** Delete an address. */
  async deleteAddress(addressId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },

  /** Set an address as the default. */
  async setDefault(addressId: string, userId: string): Promise<void> {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },
};
