// frontend/services/authService.js

import { supabase } from "../lib/supabase";

export const authService = {
  // =====================================================
  // SIGN UP
  // =====================================================

  async signUp(email, password, userData = {}) {
    console.log("🔄 authService: signUp called with:", {
      email,
      userData,
    });

    try {
      const isInstaller = userData.userType === "installer";

      // Create user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              name: userData.name || "",
              phone: userData.phone || "",
              // ✅ Pass these so the DB trigger can use them
              role: isInstaller ? "installer" : "user",
              is_community_member: !isInstaller,
            },
          },
        },
      );

      if (signUpError) {
        console.error("❌ authService: signUp error:", signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user.");
      }

      console.log("✅ authService: Auth user created:", authData.user.id);

      /*
       * Your database trigger creates the public.users record.
       * It reads role and is_community_member from raw_user_meta_data.
       */

      // ✅ If installer, also create the installers record
      if (isInstaller) {
        // Convert years range to a number
        const yearsMap = {
          "0-5": 3,
          "5-10": 7,
          "10-20": 15,
          "20+": 25,
        };
        const yearsNumber = yearsMap[userData.yearsInBusiness] || 0;

        const { error: installerError } = await supabase
          .from("installers")
          .insert([
            {
              id: authData.user.id,
              name: userData.companyName || userData.name,
              logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.companyName || "Company")}&background=1A5C4A&color=fff&size=128`,
              rating: 0,
              years_in_business: yearsNumber,
              is_verified: false,
            },
          ]);

        if (installerError) {
          console.error(
            "❌ authService: Installer insert failed:",
            installerError,
          );
          throw new Error(
            `Failed to create installer: ${installerError.message}`,
          );
        }

        console.log("✅ authService: Installer record created");
      }

      return {
        user: authData.user,
      };
    } catch (error) {
      console.error("❌ authService: signUp error:", error);
      throw error;
    }
  },

  // =====================================================
  // SIGN IN
  // =====================================================

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

  // =====================================================
  // SIGN OUT
  // =====================================================

  async signOut() {
    console.log("🔄 authService: signOut called");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ authService: signOut error:", error);
      throw error;
    }

    console.log("✅ authService: signOut successful");
  },

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  async getCurrentUser() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Error getting authenticated user:", authError);
      throw authError;
    }

    if (!user) {
      return null;
    }

    const { data: userRecord, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ authService: Error fetching user record:", error);
      return { ...user, role: "user" };
    }

    return userRecord || { ...user, role: "user" };
  },

  // =====================================================
  // GET USER ROLE
  // =====================================================

  async getUserRole(userId) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Error fetching user role:", error);
      throw error;
    }

    const role =
      typeof data?.role === "string" ? data.role.trim().toLowerCase() : null;

    console.log("🔐 Database role:", role);
    return role || "user";
  },

  // =====================================================
  // GET SESSION
  // =====================================================

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  // =====================================================
  // UPDATE USER
  // =====================================================

  async updateUser(updates) {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },
};
