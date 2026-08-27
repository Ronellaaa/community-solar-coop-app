// app/context/AppContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { campaignService } from "../services/group-purchasing/campaignService";
import { useAuth } from "./AuthContext";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [installers, setInstallers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignMembers, setCampaignMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load all data
  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading data from Supabase...");

      const [dealsData, campaignsData, installersData, usersData, membersData] =
        await Promise.all([
          campaignService.getDeals(),
          campaignService.getCampaigns(),
          campaignService.getInstallers(),
          campaignService.getUsers(),
          campaignService.getCampaignMembers(),
        ]);

      console.log("📦 Deals data:", dealsData);
      console.log("📦 Campaigns data:", campaignsData);
      console.log("📦 Installers:", installersData);
      console.log("📦 Users:", usersData);
      console.log("📦 Campaign Members:", membersData);

      setDeals(dealsData || []);
      setCampaigns(campaignsData || []);
      setInstallers(installersData || []);
      setUsers(usersData || []);
      setCampaignMembers(membersData || []);

      const authenticatedUser = usersData?.find(
        (profile) => profile.id === user?.id,
      );
      setCurrentUser(authenticatedUser || null);

      console.log("✅ Data loaded successfully!");
    } catch (err) {
      console.error("❌ Error loading data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUser(null);
    loadAllData();
  }, [user?.id]);

  // ==================== HELPER FUNCTIONS ====================

  const getCampaignWithDetails = async (campaignId) => {
    console.log(
      "🔄 AppContext: getCampaignWithDetails called with:",
      campaignId,
    );
    const result = await campaignService.getCampaignWithDetails(campaignId);
    console.log("📦 AppContext: getCampaignWithDetails result:", result);

    if (result) {
      console.log("📦 Campaign keys:", Object.keys(result));
      console.log("📦 Deal:", result.deal);
      console.log("📦 current_members:", result.current_members);
      console.log("📦 organizer_id:", result.organizer_id);
    }

    return result;
  };

  const getCampaignsForDeal = async (dealTypeId) => {
    console.log("🔄 AppContext: getCampaignsForDeal called with:", dealTypeId);
    const result = await campaignService.getCampaignsForDeal(dealTypeId);
    console.log("📦 AppContext: getCampaignsForDeal result:", result);
    return result;
  };

  const getCampaignsLedByUser = async (userId) => {
    console.log("🔄 AppContext: getCampaignsLedByUser called with:", userId);
    const result = await campaignService.getCampaignsLedByUser(userId);
    console.log("📦 AppContext: getCampaignsLedByUser result:", result);
    return result;
  };

  const getCampaignsJoinedByUser = async (userId) => {
    console.log("🔄 AppContext: getCampaignsJoinedByUser called with:", userId);
    const result = await campaignService.getCampaignsJoinedByUser(userId);
    console.log("📦 AppContext: getCampaignsJoinedByUser result:", result);
    return result;
  };

  // ==================== ACTIONS ====================

  const joinCampaign = async (campaignId, userId) => {
    console.log("🔄 AppContext: joinCampaign called with:", campaignId, userId);
    const result = await campaignService.joinCampaign(campaignId, userId);
    await loadAllData();
    return result;
  };

  const leaveCampaign = async (campaignId, userId) => {
    console.log(
      "🔄 AppContext: leaveCampaign called with:",
      campaignId,
      userId,
    );
    await campaignService.leaveCampaign(campaignId, userId);
    await loadAllData();
  };

  // ✅ NEW: Delete campaign (for organizer when only member)
  const deleteCampaign = async (campaignId, userId) => {
    console.log(
      "🔄 AppContext: deleteCampaign called with:",
      campaignId,
      userId,
    );
    try {
      const result = await campaignService.deleteCampaign(campaignId, userId);
      await loadAllData();
      return result;
    } catch (error) {
      console.error("❌ Error deleting campaign:", error);
      throw error;
    }
  };

  const confirmGroup = async (campaignId) => {
    console.log("🔄 AppContext: confirmGroup called with:", campaignId);
    await campaignService.confirmGroup(campaignId);
    await loadAllData();
  };

  const markPaymentStatus = async (campaignId, memberId, status) => {
    console.log(
      "🔄 AppContext: markPaymentStatus called with:",
      campaignId,
      memberId,
      status,
    );
    await campaignService.markPaymentStatus(campaignId, memberId, status);
    await loadAllData();
  };

  // ============================================================
  // CREATE CAMPAIGN
  // ============================================================
  const createCampaign = async (data) => {
    console.log("🔄 AppContext: createCampaign called with:", data);
    try {
      const result = await campaignService.createCampaign(data);
      await loadAllData();
      return result;
    } catch (error) {
      console.error("❌ Error creating campaign:", error);
      return { success: false, error: error.message };
    }
  };

  // ==================== CONTEXT VALUE ====================

  const value = {
    installers,
    deals,
    users,
    campaigns,
    campaignMembers,
    currentUser,
    setCurrentUser,
    loading,
    error,
    getCampaignWithDetails,
    getCampaignsForDeal,
    getCampaignsLedByUser,
    getCampaignsJoinedByUser,
    joinCampaign,
    leaveCampaign,
    deleteCampaign, // ✅ ADD THIS
    confirmGroup,
    markPaymentStatus,
    createCampaign,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
