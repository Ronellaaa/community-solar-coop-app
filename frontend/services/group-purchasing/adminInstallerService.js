// frontend/services/group-purchasing/adminInstallerService.js

import { supabase } from "../../lib/supabase";

export const adminInstallerService = {
  // =====================================================
  // GET ALL INSTALLERS (pending + verified)
  // =====================================================
  async getAllInstallers() {
    console.log("🔄 adminInstallerService: Fetching all installers...");

    const { data, error } = await supabase
      .from("installers")
      .select("*")
      .order("is_verified", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "❌ adminInstallerService: Error fetching installers:",
        error,
      );
      throw error;
    }

    console.log(
      "📦 adminInstallerService: Installers fetched:",
      data?.length || 0,
    );
    return data || [];
  },

  // =====================================================
  // GET PENDING INSTALLERS (is_verified = false)
  // =====================================================
  async getPendingInstallers() {
    console.log("🔄 adminInstallerService: Fetching pending installers...");

    const { data, error } = await supabase
      .from("installers")
      .select("*")
      .eq("is_verified", false)
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "❌ adminInstallerService: Error fetching pending installers:",
        error,
      );
      throw error;
    }

    console.log(
      "📦 adminInstallerService: Pending installers:",
      data?.length || 0,
    );
    return data || [];
  },

  // =====================================================
  // GET VERIFIED INSTALLERS (is_verified = true)
  // =====================================================
  async getVerifiedInstallers() {
    console.log("🔄 adminInstallerService: Fetching verified installers...");

    const { data, error } = await supabase
      .from("installers")
      .select("*")
      .eq("is_verified", true)
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "❌ adminInstallerService: Error fetching verified installers:",
        error,
      );
      throw error;
    }

    console.log(
      "📦 adminInstallerService: Verified installers:",
      data?.length || 0,
    );
    return data || [];
  },

  // =====================================================
  // VERIFY INSTALLER (set is_verified = true)
  // =====================================================
  async verifyInstaller(installerId) {
    console.log("🔄 adminInstallerService: Verifying installer:", installerId);

    const { data, error } = await supabase
      .from("installers")
      .update({ is_verified: true })
      .eq("id", installerId)
      .select()
      .single();

    if (error) {
      console.error(
        "❌ adminInstallerService: Error verifying installer:",
        error,
      );
      throw error;
    }

    console.log("✅ adminInstallerService: Installer verified");
    return data;
  },

  // =====================================================
  // UNVERIFY INSTALLER (set is_verified = false)
  // =====================================================
  async unverifyInstaller(installerId) {
    console.log(
      "🔄 adminInstallerService: Unverifying installer:",
      installerId,
    );

    const { data, error } = await supabase
      .from("installers")
      .update({ is_verified: false })
      .eq("id", installerId)
      .select()
      .single();

    if (error) {
      console.error(
        "❌ adminInstallerService: Error unverifying installer:",
        error,
      );
      throw error;
    }

    console.log("✅ adminInstallerService: Installer unverified");
    return data;
  },

  // =====================================================
  // GET INSTALLER BY ID
  // =====================================================
  async getInstallerById(installerId) {
    console.log("🔄 adminInstallerService: Fetching installer:", installerId);

    const { data, error } = await supabase
      .from("installers")
      .select("*")
      .eq("id", installerId)
      .single();

    if (error) {
      console.error(
        "❌ adminInstallerService: Error fetching installer:",
        error,
      );
      throw error;
    }

    return data;
  },

  // =====================================================
  // GET COUNTS (for dashboard stats)
  // =====================================================
  async getInstallerCounts() {
    console.log("🔄 adminInstallerService: Fetching counts...");

    const [pending, verified] = await Promise.all([
      supabase
        .from("installers")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", false),
      supabase
        .from("installers")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true),
    ]);

    return {
      pending: pending.count || 0,
      verified: verified.count || 0,
    };
  },
};
