// ─── Auth Service ─────────────────────────────────────────────────────────────
// All Supabase redirects use the app's registered deep-link scheme ("cravio")
// so that email verification, password-reset, and OAuth callbacks open the
// native app — never a browser or a Replit preview URL.
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

// Required for OAuth on native — must be called before any OAuth attempt.
WebBrowser.maybeCompleteAuthSession();

// The deep-link URL that every Supabase redirect should return to.
// Must be added to the Supabase dashboard → Authentication → URL Configuration:
//   Redirect URLs: cravio://auth/callback
// The Site URL in the dashboard can be set to any valid HTTPS URL (e.g. your
// production web domain, or https://supabase.com as a safe placeholder); the
// mobile app never relies on it — it always passes an explicit redirectTo.
const APP_CALLBACK_URL = 'cravio://auth/callback';

export const authService = {
  /** Sign up with email + password.
   *  Returns { user, session }. Session is null when email confirmation is required.
   *  The verification email will deep-link back to the app, not to a web URL.
   */
  async signUp(email: string, password: string, name: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name, phone },
        // Without this, Supabase falls back to its dashboard Site URL, which
        // may still be set to a Replit preview URL from initial setup.
        emailRedirectTo: APP_CALLBACK_URL,
      },
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

  /** Sign in with Google OAuth. Opens browser, resolves when auth is complete.
   *  Uses the native app scheme so the OS intercepts the callback and returns
   *  control to the app rather than a browser tab or Replit URL.
   */
  async signInWithGoogle(): Promise<void> {
    const redirectTo = APP_CALLBACK_URL;

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
      // User cancelled — not a hard error, just return without throwing so the
      // caller can decide whether to show a message.
      return;
    }

    // Extract tokens from the redirect URL fragment/query and establish session.
    // Supabase appends tokens as a hash fragment: cravio://auth/callback#access_token=...
    const url = result.url;
    const fragment = url.includes('#') ? url.split('#')[1] : url.split('?')[1] ?? '';
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw new Error(sessionError.message);
    } else {
      throw new Error('Google sign-in succeeded but no tokens were returned.');
    }
  },

  /** Sign out the current user. */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  /** Send a password-reset email.
   *  The link will deep-link back to the app (cravio://auth/callback) so the
   *  user is never redirected to a web URL that doesn't exist.
   */
  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: APP_CALLBACK_URL }
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
      options: { emailRedirectTo: APP_CALLBACK_URL },
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

  /** Parse a deep-link URL (cravio://auth/callback#...) and exchange the
   *  embedded tokens for a live Supabase session.  Called from the root layout
   *  whenever the OS delivers an incoming link to the app.
   */
  async handleDeepLink(url: string): Promise<boolean> {
    if (!url.startsWith('cravio://auth/callback')) return false;

    const fragment = url.includes('#') ? url.split('#')[1] : url.split('?')[1] ?? '';
    const params = new URLSearchParams(fragment);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type'); // 'signup', 'recovery', 'magiclink', etc.

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        console.error('[Cravio] Deep-link session error:', error.message);
        return false;
      }
      console.log('[Cravio] Deep-link auth success, type:', type ?? 'unknown');
      return true;
    }

    // Token-less callback (e.g. PKCE code flow) — let Supabase handle it.
    const code = params.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('[Cravio] Code exchange error:', error.message);
        return false;
      }
      return true;
    }

    return false;
  },
};
