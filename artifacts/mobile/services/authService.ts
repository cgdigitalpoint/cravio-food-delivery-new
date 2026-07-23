// ─── Auth Service ─────────────────────────────────────────────────────────────
import { supabase } from './supabase';

export const authService = {
  /** Sign up with email + password. Inserts a profile row after creation. */
  async signUp(email: string, password: string, name: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: name, phone } },
    });
    if (error) throw new Error(error.message);

    if (data.user) {
      const { error: profileError } = await supabase.from('users').upsert({
        id: data.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() ?? null,
        created_at: new Date().toISOString(),
      });
      if (profileError) {
        console.warn('[Cravio] Profile upsert error:', profileError.message);
      }
    }

    return data;
  },

  /** Sign in with email + password. */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  /** Sign out the current user. */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  /** Send a password-reset email. */
  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase()
    );
    if (error) throw new Error(error.message);
  },

  /** Update the authenticated user's password (call after clicking reset link). */
  async resetPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  },

  /** Get the current active session (null if not authenticated). */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  },

  /** Subscribe to auth state changes. Returns an unsubscribe function. */
  onAuthStateChange(
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
  ) {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  },
};
