// services/campaignService.js

import { supabase } from "../../lib/supabase";

export const campaignService = {
  // ============================================================
  // INSTALLERS
  // ============================================================
  async getInstallers() {
    console.log("🔄 [campaignService] Fetching installers...");
    const { data, error } = await supabase.from("installers").select("*");
    if (error) {
      console.error("❌ [campaignService] Error fetching installers:", error);
      return [];
    }
    console.log("📦 [campaignService] Installers:", data?.length || 0);
    return data;
  },

  // ============================================================
  // DEALS
  // ============================================================
  async getDeals() {
    console.log("🔄 [campaignService] Fetching deals...");
    const { data, error } = await supabase.from("deals").select("*");
    if (error) {
      console.error("❌ [campaignService] Error fetching deals:", error);
      return [];
    }
    console.log("📦 [campaignService] Deals:", data?.length || 0);
    return data;
  },

  async getDealsWithInstallers() {
    console.log("🔄 [campaignService] Fetching deals with installers...");
    const { data, error } = await supabase.from("deals").select(`
        *,
        installer:installer_id (
          id,
          name,
          logo,
          rating,
          years_in_business,
          is_verified
        )
      `);
    if (error) {
      console.error(
        "❌ [campaignService] Error fetching deals with installers:",
        error,
      );
      return [];
    }
    console.log(
      "📦 [campaignService] Deals with installers:",
      data?.length || 0,
    );
    return data;
  },

  async getDealWithInstaller(dealId) {
    console.log("🔄 [campaignService] Fetching deal with installer:", dealId);

    const { data, error } = await supabase
      .from("deals")
      .select(
        `
        *,
        installer:installer_id (
          id,
          name,
          logo,
          rating,
          years_in_business,
          is_verified
        )
      `,
      )
      .eq("id", dealId)
      .single();

    if (error) {
      console.error("❌ [campaignService] Error fetching deal:", error);
      return null;
    }

    return data;
  },

  // ============================================================
  // USERS
  // ============================================================
  async getUsers() {
    console.log("🔄 [campaignService] Fetching users...");
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("❌ [campaignService] Error fetching users:", error);
      return [];
    }
    console.log("📦 [campaignService] Users:", data?.length || 0);
    return data;
  },

  async getUserById(userId) {
    console.log("🔄 [campaignService] getUserById called with:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("❌ [campaignService] Error fetching user:", error);
      throw error;
    }
    return data;
  },

  // ============================================================
  // CAMPAIGNS
  // ============================================================
  async getCampaigns() {
    console.log("🔄 [campaignService] Fetching campaigns...");
    const { data, error } = await supabase.from("campaigns").select("*");
    if (error) {
      console.error("❌ [campaignService] Error fetching campaigns:", error);
      return [];
    }
    console.log("📦 [campaignService] Campaigns:", data?.length || 0);
    return data;
  },

  async getCampaignWithDetails(campaignId) {
    console.log("🔄 [campaignService] Fetching campaign details:", campaignId);

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        deal:deal_type_id (
          id,
          title,
          description,
          image_url,
          regular_price,
          discounted_price,
          needed_neighbors,
          deadline_days,
          category,
          installer:installer_id (
            id,
            name,
            logo,
            rating,
            years_in_business,
            is_verified
          )
        ),
        organizer:organizer_id (
          id,
          name,
          phone,
          profile_picture
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
            phone,
            profile_picture
          )
        )
      `,
      )
      .eq("id", campaignId)
      .single();

    if (error) {
      console.error("❌ [campaignService] Error fetching campaign:", error);
      return null;
    }

    console.log("📦 [campaignService] Campaign with details found:", !!data);
    return data;
  },

  async getCampaignsForDeal(dealTypeId) {
    console.log(
      "🔄 [campaignService] getCampaignsForDeal called with:",
      dealTypeId,
    );

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        deal:deal_type_id (
          id,
          title,
          description,
          image_url,
          regular_price,
          discounted_price,
          needed_neighbors,
          deadline_days,
          category,
          installer:installer_id (
            id,
            name,
            logo,
            rating,
            years_in_business,
            is_verified
          )
        ),
        organizer:organizer_id (
          id,
          name,
          phone,
          profile_picture
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
            phone,
            profile_picture
          )
        )
      `,
      )
      .eq("deal_type_id", dealTypeId);

    if (error) {
      console.error(
        "❌ [campaignService] Error fetching campaigns for deal:",
        error,
      );
      return [];
    }

    console.log(
      "📦 [campaignService] getCampaignsForDeal result:",
      data?.length || 0,
    );
    return data || [];
  },

  async getCampaignsLedByUser(userId) {
    console.log(
      "🔄 [campaignService] getCampaignsLedByUser called with:",
      userId,
    );
    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
      *,
      deal:deal_type_id (
        title
      )
    `,
      )
      .eq("organizer_id", userId);
    if (error) {
      console.error(
        "❌ [campaignService] Error fetching campaigns led by user:",
        error,
      );
      return [];
    }
    console.log(
      "📦 [campaignService] Campaigns led by user:",
      data?.length || 0,
    );
    return data;
  },

  async getCampaignsJoinedByUser(userId) {
    console.log(
      "🔄 [campaignService] getCampaignsJoinedByUser called with:",
      userId,
    );
    const { data: memberships, error: membersError } = await supabase
      .from("campaign_members")
      .select("campaign_id")
      .eq("member_id", userId);

    if (membersError) {
      console.error(
        "❌ [campaignService] Error fetching memberships:",
        membersError,
      );
      return [];
    }
    if (!memberships || memberships.length === 0) {
      console.log(
        "⚠️ [campaignService] No memberships found for user:",
        userId,
      );
      return [];
    }

    const campaignIds = memberships.map((m) => m.campaign_id);
    console.log(
      "📦 [campaignService] Campaign IDs from memberships:",
      campaignIds,
    );

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
      *,
      deal:deal_type_id (
        title
      )
    `,
      )
      .in("id", campaignIds);
    if (error) {
      console.error("❌ [campaignService] Error fetching campaigns:", error);
      return [];
    }
    console.log(
      "📦 [campaignService] Campaigns joined by user:",
      data?.length || 0,
    );
    return data;
  },

  // ============================================================
  // CAMPAIGN MEMBERS
  // ============================================================
  async getCampaignMembers() {
    console.log("🔄 [campaignService] Fetching campaign members...");
    const { data, error } = await supabase.from("campaign_members").select("*");
    if (error) {
      console.error(
        "❌ [campaignService] Error fetching campaign members:",
        error,
      );
      return [];
    }
    console.log("📦 [campaignService] Campaign members:", data?.length || 0);
    return data;
  },

  async getCampaignMembersForCampaign(campaignId) {
    console.log(
      "🔄 [campaignService] getCampaignMembersForCampaign called with:",
      campaignId,
    );
    const { data, error } = await supabase
      .from("campaign_members")
      .select("*, user:member_id(*)")
      .eq("campaign_id", campaignId);
    if (error) {
      console.error(
        "❌ [campaignService] Error fetching campaign members:",
        error,
      );
      return [];
    }
    console.log(
      "📦 [campaignService] Campaign members for campaign:",
      data?.length || 0,
    );
    return data;
  },

  // ============================================================
  // ACTIONS
  // ============================================================
  async joinCampaign(campaignId, userId) {
    console.log("🔄 [campaignService] 📌 joinCampaign STARTED with:", {
      campaignId,
      userId,
      campaignIdType: typeof campaignId,
    });

    try {
      // Step 1: Check if already a member
      console.log(
        "🔄 [campaignService] Step 1: Checking if already a member...",
      );
      const { data: existing, error: checkError } = await supabase
        .from("campaign_members")
        .select("id")
        .eq("campaign_id", campaignId)
        .eq("member_id", userId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existing) {
        console.log(
          "⚠️ [campaignService] User already a member of this campaign",
        );
        return { success: true, alreadyMember: true };
      }
      console.log("✅ [campaignService] User is not a member yet");

      // Step 2: Add member
      console.log(
        "🔄 [campaignService] Step 2: Inserting member into campaign_members...",
      );
      const { error: memberError } = await supabase
        .from("campaign_members")
        .insert({
          campaign_id: campaignId,
          member_id: userId,
          status: "pending",
        });

      if (memberError) {
        console.error("❌ [campaignService] Member insert error:", memberError);
        throw memberError;
      }
      console.log("✅ [campaignService] Member inserted successfully");

      // Step 3: Increment count using RPC
      console.log(
        "🔄 [campaignService] Step 3: Calling increment_campaign_members RPC...",
      );
      console.log("🔄 [campaignService] RPC params:", {
        p_campaign_id: campaignId,
      });

      const { data: rpcData, error: funcError } = await supabase.rpc(
        "increment_campaign_members",
        { p_campaign_id: campaignId },
      );

      if (funcError) {
        console.error("❌ [campaignService] RPC function error:", funcError);
        console.error("❌ [campaignService] RPC error code:", funcError.code);
        console.error(
          "❌ [campaignService] RPC error message:",
          funcError.message,
        );
        console.error(
          "❌ [campaignService] RPC error details:",
          funcError.details,
        );
        throw funcError;
      }
      console.log("✅ [campaignService] RPC function called successfully");
      console.log("📦 [campaignService] RPC returned data:", rpcData);

      // Step 4: Verify the count was updated
      console.log(
        "🔄 [campaignService] Step 4: Verifying count after update...",
      );
      const { data: campaign, error: verifyError } = await supabase
        .from("campaigns")
        .select("id, current_members")
        .eq("id", campaignId)
        .single();

      if (verifyError) {
        console.error("❌ [campaignService] Verify error:", verifyError);
      } else if (campaign) {
        console.log(
          "📦 [campaignService] Current members after join:",
          campaign.current_members,
        );
      }

      console.log(
        "✅ [campaignService] 📌 joinCampaign COMPLETED SUCCESSFULLY",
      );
      return { success: true, campaign };
    } catch (error) {
      console.error("❌ [campaignService] ❌ joinCampaign FAILED:", error);
      throw error;
    }
  },

  async leaveCampaign(campaignId, userId) {
    console.log(
      "🔄 [campaignService] leaveCampaign called with:",
      campaignId,
      userId,
    );
    const { error: memberError } = await supabase
      .from("campaign_members")
      .delete()
      .eq("campaign_id", campaignId)
      .eq("member_id", userId);

    if (memberError) throw memberError;

    const { error: funcError } = await supabase.rpc(
      "decrement_campaign_members",
      { p_campaign_id: campaignId },
    );

    if (funcError) throw funcError;
    console.log("✅ [campaignService] leaveCampaign completed");
    return { success: true };
  },

  // ✅ FIXED: createCampaign - starts at 0, joinCampaign increments to 1
  async createCampaign(data) {
    console.log("🔄 [campaignService] createCampaign called with:", data);

    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .insert({
        deal_type_id: data.dealTypeId,
        organizer_id: data.organizerId,
        status: "active",
        current_members: 0, // ✅ Start at 0
        deadline: data.deadline,
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // ✅ This increments current_members from 0 to 1
    await this.joinCampaign(campaign.id, data.organizerId);

    // ✅ Return ONLY the campaign ID as a string
    return campaign.id;
  },

  async confirmGroup(campaignId) {
    console.log("🔄 [campaignService] confirmGroup called with:", campaignId);
    const { data, error } = await supabase
      .from("campaigns")
      .update({ status: "locked" })
      .eq("id", campaignId)
      .select();
    if (error) throw error;
    console.log("✅ [campaignService] confirmGroup completed");
    return data;
  },

  async markPaymentStatus(campaignId, memberId, status) {
    console.log(
      "🔄 [campaignService] markPaymentStatus called with:",
      campaignId,
      memberId,
      status,
    );
    const { data, error } = await supabase
      .from("campaign_members")
      .update({
        status,
        paid_at: status === "paid" ? new Date().toISOString() : null,
      })
      .eq("campaign_id", campaignId)
      .eq("member_id", memberId)
      .select();
    if (error) throw error;
    console.log("✅ [campaignService] markPaymentStatus completed");
    return data;
  },
};
