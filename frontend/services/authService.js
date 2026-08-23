// frontend/services/authService.js

import { supabase } from "../lib/supabase";

export const authService = {
  // ==================== SIGN UP ====================
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name || "",
          phone: userData.phone || "",
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // ==================== SIGN IN ====================
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // ==================== SIGN OUT ====================
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // ==================== GET CURRENT USER ====================
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // ==================== GET SESSION ====================
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // ==================== RESET PASSWORD ====================
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  // ==================== UPDATE USER ====================
  async updateUser(updates) {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },
};
