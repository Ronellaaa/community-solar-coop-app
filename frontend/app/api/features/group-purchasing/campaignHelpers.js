// app/api/features/group-purchasing/campaignHelpers.js

import { supabase } from "../../../../lib/supabase";

// ============================================================
// CAMPAIGN HELPERS (Supabase Version)
// ============================================================

/**
 * Get campaign with all details (deal, installer, organizer, members)
 */
export const getCampaignWithDetails = async (campaignId) => {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      deal:deal_type_id(*),
      organizer:organizer_id(*),
      members:campaign_members(
        *,
        user:member_id(*)
      )
    `,
    )
    .eq("id", campaignId)
    .single();

  if (error) {
    console.error("Error fetching campaign:", error);
    return null;
  }

  return data;
};

/**
 * Get all campaigns for a specific deal type
 */
export const getCampaignsForDeal = async (dealTypeId) => {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      deal:deal_type_id(*),
      organizer:organizer_id(*),
      members:campaign_members(
        *,
        user:member_id(*)
      )
    `,
    )
    .eq("deal_type_id", dealTypeId);

  if (error) {
    console.error("Error fetching campaigns for deal:", error);
    return [];
  }

  return data || [];
};

/**
 * Get all campaigns led by a specific user
 */
export const getCampaignsLedByUser = async (userId) => {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      deal:deal_type_id(*),
      organizer:organizer_id(*),
      members:campaign_members(
        *,
        user:member_id(*)
      )
    `,
    )
    .eq("organizer_id", userId);

  if (error) {
    console.error("Error fetching campaigns led by user:", error);
    return [];
  }

  return data || [];
};

/**
 * Get all campaigns a user has joined
 */
export const getCampaignsJoinedByUser = async (userId) => {
  // First get all campaign IDs the user has joined
  const { data: memberships, error: membersError } = await supabase
    .from("campaign_members")
    .select("campaign_id")
    .eq("member_id", userId);

  if (membersError) {
    console.error("Error fetching user memberships:", membersError);
    return [];
  }

  if (!memberships || memberships.length === 0) {
    return [];
  }

  const campaignIds = memberships.map((m) => m.campaign_id);

  // Then get all those campaigns with details
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      deal:deal_type_id(*),
      organizer:organizer_id(*),
      members:campaign_members(
        *,
        user:member_id(*)
      )
    `,
    )
    .in("id", campaignIds);

  if (error) {
    console.error("Error fetching joined campaigns:", error);
    return [];
  }

  return data || [];
};

/**
 * Get a deal type with its installer
 */
export const getDealWithInstaller = async (dealTypeId) => {
  const { data, error } = await supabase
    .from("deals")
    .select(
      `
      *,
      installer:installer_id(*)
    `,
    )
    .eq("id", dealTypeId)
    .single();

  if (error) {
    console.error("Error fetching deal with installer:", error);
    return null;
  }

  return data;
};

/**
 * Join a campaign
 */
export const joinCampaign = async (campaignId, userId) => {
  try {
    // 1. Add member to campaign_members
    const { error: memberError } = await supabase
      .from("campaign_members")
      .insert({
        campaign_id: campaignId,
        member_id: userId,
        status: "pending",
      });

    if (memberError) throw memberError;

    // 2. Increment current_members count using the database function
    const { error: funcError } = await supabase.rpc(
      "increment_campaign_members",
      { p_campaign_id: campaignId },
    );

    if (funcError) throw funcError;

    return { success: true };
  } catch (error) {
    console.error("Error joining campaign:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Leave a campaign
 */
export const leaveCampaign = async (campaignId, userId) => {
  try {
    // 1. Remove member from campaign_members
    const { error: memberError } = await supabase
      .from("campaign_members")
      .delete()
      .eq("campaign_id", campaignId)
      .eq("member_id", userId);

    if (memberError) throw memberError;

    // 2. Decrement current_members count
    const { error: funcError } = await supabase.rpc(
      "decrement_campaign_members",
      { p_campaign_id: campaignId },
    );

    if (funcError) throw funcError;

    return { success: true };
  } catch (error) {
    console.error("Error leaving campaign:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Create a campaign
 */
export const createCampaign = async (data) => {
  try {
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        deal_type_id: data.dealTypeId,
        organizer_id: data.organizerId,
        status: "active",
        current_members: 1,
        deadline: data.deadline,
      })
      .select()
      .single();

    if (error) throw error;

    // Add organizer as first member
    await joinCampaign(campaign.id, data.organizerId);

    return { id: campaign.id, success: true };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: error.message };
  }
};
