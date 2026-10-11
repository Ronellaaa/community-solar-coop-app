// frontend/services/group-purchasing/installerService.js

import { supabase } from "../../lib/supabase";

export const installerService = {
  // =====================================================
  // GET INSTALLER BY USER ID
  // =====================================================
  async getInstallerByUserId(userId) {
    console.log("🔄 installerService: Fetching installer for user:", userId);

    const { data, error } = await supabase
      .from("installers")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ installerService: Error:", error);
      return null;
    }

    return data;
  },

  // =====================================================
  // CHECK IF INSTALLER IS VERIFIED
  // =====================================================
  async isInstallerVerified(userId) {
    const installer = await this.getInstallerByUserId(userId);
    return installer?.is_verified === true;
  },

  // =====================================================
  // GET BANK DETAILS
  // =====================================================
  async getBankDetails(installerId) {
    console.log("🔄 installerService: Fetching bank details:", installerId);

    const { data, error } = await supabase
      .from("installers")
      .select(
        "id, bank_name, bank_account_number, bank_branch, account_holder_name",
      )
      .eq("id", installerId)
      .maybeSingle();

    if (error) {
      console.error("❌ installerService: Error fetching bank details:", error);
      return null;
    }

    return data;
  },

  // =====================================================
  // UPDATE BANK DETAILS
  // =====================================================
  async updateBankDetails(installerId, bankData) {
    console.log("🔄 installerService: Updating bank details:", installerId);

    const { data, error } = await supabase
      .from("installers")
      .update({
        bank_name: bankData.bankName || "",
        bank_account_number: bankData.bankAccountNumber || "",
        bank_branch: bankData.bankBranch || "",
        account_holder_name: bankData.accountHolderName || "",
      })
      .eq("id", installerId)
      .select()
      .single();

    if (error) {
      console.error("❌ installerService: Error updating bank details:", error);
      throw error;
    }

    console.log("✅ installerService: Bank details updated");
    return data;
  },

  // =====================================================
  // CREATE A NEW DEAL
  // =====================================================
  async createDeal(dealData) {
    console.log("🔄 installerService: Creating deal:", dealData);

    const { data, error } = await supabase
      .from("deals")
      .insert([
        {
          installer_id: dealData.installerId,
          title: dealData.title,
          description: dealData.description,
          image_url: dealData.imageUrl,
          regular_price: dealData.regularPrice,
          discounted_price: dealData.discountedPrice,
          needed_neighbors: dealData.neededNeighbors,
          deadline_days: dealData.deadlineDays,
          category: dealData.category,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ installerService: Error creating deal:", error);
      throw error;
    }

    console.log("✅ installerService: Deal created:", data.id);
    return data;
  },

  // =====================================================
  // GET DEALS BY INSTALLER
  // =====================================================
  async getDealsByInstaller(installerId) {
    console.log("🔄 installerService: Fetching deals for:", installerId);

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("installer_id", installerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ installerService: Error:", error);
      throw error;
    }

    return data || [];
  },

  // =====================================================
  // GET CAMPAIGNS FOR INSTALLER'S DEALS
  // =====================================================
  async getCampaignsForInstaller(installerId) {
    console.log(
      "🔄 installerService: Fetching campaigns for installer:",
      installerId,
    );

    const { data: deals, error: dealsError } = await supabase
      .from("deals")
      .select("id")
      .eq("installer_id", installerId);

    if (dealsError) throw dealsError;
    if (!deals || deals.length === 0) return [];

    const dealIds = deals.map((d) => d.id);

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        deal:deal_type_id (
          id,
          title,
          image_url,
          needed_neighbors,
          discounted_price,
          regular_price
        ),
        organizer:organizer_id (
          id,
          name,
          profile_picture,
          phone
        ),
        members:campaign_members (
          id,
          campaign_id,
          member_id,
          status,
          joined_at,
          paid_at,
          user:member_id (
            id,
            name,
            profile_picture
          )
        )
      `,
      )
      .in("deal_type_id", dealIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ installerService: Error fetching campaigns:", error);
      throw error;
    }

    console.log("📦 installerService: Campaigns found:", data?.length || 0);
    return data || [];
  },

  // =====================================================
  // GET LOCKED CAMPAIGNS ONLY
  // =====================================================
  async getLockedCampaignsForInstaller(installerId) {
    console.log("🔄 installerService: Fetching locked campaigns...");

    const { data: deals } = await supabase
      .from("deals")
      .select("id")
      .eq("installer_id", installerId);

    if (!deals || deals.length === 0) return [];

    const dealIds = deals.map((d) => d.id);

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        deal:deal_type_id (
          id,
          title,
          image_url,
          needed_neighbors,
          discounted_price,
          regular_price
        ),
        organizer:organizer_id (
          id,
          name,
          profile_picture,
          phone
        ),
        members:campaign_members (
          id,
          campaign_id,
          member_id,
          status,
          joined_at,
          paid_at,
          user:member_id (
            id,
            name,
            profile_picture
          )
        )
      `,
      )
      .in("deal_type_id", dealIds)
      .eq("status", "locked")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ installerService: Error:", error);
      throw error;
    }

    console.log("📦 installerService: Locked campaigns:", data?.length || 0);
    return data || [];
  },

  // =====================================================
  // GET INSTALLER STATS
  // =====================================================
  async getInstallerStats(installerId) {
    console.log("🔄 installerService: Fetching stats...");

    const { data: deals } = await supabase
      .from("deals")
      .select("id")
      .eq("installer_id", installerId);

    if (!deals || deals.length === 0) {
      return {
        activeDeals: 0,
        totalCampaigns: 0,
        lockedCampaigns: 0,
        paymentConfirmedCampaigns: 0,
        awaitingApprovalCampaigns: 0, // ✅ NEW
      };
    }

    const dealIds = deals.map((d) => d.id);

    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("id, status")
      .in("deal_type_id", dealIds);

    const totalCampaigns = campaigns?.length || 0;
    const lockedCampaigns =
      campaigns?.filter((c) => c.status === "locked").length || 0;
    const paymentConfirmedCampaigns =
      campaigns?.filter((c) => c.status === "payment_confirmed").length || 0;
    const awaitingApprovalCampaigns =
      campaigns?.filter((c) => c.status === "awaiting_approval").length || 0; // ✅ NEW

    return {
      activeDeals: deals.length,
      totalCampaigns,
      lockedCampaigns,
      paymentConfirmedCampaigns,
      awaitingApprovalCampaigns, // ✅ NEW
    };
  },

  // =====================================================
  // CONFIRM PAYMENT RECEIVED
  // =====================================================
  async confirmPaymentReceived(campaignId) {
    console.log(
      "🔄 installerService: Confirming payment for campaign:",
      campaignId,
    );

    const { data, error } = await supabase
      .from("campaigns")
      .update({ status: "payment_confirmed" })
      .eq("id", campaignId)
      .select()
      .single();

    if (error) {
      console.error("❌ installerService: Error confirming payment:", error);
      throw error;
    }

    console.log("✅ installerService: Payment confirmed");
    return data;
  },

  // =====================================================
  // ✅ MARK INSTALLATION COMPLETED
  // Installer action — moves status to "awaiting_approval"
  // (Organizer will need to approve before it becomes "completed")
  // =====================================================
  async markInstallationCompleted(campaignId) {
    console.log(
      "🔄 installerService: Marking installation complete:",
      campaignId,
    );

    const { data, error } = await supabase
      .from("campaigns")
      .update({ status: "awaiting_approval" }) // ✅ CHANGED
      .eq("id", campaignId)
      .select()
      .single();

    if (error) {
      console.error("❌ installerService: Error completing:", error);
      throw error;
    }

    console.log("✅ installerService: Installation marked, awaiting approval");
    return data;
  },

  // =====================================================
  // GET CAMPAIGNS BY STATUS
  // =====================================================
  async getCampaignsByStatus(installerId, status) {
    console.log(
      `🔄 installerService: Fetching ${status} campaigns for installer:`,
      installerId,
    );

    const { data: deals } = await supabase
      .from("deals")
      .select("id")
      .eq("installer_id", installerId);

    if (!deals || deals.length === 0) return [];

    const dealIds = deals.map((d) => d.id);

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        deal:deal_type_id (
          id,
          title,
          image_url,
          needed_neighbors,
          discounted_price,
          regular_price
        ),
        organizer:organizer_id (
          id,
          name,
          profile_picture,
          phone
        ),
        members:campaign_members (
          id,
          campaign_id,
          member_id,
          status,
          joined_at,
          paid_at,
          user:member_id (
            id,
            name,
            profile_picture
          )
        )
      `,
      )
      .in("deal_type_id", dealIds)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ installerService: Error:", error);
      throw error;
    }

    console.log(`📦 installerService: ${status} campaigns:`, data?.length || 0);
    return data || [];
  },
};
