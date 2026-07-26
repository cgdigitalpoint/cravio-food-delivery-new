// ─── Auth Service ─────────────────────────────────────────────────────────────
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

// Required for OAuth on native
WebBrowser.maybeCompleteAuthSession();

export const authService = {
  /** Sign up with email + password.
   *  Returns { user, session }. Session is null when email confirmation is required.
   */
  async signUp(email: string, password: string, name: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: name, phone } },
    });
    if (error) throw new Error(error.message);

    // Profile is created automatically by a database trigger (handle_new_user).
    // If no trigger is set up, we attempt a manual upsert only when we have a
    // confirmed session (otherwise the RLS would block the insert).
    if (data.user && data.session) {
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

  /** Sign in with Google OAuth. Opens browser, resolves when auth is complete. */
  async signInWithGoogle(): Promise<void> {
    const redirectTo = Linking.createURL('/auth/callback');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw new Error(error.message);
    if (!data.url) throw new Error('No OAuth URL returned from Supabase.');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') {
      throw new Error('Google sign-in was cancelled or failed.');
    }

    // Extract the tokens from the redirect URL and set the session
    const url = result.url;
    const params = new URLSearchParams(url.split('#')[1] ?? url.split('?')[1] ?? '');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    }
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

  /** Resend the email verification link. */
  async resendVerification(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    });
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
