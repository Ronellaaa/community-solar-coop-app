// frontend/services/authService.js

import { supabase } from "../lib/supabase";

export const authService = {
  // ==================== SIGN UP ====================
  async signUp(email, password, userData = {}) {
    console.log("🔄 authService: signUp called with:", { email, userData });

    try {
      // Step 1: Create auth user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              name: userData.name || "",
              phone: userData.phone || "",
            },
          },
        },
      );

      if (signUpError) {
        console.error("❌ authService: signUp error:", signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      console.log("✅ authService: Auth user created:", authData.user.id);

      // The database trigger creates the public.users profile automatically.
      return { user: authData.user };
    } catch (error) {
      console.error("❌ authService: signUp error:", error);
      throw error;
    }
  },

  // ==================== SIGN IN ====================
  async signIn(email, password) {
    console.log("🔄 authService: signIn called with:", { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ authService: signIn error:", error);
      throw error;
    }

    console.log("✅ authService: signIn successful");
    return data;
  },

  // ==================== SIGN OUT ====================
  async signOut() {
    console.log("🔄 authService: signOut called");

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ authService: signOut error:", error);
      throw error;
    }

    console.log("✅ authService: signOut successful");
  },

  // ==================== GET CURRENT USER ====================
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get the user record from your custom users table
    const { data: userRecord, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ authService: Error fetching user record:", error);
      return user; // Return auth user as fallback
    }

    return userRecord || user;
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
