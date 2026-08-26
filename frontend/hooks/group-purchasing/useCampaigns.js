// app/hooks/features/group-purchasing/useCampaigns.js

import { useAppContext } from "../../context/AppContext";
import {
  calculateProgress,
  isCampaignFull,
} from "../../app/utils/group-purchasing";

export const useCampaigns = () => {
  const {
    campaigns,
    getCampaignsForDeal,
    getCampaignWithDetails,
    getCampaignsLedByUser: contextGetCampaignsLedByUser, // ✅ ADD THIS
    getCampaignsJoinedByUser: contextGetCampaignsJoinedByUser, // ✅ ADD THIS
    joinCampaign,
    leaveCampaign,
    confirmGroup,
    campaignMembers,
    markPaymentStatus,
    currentUser,
    createCampaign: contextCreateCampaign,
  } = useAppContext();

  const getCampaignsForDealWithDetails = async (dealId) => {
    console.log("🔄 getCampaignsForDealWithDetails called with:", dealId);
    const result = await getCampaignsForDeal(dealId);
    console.log("📦 getCampaignsForDeal result:", result);
    return result;
  };

  const getCampaignStatus = async (campaignId) => {
    console.log("🔄 getCampaignStatus called with:", campaignId);

    try {
      const campaign = await getCampaignWithDetails(campaignId);
      console.log("📦 Campaign data:", campaign);

      if (!campaign) {
        console.log("❌ Campaign not found:", campaignId);
        return null;
      }

      const target = campaign.deal?.needed_neighbors || 5;
      const currentMembers = campaign.current_members || 0;
      const isFull = isCampaignFull(currentMembers, target);
      const progress = calculateProgress(currentMembers, target);

      return {
        isFull,
        progress,
        target,
        currentMembers: currentMembers,
      };
    } catch (error) {
      console.error("❌ Error in getCampaignStatus:", error);
      return null;
    }
  };

  // ✅ NEW: Get campaigns where user is the organizer
  const getCampaignsLedByUser = async (userId) => {
    console.log("🔄 getCampaignsLedByUser called with:", userId);
    try {
      const result = await contextGetCampaignsLedByUser(userId);
      console.log(
        "📦 getCampaignsLedByUser result:",
        result?.length || 0,
        "campaigns",
      );
      return result || [];
    } catch (error) {
      console.error("❌ Error in getCampaignsLedByUser:", error);
      return [];
    }
  };

  // ✅ NEW: Get campaigns where user is a member
  const getCampaignsJoinedByUser = async (userId) => {
    console.log("🔄 getCampaignsJoinedByUser called with:", userId);
    try {
      const result = await contextGetCampaignsJoinedByUser(userId);
      console.log(
        "📦 getCampaignsJoinedByUser result:",
        result?.length || 0,
        "campaigns",
      );
      return result || [];
    } catch (error) {
      console.error("❌ Error in getCampaignsJoinedByUser:", error);
      return [];
    }
  };

  const joinCampaignAsCurrentUser = async (campaignId) => {
    if (!currentUser) {
      const error = new Error("No current user is available");
      console.error("❌ Cannot join campaign:", error.message);
      throw error;
    }
    console.log(
      "🔄 joinCampaignAsCurrentUser called with:",
      campaignId,
      currentUser.id,
    );

    try {
      console.log("🔄 joinCampaignAsCurrentUser: Calling joinCampaign...");
      const result = await joinCampaign(campaignId, currentUser.id);
      console.log("✅ joinCampaignAsCurrentUser: joinCampaign result:", result);
      console.log("✅ joinCampaignAsCurrentUser completed successfully");
      return result;
    } catch (error) {
      console.error("❌ Error in joinCampaignAsCurrentUser:", error);
      throw error;
    }
  };

  const leaveCampaignAsCurrentUser = async (campaignId) => {
    if (!currentUser) {
      console.log("No user logged in");
      return false;
    }
    await leaveCampaign(campaignId, currentUser.id);
    return true;
  };

  const createCampaign = async (campaignData) => {
    return await contextCreateCampaign(campaignData);
  };

  return {
    campaigns,
    campaignMembers,
    getCampaignsForDealWithDetails,
    getCampaignWithDetails,
    getCampaignStatus,
    getCampaignsLedByUser, // ✅ ADD THIS
    getCampaignsJoinedByUser, // ✅ ADD THIS
    joinCampaign: joinCampaignAsCurrentUser,
    leaveCampaign: leaveCampaignAsCurrentUser,
    confirmGroup,
    markPaymentStatus,
    currentUser,
    createCampaign,
  };
};
